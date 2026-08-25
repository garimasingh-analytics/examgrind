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
    tagline: "Quant · Reasoning · English · GA — concept-level feedback on every wrong answer.",
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
    status: "coming_soon",
    tagline: "A quality-checked preparation route is being built from the official scheme and syllabus.",
  },
  {
    slug: "uppsc-ro-aro",
    name: "UPPSC RO / ARO",
    status: "coming_soon",
    tagline: "Hindi, General Studies and office-skills preparation, built only after syllabus review.",
  },
  {
    slug: "up-secretariat-ro-aro",
    name: "UP Samiksha Adhikari / Sahayak Samiksha Adhikari",
    status: "coming_soon",
    tagline: "A dedicated UP government-exam route is being prepared with verified scope.",
  },
  {
    slug: "allahabad-high-court-ro-aro",
    name: "Allahabad High Court RO / ARO",
    status: "coming_soon",
    tagline: "A separate court-recruitment route is being prepared; it will not be treated as a generic RO/ARO exam.",
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
