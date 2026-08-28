/**
 * 5 focused exam-style diagnostic questions per exam for the public /diagnose page.
 *
 * Each question is hand-picked to be:
 *   1. A realistic exam-pattern trap (one option that "looks right" but isn't)
 *   2. Pinpointing ONE specific concept gap (so the weakness report can name a chapter)
 *   3. Mobile-readable in ≤ 80 chars per option
 *
 * No DB lookup — fully static. Keeps /diagnose fast (< 200ms first byte) and
 * usable by cold visitors with zero auth, zero rate-limit concerns.
 */

export type DiagnoseExam =
  | "neet-ug"
  | "cuet"
  | "ssc-cgl"
  | "delhi-police-constable"
  | "uppsc-ro-aro"
  | "up-secretariat-ro-aro"
  | "uppsc-pcs";

export type DiagnoseQuestion = {
  id: string;
  /** Subject route offered when this public signal is carried into Home. */
  subjectId: string;
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
      subjectId: "neet-biology",
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
        "Allolactose (not lactose itself) is the inducer that binds the repressor. Lactose is the substrate; allolactose — its isomer formed inside the cell — is what actually inactivates the repressor.",
    },
    {
      id: "neet-q2",
      subjectId: "neet-biology",
      question:
        "In the Meselson-Stahl experiment, after 3 generations of growth in ¹⁴N medium (starting from fully ¹⁵N-labeled DNA), what fraction of DNA is hybrid (¹⁵N/¹⁴N)?",
      options: { A: "1/2", B: "1/4", C: "1/8", D: "1/16" },
      correct: "B",
      concept: "DNA replication — semi-conservative mechanism",
      drill: "NCERT Class 12 Bio · Ch 6 · DNA Replication",
      whenWrong:
        "After 3 generations there are 8 strands total, of which only 2 retain a ¹⁵N strand → 2/8 = 1/4 hybrid. Track the doubling generation by generation rather than estimating.",
    },
    {
      id: "neet-q3",
      subjectId: "neet-biology",
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
      subjectId: "neet-biology",
      question: "How many net ATP molecules are produced per glucose in aerobic respiration (per latest NCERT)?",
      options: { A: "36", B: "38", C: "30", D: "32" },
      correct: "D",
      concept: "Cellular respiration — ATP yield from oxidative phosphorylation",
      drill: "NCERT Class 11 Bio · Ch 14 Respiration in Plants · Energetics",
      whenWrong:
        "Latest NCERT gives 32 ATP (sometimes 30, depending on the shuttle). The older 36/38 figure ignores the ATP cost of moving NADH into mitochondria.",
    },
    {
      id: "neet-q5",
      subjectId: "neet-physics",
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
        "The action-reaction pair is equal — but they act on DIFFERENT bodies. The NET force on the cart (horse pull minus friction on cart) > 0 only because friction on horse's hooves > friction on cart.",
    },
  ],

  cuet: [
    {
      id: "cuet-q1",
      subjectId: "general",
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
      subjectId: "general",
      question: "The Tropic of Cancer passes through how many Indian states?",
      options: { A: "7", B: "8", C: "9", D: "10" },
      correct: "B",
      concept: "Indian Geography — latitude lines and state boundaries",
      drill: "NCERT Class 11 Geography · India · Physical Environment · Ch 1 India Location",
      whenWrong:
        "8 states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, Mizoram.",
    },
    {
      id: "cuet-q3",
      subjectId: "general",
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
      subjectId: "english",
      question: "The word 'ubiquitous' most nearly means:",
      options: { A: "Rare and unique", B: "Present everywhere", C: "Quickly disappearing", D: "Strongly religious" },
      correct: "B",
      concept: "Vocabulary — root-based meaning derivation",
      drill: "CUET English Language section · Vocabulary builders",
      whenWrong:
        "Ubiquitous = present everywhere (Latin 'ubique' = everywhere). 'Unique' sounds similar but means rare — the opposite meaning.",
    },
    {
      id: "cuet-q5",
      subjectId: "general",
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
      subjectId: "ssc-quant",
      question: "If x + 1/x = 3, find the value of x⁴ + 1/x⁴.",
      options: { A: "27", B: "47", C: "21", D: "81" },
      correct: "B",
      concept: "Algebra — squaring identities (a + 1/a)² and (a² + 1/a²)²",
      drill: "SSC CGL Algebra · R.S. Aggarwal Ch on Square-cube identities",
      whenWrong:
        "Two squarings are needed. (x + 1/x)² = 9 → x² + 1/x² = 7. Then (x² + 1/x²)² = 49 → x⁴ + 1/x⁴ = 47.",
    },
    {
      id: "ssc-q2",
      subjectId: "ssc-quant",
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
      subjectId: "ssc-quant",
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
      subjectId: "ssc-quant",
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
      subjectId: "ssc-quant",
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

  "delhi-police-constable": [
    {
      id: "dp-q1",
      subjectId: "dp-gk",
      question: "Which Article lists the Fundamental Duties of Indian citizens?",
      options: { A: "Article 32", B: "Article 51A", C: "Article 356", D: "Article 370" },
      correct: "B",
      concept: "Indian Polity — Fundamental Rights and Duties",
      drill: "Delhi Police Constable · General Knowledge & Current Affairs · Indian Polity",
      whenWrong: "Fundamental Duties are in Article 51A. Article 32 concerns constitutional remedies, while Articles 356 and 370 concern separate constitutional provisions. Build a one-page Article map instead of memorising isolated numbers.",
    },
    {
      id: "dp-q2",
      subjectId: "dp-reasoning",
      question: "In a code, each letter of DELHI is replaced by the next letter. How is POLICE written?",
      options: { A: "QPMJDF", B: "QOLHBD", C: "QPMKDF", D: "QPNJDF" },
      correct: "A",
      concept: "Coding-Decoding — letter-to-symbol mapping",
      drill: "Delhi Police Constable · Reasoning · Series & Coding-Decoding",
      whenWrong: "The code shifts every letter forward by one: P→Q, O→P, L→M, I→J, C→D, E→F. Check each position before choosing an option; one unchanged letter is enough to reject a distractor.",
    },
    {
      id: "dp-q3",
      subjectId: "dp-quant",
      question: "A number is increased by 25% and then decreased by 20%. The final value is:",
      options: { A: "4% more", B: "4% less", C: "Unchanged", D: "5% more" },
      correct: "C",
      concept: "Percentages — successive change factors",
      drill: "Delhi Police Constable · Numerical Ability · Percentages, Ratio & Average",
      whenWrong: "Use factors, not subtraction: 1.25 × 0.80 = 1.00. A 25% rise and a 20% fall exactly cancel here because the percentage bases differ. This is the opposite of the common 20% up, 20% down trap.",
    },
    {
      id: "dp-q4",
      subjectId: "dp-computer",
      question: "Which memory loses its contents when power is switched off?",
      options: { A: "ROM", B: "Hard disk", C: "RAM", D: "DVD" },
      correct: "C",
      concept: "Computer Awareness — volatile primary memory",
      drill: "Delhi Police Constable · Computer Awareness · Hardware, Memory & Storage",
      whenWrong: "RAM is volatile: it needs power to retain data. ROM, disks and DVDs are non-volatile storage. Keep one contrast table—volatile/non-volatile, primary/secondary—to prevent category mix-ups.",
    },
    {
      id: "dp-q5",
      subjectId: "dp-reasoning",
      question: "P is north of Q. R is east of Q. In which direction is R from P?",
      options: { A: "North-east", B: "South-east", C: "North-west", D: "South-west" },
      correct: "B",
      concept: "Direction Sense — coordinate mapping",
      drill: "Delhi Police Constable · Reasoning · Directions, Relations & Ranking",
      whenWrong: "Put Q at the centre. P is one step up and R one step right. From P to R you move down and right: south-east. Draw a two-second compass map; do not rotate the question mentally.",
    },
  ],

  "uppsc-ro-aro": [
    {
      id: "uppsc-ro-q1",
      subjectId: "uppsc-ro-hindi",
      question: "‘राजपुत्र’ शब्द में कौन-सा समास है?",
      options: { A: "द्वंद्व", B: "बहुव्रीहि", C: "तत्पुरुष", D: "अव्ययीभाव" },
      correct: "C",
      concept: "हिंदी व्याकरण — समास की पहचान",
      drill: "UPPSC RO/ARO · General Hindi & Drafting · संधि और समास",
      whenWrong: "राजपुत्र का विग्रह ‘राजा का पुत्र’ है, इसलिए यह षष्ठी तत्पुरुष समास है. पहले विग्रह लिखिए; नाम याद करने से पहले संबंध पहचानिए.",
    },
    {
      id: "uppsc-ro-q2",
      subjectId: "uppsc-ro-gs",
      question: "भारतीय संविधान में मौलिक कर्तव्य किस अनुच्छेद में हैं?",
      options: { A: "अनुच्छेद 14", B: "अनुच्छेद 32", C: "अनुच्छेद 51A", D: "अनुच्छेद 356" },
      correct: "C",
      concept: "भारतीय राजव्यवस्था — मौलिक अधिकार और कर्तव्य",
      drill: "UPPSC RO/ARO · General Studies · Constitutional Framework",
      whenWrong: "मौलिक कर्तव्य अनुच्छेद 51A में हैं. अनुच्छेद 32 संवैधानिक उपचार से जुड़ा है. एक छोटे Article-map से ऐसे विकल्प अलग करना आसान होता है.",
    },
    {
      id: "uppsc-ro-q3",
      subjectId: "uppsc-ro-computer",
      question: "कौन-सी मेमोरी बिजली बंद होते ही अपना डेटा खो देती है?",
      options: { A: "ROM", B: "RAM", C: "Hard disk", D: "DVD" },
      correct: "B",
      concept: "कंप्यूटर — volatile और non-volatile memory",
      drill: "UPPSC RO/ARO · Computer & Office Skills · Memory and Storage",
      whenWrong: "RAM volatile memory है: power हटते ही उसका data चला जाता है. ROM, hard disk और DVD non-volatile storage हैं. इन्हें contrast card में साथ लिखिए.",
    },
    {
      id: "uppsc-ro-q4",
      subjectId: "uppsc-ro-reasoning",
      question: "P, Q के उत्तर में है. R, Q के पूर्व में है. R, P के किस दिशा में है?",
      options: { A: "उत्तर-पश्चिम", B: "उत्तर-पूर्व", C: "दक्षिण-पश्चिम", D: "दक्षिण-पूर्व" },
      correct: "C",
      concept: "तार्किक क्षमता — दिशा-बोध का न्यूनतम मानचित्र",
      drill: "UPPSC RO/ARO · Reasoning & Aptitude · Directions, Relations & Order",
      whenWrong: "Q को बीच में रखें: P उसके ऊपर, R उसके बाएँ. इसलिए R, P के दक्षिण-पश्चिम में है. कथन को विकल्पों में बदलने से पहले छोटा map बनाइए.",
    },
    {
      id: "uppsc-ro-q5",
      subjectId: "uppsc-ro-hindi",
      question: "किस वाक्य में वर्तनी शुद्ध है?",
      options: { A: "आर्शीवाद", B: "आशीर्वाद", C: "आशिर्वाद", D: "आर्शिवाद" },
      correct: "B",
      concept: "हिंदी लेखन — वर्तनी और शुद्ध प्रयोग",
      drill: "UPPSC RO/ARO · General Hindi & Drafting · वर्तनी और विराम-चिह्न",
      whenWrong: "मानक रूप ‘आशीर्वाद’ है. ऐसी त्रुटियाँ केवल पढ़ने से नहीं जातीं: अपनी भ्रमित शब्द-सूची बनाकर spaced revision कीजिए.",
    },
  ],

  "up-secretariat-ro-aro": [
    {
      id: "up-secretariat-ro-q1",
      subjectId: "up-secretariat-hindi",
      question: "‘देवालय’ शब्द में कौन-सा समास है?",
      options: { A: "द्वंद्व", B: "तत्पुरुष", C: "बहुव्रीहि", D: "अव्ययीभाव" },
      correct: "B",
      concept: "हिंदी व्याकरण — समास का विग्रह",
      drill: "UP Secretariat RO/ARO · General Hindi & Drafting · संधि और समास",
      whenWrong: "देवालय का विग्रह ‘देव का आलय’ है, इसलिए यह षष्ठी तत्पुरुष समास है. विकल्प देखने से पहले शब्द का विग्रह लिखिए; संबंध साफ होते ही समास का प्रकार भी साफ हो जाता है.",
    },
    {
      id: "up-secretariat-ro-q2",
      subjectId: "up-secretariat-gs",
      question: "भारतीय संविधान में राज्य के नीति-निदेशक तत्व किस भाग में हैं?",
      options: { A: "भाग III", B: "भाग IV", C: "भाग IVA", D: "भाग V" },
      correct: "B",
      concept: "भारतीय राजव्यवस्था — संविधान के भाग और नीति-निदेशक तत्व",
      drill: "UP Secretariat RO/ARO · General Studies · Indian Constitution",
      whenWrong: "राज्य के नीति-निदेशक तत्व भाग IV में हैं. भाग III मौलिक अधिकार और भाग IVA मौलिक कर्तव्य हैं. Articles को अकेले याद करने के बजाय संविधान के भागों का छोटा map बनाइए.",
    },
    {
      id: "up-secretariat-ro-q3",
      subjectId: "up-secretariat-computer",
      question: "MS Word में Ctrl + S का सामान्य उपयोग क्या है?",
      options: { A: "Document save करना", B: "Text select करना", C: "Document print करना", D: "New file खोलना" },
      correct: "A",
      concept: "कंप्यूटर एवं कार्यालय कौशल — सामान्य shortcut keys",
      drill: "UP Secretariat RO/ARO · Computer & Office Skills · Word processing basics",
      whenWrong: "Ctrl + S save करता है. Select all के लिए Ctrl + A, print के लिए Ctrl + P और new document के लिए Ctrl + N होता है. Shortcut keys को काम के आधार पर group करके revise कीजिए.",
    },
    {
      id: "up-secretariat-ro-q4",
      subjectId: "up-secretariat-reasoning",
      question: "A, B के पूर्व में है। C, B के दक्षिण में है। C, A के किस दिशा में है?",
      options: { A: "उत्तर-पूर्व", B: "दक्षिण-पूर्व", C: "उत्तर-पश्चिम", D: "दक्षिण-पश्चिम" },
      correct: "B",
      concept: "तार्किक क्षमता — दिशा-बोध का coordinate method",
      drill: "UP Secretariat RO/ARO · Reasoning & Aptitude · Direction sense",
      whenWrong: "B को बीच में रखें: A बाएँ और C नीचे. A से C तक दाएँ और नीचे जाना है, इसलिए दिशा दक्षिण-पूर्व है. हर direction question में पहले 3-dot map बनाइए.",
    },
    {
      id: "up-secretariat-ro-q5",
      subjectId: "up-secretariat-hindi",
      question: "निम्न में से कौन-सा शब्द शुद्ध है?",
      options: { A: "दृष्टीकोण", B: "दृष्टिकोण", C: "द्रष्टिकोण", D: "दृष्टिकोन" },
      correct: "B",
      concept: "हिंदी लेखन — मानक वर्तनी",
      drill: "UP Secretariat RO/ARO · General Hindi & Drafting · शुद्ध वर्तनी",
      whenWrong: "मानक रूप ‘दृष्टिकोण’ है. ऐसे शब्दों में केवल answer देखना काफी नहीं: अपनी confused-word list बनाकर अगली revision में बिना विकल्प के लिखकर जाँचिए.",
    },
  ],
  "uppsc-pcs": [
    {
      id: "uppsc-pcs-q1",
      subjectId: "uppsc-pcs-gs",
      question: "Which part of the Indian Constitution contains the Directive Principles of State Policy?",
      options: { A: "Part III", B: "Part IV", C: "Part IVA", D: "Part V" },
      correct: "B",
      concept: "Indian Polity — Directive Principles and constitutional parts",
      drill: "UPPSC PCS foundation · General Studies · Constitutional framework",
      whenWrong: "Directive Principles are in Part IV. Part III contains Fundamental Rights and Part IVA contains Fundamental Duties. Build a compact Constitution map instead of memorising articles in isolation.",
    },
    {
      id: "uppsc-pcs-q2",
      subjectId: "uppsc-pcs-up-context",
      question: "Which river is a major tributary of the Ganga that flows through Uttar Pradesh?",
      options: { A: "Narmada", B: "Godavari", C: "Yamuna", D: "Kaveri" },
      correct: "C",
      concept: "Uttar Pradesh geography — river systems",
      drill: "UPPSC PCS foundation · Uttar Pradesh context · Rivers and geography",
      whenWrong: "The Yamuna is a major Ganga tributary and meets it at Prayagraj. Tie river facts to a simple map; location links make recall more reliable than a disconnected list.",
    },
    {
      id: "uppsc-pcs-q3",
      subjectId: "uppsc-pcs-csat",
      question: "A value rises from 240 to 300. What is the percentage increase?",
      options: { A: "20%", B: "25%", C: "30%", D: "60%" },
      correct: "B",
      concept: "CSAT numeracy — percentage change from the original value",
      drill: "UPPSC PCS foundation · General Studies II / CSAT · Percentage change",
      whenWrong: "Increase = 300 − 240 = 60. Divide by the original 240: 60/240 = 25%. The denominator is the starting value, not the final value.",
    },
    {
      id: "uppsc-pcs-q4",
      subjectId: "uppsc-pcs-csat",
      question: "All mentors are readers. Some readers are writers. Which conclusion must follow?",
      options: { A: "All writers are mentors", B: "Some mentors are writers", C: "No mentor is a writer", D: "No definite relation between mentors and writers" },
      correct: "D",
      concept: "CSAT reasoning — syllogism scope",
      drill: "UPPSC PCS foundation · General Studies II / CSAT · Statements and conclusions",
      whenWrong: "The statement only says mentors sit inside the larger reader group and some readers are writers. Those two subsets may or may not overlap. Draw the smallest possible Venn diagram before choosing.",
    },
    {
      id: "uppsc-pcs-q5",
      subjectId: "uppsc-pcs-gs",
      question: "Which body is primarily responsible for conducting elections to Parliament and State Legislatures in India?",
      options: { A: "NITI Aayog", B: "Election Commission of India", C: "Union Public Service Commission", D: "Finance Commission" },
      correct: "B",
      concept: "Indian Polity — constitutional bodies and their roles",
      drill: "UPPSC PCS foundation · General Studies · Constitutional bodies",
      whenWrong: "The Election Commission conducts and supervises these elections. Learn bodies by function—elections, recruitment, finance, planning—so close options stop feeling interchangeable.",
    },
  ],
};

export const EXAM_LABEL: Record<DiagnoseExam, string> = {
  "neet-ug": "NEET UG",
  cuet: "CUET UG",
  "ssc-cgl": "SSC CGL",
  "delhi-police-constable": "Delhi Police Constable",
  "uppsc-ro-aro": "UPPSC RO / ARO",
  "up-secretariat-ro-aro": "UP Secretariat RO / ARO",
  "uppsc-pcs": "UPPSC PCS",
};

export const EXAM_TAGLINE: Record<DiagnoseExam, string> = {
  "neet-ug": "5 Biology + Physics questions built to NEET patterns",
  cuet: "5 General Test questions built to CUET patterns",
  "ssc-cgl": "5 Quant questions built to SSC CGL Tier 1 patterns",
  "delhi-police-constable": "5 focused objective questions across Delhi Police Constable preparation areas",
  "uppsc-ro-aro": "5 foundation questions across Hindi, General Studies, computer and reasoning",
  "up-secretariat-ro-aro": "5 foundation questions across Hindi, General Studies, computer and reasoning",
  "uppsc-pcs": "5 foundation questions across General Studies, Uttar Pradesh context and CSAT skills",
};

export function isDiagnoseExam(value: string): value is DiagnoseExam {
  return value in DIAGNOSE_QUESTIONS;
}
