import type { Metadata } from "next";
import { Inter } from "next/font/google";
import DashboardLayout from "@/components/layout/DashboardLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Arizona High | World's Most Profitable Futures AI AutoTrader",
    description: "Institutional-grade AI futures trading with verified performance and community transparency.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <DashboardLayout>{children}</DashboardLayout>
            </body>
        </html>
    );
}
