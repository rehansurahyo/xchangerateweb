"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#050A12] border-t border-white/5 pt-20 pb-10 px-6">
            <div className="max-w-[1240px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center group">
                            <div className="relative w-32 h-8 group-hover:scale-105 transition-transform duration-300">
                                <Image
                                    src="/assets/logo.png"
                                    alt="Arizona High Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-[#9FB0C7] text-sm leading-relaxed max-w-[280px]">
                            Institutional-grade AI futures trading. Verified performance, transparent results.
                        </p>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-[10px] font-black tracking-[0.2em] text-white uppercase mb-8">
                            PLATFORM
                        </h4>
                        <ul className="space-y-4">
                            {["Dashboard", "Performance", "Community", "API Configuration"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm font-medium text-[#9FB0C7] hover:text-white transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black tracking-[0.2em] text-white uppercase mb-8">
                            COMPANY
                        </h4>
                        <ul className="space-y-4">
                            {["About", "Terms of Service", "Privacy Policy", "Risk Disclosure"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm font-medium text-[#9FB0C7] hover:text-white transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black tracking-[0.2em] text-white uppercase mb-8">
                            SUPPORT
                        </h4>
                        <ul className="space-y-4">
                            {["Help Center", "Contact Us", "Status Page", "API Documentation"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm font-medium text-[#9FB0C7] hover:text-white transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-6">
                    <p className="text-[11px] font-semibold text-[#9FB0C7]/40 tracking-wider">
                        © 2026 Arizona High. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6">
                        <div className="flex items-center space-x-2">
                            <Shield size={14} className="text-[#22D3A6]" />
                            <span className="text-[10px] font-black tracking-widest text-[#9FB0C7]/60 uppercase">
                                Secured
                            </span>
                        </div>
                        <span className="text-[10px] font-black tracking-widest text-[#9FB0C7]/60 uppercase">
                            256-bit Encryption
                        </span>
                        <div className="bg-white/5 px-3 py-1 rounded border border-white/5">
                            <span className="text-[9px] font-black tracking-widest text-[#F5F7FF] uppercase">
                                Institutional Grade
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
