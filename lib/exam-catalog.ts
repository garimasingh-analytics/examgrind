/**
 * The application-level source of truth for an exam that can be selected in
 * onboarding or stored on a user profile.  The database remains the source of
 * truth for subjects, chapters and topics; this file protects public routes
 * and auth redirects from accepting arbitrary slugs.
 *
 * New exams are deliberately added here as `coming_soon` first.  They are not
 * promoted to `live` until the content-quality checklist is complete.
 */
export const EXAM_CATALOG = [
  {
    slug: "cuet",
    name: "CUET UG",
    status: "live",
    tagline: "12 subjects · Full NTA syllabus · AI-graded practice that tells you exactly what to study next.",
  },
  {
    slug: "ssc-cgl",
    name: "SSC CGL",
    status: "live",
    tagline: "Quant, Reasoning, English and GA with topic-wise feedback after every quiz.",
  },
  {
    slug: "neet-ug",
    name: "NEET UG",
    status: "live",
    tagline: "NCERT-aligned Physics, Chemistry, Biology. Diagnostic practice that shows the exact concept you're weak on.",
  },
  {
    slug: "delhi-police-constable",
    name: "Delhi Police Constable",
    status: "live",
    tagline: "2025-pattern practice: 50 GK/CA, 25 Reasoning, 15 Numerical and 10 Computer questions. Review the section where you made the most errors.",
  },
  {
    slug: "uppsc-ro-aro",
    name: "UPPSC RO / ARO",
    status: "live",
    tagline: "Build Hindi, General Studies, computer skills and reasoning now; verify the next UPPSC notice for its final paper scheme.",
  },
  {
    slug: "up-secretariat-ro-aro",
    name: "UP Samiksha Adhikari / Sahayak Samiksha Adhikari",
    status: "live",
    tagline: "Build Hindi, UP-focused General Studies, computer skills and reasoning now; verify the next official notice for post-specific requirements.",
  },
  {
    slug: "uiic-ao",
    name: "UIIC AO",
    status: "live",
    tagline: "2026 UIIC AO sprint: common Tier I diagnosis, then a clear Generalist or Hindi Officer mains route.",
  },
  {
    slug: "uppsc-pcs",
    name: "UPPSC PCS",
    status: "coming_soon",
    tagline: "General Studies, CSAT skills and Uttar Pradesh context. A focused starting route for UPPSC PCS preparation.",
  },
  {
    slug: "allahabad-high-court-ro-aro",
    name: "Allahabad High Court RO / ARO",
    status: "coming_soon",
    tagline: "A separate preparation route for court recruitment is being prepared.",
  },
] as const;

export type ExamSlug = (typeof EXAM_CATALOG)[number]["slug"];
export type ExamCatalogItem = (typeof EXAM_CATALOG)[number];

export function getExamBySlug(slug: string): ExamCatalogItem | undefined {
  return EXAM_CATALOG.find((exam) => exam.slug === slug);
}

export function isExamSlug(slug: string): slug is ExamSlug {
  return Boolean(getExamBySlug(slug));
}

export const LIVE_EXAM_SLUGS = EXAM_CATALOG.filter(
  (exam) => exam.status === "live"
).map((exam) => exam.slug) as ExamSlug[];

export const LIVE_EXAMS = EXAM_CATALOG.filter(
  (exam) => exam.status === "live"
);

export function isLiveExamSlug(slug: string): slug is ExamSlug {
  return getExamBySlug(slug)?.status === "live";
}
