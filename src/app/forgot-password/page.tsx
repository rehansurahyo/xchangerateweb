"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        console.log("ForgotPassword mounted");
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-background" />;
    }

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            });

            if (error) {
                throw error;
            }

            setMessage({
                type: 'success',
                text: 'Check your email for the password reset link.'
            });
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || "Failed to send reset email."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-white dark:bg-[#050A12]">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow dark:opacity-100 opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000 dark:opacity-100 opacity-50" />
            </div>

            {/* Back Button */}
            <div className="absolute top-8 left-8">
                <Link
                    href="/#auth"
                    className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 dark:text-[#9FB0C7] dark:hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold tracking-wide">Back</span>
                </Link>
            </div>

            {/* Main Card */}
            <div className="glass-card w-full max-w-[500px] p-10 duration-500 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="flex flex-col items-center text-center space-y-6 mb-8">
                    {/* Logo Section */}
                    <div className="w-32 h-8 relative flex items-center justify-center mb-2">
                        <Image
                            src="/assets/logo.png"
                            alt="Arizona High Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Reset Password
                    </h1>
                    <p className="text-slate-500 dark:text-[#9FB0C7] text-sm max-w-[300px]">
                        Enter your email to receive a reset link
                    </p>
                </div>

                <form onSubmit={handleReset} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#9FB0C7] uppercase ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9FB0C7]/40 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@company.com"
                                className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-xs font-bold text-center ${message.type === 'success'
                            ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                            : 'bg-red-500/10 border border-red-500/20 text-red-500'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <span className="text-sm font-black tracking-widest uppercase">Send Reset Link</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link
                        href="/#auth"
                        className="text-xs font-bold text-slate-400 hover:text-slate-900 dark:text-[#9FB0C7] dark:hover:text-white transition-colors tracking-wide"
                    >
                        Return to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
