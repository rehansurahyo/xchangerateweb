"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Users, Key, FileText, Settings, CreditCard, ShieldCheck, Search, Trash2, Power } from "lucide-react";
import { xcrClient } from "@/lib/xcrClient";

type AdminTab = 'users' | 'credentials' | 'logs' | 'settings' | 'billing';

export default function AdminPage() {
    const { supabase, user } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('users');
    const [data, setData] = useState<any>({
        users: [],
        credentials: [],
        tradesLogs: [],
        sessionsLogs: [],
        settings: [],
        billing: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [
                { data: profiles },
                sessionsRes,
                tradesRes,
                logsRes,
            ] = await Promise.all([
                supabase.from('profiles').select('*').order('created_at', { ascending: false }),
                xcrClient.getProxySessions(),
                xcrClient.getProxyTrades(),
                xcrClient.getProxyLogs(),
            ]);

            setData({
                users: profiles || [],
                credentials: sessionsRes.ok ? (sessionsRes.sessions || []) : [],
                tradesLogs: tradesRes.ok ? (tradesRes.trades || []) : [],
                sessionsLogs: logsRes.ok ? (logsRes.logs || []) : [],
                settings: [], // TODO: Add proxy for global settings
                billing: []   // TODO: Add proxy for billing
            });
        } catch (error) {
            console.error("Admin fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
        if (!confirm(`Toggle admin status for this user?`)) return;
        const { error } = await supabase
            .from('profiles')
            .update({ is_admin: !currentStatus })
            .eq('id', userId);
        if (!error) fetchData();
    };

    const handleDeleteCredential = async (id: string) => {
        if (!confirm("Are you sure? This is irreversible.")) return;
        const { error } = await supabase.from('api_credentials').delete().eq('id', id);
        if (!error) fetchData();
    };

    const handleToggleCredentialStatus = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
        const { error } = await supabase
            .from('api_credentials')
            .update({ status: nextStatus })
            .eq('id', id);
        if (!error) fetchData();
    };

    const tabs = [
        { id: 'users', label: 'Users', icon: Users },
        { id: 'credentials', label: 'Credentials', icon: Key },
        { id: 'logs', label: 'Logs', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'billing', label: 'Billing', icon: CreditCard },
    ];

    return (
        <div className="min-h-screen bg-background dark:bg-[#050A12] pt-24 px-6 md:px-12 pb-12 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <ShieldCheck size={20} className="text-blue-500" />
                        <h2 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Admin Control Panel</h2>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-[#9FB0C7]/40 uppercase tracking-widest leading-none">
                        System-wide management and overrides
                    </p>
                </div>
            </div>

            {/* Sidebar/Tabs Navigation */}
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-64 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as AdminTab)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                : 'text-slate-500 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex-1 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by email, username, or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-[#0A101A] border border-slate-200 dark:border-white/5 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-slate-950 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>

                    {/* Content Area */}
                    <div className="glass-card bg-white dark:bg-[#0A101A] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden min-h-[500px]">
                        {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-4 py-32">
                                <div className="w-8 h-8 rounded-full border-t-2 border-blue-600 animate-spin" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loading admin data...</span>
                            </div>
                        ) : (
                            <div className="p-6">
                                {activeTab === 'users' && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                                                    <th className="px-4 py-3">Email</th>
                                                    <th className="px-4 py-3">Username</th>
                                                    <th className="px-4 py-3">Plan</th>
                                                    <th className="px-4 py-3">Admin</th>
                                                    <th className="px-4 py-3">Joined</th>
                                                    <th className="px-4 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-white/[0.02]">
                                                {data.users.filter((u: any) => u.email?.includes(searchQuery)).map((u: any) => (
                                                    <tr key={u.id} className="text-[11px] font-bold hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                                                        <td className="px-4 py-4 text-slate-950 dark:text-white">{u.email}</td>
                                                        <td className="px-4 py-4 text-slate-500">{u.username || '—'}</td>
                                                        <td className="px-4 py-4">
                                                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[9px] uppercase tracking-widest">{u.billing_plan}</span>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className={`w-2 h-2 rounded-full inline-block ${u.is_admin ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/10'}`} />
                                                        </td>
                                                        <td className="px-4 py-4 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                                                        <td className="px-4 py-4 text-right">
                                                            <button
                                                                onClick={() => handleToggleAdmin(u.id, u.is_admin)}
                                                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5 text-[9px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                                                            >
                                                                {u.is_admin ? 'Demote' : 'Promote'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'credentials' && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                                                    <th className="px-4 py-3">User</th>
                                                    <th className="px-4 py-3">Name</th>
                                                    <th className="px-4 py-3">Exchange</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 dark:divide-white/[0.02]">
                                                {data.credentials.filter((c: any) => c.email?.includes(searchQuery)).map((c: any) => (
                                                    <tr key={c.id} className="text-[11px] font-bold hover:bg-slate-50/50 dark:hover:bg-white/[0.01]">
                                                        <td className="px-4 py-4 text-slate-950 dark:text-white">{c.email}</td>
                                                        <td className="px-4 py-4 text-slate-500">{c.name}</td>
                                                        <td className="px-4 py-4 text-orange-500">{c.exchange}</td>
                                                        <td className="px-4 py-4">
                                                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest ${c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                                {c.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-right space-x-2">
                                                            <button onClick={() => handleToggleCredentialStatus(c.id, c.status)} className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-all"><Power size={14} /></button>
                                                            <button onClick={() => handleDeleteCredential(c.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"><Trash2 size={14} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'logs' && (
                                    <div className="space-y-4">
                                        <div className="flex border-b border-slate-100 dark:border-white/5">
                                            <button className="px-6 py-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-blue-500 text-blue-500">Trades Log</button>
                                            <button className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Sessions Log</button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                                                        <th className="px-4 py-3">Email</th>
                                                        <th className="px-4 py-3">Symbol</th>
                                                        <th className="px-4 py-3">Side</th>
                                                        <th className="px-4 py-3">PnL</th>
                                                        <th className="px-4 py-3 text-right">Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 dark:divide-white/[0.02]">
                                                    {data.tradesLogs.filter((l: any) => l.email?.includes(searchQuery)).map((l: any) => (
                                                        <tr key={l.id} className="text-[11px] font-bold">
                                                            <td className="px-4 py-4 text-slate-950 dark:text-white">{l.email}</td>
                                                            <td className="px-4 py-4 text-slate-500">{l.symbol || '-'}</td>
                                                            <td className="px-4 py-4">{l.side || '-'}</td>
                                                            <td className="px-4 py-4 text-emerald-500">{l.pnl || '0'}</td>
                                                            <td className="px-4 py-4 text-right text-slate-500">{new Date(l.created_at).toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'settings' && (
                                    <div className="p-4 space-y-6">
                                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                                            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Global System Config</h4>
                                            <textarea
                                                className="w-full h-64 bg-transparent border-none focus:ring-0 text-xs font-mono text-slate-950 dark:text-white"
                                                defaultValue={JSON.stringify(data.settings[0]?.config || {}, null, 2)}
                                            />
                                            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Save Config</button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'billing' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {data.billing.map((b: any) => (
                                            <div key={b.id} className="p-6 border border-slate-200 dark:border-white/5 rounded-2xl space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tight">{b.name}</h4>
                                                    <span className="text-blue-500 font-bold">${b.price}</span>
                                                </div>
                                                <ul className="space-y-2">
                                                    {(b.features || []).map((f: string, idx: number) => (
                                                        <li key={idx} className="text-[10px] text-slate-500 uppercase tracking-widest list-disc ml-4">{f}</li>
                                                    ))}
                                                </ul>
                                                <button className="w-full py-2 border border-slate-200 dark:border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5">Edit Plan</button>
                                            </div>
                                        ))}
                                        <button className="p-6 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 transition-all">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Add New Plan</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
