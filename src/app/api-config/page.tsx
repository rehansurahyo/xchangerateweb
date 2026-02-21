"use client";

import { useEffect, useState } from "react";
import { Plus, Settings2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import ConfigSessionCard from "@/components/dashboard/ConfigSessionCard";
import { NewSessionModal } from "@/components/dashboard/NewSessionModal";

export default function ApiConfigPage() {
    const { supabase, user } = useAuth();
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchSessions = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/sessions");
            const data = await res.json();
            if (data.data) {
                setSessions(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch sessions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;

        fetchSessions();

        // Subscribing to generic credential changes
        const channel = supabase
            .channel('api_config_updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'api_credentials',
                filter: `user_id=eq.${user.id}`
            }, () => {
                fetchSessions();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, supabase]);

    const activeCount = sessions.filter(s => s.status === 'Active').length;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 px-6 md:px-12 min-h-screen bg-background dark:bg-[#050A12] pb-10 pt-24">
            {/* Header Area */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <Settings2 size={16} className="text-blue-500" />
                        <h2 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">API Sessions</h2>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-[#9FB0C7]/40 uppercase tracking-widest leading-none">
                        {sessions.length} configured • {activeCount} active
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
                >
                    <Plus size={14} />
                    <span>Add</span>
                </button>
            </div>

            {/* Sessions List */}
            <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                        <div className="w-8 h-8 rounded-full border-t-2 border-blue-600 animate-spin" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loading sessions...</span>
                    </div>
                ) : sessions.length > 0 ? (
                    <div className="flex flex-col space-y-6 w-full">
                        {sessions.map((session) => (
                            <ConfigSessionCard
                                key={session.id}
                                session={session}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-16 flex flex-col items-center justify-center text-center space-y-4 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A101A]">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-[#9FB0C7]/20">
                            <Settings2 size={24} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-slate-950 dark:text-white text-[11px] font-bold uppercase tracking-widest">No API Sessions</h4>
                            <p className="text-xs text-slate-500 dark:text-[#9FB0C7]/40 max-w-[280px]">
                                Connect your first exchange API to start AI-driven performance tracking.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <NewSessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchSessions}
            />
        </div>
    );
}
