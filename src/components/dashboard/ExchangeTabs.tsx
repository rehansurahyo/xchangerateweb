"use client";

interface ExchangeTabsProps {
    activeExchange: 'Binance' | 'Bybit' | 'OKX';
    onExchangeChange: (exchange: 'Binance' | 'Bybit' | 'OKX') => void;
}

const ExchangeTabs = ({ activeExchange, onExchangeChange }: ExchangeTabsProps) => {
    const exchanges = [
        { id: 'Binance' as const, color: 'text-yellow-400', badge: 1 },
        { id: 'Bybit' as const, color: 'text-orange-500', badge: 1 },
        { id: 'OKX' as const, color: 'text-blue-400', badge: 0 },
    ];

    return (
        <div className="flex p-1 rounded-xl bg-[#0A101A] border border-white/5 w-full md:w-auto">
            {exchanges.map((ex) => (
                <button
                    key={ex.id}
                    onClick={() => onExchangeChange(ex.id)}
                    className={`px-6 py-2 text-[9px] font-black tracking-[0.2em] uppercase transition-all flex-1 md:flex-none flex items-center justify-center space-x-2 rounded-lg relative overflow-hidden ${activeExchange === ex.id
                        ? `bg-white/[0.03] text-white shadow-inner`
                        : "text-[#9FB0C7]/40 hover:text-[#9FB0C7]"
                        }`}
                >
                    {activeExchange === ex.id && (
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-2.5 rounded-r-full ${ex.id === 'Binance' ? 'bg-yellow-400' :
                            ex.id === 'Bybit' ? 'bg-orange-500' :
                                'bg-blue-400'
                            }`} />
                    )}
                    <span>{ex.id}</span>
                    <span className={`px-1 py-0.5 rounded text-[7px] font-bold bg-white/5 ${activeExchange === ex.id ? ex.color : 'text-[#9FB0C7]/40'}`}>
                        {ex.badge}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default ExchangeTabs;
