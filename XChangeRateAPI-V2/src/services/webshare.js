const axios = require('axios');
require('dotenv').config();

const WEBSHARE_API_TOKEN = process.env.WEBSHARE_API_TOKEN;

/**
 * Fetches the list of proxies from Webshare
 * @returns {Promise<{ip: string, port: number}[]>}
 */
async function fetchProxies() {
    if (!WEBSHARE_API_TOKEN) {
        console.warn('[WebshareService] Missing WEBSHARE_API_TOKEN. Returning empty list.');
        return [];
    }

    try {
        const response = await axios.get('https://proxy.webshare.io/api/v2/proxy/list/?page=1&page_size=100', {
            headers: {
                'Authorization': `Token ${WEBSHARE_API_TOKEN}`
            }
        });

        const proxies = response.data.results.map(p => ({
            ip: p.proxy_address,
            port: p.port,
            username: p.username,
            password: p.password
        }));

        return proxies;
    } catch (err) {
        console.error('[WebshareService] Fetch error:', err.response?.data || err.message);
        throw new Error('Failed to fetch proxy list from Webshare.');
    }
}

/**
 * Validates a proxy by pinging Binance API
 */
async function validateProxy(ip, port, username, password) {
    const startTime = Date.now();
    const proxyUrl = username ? `http://${username}:${password}@${ip}:${port}` : `http://${ip}:${port}`;

    try {
        const response = await axios.get('https://fapi.binance.com/fapi/v1/time', {
            proxy: {
                host: ip,
                port: port,
                auth: username ? { username, password } : undefined
            },
            timeout: 5000
        });

        return {
            valid: response.status === 200,
            latencyMs: Date.now() - startTime
        };
    } catch (err) {
        return {
            valid: false,
            latencyMs: Date.now() - startTime,
            error: err.message
        };
    }
}

module.exports = {
    fetchProxies,
    validateProxy
};
