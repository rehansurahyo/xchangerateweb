"use client";

import { useState } from "react";
import { Plus, Power, RefreshCcw, X, Info, ShieldCheck, Trash2 } from "lucide-react";
import { MOCK_SESSIONS } from "@/lib/mock";

export default function ApiConfigPage() {
    const [sessions, setSessions] = useState(MOCK_SESSIONS);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-[10px] font-black text-slate-500 dark:text-[#9FB0C7] uppercase tracking-[0.3em]">API Sessions</h2>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-[#9FB0C7]/40 uppercase tracking-widest mt-0.5">
                        {sessions.length} configured · {sessions.filter(s => s.status === 'RUNNING').length} active
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-[#1E293B] border border-slate-700 dark:border-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-[#1E293B]/80 transition-all"
                >
                    <Plus size={12} />
                    <span>Add</span>
                </button>
            </div>

            <div className="flex flex-col space-y-4">
                {sessions.map((session) => (
                    <div key={session.id} className="glass-card overflow-hidden border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A101A] relative">
                        {/* Status Indicator Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${session.status === 'RUNNING' ? 'bg-emerald-500 dark:bg-[#22D3A6]' : 'bg-red-500 dark:bg-red-400'}`} />

                        <div className="p-0">
                            {/* Main Row */}
                            <div className="flex flex-col md:flex-row items-center border-b border-slate-200 dark:border-white/5">
                                <div className="flex-1 p-3 flex items-center space-x-3 w-full">
                                    <div className={`w-1.5 h-1.5 rounded-full ${session.status === 'RUNNING' ? 'bg-emerald-500 dark:bg-[#22D3A6]' : 'bg-slate-300 dark:bg-[#9FB0C7]/40'}`} />
                                    <div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white block">{session.name}</span>
                                    </div>
                                    <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${session.exchange === 'Binance' ? 'bg-yellow-500/10 dark:bg-yellow-400/10 text-yellow-600 dark:text-yellow-400' :
                                        session.exchange === 'Bybit' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-500' : 'bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400'
                                        }`}>
                                        {session.exchange}
                                    </span>
                                </div>

                                <div className="p-3 flex items-center justify-between w-full md:w-auto md:space-x-8">
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${session.status === 'RUNNING' ? 'text-emerald-500 dark:text-[#22D3A6]' : 'text-slate-400 dark:text-[#9FB0C7]/40'}`}>
                                        {session.status}
                                    </span>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-white/[0.01]">
                                <div className="space-y-1">
                                    <p className="text-[9px] text-slate-400 dark:text-[#9FB0C7]/40 font-bold uppercase tracking-widest">API Key</p>
                                    <p className="text-[11px] font-mono text-slate-600 dark:text-[#9FB0C7]">abc123xyz789...</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] text-slate-400 dark:text-[#9FB0C7]/40 font-bold uppercase tracking-widest">Exchange</p>
                                    <p className={`text-[11px] font-bold uppercase ${session.exchange === 'Binance' ? 'text-yellow-600 dark:text-yellow-400' :
                                        session.exchange === 'Bybit' ? 'text-orange-600 dark:text-orange-500' : 'text-blue-600 dark:text-blue-400'
                                        }`}>{session.exchange}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] text-slate-400 dark:text-[#9FB0C7]/40 font-bold uppercase tracking-widest">Created</p>
                                    <p className="text-[11px] font-mono text-slate-600 dark:text-[#9FB0C7]">2026-02-10 14:30</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[9px] text-slate-400 dark:text-[#9FB0C7]/40 font-bold uppercase tracking-widest">Total Trades</p>
                                    <p className="text-[11px] font-mono text-slate-900 dark:text-white">47</p>
                                </div>
                            </div>

                            {/* Detail Row Footer */}
                            <div className="px-4 py-3 flex items-center justify-between border-t border-slate-200 dark:border-white/5">
                                <div className="flex items-center space-x-2">
                                    <RefreshCcw size={10} className="text-emerald-500 dark:text-[#22D3A6]" />
                                    <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Auto Restart</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-[9px] font-black text-emerald-500 dark:text-[#22D3A6] uppercase tracking-widest">ON</span>
                                    <div className="w-7 h-3.5 bg-blue-600 dark:bg-primary rounded-full relative">
                                        <div className="absolute right-0.5 top-0.5 bottom-0.5 w-2.5 bg-white rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex border-t border-slate-200 dark:border-white/5 divide-x divide-slate-200 dark:divide-white/5 bg-slate-50 dark:bg-[#050A12]">
                                <button className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${session.status === 'RUNNING' ? 'text-yellow-600 dark:text-yellow-400' : 'text-emerald-500 dark:text-[#22D3A6]'
                                    }`}>
                                    {session.status === 'RUNNING' ? 'STOP' : 'START'}
                                </button>
                                <button className="flex-1 py-2 text-[9px] font-black text-slate-500 dark:text-[#9FB0C7] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors">
                                    IPS
                                </button>
                                <button className="flex-1 py-2 text-[9px] font-black text-slate-500 dark:text-[#9FB0C7]/60 uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors">
                                    CLOSE
                                </button>
                                <button className="flex-1 py-2 text-[9px] font-black text-red-500/60 uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                                    DEL
                                </button>
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
                            <p className="text-xs text-slate-500 dark:text-[#9FB0C7] mb-6">Name your session, select an exchange, and enter API credentials.</p>
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-[#9FB0C7] uppercase">Account Name <span className="text-red-500 dark:text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Primary BTC, Scalp Session"
                                        className="w-full bg-slate-50 dark:bg-[#1E293B] border border-blue-500/50 rounded-lg py-3 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-[#9FB0C7]/40"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-[#9FB0C7] uppercase">Exchange</label>
                                    <select className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg py-3 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none">
                                        <option>Binance</option>
                                        <option>Bybit</option>
                                        <option>OKX</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-[#9FB0C7] uppercase">API Key</label>
                                    <input
                                        type="password"
                                        placeholder="Enter API key"
                                        className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg py-3 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-[#9FB0C7]/40"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-slate-500 dark:text-[#9FB0C7] uppercase">API Secret</label>
                                    <input
                                        type="password"
                                        placeholder="Enter API secret"
                                        className="w-full bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg py-3 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-[#9FB0C7]/40"
                                    />
                                </div>

                                <button type="submit" className="w-full py-3 bg-blue-600 dark:bg-[#1D4ED8] hover:bg-blue-700 dark:hover:bg-[#1D4ED8]/90 rounded-lg text-white text-sm font-bold transition-all shadow-lg shadow-blue-900/20">
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
