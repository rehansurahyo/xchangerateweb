"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9" />; // Placeholder to prevent hydration mismatch
    }

    return (
        <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group"
            aria-label="Toggle Theme"
        >
            {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4 text-[#9FB0C7] group-hover:text-yellow-400 transition-colors" />
            ) : (
                <Moon className="h-4 w-4 text-slate-600 group-hover:text-slate-900 transition-colors" />
            )}
        </button>
    );
}
