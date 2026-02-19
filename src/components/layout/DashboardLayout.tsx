"use client";

import TopNav from "./TopNav";
import Footer from "./Footer";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isAuthPage = pathname === "/" || pathname === "/forgot-password" || pathname === "/login" || pathname === "/signup";

    if (isAuthPage) return <>{children}</>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050A12]">
            <TopNav />
            <main className="pt-24 pb-12 px-4 md:px-8 max-w-[1440px] mx-auto">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
