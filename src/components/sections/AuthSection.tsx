"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, Loader2 } from "lucide-react";

const AuthSection = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sign In Handler
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                if (res.error.includes("Email not confirmed")) {
                    setError("Email not confirmed. Please check your inbox or spam folder.");
                } else {
                    setError(res.error);
                }
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Sign Up Handler
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.target as HTMLFormElement);
        const fullName = formData.get("fullName") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            if (data.message) {
                setError(data.message);
                setTimeout(() => setActiveTab("signin"), 3000);
                return;
            }

            await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="auth" className="py-12 px-6 bg-white text-slate-900 dark:bg-[#070B14] dark:text-slate-100">
            <div className="max-w-[1200px] mx-auto flex flex-col items-center">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-slate-900 dark:text-[#F5F7FF] mb-4 tracking-tight">
                        Start Trading in Minutes
                    </h2>
                    <p className="max-w-[600px] mx-auto text-slate-500 dark:text-[#9FB0C7] text-[15px] leading-relaxed">
                        Access automated trading, live community insights, and verified performance.
                    </p>
                </div>

                {/* Auth Card */}
                <div className="glass-card w-full max-w-[500px] overflow-hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    {/* Tabs */}
                    <div className="flex border-b border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                        <button
                            onClick={() => { setActiveTab("signin"); setError(null); }}
                            className={`flex-1 py-4 text-[9px] font-black tracking-[0.2em] uppercase transition-all relative ${activeTab === "signin" ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-[#9FB0C7]/40 hover:text-slate-600 dark:hover:text-[#9FB0C7]"
                                }`}
                        >
                            SIGN IN
                            {activeTab === "signin" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in" />
                            )}
                        </button>
                        <button
                            onClick={() => { setActiveTab("signup"); setError(null); }}
                            className={`flex-1 py-4 text-[9px] font-black tracking-[0.2em] uppercase transition-all relative ${activeTab === "signup" ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-[#9FB0C7]/40 hover:text-slate-600 dark:hover:text-[#9FB0C7]"
                                }`}
                        >
                            CREATE ACCOUNT
                            {activeTab === "signup" && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in" />
                            )}
                        </button>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[11px] font-bold text-center animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        {activeTab === "signin" ? (
                            <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#9FB0C7] uppercase ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9FB0C7]/40 group-focus-within:text-primary transition-colors" size={16} />
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="name@company.com"
                                            className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl h-11 pl-11 pr-4 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#9FB0C7] uppercase">
                                            Password
                                        </label>
                                        <Link href="/forgot-password" title="bold" className="text-[9px] font-bold text-primary tracking-widest uppercase hover:underline">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9FB0C7]/40 group-focus-within:text-primary transition-colors" size={16} />
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            minLength={6}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl h-11 pl-11 pr-11 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9FB0C7]/40 hover:text-slate-900 dark:hover:text-white"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary w-full h-11 flex items-center justify-center space-x-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <>
                                            <span className="text-[11px] font-black tracking-[0.2em]">SIGN IN</span>
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-6 animate-in fade-in slide-in-from-left-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#9FB0C7] uppercase ml-1">
                                        Full Name
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9FB0C7]/40 group-focus-within:text-primary transition-colors" size={16} />
                                        <input
                                            name="fullName"
                                            type="text"
                                            required
                                            placeholder="Enter your name"
                                            className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl h-11 pl-11 pr-4 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#9FB0C7] uppercase ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9FB0C7]/40 group-focus-within:text-primary transition-colors" size={16} />
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="name@company.com"
                                            className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl h-11 pl-11 pr-4 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-[#9FB0C7] uppercase ml-1">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9FB0C7]/40 group-focus-within:text-primary transition-colors" size={16} />
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            minLength={6}
                                            placeholder="Minimum 8 characters"
                                            className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl h-11 pl-11 pr-11 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9FB0C7]/40 hover:text-slate-900 dark:hover:text-white"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary w-full h-11 flex items-center justify-center space-x-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <>
                                            <span className="text-[11px] font-black tracking-[0.2em]">CREATE ACCOUNT</span>
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuthSection;
