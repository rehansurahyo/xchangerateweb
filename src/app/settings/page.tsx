"use client";

import { Lock, Smartphone, ShieldCheck, Key, Eye, EyeOff, Trash2 } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="max-w-[800px] mx-auto space-y-10 pt-24 px-6 animate-in fade-in duration-500 pb-20">
            <div>
                <h2 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight leading-none">Account Preferences</h2>
                <p className="text-xs font-bold text-slate-500 dark:text-[#9FB0C7]/40 uppercase tracking-widest mt-2">Manage security and global settings</p>
            </div>

            <div className="space-y-6">
                <div className="glass-card p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A101A] flex items-center justify-between group hover:border-slate-300 dark:hover:border-white/10 transition-all">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-blue-600 shadow-inner">
                            <Lock size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase">Password & Security</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Update credentials</p>
                        </div>
                    </div>
                    <button className="px-6 py-2 rounded-lg bg-slate-950 dark:bg-[#1E293B] border border-slate-700 dark:border-white/10 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/10 hover:bg-slate-800 transition-all">Update</button>
                </div>
            </div>
        </div>
    );
}
