"use client";

import { useState } from "react";
import { User, TrendingUp } from "lucide-react";
import { MOCK_LEADERBOARD } from "@/lib/mock";

export default function LeaderboardPage() {
    const [activeFilter, setActiveFilter] = useState<'7D' | '30D' | '90D'>('30D');

    return (
        <div className="max-w-[1000px] mx-auto space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">LeaderBoard</h2>
                    <p className="text-[10px] text-slate-500 dark:text-[#9FB0C7]/40 font-bold uppercase tracking-widest mt-1">Top Performing Active Traders</p>
                </div>
                <div className="flex items-center space-x-2 text-[9px] font-black text-blue-600 dark:text-primary uppercase tracking-widest">
                    <TrendingUp size={12} />
                    <span>Live Rankings</span>
                </div>
            </div>

            <div className="flex bg-slate-100 dark:bg-[#0A101A] p-0.5 rounded-lg border border-slate-200 dark:border-white/5 self-start w-fit">
                {['7D', '30D', '90D'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter as any)}
                        className={`px-3 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase transition-all ${activeFilter === filter ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white shadow-sm dark:shadow-none' : 'text-slate-500 dark:text-[#9FB0C7]/60 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="w-full text-[8px] font-black text-slate-400 dark:text-[#9FB0C7]/20 uppercase tracking-[0.2em] flex justify-between px-3 pb-2 border-b border-slate-200 dark:border-white/5">
                <div className="flex space-x-12">
                    <span className="w-6 text-center">#</span>
                    <span>Trader</span>
                </div>
                <span>Profit ({activeFilter})</span>
            </div>

            <div className="space-y-4">
                {MOCK_LEADERBOARD.map((user) => (
                    <div key={user.rank} className="glass-card overflow-hidden border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A101A] relative group hover:border-slate-300 dark:hover:border-white/10 transition-all">
                        {/* Rank Accent Line */}
                        <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-md ${user.rank === 1 ? 'bg-yellow-400' :
                            user.rank === 2 ? 'bg-slate-300' :
                                user.rank === 3 ? 'bg-orange-600' : 'bg-transparent'
                            }`} />

                        <div className="p-3 pr-6 flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className={`w-6 h-6 rounded flex items-center justify-center font-black text-[10px] ${user.rank === 1 ? 'bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 border border-yellow-400/20' :
                                    user.rank === 2 ? 'bg-slate-300/10 text-slate-500 dark:text-slate-300 border border-slate-300/20' :
                                        user.rank === 3 ? 'bg-orange-600/10 text-orange-600 border border-orange-600/20' :
                                            'text-slate-400 dark:text-[#9FB0C7]/40 border border-slate-200 dark:border-white/5'
                                    }`}>
                                    {user.rank}
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#1E293B] flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/5">
                                            <User size={16} className="text-slate-400 dark:text-[#9FB0C7]/40" />
                                        </div>
                                        <div className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-[#22D3A6] border-2 border-white dark:border-[#0A101A]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900 dark:text-white lowercase tracking-tight">{user.name}</h4>
                                        <p className="text-[9px] font-bold text-slate-400 dark:text-[#9FB0C7]/30 uppercase tracking-tighter">Since {user.since} · 14d 07h</p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className={`text-xs font-black tracking-widest leading-none ${user.pnl.startsWith('+') ? 'text-emerald-500 dark:text-[#22D3A6]' : 'text-red-500 dark:text-red-400'
                                    }`}>
                                    {user.pnl.startsWith('+') ? `+$${user.pnl.slice(1)}` : user.pnl}
                                </p>
                                <p className="text-[8px] font-black text-emerald-500/60 dark:text-[#22D3A6]/60 tracking-tighter mt-1">+15.11%</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-[#050A12] px-3 py-1.5 flex items-center justify-between border-t border-slate-200 dark:border-white/5">
                            <div>
                                <p className="text-[7px] font-black text-slate-400 dark:text-[#9FB0C7]/40 uppercase tracking-widest mb-0.5">Capital</p>
                                <p className="text-[9px] font-mono text-slate-600 dark:text-[#9FB0C7]">$85,000</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[7px] font-black text-slate-400 dark:text-[#9FB0C7]/40 uppercase tracking-widest mb-0.5">Session</p>
                                <p className="text-[9px] font-mono text-slate-600 dark:text-[#9FB0C7]">14d 07h</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[7px] font-black text-slate-400 dark:text-[#9FB0C7]/40 uppercase tracking-widest mb-0.5">ROI</p>
                                <p className="text-[9px] font-mono text-emerald-500 dark:text-[#22D3A6]">15.11%</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
