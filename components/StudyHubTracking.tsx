"use client";

import { useEffect, useRef } from "react";
import { trackStudyGuideViewed, trackStudyHubViewed } from "@/lib/product-analytics";

type Exam = "ssc-cgl" | "cuet" | "neet-ug" | "delhi-police-constable" | "uppsc-ro-aro" | "up-secretariat-ro-aro" | "uppsc-pcs";

/** Small, consent-gated tracking boundary for the public Study Hub.
 * It measures whether useful content leads students back into the core
 * diagnosis flow without sending identity, search text, or study answers. */
export function StudyHubViewed({ surface, examScope }: { surface: "guides" | "updates"; examScope: Exam | "all" }) {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackStudyHubViewed({ surface, exam_scope: examScope });
  }, [examScope, surface]);
  return null;
}

export function StudyGuideViewed({ exam, guideSlug }: { exam: Exam; guideSlug: string }) {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackStudyGuideViewed({ exam, guide_slug: guideSlug });
  }, [exam, guideSlug]);
  return null;
}
