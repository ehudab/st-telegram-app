"use client";

import { useEffect } from "react";
import DashboardSection from "@/components/DashboardSection";
import ChatSection from "@/components/ChatSection";

// Explicitly tell the TypeScript compiler that the Telegram object exists on window
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
    <main className="max-w-md mx-auto min-h-screen flex flex-col bg-[var(--tg-theme-secondary-bg-color,#0a0a0d)] p-3 gap-3">
      {/* Dashboard */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pr-0.5">
        <DashboardSection />
      </div>

      {/* Chat */}
      <div className="h-[400px] shrink-0 flex flex-col">
        <ChatSection />
      </div>
    </main>
  );
}