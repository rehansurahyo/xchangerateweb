const supabase = require('../config/supabase');

/**
 * GET /api/dashboard/summary
 * Returns aggregated dashboard data
 */
async function getSummary(req, res) {
    try {
        const email = req.user.email;

        // Fetch all data in parallel
        const [
            sessionsResult,
            tradesResult,
            settingsResult,
            billingResult
        ] = await Promise.all([
            supabase.from('sessions_log').select('*').eq('email', email).limit(5).order('created_at', { ascending: false }),
            supabase.from('trades_log').select('*').eq('email', email).limit(10).order('created_at', { ascending: false }),
            supabase.from('settings').select('*').eq('email', email).order('updated_at', { ascending: false }).limit(1),
            supabase.from('billing').select('*').eq('email', email)
        ]);

        if (sessionsResult.error) throw sessionsResult.error;
        if (tradesResult.error) throw tradesResult.error;

        // Compute live status
        const activeSessionsCount = sessionsResult.data.filter(s => s.status === 'Active').length;
        const lastTrade = tradesResult.data[0];

        res.json({
            success: true,
            data: {
                sessions: sessionsResult.data,
                trades: tradesResult.data,
                settings: settingsResult.data[0] || {},
                billing: billingResult.data || [],
                liveStatus: {
                    activeSessions: activeSessionsCount,
                    totalProfit: tradesResult.data.reduce((acc, t) => acc + (t.pnl || 0), 0),
                    lastUpdate: new Date().toISOString()
                }
            }
        });
    } catch (err) {
        console.error('[DashboardController] Summary error:', err.message);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

/**
 * GET /api/dashboard/live
 * Returns lightweight live status data
 */
async function getLiveStatus(req, res) {
    try {
        const email = req.user.email;

        const { data: sessions, error } = await supabase
            .from('api_credentials')
            .select('status, created_at')
            .eq('email', email);

        if (error) throw error;

        const { data: latestTrade, error: tradeError } = await supabase
            .from('trades_log')
            .select('created_at')
            .eq('email', email)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        res.json({
            success: true,
            activeCount: sessions.filter(s => s.status === 'Active').length,
            lastTradeTime: latestTrade?.created_at || null,
            serverTime: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

module.exports = {
    getSummary,
    getLiveStatus
};
