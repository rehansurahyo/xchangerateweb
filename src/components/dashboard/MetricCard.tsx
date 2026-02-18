"use client";

import { LucideIcon } from "lucide-react";

interface MetricCardProps {
    label: string;
    value: string;
    subValue: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

const MetricCard = ({ label, value, subValue, icon: Icon, trend }: MetricCardProps) => {
    return (
        <div className="glass-card p-5 flex flex-col items-center justify-center text-center space-y-1.5 group overflow-hidden relative border border-white/5 bg-[#0A101A]">
            <div className="flex items-center space-x-2 text-[#9FB0C7]/60">
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
            </div>
            <h3 className={`text-2xl font-black tracking-tight ${label.includes('P&L') ? 'text-[#22D3A6]' : 'text-white'
                }`}>
                {value}
            </h3>
            {/* Optional subtle glow for P&L */}
            {label.includes('P&L') && (
                <div className="absolute inset-0 bg-[#22D3A6]/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            )}
        </div>
    );
};

export default MetricCard;
