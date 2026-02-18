"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Flame } from "lucide-react";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = ["COMMUNITY", "PERFORMANCE", "HOW IT WORKS", "PRICING"];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? "bg-[#050A12]/90 backdrop-blur-md border-white/5 py-4" : "bg-[#050A12] border-white/5 py-6"
                }`}
        >
            <div className="max-w-[1440px] mx-auto px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <div className="relative w-32 h-8 group-hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/assets/logo.png"
                            alt="Arizona High Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-12">
                    {navItems.map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                            className="text-[10px] font-bold tracking-[0.15em] text-[#9FB0C7] hover:text-white transition-colors uppercase"
                        >
                            {item}
                        </Link>
                    ))}
                </nav>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/login" className="text-[9px] font-bold tracking-[0.15em] text-[#9FB0C7] hover:text-white transition-colors uppercase">
                        SIGN IN
                    </Link>
                    <Link href="/signup" className="bg-[#2F80FF] hover:bg-[#2563EB] text-white px-6 py-2.5 rounded-lg text-[9px] font-black tracking-[0.15em] uppercase shadow-[0_0_20px_rgba(47,128,255,0.3)] hover:shadow-[0_0_30px_rgba(47,128,255,0.5)] transition-all">
                        GET STARTED
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[#050A12] border-b border-white/10 py-6 px-6 space-y-4 animate-in fade-in slide-in-from-top-4 shadow-2xl">
                    {navItems.map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                            className="block text-xs font-bold tracking-widest text-[#9FB0C7] hover:text-white py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item}
                        </Link>
                    ))}
                    <div className="pt-6 border-t border-white/5 flex flex-col space-y-4">
                        <Link href="/login" className="text-left text-xs font-bold tracking-widest text-white" onClick={() => setIsMobileMenuOpen(false)}>
                            SIGN IN
                        </Link>
                        <Link href="/signup" className="bg-[#2F80FF] py-3 rounded-lg text-white text-xs font-black tracking-widest uppercase text-center" onClick={() => setIsMobileMenuOpen(false)}>
                            GET STARTED
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
