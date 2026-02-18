"use client";

import Image from "next/image";
import { MessageSquare, Award, ArrowRight } from "lucide-react";

const Hero = () => {
    return (
        <section className="pt-[160px] pb-[80px] px-6 text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Brand Icon */}
            <div className="mb-10 flex justify-center">
                <div className="relative w-48 h-12 group hover:scale-105 transition-transform duration-300">
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
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
                <span className="w-2 h-2 bg-[#22D3A6] rounded-full animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
                    LIVE TRADING • 2,400+ ACTIVE SESSIONS
                </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-extrabold text-[#F5F7FF] leading-[1.05] tracking-tight mb-6">
                World's Most Profitable <br />
                <span className="text-gradient">Futures AI AutoTrader</span>
            </h1>

            {/* Subtext */}
            <p className="max-w-[800px] mx-auto text-[#9FB0C7] text-lg sm:text-xl leading-relaxed mb-12 px-4">
                Fully automated AI-driven futures trading with verified performance and community transparency.
                Connect your exchange, deploy institutional algorithms, and let AI compound your capital 24/7.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20">
                <button className="btn-primary w-full sm:w-auto py-4 px-10 flex items-center justify-center space-x-2">
                    <span>GET STARTED</span>
                    <ArrowRight size={18} />
                </button>
                <button className="glass-card w-full sm:w-auto py-4 px-10 flex items-center justify-center space-x-2 group">
                    <MessageSquare size={18} className="text-[#9FB0C7] group-hover:text-white" />
                    <span className="text-sm font-bold tracking-widest text-[#9FB0C7] group-hover:text-white">
                        JOIN COMMUNITY
                    </span>
                </button>
                <button className="glass-card w-full sm:w-auto py-4 px-10 flex items-center justify-center space-x-2 group">
                    <Award size={18} className="text-[#9FB0C7] group-hover:text-white" />
                    <span className="text-sm font-bold tracking-widest text-[#9FB0C7] group-hover:text-white">
                        VIEW PERFORMANCE
                    </span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="max-w-[1240px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {[
                    { label: "ACTIVE TRADERS", value: "2,400+", color: "text-primary" },
                    { label: "AVG. WIN RATE", value: "72.8%", color: "text-[#22D3A6]" },
                    { label: "TRADES EXECUTED", value: "1.2M+", color: "text-white" },
                    { label: "TOTAL VOLUME", value: "$847M", color: "text-[#FFB800]" },
                ].map((stat, idx) => (
                    <div key={idx} className="glass-card p-8 text-left group">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#9FB0C7] uppercase block mb-3">
                            {stat.label}
                        </span>
                        <span className={`text-4xl font-bold tracking-tight ${stat.color} transition-transform group-hover:scale-110 block origin-left`}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Hero;
