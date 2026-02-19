"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName: username, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            if (data.message) {
                // Handle email confirmation if needed, but for now redirect to login
                router.push("/login?message=" + encodeURIComponent(data.message));
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return <div className="min-h-screen bg-background" />;

    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Back Button */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 max-w-[360px] w-full px-6">
                <Link href="/" className="flex items-center space-x-1.5 text-slate-500 dark:text-[#9FB0C7] hover:text-slate-900 dark:hover:text-white transition-colors text-[9px] font-bold tracking-widest uppercase">
                    <ArrowLeft size={12} />
                    <span>Back</span>
                </Link>
            </div>

            {/* Logo Section */}
            <div className="mb-5 flex flex-col items-center mt-12">
                <div className="relative w-32 h-10 mb-3">
                    <Image
                        src="/assets/logo.png"
                        alt="Arizona High Logo"
                        fill
                        className="object-contain"
                    />
                </div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-widest uppercase">Create Account</h1>
                <p className="text-[9px] text-slate-500 dark:text-[#9FB0C7]/60 font-bold tracking-widest uppercase mt-0.5">Join Arizona High</p>
            </div>

            {/* Signup Card */}
            <div className="w-full max-w-[360px] glass-card p-7">
                <form onSubmit={handleSignup} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[9px] font-bold text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black tracking-[0.15em] text-[#9FB0C7] uppercase ml-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@company.com"
                            className="w-full bg-slate-50 dark:bg-[#0D141F] border border-slate-200 dark:border-white/5 rounded-xl h-10 px-4 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-[#9FB0C7]/20"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black tracking-[0.15em] text-slate-500 dark:text-[#9FB0C7] uppercase ml-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Choose a username"
                            className="w-full bg-slate-50 dark:bg-[#0D141F] border border-slate-200 dark:border-white/5 rounded-xl h-10 px-4 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-[#9FB0C7]/20"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black tracking-[0.15em] text-slate-500 dark:text-[#9FB0C7] uppercase ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Create a password"
                                className="w-full bg-slate-50 dark:bg-[#0D141F] border border-slate-200 dark:border-white/5 rounded-xl h-10 px-4 pr-11 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-[#9FB0C7]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9FB0C7]/40 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black tracking-[0.15em] text-slate-500 dark:text-[#9FB0C7] uppercase ml-1">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your password"
                                className="w-full bg-slate-50 dark:bg-[#0D141F] border border-slate-200 dark:border-white/5 rounded-xl h-10 px-4 pr-11 text-slate-900 dark:text-white text-[13px] focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-[#9FB0C7]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9FB0C7]/40 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-white h-11 rounded-xl text-[11px] font-black tracking-[0.1em] uppercase shadow-[0_0_20px_rgba(47,128,255,0.2)] hover:shadow-[0_0_30px_rgba(47,128,255,0.4)] transition-all flex items-center justify-center space-x-2 mt-2"
                    >
                        {isLoading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <span>Create Account</span>
                        )}
                    </button>
                </form>

                <div className="mt-5 text-center">
                    <p className="text-[9px] font-medium text-[#9FB0C7]/60">
                        Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
