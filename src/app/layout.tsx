import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Future Plus - India's Most Trusted Microtask Platform",
  description: "Earn ₹500-₹2000 daily with India's most trusted microtask platform. Secure, reliable, and 24/7 support available.",
  keywords: ["Future Plus", "earn money", "microtasks", "daily earnings", "work from home", "India", "part time jobs"],
  authors: [{ name: "Future Plus Team" }],
  openGraph: {
    title: "Future Plus - Earn Daily with Microtasks",
    description: "Join thousands of Indians earning daily with our trusted microtask platform. Start your journey to financial freedom today.",
    url: "https://futureplus.vercel.app",
    siteName: "Future Plus",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Future Plus - Earn Daily with Microtasks",
    description: "Join thousands of Indians earning daily with our trusted microtask platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
