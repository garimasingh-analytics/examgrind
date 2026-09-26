"use client";

/**
 * Provides the user's currently-selected chick variant to every <Chick>
 * render across the app, so we don't have to thread a `variant` prop
 * through 17 callsites.
 *
 * Reads:
 *   1. Initial value from server (passed via initialVariant)
 *   2. Updates from ChickPicker via setVariant
 *   3. Cached in localStorage so re-renders feel instant on next page load
 */

import { createContext, useContext, useEffect, useState } from "react";
import type { ChickVariant } from "@/lib/chicks";
import { asChickVariant } from "@/lib/chicks";

type Ctx = {
  variant: ChickVariant;
  setVariant: (v: ChickVariant) => void;
};

const ChickVariantContext = createContext<Ctx>({
  variant: "classic",
  setVariant: () => {},
});

const LS_KEY = "eg_chick_variant";
const COOKIE_KEY = "eg_chick_variant";

function persistVariant(variant: ChickVariant) {
  try {
    localStorage.setItem(LS_KEY, variant);
  } catch {
    // Local storage is optional. The lightweight cookie still lets the server
    // paint the user's wardrobe without a database request on every route.
  }
  try {
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(variant)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  } catch {
    // Private browsing or a restrictive browser can reject writes; the
    // selected wardrobe remains persisted through the existing API call.
  }
}

export function ChickVariantProvider({
  initialVariant = "classic",
  children,
}: {
  initialVariant?: ChickVariant;
  children: React.ReactNode;
}) {
  const [variant, setVariantState] = useState<ChickVariant>(initialVariant);

  // Hydrate from localStorage on first client mount if it diverges from
  // the server-provided value (covers signed-out users who picked a
  // chick before signing up, or stale server data).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored && stored !== variant) {
        const normalized = asChickVariant(stored);
        setVariantState(normalized);
        persistVariant(normalized);
      } else if (stored) {
        persistVariant(asChickVariant(stored));
      }
    } catch {
      // localStorage unavailable (SSR, private mode) — fall back to initial.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setVariant = (v: ChickVariant) => {
    setVariantState(v);
    persistVariant(v);
  };

  return (
    <ChickVariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </ChickVariantContext.Provider>
  );
}

export function useChickVariant() {
  return useContext(ChickVariantContext);
}
