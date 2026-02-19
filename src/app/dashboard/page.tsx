"use client";

import { useState } from "react";
import { Wallet, LineChart, TrendingUp, History, Play } from "lucide-react";
import ExchangeTabs from "@/components/dashboard/ExchangeTabs";
import MetricCard from "@/components/dashboard/MetricCard";
import SessionCard from "@/components/dashboard/SessionCard";
import { MOCK_SESSIONS } from "@/lib/mock";

export default function DashboardPage() {
    const [activeExchange, setActiveExchange] = useState<'Binance' | 'Bybit' | 'OKX'>('Binance');

    const filteredSessions = MOCK_SESSIONS.filter(s => s.exchange === activeExchange);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 px-6 md:px-12 min-h-screen bg-background dark:bg-[#050A12] pb-10">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                {/* Placeholder for left side if needed */}
                <div />
                {/* <ExchangeTabs 
          activeExchange={activeExchange} 
          onExchangeChange={setActiveExchange} 
        /> */}
            </div>

            <ExchangeTabs
                activeExchange={activeExchange}
                onExchangeChange={setActiveExchange}
            />

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    label="P&L"
                    value="+2.97"
                />
                <MetricCard
                    label="WALLET"
                    value="47.06"
                />
                <MetricCard
                    label="SESSIONS"
                    value="1 / 1 live"
                />
                <MetricCard
                    label="POSITIONS"
                    value="2"
                />
            </div>

            {/* Account Summary Header */}
            <div className="flex items-center justify-between pt-6 pb-2">
                <div className="flex items-center space-x-3">
                    <h3 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Account Summary</h3>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-[9px] font-black text-slate-500 dark:text-[#9FB0C7]/40 uppercase tracking-widest leading-none">
                        {filteredSessions.length} session
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-[#9FB0C7]/40 uppercase tracking-widest leading-none">Combined P&L: </span>
                    <span className="text-[11px] font-bold text-emerald-500 dark:text-[#22D3A6] tracking-tighter ml-1">+2.9701</span>
                </div>
            </div>

            {/* Sessions Grid */}
            <div className="space-y-6">
                {filteredSessions.length > 0 ? (
                    filteredSessions.map(session => (
                        <div key={session.id} className="space-y-6">
                            <SessionCard session={session} />


                            {/* Trading Activity Section Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <h3 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">Trading Activity</h3>
                                    <div className="flex items-center space-x-3">
                                        <span className="px-2 py-0.5 rounded-md bg-[#1A2333] border border-white/5 text-[9px] font-black text-white/60 uppercase tracking-widest">2 positions</span>
                                        <div className="flex items-center space-x-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#22D3A6]" />
                                            <span className="text-[10px] font-black text-[#22D3A6] uppercase tracking-widest">Live</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] font-bold text-[#9FB0C7]/40 uppercase tracking-widest leading-none">Total Exposure: </span>
                                    <span className="text-[12px] font-black text-white tracking-tighter ml-1">$26,689.75</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full glass-card p-12 flex flex-col items-center justify-center text-center space-y-3 border border-white/5 bg-[#0A101A]">
                        <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-[#9FB0C7]/20">
                            <TrendingUp size={24} />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-white text-[11px] font-bold uppercase tracking-widest">No Active Sessions</h4>
                            <p className="text-xs text-[#9FB0C7]/40 max-w-[300px]">
                                Connect your API keys and deploy an AI strategy to start trading on {activeExchange}.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
