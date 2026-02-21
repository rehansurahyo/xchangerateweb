"use client";

import { Check, Zap, Rocket, Building2, Crown } from "lucide-react";
import { useState } from "react";

export default function BillingPage() {
    const [activePlan, setActivePlan] = useState('Starter');

    const plans = [
        {
            name: 'Starter',
            price: '29',
            icon: Rocket,
            color: 'text-blue-400',
            features: ['Up to 3 API Sessions', 'Standard AI Models', 'Priority Support']
        },
        {
            name: 'Pro',
            price: '79',
            icon: Zap,
            color: 'text-primary',
            isPopular: true,
            features: ['Up to 10 API Sessions', 'Advanced AI Models', 'Priority Support', 'Full Discord Access']
        },
        {
            name: 'Elite',
            price: '249',
            icon: Building2,
            color: 'text-[#22D3A6]',
            features: ['Unlimited API Sessions', 'Institutional Tools', '24/7 Dedicated Support', 'Custom Strategy Access']
        }
    ];

    return (
        <div className="max-w-[1000px] mx-auto space-y-12 pt-24 px-6 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Institutional Access</h2>
                <p className="text-xs font-bold text-slate-500 dark:text-[#9FB0C7]/40 uppercase tracking-[0.3em]">Select your performance tier</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
                {plans.map((plan) => (
                    <div key={plan.name} className={`glass-card p-10 flex flex-col space-y-8 border ${activePlan === plan.name ? 'border-blue-600 bg-blue-500/5' : 'border-slate-200 dark:border-white/5'}`}>
                        <div className="space-y-4">
                            <div className={`w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center ${plan.color}`}>
                                <plan.icon size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase">{plan.name}</h4>
                                <div className="flex items-baseline space-x-1">
                                    <span className="text-3xl font-black text-slate-900 dark:text-white">${plan.price}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">/ Month</span>
                                </div>
                            </div>
                        </div>
                        <ul className="flex-1 space-y-4">
                            {plan.features.map(f => (
                                <li key={f} className="flex items-center space-x-3 text-[11px] font-bold text-slate-600 dark:text-[#9FB0C7]">
                                    <Check size={14} className="text-blue-600" />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePlan === plan.name ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white'}`}>
                            {activePlan === plan.name ? 'SELECTED' : 'UPGRADE'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
