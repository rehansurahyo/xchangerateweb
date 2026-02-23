const axios = require('axios');
const crypto = require('crypto');

const BINANCE_FUTURES_URL = process.env.BINANCE_FUTURES_URL || 'https://fapi.binance.com';
const BINANCE_TESTNET_URL = 'https://testnet.binancefuture.com';

/**
 * Gets Binance server time and computes offset
 */
async function getServerTimeOffset(baseUrl = BINANCE_FUTURES_URL) {
    try {
        const start = Date.now();
        const response = await axios.get(`${baseUrl}/fapi/v1/time`, { timeout: 5000 });
        const end = Date.now();
        const serverTime = response.data.serverTime;
        // Use mid-point of request for better accuracy
        const timeOffset = serverTime - Math.floor((start + end) / 2);
        return timeOffset;
    } catch (err) {
        console.error('[BinanceFutures] Server time error:', err.message);
        return 0;
    }
}

/**
 * Generates HMAC SHA256 signature
 */
function generateSignature(queryString, apiSecret) {
    return crypto
        .createHmac('sha256', apiSecret)
        .update(queryString)
        .digest('hex');
}

/**
 * Sends a signed request to Binance Futures with time sync
 */
async function sendSignedRequest(method, path, params = {}, apiKey, apiSecret, recvWindow = 10000, isTestnet = false) {
    try {
        const baseUrl = isTestnet ? BINANCE_TESTNET_URL : BINANCE_FUTURES_URL;
        const timeOffset = await getServerTimeOffset(baseUrl);
        const timestamp = Date.now() + timeOffset;

        const queryParams = {
            ...params,
            timestamp,
            recvWindow
        };

        const queryString = Object.keys(queryParams)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
            .join('&');

        const signature = generateSignature(queryString, apiSecret);
        const url = `${baseUrl}${path}?${queryString}&signature=${signature}`;

        const config = {
            method,
            url,
            headers: {
                'X-MBX-APIKEY': apiKey,
                'Content-Type': 'application/json'
            },
            timeout: 15000
        };

        // Safe logging: mask keys
        const maskedKey = apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : 'MISSING';
        console.log(`[BinanceFutures] Request: ${method} ${path} (apiKey: ${maskedKey}, offset: ${timeOffset}ms)`);

        const response = await axios(config);
        return response.data;
    } catch (err) {
        const data = err.response?.data;
        const status = err.response?.status;

        console.error(`[BinanceFutures] Error ${path}:`, data || err.message);

        // Robust Error Mapping
        let friendlyMessage = data?.msg || err.message;
        const code = data?.code;

        if (code === -1021) {
            friendlyMessage = "Binance timestamp out of sync. Server time synced automatically; retry.";
        } else if (code === -2015 || code === -2014) {
            friendlyMessage = "Invalid API key or permissions (Ensure Futures is enabled).";
        } else if (code === -2019) {
            friendlyMessage = "Insufficient margin balance.";
        } else if (status === 418 || status === 429) {
            friendlyMessage = "Binance rate limit hit or IP banned. Reduce request frequency.";
        } else if (friendlyMessage.toLowerCase().includes("ip")) {
            friendlyMessage = "Binance API key IP restriction. Add server IP or remove restriction.";
        }

        throw {
            success: false,
            code: code || 'XCR_ERROR',
            message: friendlyMessage,
            status: status || 400,
            original: data
        };
    }
}

module.exports = {
    sendSignedRequest,
    getServerTimeOffset
};
