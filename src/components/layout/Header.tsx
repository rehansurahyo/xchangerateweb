"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
                <Link href="/" className="flex flex-col items-center group">
                    <div className="text-[#FF1F1F] group-hover:scale-110 transition-transform duration-300">
                        {/* Using a custom SVG to match the 'red wings' look conceptually */}
                        <svg width="32" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.00018 9.87784C2.26629 8.5262 4.14856 2.00003 11.9996 2C19.8507 2.00003 21.7329 8.52623 21.999 9.87787C22.0494 10.1332 21.9463 10.3951 21.7326 10.5376L11.9996 17.0263L2.2666 10.5376C2.05291 10.3951 1.94978 10.1332 2.00018 9.87784Z" fill="#DC2626" />
                            <path d="M12 14L8 11L12 6L16 11L12 14Z" fill="white" />
                        </svg>
                    </div>
                    <div className="flex flex-col items-center mt-1">
                        <span className="text-[8px] font-black text-[#FF1F1F] tracking-[0.2em] leading-none">ARIZONA HIGH</span>
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
                    <Link href="/login" className="text-[10px] font-bold tracking-[0.15em] text-[#9FB0C7] hover:text-white transition-colors uppercase">
                        SIGN IN
                    </Link>
                    <Link href="/signup" className="bg-[#2F80FF] hover:bg-[#2563EB] text-white px-8 py-3 rounded-lg text-[10px] font-black tracking-[0.15em] uppercase shadow-[0_0_20px_rgba(47,128,255,0.3)] hover:shadow-[0_0_30px_rgba(47,128,255,0.5)] transition-all">
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
