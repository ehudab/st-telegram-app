"use client";

import { useEffect } from "react";
import DashboardSection from "@/components/DashboardSection";
import ChatSection from "@/components/ChatSection";

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <main className="max-w-md mx-auto h-screen flex flex-col bg-[#0a0a0a] p-3 text-white">
      {/* Dashboard Top Half */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <DashboardSection />
      </div>

      {/* Chat Interface Bottom Half */}
      <div className="h-[35%] min-h-[300px] flex flex-col mt-2 rounded-[20px] overflow-hidden bg-[#141416] border border-white/5">
        <ChatSection />
      </div>
    </main>
  );
}