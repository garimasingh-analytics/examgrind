"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_KEY = "examgrind-marketing-consent-v1";
const CLIENT = "ca-pub-2090215060427781";
const SLOT = "7399155008";

declare global {
  interface Window { adsbygoogle?: unknown[]; }
}

/** A clearly separated responsive AdSense display unit for content screens.
 * Never use this in quiz runners, answer review, checkout, or Deep Analysis. */
export default function AdSlot({ className = "" }: { className?: string }) {
  const [allowed, setAllowed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const update = () => setAllowed(window.localStorage.getItem(CONSENT_KEY) === "granted");
    update();
    window.addEventListener("examgrind:marketing-consent", update);
    return () => window.removeEventListener("examgrind:marketing-consent", update);
  }, []);
  useEffect(() => {
    if (!allowed || !loaded) return;
    try { window.adsbygoogle = window.adsbygoogle || []; window.adsbygoogle.push({}); } catch { /* Ad blockers must not break study screens. */ }
  }, [allowed, loaded]);
  if (!allowed) return null;
  return <aside className={`mx-auto my-6 max-w-5xl px-4 sm:px-6 ${className}`} aria-label="Advertisement">
    <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[.16em] text-cocoa-400">Advertisement</p>
    <Script id="examgrind-adsense-loader" async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`} crossOrigin="anonymous" strategy="afterInteractive" onLoad={() => setLoaded(true)} />
    <ins className="adsbygoogle block min-h-[100px]" style={{ display: "block" }} data-ad-client={CLIENT} data-ad-slot={SLOT} data-ad-format="auto" data-full-width-responsive="true" />
  </aside>;
}
