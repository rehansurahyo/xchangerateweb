"use client";

import { useState } from "react";
import { RefreshCcw, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { xcrClient } from "@/lib/xcrClient";

interface SessionCardProps {
    session: any;
    positions: any[];
    isActive?: boolean;
    onSelect?: () => void;
}

const SessionCard = ({ session, positions, isActive, onSelect }: SessionCardProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const snapshot = session.latest_snapshot;
    const isRunning = session.status === 'Active';

    const num = (v: any) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    };

    const walletBalance = snapshot ? num(snapshot.totalWalletBalance) : 0;
    const unrealizedPnl = snapshot ? num(snapshot.totalUnrealizedProfit) : 0;

    // Merge positions from snapshot if available
    const displayPositions = snapshot?.positions || [];
    const totalExposure = displayPositions.reduce((acc: number, p: any) => acc + (Math.abs(num(p.positionAmt)) * num(p.entryPrice)), 0);

    const [isLoadingToggle, setIsLoadingToggle] = useState(false);

    const handleToggleStatus = async () => {
        setIsLoadingToggle(true);
        try {
            const nextStatus = isRunning ? 'Paused' : 'Active';
            // Use the centralized updateProxySession via proxy route
            const res = await xcrClient.post(`/api/proxy/sessions/update`, { id: session.id, status: nextStatus });
            if (!res.ok) throw new Error(res.error || 'Failed to toggle status');
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingToggle(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this session?')) return;
        try {
            const res = await xcrClient.post(`/api/proxy/sessions/delete`, { id: session.id });
            if (!res.ok) throw new Error(res.error || 'Failed to delete session');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            onClick={onSelect}
            className={`glass-card transition-all overflow-hidden border ${isActive ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-slate-200 dark:border-white/5'} cursor-pointer bg-white dark:bg-[#0A101A] shadow-sm dark:shadow-none hover:bg-slate-50 dark:hover:bg-white/[0.02]`}
        >
            {/* Header */}
            <div
                className="p-4 flex items-center justify-between"
            >
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500 dark:bg-[#22D3A6]' : 'bg-red-500'}`} />
                        <span className="text-[12px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">{session.name}</span>
                        {isActive && <CheckCircle2 size={12} className="text-blue-500 ml-1" />}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2.5">
                        <span className="text-[11px] font-mono text-slate-900 dark:text-[#9FB0C7]/60">{session.uptime || '00d 00h 00m'}</span>
                        <span className={`text-[11px] font-black ${isRunning ? 'text-emerald-500 dark:text-[#22D3A6]' : 'text-slate-900 dark:text-white/40'} uppercase tracking-widest`}>
                            {isRunning ? 'LIVE' : 'OFFLINE'}
                        </span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-white/5 rounded"
                    >
                        {isExpanded ? <ChevronUp size={16} className="text-slate-900 dark:text-[#9FB0C7]/40" /> : <ChevronDown size={16} className="text-slate-900 dark:text-[#9FB0C7]/40" />}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 pt-0 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-slate-900 dark:text-[#9FB0C7]/20 uppercase tracking-[0.2em]">{session.api_key_masked}</span>
                        <div className="flex items-center space-x-2">
                            <RefreshCcw size={10} className={isRunning ? 'text-emerald-500 dark:text-[#22D3A6] animate-spin-slow' : 'text-slate-900 dark:text-[#9FB0C7]/40'} />
                            <span className={`text-[9px] font-black ${isRunning ? 'text-emerald-600 dark:text-[#22D3A6]' : 'text-slate-900'} uppercase tracking-widest leading-none`}>
                                {isRunning ? 'AR RUNNING' : 'AR STOPPED'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-y border-slate-100 dark:border-white/[0.03] py-2.5">
                        <h4 className="text-[11px] font-black text-slate-900 dark:text-[#9FB0C7]/40 uppercase tracking-[0.2em]">Balance Sheet</h4>
                        <div className="text-right flex items-center space-x-3">
                            <span className="text-[10px] font-black text-slate-900 dark:text-[#9FB0C7]/20 uppercase tracking-widest">PnL</span>
                            <span className={`text-sm font-black ${unrealizedPnl >= 0 ? 'text-emerald-500 dark:text-[#22D3A6]' : 'text-red-500'}`}>
                                {unrealizedPnl >= 0 ? '+' : ''}{unrealizedPnl.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2 px-0.5">
                        <div className="flex justify-between items-center text-[10px]">
                            <div className="flex items-center space-x-2">
                                <span className="text-slate-900 dark:text-[#9FB0C7]/60 font-bold uppercase tracking-wider">Balance</span>
                            </div>
                            <span className="font-mono font-bold text-slate-900 dark:text-white/80">${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px]">
                            <div className="flex items-center space-x-2">
                                <span className="text-slate-900 dark:text-[#9FB0C7]/60 font-bold uppercase tracking-wider">Unrealized P&L</span>
                            </div>
                            <span className={`font-mono font-bold ${unrealizedPnl >= 0 ? 'text-emerald-600 dark:text-[#22D3A6]' : 'text-red-500'}`}>
                                {unrealizedPnl >= 0 ? '+' : ''}${unrealizedPnl.toFixed(4)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-slate-900 dark:text-[#9FB0C7]/40 uppercase tracking-[0.2em]">Open Positions</h4>
                        </div>

                        <div className="overflow-hidden border border-slate-200 dark:border-white/[0.03] rounded-lg bg-slate-50 dark:bg-[#070B14]">
                            <table className="w-full border-collapse text-[10px]">
                                <thead className="bg-slate-100 dark:bg-[#0D121F] border-b border-slate-200 dark:border-white/[0.03]">
                                    <tr className="text-[9px] font-black text-slate-900 dark:text-[#9FB0C7]/20 uppercase tracking-widest">
                                        <th className="px-3 py-2 text-left">Symbol</th>
                                        <th className="px-3 py-2 text-left">Side</th>
                                        <th className="px-3 py-2 text-right">Size</th>
                                        <th className="px-3 py-2 text-right">PnL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.02]">
                                    {isActive ? (
                                        positions.map((pos: any, idx: number) => {
                                            const posPnl = num(pos.unRealizedProfit ?? pos.unrealizedProfit);
                                            const posAmt = num(pos.positionAmt);
                                            const side = posAmt >= 0 ? "LONG" : "SHORT";
                                            return (
                                                <tr key={idx} className="font-bold hover:bg-slate-100 dark:hover:bg-white/[0.01]">
                                                    <td className="px-3 py-3 text-slate-900 dark:text-white">{pos.symbol}</td>
                                                    <td className={`px-3 py-3 ${side === 'LONG' ? 'text-emerald-600 dark:text-[#22D3A6]' : 'text-red-500'}`}>{side}</td>
                                                    <td className="px-3 py-3 text-right text-slate-900 dark:text-white">{Math.abs(posAmt).toFixed(3)}</td>
                                                    <td className={`px-3 py-3 text-right ${posPnl >= 0 ? 'text-emerald-600 dark:text-[#22D3A6]' : 'text-red-500'}`}>
                                                        ${posPnl.toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-3 py-6 text-center text-slate-400 dark:text-white/10 uppercase tracking-widest text-[9px]">Select session to view live positions</td>
                                        </tr>
                                    )}
                                    {isActive && positions.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-3 py-6 text-center text-slate-950 dark:text-white/20 uppercase tracking-widest">No open positions</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Actions */}
            <div className="grid grid-cols-4 divide-x divide-slate-100 dark:divide-white/5 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050A12]">
                <button
                    onClick={(e) => { e.stopPropagation(); handleToggleStatus(); }}
                    disabled={isLoadingToggle}
                    className={`py-2 flex items-center justify-center text-[9px] font-black tracking-widest uppercase transition-all hover:bg-slate-200 dark:hover:bg-white/5 ${isRunning ? 'text-red-400' : 'text-emerald-500'} disabled:opacity-50`}
                >
                    {isLoadingToggle ? '...' : (isRunning ? 'STOP' : 'START')}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="py-2 text-slate-950 dark:text-[#9FB0C7] hover:bg-slate-200 dark:hover:bg-white/5 text-[9px] font-black tracking-widest uppercase transition-all"
                >
                    IPS
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="py-2 text-slate-950 dark:text-[#9FB0C7] hover:bg-slate-200 dark:hover:bg-white/5 text-[9px] font-black tracking-widest uppercase transition-all"
                >
                    LOGS
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                    className="py-2 text-red-900/40 hover:text-red-400 hover:bg-red-400/5 text-[9px] font-black tracking-widest uppercase transition-all"
                >
                    DEL
                </button>
            </div>
        </div>
    );
};

export default SessionCard;
