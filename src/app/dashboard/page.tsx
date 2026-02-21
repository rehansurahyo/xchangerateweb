"use client";

import { useEffect, useState } from "react";
import { Wallet, LineChart, TrendingUp } from "lucide-react";
import ExchangeTabs from "@/components/dashboard/ExchangeTabs";
import MetricCard from "@/components/dashboard/MetricCard";
import SessionCard from "@/components/dashboard/SessionCard";
import { useAuth } from "@/components/providers/AuthProvider";

export default function DashboardPage() {
    const { supabase, user } = useAuth();
    const [activeExchange, setActiveExchange] = useState<'Binance' | 'Bybit' | 'OKX'>('Binance');
    const [sessions, setSessions] = useState<any[]>([]);
    const [positions, setPositions] = useState<any[]>([]);
    const [balances, setBalances] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [hasMounted, setHasMounted] = useState(false);

    const fetchDashboardData = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            // Fetch credentials (sessions)
            const { data: sessionsData } = await supabase
                .from('api_credentials')
                .select('*')
                .eq('user_id', user.id);

            // Fetch latest snapshots
            const { data: latestSnaps } = await supabase
                .from('account_snapshots')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            // Group by session and take the latest
            const snapMap: Record<string, any> = {};
            if (latestSnaps) {
                latestSnaps.forEach(snap => {
                    if (!snapMap[snap.session_id]) {
                        snapMap[snap.session_id] = snap.snapshot;
                    }
                });
            }

            if (sessionsData) {
                const merged = sessionsData.map(s => ({
                    ...s,
                    latest_snapshot: snapMap[s.id] || null
                }));
                setSessions(merged);
            }

            // Fetch trades/positions
            const { data: positionsData } = await supabase
                .from('trades_log')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'OPEN');

            if (positionsData) setPositions(positionsData);
            setLastUpdated(new Date());

        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setHasMounted(true);
        if (!user) return;

        fetchDashboardData();

        // Realtime subscriptions
        const channel = supabase
            .channel('dashboard_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'trades_log', filter: `user_id=eq.${user.id}` }, (payload) => {
                fetchDashboardData();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'api_credentials', filter: `user_id=eq.${user.id}` }, (payload) => {
                fetchDashboardData();
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'account_snapshots', filter: `user_id=eq.${user.id}` }, (payload) => {
                const newSnap = payload.new as any;
                setSessions(prev => prev.map(s =>
                    s.id === newSnap.session_id
                        ? { ...s, latest_snapshot: newSnap.snapshot }
                        : s
                ));
                setLastUpdated(new Date());
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, supabase]);

    const filteredSessions = sessions.filter(s => s.exchange === activeExchange);
    const activeSessions = filteredSessions.filter(s => s.status === 'Active');

    // Aggregation logic
    let totalWallet = 0;
    let totalUnrealizedPnl = 0;
    let totalOpenPositions = 0;

    activeSessions.forEach(s => {
        const snap = s.latest_snapshot;
        if (snap) {
            totalWallet += parseFloat(snap.totalWalletBalance || "0");
            totalUnrealizedPnl += parseFloat(snap.totalUnrealizedProfit || "0");
            totalOpenPositions += (snap.positions?.length || 0);
        }
    });

    const walletBalance = totalWallet;
    const totalPnl = totalUnrealizedPnl;
    const activeSessionsCount = activeSessions.length;

    const filteredPositions = positions.filter(p => sessions.find(s => s.id === p.session_id)?.exchange === activeExchange);
    const totalExposure = filteredPositions.reduce((acc, p) => acc + (Math.abs(Number(p.size || 0)) * Number(p.mark_price || p.entry_price || 0)), 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 px-6 md:px-12 min-h-screen bg-background dark:bg-[#050A12] pb-10 pt-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Main Dashboard</h2>
                    <div className="flex items-center space-x-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-[#9FB0C7]/40 uppercase tracking-widest">
                            Live Stream Active • Last sync: {hasMounted ? lastUpdated.toLocaleTimeString() : '--:--:--'}
                        </span>
                    </div>
                </div>
            </div>

            <ExchangeTabs
                activeExchange={activeExchange}
                onExchangeChange={setActiveExchange}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    label="P&L"
                    value={`${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}`}
                />
                <MetricCard
                    label="WALLET"
                    value={walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                />
                <MetricCard
                    label="SESSIONS"
                    value={`${activeSessionsCount} / ${filteredSessions.length} live`}
                />
                <MetricCard
                    label="POSITIONS"
                    value={totalOpenPositions.toString()}
                />
            </div>

            <div className="flex items-center justify-between pt-6 pb-2">
                <div className="flex items-center space-x-3">
                    <h3 className="text-[12px] font-black text-slate-950 dark:text-white uppercase tracking-[0.2em]">Account Summary</h3>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-[9px] font-black text-slate-950 dark:text-[#9FB0C7]/40 uppercase tracking-widest leading-none">
                        {filteredSessions.length} sessions
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-[#9FB0C7]/40 uppercase tracking-widest leading-none">Combined P&L: </span>
                    <span className={`text-[11px] font-bold ${totalPnl >= 0 ? 'text-emerald-500 dark:text-[#22D3A6]' : 'text-red-500'} tracking-tighter ml-1`}>
                        {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(4)}
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                {filteredSessions.length > 0 ? (
                    filteredSessions.map(session => (
                        <div key={session.id} className="space-y-6">
                            <SessionCard
                                session={session}
                                positions={positions.filter(p => p.session_id === session.id)}
                            />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <h3 className="text-[12px] font-black text-slate-950 dark:text-white uppercase tracking-[0.2em]">Trading Activity</h3>
                                    <div className="flex items-center space-x-3">
                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1A2333] border border-slate-200 dark:border-white/5 text-[9px] font-black text-slate-950 dark:text-white/60 uppercase tracking-widest">
                                            {positions.filter(p => p.session_id === session.id).length} positions
                                        </span>
                                        <div className="flex items-center space-x-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${session.status === 'Active' ? 'bg-[#22D3A6]' : 'bg-red-400'}`} />
                                            <span className={`text-[10px] font-black ${session.status === 'Active' ? 'text-[#22D3A6]' : 'text-red-400'} uppercase tracking-widest`}>
                                                {session.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-bold text-slate-500 dark:text-[#9FB0C7]/40 uppercase tracking-widest leading-none">Total Exposure: </span>
                                    <span className="text-[12px] font-black text-slate-950 dark:text-white tracking-tighter ml-1">
                                        ${totalExposure.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full glass-card p-12 flex flex-col items-center justify-center text-center space-y-3 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A101A] shadow-sm dark:shadow-none">
                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-[#9FB0C7]/20">
                            <TrendingUp size={24} />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-slate-950 dark:text-white text-[11px] font-bold uppercase tracking-widest">No Active Sessions</h4>
                            <p className="text-xs text-slate-500 dark:text-[#9FB0C7]/40 max-w-[300px]">
                                Connect your API keys and deploy an AI strategy to start trading on {activeExchange}.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
