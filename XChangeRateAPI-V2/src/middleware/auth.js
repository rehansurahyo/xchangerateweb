const supabase = require('../config/supabase');

/**
 * Validates the Bearer token from headers using Supabase Auth
 */
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.get ? req.headers.get('authorization') : req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required. Missing Bearer token.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token.'
            });
        }

        // Attach user info to request
        req.user = {
            id: user.id,
            email: user.email,
        };

        next();
    } catch (err) {
        console.error('[AuthMiddleware] Error:', err.message);
        return res.status(500).json({
            success: false,
            error: 'Internal authentication server error.'
        });
    }
}

module.exports = authMiddleware;
