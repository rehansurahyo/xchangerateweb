"use client";

import { Lock, Smartphone, ShieldCheck, Key, Eye, EyeOff, Trash2 } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const [showCurrentPass, setShowCurrentPass] = useState(false);

    return (
        <div className="max-w-[800px] mx-auto space-y-10 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Account Settings</h2>
                <p className="text-xs font-bold text-[#9FB0C7]/40 uppercase tracking-widest mt-1">Manage your security and account preferences</p>
            </div>

            {/* Security Section */}
            <div className="space-y-6">
                <h3 className="text-xs font-black text-[#9FB0C7] uppercase tracking-[0.3em] border-b border-white/5 pb-4">Security & Authentication</h3>

                <div className="space-y-4">
                    {/* Change Password */}
                    <div className="glass-card p-6 flex items-center justify-between group">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#9FB0C7]/40 group-hover:text-primary transition-colors">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-wider">Change Password</h4>
                                <p className="text-[10px] font-bold text-[#9FB0C7]/40 uppercase tracking-widest">Update your account password</p>
                            </div>
                        </div>
                        <button className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-[#9FB0C7] uppercase tracking-widest hover:text-white transition-all">
                            Update
                        </button>
                    </div>

                    {/* 2FA */}
                    <div className="glass-card p-6 flex items-center justify-between group">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#9FB0C7]/40 group-hover:text-[#22D3A6] transition-colors">
                                <Smartphone size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-wider">Two-Factor Auth</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-[8px] font-black text-[#22D3A6] bg-[#22D3A6]/10 px-2 py-0.5 rounded-full uppercase tracking-widest">ACTIVE</span>
                                    <p className="text-[10px] font-bold text-[#9FB0C7]/40 uppercase tracking-widest">Using Google Authenticator</p>
                                </div>
                            </div>
                        </div>
                        <button className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-[#9FB0C7] uppercase tracking-widest hover:text-white transition-all">
                            Configure
                        </button>
                    </div>

                    {/* API Permissions */}
                    <div className="glass-card p-6 flex items-center justify-between group">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#9FB0C7]/40 group-hover:text-orange-400 transition-colors">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-wider">API Permissions</h4>
                                <p className="text-[10px] font-bold text-[#9FB0C7]/40 uppercase tracking-widest">Restricted to Trading & History</p>
                            </div>
                        </div>
                        <button className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-[#9FB0C7] uppercase tracking-widest hover:text-white transition-all">
                            Review
                        </button>
                    </div>
                </div>
            </div>

            {/* Account Preferences */}
            <div className="space-y-6">
                <h3 className="text-xs font-black text-[#9FB0C7] uppercase tracking-[0.3em] border-b border-white/5 pb-4">Preferences</h3>

                <div className="glass-card p-8 space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-white/5">
                        <div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">Email Notifications</h4>
                            <p className="text-[10px] font-medium text-[#9FB0C7]/40 mt-1">Receive alerts for trade fills and system updates</p>
                        </div>
                        <button className="w-12 h-6 rounded-full p-1 bg-primary relative transition-all">
                            <div className="w-4 h-4 rounded-full bg-white translate-x-6" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between pb-6 border-b border-white/5">
                        <div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">Public Profile</h4>
                            <p className="text-[10px] font-medium text-[#9FB0C7]/40 mt-1">Show your stats on the global leaderboard</p>
                        </div>
                        <button className="w-12 h-6 rounded-full p-1 bg-white/10 relative transition-all">
                            <div className="w-4 h-4 rounded-full bg-white translate-x-0" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xs font-black text-red-100 uppercase tracking-widest">Danger Zone</h4>
                            <p className="text-[10px] font-medium text-red-100/40 mt-1">Permanently delete your account and all data</p>
                        </div>
                        <button className="px-6 py-2 rounded-xl bg-red-400/10 text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-400/20 hover:bg-red-400/20 transition-all">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
