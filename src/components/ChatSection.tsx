"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

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
            text: "Hi! Ask me about room metrics, dates, or occupancy — plain English works fine.",
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
                text: data.response || "Sorry, I didn't get a response back — try again.",
            }]);
        } catch (error) {
            console.error("Chat sync crash", error);
            setMessages((prev) => [...prev, {
                id: crypto.randomUUID(),
                sender: "assistant",
                text: "Couldn't reach the server. Check your connection and try again."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-3xl flex flex-col h-full overflow-hidden bg-[#1c1c24]">
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-2 border-b border-white/5">
                <div className="w-7 h-7 rounded-full bg-[#8783f5] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-black">Ops Assistant</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3fd9a4] ml-auto" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] px-3.5 py-2.5 text-[13px] font-medium leading-relaxed ${msg.sender === "user"
                                ? "bg-[#8783f5] text-black rounded-2xl rounded-br-md"
                                : "bg-[#26262f] text-white rounded-2xl rounded-bl-md"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-[#26262f] rounded-2xl rounded-bl-md px-3.5 py-2.5">
                            <span className="text-[11px] font-semibold text-[#9696a3] animate-soft-pulse">Thinking…</span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSend}
                className="p-2.5 flex items-center gap-2"
            >
                <div className="flex-1 flex items-center bg-[#26262f] rounded-full px-4 py-2.5">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask something to start"
                        className="flex-1 bg-transparent text-white text-[13px] font-medium focus:outline-none placeholder:text-[#9696a3]"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 shrink-0 rounded-full bg-[#8783f5] disabled:opacity-30 disabled:pointer-events-none text-black flex items-center justify-center"
                >
                    <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                </button>
            </form>
        </div>
    );
}
