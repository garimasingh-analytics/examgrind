"use client";

import { useEffect, useRef } from "react";
import { trackCurrentAffairsViewed } from "@/lib/product-analytics";

export default function CurrentAffairsTracking({ date, briefCount }: { date: string; briefCount: number }) {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackCurrentAffairsViewed({ date, brief_count: briefCount });
  }, [briefCount, date]);
  return null;
}
