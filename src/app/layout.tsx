import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apartment Manager Dashboard",
  description: "Telegram Mini App for Property Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Load Telegram Web App Script safely */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased select-none min-h-screen bg-[var(--tg-theme-secondary-bg-color,#0a0a0d)] text-[var(--tg-theme-text-color,#ffffff)]">
        {children}
      </body>
    </html>
  );
}