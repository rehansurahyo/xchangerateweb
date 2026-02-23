const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Import Controllers
const meController = require('../controllers/me.controller');
const sessionsController = require('../controllers/sessions.controller');
const proxiesController = require('../controllers/proxies.controller');
const dashboardController = require('../controllers/dashboard.controller');
const binanceController = require('../controllers/binance.controller');

// 1. Health & Debug
router.get('/health', (req, res) => res.json({ success: true, message: 'ok' }));
router.get('/routes', (req, res) => {
    const routes = [];
    router.stack.forEach(middleware => {
        if (middleware.route) {
            const path = middleware.route.path;
            const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
            routes.push({ path, methods });
        }
    });
    res.json({ success: true, routes });
});

// 2. ME (Profile)
router.get('/me', authMiddleware, meController.getMe);

// 3. PROXIES
router.get('/proxies/list', authMiddleware, proxiesController.listProxies);
router.post('/proxies/validate', authMiddleware, proxiesController.validate);

// 4. SESSIONS
router.post('/sessions', authMiddleware, sessionsController.createSession);
router.get('/sessions', authMiddleware, sessionsController.listSessions);

// 5. DASHBOARD
router.get('/dashboard/summary', authMiddleware, dashboardController.getSummary);
router.get('/dashboard/live', authMiddleware, dashboardController.getLiveStatus);

// 6. BINANCE (FUTURES)
router.post('/binance/balance', binanceController.getBalance);
router.post('/binance/account', binanceController.getAccount);
router.post('/binance/position-risk', binanceController.getPositionRisk);
router.post('/binance/close-positions', binanceController.closePositions);

module.exports = router;
