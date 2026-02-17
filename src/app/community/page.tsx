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
        <div className="h-[calc(100vh-160px)] flex flex-col w-full max-w-[1000px] mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-white">Trading Floor</h2>
                    <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22D3A6]" />
                        <span className="text-xs text-[#9FB0C7] font-medium">248 online</span>
                    </div>
                </div>
                <button className="flex items-center space-x-2 bg-[#1E293B] hover:bg-[#1E293B]/80 px-3 py-1.5 rounded text-xs text-[#9FB0C7] transition-colors border border-white/5">
                    <Users size={14} />
                    <span>248</span>
                </button>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
                {messages.map((msg) => {
                    const isMe = msg.name === 'JT';
                    return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                            {!isMe && (
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-[10px] font-bold text-[#9FB0C7] uppercase">{msg.name === 'JT' ? 'JohnTrader' : `Trader_${msg.name}`}</span>
                                    <span className="text-[10px] text-[#9FB0C7]/40">{msg.time}</span>
                                </div>
                            )}
                            {isMe && <span className="text-[10px] text-[#9FB0C7]/40 mb-1">{msg.time} You</span>}

                            <div className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${isMe
                                    ? 'bg-[#1D4ED8]/20 border border-[#1D4ED8]/30 text-blue-100 rounded-tr-none'
                                    : 'bg-[#1E293B]/50 border border-white/5 text-[#9FB0C7] rounded-tl-none'
                                }`}>
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="mt-4">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Message..."
                        className="w-full bg-[#0F172A] border border-white/10 rounded-lg py-3 pl-4 pr-12 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-[#9FB0C7]/20"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                    >
                        <Send size={14} />
                    </button>
                </form>
            </div>
        </div>
    );
}
