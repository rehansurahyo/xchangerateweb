"use client";

import { useState, useEffect } from "react";
import { User, TrendingUp } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LeaderboardPage() {
    const { supabase } = useAuth();
    const [activeFilter, setActiveFilter] = useState<'7D' | '30D' | '90D'>('30D');
    const [stats, setStats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLeaderboard = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .order('roi', { ascending: false });

        if (data) {
            // Add ranks manually if not in DB
            const ranked = data.map((item, index) => ({ ...item, rank: index + 1 }));
            setStats(ranked);
        }
        if (error) console.error("Error fetching leaderboard:", error);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [supabase]);

    return (
        <div className="max-w-[1000px] mx-auto space-y-4 animate-in fade-in duration-500 pt-20 px-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">LeaderBoard</h2>
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
                        className={`px-3 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase transition-all ${activeFilter === filter ? 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white' : 'text-slate-500'}`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {stats.map((item) => (
                    <div key={item.id} className="glass-card p-3 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A101A] flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-6 text-center font-black text-xs text-slate-400">#{item.rank}</div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <User size={16} className="text-blue-600" />
                                </div>
                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">{item.username || 'Trader'}</h4>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-black text-emerald-500">+{item.roi}%</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">${item.profit?.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
