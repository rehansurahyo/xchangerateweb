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
        <div className="space-y-8 animate-in fade-in duration-500">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCard
                    label="P&L"
                    value="+2.97"
                    subValue=""
                    icon={TrendingUp}
                />
                <MetricCard
                    label="WALLET"
                    value="47.06"
                    subValue=""
                    icon={Wallet}
                />
            </div>

            {/* Sessions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                {filteredSessions.length > 0 ? (
                    filteredSessions.map(session => (
                        <SessionCard key={session.id} session={session} />
                    ))
                ) : (
                    <div className="col-span-full glass-card p-20 flex flex-col items-center justify-center text-center space-y-4 border border-white/5 bg-[#0A101A]">
                        <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-[#9FB0C7]/20">
                            <TrendingUp size={32} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-white font-bold uppercase tracking-widest">No Active Sessions</h4>
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
