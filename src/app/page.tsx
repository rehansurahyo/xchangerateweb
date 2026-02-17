"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TickerTape from "@/components/ui/TickerTape";
import Hero from "@/components/sections/Hero";
import LiveCommunity from "@/components/sections/LiveCommunity";
import LiveRankings from "@/components/sections/LiveRankings";
import HowItWorks from "@/components/sections/HowItWorks";
import Pricing from "@/components/sections/Pricing";
import AuthSection from "@/components/sections/AuthSection";

export default function Home() {
    return (
        <main className="min-h-screen bg-[#050A12] pt-[100px]">
            <Header />
            <TickerTape />
            <Hero />
            <LiveCommunity />
            <LiveRankings />
            <HowItWorks />
            <Pricing />
            <AuthSection />
            <Footer />
        </main>
    );
}
