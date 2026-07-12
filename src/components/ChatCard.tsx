"use client";
import ReactMarkdown from 'react-markdown';
import React, { useState } from "react";
import { ArrowUp } from "lucide-react";
import { authenticatedFetch } from "../lib/api"; // Added the helper

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
            // Using the secure authenticatedFetch helper
            const response = await authenticatedFetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({ message: userText }),
            });
            const data = await response.json();

            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                sender: "assistant",
                text: data.response || "No data available.",
                time: timeString
            }]);
        } catch (error: any) {
            // Handle specifically for access denial or general connection errors
            const errorMessage = error.message === "ACCESS_DENIED"
                ? "Access denied. Please restart the app."
                : "Connection error.";

            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                sender: "assistant",
                text: errorMessage,
                time: timeString
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
                    <h2 className="text-sm font-bold text-white tracking-wide">Stadium AI Assistant</h2>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#53c97f]"></div>
            </div>

            {/* Messages */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`text-[13px] font-medium leading-relaxed ${msg.sender === 'user' ? 'text-zinc-300 text-right' : 'text-white border-l-2 border-white/10 pl-3'}`}>
                            <ReactMarkdown
                                components={{
                                    // Headings (e.g., "Occupied Apartments")
                                    h1: ({ node, ...props }) => <h1 className="text-white font-bold text-[15px] mt-4 mb-2" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-white font-bold text-[14px] mt-4 mb-2" {...props} />,

                                    // Bold text (the key data points)
                                    strong: ({ node, ...props }) => <strong className="text-[#dfa553] font-bold" {...props} />,

                                    // Paragraphs
                                    p: ({ node, ...props }) => <p className="text-zinc-400 mb-2 leading-relaxed" {...props} />,

                                    // Lists (for the breakdown at the end)
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                    li: ({ node, ...props }) => <li className="text-zinc-400 text-[13px]" {...props} />,
                                }}
                            >
                                {msg.text.replace(/\n/g, '  \n')}
                            </ReactMarkdown>
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