"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Users, Zap, TrendingUp } from "lucide-react";
import { MOCK_CHAT } from "@/lib/mock";

export default function CommunityPage() {
    const [messages, setMessages] = useState(MOCK_CHAT);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            name: "JT",
            message: inputValue,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'GENERAL'
        };

        setMessages([...messages, newMessage]);
        setInputValue("");
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 dark:bg-gradient-to-b dark:from-[#050914] dark:via-[#070B14] dark:to-[#040815] dark:text-slate-100 pt-[80px]">
            <div className="h-[calc(100vh-160px)] flex flex-col w-full max-w-[1000px] mx-auto animate-in fade-in duration-500 px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Trading Floor</h2>
                        <div className="flex items-center space-x-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-[#22D3A6]" />
                            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">248 online</span>
                        </div>
                    </div>
                    <button className="flex items-center space-x-1.5 bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 px-2.5 py-1 rounded text-[9px] text-slate-500 dark:text-slate-400 font-black transition-colors">
                        <Users size={12} />
                        <span>248</span>
                    </button>
                </div>

                {/* Messages Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto space-y-3 pr-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent"
                >
                    {messages.map((msg) => {
                        const isMe = msg.name === 'JT';
                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                                {!isMe && (
                                    <div className="flex items-center space-x-2 mb-0.5 ml-1">
                                        <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{msg.name === 'JT' ? 'JohnTrader' : `Trader_${msg.name}`}</span>
                                        <span className="text-[8px] text-slate-400 dark:text-slate-500 font-mono tracking-tighter">{msg.time}</span>
                                    </div>
                                )}
                                {isMe && <span className="text-[8px] text-slate-400 dark:text-slate-500 mb-0.5 mr-1 font-mono tracking-tighter">{msg.time} You</span>}

                                <div className={`max-w-[85%] px-3 py-2 rounded-lg text-[11px] leading-relaxed font-bold border ${isMe
                                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-100 rounded-tr-none'
                                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-tl-none shadow-sm dark:shadow-none'
                                    }`}>
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="mt-3 pb-6">
                    <form onSubmit={handleSend} className="relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Message..."
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-3 pr-10 text-slate-900 dark:text-white text-[11px] font-bold focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                        >
                            <Send size={12} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
