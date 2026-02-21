import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TickerTape from "@/components/ui/TickerTape";
import LiveRankings from "@/components/sections/LiveRankings";

export default function PerformancePage() {
    return (
        <main className="min-h-screen bg-background dark:bg-[#050A12]">
            <div className="pt-20">
                <TickerTape />
                <div className="max-w-[1200px] mx-auto px-6 py-12">
                    <LiveRankings />
                </div>
            </div>
        </main>
    );
}
