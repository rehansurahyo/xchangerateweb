"use client";

import { useEffect, useState } from "react";
import { User, Shield, Pencil, BadgeCheck, Globe } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function ProfilePage() {
    const { user, supabase } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfileData = async () => {
        if (!user) return;

        const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileData) setProfile(profileData);

        const { data: statsData } = await supabase
            .from('leaderboard')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (statsData) setStats(statsData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProfileData();
    }, [user, supabase]);

    const userEmail = user?.email || 'trader@example.com';
    const userName = profile?.username || userEmail.split('@')[0];
    const userInitials = userName.substring(0, 2).toUpperCase();

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pt-20 px-6 max-w-[1000px] mx-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Trader Profile</h2>
                <button className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">
                    <Pencil size={12} />
                    <span>Edit Profile</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-8 flex items-center space-x-8 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A101A]">
                        <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-600 text-2xl font-black">
                            {userInitials}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase">{userName}</h3>
                                <BadgeCheck size={16} className="text-blue-600" />
                            </div>
                            <p className="text-xs text-slate-400 font-bold">{userEmail}</p>
                            <div className="px-3 py-1 rounded-full bg-blue-500/10 text-[8px] font-black text-blue-600 uppercase w-fit">
                                {profile?.plan || 'Free Plan'}
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0A101A]">
                        <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Performance Statistics</h4>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Total P&L</p>
                                <p className={`text-sm font-black ${(stats?.profit || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    ${(stats?.profit || 0).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">ROI</p>
                                <p className="text-sm font-black text-emerald-500">+{stats?.roi || 0}%</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Win Rate</p>
                                <p className="text-sm font-black text-blue-500">{stats?.win_rate || 0}%</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Drawdown</p>
                                <p className="text-sm font-black text-red-400">{stats?.drawdown || 0}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Plan Status */}
                    <div className="glass-card p-6 border-l-4 border-blue-600 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/5">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Current Tier</p>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-4">{profile?.plan || 'Free'}</h4>
                        <button className="w-full py-3 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Manage Billing</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
