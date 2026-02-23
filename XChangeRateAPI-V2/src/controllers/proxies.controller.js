const { fetchProxies, validateProxy } = require('../services/webshare');

/**
 * GET /api/proxies/list
 * Returns list of proxies from Webshare
 */
async function listProxies(req, res) {
    try {
        const proxies = await fetchProxies();
        return res.json({
            success: true,
            count: proxies.length,
            proxies: proxies.map(p => ({ ip: p.ip, port: p.port })) // Hide credentials in list
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

/**
 * POST /api/proxies/validate
 * Tests proxy connectivity
 */
async function validate(req, res) {
    const { ip, port } = req.body;

    if (!ip || !port) {
        return res.status(400).json({
            success: false,
            error: 'IP and port are required.'
        });
    }

    try {
        const result = await validateProxy(ip, port);
        return res.json({
            success: true,
            ...result
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = {
    listProxies,
    validate
};
