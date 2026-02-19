"use client";

import Image from "next/image";
import { Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

export default function MobileAppDownload() {
    const [googlePlayUrl, setGooglePlayUrl] = useState<string | null>(null);
    const [appStoreUrl, setAppStoreUrl] = useState<string | null>(null);

    useEffect(() => {
        setGooglePlayUrl(process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || null);
        setAppStoreUrl(process.env.NEXT_PUBLIC_APP_STORE_URL || null);
    }, []);

    return (
        <section className="w-full py-8 px-4 overflow-hidden">
            <div className="max-w-4xl mx-auto rounded-[2rem] bg-gradient-to-br from-[#050A19] via-[#0A1229] to-[#050A19] relative dark:from-[#050A19] dark:via-[#0A1229] dark:to-[#050A19] from-slate-50 via-slate-100 to-slate-50 border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden p-6 md:p-8">
                {/* Background Glow */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] bg-primary/20 blur-[100px] rounded-full opacity-20" />
                    <div className="absolute -bottom-[50%] -right-[20%] w-[80%] h-[80%] bg-[#22D3A6]/10 blur-[100px] rounded-full opacity-20" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center relative z-10">
                    {/* Left Column: Text Content */}
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center space-x-2 bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-sm scale-90 origin-center lg:origin-left">
                            <Smartphone size={16} className="text-primary" />
                            <span className="text-[10px] font-black text-slate-500 dark:text-[#9FB0C7] uppercase tracking-[0.2em]">Mobile App</span>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-[0.9]">
                                Download the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#22D3A6]">Arizona High</span> <br />
                                Mobile App
                            </h2>
                            <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-[#9FB0C7]/80 max-w-sm mx-auto lg:mx-0 leading-relaxed">
                                Trade on the go with full access to your AI trading sessions, real-time P&L tracking, community chat, and instant notifications.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                            {/* Google Play Button */}
                            <a
                                href={googlePlayUrl || "#"}
                                className="group flex items-center space-x-3 bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <Image
                                    src="/assets/play store.png"
                                    alt="Google Play"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 shrink-0 object-contain"
                                />
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">GET IT ON</p>
                                    <p className="text-base font-black text-slate-900 leading-none">Google Play</p>
                                </div>
                            </a>

                            {/* App Store Button */}
                            <a
                                href={appStoreUrl || "#"}
                                className="group flex items-center space-x-3 bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <Image
                                    src="/assets/apple.png"
                                    alt="App Store"
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 shrink-0 object-contain"
                                />
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">DOWNLOAD ON THE</p>
                                    <p className="text-base font-black text-slate-900 leading-none">App Store</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Phone Mockup */}
                    <div className="relative flex justify-center lg:justify-end">

                        {/* Phone Container - CSS Frame Removed for proper Framed Image */}
                        <div className="relative w-[300px] h-auto z-10 transition-transform duration-500 hover:scale-[1.02] filter drop-shadow-xl lg:-translate-x-12">
                            <Image
                                src="/assets/ios_framed.png"
                                alt="Arizona High Mobile App"
                                width={300}
                                height={600}
                                className="w-full h-auto"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
