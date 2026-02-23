"use client";

import { useState } from "react";
import { RefreshCcw, Pause, Play, Copy, X, Trash2 } from "lucide-react";
import { dedupedToast } from "@/lib/toastDeduper";
import { xcrClient } from "@/lib/xcrClient";

interface ConfigSessionCardProps {
    session: any;
    onUpdate?: () => void;
}

const ConfigSessionCard = ({ session, onUpdate }: ConfigSessionCardProps) => {
    const isRunning = session.status === 'Active';
    const [autoRestart, setAutoRestart] = useState(true);
    const [isLoadingToggle, setIsLoadingToggle] = useState(false);

    const handleToggleStatus = async () => {
        setIsLoadingToggle(true);
        try {
            const nextStatus = isRunning ? 'Paused' : 'Active';
            const res = await xcrClient.post(`/api/proxy/sessions/update`, { id: session.id, status: nextStatus });

            if (!res.ok) throw new Error(res.message || "Update failed");
            dedupedToast.success(`Session ${nextStatus.toLowerCase()} successfully`);
            if (onUpdate) onUpdate();
        } catch (err: any) {
            console.error(err);
            dedupedToast.error(err.message || "Failed to update status");
        } finally {
            setIsLoadingToggle(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this session?')) return;
        try {
            const res = await xcrClient.post(`/api/proxy/sessions/delete`, { id: session.id });

            if (!res.ok) throw new Error(res.message || "Delete failed");
            dedupedToast.success("Session deleted");
            if (onUpdate) onUpdate();
        } catch (err: any) {
            console.error(err);
            dedupedToast.error(err.message || "Failed to delete session");
        }
    };

    const handleCloseSymbol = async () => {
        try {
            dedupedToast.loading("Closing positions...");
            const res = await xcrClient.closePositions(session.id, "ALL");
            if (res.ok) {
                dedupedToast.success("Close command sent");
            }
        } catch (err) { }
    };

    const details = [
        { label: "API Key", value: session.api_key_masked || "—" },
        { label: "Target %", value: `${session.target_percentage || 100}%`, isHighlighted: true },
        { label: "Created", value: session.created_at ? new Date(session.created_at).toLocaleString() : "—" },
        { label: "IPs", value: Array.isArray(session.ips) ? session.ips.join(', ') : "None" },
        { label: "Status", value: session.status }
    ];

    return (
        <div className="bg-white dark:bg-[#0A101A] border border-slate-200 dark:border-white/[0.03] rounded-xl overflow-hidden shadow-sm dark:shadow-2xl transition-all">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-white/[0.03]">
                <div className="flex items-center space-x-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                    <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tight">{session.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[9px] font-black text-orange-500 uppercase tracking-widest">
                        {session.exchange}
                    </span>
                </div>
                <span className={`text-[10px] font-black tracking-[0.2em] ${isRunning ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} uppercase`}>
                    {isRunning ? 'RUNNING' : 'OFFLINE'}
                </span>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-3">
                {details.map((detail, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">{detail.label}</span>
                        <span className={`font-mono ${detail.isHighlighted ? 'text-orange-500 dark:text-orange-400' : 'text-slate-800 dark:text-slate-300'} font-medium`}>
                            {detail.value}
                        </span>
                    </div>
                ))}

                <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-500/80">
                        <RefreshCcw size={14} className={autoRestart ? 'animate-spin-slow' : ''} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Auto Restart</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase">ON</span>
                        <button
                            onClick={() => setAutoRestart(!autoRestart)}
                            className={`w-9 h-5 rounded-full transition-colors relative ${autoRestart ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${autoRestart ? 'left-5' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="grid grid-cols-4 p-4 gap-3 bg-slate-50/50 dark:bg-black/20">
                <button
                    onClick={handleToggleStatus}
                    disabled={isLoadingToggle}
                    className={`flex items-center justify-center space-x-2 py-3 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${isRunning
                        ? 'border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-500 hover:bg-orange-500/10'
                        : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/10'
                        } disabled:opacity-50 active:scale-95`}
                >
                    {isRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                    <span>{isLoadingToggle ? '...' : (isRunning ? 'STOP' : 'START')}</span>
                </button>

                <button className="flex items-center justify-center space-x-2 py-3 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
                    <Copy size={14} />
                    <span>IPS</span>
                </button>

                <button
                    onClick={handleCloseSymbol}
                    className="flex items-center justify-center space-x-2 py-3 rounded-lg border border-blue-500/20 dark:border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-500/10 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                    <X size={14} />
                    <span>CLOSE</span>
                </button>

                <button
                    onClick={handleDelete}
                    className="flex items-center justify-center space-x-2 py-3 rounded-lg border border-red-500/20 dark:border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                    <Trash2 size={14} />
                    <span>DEL</span>
                </button>
            </div>
        </div>
    );
};

export default ConfigSessionCard;
