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
        <section id="pricing" className="py-[100px] px-6">
            <div className="max-w-[1240px] mx-auto">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-20">
                    <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                        <Zap size={14} className="text-primary" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                            PLANS
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#F5F7FF] mb-6">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="max-w-[700px] text-[#9FB0C7] text-lg leading-relaxed">
                        Choose the plan that matches your trading volume. Upgrade or downgrade anytime — no long-term contracts.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`glass-card p-10 flex flex-col relative transition-all duration-500 overflow-hidden ${plan.primary ? "border-primary/40 shadow-[0_0_40px_rgba(47,128,255,0.1)] scale-105 z-10" : ""
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-6 right-6">
                                    <div className="bg-primary/20 border border-primary/30 rounded-full px-3 py-1">
                                        <span className="text-[10px] font-black tracking-widest text-primary uppercase">
                                            POPULAR
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="mb-10">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${plan.primary ? "bg-primary/10" : "bg-white/5"}`}>
                                        <Zap size={16} className={plan.primary ? "text-primary" : "text-[#9FB0C7]"} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">
                                        {plan.name}
                                    </h3>
                                </div>
                                <div className="flex items-baseline space-x-1">
                                    <span className="text-5xl font-black text-white leading-none">${plan.price}</span>
                                    <span className="text-[#9FB0C7] font-semibold">/mo</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-12 flex-1">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-center space-x-3 group">
                                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.primary ? "bg-primary/10" : "bg-white/5"}`}>
                                            <Check size={12} className={plan.primary ? "text-primary" : "text-[#9FB0C7]"} />
                                        </div>
                                        <span className="text-sm font-medium text-[#9FB0C7] group-hover:text-white transition-colors">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full py-4 rounded-xl font-bold tracking-widest text-xs transition-all ${plan.primary
                                        ? "btn-primary"
                                        : "bg-white/5 border border-white/10 text-[#9FB0C7] hover:bg-white/10 hover:text-white hover:border-white/20"
                                    }`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                <p className="text-center mt-12 text-sm font-semibold text-[#9FB0C7]/50 tracking-wider uppercase">
                    All plans include 30-day money-back guarantee • Secured payment processing • Cancel anytime
                </p>
            </div>
        </section>
    );
};

export default Pricing;
