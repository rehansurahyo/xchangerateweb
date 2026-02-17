"use client";

import { Check, Zap, Rocket, Building2, Crown } from "lucide-react";
import { useState } from "react";

export default function BillingPage() {
    const [activePlan, setActivePlan] = useState('Professional');

    const plans = [
        {
            name: 'Starter',
            price: '29',
            icon: Rocket,
            color: 'text-blue-400',
            features: ['Up to 2 API Sessions', 'Standard AI Models', 'Email Support', 'Basic Discord Access']
        },
        {
            name: 'Professional',
            price: '79',
            icon: Zap,
            color: 'text-primary',
            isPopular: true,
            features: ['Unlimited API Sessions', 'Advanced AI Models', 'Priority Support', 'Full Community Access', 'Custom Risk Params']
        },
        {
            name: 'Enterprise',
            price: '249',
            icon: Building2,
            color: 'text-[#22D3A6]',
            features: ['Institutional Onboarding', 'Private AI Instance', '24/7 Phone Support', 'API Webhook Access', 'White-label Reports']
        }
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-white uppercase tracking-tight">Choice Your Plan</h2>
                <p className="text-xs font-bold text-[#9FB0C7]/40 uppercase tracking-[0.3em]">Scalable institutional trading for everyone</p>
            </div>

            {/* Current Active Plan Block */}
            <div className="glass-card p-10 bg-primary/[0.02] border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                    <Crown size={60} className="text-primary/10" />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="space-y-4 text-center md:text-left">
                        <div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/10 px-3 py-1 rounded-full">Active Plan</span>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight mt-3">Professional Suite</h3>
                        </div>
                        <div className="flex items-center justify-center md:justify-start space-x-6">
                            <div>
                                <p className="text-[10px] font-black text-[#9FB0C7]/40 uppercase tracking-widest mb-1">Price</p>
                                <p className="text-xl font-bold text-white">$79<span className="text-sm font-medium opacity-40">/mo</span></p>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div>
                                <p className="text-[10px] font-black text-[#9FB0C7]/40 uppercase tracking-widest mb-1">Status</p>
                                <p className="text-xl font-bold text-[#22D3A6]">RECURRING</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/[0.05] transition-all">
                            Update Billing
                        </button>
                        <button className="px-8 py-4 rounded-2xl bg-red-400/10 border border-red-400/20 text-[10px] font-black text-red-400 uppercase tracking-widest hover:bg-red-400/20 transition-all">
                            Cancel Subscription
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`glass-card p-10 flex flex-col space-y-8 relative overflow-hidden transition-all duration-500 hover:scale-[1.02] ${activePlan === plan.name ? 'border-primary/40 bg-primary/[0.03] shadow-[0_0_40px_rgba(47,128,255,0.1)]' : 'border-white/5'
                            }`}
                    >
                        {plan.isPopular && (
                            <div className="absolute top-0 right-0 p-4">
                                <span className="text-[8px] font-black text-white bg-primary px-3 py-1 rounded-full uppercase tracking-tighter">RECOMMENDED</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center ${plan.color}`}>
                                <plan.icon size={28} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tight">{plan.name}</h4>
                                <div className="flex items-baseline space-x-1">
                                    <span className="text-3xl font-black text-white">${plan.price}</span>
                                    <span className="text-xs font-bold text-[#9FB0C7]/40 uppercase tracking-widest">/ Month</span>
                                </div>
                            </div>
                        </div>

                        <ul className="flex-1 space-y-4">
                            {plan.features.map(f => (
                                <li key={f} className="flex items-center space-x-3 text-xs font-medium text-[#9FB0C7]">
                                    <Check size={16} className={`shrink-0 ${activePlan === plan.name ? 'text-primary' : 'text-[#9FB0C7]/20'}`} />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => setActivePlan(plan.name)}
                            className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activePlan === plan.name
                                    ? 'bg-primary text-white shadow-[0_0_20px_rgba(47,128,255,0.4)] cursor-default'
                                    : 'bg-white/[0.03] border border-white/5 text-[#9FB0C7] hover:text-white hover:bg-white/[0.05]'
                                }`}
                        >
                            {activePlan === plan.name ? 'CURRENT PLAN' : 'SELECT PLAN'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
