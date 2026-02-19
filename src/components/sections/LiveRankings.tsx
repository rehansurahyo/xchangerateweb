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
        <section id="performance" className="py-12 px-6 bg-white text-slate-900 dark:bg-[#070B14] dark:text-slate-100">
            <div className="max-w-[1000px] mx-auto">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5 mb-4">
                        <TrendingUp size={13} className="text-primary" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                            LIVE RANKINGS
                        </span>
                    </div>
                    <h2 className="text-slate-900 dark:text-[#F5F7FF] mb-4">
                        Top Performing Accounts
                    </h2>
                    <p className="max-w-[600px] text-slate-500 dark:text-[#9FB0C7] text-[14px] leading-relaxed">
                        Real-time performance rankings based on verified trading across all connected exchanges.
                    </p>
                </div>

                {/* Rankings Table */}
                <div className="glass-card overflow-hidden bg-white dark:bg-inherit border border-slate-200 dark:border-white/5">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                                <tr>
                                    <th className="px-5 py-3.5 text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#9FB0C7] uppercase w-14 text-center">
                                        #
                                    </th>
                                    <th className="px-4 py-3.5 text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#9FB0C7] uppercase">
                                        ACCOUNT
                                    </th>
                                    <th className="px-4 py-3.5 text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#9FB0C7] uppercase">
                                        ROI %
                                    </th>
                                    <th className="px-4 py-3.5 text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#9FB0C7] uppercase">
                                        WIN RATE
                                    </th>
                                    <th className="px-4 py-3.5 text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#9FB0C7] uppercase">
                                        DRAWDOWN
                                    </th>
                                    <th className="px-4 py-3.5 text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#9FB0C7] uppercase">
                                        PROFIT
                                    </th>
                                    <th className="px-4 py-3.5 text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#9FB0C7] uppercase">
                                        SESSION
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                                {rankings.map((row) => (
                                    <tr key={row.rank} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-5 py-3 text-center">
                                            <div className="flex justify-center">
                                                <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[10px] font-black ${row.rank === 1 ? "bg-primary text-white shadow-[0_0_15px_rgba(47,128,255,0.4)]" :
                                                    "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-[#9FB0C7]"
                                                    }`}>
                                                    {row.rank}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-2.5">
                                                <div className="w-6.5 h-6.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:border-primary/40 transition-colors" />
                                                <span className="text-[12px] font-bold text-slate-900 dark:text-white mb-0.5">{row.account}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[12px] font-black text-emerald-500 dark:text-[#10B981] tracking-tight">{row.roi}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[12px] font-bold text-slate-900 dark:text-white">{row.winRate}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-1.5">
                                                <span className="text-[12px] font-bold text-slate-900 dark:text-white">{row.drawdown}</span>
                                                <div className={`text-[8px] font-black px-1.2 py-0.2 rounded uppercase tracking-wider ${row.risk === "HIGH" ? "bg-red-500/10 dark:bg-[#FF1F1F]/10 text-red-500 dark:text-[#FF1F1F]" :
                                                    row.risk === "MED" ? "bg-yellow-500/10 dark:bg-[#FFB800]/10 text-yellow-600 dark:text-[#FFB800]" :
                                                        "bg-emerald-500/10 dark:bg-[#10B981]/10 text-emerald-600 dark:text-[#10B981]"
                                                    }`}>
                                                    {row.risk}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[12px] font-black text-emerald-500 dark:text-[#10B981] tracking-tight">{row.profit}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-[#9FB0C7] tracking-wider uppercase opacity-80">{row.session}</span>
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
