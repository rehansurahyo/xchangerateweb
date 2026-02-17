"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError(res.error);
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return <div className="min-h-screen bg-[#050A12]" />;

    return (
        <div className="min-h-screen w-full bg-[#050A12] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Logo Section */}
            <div className="mb-10 flex flex-col items-center group">
                <div className="text-[#FF1F1F] mb-3">
                    <svg width="64" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.00018 9.87784C2.26629 8.5262 4.14856 2.00003 11.9996 2C19.8507 2.00003 21.7329 8.52623 21.999 9.87787C22.0494 10.1332 21.9463 10.3951 21.7326 10.5376L11.9996 17.0263L2.2666 10.5376C2.05291 10.3951 1.94978 10.1332 2.00018 9.87784Z" fill="#DC2626" />
                        <path d="M12 14L8 11L12 6L16 11L12 14Z" fill="white" />
                    </svg>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-white tracking-[0.3em] uppercase">ARIZONA HIGH</span>
                    <span className="text-[8px] font-bold text-[#9FB0C7]/60 tracking-[0.2em] uppercase mt-1">THINK AI</span>
                </div>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-[420px] glass-card p-10">
                <form onSubmit={handleLogin} className="space-y-6">
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
                            className="w-full bg-[#0D141F] border border-white/5 rounded-xl py-4 px-5 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-[#9FB0C7]/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] font-black tracking-[0.15em] text-[#9FB0C7] uppercase">
                                Password
                            </label>
                        </div>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter password"
                                className="w-full bg-[#0D141F] border border-white/5 rounded-xl py-4 px-5 pr-12 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-[#9FB0C7]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9FB0C7]/40 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div className="flex justify-end pt-1">
                            <Link href="/forgot-password" title="bold" className="text-[10px] font-bold text-primary hover:underline tracking-tight">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl text-xs font-black tracking-[0.1em] uppercase shadow-[0_0_20px_rgba(47,128,255,0.2)] hover:shadow-[0_0_30px_rgba(47,128,255,0.4)] transition-all flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-medium text-[#9FB0C7]/60">
                        No account? <Link href="/signup" className="text-primary font-bold hover:underline">Create one</Link>
                    </p>
                </div>
            </div>

            {/* Footer Text */}
            <div className="mt-10 flex items-center space-x-2 text-[9px] font-medium text-[#9FB0C7]/30 tracking-tight">
                <span>Secured connection</span>
                <span className="w-1 h-1 rounded-full bg-[#9FB0C7]/20" />
                <span>256-bit encryption</span>
            </div>
        </div>
    );
}
