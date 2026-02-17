export interface TradingSession {
    id: string;
    name: string;
    exchange: 'Binance' | 'Bybit' | 'OKX';
    status: 'RUNNING' | 'STOPPED' | 'PAUSED';
    uptime: string;
    balance: string;
    pnl: string;
    roi: string;
    trades: number;
}

export const MOCK_SESSIONS: TradingSession[] = [
    {
        id: '1',
        name: 'Primary BTC-Direct',
        exchange: 'Binance',
        status: 'RUNNING',
        uptime: '14d 07h 22m',
        balance: '$42,150.80',
        pnl: '+$4,290.40',
        roi: '+11.3%',
        trades: 124,
    },
    {
        id: '2',
        name: 'Bybit Scalp V3',
        exchange: 'Bybit',
        status: 'RUNNING',
        uptime: '08d 14h 05m',
        balance: '$12,400.00',
        pnl: '+$842.10',
        roi: '+7.2%',
        trades: 342,
    },
    {
        id: '3',
        name: 'OKX Long-Term',
        exchange: 'OKX',
        status: 'STOPPED',
        uptime: '00d 00h 00m',
        balance: '$8,200.00',
        pnl: '-$120.50',
        roi: '-1.4%',
        trades: 45,
    },
];

export const MOCK_USER = {
    username: 'JohnTrader',
    initials: 'JT',
    plan: 'Pro Plan',
    email: 'john@trading.com',
};

export const MOCK_CHAT = [
    { id: '1', name: 'SL', message: 'BTC/USDT closed +3.2% — AI caught the dip.', time: '10:31', type: 'TRADES' },
    { id: '2', name: 'AS', message: 'Long signal detected: ETH/USDT — bullish.', time: '10:31', type: 'SIGNAL' },
    { id: '3', name: 'MJ', message: 'What was the entry on that BTC trade?', time: '10:32', type: 'GENERAL' },
    { id: '4', name: 'SC', message: 'Entered at 42,150 market — bot filled.', time: '10:33', type: 'WIN' },
    { id: '5', name: 'SY', message: 'Platform update: Risk management v2.4.', time: '10:34', type: 'UPDATE' },
];

export const MOCK_LEADERBOARD = [
    { rank: 1, name: 'Alpha_Trdr', roi: '+142.8%', pnl: '+$52,490', since: 'Mar 2024' },
    { rank: 2, name: 'QuantBot_v2', roi: '+128.4%', pnl: '+$41,200', since: 'Apr 2024' },
    { rank: 3, name: 'ZenScalp', roi: '+96.2%', pnl: '+$28,150', since: 'Jan 2024' },
    { rank: 4, name: 'FutureKing', roi: '+84.7%', pnl: '+$64,800', since: 'May 2024' },
];
