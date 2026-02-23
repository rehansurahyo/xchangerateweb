"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { TrendingUp } from "lucide-react";
import ExchangeTabs from "@/components/dashboard/ExchangeTabs";
import MetricCard from "@/components/dashboard/MetricCard";
import SessionCard from "@/components/dashboard/SessionCard";
import { useAuth } from "@/components/providers/AuthProvider";
import { xcrClient } from "@/lib/xcrClient";

const POLL_INTERVAL_MS = 10_000;

export default function DashboardPage() {
    const { user } = useAuth();
    const [activeExchange, setActiveExchange] = useState<"Binance" | "Bybit" | "OKX">("Binance");
    const [sessions, setSessions] = useState<any[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [positions, setPositions] = useState<any[]>([]);
    const [accountSnap, setAccountSnap] = useState<any>(null);
    const [trades, setTrades] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);

    const [debugInfo, setDebugInfo] = useState<{ status: number; error?: string; count: number } | null>(null);
    const pollingRef = useRef(false);

    useEffect(() => {
        setIsMounted(true);
        setLastUpdated(new Date().toLocaleTimeString());
    }, []);

    // ── 1. Fetch sessions via Proxy ────────────────────────────
    const fetchSessions = useCallback(async () => {
        if (!user) return;
        try {
            const res = await xcrClient.getProxySessions();
            if (res.ok && res.sessions) {
                const fetchedSessions = res.sessions;
                setSessions(fetchedSessions);

                // Set default active session if none set
                if (fetchedSessions.length > 0 && !activeSessionId) {
                    const activeOnes = fetchedSessions.filter((s: any) => s.status === "Active");
                    setActiveSessionId(activeOnes.length > 0 ? activeOnes[0].id : fetchedSessions[0].id);
                }
            }
        } catch (err) {
            console.error("[Dashboard] Session fetch failed:", err);
        }
    }, [user, activeSessionId]);

    // ── 2. Fetch live data ONLY if sessionId exists ───────────
    const fetchLiveData = useCallback(async () => {
        if (!user || !activeSessionId) return;

        try {
            // Fetch account and position data in parallel via proxy
            const [accountRes, posRes] = await Promise.all([
                xcrClient.getAccount(activeSessionId),
                xcrClient.getPositions(activeSessionId)
            ]);

            if (accountRes.ok && accountRes.data) {
                setAccountSnap(accountRes.data);
            }
            if (posRes.ok) {
                setPositions(posRes.positions || []);
                setDebugInfo({
                    status: posRes.status,
                    count: posRes.positions?.length || 0
                });
            } else {
                setDebugInfo({
                    status: posRes.status,
                    error: posRes.error || posRes.message,
                    count: 0
                });
            }

        } catch (err: any) {
            console.warn("[Dashboard] Live data refresh failed:", err);
            setDebugInfo({ status: 500, error: err.message, count: 0 });
        }
    }, [user, activeSessionId]);

    // ── 3. Fetch trades via Proxy ────────────────────────────
    const fetchTrades = useCallback(async () => {
        if (!user) return;
        try {
            const res = await xcrClient.getProxyTrades();
            if (res.ok) setTrades(res.trades || []);
        } catch (err) {
            console.error("[Dashboard] Trades fetch failed:", err);
        }
    }, [user]);

    const refreshAll = useCallback(async (isPolling = false) => {
        if (pollingRef.current) return;
        pollingRef.current = true;

        if (!isPolling) setIsRefreshing(true);

        try {
            await fetchSessions();
            if (activeSessionId) {
                await fetchLiveData();
            }
            await fetchTrades();
            setLastUpdated(new Date().toLocaleTimeString());
        } finally {
            setIsRefreshing(false);
            setIsLoading(false);
            pollingRef.current = false;
        }
    }, [fetchSessions, fetchLiveData, fetchTrades, activeSessionId]);

    useEffect(() => {
        if (!user) return;
        refreshAll();

        const interval = setInterval(() => {
            if (document.visibilityState === "visible") {
                refreshAll(true);
            }
        }, POLL_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [user, refreshAll]);

    const handleEmergencyShutdown = async () => {
        if (!activeSessionId) return;
        if (!confirm("Are you sure you want to CLOSE ALL open positions?")) return;

        try {
            await xcrClient.closePositions(activeSessionId, "ALL");
            refreshAll();
        } catch (err) {
            // xcrClient handles toast
        }
    };

    const filteredSessions = sessions.filter(s => s.exchange === activeExchange);
    const activeCount = filteredSessions.filter(s => s.status === "Active").length;
    const totalBalance = parseFloat(accountSnap?.totalWalletBalance || "0");
    const totalPnl = parseFloat(accountSnap?.totalUnrealizedProfit || "0");

    return (
        <div className="space-y-6 px-6 md:px-12 pb-10 pt-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
                        Dashboard Terminal
                    </h2>
                    <p className="text-[10px] font-bold text-[#9FB0C7]/40 uppercase tracking-widest mt-1">
                        Last sync: {isMounted ? lastUpdated : "--:--:--"} • {activeCount} active nodes
                    </p>
                </div>
                <button
                    onClick={handleEmergencyShutdown}
                    disabled={!activeSessionId}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 shadow-lg shadow-red-500/20"
                >
                    Emergency Shutdown
                </button>
            </div>

            <ExchangeTabs
                activeExchange={activeExchange}
                onExchangeChange={setActiveExchange}
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="BALANCE" value={totalBalance.toFixed(2)} />
                <MetricCard label="U.P&L" value={(totalPnl >= 0 ? "+" : "") + totalPnl.toFixed(2)} />
                <MetricCard label="ACTIVE NODES" value={`${activeCount}/${filteredSessions.length}`} />
                <MetricCard label="CHANNELS" value={String(positions.length)} />
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="p-12 flex flex-col items-center justify-center opacity-40">
                        <div className="w-8 h-8 rounded-full border-t-2 border-blue-500 animate-spin mb-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Warming up nodes...</span>
                    </div>
                ) : filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            positions={positions}
                            isActive={session.id === activeSessionId}
                            onSelect={() => setActiveSessionId(session.id)}
                        />
                    ))
                ) : (
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center">
                        <TrendingUp size={32} className="mx-auto text-white/10 mb-4" />
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            No sessions found for {activeExchange}. Config sessions to start trading.
                        </p>
                    </div>
                )}
            </div>

            {/* Debug Panel (Dev Only) */}
            {process.env.NODE_ENV === "development" && (
                <div className="mt-12 p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-[9px] text-[#9FB0C7]/40">
                    <h5 className="mb-2 text-[#9FB0C7]/20 uppercase">Internal Proxy Debug</h5>
                    <div className="space-y-1">
                        <div>ACTIVE_SESSION: {activeSessionId || 'NONE'}</div>
                        <div>POSITIONS_COUNT: {positions.length}</div>
                        <div>LAST_STATUS: {debugInfo?.status || 'N/A'}</div>
                        {debugInfo?.error && <div className="text-red-500/60 uppercase">ERROR: {debugInfo.error}</div>}
                        <div>UPSTREAM_SYNC: {lastUpdated}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
