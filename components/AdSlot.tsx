"use client";

import { useEffect, useRef, useState } from "react";

const CONSENT_KEY = "examgrind-marketing-consent-v1";
const CLIENT = "ca-pub-2090215060427781";
const SLOT = "7399155008";

declare global {
  interface Window { adsbygoogle?: unknown[]; }
}

let loader: Promise<boolean> | null = null;

function loadAdSense() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (loader) return loader;

  loader = new Promise((resolve) => {
    const id = "examgrind-adsense-loader";
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    const finish = (ok: boolean) => resolve(ok);
    const script = existing ?? document.createElement("script");

    if (!existing) {
      script.id = id;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
      document.head.appendChild(script);
    }

    if (script.dataset.loaded === "true") {
      finish(true);
      return;
    }
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      finish(true);
    }, { once: true });
    script.addEventListener("error", () => finish(false), { once: true });
    window.setTimeout(() => finish(Boolean(window.adsbygoogle)), 10_000);
  });

  return loader;
}

/** A clearly separated responsive AdSense display unit for content screens.
 * Never use this in quiz runners, answer review, checkout, or Deep Analysis. */
export default function AdSlot({ className = "" }: { className?: string }) {
  const [allowed, setAllowed] = useState(false);
  const [status, setStatus] = useState<"loading" | "filled" | "unfilled">("loading");
  const slotRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const update = () => setAllowed(window.localStorage.getItem(CONSENT_KEY) === "granted");
    update();
    window.addEventListener("examgrind:marketing-consent", update);
    return () => window.removeEventListener("examgrind:marketing-consent", update);
  }, []);

  useEffect(() => {
    if (!allowed || !slotRef.current) return;

    let active = true;
    const slot = slotRef.current;
    const observer = new MutationObserver(() => {
      const nextStatus = slot.getAttribute("data-ad-status");
      if (!active || !nextStatus) return;
      setStatus(nextStatus === "unfilled" ? "unfilled" : "filled");
    });
    observer.observe(slot, { attributes: true, attributeFilter: ["data-ad-status"] });

    void loadAdSense().then((ready) => {
      if (!active) return;
      if (!ready) {
        setStatus("unfilled");
        return;
      }
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch {
        setStatus("unfilled");
      }
    });
    const timeout = window.setTimeout(() => {
      if (active && !slot.getAttribute("data-ad-status")) setStatus("unfilled");
    }, 12_000);

    return () => {
      active = false;
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [allowed]);

  if (!allowed || status === "unfilled") return null;
  return <aside className={`mx-auto my-6 max-w-5xl px-4 sm:px-6 ${className}`} aria-label="Advertisement">
    {status === "filled" && <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[.16em] text-cocoa-400">Advertisement</p>}
    <ins ref={slotRef} className="adsbygoogle block min-h-[100px]" style={{ display: "block" }} data-ad-client={CLIENT} data-ad-slot={SLOT} data-ad-format="auto" data-full-width-responsive="true" />
  </aside>;
}
