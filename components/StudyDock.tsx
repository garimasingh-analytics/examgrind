"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/home", label: "Today", icon: "✦" },
  { href: "/mock", label: "Practice", icon: "◌" },
  { href: "/mistakes", label: "Repair", icon: "↺" },
  { href: "/coach", label: "Coach", icon: "✺" },
  { href: "/me", label: "Me", icon: "●" },
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
    <nav aria-label="Study navigation" className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-md md:hidden">
      <div className="grid grid-cols-5 rounded-[1.35rem] border border-cocoa-900/[0.10] bg-cream-50/95 p-1.5 shadow-warm-lg backdrop-blur-xl">
        {items.map((item) => {
          const active = item.href === "/home"
            ? pathname === "/home"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`eg-press flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-center ${active ? "bg-cocoa-900 text-cream-50 shadow-warm" : "text-cocoa-500 hover:bg-cream-200 hover:text-cocoa-900"}`}
            >
              <span aria-hidden className="text-base leading-none">{item.icon}</span>
              <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
