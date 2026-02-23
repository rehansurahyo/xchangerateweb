const supabase = require('../config/supabase');

/**
 * GET /api/me
 * Returns authenticated user and their profile data
 */
async function getMe(req, res) {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found.'
            });
        }

        return res.json({
            success: true,
            user: req.user,
            profile
        });
    } catch (err) {
        console.error('[MeController] Error:', err.message);
        return res.status(500).json({
            success: false,
            error: 'Internal server error fetching profile.'
        });
    }
}

module.exports = {
    getMe
};
