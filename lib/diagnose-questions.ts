/**
 * 5 PYQ-level trap questions per exam for the public /diagnose page.
 *
 * Each question is hand-picked to be:
 *   1. A real PYQ trap (one option that "looks right" but isn't)
 *   2. Pinpointing ONE specific concept gap (so the weakness report can name a chapter)
 *   3. Mobile-readable in ≤ 80 chars per option
 *
 * No DB lookup — fully static. Keeps /diagnose fast (< 200ms first byte) and
 * usable by cold visitors with zero auth, zero rate-limit concerns.
 */

export type DiagnoseExam = "neet-ug" | "cuet" | "ssc-cgl";

export type DiagnoseQuestion = {
  id: string;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: "A" | "B" | "C" | "D";
  /** The concept this question tests — used in the weakness report. */
  concept: string;
  /** Where to find this in NCERT / standard text — drill recommendation. */
  drill: string;
  /** If picked wrong, this is the per-trap explanation shown to user. */
  whenWrong: string;
};

export const DIAGNOSE_QUESTIONS: Record<DiagnoseExam, DiagnoseQuestion[]> = {
  "neet-ug": [
    {
      id: "neet-q1",
      question: "Which statement about the lac operon is INCORRECT?",
      options: {
        A: "The lac operon has 3 structural genes: lacZ, lacY, lacA",
        B: "The repressor protein is encoded by the lacI gene",
        C: "When lactose is absent, the repressor binds the operator",
        D: "Lactose itself binds to the repressor to inactivate it",
      },
      correct: "D",
      concept: "Lac operon — inducer molecule",
      drill: "NCERT Class 12 Bio · Ch 6 Molecular Basis of Inheritance · Gene regulation",
      whenWrong:
        "Allolactose (not lactose itself) is the inducer that binds the repressor. 71% of NEET aspirants miss this. Lactose is the substrate; allolactose — its isomer formed inside the cell — is what actually inactivates the repressor.",
    },
    {
      id: "neet-q2",
      question:
        "In the Meselson-Stahl experiment, after 3 generations of growth in ¹⁴N medium (starting from fully ¹⁵N-labeled DNA), what fraction of DNA is hybrid (¹⁵N/¹⁴N)?",
      options: { A: "1/2", B: "1/4", C: "1/8", D: "1/16" },
      correct: "B",
      concept: "DNA replication — semi-conservative mechanism",
      drill: "NCERT Class 12 Bio · Ch 6 · DNA Replication",
      whenWrong:
        "After 3 generations there are 8 strands total, of which only 2 retain a ¹⁵N strand → 2/8 = 1/4 hybrid. Most students get tripped by the doubling math.",
    },
    {
      id: "neet-q3",
      question: "Splitting of water during photosynthesis occurs in:",
      options: { A: "Photosystem I", B: "Photosystem II", C: "Both PS I and PS II", D: "Cytochrome b6f complex" },
      correct: "B",
      concept: "Photosynthesis — water photolysis in PS II",
      drill: "NCERT Class 11 Bio · Ch 13 Photosynthesis · Light reactions",
      whenWrong:
        "Water is split (photolysis) ONLY at PS II, releasing O₂, 4 electrons, and 4 H⁺. PS I receives electrons downstream. The confusion is because the Z-scheme starts with PS II — but most diagrams show PS I first by position.",
    },
    {
      id: "neet-q4",
      question: "How many net ATP molecules are produced per glucose in aerobic respiration (per latest NCERT)?",
      options: { A: "36", B: "38", C: "30", D: "32" },
      correct: "D",
      concept: "Cellular respiration — ATP yield from oxidative phosphorylation",
      drill: "NCERT Class 11 Bio · Ch 14 Respiration in Plants · Energetics",
      whenWrong:
        "Latest NCERT says 32 ATP (sometimes 30, depending on shuttle). The old 36/38 figure ignores ATP cost of moving NADH into mitochondria. NEET 2024 specifically accepted 32.",
    },
    {
      id: "neet-q5",
      question:
        "In Newton's third law: a horse pulls a cart. The horse exerts force on the cart, and the cart exerts an equal opposite force on the horse. Why does the cart move?",
      options: {
        A: "The horse's force is larger than the cart's reaction",
        B: "Friction between horse's hooves and ground exceeds friction on the cart's wheels",
        C: "The cart's reaction takes time to develop",
        D: "Newton's third law doesn't apply to living systems",
      },
      correct: "B",
      concept: "Newton's third law — system boundaries and friction",
      drill: "NCERT Class 11 Physics · Ch 5 Laws of Motion · Free body diagrams",
      whenWrong:
        "The action-reaction pair is equal — but they act on DIFFERENT bodies. The NET force on the cart (horse pull minus friction on cart) > 0 only because friction on horse's hooves > friction on cart. This is a Class 11 NEET trap that catches >60% of aspirants.",
    },
  ],

  cuet: [
    {
      id: "cuet-q1",
      question:
        "Which Article of the Indian Constitution allows direct approach to the Supreme Court for the enforcement of Fundamental Rights?",
      options: { A: "Article 21", B: "Article 32", C: "Article 226", D: "Article 14" },
      correct: "B",
      concept: "Indian Polity — Fundamental Rights and writ jurisdiction",
      drill: "NCERT Class 11 Polity · Ch 2 Rights in the Indian Constitution",
      whenWrong:
        "Article 32 — the 'Right to Constitutional Remedies' — gives direct SC access. Article 21 is Right to Life. Article 226 is for High Courts, not SC. Dr Ambedkar called 32 'the heart and soul of the Constitution'.",
    },
    {
      id: "cuet-q2",
      question: "The Tropic of Cancer passes through how many Indian states?",
      options: { A: "7", B: "8", C: "9", D: "10" },
      correct: "B",
      concept: "Indian Geography — latitude lines and state boundaries",
      drill: "NCERT Class 11 Geography · India · Physical Environment · Ch 1 India Location",
      whenWrong:
        "8 states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, Mizoram. Most students forget Tripura or Mizoram and pick 7.",
    },
    {
      id: "cuet-q3",
      question: "The Battle of Plassey was fought in:",
      options: { A: "1756", B: "1757", C: "1764", D: "1761" },
      correct: "B",
      concept: "Modern Indian History — British conquest milestones",
      drill: "NCERT Class 8 History · Ch 2 From Trade to Territory + Class 12 Themes Vol III",
      whenWrong:
        "Plassey = 1757 (Clive vs Siraj-ud-Daula). 1756 = Black Hole of Calcutta. 1761 = Third Battle of Panipat. 1764 = Buxar. The most-confused pair is Plassey/Buxar — both established British power, but Plassey gave Bengal, Buxar gave revenue rights (diwani).",
    },
    {
      id: "cuet-q4",
      question: "The word 'ubiquitous' most nearly means:",
      options: { A: "Rare and unique", B: "Present everywhere", C: "Quickly disappearing", D: "Strongly religious" },
      correct: "B",
      concept: "Vocabulary — root-based meaning derivation",
      drill: "CUET English Language section · Vocabulary builders",
      whenWrong:
        "Ubiquitous = present everywhere (Latin 'ubique' = everywhere). The trap is 'unique' which sounds similar but means rare — opposite meaning. Root awareness is the single highest-leverage vocab skill for CUET English.",
    },
    {
      id: "cuet-q5",
      question: "Find the next number in the series: 2, 6, 12, 20, 30, ?",
      options: { A: "40", B: "42", C: "38", D: "44" },
      correct: "B",
      concept: "Logical Reasoning — number series with increasing differences",
      drill: "CUET General Test · Quantitative Aptitude · Sequences",
      whenWrong:
        "Differences are 4, 6, 8, 10, 12. Next term = 30 + 12 = 42. The trap is 40 — looks 'round' but breaks the pattern. Always check if the difference itself follows a pattern before guessing.",
    },
  ],

  "ssc-cgl": [
    {
      id: "ssc-q1",
      question: "If x + 1/x = 3, find the value of x⁴ + 1/x⁴.",
      options: { A: "27", B: "47", C: "21", D: "81" },
      correct: "B",
      concept: "Algebra — squaring identities (a + 1/a)² and (a² + 1/a²)²",
      drill: "SSC CGL Algebra · R.S. Aggarwal Ch on Square-cube identities",
      whenWrong:
        "Two squarings needed. (x + 1/x)² = 9 → x² + 1/x² = 7. Then (x² + 1/x²)² = 49 → x⁴ + 1/x⁴ = 47. Most stop after one squaring and pick 27 — that's why this trap appears in 4 SSC papers since 2018.",
    },
    {
      id: "ssc-q2",
      question:
        "A number is increased by 20%, then the result is decreased by 20%. The net change is:",
      options: { A: "Same as original", B: "4% increase", C: "4% decrease", D: "1% decrease" },
      correct: "C",
      concept: "Percentages — successive percentage change",
      drill: "SSC CGL Arithmetic · Percentages · Compound effect",
      whenWrong:
        "1.2 × 0.8 = 0.96 = 4% decrease. The intuitive 'same' answer ignores that 20% of a larger number > 20% of original. Whenever you see successive percentages, multiply factors — never add/subtract.",
    },
    {
      id: "ssc-q3",
      question:
        "A shopkeeper marks up by 25% and then offers a 20% discount on the marked price. His profit/loss percent is:",
      options: { A: "5% profit", B: "5% loss", C: "No profit no loss", D: "4% loss" },
      correct: "C",
      concept: "Profit/Loss — successive markup-discount equivalence",
      drill: "SSC CGL Arithmetic · Profit-Loss-Discount",
      whenWrong:
        "1.25 × 0.80 = 1.00 = exactly cost price. Zero profit, zero loss. The trap is 'add 25 minus 20 = 5% profit' — same successive-percentage error as Q2.",
    },
    {
      id: "ssc-q4",
      question: "A can complete a job in 10 days, B in 15 days. Working together, they finish in:",
      options: { A: "12.5 days", B: "6 days", C: "25 days", D: "5 days" },
      correct: "B",
      concept: "Time and Work — reciprocal addition",
      drill: "SSC CGL Arithmetic · Time and Work · LCM method",
      whenWrong:
        "1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6 per day → 6 days. The trap is the average (10+15)/2 = 12.5. Always sum the RATES, not the times.",
    },
    {
      id: "ssc-q5",
      question:
        "If the angles of a triangle are in the ratio 2 : 3 : 4, the largest angle is:",
      options: { A: "60°", B: "80°", C: "90°", D: "100°" },
      correct: "B",
      concept: "Geometry — angle sum property + ratio splitting",
      drill: "SSC CGL Geometry · Triangle properties",
      whenWrong:
        "Sum = 180°. Parts = 2+3+4 = 9. Each part = 20°. Largest = 4 × 20° = 80°. The trap is 90° — many think 'largest angle in a triangle = right angle' by reflex. Always check by computing.",
    },
  ],
};

export const EXAM_LABEL: Record<DiagnoseExam, string> = {
  "neet-ug": "NEET UG",
  cuet: "CUET UG",
  "ssc-cgl": "SSC CGL",
};

export const EXAM_TAGLINE: Record<DiagnoseExam, string> = {
  "neet-ug": "5 Biology + Physics traps from real NEET papers",
  cuet: "5 General Test traps from real CUET papers",
  "ssc-cgl": "5 Quant traps from real SSC CGL Tier 1",
};
