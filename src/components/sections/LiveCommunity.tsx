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
            color: "text-[#22D3A6]",
            bg: "bg-[#22D3A6]/10",
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
            color: "text-[#22D3A6]",
            bg: "bg-[#22D3A6]/10",
        },
        {
            initials: "SY",
            name: "System",
            time: "10:34",
            message: "Platform update: New risk management v2.4 deployed. Auto-stop improved by 18%.",
            type: "UPDATE",
            tag: "UPDATE",
            color: "text-[#FFB800]",
            bg: "bg-[#FFB800]/10",
        },
    ];

    return (
        <section id="community" className="py-[100px] px-6 text-center">
            <div className="max-w-[1240px] mx-auto">
                {/* Section Header */}
                <div className="flex flex-col items-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                        <MessageSquare size={14} className="text-primary" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                            LIVE TRADING FLOOR
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#F5F7FF] mb-6">
                        Live Community
                    </h2>
                    <p className="max-w-[700px] text-[#9FB0C7] text-lg leading-relaxed">
                        Real-time trade wins, AI signal alerts, system updates, and strategy discussions from active traders worldwide.
                    </p>
                </div>

                {/* Community Panel */}
                <div className="glass-card max-w-[900px] mx-auto overflow-hidden text-left relative">
                    {/* Header/Tabs */}
                    <div className="bg-white/5 border-b border-white/5 px-6 py-4 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-6">
                            <span className="text-sm font-bold text-white tracking-widest uppercase">
                                Trading Floor
                            </span>
                            <span className="text-xs font-semibold text-[#9FB0C7] tracking-widest uppercase opacity-50">
                                Global
                            </span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 bg-[#22D3A6] rounded-full" />
                                <span className="text-[10px] font-bold tracking-widest text-[#22D3A6] uppercase">
                                    TRADES
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 opacity-60">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                                    SIGNALS
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 opacity-60">
                                <span className="w-1.5 h-1.5 bg-[#FFB800] rounded-full" />
                                <span className="text-[10px] font-bold tracking-widest text-[#FFB800] uppercase">
                                    SYSTEM
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-[#22D3A6] rounded-full animate-pulse" />
                            <span className="text-[11px] font-bold text-[#22D3A6]">248 online</span>
                        </div>
                    </div>

                    {/* Chat Feed */}
                    <div className="p-6 space-y-8 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className="flex space-x-4 group">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors">
                                    <span className="text-xs font-bold text-[#9FB0C7] group-hover:text-white">
                                        {msg.initials}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-bold text-white tracking-tight">
                                            {msg.name}
                                        </span>
                                        {msg.tag && (
                                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${msg.bg} ${msg.color} uppercase tracking-[0.1em]`}>
                                                {msg.tag}
                                            </span>
                                        )}
                                        <span className="text-[10px] font-medium text-[#9FB0C7]/50">
                                            {msg.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#9FB0C7] leading-relaxed">
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Login Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-[#050A12] via-[#050A12]/90 to-transparent flex items-end justify-center pb-10">
                        <div className="flex flex-col items-center space-y-4">
                            <span className="text-sm font-bold text-white/50 tracking-widest uppercase">
                                Login to participate in live trading discussions
                            </span>
                            <button className="glass-card py-3 px-8 flex items-center space-x-3 border-white/20 hover:border-primary transition-all">
                                <Lock size={16} className="text-[#9FB0C7]" />
                                <span className="text-xs font-bold tracking-widest text-white uppercase">
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
