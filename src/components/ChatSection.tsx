"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

interface Message {
    id: string;
    sender: "user" | "assistant";
    text: string;
}

export default function ChatSection() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            sender: "assistant",
            text: "Hello. You can ask me anything about apartment availability, revenue, or daily schedules.",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setInput("");

        setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "user", text: userText }]);
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText }),
            });
            const data = await response.json();

            setMessages((prev) => [...prev, {
                id: crypto.randomUUID(),
                sender: "assistant",
                text: data.response || "No response generated.",
            }]);
        } catch (error) {
            setMessages((prev) => [...prev, {
                id: crypto.randomUUID(), sender: "assistant", text: "Connection error."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#141416]">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">AI Assistant</span>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] px-4 py-2.5 text-[13px] leading-relaxed rounded-2xl ${msg.sender === "user"
                                ? "bg-white text-black rounded-tr-sm"
                                : "bg-zinc-900 text-zinc-200 border border-white/5 rounded-tl-sm"
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-900 border border-white/5 text-zinc-500 text-[13px] rounded-2xl rounded-tl-sm px-4 py-2.5 animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/5">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 bg-zinc-900 text-white text-sm border border-white/10 rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-1.5 p-1.5 bg-white text-black disabled:opacity-50 rounded-full"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}