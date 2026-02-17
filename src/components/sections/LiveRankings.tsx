"use client";

import { AlertTriangle, TrendingUp } from "lucide-react";

const LiveRankings = () => {
    const rankings = [
        {
            rank: 1,
            account: "Alpha_Trdr",
            roi: "+142.8%",
            winRate: "78.2%",
            drawdown: "4.2%",
            risk: "MED",
            profit: "+$52,490",
            session: "14d 07h",
        },
        {
            rank: 2,
            account: "QuantBot_v2",
            roi: "+128.4%",
            winRate: "74.5%",
            drawdown: "3.8%",
            risk: "MED",
            profit: "+$41,200",
            session: "12d 23h",
        },
        {
            rank: 3,
            account: "ZenScalp",
            roi: "+96.2%",
            winRate: "82.1%",
            drawdown: "2.1%",
            risk: "LOW",
            profit: "+$28,150",
            session: "22d 15h",
        },
        {
            rank: 4,
            account: "FutureKing",
            roi: "+84.7%",
            winRate: "68.9%",
            drawdown: "8.4%",
            risk: "HIGH",
            profit: "+$64,800",
            session: "08d 11h",
        },
        {
            rank: 5,
            account: "Crypto_Sage",
            roi: "+72.3%",
            winRate: "71.4%",
            drawdown: "5.1%",
            risk: "MED",
            profit: "+$19,400",
            session: "16d 04h",
        },
    ];

    return (
        <section id="performance" className="py-[100px] px-6">
            <div className="max-w-[1240px] mx-auto">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                        <TrendingUp size={14} className="text-primary" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                            LIVE RANKINGS
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#F5F7FF] mb-6">
                        Top Performing Accounts
                    </h2>
                    <p className="max-w-[700px] text-[#9FB0C7] text-lg leading-relaxed">
                        Real-time performance rankings based on verified trading across all connected exchanges.
                    </p>
                </div>

                {/* Rankings Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-bold tracking-[0.2em] text-[#9FB0C7] uppercase w-20 text-center">
                                        #
                                    </th>
                                    <th className="px-6 py-5 text-[10px] font-bold tracking-[0.2em] text-[#9FB0C7] uppercase">
                                        ACCOUNT
                                    </th>
                                    <th className="px-6 py-5 text-[10px] font-bold tracking-[0.2em] text-[#9FB0C7] uppercase">
                                        ROI %
                                    </th>
                                    <th className="px-6 py-5 text-[10px] font-bold tracking-[0.2em] text-[#9FB0C7] uppercase">
                                        WIN RATE
                                    </th>
                                    <th className="px-6 py-5 text-[10px] font-bold tracking-[0.2em] text-[#9FB0C7] uppercase">
                                        DRAWDOWN
                                    </th>
                                    <th className="px-6 py-5 text-[10px] font-bold tracking-[0.2em] text-[#9FB0C7] uppercase">
                                        PROFIT
                                    </th>
                                    <th className="px-6 py-5 text-[10px] font-bold tracking-[0.2em] text-[#9FB0C7] uppercase">
                                        SESSION
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rankings.map((row) => (
                                    <tr key={row.rank} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6 text-center">
                                            <div className="flex justify-center">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${row.rank === 1 ? "bg-primary text-white shadow-[0_0_15px_rgba(47,128,255,0.4)]" :
                                                        "bg-white/5 text-[#9FB0C7]"
                                                    }`}>
                                                    {row.rank}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:border-primary/40 transition-colors" />
                                                <span className="text-sm font-bold text-white mb-0.5">{row.account}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-sm font-black text-[#22D3A6] tracking-tight">{row.roi}</span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-sm font-bold text-white">{row.winRate}</span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-bold text-white">{row.drawdown}</span>
                                                <div className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${row.risk === "HIGH" ? "bg-[#FF1F1F]/10 text-[#FF1F1F]" :
                                                        row.risk === "MED" ? "bg-[#FFB800]/10 text-[#FFB800]" :
                                                            "bg-[#22D3A6]/10 text-[#22D3A6]"
                                                    }`}>
                                                    {row.risk}
                                                </div>
                                                {row.risk === "HIGH" && <AlertTriangle size={12} className="text-[#FF1F1F]" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-sm font-black text-[#22D3A6] tracking-tight">{row.profit}</span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-xs font-bold text-[#9FB0C7] tracking-wider uppercase opacity-80">{row.session}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LiveRankings;
