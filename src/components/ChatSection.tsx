"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, Terminal } from "lucide-react";

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
            text: "System Ready. Query room metrics, dates, or occupancy configurations via plain-text syntax command lines.",
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
                text: data.response || "No data response payload recognized from worker.",
            }]);
        } catch (error) {
            console.error("Chat sync crash", error);
            setMessages((prev) => [...prev, {
                id: crypto.randomUUID(),
                sender: "assistant",
                text: "Error syncing with system core nodes. Check live server routing status."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="arcade-card flex flex-col h-full overflow-hidden bg-[var(--tg-theme-bg-color,#1a1a24)]">
            {/* Interactive Title Tag */}
            <div className="px-3 py-2 bg-black border-b-3 border-white text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-sky-400" />
                    <span className="text-[11px] font-black tracking-widest uppercase text-sky-400">Natural Language Terminal</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Main Narrative Log Output Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-black/10">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] px-3 py-2 text-xs font-bold leading-relaxed border-2 border-black ${msg.sender === "user"
                                    ? "bg-sky-400 text-black rounded-xl rounded-tr-none shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                                    : "bg-zinc-800 text-white rounded-xl rounded-tl-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="text-[11px] font-black text-amber-400 uppercase tracking-widest animate-pulse pl-1">
                            ⚡ Compiling System Query Matrix...
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Terminal Command Prompt Input Form */}
            <form
                onSubmit={handleSend}
                className="p-2.5 bg-zinc-900 border-t-3 border-white flex items-center space-x-2"
            >
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask system core anything..."
                    className="flex-1 bg-black text-white text-xs font-bold border-2 border-zinc-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-sky-400 uppercase tracking-wide placeholder:text-zinc-600 placeholder:normal-case"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="arcade-btn p-2.5 bg-sky-400 disabled:opacity-30 disabled:pointer-events-none text-black flex items-center justify-center font-black"
                >
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
            </form>
        </div>
    );
}