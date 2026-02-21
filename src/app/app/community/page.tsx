"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Users } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function CommunityPage() {
    const { supabase, user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [activeChannel, setActiveChannel] = useState<'trades' | 'signals' | 'system' | 'general'>('general');
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('community_messages')
            .select('*')
            .eq('channel', activeChannel)
            .order('created_at', { ascending: true })
            .limit(50);

        if (data) setMessages(data);
        if (error) console.error("Error fetching messages:", error);
    };

    useEffect(() => {
        fetchMessages();

        const channel = supabase
            .channel(`community_${activeChannel}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'community_messages',
                filter: `channel=eq.${activeChannel}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, activeChannel]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !user) return;

        const { error } = await supabase
            .from('community_messages')
            .insert([
                {
                    user_id: user.id,
                    username: user.email?.split('@')[0] || 'Anonymous',
                    message: inputValue,
                    channel: activeChannel
                }
            ]);

        if (error) {
            console.error("Error sending message:", error);
        } else {
            setInputValue("");
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 dark:bg-[#050914] dark:text-slate-100 pt-[80px]">
            <div className="h-[calc(100vh-160px)] flex flex-col w-full max-w-[1000px] mx-auto animate-in fade-in duration-500 px-4">
                {/* Channel Selector */}
                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 border-b border-slate-200 dark:border-white/5">
                    {['general', 'trades', 'signals', 'system'].map((ch) => (
                        <button
                            key={ch}
                            onClick={() => setActiveChannel(ch as any)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeChannel === ch
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            #{ch}
                        </button>
                    ))}
                </div>

                {/* Messages Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto space-y-3 pr-4"
                >
                    {messages.map((msg) => {
                        const isMe = msg.user_id === user?.id;
                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                                <div className={`max-w-[85%] px-3 py-2 rounded-lg text-[11px] font-bold border ${isMe
                                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-100'
                                    : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300'
                                    }`}>
                                    <span className="text-[8px] opacity-40 mr-2 uppercase">{msg.username}</span>
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
                            placeholder={`Message #${activeChannel}...`}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-3 pl-4 pr-12 text-[11px]"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded">
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
