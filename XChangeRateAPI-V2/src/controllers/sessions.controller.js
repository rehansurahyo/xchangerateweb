const supabase = require('../config/supabase');
const { encrypt } = require('../services/encryption');
const { fetchProxies } = require('../services/webshare');

/**
 * POST /api/sessions
 * Creates a new trading session
 */
async function createSession(req, res) {
    const { name, exchange, api_key, api_secret, target_percentage, status } = req.body;

    if (!name || !api_key || !api_secret) {
        return res.status(400).json({
            success: false,
            error: 'Name, API Key, and API Secret are required.'
        });
    }

    try {
        // 1. Encrypt credentials
        const encryptedKey = encrypt(api_key);
        const encryptedSecret = encrypt(api_secret);

        // 2. Fetch proxies automatically
        const allProxies = await fetchProxies();
        const full_ips = allProxies.map(p => ({ ip: p.ip, port: p.port }));
        const ips = allProxies.slice(0, 8).map(p => p.ip);

        // 3. Save to api_credentials
        const { data: credential, error: credError } = await supabase
            .from('api_credentials')
            .insert({
                user_id: req.user.id,
                email: req.user.email,
                name,
                exchange: exchange || 'Binance',
                encrypted_api_key: encryptedKey,
                encrypted_api_secret: encryptedSecret,
                api_key_masked: `****${api_key.slice(-4)}`,
                proxies: ips,
                full_ips: full_ips,
                target_percent: target_percentage || 100,
                status: status || 'Paused'
            })
            .select()
            .single();

        if (credError) throw credError;

        // 4. Create initial sessions_log entry
        await supabase
            .from('sessions_log')
            .insert({
                user_id: req.user.id,
                email: req.user.email,
                session_id: credential.id,
                name: name,
                status: credential.status,
                trades: []
            });

        return res.json({
            success: true,
            session: credential
        });
    } catch (err) {
        console.error('[SessionsController] Create error:', err.message);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

/**
 * GET /api/sessions
 * Returns user's sessions
 */
async function listSessions(req, res) {
    try {
        const { data, error } = await supabase
            .from('api_credentials')
            .select('*')
            .eq('email', req.user.email)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Ensure keys are never returned
        const maskedData = data.map(item => {
            const { encrypted_api_key, encrypted_api_secret, ...rest } = item;
            return rest;
        });

        return res.json({
            success: true,
            data: maskedData
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = {
    createSession,
    listSessions
};
