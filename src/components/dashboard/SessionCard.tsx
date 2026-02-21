"use client";

import { useState } from "react";
import { RefreshCcw, ChevronDown, ChevronUp } from "lucide-react";

interface SessionCardProps {
    session: any;
    positions: any[];
}

const SessionCard = ({ session, positions }: SessionCardProps) => {
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
            const nextStatus = isRunning ? 'Inactive' : 'Active';
            const res = await fetch(`/api/sessions/${session.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });
            if (!res.ok) throw new Error('Failed to toggle status');
            // UI will update via Supabase Realtime if subscribed, or via parent refresh
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingToggle(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this session?')) return;
        try {
            const res = await fetch(`/api/sessions/${session.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete session');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="glass-card hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all overflow-hidden border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A101A] shadow-sm dark:shadow-none">
            {/* Header */}
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 dark:hover:bg-white/[0.01] transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500 dark:bg-[#22D3A6]' : 'bg-red-500'}`} />
                        <span className="text-[12px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">{session.name}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2.5">
                        <span className="text-[11px] font-mono text-slate-900 dark:text-[#9FB0C7]/60">{session.uptime || '00d 00h 00m'}</span>
                        <span className={`text-[11px] font-black ${isRunning ? 'text-emerald-500 dark:text-[#22D3A6]' : 'text-slate-900 dark:text-white/40'} uppercase tracking-widest`}>
                            {isRunning ? 'LIVE' : 'OFFLINE'}
                        </span>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-900 dark:text-[#9FB0C7]/40" /> : <ChevronDown size={16} className="text-slate-900 dark:text-[#9FB0C7]/40" />}
                </div>
            </div>

            {isExpanded && (
                <div className="p-4 space-y-4">
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
                            <table className="w-full border-collapse">
                                <thead className="bg-slate-100 dark:bg-[#0D121F] border-b border-slate-200 dark:border-white/[0.03]">
                                    <tr className="text-[10px] font-black text-slate-900 dark:text-[#9FB0C7]/20 uppercase tracking-widest">
                                        <th className="px-4 py-3 text-left">Symbol</th>
                                        <th className="px-4 py-3 text-left">Side</th>
                                        <th className="px-4 py-3 text-right">Entry</th>
                                        <th className="px-4 py-3 text-right">Size</th>
                                        <th className="px-4 py-3 text-right">PnL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.02]">
                                    {displayPositions.map((pos: any, idx: number) => {
                                        const posPnl = num(pos.unRealizedProfit ?? pos.unrealizedProfit ?? pos.unRealizedPnl ?? pos.unrealizedPnl);
                                        const posAmt = num(pos.positionAmt);
                                        const side = posAmt >= 0 ? "LONG" : "SHORT";
                                        return (
                                            <tr key={idx} className="text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-white/[0.01]">
                                                <td className="px-4 py-4 text-slate-900 dark:text-white">{pos.symbol}</td>
                                                <td className={`px-4 py-4 ${side === 'LONG' ? 'text-emerald-600 dark:text-[#22D3A6]' : 'text-red-500'}`}>{side}</td>
                                                <td className="px-4 py-4 text-right text-slate-900 dark:text-white">${num(pos.entryPrice).toLocaleString()}</td>
                                                <td className="px-4 py-4 text-right text-slate-900 dark:text-white">{Math.abs(posAmt).toFixed(3)}</td>
                                                <td className={`px-4 py-4 text-right ${posPnl >= 0 ? 'text-emerald-600 dark:text-[#22D3A6]' : 'text-red-500'}`}>
                                                    ${posPnl.toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {displayPositions.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-[10px] text-slate-950 dark:text-white/20 uppercase tracking-widest">No open positions</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="bg-slate-100 dark:bg-[#0D121F] border-t border-slate-200 dark:border-white/[0.03]">
                                    <tr className="text-[10px] font-black uppercase tracking-widest">
                                        <td colSpan={2} className="px-4 py-3 text-slate-950 dark:text-[#9FB0C7]/20">Exposure</td>
                                        <td colSpan={3} className="px-4 py-3 text-right text-slate-950 dark:text-white text-[12px]">${totalExposure.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                </tfoot>
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
                    className={`py-2 flex items-center justify-center text-[9px] font-black tracking-widest uppercase transition-all hover:bg-slate-200 dark:hover:bg-white/5 ${isRunning ? 'text-red-500' : 'text-emerald-600'} disabled:opacity-50`}
                >
                    {isLoadingToggle ? '...' : (isRunning ? 'STOP' : 'START')}
                </button>
                <button className="py-2 text-slate-950 dark:text-[#9FB0C7] hover:bg-slate-200 dark:hover:bg-white/5 text-[9px] font-black tracking-widest uppercase transition-all">IPS</button>
                <button className="py-2 text-slate-950 dark:text-[#9FB0C7] hover:bg-slate-200 dark:hover:bg-white/5 text-[9px] font-black tracking-widest uppercase transition-all">CLOSE</button>
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
