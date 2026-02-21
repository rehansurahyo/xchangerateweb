"use client";

import { LucideIcon } from "lucide-react";

interface MetricCardProps {
    label: string;
    value: string;
    subValue?: string;
    icon?: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

const MetricCard = ({ label, value }: MetricCardProps) => {
    return (
        <div className="bg-white dark:bg-[#0A101A] border border-slate-200 dark:border-white/[0.03] rounded-lg px-6 py-4 flex flex-col items-center justify-center text-center group hover:bg-slate-50 dark:hover:bg-[#0E1729]/80 transition-all duration-300 shadow-sm dark:shadow-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-[#9FB0C7]/40 mb-2 leading-none">{label}</span>
            <h3 className={`text-2xl font-black tracking-tighter leading-none ${label.toUpperCase().includes('P&L') ? 'text-emerald-500 dark:text-[#22D3A6]' : 'text-slate-900 dark:text-white'}`}>
                {value}
            </h3>
        </div>
    );
};

export default MetricCard;
