"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface NewSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const NewSessionModal = ({ isOpen, onClose, onSuccess }: NewSessionModalProps) => {
    const [name, setName] = useState("");
    const [exchange, setExchange] = useState("Binance");
    const [apiKey, setApiKey] = useState("");
    const [apiSecret, setApiSecret] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, exchange, apiKey, apiSecret }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create session");
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0B1222] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="p-6 pb-2">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">New Session</h3>
                        <button
                            onClick={onClose}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 dark:text-[#9FB0C7]/40 uppercase tracking-widest leading-relaxed">
                        Name your session, select an exchange, and enter API credentials.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Account Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Primary BTC, Scalp Session"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Exchange
                        </label>
                        <select
                            value={exchange}
                            onChange={(e) => setExchange(e.target.value)}
                            className="w-full bg-[#0B1222] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                        >
                            <option value="Binance">Binance</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            API Key
                        </label>
                        <input
                            required
                            type="text"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter API key"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            API Secret
                        </label>
                        <input
                            required
                            type="password"
                            value={apiSecret}
                            onChange={(e) => setApiSecret(e.target.value)}
                            placeholder="Enter API secret"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>

                    {error && (
                        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                            {error}
                        </p>
                    )}

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        {isLoading ? "Creating..." : "Create Session"}
                    </button>
                </form>
            </div>
        </div>
    );
};
