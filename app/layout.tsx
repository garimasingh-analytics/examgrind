import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

// Soft warm serif — used for headlines.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Friendly geometric sans — used for body & UI.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ExamGrind — AI-graded practice for CUET, SSC CGL & NEET UG",
  description:
    "Know exactly what to study next. Concept-level diagnosis on every wrong answer — for CUET UG, SSC CGL, and NEET UG aspirants. ₹75/month. No credit card.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="bg-cream-100 text-cocoa-900 antialiased">
        <div className="flex min-h-[100svh] flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
