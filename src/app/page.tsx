"use client";

import { useEffect } from "react";
import DashboardSection from "@/components/DashboardSection";
import ChatSection from "@/components/ChatSection";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <main className="max-w-md mx-auto min-h-screen flex flex-col bg-[var(--tg-theme-secondary-bg-color,#0f0f15)] p-3 space-y-4">
      {/* Upper Operational Control Panel */}
      <div className="flex-1 overflow-y-auto pr-0.5">
        <DashboardSection />
      </div>

      {/* Bottom Command Center Chat Frame */}
      <div className="h-[420px] flex flex-col">
        <ChatSection />
      </div>
    </main>
  );
}