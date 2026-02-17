import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TickerTape from "@/components/ui/TickerTape";
import Pricing from "@/components/sections/Pricing";

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-[#050A12]">
            <Header />
            <div className="pt-[80px]">
                <TickerTape />
                <Pricing />
            </div>
            <Footer />
        </main>
    );
}
