const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const BINANCE_BASE_URL = 'https://demo-fapi.binance.com';
const BINANCE_RECV_WINDOW = process.env.BINANCE_RECV_WINDOW || 5000;

/**
 * Gets Binance server time to calculate offset
 */
async function getServerTime() {
    try {
        const response = await axios.get(`${BINANCE_BASE_URL}/fapi/v1/time`);
        return response.data.serverTime;
    } catch (err) {
        console.error('[BinanceService] Server time error:', err.message);
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
 * Executed Binance request with auto-retry on 1021 (Timestamp)
 */
async function binanceRequest(method, endpoint, params = {}, credentials, proxy = null, attempt = 0) {
    const { apiKey, apiSecret } = credentials;
    const serverTime = await getServerTime();
    const timestamp = serverTime;

    const queryParams = {
        ...params,
        timestamp,
        recvWindow: BINANCE_RECV_WINDOW
    };

    const queryString = Object.keys(queryParams)
        .map(key => `${key}=${queryParams[key]}`)
        .join('&');

    const signature = generateSignature(queryString, apiSecret);
    const url = `${BINANCE_BASE_URL}${endpoint}?${queryString}&signature=${signature}`;

    const config = {
        method,
        url,
        headers: {
            'X-MBX-APIKEY': apiKey,
            'Content-Type': 'application/json'
        },
        timeout: 10000
    };

    if (proxy) {
        config.proxy = {
            host: proxy.ip,
            port: proxy.port,
            auth: proxy.username ? { username: proxy.username, password: proxy.password } : undefined
        };
    }

    try {
        const response = await axios(config);
        return response.data;
    } catch (err) {
        const data = err.response?.data;
        const code = data?.code;

        // Attempt retry on timestamp error (-1021)
        if (code === -1021 && attempt < 1) {
            console.warn('[BinanceService] Timestamp error -1021. Retrying with fresh sync...');
            return binanceRequest(method, endpoint, params, credentials, proxy, attempt + 1);
        }

        console.error(`[BinanceService] Request error ${endpoint}:`, data || err.message);
        throw new Error(data?.msg || err.message);
    }
}

module.exports = {
    binanceRequest,
    getServerTime
};
