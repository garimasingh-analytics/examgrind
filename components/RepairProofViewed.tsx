"use client";

import { useEffect } from "react";
import { trackRepairProofViewed } from "@/lib/product-analytics";

/** Emits once when a completed repair's fresh-question evidence is visible. */
export default function RepairProofViewed() {
  useEffect(() => {
    trackRepairProofViewed();
  }, []);

  return null;
}
