"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

    if (!mounted) return <div className="min-h-screen bg-[#050A12]" />;

    return (
        <div className="min-h-screen w-full bg-[#050A12] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Back Button */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 max-w-[420px] w-full px-6">
                <Link href="/" className="flex items-center space-x-2 text-[#9FB0C7] hover:text-white transition-colors text-[10px] font-bold tracking-widest uppercase">
                    <ArrowLeft size={14} />
                    <span>Back</span>
                </Link>
            </div>

            {/* Logo Section */}
            <div className="mb-6 flex flex-col items-center mt-12">
                <div className="text-[#FF1F1F] mb-4">
                    <svg width="40" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.00018 9.87784C2.26629 8.5262 4.14856 2.00003 11.9996 2C19.8507 2.00003 21.7329 8.52623 21.999 9.87787C22.0494 10.1332 21.9463 10.3951 21.7326 10.5376L11.9996 17.0263L2.2666 10.5376C2.05291 10.3951 1.94978 10.1332 2.00018 9.87784Z" fill="#DC2626" />
                        <path d="M12 14L8 11L12 6L16 11L12 14Z" fill="white" />
                    </svg>
                </div>
                <h1 className="text-xl font-black text-white tracking-widest uppercase">Create Account</h1>
                <p className="text-[10px] text-[#9FB0C7]/60 font-bold tracking-widest uppercase mt-1">Join Arizona High</p>
            </div>

            {/* Signup Card */}
            <div className="w-full max-w-[420px] glass-card p-10">
                <form onSubmit={handleSignup} className="space-y-5">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-bold text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-[0.15em] text-[#9FB0C7] uppercase ml-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@company.com"
                            className="w-full bg-[#0D141F] border border-white/5 rounded-xl py-3.5 px-5 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-[#9FB0C7]/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-[0.15em] text-[#9FB0C7] uppercase ml-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Choose a username"
                            className="w-full bg-[#0D141F] border border-white/5 rounded-xl py-3.5 px-5 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-[#9FB0C7]/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-[0.15em] text-[#9FB0C7] uppercase ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Create a password"
                                className="w-full bg-[#0D141F] border border-white/5 rounded-xl py-3.5 px-5 pr-12 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-[#9FB0C7]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9FB0C7]/40 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-[0.15em] text-[#9FB0C7] uppercase ml-1">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your password"
                                className="w-full bg-[#0D141F] border border-white/5 rounded-xl py-3.5 px-5 pr-12 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-[#9FB0C7]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9FB0C7]/40 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl text-xs font-black tracking-[0.1em] uppercase shadow-[0_0_20px_rgba(47,128,255,0.2)] hover:shadow-[0_0_30px_rgba(47,128,255,0.4)] transition-all flex items-center justify-center space-x-2 mt-4"
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <span>Create Account</span>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-[10px] font-medium text-[#9FB0C7]/60">
                        Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
