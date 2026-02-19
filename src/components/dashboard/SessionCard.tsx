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
        <div className="glass-card hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all overflow-hidden border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A101A] shadow-sm dark:shadow-none">
            {/* Header */}
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 dark:hover:bg-white/[0.01] transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#22D3A6]" />
                        <span className="text-[12px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">{session.name}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded border border-emerald-500/30 dark:border-[#22D3A6]/30 text-[9px] font-black text-emerald-600 dark:text-[#22D3A6] uppercase tracking-widest leading-none bg-emerald-500/5 dark:bg-transparent">
                        AR
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2.5">
                        <span className="text-[11px] font-mono text-slate-400 dark:text-[#9FB0C7]/60">04:28:53</span>
                        <span className="text-[11px] font-black text-emerald-500 dark:text-[#22D3A6] uppercase tracking-widest">LIVE</span>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400 dark:text-[#9FB0C7]/40" /> : <ChevronDown size={16} className="text-slate-400 dark:text-[#9FB0C7]/40" />}
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 space-y-4">
                    {/* Secondary Header Details */}
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-slate-400 dark:text-[#9FB0C7]/20 uppercase tracking-[0.2em]">abc123xyz789de..</span>
                        <div className="flex items-center space-x-2">
                            <RefreshCcw size={10} className={isRunning ? 'text-emerald-500 dark:text-[#22D3A6] animate-spin-slow' : 'text-slate-300 dark:text-[#9FB0C7]/40'} />
                            <span className="text-[9px] font-black text-emerald-600 dark:text-[#22D3A6] uppercase tracking-widest leading-none">AR RUNNING</span>
                        </div>
                    </div>

                    {/* Balance Sheet Title */}
                    <div className="flex items-center justify-between border-y border-slate-100 dark:border-white/[0.03] py-2.5">
                        <h4 className="text-[11px] font-black text-slate-500 dark:text-[#9FB0C7]/40 uppercase tracking-[0.2em]">Balance Sheet</h4>
                        <div className="text-right flex items-center space-x-3">
                            <span className="text-[10px] font-black text-slate-400 dark:text-[#9FB0C7]/20 uppercase tracking-widest">Achieved</span>
                            <span className="text-sm font-black text-emerald-500 dark:text-[#22D3A6]">134.7%</span>
                            <span className="text-[10px] font-mono text-slate-500 dark:text-[#9FB0C7]/40">+2.9701</span>
                        </div>
                    </div>

                    {/* Stats List */}
                    <div className="space-y-2 px-0.5">
                        <div className="flex justify-between items-center text-[10px]">
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-yellow-500/60 dark:bg-yellow-400/60 rounded-sm" />
                                <span className="text-slate-500 dark:text-[#9FB0C7]/60 font-bold uppercase tracking-wider">Start Balance</span>
                            </div>
                            <span className="font-mono font-bold text-yellow-600/80 dark:text-yellow-400/80">44.09217381$</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-500/60 dark:bg-blue-400/60 rounded-sm" />
                                <span className="text-slate-500 dark:text-[#9FB0C7]/60 font-bold uppercase tracking-wider">Margin Balance</span>
                            </div>
                            <span className="font-mono font-bold text-blue-600/80 dark:text-blue-400/80">47.06227724</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-slate-400/60 dark:bg-white/10 rounded-sm" />
                                <span className="text-slate-500 dark:text-[#9FB0C7]/60 font-bold uppercase tracking-wider">Wallet Balance</span>
                            </div>
                            <span className="font-mono font-bold text-slate-700 dark:text-white/80">47.06227224$</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] pt-2 border-t border-slate-100 dark:border-white/[0.03]">
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500/60 dark:bg-[#22D3A6]/60 rounded-sm" />
                                <span className="text-emerald-600/80 dark:text-[#22D3A6]/80 font-bold uppercase tracking-wider">Unrealized P&L</span>
                            </div>
                            <span className="font-mono font-bold text-emerald-600 dark:text-[#22D3A6]">+2.97009843$</span>
                        </div>
                    </div>

                    {/* Trading Activity Table */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <h4 className="text-[10px] font-black text-slate-400 dark:text-[#9FB0C7]/40 uppercase tracking-[0.2em]">Open Positions</h4>
                                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-[9px] font-black text-slate-400 dark:text-[#9FB0C7]/20 uppercase">2</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-[10px] font-bold text-slate-300 dark:text-[#9FB0C7]/20 uppercase tracking-widest">Inactive</span>
                                <div className="w-10 h-5 rounded-full bg-slate-100 dark:bg-[#1A2333] relative border border-slate-200 dark:border-white/10 group-hover:border-blue-500/30 transition-colors">
                                    <div className="absolute right-1 top-1 w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden border border-slate-200 dark:border-white/[0.03] rounded-lg bg-slate-50 dark:bg-[#070B14]">
                            <table className="w-full border-collapse">
                                <thead className="bg-slate-100 dark:bg-[#0D121F] border-b border-slate-200 dark:border-white/[0.03]">
                                    <tr className="text-[10px] font-black text-slate-400 dark:text-[#9FB0C7]/20 uppercase tracking-widest">
                                        <th className="px-4 py-3 text-left w-12"></th>
                                        <th className="px-4 py-3 text-left">Symbol</th>
                                        <th className="px-4 py-3 text-left">Side</th>
                                        <th className="px-4 py-3 text-right">Entry</th>
                                        <th className="px-4 py-3 text-right">Amt</th>
                                        <th className="px-4 py-3 text-right">P&L</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.02]">
                                    {/* BTC Row */}
                                    <tr className="text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-white/[0.01]">
                                        <td className="px-4 py-4 text-center">
                                            <div className="w-5 h-5 rounded bg-white dark:bg-[#1A2333] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-[#9FB0C7]/40 text-xs shadow-sm dark:shadow-inner">
                                                −
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-slate-900 dark:text-white">BTC</span>
                                            <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.03] text-[9px] text-slate-400 dark:text-[#9FB0C7]/40">3</span>
                                        </td>
                                        <td className="px-4 py-4 text-emerald-600 dark:text-[#22D3A6]">LONG</td>
                                        <td className="px-4 py-4 text-right text-slate-900 dark:text-white">42,150.5</td>
                                        <td className="px-4 py-4 text-right text-slate-900 dark:text-white">21,075.25</td>
                                        <td className="px-4 py-4 text-right text-emerald-600 dark:text-[#22D3A6]">+2.34%</td>
                                    </tr>
                                    {/* Nested Row for BTC */}
                                    <tr className="bg-slate-50/50 dark:bg-[#090D18]">
                                        <td colSpan={6} className="px-8 py-3">
                                            <div className="grid grid-cols-5 gap-4 text-[9px] font-black text-slate-300 dark:text-[#9FB0C7]/30 uppercase tracking-widest border-b border-slate-100 dark:border-white/[0.02] pb-1.5">
                                                <span>Entry Price</span>
                                                <span>Qty</span>
                                                <span>P&L %</span>
                                                <span>Type</span>
                                                <span className="text-right">Opened</span>
                                            </div>
                                            <div className="grid grid-cols-5 gap-4 text-[10px] font-mono text-slate-500 dark:text-[#9FB0C7]/60 pt-2">
                                                <span>41,980.00</span>
                                                <span>0.2</span>
                                                <span className="text-emerald-600 dark:text-[#22D3A6]">+2.75%</span>
                                                <span>Market</span>
                                                <span className="text-right">09:15</span>
                                            </div>
                                            <div className="grid grid-cols-5 gap-4 text-[10px] font-mono text-slate-500 dark:text-[#9FB0C7]/60 pt-2">
                                                <span>42,250.00</span>
                                                <span>0.15</span>
                                                <span className="text-emerald-600 dark:text-[#22D3A6]">+2.11%</span>
                                                <span>Limit</span>
                                                <span className="text-right">09:32</span>
                                            </div>
                                            <div className="grid grid-cols-5 gap-4 text-[10px] font-mono text-slate-500 dark:text-[#9FB0C7]/60 pt-2">
                                                <span>42,320.00</span>
                                                <span>0.15</span>
                                                <span className="text-emerald-600 dark:text-[#22D3A6]">+1.94%</span>
                                                <span>Market</span>
                                                <span className="text-right">10:01</span>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* ETH Row */}
                                    <tr className="text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-white/[0.01]">
                                        <td className="px-4 py-4 text-center">
                                            <div className="w-5 h-5 rounded bg-white dark:bg-[#1A2333] border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 dark:text-[#9FB0C7]/40 text-xs shadow-sm dark:shadow-inner">
                                                +
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-slate-900 dark:text-white">ETH</span>
                                            <span className="ml-2 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.03] text-[9px] text-slate-400 dark:text-[#9FB0C7]/40">2</span>
                                        </td>
                                        <td className="px-4 py-4 text-emerald-600 dark:text-[#22D3A6]">LONG</td>
                                        <td className="px-4 py-4 text-right text-slate-900 dark:text-white">2,245.8</td>
                                        <td className="px-4 py-4 text-right text-slate-900 dark:text-white">5,614.5</td>
                                        <td className="px-4 py-4 text-right text-emerald-600 dark:text-[#22D3A6]">+1.87%</td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-slate-100 dark:bg-[#0D121F] border-t border-slate-200 dark:border-white/[0.03]">
                                    <tr className="text-[10px] font-black uppercase tracking-widest">
                                        <td colSpan={2} className="px-4 py-3 text-slate-300 dark:text-[#9FB0C7]/20 whitespace-nowrap">Total Exposure</td>
                                        <td colSpan={4} className="px-4 py-3 text-right text-slate-900 dark:text-white text-[12px]">$26,689.75</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Global Progress Bars Grouped */}
                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/[0.03]">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#9FB0C7]/40 leading-none">
                                <span>Margin Balance</span>
                                <span className="text-cyan-500 dark:text-[#22D3EE]">100.0%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-[#22D3EE] w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#9FB0C7]/40 leading-none">
                                <span>Wallet Balance</span>
                                <span className="text-emerald-500 dark:text-[#22D3A6]">100.0%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-emerald-600 dark:to-[#22D3A6] w-full" />
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded px-4 py-1.5 flex justify-between items-center">
                            <span className="text-[9px] font-black text-slate-300 dark:text-[#9FB0C7]/20 uppercase tracking-widest">0%</span>
                            <span className="text-[10px] font-black text-slate-400 dark:text-[#9FB0C7]/40 uppercase tracking-widest">Target: 47.06227224</span>
                            <span className="text-[9px] font-black text-slate-300 dark:text-[#9FB0C7]/20 uppercase tracking-widest">100%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Actions */}
            <div className="grid grid-cols-4 divide-x divide-slate-100 dark:divide-white/5 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050A12]">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`py-2 flex items-center justify-center space-x-2 text-[9px] font-black tracking-widest uppercase transition-all hover:bg-slate-200 dark:hover:bg-white/5 ${isRunning ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-[#22D3A6]'
                        }`}
                >
                    <span>{isRunning ? 'STOP' : 'START'}</span>
                </button>
                <button className="py-2 flex items-center justify-center space-x-2 text-slate-400 dark:text-[#9FB0C7] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 text-[9px] font-black tracking-widest uppercase transition-all">
                    <span>IPS</span>
                </button>
                <button className="py-2 flex items-center justify-center space-x-2 text-slate-400 dark:text-[#9FB0C7]/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 text-[9px] font-black tracking-widest uppercase transition-all">
                    <span>CLOSE</span>
                </button>
                <button className="py-2 flex items-center justify-center space-x-2 text-red-500/60 dark:text-red-900/40 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/5 text-[9px] font-black tracking-widest uppercase transition-all">
                    <span>DEL</span>
                </button>
            </div>
        </div>
    );
};

export default SessionCard;
