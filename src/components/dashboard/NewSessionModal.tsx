"use client";

import { useState } from "react";
import { X, CheckCircle2, ShieldAlert, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { dedupedToast } from "@/lib/toastDeduper";
import { xcrClient } from "@/lib/xcrClient";

interface NewSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const NewSessionModal = ({
    isOpen,
    onClose,
    onSuccess,
}: NewSessionModalProps) => {
    const { user } = useAuth();
    const [name, setName] = useState("");
    const [exchange, setExchange] = useState("Binance");
    const [apiKey, setApiKey] = useState("");
    const [apiSecret, setApiSecret] = useState("");
    const [isTestnet, setIsTestnet] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);

        try {
            // All complex logic (proxy harvesting, encryption) is now handled server-side in /api/proxy/sessions
            const res = await xcrClient.createProxySession({
                name: name.trim() || `${exchange} Session`,
                exchange,
                apiKey,
                apiSecret,
                isTestnet
            });

            if (!res.ok) throw new Error(res.message || "Failed to create session");

            dedupedToast.success("Session created successfully with auto-proxies");
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("[NewSessionModal] Submit error:", err);
            dedupedToast.error(err.message || "Failed to create session");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0B1222] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="p-6 pb-2">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">
                            Add API Session
                        </h3>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <p className="text-[11px] font-bold text-[#9FB0C7]/40 uppercase tracking-widest leading-relaxed">
                        Securely connect your exchange. Proxies will be auto-assigned.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            SESSION NAME
                        </label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Trend Scalper"
                            className="w-full bg-[#0F172A]/50 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            EXCHANGE
                        </label>
                        <select
                            value={exchange}
                            onChange={(e) => setExchange(e.target.value)}
                            className="w-full bg-[#0F172A]/50 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                        >
                            <option value="Binance">Binance</option>
                            <option value="Bybit">Bybit</option>
                            <option value="OKX">OKX</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            API KEY
                        </label>
                        <input
                            required
                            type="text"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter API key"
                            className="w-full bg-[#0F172A]/50 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            API SECRET
                        </label>
                        <input
                            required
                            type="password"
                            value={apiSecret}
                            onChange={(e) => setApiSecret(e.target.value)}
                            placeholder="Enter API secret"
                            className="w-full bg-[#0F172A]/50 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>

                    {exchange === "Binance" && (
                        <div className="flex items-center gap-3 p-1">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isTestnet}
                                    onChange={(e) => setIsTestnet(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white"></div>
                            </label>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                Binance Testnet (Demo)
                            </span>
                        </div>
                    )}

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                        <CheckCircle2 className="text-blue-400 shrink-0 mt-0.5" size={16} />
                        <p className="text-[10px] text-blue-300 font-medium leading-relaxed">
                            System will automatically assign secure proxies and encrypt your keys.
                        </p>
                    </div>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-[#3B82F6] hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/20 mt-2 flex items-center justify-center gap-2"
                    >
                        {isLoading && <Loader2 size={14} className="animate-spin" />}
                        {isLoading ? "Configuring Session…" : "Create Session"}
                    </button>

                    <p className="text-[9px] text-center text-slate-500 flex items-center justify-center gap-1.5 mt-2">
                        <ShieldAlert size={10} /> Data is AES-256 encrypted
                    </p>
                </form>
            </div>
        </div>
    );
};
