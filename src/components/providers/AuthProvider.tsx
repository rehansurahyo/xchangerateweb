"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { xcrClient } from "@/lib/xcrClient";
import type { User, SupabaseClient, AuthChangeEvent, Session } from "@supabase/supabase-js";

type AuthContextType = {
    user: User | null;
    profile: any | null;
    supabase: SupabaseClient;
    isLoading: boolean;
};

const Context = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMe = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                setProfile(null);
                return;
            }

            const res = await fetch("/api/me", {
                headers: { Authorization: `Bearer ${session.access_token}` },
                cache: "no-store",
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setProfile(data.profile);
                }
            }
        } catch (err) {
            console.error("[AuthProvider] fetchMe error:", err);
        }
    };

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);

            if (session) {
                xcrClient.setToken(session.access_token);
                await fetchMe();
            } else {
                xcrClient.setToken(null);
                setProfile(null);
            }

            setIsLoading(false);
            if (event === "SIGNED_IN") router.refresh();
            if (event === "SIGNED_OUT") {
                setUser(null);
                setProfile(null);
                router.push("/login");
                router.refresh();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, router]);

    return (
        <Context.Provider value={{ user, profile, supabase, isLoading }}>
            {children}
        </Context.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};
