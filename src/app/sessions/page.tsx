"use client";

import { useEffect, useState, useCallback } from "react";
import { Activity, Clock, Wifi, WifiOff, LayoutList } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { xcrClient } from "@/lib/xcrClient";

interface Session {
    id: string;
    name: string;
    exchange: string;
    status: "Active" | "Paused";
    created_at?: string;
    ips?: string[];
    full_ips?: any[];
    target_percentage?: number;
}

interface Trade {
    id: string;
    email: string;
    logs?: any;
    created_at?: string;
}

interface SessionLog {
    id: string;
    email: string;
    trades?: any;
    created_at?: string;
}

export default function LiveStatusPage() {
    const { supabase, user } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);

    const fetchAll = useCallback(async () => {
        if (!user) return;

        try {
            // Parallel fetch via Server Proxies
            const [sessRes, tradeRes, logRes] = await Promise.all([
                xcrClient.getProxySessions(),
                xcrClient.getProxyTrades(),
                xcrClient.getProxyLogs()
            ]);

            if (sessRes.ok) setSessions(sessRes.sessions || []);
            if (tradeRes.ok) setTrades(tradeRes.trades || []);
            if (logRes.ok) setSessionLogs(logRes.logs || []);

            setLastUpdated(new Date().toLocaleTimeString());
        } catch (e) {
            console.warn("[LiveStatus] Fetch error:", e);
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;

        setIsMounted(true);
        setLastUpdated(new Date().toLocaleTimeString());

        const load = async () => {
            setIsLoading(true);
            await fetchAll();
            setIsLoading(false);
        };
        load();

        // Realtime sync
        const channel = supabase
            .channel("live_status_sync")
            .on("postgres_changes", { event: "*", schema: "public", table: "api_credentials", filter: `email=eq.${user.email}` }, () => fetchAll())
            .on("postgres_changes", { event: "*", schema: "public", table: "trades_log", filter: `email=eq.${user.email}` }, () => fetchAll())
            .on("postgres_changes", { event: "*", schema: "public", table: "sessions_log", filter: `email=eq.${user.email}` }, () => fetchAll())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [user, supabase, fetchAll]);

    const activeCount = sessions.filter(s => s.status === "Active").length;

    return (
        <div className="space-y-8 px-6 md:px-12 pb-10 pt-24 min-h-screen bg-[#050A12]">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <Activity size={16} className="text-emerald-500" />
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Live Terminal Status</h2>
                    </div>
                    <p className="text-[10px] font-bold text-[#9FB0C7]/40 uppercase tracking-widest leading-none">
                        {sessions.length} sessions • {activeCount} active • Last sync: {isMounted ? lastUpdated : "--:--:--"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">REALTIME</span>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-t-2 border-emerald-500 animate-spin mb-4" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Accessing live feed...</span>
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Sessions Grid */}
                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-[#9FB0C7]/40 uppercase tracking-widest">Active Nodes</h3>
                        {sessions.length === 0 ? (
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No nodes configured</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sessions.map(session => (
                                    <div key={session.id} className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${session.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                                                <span className="text-xs font-black text-white uppercase">{session.name}</span>
                                            </div>
                                            {session.status === 'Active' ? <Wifi size={14} className="text-emerald-500" /> : <WifiOff size={14} className="text-slate-500" />}
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-2 text-[10px] font-bold uppercase tracking-widest">
                                            <span className="text-slate-500">Exchange</span>
                                            <span className="text-white text-right">{session.exchange}</span>
                                            <span className="text-slate-500">Ips</span>
                                            <span className="text-white text-right">{session.ips?.length || 0}</span>
                                            <span className="text-slate-500">Created</span>
                                            <span className="text-white text-right">{session.created_at ? new Date(session.created_at).toLocaleDateString() : '—'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Trades Table */}
                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-[#9FB0C7]/40 uppercase tracking-widest flex items-center gap-2">
                            <LayoutList size={14} /> Local Event Log
                        </h3>
                        <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                            {trades.length === 0 ? (
                                <p className="p-12 text-center text-xs text-slate-500 font-bold uppercase tracking-widest">Waiting for incoming trade events...</p>
                            ) : (
                                <table className="w-full text-left text-[11px]">
                                    <thead className="bg-white/5 font-black uppercase tracking-widest text-[#9FB0C7]/40">
                                        <tr>
                                            <th className="px-6 py-4">Event ID</th>
                                            <th className="px-6 py-4">Logs</th>
                                            <th className="px-6 py-4 text-right">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                                        {trades.map(t => (
                                            <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-mono text-[9px]">{t.id.slice(0, 8)}</td>
                                                <td className="px-6 py-4 truncate max-w-sm">{JSON.stringify(t.logs)}</td>
                                                <td className="px-6 py-4 text-right tabular-nums">{t.created_at ? new Date(t.created_at).toLocaleTimeString() : '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
