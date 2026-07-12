"use client";

import React, { useState } from "react";
import { ArrowUp } from "lucide-react";

interface Message {
    id: string;
    sender: "user" | "assistant";
    text: string;
    time: string;
}

export default function ChatCard() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "assistant",
            text: "Hi! Ask me about room metrics, dates, or occupancy — plain English works fine.",
            time: "14:02"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setInput("");

        const now = new Date();
        const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        setMessages(prev => [...prev, { id: crypto.randomUUID(), sender: "user", text: userText, time: timeString }]);
        setLoading(true);

        try {
            // Endpoint call to your worker
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Add this line
            const response = await fetch(`${baseUrl}/api/chat`, { // Use full URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText }),
            });
            const data = await response.json();

            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                sender: "assistant",
                text: data.response || "No data available.",
                time: timeString
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: crypto.randomUUID(), sender: "assistant", text: "Connection error.", time: timeString
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="bg-[#202022] px-2 py-1 rounded text-[10px] font-bold text-zinc-400">AI</div>
                    <h2 className="text-sm font-bold text-white tracking-wide">Ops Assistant</h2>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#53c97f]"></div>
            </div>

            {/* Messages */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`text-[13px] font-medium leading-relaxed ${msg.sender === 'user' ? 'text-zinc-300 text-right' : 'text-white border-l-2 border-white/10 pl-3'}`}>
                            {msg.text}
                        </div>
                        <span className="text-[10px] text-zinc-600 font-mono mt-2">{msg.time}</span>
                    </div>
                ))}
                {loading && (
                    <div className="text-[13px] font-medium text-zinc-500 border-l-2 border-white/10 pl-3 animate-pulse">
                        Checking records...
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="relative flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something to start"
                    className="w-full bg-transparent border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-500"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="absolute right-1.5 w-9 h-9 rounded-full bg-[#dfa553] flex items-center justify-center disabled:opacity-50 transition-opacity"
                >
                    <ArrowUp className="w-5 h-5 text-[#131315] stroke-[2.5]" />
                </button>
            </form>

        </div>
    );
}