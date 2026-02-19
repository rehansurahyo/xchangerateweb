"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TickerTape from "@/components/ui/TickerTape";
import Hero from "@/components/sections/Hero";
import LiveCommunity from "@/components/sections/LiveCommunity";
import LiveRankings from "@/components/sections/LiveRankings";
import HowItWorks from "@/components/sections/HowItWorks";
import MobileAppDownload from "@/components/sections/MobileAppDownload";
import Pricing from "@/components/sections/Pricing";
import AuthSection from "@/components/sections/AuthSection";

export default function Home() {
    return (
        <main className="min-h-screen bg-background pt-[60px]">
            <Header />
            <TickerTape />
            <Hero />
            <LiveCommunity />
            <LiveRankings />
            <HowItWorks />
            <Pricing />
            <AuthSection />
            <MobileAppDownload />
            <Footer />
        </main>
    );
}
