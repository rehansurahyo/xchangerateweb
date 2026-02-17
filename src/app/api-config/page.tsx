"use client";

import { useState } from "react";
import { Plus, Power, RefreshCcw, X, Info, ShieldCheck, Trash2 } from "lucide-react";
import { MOCK_SESSIONS } from "@/lib/mock";

export default function ApiConfigPage() {
    const [sessions, setSessions] = useState(MOCK_SESSIONS);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xs font-black text-[#9FB0C7] uppercase tracking-[0.3em]">API Sessions</h2>
                    <p className="text-[10px] font-bold text-[#9FB0C7]/40 uppercase tracking-widest mt-1">
                        {sessions.length} configured · {sessions.filter(s => s.status === 'RUNNING').length} active
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 px-6 py-2 rounded-lg bg-[#1E293B] border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#1E293B]/80 transition-all"
                >
                    <Plus size={14} />
                    <span>Add</span>
                </button>
            </div>

            <div className="flex flex-col space-y-4">
                {sessions.map((session) => (
                    <div key={session.id} className="glass-card overflow-hidden border border-white/5 bg-[#0A101A] relative">
                        {/* Status Indicator Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${session.status === 'RUNNING' ? 'bg-[#22D3A6]' : 'bg-red-400'}`} />

                        <div className="p-0">
                            {/* Main Row */}
                            <div className="flex flex-col md:flex-row items-center border-b border-white/5">
                                <div className="flex-1 p-6 flex items-center space-x-4 w-full">
                                    <div className={`w-2 h-2 rounded-full ${session.status === 'RUNNING' ? 'bg-[#22D3A6]' : 'bg-[#9FB0C7]/40'}`} />
                                    <div>
                                        <span className="text-sm font-bold text-white block">{session.name}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${session.exchange === 'Binance' ? 'bg-yellow-400/10 text-yellow-400' :
                                            session.exchange === 'Bybit' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-400/10 text-blue-400'
                                        }`}>
                                        {session.exchange}
                                    </span>
                                </div>

                                <div className="p-6 flex items-center justify-between w-full md:w-auto md:space-x-12">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${session.status === 'RUNNING' ? 'text-[#22D3A6]' : 'text-[#9FB0C7]/40'}`}>
                                        {session.status}
                                    </span>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-white/[0.01]">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-[#9FB0C7]/40 font-bold uppercase tracking-widest">API Key</p>
                                    <p className="text-xs font-mono text-[#9FB0C7]">abc123xyz789...</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-[#9FB0C7]/40 font-bold uppercase tracking-widest">Exchange</p>
                                    <p className={`text-xs font-bold uppercase ${session.exchange === 'Binance' ? 'text-yellow-400' :
                                            session.exchange === 'Bybit' ? 'text-orange-500' : 'text-blue-400'
                                        }`}>{session.exchange}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-[#9FB0C7]/40 font-bold uppercase tracking-widest">Created</p>
                                    <p className="text-xs font-mono text-[#9FB0C7]">2026-02-10 14:30</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] text-[#9FB0C7]/40 font-bold uppercase tracking-widest">Total Trades</p>
                                    <p className="text-xs font-mono text-white">47</p>
                                </div>
                            </div>

                            {/* Detail Row Footer */}
                            <div className="px-6 py-4 flex items-center justify-between border-t border-white/5">
                                <div className="flex items-center space-x-3">
                                    <RefreshCcw size={12} className="text-[#22D3A6]" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Auto Restart</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] font-black text-[#22D3A6] uppercase tracking-widest">ON</span>
                                    <div className="w-8 h-4 bg-primary rounded-full relative">
                                        <div className="absolute right-1 top-1 bottom-1 w-2 bg-white rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex border-t border-white/5 divide-x divide-white/5 bg-[#050A12]">
                                <button className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors ${session.status === 'RUNNING' ? 'text-yellow-400' : 'text-[#22D3A6]'
                                    }`}>
                                    {session.status === 'RUNNING' ? 'STOP' : 'START'}
                                </button>
                                <button className="flex-1 py-3 text-[10px] font-black text-[#9FB0C7] uppercase tracking-widest hover:bg-white/5 hover:text-white transition-colors">
                                    IPS
                                </button>
                                <button className="flex-1 py-3 text-[10px] font-black text-[#9FB0C7]/60 uppercase tracking-widest hover:bg-white/5 hover:text-white transition-colors">
                                    CLOSE
                                </button>
                                <button className="flex-1 py-3 text-[10px] font-black text-red-500/60 uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-colors">
                                    DEL
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050A12]/90 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-[500px] bg-[#0F172A] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0F172A]">
                            <h3 className="text-sm font-bold text-white">New Session</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-[#9FB0C7] hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-xs text-[#9FB0C7] mb-6">Name your session, select an exchange, and enter API credentials.</p>
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-[#9FB0C7] uppercase">Account Name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Primary BTC, Scalp Session"
                                        className="w-full bg-[#1E293B] border border-blue-500/50 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-[#9FB0C7]/40"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-[#9FB0C7] uppercase">Exchange</label>
                                    <select className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none">
                                        <option>Binance</option>
                                        <option>Bybit</option>
                                        <option>OKX</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-[#9FB0C7] uppercase">API Key</label>
                                    <input
                                        type="password"
                                        placeholder="Enter API key"
                                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-[#9FB0C7]/40"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold tracking-widest text-[#9FB0C7] uppercase">API Secret</label>
                                    <input
                                        type="password"
                                        placeholder="Enter API secret"
                                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-[#9FB0C7]/40"
                                    />
                                </div>

                                <button type="submit" className="w-full py-3 bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 rounded-lg text-white text-sm font-bold transition-all shadow-lg shadow-blue-900/20">
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
