"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Immediate feedback and warm prefetching for dynamic App Router pages. */
export default function NavigationFeedback() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = useState(false);
  const prefetched = useRef(new Set<string>());
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    setNavigating(false);
    if (timeout.current) window.clearTimeout(timeout.current);
  }, [pathname, searchParams]);

  useEffect(() => {
    const anchorFor = (target: EventTarget | null) => target instanceof Element ? target.closest<HTMLAnchorElement>('a[href^="/"]') : null;
    const prefetch = (target: EventTarget | null) => {
      const href = anchorFor(target)?.getAttribute("href");
      if (!href || href === "/" || prefetched.current.has(href)) return;
      prefetched.current.add(href);
      router.prefetch(href);
    };
    const begin = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = anchorFor(event.target)?.getAttribute("href");
      if (!href || href === `${window.location.pathname}${window.location.search}`) return;
      setNavigating(true);
      if (timeout.current) window.clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => setNavigating(false), 10_000);
    };
    const warm = (event: Event) => prefetch(event.target);
    document.addEventListener("pointerover", warm, { passive: true });
    document.addEventListener("focusin", warm);
    document.addEventListener("click", begin, true);
    return () => { document.removeEventListener("pointerover", warm); document.removeEventListener("focusin", warm); document.removeEventListener("click", begin, true); if (timeout.current) window.clearTimeout(timeout.current); };
  }, [router]);

  return <div className={`route-feedback ${navigating ? "is-visible" : ""}`} aria-hidden />;
}
