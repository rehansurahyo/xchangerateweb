"use client";

import { Settings, Shield, BarChart3, Bot } from "lucide-react";

const HowItWorks = () => {
    const features = [
        {
            title: "How Arizona High AI AutoTrader Works",
            desc: "Our proprietary AI connects to your exchange via API, analyzes markets 24/7, and executes precision futures trades automatically. Set your capital, configure targets, and the algorithm handles everything — entries, exits, and position management.",
            icon: <Settings className="text-primary" size={24} />,
            iconBg: "bg-primary/10",
        },
        {
            title: "Risk Management & Capital Protection",
            desc: "Multi-layered risk controls including dynamic position sizing, automated stop-loss, maximum drawdown limits, and capital floor protection. Your funds never leave your exchange — we trade via read/trade API keys only.",
            icon: <Shield className="text-[#22D3A6]" size={24} />,
            iconBg: "bg-[#22D3A6]/10",
        },
        {
            title: "Transparency & Verified Results",
            desc: "Every trade is logged, timestamped, and publicly verifiable. Real-time performance dashboards, a public leaderboard, and live community chat ensure complete accountability. No hidden results, no cherry-picked data.",
            icon: <BarChart3 className="text-[#FFB800]" size={24} />,
            iconBg: "bg-[#FFB800]/10",
        },
        {
            title: "Fully Automated Futures Execution",
            desc: "From signal detection to order execution, the AI operates autonomously across Binance, Bybit, OKX, and more. Auto-restart, session targeting, and multi-session support ensure uninterrupted, hands-free trading around the clock.",
            icon: <Bot className="text-[#A855F7]" size={24} />,
            iconBg: "bg-[#A855F7]/10",
        },
    ];

    return (
        <section id="how-it-works" className="py-10 px-6 bg-white text-slate-900 dark:bg-[#070B14] dark:text-slate-100">
            <div className="max-w-[900px] mx-auto">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5 mb-3">
                        <Settings size={12} className="text-primary" />
                        <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">
                            HOW IT WORKS
                        </span>
                    </div>
                    <h2 className="text-slate-900 dark:text-[#F5F7FF] mb-3">
                        Built for Serious Traders
                    </h2>
                    <p className="max-w-[600px] text-slate-500 dark:text-[#9FB0C7] text-[13px] leading-relaxed">
                        Institutional infrastructure meets intelligent automation. Every feature is engineered for performance, transparency, and trust.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, idx) => (
                        <div key={idx} className="glass-card p-6 flex flex-col items-start group bg-white dark:bg-inherit border border-slate-200 dark:border-white/5">
                            <div className={`w-10 h-10 rounded-lg ${feature.iconBg} flex items-center justify-center mb-5 border border-slate-200 dark:border-white/5 group-hover:scale-110 transition-transform`}>
                                {feature.icon ? (
                                    <div className="scale-[0.8]">
                                        {feature.icon}
                                    </div>
                                ) : null}
                            </div>
                            <h3 className="text-slate-900 dark:text-white text-base mb-3 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-slate-500 dark:text-[#9FB0C7] text-[13px] leading-relaxed opacity-90">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
