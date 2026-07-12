"use client";

import { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import ChatCard from "../components/ChatCard";


export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <main className="max-w-md mx-auto min-h-screen bg-[#0a0a0a] p-4 font-sans space-y-4 pb-10">

      {/* Header */}
      <div className="flex justify-between items-center px-1 mb-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 rounded-full bg-[#53c97f]"></div>
          <h1 className="text-base font-bold tracking-wide">Apartment Core</h1>
        </div>
        <div className="flex items-center space-x-1.5 bg-transparent border border-white/10 rounded-full px-3 py-1.5 cursor-pointer">
          <span className="text-xs text-zinc-400 font-medium tracking-wider">2026-05-22</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
        </div>
      </div>

      {/* Grid Card */}
      <div className="bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-5">
        <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
          <span className="text-zinc-500">Units · 16</span>
          <span className="text-[#dfa553]">44% Full</span>
        </div>

        <div className="grid grid-cols-8 gap-1.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-[3px] ${i < 7 ? "bg-[#dfa553]" : "border border-white/10 bg-transparent"
                }`}
            />
          ))}
        </div>

        <div className="flex space-x-6 text-xs text-zinc-400 font-medium">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#dfa553]"></div>
            <span>Occupied 7</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-[2px] border border-white/10"></div>
            <span>Available 9</span>
          </div>
        </div>
      </div>

      {/* Today's Activity Card */}
      <div className="bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-5">
        <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Today's Activity</h2>
        <div className="space-y-5 divide-y divide-white/5">

          <div className="flex justify-between items-center pt-2 first:pt-0">
            <div className="flex border-l-[3px] border-[#eb6f62] pl-3.5 flex-col">
              <span className="text-sm font-bold text-white tracking-wide">Dawit Bekele</span>
              <span className="text-xs text-zinc-500 mt-0.5">Floor 3 · Type B</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-white">11:15</span>
              <span className="text-[9px] font-bold tracking-widest text-[#eb6f62] uppercase mt-1">Departure</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-5">
            <div className="flex border-l-[3px] border-[#53c97f] pl-3.5 flex-col">
              <span className="text-sm font-bold text-white tracking-wide">Mohammad Alzahrani</span>
              <span className="text-xs text-zinc-500 mt-0.5">Floor 5 · Type A</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-white">16:02</span>
              <span className="text-[9px] font-bold tracking-widest text-[#53c97f] uppercase mt-1">Arrival</span>
            </div>
          </div>

        </div>
      </div>

      {/* Active Tenancies Card */}
      <div className="bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-5">
        <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Active Tenancies</h2>
        <div className="space-y-5 divide-y divide-white/5">

          <div className="flex justify-between items-center pt-2 first:pt-0">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-wide">Mohammad Alzahrani</span>
              <span className="text-xs text-zinc-500 mt-0.5">Floor 5 · Type A · 3 Bedrooms</span>
            </div>
            <div className="flex flex-col items-end text-[11px] font-mono text-zinc-500 space-y-0.5">
              <span>2026-05-22</span>
              <span>→ 2026-05-24</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-5">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-wide">Liya Tesfaye</span>
              <span className="text-xs text-zinc-500 mt-0.5">Floor 2 · Type C · 1 Bedroom</span>
            </div>
            <div className="flex flex-col items-end text-[11px] font-mono text-zinc-500 space-y-0.5">
              <span>2026-05-20</span>
              <span>→ 2026-05-26</span>
            </div>
          </div>

        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-[#131315] border border-white/5 rounded-2xl p-5 space-y-5">
        <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Revenue · ETB</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Gross</span>
            <span className="font-mono text-white">14,174</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Refunds</span>
            <span className="font-mono text-white">0</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Charges</span>
            <span className="font-mono text-white">210</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-white/5 font-bold text-base">
            <span className="text-white">Net</span>
            <span className="font-mono text-[#dfa553]">14,384</span>
          </div>
        </div>
      </div>

      {/* Interactive AI Chat Component */}
      <ChatCard />

    </main>
  );
}