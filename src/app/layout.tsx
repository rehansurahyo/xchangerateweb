import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ['400', '500', '600', '700', '800']
});

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
            <body className={plusJakartaSans.className}>
                <AuthProvider>
                    <DashboardLayout>{children}</DashboardLayout>
                </AuthProvider>
            </body>
        </html>
    );
}
