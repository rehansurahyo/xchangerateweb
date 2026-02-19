"use client";

interface ExchangeTabsProps {
    activeExchange: 'Binance' | 'Bybit' | 'OKX';
    onExchangeChange: (exchange: 'Binance' | 'Bybit' | 'OKX') => void;
}

const ExchangeTabs = ({ activeExchange, onExchangeChange }: ExchangeTabsProps) => {
    const exchanges = [
        { id: 'Binance' as const, badge: 1, hasDot: true },
        { id: 'Bybit' as const, badge: 1, hasDot: true },
        { id: 'OKX' as const, badge: 1, hasDot: false },
    ];

    return (
        <div className="flex w-full border-b border-slate-200 dark:border-white/[0.03]">
            {exchanges.map((ex) => (
                <button
                    key={ex.id}
                    onClick={() => onExchangeChange(ex.id)}
                    className={`flex-1 relative py-3 text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center space-x-3 
                        ${activeExchange === ex.id
                            ? "bg-yellow-500/10 dark:bg-[#EAB308]/10 text-yellow-600 dark:text-[#EAB308] border-b-2 border-yellow-500 dark:border-[#EAB308]"
                            : "text-slate-400 dark:text-[#9FB0C7]/40 hover:text-slate-600 dark:hover:text-[#9FB0C7]/60 border-b-2 border-transparent hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                        }`}
                >
                    {ex.hasDot && (
                        <div className={`w-1.5 h-1.5 rounded-full ${activeExchange === ex.id ? 'bg-yellow-500 dark:bg-[#EAB308]' : 'bg-slate-300 dark:bg-[#9FB0C7]/20'}`} />
                    )}
                    <span>{ex.id}</span>
                    <span className={`px-1 rounded text-[10px] font-bold ${activeExchange === ex.id ? 'bg-yellow-500/20 dark:bg-[#EAB308]/20 text-yellow-600 dark:text-[#EAB308]' : 'bg-slate-100 dark:bg-white/[0.03] text-slate-400 dark:text-[#9FB0C7]/20'}`}>
                        {ex.badge}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default ExchangeTabs;
