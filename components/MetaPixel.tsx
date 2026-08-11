"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const META_PIXEL_ID = "28588490750740835";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    __examgrindMetaPixelInitialised?: boolean;
  }
}

/**
 * Loads only after marketing consent. This cannot use a conditionally mounted
 * inline next/script tag: when consent is granted after hydration, browsers
 * retain that tag as text rather than executing it. A real effect gives us a
 * callable fbq queue immediately and the external script fills it in safely.
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.__examgrindMetaPixelInitialised) {
      const existing = window.fbq;
      if (!existing) {
        const fbq = function (...args: unknown[]) {
          const loaded = fbq as typeof fbq & { callMethod?: (...methodArgs: unknown[]) => void; queue?: unknown[][]; push?: typeof fbq; loaded?: boolean; version?: string };
          if (loaded.callMethod) loaded.callMethod(...args);
          else (loaded.queue ??= []).push(args);
        } as typeof window.fbq & { push?: typeof window.fbq; loaded?: boolean; version?: string; queue?: unknown[][] };

        fbq.push = fbq;
        fbq.loaded = true;
        fbq.version = "2.0";
        fbq.queue = [];
        window.fbq = fbq;
        window._fbq = fbq;

        const script = document.createElement("script");
        script.async = true;
        script.src = "https://connect.facebook.net/en_US/fbevents.js";
        script.id = "examgrind-meta-pixel-loader";
        document.head.appendChild(script);
      }

      window.fbq?.("init", META_PIXEL_ID);
      window.__examgrindMetaPixelInitialised = true;
    }

    window.fbq?.("track", "PageView");
  }, [pathname, searchParams]);

  return null;
}
