"use client";

import { useState, useEffect } from "react";
import { Plus, X, RefreshCcw, Trash2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function SessionsPage() {
    const { supabase } = useAuth();
    const [sessions, setSessions] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        exchange: 'Binance',
        apiKey: '',
        apiSecret: '',
        target_percent: 100
    });

    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/sessions');
            const data = await res.json();
            if (data.data) {
                setSessions(data.data);
            }
        } catch (error) {
            console.error("Error fetching sessions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleCreateSession = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.data) {
                setShowModal(false);
                setFormData({ name: '', exchange: 'Binance', apiKey: '', apiSecret: '', target_percent: 100 });
                fetchSessions();
            } else if (data.error) {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error creating session:", error);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        try {
            const res = await fetch(`/api/sessions/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) fetchSessions();
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this session?")) return;
        try {
            const { error } = await supabase
                .from('api_credentials')
                .delete()
                .eq('id', id);
            if (!error) fetchSessions();
        } catch (error) {
            console.error("Error deleting session:", error);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pt-20 px-6 max-w-[1000px] mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-[10px] font-black text-slate-500 dark:text-[#9FB0C7] uppercase tracking-[0.3em]">API Sessions</h2>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-[#9FB0C7]/40 uppercase tracking-widest mt-0.5">
                        {isLoading ? 'Loading...' : `${sessions.length} configured · ${sessions.filter(s => s.status === 'Active').length} active`}
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-[#1E293B] border border-slate-700 dark:border-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-[#1E293B]/80 transition-all shadow-lg shadow-blue-500/10"
                >
                    <Plus size={12} />
                    <span>Add Connection</span>
                </button>
            </div>

            <div className="flex flex-col space-y-4">
                {sessions.map((session) => (
                    <div key={session.id} className="glass-card overflow-hidden border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A101A] relative group">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${session.status === 'Active' ? 'bg-emerald-500 dark:bg-[#22D3A6]' : 'bg-slate-300 dark:bg-white/10'}`} />

                        <div className="p-0">
                            <div className="flex flex-col md:flex-row items-center border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
                                <div className="flex-1 p-3 flex items-center space-x-3 w-full">
                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${session.status === 'Active' ? 'bg-emerald-500 dark:bg-[#22D3A6]' : 'bg-slate-300 dark:bg-[#9FB0C7]/40'}`} />
                                    <div>
                                        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{session.name}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${session.exchange === 'Binance' ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' :
                                        session.exchange === 'Bybit' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                                        }`}>
                                        {session.exchange}
                                    </span>
                                </div>

                                <div className="p-3 flex items-center justify-between w-full md:w-auto md:space-x-8">
                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${session.status === 'Active' ? 'text-emerald-500 dark:text-[#22D3A6]' : 'text-slate-400 dark:text-[#9FB0C7]/40'}`}>
                                        {session.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                                <div className="space-y-1">
                                    <p className="text-[8px] text-slate-400 dark:text-[#9FB0C7]/40 font-black uppercase tracking-widest">API Key Masked</p>
                                    <p className="text-[10px] font-mono font-bold text-slate-600 dark:text-[#9FB0C7]">{session.api_key_masked}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] text-slate-400 dark:text-[#9FB0C7]/40 font-black uppercase tracking-widest">Allocation %</p>
                                    <p className="text-[10px] font-black text-slate-900 dark:text-white">{session.target_percent}%</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] text-slate-400 dark:text-[#9FB0C7]/40 font-black uppercase tracking-widest">Active Since</p>
                                    <p className="text-[10px] font-bold text-slate-600 dark:text-[#9FB0C7]">{new Date(session.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center justify-end space-x-2">
                                    <button
                                        onClick={() => handleToggleStatus(session.id, session.status)}
                                        className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${session.status === 'Active'
                                            ? 'bg-yellow-500/5 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/10'
                                            : 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10'
                                            }`}>
                                        {session.status === 'Active' ? 'Stop' : 'Start'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(session.id)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/5 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/90 dark:bg-[#050A12]/90 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-[500px] bg-white dark:bg-[#0F172A] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5">
                        <div className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#0F172A]">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">New Session</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 dark:text-[#9FB0C7] hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form className="space-y-6" onSubmit={handleCreateSession}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-[#9FB0C7] uppercase">Account Name</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 rounded-lg py-3 px-4 text-slate-900 dark:text-white text-sm"
                                    />
                                </div>
                                {/* ... Other fields ... */}
                                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-bold transition-all">
                                    Create Session
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
