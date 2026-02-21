"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Database } from "@/lib/types";
import MetricCard from "@/components/dashboard/MetricCard";
import { Wallet, Activity, ArrowUpRight, TrendingUp } from "lucide-react";

type Snapshot = Database['public']['Tables']['account_snapshots']['Row'];

export default function SnapshotsPage() {
    const { supabase, user } = useAuth();
    const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    const fetchLatestSnapshots = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            // Fetch the latest snapshot for each session
            const { data, error } = await supabase
                .from('account_snapshots')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Group by session and take the latest
            const latestPerSession = data.reduce((acc: Snapshot[], current) => {
                if (!acc.find(s => s.session_id === current.session_id)) {
                    acc.push(current);
                }
                return acc;
            }, []);

            setSnapshots(latestPerSession);
        } catch (error) {
            console.error("Error fetching snapshots:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;

        fetchLatestSnapshots();

        const channel = supabase
            .channel('realtime_snapshots')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'account_snapshots', filter: `user_id=eq.${user.id}` },
                (payload) => {
                    const newSnapshot = payload.new as Snapshot;
                    setSnapshots(prev => {
                        const filtered = prev.filter(s => s.session_id !== newSnapshot.session_id);
                        return [newSnapshot, ...filtered];
                    });
                }
            )
            .subscribe();

        setIsMounted(true);
        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, supabase]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#050A12]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-t-2 border-primary animate-spin" />
                    <span className="text-xs font-bold text-slate-400 dark:text-[#9FB0C7]/40 uppercase tracking-widest">Hydrating Live Data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 px-6 md:px-12 min-h-screen bg-background dark:bg-[#050A12] pb-10 pt-20">
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Live Account Status</h1>
                <p className="text-xs text-slate-500 dark:text-[#9FB0C7]/40 font-bold uppercase tracking-widest">Real-time snapshots from Binance Futures</p>
            </div>

            {snapshots.length > 0 ? (
                <div className="grid gap-8">
                    {snapshots.map((snapshot: any) => (
                        <div key={snapshot.id} className="glass-card overflow-hidden border border-slate-200 dark:border-white/[0.03] bg-white dark:bg-[#0A101A] rounded-xl flex flex-col shadow-sm dark:shadow-none">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/[0.03] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01]">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                        <Activity size={16} className="text-orange-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-500 dark:text-white/40 uppercase tracking-widest leading-none">Binance Futures</span>
                                        <span className="text-sm font-black text-slate-950 dark:text-white tracking-tight">Account Sync</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-[#22D3A6] border border-[#22D3A6]/20 bg-[#22D3A6]/5 px-2 py-0.5 rounded uppercase tracking-widest">Live</span>
                                    <span className="text-[9px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest leading-none ml-2">Last Update: {isMounted ? new Date(snapshot.created_at).toLocaleTimeString() : '--:--:--'}</span>
                                </div>
                            </div>

                            {/* Summary Metrics */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 dark:bg-white/[0.03]">
                                <div className="p-6 bg-white dark:bg-[#0A101A] flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest leading-none">Wallet Balance</span>
                                    <span className="text-xl font-black text-slate-950 dark:text-white tracking-tighter">${parseFloat(snapshot.snapshot.totalWalletBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="p-6 bg-white dark:bg-[#0A101A] flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest leading-none">Unrealized PnL</span>
                                    <span className={`text-xl font-black tracking-tighter ${parseFloat(snapshot.snapshot.totalUnrealizedProfit) >= 0 ? 'text-[#22D3A6]' : 'text-rose-500'}`}>
                                        {parseFloat(snapshot.snapshot.totalUnrealizedProfit) >= 0 ? '+' : ''}
                                        ${parseFloat(snapshot.snapshot.totalUnrealizedProfit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="p-6 bg-white dark:bg-[#0A101A] flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest leading-none">Open Positions</span>
                                    <span className="text-xl font-black text-slate-950 dark:text-white tracking-tighter">{snapshot.snapshot.positions.length} active</span>
                                </div>
                                <div className="p-6 bg-white dark:bg-[#0A101A] flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest leading-none">Mode</span>
                                    <span className="text-xl font-black text-orange-500 tracking-tighter uppercase">Futures</span>
                                </div>
                            </div>

                            {/* Positions Table */}
                            <div className="p-0 flex-1 overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-y border-slate-100 dark:border-white/[0.03] bg-slate-50/30 dark:bg-white/[0.01]">
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Symbol</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-right">Size</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-right">Entry</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-right">Unrealized PnL</th>
                                            <th className="px-6 py-3 text-[9px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {snapshot.snapshot.positions.map((pos: any, idx: number) => {
                                            const num = (v: any) => {
                                                const n = Number(v);
                                                return Number.isFinite(n) ? n : 0;
                                            };

                                            const posPnl = num(pos.unRealizedProfit ?? pos.unrealizedProfit ?? pos.unRealizedPnl ?? pos.unrealizedPnl);
                                            const posAmt = num(pos.positionAmt);
                                            const entry = num(pos.entryPrice);
                                            const isLong = posAmt >= 0;

                                            return (
                                                <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-1 h-4 rounded-full ${isLong ? 'bg-[#22D3A6]' : 'bg-rose-500'}`} />
                                                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">{pos.symbol}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`text-xs font-bold ${isLong ? 'text-[#22D3A6]' : 'text-rose-500'}`}>
                                                            {isLong ? '+' : ''}{Math.abs(posAmt).toFixed(3)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="text-xs font-bold text-slate-500 dark:text-white/60 tracking-tight">${entry.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`text-xs font-black ${posPnl >= 0 ? 'text-[#22D3A6]' : 'text-rose-500'}`}>
                                                            {posPnl >= 0 ? '+' : ''}${posPnl.toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em]">{isLong ? 'Long' : 'Short'}</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-24 flex flex-col items-center justify-center text-center space-y-6 border border-white/5 bg-[#0A101A]">
                    <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-[#9FB0C7]/20">
                        <TrendingUp size={32} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-white text-lg font-black uppercase tracking-widest tracking-tight">No Live Data Yet</h4>
                        <p className="text-xs text-[#9FB0C7]/40 max-w-[320px] font-bold uppercase tracking-widest leading-relaxed">
                            Start your background worker to begin fetching real-time snapshots from Binance.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
