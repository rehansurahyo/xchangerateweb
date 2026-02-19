"use client";

import { MessageSquare, Lock } from "lucide-react";

const LiveCommunity = () => {
    const chatMessages = [
        {
            initials: "SL",
            name: "S.L.",
            time: "10:31",
            message: "BTC/USDT closed +3.2% — AI caught the 42k dip perfectly. Target achieved.",
            type: "TRADES",
            color: "text-accent-teal",
            bg: "bg-accent-teal/10",
        },
        {
            initials: "AI",
            name: "AI Signal",
            time: "10:31",
            message: "Long signal detected: ETH/USDT — bullish divergence on 4H, confidence 87%.",
            type: "SIGNAL",
            color: "text-primary",
            bg: "bg-primary/10",
            tag: "SIGNAL",
        },
        {
            initials: "MJ",
            name: "M. Johnson",
            time: "10:32",
            message: "What was the entry on that BTC trade? My limit at 42,150 didn't fill.",
            type: "GENERAL",
        },
        {
            initials: "SC",
            name: "S. Chen",
            time: "10:33",
            message: "Entered at 42,150 market — bot filled instantly. Session target 5% triggered exit.",
            type: "WIN",
            tag: "WIN",
            color: "text-accent-teal",
            bg: "bg-accent-teal/10",
        },
        {
            initials: "SY",
            name: "System",
            time: "10:34",
            message: "Platform update: New risk management v2.4 deployed. Auto-stop improved by 18%.",
            type: "UPDATE",
            tag: "UPDATE",
            color: "text-amber-500 dark:text-amber-400",
            bg: "bg-amber-500/10 dark:bg-amber-400/10",
        },
    ];

    return (
        <section id="community" className="py-12 px-6 text-center bg-white text-slate-900 dark:bg-[#070B14] dark:text-slate-100">
            <div className="max-w-[1200px] mx-auto">
                {/* Section Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
                        <MessageSquare size={14} className="text-primary" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                            LIVE TRADING FLOOR
                        </span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white mb-4 text-3xl font-black tracking-tight">
                        Live Community
                    </h2>
                    <p className="max-w-[700px] text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">
                        Real-time trade wins, AI signal alerts, system updates, and strategy discussions from active traders worldwide.
                    </p>
                </div>

                {/* Community Panel */}
                <div className="glass-card max-w-[900px] mx-auto overflow-hidden text-left relative bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    {/* Header/Tabs */}
                    <div className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 px-6 py-4 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-6">
                            <span className="text-sm font-bold text-slate-900 dark:text-white tracking-widest uppercase">
                                Trading Floor
                            </span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest uppercase opacity-70">
                                Global
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full" />
                                <span className="text-[10px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                                    TRADES
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 opacity-60">
                                <span className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full" />
                                <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
                                    SIGNALS
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 opacity-60">
                                <span className="w-1.5 h-1.5 bg-amber-500 dark:bg-amber-400 rounded-full" />
                                <span className="text-[10px] font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                                    SYSTEM
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">248 online</span>
                        </div>
                    </div>

                    {/* Chat Feed */}
                    <div className="p-6 space-y-8 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className="flex space-x-4 group">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:border-primary/30 transition-colors">
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                                        {msg.initials}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                                            {msg.name}
                                        </span>
                                        {msg.tag && (
                                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${msg.bg} ${msg.color} uppercase tracking-[0.1em]`}>
                                                {msg.tag}
                                            </span>
                                        )}
                                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                            {msg.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Login Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#050914] dark:via-[#050914]/90 flex items-end justify-center pb-10">
                        <div className="flex flex-col items-center space-y-4">
                            <span className="text-sm font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                                Login to participate in live trading discussions
                            </span>
                            <button className="glass-card py-3 px-8 flex items-center space-x-3 border-slate-200 dark:border-white/10 hover:border-primary/50 transition-all bg-white dark:bg-white/5 shadow-sm">
                                <Lock size={16} className="text-slate-400 dark:text-slate-400" />
                                <span className="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">
                                    LOGIN TO JOIN
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LiveCommunity;
