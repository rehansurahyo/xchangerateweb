import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TickerTape from "@/components/ui/TickerTape";
import LiveRankings from "@/components/sections/LiveRankings";

export default function PerformancePage() {
    return (
        <main className="min-h-screen bg-[#050A12]">
            <Header />
            <div className="pt-[80px]">
                <TickerTape />
                <LiveRankings />
            </div>
            <Footer />
        </main>
    );
}
