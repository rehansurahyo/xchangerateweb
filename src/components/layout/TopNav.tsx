"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    ChevronDown
} from "lucide-react";
import { useState } from "react";
import { MOCK_USER } from "@/lib/mock";

const TopNav = () => {
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const navItems = [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "API Config", href: "/api-config", icon: Settings2 },
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
        <nav className="fixed top-0 left-0 right-0 h-16 z-50 px-6 border-b border-white/5 bg-[#050A12]/80 backdrop-blur-xl flex items-center justify-between">
            {/* Left: Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(47,128,255,0.4)] transition-all">
                    <span className="text-white font-black text-sm">AH</span>
                </div>
                <span className="text-[#F5F7FF] font-bold text-lg tracking-tight">Arizona High</span>
            </Link>

            {/* Center: Nav Items */}
            <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center space-x-2 ${isActive
                                    ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(47,128,255,0.1)]"
                                    : "text-[#9FB0C7]/60 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <item.icon size={14} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Right: User Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 bg-white/[0.03] border border-white/5 hover:border-white/10 p-1.5 pr-4 rounded-full transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        {MOCK_USER.initials}
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-[10px] font-black text-white leading-none uppercase tracking-tighter mb-0.5">{MOCK_USER.username}</p>
                        <div className="flex items-center space-x-1">
                            <span className="text-[8px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded-full leading-none">
                                {MOCK_USER.plan}
                            </span>
                        </div>
                    </div>
                    <ChevronDown size={14} className={`text-[#9FB0C7]/40 group-hover:text-white transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-[-1]"
                            onClick={() => setShowUserMenu(false)}
                        />
                        <div className="absolute top-full right-0 mt-3 w-56 glass-card p-2 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-3 border-b border-white/5 mb-2">
                                <p className="text-[10px] font-black text-[#9FB0C7] uppercase tracking-widest mb-1">Signed in as</p>
                                <p className="text-sm font-bold text-white truncate">{MOCK_USER.email}</p>
                            </div>

                            <div className="space-y-1">
                                {userMenuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setShowUserMenu(false)}
                                        className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#9FB0C7] hover:text-white hover:bg-white/5 transition-all group"
                                    >
                                        <item.icon size={16} className="text-[#9FB0C7]/40 group-hover:text-primary transition-colors" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-2 pt-2 border-t border-white/5">
                                <Link
                                    href="/"
                                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400/80 hover:text-red-400 hover:bg-red-400/5 transition-all group"
                                >
                                    <LogOut size={16} className="text-red-400/40 group-hover:text-red-400 transition-colors" />
                                    <span>Log Out</span>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default TopNav;
