"use client";

import { useState } from "react";
import { User, TrendingUp } from "lucide-react";
import { MOCK_LEADERBOARD } from "@/lib/mock";

export default function LeaderboardPage() {
    const [activeFilter, setActiveFilter] = useState<'7D' | '30D' | '90D'>('30D');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">LeaderBoard</h2>
                    <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-[#9FB0C7]">Top Performing Active Traders</p>
                    </div>
                </div>

                <div className="flex bg-[#0A101A] p-0.5 rounded-lg border border-white/5 self-start">
                    {['7D', '30D', '90D'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter as any)}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all ${activeFilter === filter ? 'bg-[#1E293B] text-white' : 'text-[#9FB0C7] hover:text-white'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full text-xs font-black text-[#9FB0C7]/40 uppercase tracking-widest flex justify-between px-6 pb-2 border-b border-white/5">
                <span>Trader</span>
                <span>Profit ({activeFilter})</span>
            </div>

            <div className="space-y-4">
                {MOCK_LEADERBOARD.map((user) => (
                    <div key={user.rank} className="glass-card overflow-hidden border border-white/5 bg-[#0A101A] relative group hover:border-white/10 transition-all">
                        {/* Rank Accent Line */}
                        <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-md ${user.rank === 1 ? 'bg-yellow-400' :
                                user.rank === 2 ? 'bg-slate-300' :
                                    user.rank === 3 ? 'bg-orange-600' : 'bg-transparent'
                            }`} />

                        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center space-x-4 w-full md:w-auto">
                                <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center font-black text-sm ${user.rank === 1 ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
                                        user.rank === 2 ? 'bg-slate-300/10 text-slate-300 border border-slate-300/20' :
                                            user.rank === 3 ? 'bg-orange-600/10 text-orange-600 border border-orange-600/20' :
                                                'text-[#9FB0C7]/40'
                                    }`}>
                                    {user.rank}
                                </div>
                                <div className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                                    {/* Avatar Placeholder */}
                                    <User size={20} className="text-[#9FB0C7]" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white tracking-wide">{user.name}</h4>
                                    <span className="text-[10px] font-medium text-[#9FB0C7]/60">Since {user.since} · 14d 07h</span>
                                </div>
                            </div>

                            <div className="flex-1 w-full md:w-auto flex flex-col items-end">
                                <p className={`text-sm font-bold tracking-wider ${user.pnl.startsWith('+') ? 'text-[#22D3A6]' : 'text-red-400'
                                    }`}>{user.pnl}</p>
                                <p className="text-[10px] font-bold text-[#22D3A6]">+15.11%</p>
                            </div>
                        </div>

                        <div className="bg-[#050A12] px-6 py-3 flex items-center justify-between border-t border-white/5">
                            <div>
                                <p className="text-[8px] font-black text-[#9FB0C7]/40 uppercase tracking-widest mb-0.5">Capital</p>
                                <p className="text-[10px] font-mono text-[#9FB0C7]">$85,000</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[8px] font-black text-[#9FB0C7]/40 uppercase tracking-widest mb-0.5">Session</p>
                                <p className="text-[10px] font-mono text-[#9FB0C7]">14d 07h</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-[#9FB0C7]/40 uppercase tracking-widest mb-0.5">ROI</p>
                                <p className="text-[10px] font-mono text-[#22D3A6]">15.11%</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
