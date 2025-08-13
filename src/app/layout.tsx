"use client";

// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "@/components/common/Footer";
import Status from "@/components/common/Status";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <head>
        {/* Favicon - graduation hat */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#E20082" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50`}
      >
        <QueryClientProvider client={queryClient}>
          {/* Main content area - grows to fill available space with consistent spacing */}
          <main className="flex-1 min-h-0 flex flex-col">
            {children}
          </main>
          
          {/* Status overlay - positioned absolutely for notifications */}
          <Status />
          
          {/* Footer - positioned at bottom using normal document flow */}
          <Footer />
        </QueryClientProvider>
      </body>
    </html>
  );
}