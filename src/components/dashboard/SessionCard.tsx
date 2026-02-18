"use client";

import { useState } from "react";
import { MoreVertical, RefreshCcw, X, Info, ChevronDown, ChevronUp } from "lucide-react";
import { TradingSession } from "@/lib/mock";

interface SessionCardProps {
    session: TradingSession;
}

const SessionCard = ({ session }: SessionCardProps) => {
    const [isRunning, setIsRunning] = useState(session.status === 'RUNNING');
    const [autoRestart, setAutoRestart] = useState(true);
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="glass-card hover:bg-white/[0.02] transition-all overflow-hidden border border-white/5 bg-[#0A101A]">
            {/* Header */}
            <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isRunning ? 'bg-[#22D3A6]' : 'bg-red-400'}`} />
                    <span className="text-xs font-black text-white uppercase tracking-wider">{session.name}</span>
                    <span className="bg-[#22D3A6]/10 text-[#22D3A6] text-[7px] font-black px-1 py-0.5 rounded border border-[#22D3A6]/20">AR</span>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-[9px] font-mono text-[#9FB0C7]/60 tracking-widest">{session.uptime}</span>
                    {isRunning && <span className="text-[9px] font-black text-[#22D3A6] uppercase tracking-widest">LIVE</span>}
                    <button onClick={() => setIsExpanded(!isExpanded)} className="text-[#9FB0C7]/40 hover:text-white">
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 space-y-4">
                    {/* Secondary Header Details */}
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-[#9FB0C7]/40 tracking-widest">abc123xyz789de..</span>
                        <div className="flex items-center space-x-1.5">
                            <RefreshCcw size={9} className={isRunning ? 'text-[#22D3A6] animate-spin-slow' : 'text-[#9FB0C7]/40'} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#9FB0C7]/60">AR Running</span>
                        </div>
                    </div>

                    {/* Balance Sheet Header */}
                    <div className="flex items-end justify-between border-b border-white/5 pb-1.5">
                        <h4 className="text-[9px] font-black text-[#9FB0C7] uppercase tracking-[0.2em]">Balance Sheet</h4>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-[#9FB0C7]/40 uppercase tracking-widest">Achieved</p>
                            <div className="flex items-baseline space-x-1">
                                <span className="text-base font-black text-[#22D3A6]">134.7%</span>
                                <span className="text-[9px] font-mono text-[#9FB0C7]/60">+2.9701</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[11px]">
                            <div className="flex items-center space-x-1.5">
                                <div className="w-1 h-1 bg-yellow-400 rounded-sm" />
                                <span className="text-[#9FB0C7] font-medium">Start Balance</span>
                            </div>
                            <span className="font-mono font-bold text-yellow-400">44.09217381$</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                            <div className="flex items-center space-x-1.5">
                                <div className="w-1 h-1 bg-blue-400 rounded-sm" />
                                <span className="text-[#9FB0C7] font-medium">Margin Balance</span>
                            </div>
                            <span className="font-mono font-bold text-blue-400">47.06227724</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                            <div className="flex items-center space-x-1.5">
                                <div className="w-1 h-1 bg-[#9FB0C7] rounded-sm" />
                                <span className="text-[#9FB0C7] font-medium">Wallet Balance</span>
                            </div>
                            <span className="font-mono font-bold text-white">47.0622/224$</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] pt-1.5 border-t border-white/5">
                            <div className="flex items-center space-x-1.5">
                                <div className="w-1 h-1 bg-[#22D3A6] rounded-sm" />
                                <span className="text-[#22D3A6] font-medium">Unrealized P&L</span>
                            </div>
                            <span className="font-mono font-bold text-[#22D3A6]">+2.97009843$</span>
                        </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-3 pt-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1.5">
                                <RefreshCcw size={9} className="text-[#22D3A6]" />
                                <span className="text-[9px] font-black text-[#22D3A6] uppercase tracking-widest">Auto Restart</span>
                            </div>
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Progress to Target: 5%</span>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[7px] font-black uppercase tracking-widest text-[#9FB0C7]/40">
                                <span>Margin Balance</span>
                                <span>100.0%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[7px] font-black uppercase tracking-widest text-[#9FB0C7]/40">
                                <span>Wallet Balance</span>
                                <span>100.0%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#22D3A6] w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Actions */}
            <div className="grid grid-cols-4 divide-x divide-white/5 border-t border-white/5 bg-[#050A12]">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`py-2 flex items-center justify-center space-x-2 text-[9px] font-black tracking-widest uppercase transition-all hover:bg-white/5 ${isRunning ? 'text-red-400' : 'text-[#22D3A6]'
                        }`}
                >
                    <span>{isRunning ? 'STOP' : 'START'}</span>
                </button>
                <button className="py-2 flex items-center justify-center space-x-2 text-[#9FB0C7] hover:text-white hover:bg-white/5 text-[9px] font-black tracking-widest uppercase transition-all">
                    <span>IPS</span>
                </button>
                <button className="py-2 flex items-center justify-center space-x-2 text-[#9FB0C7]/60 hover:text-white hover:bg-white/5 text-[9px] font-black tracking-widest uppercase transition-all">
                    <span>CLOSE</span>
                </button>
                <button className="py-2 flex items-center justify-center space-x-2 text-red-900/40 hover:text-red-400 hover:bg-red-400/5 text-[9px] font-black tracking-widest uppercase transition-all">
                    <span>DEL</span>
                </button>
            </div>
        </div>
    );
};

export default SessionCard;
