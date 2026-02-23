"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Settings2, ShieldCheck, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { dedupedToast } from "@/lib/toastDeduper";
import { NewSessionModal } from "@/components/dashboard/NewSessionModal";
import ConfigSessionCard from "@/components/dashboard/ConfigSessionCard";
import { xcrClient } from "@/lib/xcrClient";

export default function ApiConfigPage() {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchSessions = useCallback(async (showLoading = true) => {
        if (!user) return;
        if (showLoading) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const res = await xcrClient.getProxySessions();
            if (res.ok && res.sessions) {
                setSessions(res.sessions || []);
            } else {
                throw new Error(res.message || "Failed to fetch sessions");
            }
        } catch (err: any) {
            console.error("[ApiConfig] Error:", err);
            dedupedToast.error("Failed to fetch sessions");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchSessions();
        }
    }, [user, fetchSessions]);

    return (
        <div className="space-y-6 px-6 md:px-12 pb-10 pt-24 max-w-[1400px] mx-auto min-h-screen">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                        <Settings2 className="text-blue-500" size={20} />
                        API Infrastructure
                    </h2>
                    <p className="text-[10px] font-bold text-[#9FB0C7]/40 uppercase tracking-widest mt-1">
                        Configure exchange nodes and automated proxies
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchSessions(false)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all border border-white/5"
                    >
                        <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center gap-2 px-5 py-2.5 !rounded-xl text-[11px]"
                    >
                        <Plus size={16} />
                        CREATE NODE
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                    ))
                ) : sessions.length > 0 ? (
                    sessions.map((session) => (
                        <ConfigSessionCard
                            key={session.id}
                            session={session}
                            onUpdate={() => fetchSessions(false)}
                        />
                    ))
                ) : (
                    <div className="md:col-span-2 xl:col-span-3 py-20 bg-white/5 border border-dashed border-white/10 rounded-2xl text-center">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="text-blue-500" size={24} />
                        </div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">No API Nodes Configured</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                            Create your first session to start scanning exchange signals using our automated proxy network.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors"
                        >
                            + Add Primary Account
                        </button>
                    </div>
                )}
            </div>

            <NewSessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => fetchSessions(false)}
            />
        </div>
    );
}
