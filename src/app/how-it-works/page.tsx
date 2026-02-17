import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TickerTape from "@/components/ui/TickerTape";
import HowItWorks from "@/components/sections/HowItWorks";

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen bg-[#050A12]">
            <Header />
            <div className="pt-[80px]">
                <TickerTape />
                <HowItWorks />
            </div>
            <Footer />
        </main>
    );
}
