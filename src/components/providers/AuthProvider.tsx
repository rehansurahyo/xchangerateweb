"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import type { User, SupabaseClient, AuthChangeEvent, Session } from "@supabase/supabase-js";

type AuthContextType = {
    user: User | null;
    supabase: SupabaseClient;
    isLoading: boolean;
};

const Context = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
            if (event === "SIGNED_IN") router.refresh();
            if (event === "SIGNED_OUT") {
                setUser(null);
                router.push("/login");
                router.refresh();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, router]);

    return (
        <Context.Provider value={{ user, supabase, isLoading }}>
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
