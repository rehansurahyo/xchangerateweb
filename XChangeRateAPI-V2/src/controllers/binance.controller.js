const { sendSignedRequest } = require('../functions/binanceFutures');

/**
 * Extracts and validates credentials and params from request
 */
function getRequestData(req) {
    const { apiKey, apiSecret, recvWindow, isTestnet, ...params } = req.body;

    // Fallback: If headers are used (from Next.js proxy injection)
    const finalKey = apiKey || req.headers['x-mbx-apikey'];
    const finalSecret = apiSecret || req.headers['x-mbx-secret'] || req.headers['x-mbx-secret-key'];

    if (!finalKey || !finalSecret) {
        throw { status: 400, message: 'Binance API Key and Secret are required.' };
    }

    return {
        apiKey: finalKey,
        apiSecret: finalSecret,
        recvWindow: recvWindow || 10000,
        isTestnet: isTestnet === true || isTestnet === 'true' || !!req.body.testnet,
        params
    };
}

module.exports = {
    getPositionRisk: async (req, res) => {
        try {
            const { apiKey, apiSecret, recvWindow, isTestnet, params } = getRequestData(req);

            // Binance Futures V2 positionRisk
            const positions = await sendSignedRequest('GET', '/fapi/v2/positionRisk', params, apiKey, apiSecret, recvWindow, isTestnet);

            // Filter: By default, only show open positions (abs(amt) > 0)
            const openPositions = Array.isArray(positions)
                ? positions.filter(p => Math.abs(parseFloat(p.positionAmt)) > 0)
                : [];

            res.json({
                success: true,
                positions: openPositions,
                count: openPositions.length,
                all: (params.includeZero || params.includeZero === 'true') ? positions : undefined
            });
        } catch (err) {
            console.error('[BinanceController] getPositionRisk Error:', err.message || err);
            res.status(err.status || 400).json({
                success: false,
                error: err.message || 'Failed to fetch positions',
                code: err.code,
                details: err.original
            });
        }
    },

    getAccount: async (req, res) => {
        try {
            const { apiKey, apiSecret, recvWindow, isTestnet, params } = getRequestData(req);

            // Binance Futures V2 Account
            const data = await sendSignedRequest('GET', '/fapi/v2/account', params, apiKey, apiSecret, recvWindow, isTestnet);

            res.json({
                success: true,
                data: {
                    totalWalletBalance: data.totalWalletBalance,
                    totalUnrealizedProfit: data.totalUnrealizedProfit,
                    availableBalance: data.availableBalance,
                    totalMarginBalance: data.totalMarginBalance,
                    assets: data.assets?.filter(a => parseFloat(a.walletBalance) > 0)
                }
            });
        } catch (err) {
            console.error('[BinanceController] getAccount Error:', err.message || err);
            res.status(err.status || 400).json({
                success: false,
                error: err.message || 'Failed to fetch account info',
                code: err.code,
                details: err.original
            });
        }
    },

    getBalance: async (req, res) => {
        try {
            const { apiKey, apiSecret, recvWindow, isTestnet, params } = getRequestData(req);
            const data = await sendSignedRequest('GET', '/fapi/v2/balance', params, apiKey, apiSecret, recvWindow, isTestnet);
            res.json({ success: true, data });
        } catch (err) {
            res.status(err.status || 400).json({ success: false, error: err.message || 'Failed to fetch balance' });
        }
    },

    closePositions: async (req, res) => {
        try {
            const { apiKey, apiSecret, recvWindow, isTestnet, params } = getRequestData(req);
            const targetSymbol = req.body.symbol || 'ALL';

            // 1. Fetch current open positions
            const positions = await sendSignedRequest('GET', '/fapi/v2/positionRisk', {}, apiKey, apiSecret, recvWindow, isTestnet);

            const openPositions = Array.isArray(positions)
                ? positions.filter(p => {
                    const amt = Math.abs(parseFloat(p.positionAmt));
                    const matchesSymbol = targetSymbol === 'ALL' || p.symbol === targetSymbol;
                    return amt > 0 && matchesSymbol;
                })
                : [];

            if (openPositions.length === 0) {
                return res.json({ success: true, message: 'No open positions to close.', closedCount: 0 });
            }

            console.log(`[BinanceController] Closing ${openPositions.length} positions...`);

            // 2. Close each position with a Market Order
            const results = [];
            for (const pos of openPositions) {
                try {
                    const amt = parseFloat(pos.positionAmt);
                    const side = amt > 0 ? 'SELL' : 'BUY';

                    const orderParams = {
                        symbol: pos.symbol,
                        side: side,
                        type: 'MARKET',
                        quantity: Math.abs(amt),
                        reduceOnly: 'true'
                    };

                    const orderResult = await sendSignedRequest('POST', '/fapi/v1/order', orderParams, apiKey, apiSecret, recvWindow, isTestnet);
                    results.push({ symbol: pos.symbol, success: true, orderId: orderResult.orderId });
                } catch (err) {
                    console.error(`[BinanceController] Failed to close ${pos.symbol}:`, err.message || err);
                    results.push({ symbol: pos.symbol, success: false, error: err.message || err });
                }
            }

            const successCount = results.filter(r => r.success).length;
            res.json({
                success: successCount > 0,
                message: `Closed ${successCount}/${openPositions.length} positions.`,
                results
            });
        } catch (err) {
            console.error('[BinanceController] closePositions Error:', err.message || err);
            res.status(err.status || 400).json({
                success: false,
                error: err.message || 'Failed to close positions',
                details: err.original
            });
        }
    }
};
