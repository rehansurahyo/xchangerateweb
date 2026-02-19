"use client";

import Image from "next/image";
import { MessageSquare, Award, ArrowRight } from "lucide-react";

const Hero = () => {
    return (
        <section className="pt-[100px] pb-[48px] px-6 text-center relative overflow-hidden bg-white text-slate-900 dark:bg-gradient-to-b dark:from-[#050914] dark:via-[#070B14] dark:to-[#040815] dark:text-slate-100">
            {/* Background Glow */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none dark:bg-cyan-500/10" />

            {/* Brand Icon */}
            <div className="mb-10 flex justify-center">
                <div className="relative w-80 h-[108px] group hover:scale-105 transition-transform duration-300">
                    <Image
                        src="/assets/logo.png"
                        alt="Arizona High Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-[#0A192F]/60 border border-primary/20 backdrop-blur-md rounded-full px-2.5 py-0.5 mb-4">
                <span className="w-1 h-1 bg-emerald-500 dark:bg-[#10B981] rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[11px] font-bold tracking-tight text-primary uppercase">
                    LIVE TRADING • 2,400+ ACTIVE SESSIONS
                </span>
            </div>

            {/* Headline */}
            <h1 className="max-w-[1000px] mx-auto tracking-tight mb-5 text-5xl font-black text-slate-900 dark:text-slate-100">
                World's Most Profitable <br />
                <span className="text-gradient">Futures AI AutoTrader</span>
            </h1>

            {/* Subtext */}
            <p className="max-w-[640px] mx-auto text-[18px] leading-relaxed mb-8 px-4 text-slate-600 dark:text-slate-300">
                Fully automated AI-driven futures trading with verified performance and community transparency.
                Connect your exchange, deploy institutional algorithms, and let AI compound your capital 24/7.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-10">
                <button className="btn-primary h-9 px-5 flex items-center justify-center space-x-2">
                    <span className="text-[13px]">GET STARTED</span>
                    <ArrowRight size={13} />
                </button>
                <button className="glass-card h-9 px-4 flex items-center justify-center space-x-2 group bg-white dark:bg-inherit border border-slate-200 dark:border-white/10">
                    <MessageSquare size={13} className="text-slate-400 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                    <span className="text-[12px] font-bold tracking-tight text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        JOIN COMMUNITY
                    </span>
                </button>
                <button className="glass-card h-9 px-4 flex items-center justify-center space-x-2 group bg-white dark:bg-inherit border border-slate-200 dark:border-white/10">
                    <Award size={13} className="text-slate-400 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                    <span className="text-[12px] font-bold tracking-tight text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        VIEW PERFORMANCE
                    </span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="max-w-[900px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 px-4">
                {[
                    { label: "ACTIVE TRADERS", value: "2,400+", color: "text-primary" },
                    { label: "AVG. WIN RATE", value: "72.8%", color: "text-emerald-500 dark:text-emerald-400" },
                    { label: "TRADES EXECUTED", value: "1.2M+", color: "text-slate-900 dark:text-slate-100" },
                    { label: "TOTAL VOLUME", value: "$847M", color: "text-amber-500 dark:text-amber-400" },
                ].map((stat, idx) => (
                    <div key={idx} className="glass-card p-4 text-center group bg-white dark:bg-inherit border border-slate-200 dark:border-white/5">
                        <span className="text-[9px] font-bold tracking-[0.15em] text-slate-500 dark:text-slate-400 uppercase block mb-2">
                            {stat.label}
                        </span>
                        <span className={`text-2xl font-bold tracking-tight ${stat.color} transition-transform group-hover:scale-105 block`}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Hero;
