"use client";

const TickerTape = () => {
  const items = [
    { pair: "BTC/USDT", change: "+2.34%", positive: true },
    { pair: "ETH/USDT", change: "+1.87%", positive: true },
    { pair: "SOL/USDT", change: "-0.52%", positive: false },
    { pair: "DOGE/USDT", change: "+0.89%", positive: true },
    { pair: "XRP/USDT", change: "+1.12%", positive: true },
    { pair: "ADA/USDT", change: "-0.31%", positive: false },
    { pair: "BNB/USDT", change: "+0.67%", positive: true },
    { pair: "AVAX/USDT", change: "+3.41%", positive: true },
  ];

  // Duplicate string for seamless loop
  const displayItems = [...items, ...items, ...items, ...items];

  return (
    <div className="w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/5 py-1 overflow-hidden group relative z-40">
      <div className="flex animate-marquee hover:pause-animation whitespace-nowrap">
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-2 px-4 border-r border-slate-200 dark:border-white/5 last:border-0"
          >
            <span className="text-[12px] font-bold text-muted tracking-tight whitespace-nowrap">
              {item.pair}
            </span>
            <span
              className={`text-[12px] font-bold ${item.positive ? "text-emerald-500 dark:text-accent-teal" : "text-red-500"
                }`}
            >
              {item.change}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
                @keyframes marquee {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                .animate-marquee {
                  animation: marquee 60s linear infinite;
                }
                .hover\:pause-animation:hover {
                  animation-play-state: paused;
                }
            `}</style>
    </div>
  );
};

export default TickerTape;
