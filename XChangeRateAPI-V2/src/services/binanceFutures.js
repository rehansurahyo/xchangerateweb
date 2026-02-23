const axios = require('axios');
const crypto = require('crypto');

const BINANCE_FUTURES_URL = 'https://fapi.binance.com';

/**
 * Gets Binance server time to calculate offset
 */
async function getServerTime() {
    try {
        const response = await axios.get(`${BINANCE_FUTURES_URL}/fapi/v1/time`, { timeout: 5000 });
        return response.data.serverTime;
    } catch (err) {
        console.error('[BinanceFutures] Server time error:', err.message);
        return Date.now();
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
 * Sends a signed request to Binance Futures
 */
async function sendSignedRequest(method, path, params = {}, apiKey, apiSecret, recvWindow = 10000) {
    try {
        const serverTime = await getServerTime();
        const timestamp = serverTime;

        const queryParams = {
            ...params,
            timestamp,
            recvWindow
        };

        const queryString = Object.keys(queryParams)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
            .join('&');

        const signature = generateSignature(queryString, apiSecret);
        const url = `${BINANCE_FUTURES_URL}${path}?${queryString}&signature=${signature}`;

        const config = {
            method,
            url,
            headers: {
                'X-MBX-APIKEY': apiKey,
                'Content-Type': 'application/json'
            },
            timeout: 15000
        };

        console.log(`[BinanceFutures] Request: ${method} ${path} (maskedKey: ${apiKey.slice(0, 4)}...${apiKey.slice(-4)})`);
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
        } else if (status === 418 || status === 429) {
            friendlyMessage = "Binance rate limit hit or IP banned. Reduce request frequency.";
        } else if (friendlyMessage.toLowerCase().includes("ip")) {
            friendlyMessage = "Binance API key IP restriction. Add server IP or remove restriction.";
        }

        throw {
            success: false,
            code: code || 'XCR_ERROR',
            message: friendlyMessage,
            status: status || 500,
            original: data
        };
    }
}

module.exports = {
    sendSignedRequest,
    getServerTime
};
