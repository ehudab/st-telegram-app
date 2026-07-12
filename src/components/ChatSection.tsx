"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface Message {
    id: string;
    sender: "user" | "assistant";
    text: string;
}

function timeNow() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
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
        <div className="rounded-2xl flex flex-col h-full overflow-hidden bg-[var(--panel)] border border-[var(--line)]">
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-2 border-b border-[var(--line)]">
                <div className="w-6 h-6 rounded-[6px] bg-[var(--brass-dim)] flex items-center justify-center shrink-0">
                    <span className="font-mono text-[9px] font-bold text-[var(--brass)]">AI</span>
                </div>
                <span className="font-display text-[13px] font-semibold">Ops Assistant</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] ml-auto" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                        {msg.sender === "user" ? (
                            <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-br-md bg-[var(--brass)] text-[#1a1409] text-[13px] font-medium leading-relaxed">
                                {msg.text}
                            </div>
                        ) : (
                            <div className="max-w-[85%] pl-3 border-l-2 border-[var(--brass-dim)] text-[13px] font-medium leading-relaxed text-[var(--text)]">
                                {msg.text}
                            </div>
                        )}
                        <span className="font-mono text-[9px] text-[var(--muted)] mt-1 px-0.5">{timeNow()}</span>
                    </div>
                ))}
                {loading && (
                    <div className="pl-3 border-l-2 border-[var(--brass-dim)]">
                        <span className="font-mono text-[11px] text-[var(--muted)] animate-soft-pulse">thinking…</span>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-2.5 flex items-center gap-2 border-t border-[var(--line)]">
                <div className="flex-1 flex items-center border border-[var(--line)] rounded-full px-4 py-2.5">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask something to start"
                        className="flex-1 bg-transparent text-[13px] font-medium focus:outline-none placeholder:text-[var(--muted)]"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 shrink-0 rounded-full bg-[var(--brass)] disabled:opacity-30 disabled:pointer-events-none text-[#1a1409] flex items-center justify-center"
                >
                    <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                </button>
            </form>
        </div>
    );
}