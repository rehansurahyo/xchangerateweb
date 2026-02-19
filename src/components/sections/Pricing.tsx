"use client";

import { Check, Zap } from "lucide-react";

const Pricing = () => {
    const plans = [
        {
            name: "Starter",
            price: "29",
            features: [
                "Up to 3 API Sessions",
                "Basic Trading Analytics",
                "Email Support",
                "100 Trades / Month",
                "Standard Execution",
            ],
            buttonText: "SUBSCRIBE",
            primary: false,
        },
        {
            name: "Pro",
            price: "79",
            popular: true,
            features: [
                "Up to 10 API Sessions",
                "Advanced Analytics",
                "Priority Support",
                "Unlimited Trades",
                "Fast Execution",
                "Risk Management Tools",
            ],
            buttonText: "SUBSCRIBE NOW",
            primary: true,
        },
        {
            name: "Elite",
            price: "199",
            features: [
                "Unlimited API Sessions",
                "Premium Analytics & Reporting",
                "24/7 Dedicated Support",
                "Unlimited Trades",
                "Lightning Execution",
                "Advanced Risk Management",
                "Custom Trading Strategies",
                "White-Label Options",
            ],
            buttonText: "UPGRADE PLAN",
            primary: false,
        },
    ];

    return (
        <section id="pricing" className="py-12 px-6 bg-white text-slate-900 dark:bg-[#070B14] dark:text-slate-100">
            <div className="max-w-[900px] mx-auto">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5 mb-3">
                        <Zap size={13} className="text-primary" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                            PLANS
                        </span>
                    </div>
                    <h2 className="text-slate-900 dark:text-[#F5F7FF] mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="max-w-[700px] text-slate-500 dark:text-[#9FB0C7] text-[15px] leading-relaxed">
                        Choose the plan that matches your trading volume. Upgrade or downgrade anytime — no long-term contracts.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`glass-card p-8 flex flex-col relative transition-all duration-500 overflow-hidden bg-white dark:bg-inherit border border-slate-200 dark:border-white/5 ${plan.primary ? "border-primary/40 shadow-[0_0_40px_rgba(47,128,255,0.1)] scale-105 z-10" : ""
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-4 right-4">
                                    <div className="bg-primary/20 border border-primary/30 rounded-full px-2 py-0.5">
                                        <span className="text-[9px] font-bold tracking-widest text-primary uppercase">
                                            POPULAR
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="mb-8">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${plan.primary ? "bg-primary/10" : "bg-slate-100 dark:bg-white/5"}`}>
                                        <Zap size={14} className={plan.primary ? "text-primary" : "text-slate-400 dark:text-[#9FB0C7]"} />
                                    </div>
                                    <h3 className="text-slate-900 dark:text-white tracking-tight">
                                        {plan.name}
                                    </h3>
                                </div>
                                <div className="flex items-baseline space-x-1">
                                    <span className="text-4xl font-bold text-slate-900 dark:text-white leading-none">${plan.price}</span>
                                    <span className="text-slate-500 dark:text-[#9FB0C7] text-sm font-semibold">/mo</span>
                                </div>
                            </div>

                            <div className="space-y-2.5 mb-8 flex-1">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-center space-x-2 group">
                                        <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${plan.primary ? "bg-primary/10" : "bg-slate-100 dark:bg-white/5"}`}>
                                            <Check size={10} className={plan.primary ? "text-primary" : "text-slate-400 dark:text-[#9FB0C7]"} />
                                        </div>
                                        <span className="text-[11px] font-medium text-slate-500 dark:text-[#9FB0C7] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full h-10 rounded-lg font-bold tracking-widest text-[11px] transition-all ${plan.primary
                                    ? "btn-primary"
                                    : "bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-[#9FB0C7] hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20"
                                    }`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                <p className="text-center mt-12 text-sm font-semibold text-slate-400 dark:text-[#9FB0C7]/50 tracking-wider uppercase">
                    All plans include 30-day money-back guarantee • Secured payment processing • Cancel anytime
                </p>
            </div>
        </section>
    );
};

export default Pricing;
