import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Annapurna Bengaluru | Community Food Waste & Surplus Donation",
  description: "Track kitchen waste, connect with Bengaluru NGOs, and rescue surplus food in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#07150d] text-emerald-50">
        <AuthProvider>
          <Header />
          <main className="flex-1 pt-32 pb-16 px-4 sm:px-6 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
