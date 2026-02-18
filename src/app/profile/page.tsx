"use client";

import { User, Shield, CreditCard, Pencil, BadgeCheck, TrendingUp, History, Globe } from "lucide-react";
import { useSession } from "next-auth/react";
import { MOCK_USER } from "@/lib/mock";

export default function ProfilePage() {
    const { data: session } = useSession();

    const userEmail = session?.user?.email || MOCK_USER.email;
    const userName = session?.user?.name || MOCK_USER.username;
    const userInitials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || MOCK_USER.initials;
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Trader Profile</h2>
                <button className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/[0.05] transition-all">
                    <Pencil size={12} />
                    <span>Edit Profile</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                        <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-[#050A12] flex items-center justify-center text-primary text-2xl font-black shadow-[0_0_20px_rgba(47,128,255,0.2)]">
                            {userInitials}
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2.5">
                            <div>
                                <div className="flex items-center justify-center md:justify-start space-x-1.5">
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{userName}</h3>
                                    <BadgeCheck size={16} className="text-primary" />
                                </div>
                                <p className="text-[11px] text-[#9FB0C7]/60 font-bold">{userEmail}</p>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                <span className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[8px] font-black text-[#9FB0C7] uppercase tracking-widest flex items-center space-x-1.5">
                                    <Globe size={10} />
                                    <span>UTC+5:00</span>
                                </span>
                                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-black text-primary uppercase tracking-widest">
                                    {MOCK_USER.plan}
                                </span>
                            </div>
                            <p className="text-[11px] text-[#9FB0C7]/40 font-bold leading-relaxed max-w-[500px] uppercase tracking-tighter">
                                Quantitative trader specializing in AI-driven futures arbitrage. Active on Binance and Bybit with institutional-grade risk parameters.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="glass-card p-4 space-y-3">
                            <h4 className="text-[9px] font-black text-[#9FB0C7] uppercase tracking-[0.2em]">Performance Overview</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[7px] font-black text-[#9FB0C7]/40 uppercase tracking-widest mb-0.5">Total Trades</p>
                                    <p className="text-sm font-black text-white">1,240</p>
                                </div>
                                <div>
                                    <p className="text-[7px] font-black text-[#9FB0C7]/40 uppercase tracking-widest mb-0.5">Win Rate</p>
                                    <p className="text-sm font-black text-[#22D3A6]">72.8%</p>
                                </div>
                                <div>
                                    <p className="text-[7px] font-black text-[#9FB0C7]/40 uppercase tracking-widest mb-0.5">Active Days</p>
                                    <p className="text-sm font-black text-white">142</p>
                                </div>
                                <div>
                                    <p className="text-[7px] font-black text-[#9FB0C7]/40 uppercase tracking-widest mb-0.5">Total P&L</p>
                                    <p className="text-sm font-black text-[#22D3A6]">+$52.4K</p>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card p-4 space-y-3">
                            <h4 className="text-[9px] font-black text-[#9FB0C7] uppercase tracking-[0.2em]">Connected Exchanges</h4>
                            <div className="space-y-2">
                                {['Binance', 'Bybit', 'OKX'].map(ex => (
                                    <div key={ex} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{ex}</span>
                                        <span className="text-[7px] font-black text-[#22D3A6] uppercase tracking-widest">ACTIVE</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <div className="glass-card p-5 border-t-2 border-primary">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4">Current Plan</h4>
                        <div className="space-y-3">
                            <div>
                                <p className="text-lg font-black text-white uppercase tracking-tight leading-none">{MOCK_USER.plan}</p>
                                <p className="text-[9px] text-[#9FB0C7]/40 font-bold uppercase mt-1 tracking-tighter">Next billing: April 12, 2024</p>
                            </div>
                            <ul className="space-y-1.5">
                                {['Unlimited API Sessions', 'Advanced AI Models', 'Priority Support', 'Custom Risk Params'].map(f => (
                                    <li key={f} className="flex items-center space-x-2 text-[9px] font-black text-[#9FB0C7] uppercase tracking-tighter">
                                        <BadgeCheck size={12} className="text-primary" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-2.5 mt-2 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:shadow-[0_0_15px_rgba(47,128,255,0.3)] transition-all">
                                Manage Plan
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-5">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-3">Security Status</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[#22D3A6]/5 border border-[#22D3A6]/20">
                                <div className="flex items-center space-x-2">
                                    <Shield className="text-[#22D3A6]" size={14} />
                                    <span className="text-[10px] font-black text-[#22D3A6] uppercase tracking-widest">2FA Secure</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                                <p className="text-[9px] font-black text-[#9FB0C7]/40 uppercase tracking-widest">Last Login</p>
                                <p className="text-[10px] font-bold text-white tracking-tighter">2.5 hours ago from 192.168.1.1</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
