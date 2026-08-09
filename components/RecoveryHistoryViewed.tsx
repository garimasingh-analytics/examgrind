"use client";

import { useEffect } from "react";
import { trackRecoveryHistoryViewed } from "@/lib/product-analytics";

/** Records the dashboard-level recovery view without exposing concept names. */
export default function RecoveryHistoryViewed({ activeCount, completedCount }: { activeCount: number; completedCount: number }) {
  useEffect(() => {
    trackRecoveryHistoryViewed({ active_count: activeCount, completed_count: completedCount });
  }, [activeCount, completedCount]);

  return null;
}
