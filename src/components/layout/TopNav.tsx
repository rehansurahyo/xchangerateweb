"use client"; // Updated for Supabase Auth migration

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard,
    Settings2,
    Users2,
    Trophy,
    User as UserIcon,
    Settings,
    CreditCard,
    ShieldCheck,
    LogOut,
    ChevronDown,
    Activity
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { MOCK_USER } from "@/lib/mock";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const TopNav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, supabase } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const userEmail = user?.email || MOCK_USER.email;
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || MOCK_USER.username;
    const userInitials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || MOCK_USER.initials;

    const navItems = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Api Config", href: "/api-config", icon: Settings2 },
        { label: "Live Status", href: "/snapshots", icon: Activity },
        { label: "Community", href: "/community", icon: Users2 },
        { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
    ];

    const userMenuItems = [
        { label: "Profile", href: "/profile", icon: UserIcon },
        { label: "Account Settings", href: "/settings", icon: Settings },
        { label: "Billing", href: "/billing", icon: CreditCard },
        { label: "Admin Panel", href: "/admin", icon: ShieldCheck },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-14 z-50 px-6 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#050A12] backdrop-blur-xl flex items-center justify-between">
            {/* Left: Logo */}
            <Link href="/dashboard" className="flex items-center group">
                <div className="relative w-24 h-6 group-hover:scale-105 transition-transform duration-300">
                    <Image
                        src="/assets/logo.png"
                        alt="Arizona High Logo"
                        fill
                        className="object-contain"
                    />
                </div>
            </Link>

            {/* Center: Nav Items */}
            <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all flex items-center space-x-1.5 ${isActive
                                ? "bg-blue-500/10 dark:bg-primary/10 text-blue-600 dark:text-primary shadow-[0_0_20px_rgba(47,128,255,0.1)]"
                                : "text-slate-950 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                                }`}
                        >
                            <item.icon size={12} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Right: User Dropdown */}
            <div className="flex items-center space-x-4">
                <ThemeToggle />
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-2.5 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 p-1 pr-3 rounded-full transition-all group"
                    >
                        <div className="w-7 h-7 rounded-full bg-blue-500/10 dark:bg-primary/20 flex items-center justify-center text-blue-600 dark:text-primary font-bold text-[10px]">
                            {userInitials}
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-[9px] font-black text-slate-900 dark:text-white leading-none uppercase tracking-tighter mb-0.5">{userName}</p>
                            <div className="flex items-center space-x-1">
                                <span className="text-[7px] font-bold text-blue-600 dark:text-primary px-1.5 py-0.5 bg-blue-500/10 dark:bg-primary/10 rounded-full leading-none">
                                    {MOCK_USER.plan}
                                </span>
                            </div>
                        </div>
                        <ChevronDown size={12} className={`text-slate-950 dark:text-[#9FB0C7]/40 group-hover:text-black dark:group-hover:text-white transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-[-1]"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-[#0B1222] p-2 border border-slate-200 dark:border-primary/20 shadow-2xl animate-in fade-in zoom-in-95 duration-200 rounded-xl overflow-hidden backdrop-blur-xl">
                                <div className="p-3 border-b border-slate-100 dark:border-white/5 mb-2">
                                    <p className="text-[9px] font-black text-slate-950 dark:text-[#9FB0C7]/40 uppercase tracking-widest mb-1">Signed in as</p>
                                    <p className="text-[11px] font-bold text-slate-950 dark:text-white truncate">{userEmail}</p>
                                </div>

                                <div className="space-y-1">
                                    {userMenuItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-[10px] font-bold text-slate-950 dark:text-[#9FB0C7] hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                                        >
                                            <item.icon size={14} className="text-slate-950 dark:text-[#9FB0C7]/40 group-hover:text-blue-500 dark:group-hover:text-primary transition-colors" />
                                            <span>{item.label}</span>
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
                                    <button
                                        onClick={async () => {
                                            await supabase.auth.signOut();
                                            router.push("/");
                                            router.refresh();
                                        }}
                                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-[10px] font-bold text-red-500/80 dark:text-red-400/80 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/5 transition-all group"
                                    >
                                        <LogOut size={14} className="text-red-400/40 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default TopNav;
