/**
 * Source-checked exam patterns shown beside a practice mock.
 *
 * These are versioned references, never a promise about a future notice.
 * Keep the source URL with the pattern so a student can check the primary
 * notification themselves before acting on it.
 */
export type ExamBlueprint = {
  eyebrow: string;
  title: string;
  summary: string;
  sections: Array<{ label: string; questions: number }>;
  duration: string;
  marking: string;
  sourceLabel: string;
  sourceHref: string;
};

export type SubjectScopeNote = {
  eyebrow: string;
  summary: string;
  sourceHref: string;
  sourceLabel: string;
  supplementaryChapterSlugs?: string[];
};

export const EXAM_BLUEPRINTS: Partial<Record<string, ExamBlueprint>> = {
  "delhi-police-constable": {
    eyebrow: "Official-pattern reference",
    title: "Delhi Police Constable 2025 CBE",
    summary:
      "Use this to practise the verified 2025 CBE distribution. Confirm the next SSC notice before relying on it for a later cycle.",
    sections: [
      { label: "GK & Current Affairs", questions: 50 },
      { label: "Reasoning", questions: 25 },
      { label: "Numerical Ability", questions: 15 },
      { label: "Computer", questions: 10 },
    ],
    duration: "90 minutes · 100 questions",
    marking: "+1 / −0.25 per wrong answer",
    sourceLabel: "Read the SSC 2025 notice",
    sourceHref:
      "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_DPCE_2025.pdf",
  },
};

/**
 * The official 2025 Delhi Police notice names broad syllabus areas rather
 * than a chapter-by-chapter book. These notes keep the deeper learning map
 * useful without presenting optional foundations as an official requirement.
 */
export const SUBJECT_SCOPE_NOTES: Record<string, SubjectScopeNote> = {
  "delhi-police-constable:dp-gk": {
    eyebrow: "2025 official scope",
    summary: "General awareness, current events, India and neighbouring countries: sports, history, culture, geography, economy, polity, Constitution and scientific research.",
    sourceLabel: "SSC notice",
    sourceHref: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_DPCE_2025.pdf",
  },
  "delhi-police-constable:dp-reasoning": {
    eyebrow: "2025 official scope",
    summary: "Analogy, similarities and differences, spatial and visual reasoning, relationships, arithmetical reasoning, classification, series, coding-decoding and related non-verbal questions.",
    sourceLabel: "SSC notice",
    sourceHref: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_DPCE_2025.pdf",
  },
  "delhi-police-constable:dp-quant": {
    eyebrow: "2025 official core",
    summary: "Prioritise number systems, decimals and fractions, arithmetic operations, percentages, ratio/proportion, averages, interest, profit/loss, discount, mensuration, time/distance and time/work.",
    sourceLabel: "SSC notice",
    sourceHref: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_DPCE_2025.pdf",
    supplementaryChapterSlugs: ["algebra", "geometry", "trigonometry-heights-distances"],
  },
  "delhi-police-constable:dp-computer": {
    eyebrow: "2025 official scope",
    summary: "Computer fundamentals plus Word, Excel, communication, email, internet, WWW and web browsers. Start with Word, Excel and everyday web use before broader foundations.",
    sourceLabel: "SSC notice",
    sourceHref: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_DPCE_2025.pdf",
  },
  "uppsc-ro-aro:uppsc-ro-gs": {
    eyebrow: "Preparation foundation · verify next notice",
    summary: "Build Indian and Uttar Pradesh general studies through active recall: polity, history, geography, economy, science and current affairs. The next UPPSC notice—not a previous-cycle memory—sets the final paper scheme.",
    sourceLabel: "UPPSC notice board",
    sourceHref: "https://uppsc.up.nic.in/",
  },
  "uppsc-ro-aro:uppsc-ro-hindi": {
    eyebrow: "Preparation foundation · verify next notice",
    summary: "Develop Hindi grammar, vocabulary, comprehension and concise formal-language control. Keep a small error log so every language miss has a specific rule to repair.",
    sourceLabel: "UPPSC notice board",
    sourceHref: "https://uppsc.up.nic.in/",
  },
  "uppsc-ro-aro:uppsc-ro-computer": {
    eyebrow: "Preparation foundation · verify next notice",
    summary: "Build computer and office-tool fluency through everyday terms, workflows and contrasts. Confirm the next notice for any post-specific computer, certificate or skill requirement.",
    sourceLabel: "UPPSC notice board",
    sourceHref: "https://uppsc.up.nic.in/",
  },
  "uppsc-ro-aro:uppsc-ro-reasoning": {
    eyebrow: "Preparation foundation · verify next notice",
    summary: "Practise logical conditions, data reading and objective reasoning with visible working. Treat this as an ExamGrind foundation route until UPPSC publishes the applicable next-cycle scheme.",
    sourceLabel: "UPPSC notice board",
    sourceHref: "https://uppsc.up.nic.in/",
  },
  "up-secretariat-ro-aro:up-secretariat-gs": {
    eyebrow: "Preparation foundation · verify next notice",
    summary: "Build UP-focused General Studies through active recall: polity, history, geography, economy, science, schemes and current affairs. The official recruitment notice remains the source of truth for the applicable paper.",
    sourceLabel: "UPPSC notice board",
    sourceHref: "https://uppsc.up.nic.in/",
  },
  "up-secretariat-ro-aro:up-secretariat-hindi": {
    eyebrow: "Preparation foundation · verify next notice",
    summary: "Build grammar accuracy, comprehension and precise administrative Hindi one error type at a time. Keep your rule and a fresh correct example together for revision.",
    sourceLabel: "UPPSC notice board",
    sourceHref: "https://uppsc.up.nic.in/",
  },
  "up-secretariat-ro-aro:up-secretariat-computer": {
    eyebrow: "Preparation foundation · verify next notice",
    summary: "Learn computer foundations and office workflows as usable skills, then confirm the current notice for any post-specific certificate, typing or computer requirement.",
    sourceLabel: "UPPSC notice board",
    sourceHref: "https://uppsc.up.nic.in/",
  },
  "up-secretariat-ro-aro:up-secretariat-reasoning": {
    eyebrow: "Preparation foundation · verify next notice",
    summary: "Use structured, visible reasoning—extract conditions, draw the smallest useful map and check the option last. This supports preparation without claiming a future paper format.",
    sourceLabel: "UPPSC notice board",
    sourceHref: "https://uppsc.up.nic.in/",
  },
};
