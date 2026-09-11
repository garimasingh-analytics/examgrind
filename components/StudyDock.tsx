"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/learn", label: "Learn", icon: "book" },
  { href: "/practice", label: "Practice", icon: "check" },
  { href: "/improve", label: "Improve", icon: "chart" },
  { href: "/current-affairs", label: "Current", icon: "news" },
];

function isDockPage(pathname: string) {
  if (pathname === "/" || pathname.startsWith("/auth")) return false;
  if (pathname.startsWith("/quiz/") || pathname.startsWith("/mock/take")) return false;
  if (pathname.startsWith("/admin") || pathname.startsWith("/share")) return false;
  if (["/privacy", "/terms", "/refund", "/contact"].includes(pathname)) return false;
  return !pathname.startsWith("/start/") && !pathname.startsWith("/diagnose");
}

export default function StudyDock({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  if (!signedIn || !isDockPage(pathname)) return null;

  return (
    <nav aria-label="Study navigation" className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-md md:bottom-5 md:max-w-xl">
      <div className="grid grid-cols-5 rounded-2xl border border-cocoa-900/[0.10] bg-cream-50/95 p-1.5 shadow-warm-lg backdrop-blur-xl">
        {items.map((item) => {
          const active = item.href === "/home"
            ? pathname === "/home"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`eg-press flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-center ${active ? "bg-cocoa-900 text-cream-50 shadow-warm" : "text-cocoa-500 hover:bg-cream-200 hover:text-cocoa-900"}`}
            >
              <DockIcon name={item.icon} />
              <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function DockIcon({ name }: { name: string }) {
  const shared = "h-4 w-4 stroke-current";
  if (name === "book") return <svg aria-hidden viewBox="0 0 24 24" fill="none" className={shared}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" strokeWidth="1.8" strokeLinejoin="round"/><path d="M4 19h16" strokeWidth="1.8"/></svg>;
  if (name === "check") return <svg aria-hidden viewBox="0 0 24 24" fill="none" className={shared}><rect x="4" y="3" width="16" height="18" rx="2" strokeWidth="1.8"/><path d="m8 12 2.5 2.5L16 9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "chart") return <svg aria-hidden viewBox="0 0 24 24" fill="none" className={shared}><path d="M4 19V5m0 14h16" strokeWidth="1.8" strokeLinecap="round"/><path d="m7 15 4-4 3 2 4-6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === "news") return <svg aria-hidden viewBox="0 0 24 24" fill="none" className={shared}><path d="M5 4h14v16H5z" strokeWidth="1.8" strokeLinejoin="round"/><path d="M8 8h7M8 12h7M8 16h4" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  return <svg aria-hidden viewBox="0 0 24 24" fill="none" className={shared}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 21v-6h6v6" strokeWidth="1.8" strokeLinejoin="round"/></svg>;
}
