export type StudyGuide = {
  slug: string;
  examSlug: "ssc-cgl" | "cuet" | "neet-ug" | "delhi-police-constable" | "uppsc-ro-aro" | "up-secretariat-ro-aro" | "uppsc-pcs";
  title: string;
  description: string;
  eyebrow: string;
  readTime: string;
  publishedAt: string;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  takeaway: string;
  sourceLinks?: Array<{ label: string; href: string }>;
};

export const studyGuides: StudyGuide[] = [
  {
    slug: "ssc-cgl-mock-test-analysis",
    examSlug: "ssc-cgl",
    title: "How to analyse an SSC CGL mock test without wasting the next day",
    description: "A practical SSC CGL mock-analysis method: sort errors, choose one repair, and measure whether it worked.",
    eyebrow: "SSC CGL study guide",
    readTime: "7 min read",
    publishedAt: "14 August 2026",
    sections: [
      {
        heading: "A score tells you where you finished. It does not tell you where to begin.",
        paragraphs: [
          "A 112 in a mock can mean very different things. One student may know the syllabus but lose time in Reasoning. Another may finish early but repeatedly miss percentage base-value questions. Treating both students as if they simply need another mock is how preparation becomes noisy.",
          "After a mock, do not begin by reading every solution from top to bottom. First find the pattern behind the lost marks. The goal is to leave the analysis with one useful action for today—not a longer list of things to feel guilty about.",
        ],
      },
      {
        heading: "Sort every wrong or skipped question into one of four buckets",
        paragraphs: ["Use the same labels every time. They make your analysis comparable from one mock to the next."],
        bullets: [
          "Did not know the concept: you could not start, or the method was unfamiliar.",
          "Knew it but applied it wrongly: the method was known, but the setup, sign, unit, or option selection broke.",
          "Took too long: the answer was possible, but the route was too slow for the exam.",
          "Silly mistake: you understood it and had enough time, but misread, copied a number incorrectly, or marked the wrong option.",
        ],
      },
      {
        heading: "Choose the repair with the highest return",
        paragraphs: [
          "Do not repair every weakness in one sitting. Start where the same error appeared more than once and where the concept is small enough to practise today. A repeated mistake in successive percentage change deserves attention before a one-off unfamiliar vocabulary question.",
          "Write a repair in a testable sentence: ‘I will revise successive percentage change for 15 minutes, solve five fresh questions, then check whether I still add two percentage changes directly.’ That is much better than ‘Revise Maths.’",
        ],
      },
      {
        heading: "End every analysis with a retest date",
        paragraphs: [
          "A repair is only a theory until you meet a fresh question. Retest the same concept the next day or within three days, using questions you have not seen. If accuracy improves, move the concept into revision. If it does not, review the exact step that still fails instead of restarting the entire chapter.",
        ],
      },
    ],
    takeaway: "The best mock analysis produces one precise repair and one planned retest—not a notebook full of highlighted solutions.",
  },
  {
    slug: "four-kinds-of-wrong-answers-ssc-cgl",
    examSlug: "ssc-cgl",
    title: "The 4 kinds of wrong answers in SSC CGL—and what to do about each",
    description: "Not every wrong answer needs more study. Learn the four SSC CGL error types and the correct repair for each.",
    eyebrow: "SSC CGL study guide",
    readTime: "5 min read",
    publishedAt: "14 August 2026",
    sections: [
      {
        heading: "1. You did not know the concept",
        paragraphs: [
          "This is the cleanest kind of error. You did not recognise the rule, formula, definition, or method. It is not fixed by immediately solving fifty more questions; that usually makes you memorise answer patterns without understanding them.",
          "Repair it by learning the smallest missing idea, making a short example in your own words, and solving five untimed questions. Only then use a timed set.",
        ],
      },
      {
        heading: "2. You knew it, but applied it wrongly",
        paragraphs: [
          "These errors often look like ‘careless mistakes’ but they usually have a repeatable trigger: using a percentage change on the wrong base, mixing up simple and compound interest, reversing a condition, or choosing the conclusion before checking all statements.",
          "Repair it by writing the exact incorrect step beside the correct one. Then solve contrast questions: two questions that look similar but require different setups. Your brain learns the decision point, not just the final formula.",
        ],
      },
      {
        heading: "3. You took too long",
        paragraphs: [
          "Taking too long is not proof that you are weak. It may mean your method works but is not exam-efficient yet. First check whether the question belongs in your first pass at all. Some questions should be skipped and returned to later.",
          "Repair it with a time cap. Practise three questions using the same method, record the first step you take, and compare it with a shorter method only after attempting it yourself. Speed comes from recognising structure, not from rushing arithmetic.",
        ],
      },
      {
        heading: "4. It was a silly mistake",
        paragraphs: [
          "A real silly mistake is rare and specific: reading ‘not’ as ‘now’, carrying 18 instead of 81, or clicking B after deriving C. If the same ‘silly’ mistake repeats, it is a process problem, not bad luck.",
          "Repair it with a final ten-second check: underline units and negatives, estimate the range of a numerical answer, and point to the chosen option before submitting. Track the trigger—not just the number of careless errors.",
        ],
      },
    ],
    takeaway: "Wrong answers are useful only when you give each type a different repair. More questions are not the answer to every error.",
  },
  {
    slug: "ssc-cgl-revision-system",
    examSlug: "ssc-cgl",
    title: "A simple SSC CGL revision system for people who forget what they studied",
    description: "Build a realistic SSC CGL revision loop that protects old topics while you continue learning new ones.",
    eyebrow: "SSC CGL study guide",
    readTime: "6 min read",
    publishedAt: "14 August 2026",
    sections: [
      {
        heading: "The problem is not forgetting. It is revising without a system.",
        paragraphs: [
          "Most aspirants remember a chapter on the day they finish it and feel blank two weeks later. That is normal. The fix is not to repeat the entire chapter every Sunday. It is to revisit small pieces before they disappear.",
          "Keep each study day split into three jobs: learn one new thing, retrieve one old thing, and repair one recent mistake. This is small enough to repeat even on a busy day.",
        ],
      },
      {
        heading: "Use a 1–3–7–14 rhythm",
        paragraphs: [
          "After learning a topic, revisit it the next day, then around day three, day seven, and day fourteen. A revisit does not mean rewatching a lecture. Start by recalling formulas, rules, or steps from a blank page; then use five to ten questions to reveal what is missing.",
          "If a topic fails the revisit, place it in repair. If it passes twice in a row, reduce how often you revisit it. Revision should respond to evidence, not guilt.",
        ],
      },
      {
        heading: "Keep the revision unit small",
        paragraphs: [
          "‘Revise Arithmetic’ is too large to begin. ‘Revise ratio-proportion mixtures: 8 questions, 20 minutes’ is a usable unit. Small units make it obvious whether you did the work and make it easier to fit revision around new learning.",
        ],
      },
      {
        heading: "Use tests to decide what returns to the queue",
        paragraphs: [
          "A topic should return to revision because fresh questions show a gap, not because a calendar says you have failed. Mark the question type, the reason it went wrong, and the next revisit date. That turns revision into a living list instead of an overwhelming backlog.",
        ],
      },
    ],
    takeaway: "Learn, retrieve, repair. A small repeatable revision loop beats a perfect timetable that lasts two days.",
  },
  {
    slug: "how-to-improve-ssc-cgl-maths-score",
    examSlug: "ssc-cgl",
    title: "How to improve your SSC CGL Maths score without restarting the syllabus",
    description: "Find the question types that cost marks, choose a focused repair, and build speed without redoing everything.",
    eyebrow: "SSC CGL study guide",
    readTime: "7 min read",
    publishedAt: "14 August 2026",
    sections: [
      {
        heading: "Do not restart Maths just because one mock went badly",
        paragraphs: [
          "A low Quant score feels like evidence that the whole subject is weak. Usually it is not. One bad mock can contain a cluster of mistakes from a handful of question types: percentage base values, ratio mixtures, DI selection, geometry diagrams, or calculation speed.",
          "Before starting another playlist, look at the last two or three attempts. Which question types repeat? Which ones take more than two minutes? Which ones are accurate when untimed but collapse under a clock? Those answers decide the next session.",
        ],
      },
      {
        heading: "Separate coverage from performance",
        paragraphs: [
          "Coverage asks: have I seen this chapter? Performance asks: can I recognise and solve the exam version under time pressure? A chapter can feel complete while one subtype keeps taking marks. Name the subtype as precisely as possible.",
          "For example, ‘Percentages weak’ is vague. ‘I turn successive discounts into a simple sum’ is actionable. That is the repair target.",
        ],
      },
      {
        heading: "Use a three-part Maths session",
        paragraphs: [
          "Spend the first 15 minutes repairing one concept. Spend the next 20 minutes on eight to twelve fresh questions of that exact type. Use the final 10 minutes to review the two questions that required the most thought. This is enough for a productive session; adding another chapter often only hides the original weakness.",
        ],
      },
      {
        heading: "Build speed after accuracy has a shape",
        paragraphs: [
          "Speed drills work best when you can already explain the route. If you are still choosing the formula mid-question, more timers will create panic rather than speed. First make the method reliable, then reduce time gradually while preserving the same accuracy.",
        ],
      },
    ],
    takeaway: "Your next Maths gain is usually hidden in a repeated question type, not in an entire chapter you need to begin again.",
  },
  {
    slug: "ssc-cgl-attempt-strategy",
    examSlug: "ssc-cgl",
    title: "SSC CGL attempt strategy: how to decide what to solve first",
    description: "A simple three-pass attempt method for protecting accuracy and avoiding time sinks in SSC CGL mocks.",
    eyebrow: "SSC CGL study guide",
    readTime: "5 min read",
    publishedAt: "14 August 2026",
    sections: [
      {
        heading: "Your first pass is for certainty, not bravery",
        paragraphs: [
          "A common mock-test mistake is treating the paper as a queue: question one, then two, then three. That gives hard early questions too much power over the rest of your attempt. Instead, use the first pass to collect questions where the route is visible within a few seconds.",
          "If you do not know how to start, mark it and move. If you know the method but calculation is long, mark it and move. A first pass should build score and calm before it asks for difficult decisions.",
        ],
      },
      {
        heading: "Use three clear passes",
        paragraphs: ["A useful attempt strategy has room for both strong questions and recovery questions."],
        bullets: [
          "Pass one: direct, familiar questions. Protect accuracy and collect quick marks.",
          "Pass two: questions with a known route but longer work. Set a time cap before you begin.",
          "Pass three: marked questions only. Choose based on time left and the chance of a clean answer, not ego.",
        ],
      },
      {
        heading: "Review the questions you abandoned",
        paragraphs: [
          "An abandoned question is useful data. Did you leave it because the concept was missing, the question was wordy, or the method was slow? Review those labels after the mock. Over time, you will know whether your attempt strategy needs better selection or your preparation needs a concept repair.",
        ],
      },
    ],
    takeaway: "Attempt order is a score-management skill. Do the questions that are ready to become marks before wrestling with the rest.",
  },
  {
    slug: "ssc-cgl-accuracy-improvement",
    examSlug: "ssc-cgl",
    title: "How to improve SSC CGL accuracy when you know the syllabus",
    description: "Find out why accuracy drops in mocks and build a process that turns familiar concepts into correct answers.",
    eyebrow: "SSC CGL study guide",
    readTime: "6 min read",
    publishedAt: "14 August 2026",
    sections: [
      {
        heading: "Knowing a chapter is not the same as answering its questions accurately",
        paragraphs: [
          "Accuracy usually falls at one of three points: interpreting the question, choosing the method, or checking the final answer. If you call every miss a careless mistake, you lose the information needed to improve.",
          "For one week, write a six-word reason beside every incorrect answer. Examples: ‘missed the word except’, ‘percentage applied to wrong base’, or ‘rushed final subtraction’. Patterns become visible surprisingly fast.",
        ],
      },
      {
        heading: "Create a short checking routine",
        paragraphs: [
          "A checking routine must be small enough to use under pressure. For Quant, check the sign, unit, and approximate range. For English, return to the exact phrase that supports the option. For Reasoning, verify every condition before selecting the conclusion. For GA, do not turn a guess into a confident answer just because an option feels familiar.",
        ],
      },
      {
        heading: "Make accuracy practice different from speed practice",
        paragraphs: [
          "Once a week, solve a short set slowly and aim to explain every choice. On another day, run a timed set using the same concepts. Combining both goals in every session makes it hard to know whether the problem is understanding or pace.",
        ],
      },
    ],
    takeaway: "Accuracy improves when you identify the step that breaks—not when you simply promise yourself to be more careful.",
  },
  {
    slug: "ssc-cgl-error-log-template",
    examSlug: "ssc-cgl",
    title: "The SSC CGL error log that is actually worth maintaining",
    description: "A minimal error-log format that helps you repair recurring mistakes instead of collecting solutions you never revisit.",
    eyebrow: "SSC CGL study guide",
    readTime: "5 min read",
    publishedAt: "14 August 2026",
    sections: [
      {
        heading: "An error log should help you decide tomorrow’s work",
        paragraphs: [
          "A giant notebook of copied questions looks productive but is difficult to use. Your log only needs enough detail to make the next repair obvious. If an entry does not lead to a follow-up question, revision, or retest, it can be removed.",
        ],
      },
      {
        heading: "Use five fields for every recurring error",
        paragraphs: ["Keep each entry to one or two lines. The point is a usable record, not a second textbook."],
        bullets: [
          "Question type: for example, successive percentage change or syllogism conclusion.",
          "Error type: concept, application, time, or reading/click mistake.",
          "Exact trigger: the step at which your approach broke.",
          "Repair: the smallest action that fixes that trigger.",
          "Retest date: when you will meet fresh questions on the same type.",
        ],
      },
      {
        heading: "Review the log once a week, not all day",
        paragraphs: [
          "At the end of the week, circle errors that happened more than once. Those are your priority repairs. One-off odd questions can stay in the log without hijacking your plan. The score gain comes from removing recurring leaks.",
        ],
      },
    ],
    takeaway: "A good error log is short, specific, and always points toward a retest.",
  },
  {
    slug: "ssc-cgl-study-plan-that-you-can-follow",
    examSlug: "ssc-cgl",
    title: "How to make an SSC CGL study plan you can follow for more than two days",
    description: "Build a realistic SSC CGL daily structure around learning, practice, mock analysis and revision.",
    eyebrow: "SSC CGL study guide",
    readTime: "6 min read",
    publishedAt: "14 August 2026",
    sections: [
      {
        heading: "A study plan is useful only when it survives an ordinary day",
        paragraphs: [
          "The perfect twelve-hour timetable usually fails because it assumes every day has perfect energy, no interruptions, and no difficult topic. A plan should instead protect the few actions that keep your preparation moving even on a messy day.",
          "Start with your honest available time. Then give each block one job. Do not schedule ‘Quant’ for three hours; schedule a concept, a question set, or a repair.",
        ],
      },
      {
        heading: "Use the learn–practise–analyse–revise loop",
        paragraphs: [
          "Learning introduces a new idea. Practice checks whether you can use it. Analysis identifies what failed. Revision keeps old wins available. A balanced day touches at least two of these jobs; a balanced week touches all four.",
          "For a three-hour day, one workable pattern is 75 minutes of new learning, 45 minutes of focused practice, 30 minutes of analysis, and 30 minutes of revision. Adjust the minutes, but keep the loop intact.",
        ],
      },
      {
        heading: "Keep one small fallback plan",
        paragraphs: [
          "On low-energy days, do a twenty-minute revision block or a five-question repair instead of abandoning the day. Consistency does not mean every day is equal. It means you have a smaller version of the plan that still protects momentum.",
        ],
      },
    ],
    takeaway: "A plan that is smaller but repeatable will beat a beautiful timetable you cannot return to.",
  },
  {
    slug: "cuet-ug-preparation-plan",
    examSlug: "cuet",
    title: "How to prepare for CUET UG without treating every subject the same",
    description: "A practical way to balance domain subjects, language, and the General Test around your own CUET combination.",
    eyebrow: "CUET UG study guide",
    readTime: "6 min read",
    publishedAt: "14 August 2026",
    sections: [
      {
        heading: "Your CUET plan begins with your actual subject combination",
        paragraphs: [
          "CUET preparation becomes overwhelming when you follow a plan built for someone taking different subjects. List the papers you will actually sit, then give each one a role: a high-confidence paper to protect, a paper that needs coverage, and a paper that needs regular practice.",
          "Do not split every day equally across every subject. Give more time to the paper where your accuracy is unstable, while keeping a short recall block for the papers you already know well.",
        ],
      },
      {
        heading: "Use NCERT as the base, then test retrieval",
        paragraphs: [
          "For domain subjects, reading a chapter is only the first step. Close the book and retrieve headings, definitions, diagrams, formulas, and exceptions. Then answer fresh questions to see whether the information is available under exam conditions.",
          "When a question goes wrong, label the gap precisely: line missed, concept confused, application error, or rushed reading. That is more useful than reopening the entire chapter.",
        ],
      },
      {
        heading: "Make a weekly paper-level check",
        paragraphs: [
          "Once a week, do a short timed set for every active paper and compare accuracy with time taken. This stops one favourite subject from quietly consuming the week while another paper receives no evidence-based attention.",
        ],
      },
    ],
    takeaway: "A good CUET plan is built around your paper combination and your evidence—not a generic timetable for every aspirant.",
  },
  {
    slug: "cuet-ug-mock-analysis",
    examSlug: "cuet",
    title: "How to analyse a CUET UG test and choose what to revise next",
    description: "Turn a CUET practice attempt into a clear subject-wise repair plan instead of another long revision list.",
    eyebrow: "CUET UG study guide",
    readTime: "5 min read",
    publishedAt: "14 August 2026",
    sections: [
      {
        heading: "Separate the paper score from the reason behind it",
        paragraphs: [
          "A low score may come from an unfamiliar NCERT detail, a careless reading error, slow recall, or a weak question-selection decision. Those need different repairs. Start by marking the reason beside each incorrect or skipped question.",
        ],
      },
      {
        heading: "Choose one repair per paper",
        paragraphs: [
          "For each active CUET paper, select the one repeated weakness most likely to improve your next attempt. For example, revise one Biology NCERT table, practise two vocabulary patterns, or work through a General Test calculation method. A small repair is easier to retest than a chapter-wide promise.",
        ],
      },
      {
        heading: "Retest while the signal is still useful",
        paragraphs: [
          "Use five to ten unseen questions on the same subtopic within three days. If the weakness remains, return to the explanation. If it improves, schedule it for revision rather than continuing to drill it endlessly.",
        ],
      },
    ],
    takeaway: "A CUET test becomes useful when it tells you what to revise in each paper before the next one.",
  },
  {
    slug: "neet-ug-ncert-study-system",
    examSlug: "neet-ug",
    title: "A NEET UG NCERT study system that goes beyond highlighting",
    description: "Use active recall, question evidence, and small revision loops to turn NCERT reading into reliable NEET answers.",
    eyebrow: "NEET UG study guide",
    readTime: "7 min read",
    publishedAt: "14 August 2026",
    sections: [
      {
        heading: "Read for retrieval, not for a completed page count",
        paragraphs: [
          "NEET questions often depend on wording, relationships, diagrams, and exceptions. Reading an NCERT page until it feels familiar can create false confidence. Instead, pause after a small section and recall the key statement, process, or diagram without looking.",
          "If recall is incomplete, reopen only the missing part. Then use a few questions to check whether you can recognise the idea in a new form.",
        ],
      },
      {
        heading: "Keep theory, questions, and revision connected",
        paragraphs: [
          "For a single topic, learn the core lines and relationships, solve a focused question set, log the exact misconception, and set a short revisit. That is much stronger than reading three chapters before you ever test yourself.",
        ],
      },
      {
        heading: "Use weak questions to decide the next NCERT revisit",
        paragraphs: [
          "When an answer goes wrong, name the smallest source to revisit: a definition, a labelled diagram, an exception, a formula condition, or a multi-step application. Do not restart the whole unit unless the evidence says the foundations are missing.",
        ],
      },
    ],
    takeaway: "NCERT becomes high-yield when each read is followed by retrieval, questions, and a planned revisit.",
  },
  {
    slug: "neet-ug-mock-analysis",
    examSlug: "neet-ug",
    title: "How to analyse a NEET UG mock without drowning in solutions",
    description: "A subject-wise method for separating concept gaps, recall gaps, time issues, and avoidable errors after a NEET mock.",
    eyebrow: "NEET UG study guide",
    readTime: "6 min read",
    publishedAt: "14 August 2026",
    sections: [
      {
        heading: "Start with patterns, not every explanation",
        paragraphs: [
          "Reading every solution straight after a mock takes hours and often changes nothing. First sort wrong and skipped questions by subject and reason: concept missing, NCERT line/detail missed, formula/application error, time pressure, or misread question.",
        ],
      },
      {
        heading: "Repair the recurring leak first",
        paragraphs: [
          "A repeated Biology detail gap may deserve an NCERT revisit. Repeated Physics errors may reveal one formula condition or representation problem. Repeated Chemistry misses may point to an exception or reaction family. Pick one repeated leak and create a small repair that can be tested this week.",
        ],
      },
      {
        heading: "Track time without making it the villain",
        paragraphs: [
          "A slow question is not always a weak concept. Ask whether the route was unknown, calculation was inefficient, or the question should have been left for a later pass. Better selection and better methods are different repairs.",
        ],
      },
    ],
    takeaway: "A NEET mock should leave you with a ranked repair list, not an intimidating pile of explanations.",
  },
  {
    slug: "ssc-cgl-current-affairs-revision-system",
    examSlug: "ssc-cgl",
    title: "How to handle SSC CGL current affairs without letting it consume your day",
    description: "A bounded current-affairs routine that protects Quant, Reasoning and English while keeping recall alive.",
    eyebrow: "SSC CGL study guide",
    readTime: "5 min read",
    publishedAt: "14 August 2026",
    sections: [
      {
        heading: "Current affairs needs a boundary",
        paragraphs: [
          "The problem is rarely that students do too little current affairs. It is that an open-ended news feed takes the time meant for practice and revision. Set a fixed source, a fixed window, and a fixed recall method before you begin.",
        ],
      },
      {
        heading: "Capture only what you can retrieve",
        paragraphs: [
          "Turn useful facts into small prompts: event → month, organisation → role, scheme → ministry, award → recipient. Review them in short spaced batches. A huge list read once does not become exam recall.",
        ],
      },
      {
        heading: "Keep checking official notices separately",
        paragraphs: [
          "Current affairs preparation and an exam notice are different jobs. Use the official SSC notice board for dates and documents; do not rely on a social post or an old coaching update for a deadline.",
        ],
      },
    ],
    takeaway: "Give current affairs a fixed, recall-based system so it supports your preparation instead of swallowing it.",
  },
  {
    slug: "ssc-cgl-syllabus-exam-pattern-and-common-mistakes",
    examSlug: "ssc-cgl",
    title: "SSC CGL syllabus, Tier-I pattern and the mistakes that cost marks",
    description: "A clear, official-source starting point for SSC CGL Tier-I: what the paper tests, how to use the syllabus, and the avoidable preparation errors to fix early.",
    eyebrow: "SSC CGL study guide",
    readTime: "8 min read",
    publishedAt: "17 August 2026",
    sections: [
      {
        heading: "Start with the paper you are actually going to sit",
        paragraphs: [
          "For the current SSC CGL notice, Tier-I is a computer-based, objective multiple-choice paper with four equal parts: General Intelligence and Reasoning, General Awareness, Quantitative Aptitude, and English Comprehension. Each part has 25 questions for 50 marks. Check the newest official notice for the exact duration and any current timing instructions before you plan your attempt.",
          "That structure changes the way you prepare. You are not building one giant ‘SSC CGL’ subject. You are building four separate score systems, each with its own accuracy, timing and revision needs.",
        ],
        bullets: [
          "100 questions · 200 marks in Tier-I.",
          "25 questions · 50 marks in each of the four subjects.",
          "0.50 marks are deducted for each wrong Tier-I answer.",
          "Questions are bilingual except English Comprehension. Always check the newest official notice before your own attempt.",
        ],
      },
      {
        heading: "Use the official syllabus as a coverage map, not a daily checklist",
        paragraphs: [
          "The official Tier-I syllabus names a broad range of Reasoning areas such as analogies, classifications, series, coding-decoding, syllogisms, space visualisation and decision-making. General Awareness covers current events and everyday scientific and social awareness. Quant and English need the same treatment: break the official headings into small, testable question types instead of writing ‘finish Maths’ in a timetable.",
          "A usable unit is ‘successive percentage change: 10 fresh questions’ or ‘syllogism conclusions: 15 minutes + 5 questions.’ Small units make it possible to tell whether you learned, practised and retained something.",
        ],
      },
      {
        heading: "The four preparation mistakes worth catching early",
        paragraphs: [
          "These are preparation mistakes, not official SSC rules. They are the failure patterns that make a full syllabus feel complete while mock scores stay flat.",
        ],
        bullets: [
          "Treating all four subjects equally even when one repeatedly loses accuracy or time.",
          "Doing full mocks without classifying errors as concept, application, time, or reading/click errors.",
          "Ignoring the official timing instructions until the final month.",
          "Continuing to guess under negative marking instead of using a first-pass / return-pass attempt rule.",
        ],
      },
      {
        heading: "A better first week",
        paragraphs: [
          "Take one short baseline attempt in each active subject. Do not use the score to label yourself weak or strong. Use it to find one priority: the subject where either accuracy is unstable or the timer creates the most damage. Learn one small concept, practise it, log the exact error, and retest it within three days.",
          "That loop is more valuable than copying a twelve-hour timetable because it gives every study session a reason to exist.",
        ],
      },
    ],
    takeaway: "The official syllabus tells you what can appear. Your attempts tell you what deserves today’s study time.",
    sourceLinks: [
      { label: "SSC CGL notice: scheme of Tier-I and indicative syllabus", href: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2025.pdf?mode=light" },
      { label: "SSC official candidate resources", href: "https://ssc.gov.in/for-candidates" },
    ],
  },
  {
    slug: "cuet-ug-syllabus-exam-pattern-and-common-mistakes",
    examSlug: "cuet",
    title: "CUET UG syllabus, subject choices and the preparation mistakes to avoid",
    description: "Build your CUET plan around your university course requirements, official subject choices and the few mistakes that make preparation unnecessarily broad.",
    eyebrow: "CUET UG study guide",
    readTime: "7 min read",
    publishedAt: "17 August 2026",
    sections: [
      {
        heading: "CUET is not one fixed paper for every student",
        paragraphs: [
          "The 2026 CUET UG framework offered 37 choices: 13 languages, 23 domain subjects and one General Aptitude Test. Candidates could choose up to five subjects, but the correct combination depends on the eligibility requirements of the universities and programmes they want—not on a generic online timetable.",
          "Before you make a plan, write down your target courses and universities. Then confirm exactly which language, domain subjects and General Aptitude Test they require or accept. That one step protects you from preparing a paper you do not need while missing one you do.",
        ],
        bullets: [
          "Up to five subject choices in the 2026 framework.",
          "13 language options, 23 domain subjects and one General Aptitude Test in 2026.",
          "CUET is computer-based; the official bulletin and university programme page are the source of truth for your combination and current rules.",
        ],
      },
      {
        heading: "Turn the official subject specification into a realistic plan",
        paragraphs: [
          "Open the current official syllabus for each chosen paper and divide it into units. For domain subjects, use your board/NCERT foundations where the official specification points there, then test recall with questions. For language and General Aptitude Test, separate skills: vocabulary or comprehension, numerical reasoning, logical reasoning and current/general awareness.",
          "Do not give every paper identical time. Protect your reliable paper with short recall; give the unstable paper the longer learning and practice block.",
        ],
      },
      {
        heading: "Common CUET planning mistakes",
        paragraphs: ["These are practical preparation warnings, not official NTA findings."],
        bullets: [
          "Choosing papers from a social-media list before checking course eligibility on the university website.",
          "Preparing every domain paper at the same depth rather than following the subject combination you will actually sit.",
          "Reading NCERT or notes passively without using short recall checks and fresh questions.",
          "Treating the General Aptitude Test as an optional last-week add-on when it is required for a target course.",
        ],
      },
      {
        heading: "Your next useful action",
        paragraphs: [
          "Choose your actual papers first. Then take a small subject-wise diagnostic and give each paper one clear next action: one concept to learn, one question set to practise, or one weak idea to revisit. A CUET plan should feel like a route for your combination, not a giant checklist for every aspirant.",
        ],
      },
    ],
    takeaway: "The right CUET plan begins with your course requirements—not with somebody else’s subject combination.",
    sourceLinks: [
      { label: "CUET UG 2026 information bulletin", href: "https://cuet.nta.nic.in/information-bulletin/" },
      { label: "CUET UG 2026 official syllabus", href: "https://cuet.nta.nic.in/cuetug-2026-syllabus/" },
      { label: "CUET participating universities", href: "https://cuet.nta.nic.in/participating-universities/" },
    ],
  },
  {
    slug: "neet-ug-syllabus-exam-pattern-and-common-mistakes",
    examSlug: "neet-ug",
    title: "NEET UG syllabus, paper format and the preparation mistakes to stop repeating",
    description: "Use the official NEET 2026 syllabus and bulletin as your base, then build a learn–recall–practice–retest system that actually exposes weak areas.",
    eyebrow: "NEET UG study guide",
    readTime: "8 min read",
    publishedAt: "17 August 2026",
    sections: [
      {
        heading: "Build from the official syllabus, not a random chapter list",
        paragraphs: [
          "NTA publishes the current NEET UG syllabus officially. The 2026 syllabus begins Physics with units such as Physics and Measurement, Kinematics and Laws of Motion, and continues through the full prescribed Physics, Chemistry and Biology scope. Use that official document to check coverage; do not assume an older PDF or a coaching checklist is current.",
          "For the 2026 exam, NTA announced an offline pen-and-paper examination from 2:00 PM to 5:00 PM IST. Exact current-year scheme, instructions and eligibility should always be checked in the official information bulletin before an exam-day decision.",
        ],
      },
      {
        heading: "Learn each topic in a full cycle",
        paragraphs: [
          "Reading a chapter until it feels familiar is not proof that you can answer a NEET question. Use a four-part cycle: learn the idea, recall it without looking, solve a small focused set, then return after a gap with unseen questions. Your next study action should come from the error you actually made—not from panic about the whole chapter.",
          "For Biology, make diagrams, relationships and exceptions retrievable. For Physics, name the condition under which each formula works. For Chemistry, separate definitions, mechanisms, reactions and exceptions so an error points to a small repair.",
        ],
      },
      {
        heading: "Common preparation mistakes",
        paragraphs: ["These are learning-process mistakes, not official NTA findings."],
        bullets: [
          "Finishing chapters by page count without testing recall or application.",
          "Calling every incorrect answer a careless mistake instead of identifying the missed line, formula condition, representation or exception.",
          "Using a full mock as the only form of practice and never retesting one weak subtopic.",
          "Treating diagrams and labelled relationships as decoration rather than exam-ready recall material.",
        ],
      },
      {
        heading: "Use your next mock as a map",
        paragraphs: [
          "After a test, mark whether each loss came from a concept gap, recall gap, application error, time decision or reading error. Pick one repeated leak, study the smallest source that fixes it, then use fresh questions to prove improvement. This turns a score into a study plan rather than an emotional verdict.",
        ],
      },
    ],
    takeaway: "NEET preparation becomes manageable when each chapter ends in recall, questions and a planned retest—not just completed notes.",
    sourceLinks: [
      { label: "NEET UG 2026 information bulletin", href: "https://neet.nta.nic.in/admission-bulletin/" },
      { label: "Official NEET UG 2026 syllabus", href: "https://nta.ac.in/Download/Notice/Notice_20260108180635.pdf" },
      { label: "NEET official notices and documents", href: "https://neet.nta.nic.in/documents/" },
    ],
  },
  {
    slug: "delhi-police-constable-preparation-guide",
    examSlug: "delhi-police-constable",
    title: "Delhi Police Constable preparation: build marks across all four sections",
    description: "A practical, official-source-first preparation guide for Delhi Police Constable: General Knowledge, Reasoning, Numerical Ability and Computer Fundamentals.",
    eyebrow: "Delhi Police Constable study guide",
    readTime: "7 min read",
    publishedAt: "25 August 2026",
    sections: [
      {
        heading: "Begin with the current notice, then make four small score plans",
        paragraphs: [
          "Delhi Police recruitment details can change between cycles: vacancies, eligibility, physical stages, dates and instructions must come from the Staff Selection Commission and Delhi Police recruitment portals. Check those sources before relying on a coaching post or a forwarded message.",
          "The 2025 SSC Constable (Executive) CBE used 100 questions in 90 minutes: 50 General Knowledge/Current Affairs, 25 Reasoning, 15 Numerical Ability and 10 Computer Fundamentals, with −0.25 for a wrong answer. Use that only as a preparation reference until the next official notice is published. A score leak in one section should lead to a small repair in that section, not a random restart of the full syllabus.",
        ],
      },
      {
        heading: "Use a simple daily cycle: learn, practise, check, return",
        paragraphs: [
          "Start with one focused concept block: for example, coding-decoding, percentage change, Indian polity fundamentals or computer memory. Then solve a short fresh set on exactly that idea. Do not call a topic finished because a video or a page of notes feels familiar; make it earn that label through questions.",
          "End the session by naming the reason behind each miss: concept not known, method applied incorrectly, time decision, or reading/click error. That note decides tomorrow's repair. Without it, practice turns into repeated guessing.",
        ],
      },
      {
        heading: "What each section needs from you",
        paragraphs: [
          "General Knowledge needs small, repeated retrieval instead of one endless current-affairs feed. Reasoning improves when you name the pattern before checking an option. Numerical Ability needs a reliable setup before a timer. Computer Fundamentals needs short recall prompts for terms, functions and distinctions—not only recognition when an option appears.",
        ],
        bullets: [
          "GK: keep a bounded source and turn facts into short recall prompts.",
          "Reasoning: draw or label the condition before jumping to an option.",
          "Numerical Ability: learn the route, then practise a short timed set.",
          "Computer: make contrast cards such as RAM vs ROM, input vs output, and hardware vs software.",
        ],
      },
      {
        heading: "Three mistakes that waste a Delhi Police aspirant's time",
        paragraphs: [
          "These are learning-process mistakes, not official SSC findings. First, giving all four sections the same time even when one is repeatedly losing accuracy. Second, treating every incorrect answer as a careless mistake instead of identifying the exact broken step. Third, waiting for a full mock to find a weakness when a ten-question focused check can reveal it sooner.",
          "A better move is to take a short subject baseline, choose one repeated weakness, repair it, and retest it with unseen questions within three days. That gives every hour a purpose and makes improvement visible.",
        ],
      },
    ],
    takeaway: "A good Delhi Police plan is not more material. It is four small score systems, each with a clear next repair.",
    sourceLinks: [
      { label: "SSC Delhi Police Constable (Executive) 2025 notice", href: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_DPCE_2025.pdf" },
      { label: "Delhi Police recruitment portal", href: "https://delhipolice.gov.in/recruitments" },
    ],
  },
  {
    slug: "uppsc-ro-aro-preparation-foundation",
    examSlug: "uppsc-ro-aro",
    title: "UPPSC RO / ARO preparation: build a foundation before the next notice",
    description: "A grounded starting route for UPPSC RO / ARO aspirants: how to use official documents, build Hindi and General Studies depth, and practise with evidence instead of a generic timetable.",
    eyebrow: "UPPSC RO / ARO study guide",
    readTime: "7 min read",
    publishedAt: "28 August 2026",
    sections: [
      {
        heading: "Start with official documents, not a forwarded syllabus image",
        paragraphs: [
          "UPPSC publishes notices, calendars and previous-question-paper records on its own portal. Recruitment dates, eligibility, stages and the exact scheme can change between cycles, so treat an official notice as the source of truth before making an exam-day or application decision.",
          "The older UPPSC RO/ARO records are still useful as preparation evidence. They show why Hindi, General Studies, drafting or writing-related work and careful language practice deserve deliberate attention. They do not give anyone permission to assume that a future notification will be identical.",
        ],
      },
      {
        heading: "Build four working buckets instead of one giant plan",
        paragraphs: [
          "For the ExamGrind foundation route, work in four small buckets: Hindi and language precision, General Studies recall, computer or office skills, and reasoning. The route is a practical study framework, not a claim about the next official examination pattern.",
          "Give each block a clear job. A Hindi session might be one grammar distinction plus ten fresh examples. A General Studies session might be one topic map followed by recall prompts. Computer work should contrast terms and actions. Reasoning should make you write the condition before choosing an option.",
        ],
        bullets: [
          "Hindi: practise the exact rule, then write or choose fresh examples.",
          "General Studies: turn facts into small recall prompts and revisit them.",
          "Computer and office skills: learn useful contrasts, workflows and vocabulary—not just recognition.",
          "Reasoning: draw, label or sequence the condition before you look for an answer.",
        ],
      },
      {
        heading: "Use a short baseline before choosing what to study most",
        paragraphs: [
          "Do not decide you are weak at an entire subject because one session felt difficult. Take a short baseline in each active bucket. Mark each miss as one of four reasons: the idea was unknown, the method was applied incorrectly, time ran out, or the question was read carelessly.",
          "Choose the repeated reason that costs the most accuracy, repair the smallest idea behind it, then retest with unseen questions within three days. That is how a study plan begins to respond to you instead of becoming another list you cannot finish.",
        ],
      },
      {
        heading: "What to do while you wait for a notification",
        paragraphs: [
          "Keep your preparation portable. Maintain a small Hindi error notebook, a recall-based General Studies review habit, and a weekly timed check. When the next official notice arrives, map its published scheme onto this foundation rather than restarting from zero.",
        ],
      },
    ],
    takeaway: "Use the official notice to verify the exam. Use short attempts to decide what deserves today’s study time.",
    sourceLinks: [
      { label: "UPPSC official portal and notice board", href: "https://uppsc.up.nic.in/" },
      { label: "UPPSC previous question-paper desk", href: "https://uppsc.pariksha.nic.in/OuterPages/PreQuesPapers.aspx?ID=PrevQues" },
      { label: "UPPSC official sample papers and records", href: "https://uppsc.up.nic.in/SampleCopy/Complete_Sample_Copy3.pdf" },
    ],
  },
  {
    slug: "up-secretariat-ro-aro-preparation-foundation",
    examSlug: "up-secretariat-ro-aro",
    title: "UP Secretariat RO / ARO preparation: a practical foundation that survives changing notices",
    description: "Build useful Hindi, General Studies, computer and reasoning habits now—then verify the exact scheme against the next official UPPSC notice before acting on it.",
    eyebrow: "UP Secretariat RO / ARO study guide",
    readTime: "7 min read",
    publishedAt: "28 August 2026",
    sections: [
      {
        heading: "Keep preparation separate from notification claims",
        paragraphs: [
          "UP Secretariat Review Officer / Assistant Review Officer preparation is often discussed under the Samiksha Adhikari / Sahayak Samiksha Adhikari route. Official UPPSC pages are where you should verify the recruitment title, eligibility, dates and scheme for the cycle you intend to take.",
          "That verification habit matters. A previous-cycle paper can help you understand the kind of discipline the role rewards, but it cannot safely be presented as a promise of what a future recruitment will ask.",
        ],
      },
      {
        heading: "Prepare for useful office and language work, one skill at a time",
        paragraphs: [
          "The strongest foundation is not a long list of videos. It is a sequence of small, testable skills: precise Hindi usage, active General Studies recall, familiar computer and office concepts, and structured reasoning. Learn one, practise it in fresh questions, note the failure type, and return after a short gap.",
          "For language work, keep an error log with the rule and one correct example. For General Studies, use short prompts rather than rereading a large notebook. For computer or office skills, compare close terms and name what each tool or action is for. For reasoning, make your working visible before committing to an option.",
        ],
      },
      {
        heading: "Make your first week measurable",
        paragraphs: [
          "Choose one focused check in each foundation bucket. After every set, record whether the missed question was a knowledge gap, an application error, a time problem or a reading error. The label matters because the repair should be different: relearn a missing idea, write a method step, practise a faster route or slow down the reading routine.",
          "By the end of the week, you should have one priority to repair and one strength to maintain—not a vague decision to ‘study more’. Retest the repair with new questions while the lesson is still fresh enough to learn from.",
        ],
      },
      {
        heading: "When the official notice arrives",
        paragraphs: [
          "Read the official document before changing your timetable. Confirm the applicable posts, conditions, papers, timings and instructions, then use your existing foundation to set the order of practice. A calm, evidence-based reset is faster than reacting to a rumour or rebuilding from scratch.",
        ],
      },
    ],
    takeaway: "The best early preparation is portable: clear language habits, active recall, visible methods and a record of what actually needs repair.",
    sourceLinks: [
      { label: "UPPSC official portal and notice board", href: "https://uppsc.up.nic.in/" },
      { label: "UPPSC previous question-paper desk", href: "https://uppsc.pariksha.nic.in/OuterPages/PreQuesPapers.aspx?ID=PrevQues" },
      { label: "UPPSC official candidate records", href: "https://uppsc.up.nic.in/Default.aspx" },
    ],
  },
  {
    slug: "uppsc-pcs-preparation-foundation",
    examSlug: "uppsc-pcs",
    title: "UPPSC PCS preparation: build a strong foundation without guessing the next notice",
    description: "Use General Studies, CSAT and Uttar Pradesh context to build a practical PCS routine—then verify dates, eligibility and the exact scheme from UPPSC before acting on them.",
    eyebrow: "UPPSC PCS study guide",
    readTime: "7 min read",
    publishedAt: "28 August 2026",
    sections: [
      {
        heading: "Start with the official source. Build your preparation around skills that travel.",
        paragraphs: [
          "UPPSC is the source of truth for a current PCS notification, eligibility, dates, papers and instructions. A previous paper is useful evidence for practice, but it is not a promise that a later cycle will be identical.",
          "That does not mean you must wait to begin. General Studies recall, reading comprehension, clear reasoning and Uttar Pradesh context are durable preparation habits. Build them now; when the official notice is available, map its exact scheme onto work you have already done.",
        ],
      },
      {
        heading: "Use three lanes instead of a long, fragile timetable",
        paragraphs: [
          "Keep each study session simple: one General Studies idea, one CSAT skill and one short Uttar Pradesh-context review. This lets you make progress across the route without treating every subject as an all-day task.",
        ],
        bullets: [
          "General Studies: learn one narrow idea, then recall it from a blank page before checking notes.",
          "CSAT skills: write the first condition or calculation step before looking at options; this reveals whether the error is method, reading or time.",
          "Uttar Pradesh context: connect a fact to a place, river, institution, historical event or current issue, then revisit it with a short prompt later.",
        ],
      },
      {
        heading: "After every practice set, label the reason—not just the score",
        paragraphs: [
          "A wrong answer can mean four different things: the idea was unfamiliar, the method was applied incorrectly, the route was too slow, or the question was read carelessly. Give each type a different repair. Relearning a missing idea is not the same job as practising a faster method.",
          "At the end of a set, choose one repair small enough to complete today. For example: revise Directive Principles for fifteen minutes, solve five fresh questions, and retest tomorrow. That is much more useful than writing ‘revise polity’ in a planner.",
        ],
      },
      {
        heading: "Retest before moving on",
        paragraphs: [
          "A concept is not repaired because you recognised its solution. Use fresh questions after a short gap. If the same error returns, find the exact decision point that is still failing; if it improves, move the topic into revision rather than restarting the whole chapter.",
          "This is the loop that keeps preparation honest: learn, practise, diagnose, repair and retest. It gives a study plan evidence instead of optimism.",
        ],
      },
    ],
    takeaway: "Build portable foundations now. Let the official UPPSC notice decide the final scheme—not rumours, old screenshots or generic timetables.",
    sourceLinks: [
      { label: "UPPSC official notification board", href: "https://uppsc.up.nic.in/Default.aspx/CandidatePages/Notifications.aspx" },
      { label: "UPPSC previous question-paper desk", href: "https://uppsc.pariksha.nic.in/OuterPages/PreQuesPapers.aspx?ID=PrevQues" },
    ],
  },
  {
    slug: "delhi-police-constable-four-section-week",
    examSlug: "delhi-police-constable",
    title: "A Delhi Police Constable weekly plan: what to do across all four sections",
    description: "A practical seven-day routine for Delhi Police Constable preparation: use short section checks, repair repeated errors, and avoid an all-day generic timetable.",
    eyebrow: "Delhi Police Constable study guide",
    readTime: "6 min read",
    publishedAt: "5 September 2026",
    sections: [
      {
        heading: "Do not give every section the same kind of study time",
        paragraphs: [
          "Delhi Police preparation becomes messy when General Knowledge, Reasoning, Numerical Ability and Computer Awareness are treated as one enormous subject. They need different work: General Knowledge needs bounded recall, Reasoning needs visible conditions, Numerical Ability needs a reliable method, and Computer Awareness needs clear distinctions between close terms.",
          "Use the current SSC notice to verify the actual cycle, dates and scheme. The routine below is a preparation method, not a claim about the next recruitment paper.",
        ],
      },
      {
        heading: "A simple seven-day rotation",
        paragraphs: [
          "Day 1: take a short mixed baseline and label each miss. Day 2: repair one reasoning pattern with fresh questions. Day 3: learn one arithmetic route, then solve a short timed set. Day 4: make and recall a small Computer Awareness contrast set. Day 5: revise a bounded GK theme and test yourself without notes. Day 6: take a mixed check. Day 7: retest the one weakness that returned most often.",
          "The order is less important than the loop: learn one small idea, practise it, name the reason behind errors, and return with unseen questions. A chapter is not complete because its notes look familiar.",
        ],
        bullets: [
          "GK/Current Affairs: use short prompts and recall before checking the answer.",
          "Reasoning: sketch, label or sequence the condition before evaluating options.",
          "Numerical Ability: write the setup first; speed is a result of a dependable route.",
          "Computer Awareness: compare pairs such as RAM/ROM, browser/search engine and input/output.",
        ],
      },
      {
        heading: "Let a short check decide tomorrow",
        paragraphs: [
          "After any set, separate an unknown concept from a method error, a slow route and a reading error. Only repeated losses deserve the first repair. For example, if percentage questions are correct but slow, do not restart arithmetic; practise choosing the fastest setup under a time cap.",
          "That is why a focused diagnosis is useful: it gives you a place to begin without pretending five questions are a final verdict on your preparation.",
        ],
      },
    ],
    takeaway: "Four sections do not require four giant timetables. They require four small, repeatable score systems.",
    sourceLinks: [
      { label: "Staff Selection Commission official portal", href: "https://ssc.gov.in/" },
      { label: "Delhi Police recruitment portal", href: "https://delhipolice.gov.in/recruitments" },
    ],
  },
  {
    slug: "uppsc-ro-aro-hindi-practice-system",
    examSlug: "uppsc-ro-aro",
    title: "UPPSC RO / ARO Hindi practice: turn rules into reliable answers",
    description: "A practical Hindi preparation system for UPPSC RO/ARO aspirants: learn a rule, create contrast examples, test it fresh, then preserve the mistake for revision.",
    eyebrow: "UPPSC RO / ARO study guide",
    readTime: "6 min read",
    publishedAt: "5 September 2026",
    sections: [
      {
        heading: "Hindi improves through decisions, not through rereading",
        paragraphs: [
          "A grammar or usage rule can feel obvious when you read it and still disappear when two close options appear in a question. The useful unit of study is therefore not a chapter label such as ‘व्याकरण’; it is one decision you can explain: why this spelling, sandhi, samas, sentence form or punctuation choice is correct and the nearby alternative is not.",
          "Treat current UPPSC recruitment information as a separate question. Verify the exact notice and paper scheme on the Commission’s official portal before relying on a previous cycle.",
        ],
      },
      {
        heading: "Use the rule → contrast → fresh check method",
        paragraphs: [
          "Pick one narrow rule. Write it in your own words, then make one correct and one deliberately incorrect example. State the exact clue that separates them. Solve five fresh examples without looking back at the note. If you miss one, record the broken decision rather than only the answer.",
          "The next day, begin with the error card before learning something new. A small error notebook becomes valuable only when it is repeatedly retrieved, not when it becomes a large collection of copied rules.",
        ],
        bullets: [
          "One rule per short session—not an entire grammar book.",
          "One contrast pair to reveal the decision point.",
          "Five fresh examples before you call the rule learned.",
          "One scheduled retest after a gap.",
        ],
      },
      {
        heading: "Keep the error label honest",
        paragraphs: [
          "If you knew the rule but rushed the option, the repair is a reading routine. If you could not identify the rule, the repair is a short explanation plus examples. If you knew the answer but changed it without evidence, the repair is an option-check rule. Different causes need different repairs.",
        ],
      },
    ],
    takeaway: "Language accuracy grows when every error becomes a small decision you can explain, test and revisit.",
    sourceLinks: [
      { label: "UPPSC official portal and notices", href: "https://uppsc.up.nic.in/" },
      { label: "UPPSC previous question-paper desk", href: "https://uppsc.pariksha.nic.in/OuterPages/PreQuesPapers.aspx?ID=PrevQues" },
    ],
  },
  {
    slug: "up-secretariat-ro-aro-computer-office-skills",
    examSlug: "up-secretariat-ro-aro",
    title: "UP Secretariat RO / ARO computer preparation: learn useful distinctions, not random facts",
    description: "A practical computer-and-office-skills study method for UP Secretariat RO/ARO aspirants: learn what tools do, compare close terms, and test with fresh examples.",
    eyebrow: "UP Secretariat RO / ARO study guide",
    readTime: "6 min read",
    publishedAt: "5 September 2026",
    sections: [
      {
        heading: "Computer questions reward precise contrasts",
        paragraphs: [
          "Computer Awareness is often studied as a pile of definitions. That creates recognition, not recall. A more useful route is to learn close pairs and explain the boundary: RAM versus ROM, hardware versus software, an operating system versus an application, a browser versus a search engine, or a file versus a folder.",
          "This guide is a durable foundation, not a substitute for the next official UPPSC notice. Check the issuing body for the applicable post, scheme and recruitment instructions.",
        ],
      },
      {
        heading: "Make every fact answer one useful question",
        paragraphs: [
          "For each term, write: what is it, what does it do, and what is it commonly confused with? Then create one small situation. For example: ‘A document needs to be stored temporarily while a program is running—what kind of memory is involved?’ Situations force you to use the idea instead of merely recognising a definition.",
          "Finish a session with five mixed prompts. Include old concepts beside new ones so your brain must choose between similar terms. The moment two definitions blur together is the moment to build a contrast card.",
        ],
        bullets: [
          "Define the term in plain language.",
          "Name the nearby term students confuse it with.",
          "Create one office or everyday computer situation.",
          "Retest it in a mixed set after a short gap.",
        ],
      },
      {
        heading: "Repair the exact confusion, not the whole chapter",
        paragraphs: [
          "If you repeatedly confuse input and output devices, repair that pair with examples. If you cannot tell a spreadsheet feature from a word-processing feature, repair that contrast. Restarting an entire ‘computer’ chapter for one close distinction wastes time and hides the real issue.",
        ],
      },
    ],
    takeaway: "Computer preparation becomes easier when every definition becomes a clear distinction and every distinction is tested in context.",
    sourceLinks: [
      { label: "UPPSC official portal and notices", href: "https://uppsc.up.nic.in/" },
      { label: "UPPSC previous question-paper desk", href: "https://uppsc.pariksha.nic.in/OuterPages/PreQuesPapers.aspx?ID=PrevQues" },
    ],
  },
  {
    slug: "delhi-police-constable-gk-current-affairs-method",
    examSlug: "delhi-police-constable",
    title: "Delhi Police GK and current affairs: study without drowning in updates",
    description: "A bounded General Knowledge and current-affairs method for Delhi Police Constable aspirants: choose a source, make recall prompts, and test what stays.",
    eyebrow: "Delhi Police Constable study guide",
    readTime: "6 min read",
    publishedAt: "6 September 2026",
    sections: [
      { heading: "A current-affairs feed is not a study plan", paragraphs: ["The easiest way to lose hours is to read every headline and call it preparation. Build a bounded desk instead: a small set of daily briefs, a weekly recap, and a place to turn recurring themes into questions. Your aim is recall under pressure, not familiarity with a scrolling feed.", "Static General Knowledge belongs in themed clusters: polity, history, geography, science and basic India awareness. A small cluster becomes useful only when you can answer a question without seeing the note first."] },
      { heading: "Use the context → fact → recall method", paragraphs: ["For each useful update, write one line of context, one exam-worthy fact and one question you could ask yourself later. For example, do not store only a scheme name; store what problem it addresses, which ministry or institution is involved, and the one distinction that makes it memorable.", "At the end of a week, test mixed prompts from older and newer notes. If a fact does not return, shorten the card or connect it to a place, institution, date or contrast. Rereading a long PDF is not the same as revising."] },
      { heading: "Do not mistake volume for coverage", paragraphs: ["One clean revision set that you can recall is more valuable than five unfinished current-affairs PDFs. Keep a list of gaps that appear in practice, then add only the material that closes those gaps. When a new SSC or Delhi Police notice is relevant, use the official source—not a forwarded screenshot—to check it."] },
    ],
    takeaway: "Current affairs should become short recall prompts with context—not an endless feed you never revisit.",
    sourceLinks: [{ label: "Staff Selection Commission official portal", href: "https://ssc.gov.in/" }, { label: "PIB official releases", href: "https://pib.gov.in/" }],
  },
  {
    slug: "delhi-police-constable-reasoning-quant-repair",
    examSlug: "delhi-police-constable",
    title: "Delhi Police Reasoning and Maths: repair the method before timing it",
    description: "A focused Delhi Police Constable practice method for Reasoning and Numerical Ability: identify the question family, write the first step, then earn speed.",
    eyebrow: "Delhi Police Constable study guide",
    readTime: "6 min read",
    publishedAt: "6 September 2026",
    sections: [
      { heading: "Name the question family before you solve", paragraphs: ["A series, a direction question and a percentage problem do not fail for the same reason. Before looking at options, name the family and write the first action: create a direction sketch, find the percentage base, build a small table, or identify the series rule. This makes the method visible before time pressure hides the error.", "If you cannot name the first action, you have found a concept gap. If you can name it but make the setup wrong, you have found an application gap. These need different repairs."] },
      { heading: "Practise in three passes", paragraphs: ["First pass: solve five fresh questions untimed and write the first step. Second pass: solve a similar short set with a reasonable cap. Third pass: mix the question family with other topics so you must recognise it yourself. Skipping straight to timing encourages guessing and makes a weak route feel like a speed problem.", "Keep one line for every repeat error: ‘I used the final value as the percentage base’ or ‘I reversed left and right after turning.’ A precise error note is a repair instruction."] },
      { heading: "A skip can be a good decision", paragraphs: ["Not every question belongs in your first pass. If your method is still long after a few seconds, mark it and protect time for questions with a clear entry route. Come back only after the rest of the set. Efficient attempts are built through choices, not panic."] },
    ],
    takeaway: "Speed appears after you recognise the question family and trust the first step—not before.",
    sourceLinks: [{ label: "Staff Selection Commission official portal", href: "https://ssc.gov.in/" }, { label: "Delhi Police recruitment portal", href: "https://delhipolice.gov.in/recruitments" }],
  },
  {
    slug: "uppsc-ro-aro-general-studies-revision",
    examSlug: "uppsc-ro-aro",
    title: "UPPSC RO / ARO General Studies: build recall, not a bigger notebook",
    description: "A practical General Studies revision method for UPPSC RO/ARO aspirants: organise themes, test recall, connect Uttar Pradesh context, and repair gaps quickly.",
    eyebrow: "UPPSC RO / ARO study guide",
    readTime: "7 min read",
    publishedAt: "6 September 2026",
    sections: [
      { heading: "General Studies needs a map before it needs more notes", paragraphs: ["History, polity, geography, science, economy and Uttar Pradesh context can become an endless list if every fact is stored separately. Begin with a small topic map. Each card should answer a relationship: what happened and why it mattered, what an institution does and how it differs from another, or how a place connects to a river, resource, event or policy.", "This keeps your revision useful even while you wait for a live notice. The Commission’s official notification determines the current examination requirements; your recall system should remain useful across cycles."] },
      { heading: "Retrieve before you reread", paragraphs: ["Close the source and ask yourself three questions: What is the core idea? What is one close confusion? What example or context proves I understand it? Then check what you missed. This is slower than highlighting once and much faster than rediscovering the same gap every month.", "Use mixed review. Pair an older polity prompt with a newer Uttar Pradesh prompt and a science distinction. Mixing teaches the brain to choose the right idea rather than recite notes in the order you wrote them."] },
      { heading: "Let practice decide your next topic", paragraphs: ["A low score in a broad subject does not mean ‘revise all GS.’ Look for the repeated cluster: constitutional bodies, UP geography, basic science or modern history. Repair the smallest useful unit and come back with unseen questions. This is how a large syllabus stays manageable."] },
    ],
    takeaway: "A General Studies notebook becomes valuable only when it turns into recall, comparison and a clear next repair.",
    sourceLinks: [{ label: "UPPSC official portal and notices", href: "https://uppsc.up.nic.in/" }, { label: "UPPSC previous question-paper desk", href: "https://uppsc.pariksha.nic.in/OuterPages/PreQuesPapers.aspx?ID=PrevQues" }],
  },
  {
    slug: "uppsc-ro-aro-reasoning-computer-practice",
    examSlug: "uppsc-ro-aro",
    title: "UPPSC RO / ARO reasoning and computer practice: make your method visible",
    description: "A practical way to build reasoning and computer confidence for UPPSC RO/ARO: expose the first step, learn close contrasts, and retest the exact confusion.",
    eyebrow: "UPPSC RO / ARO study guide",
    readTime: "6 min read",
    publishedAt: "6 September 2026",
    sections: [
      { heading: "Visible working beats familiar-looking options", paragraphs: ["In reasoning, write the condition before looking for an answer: arrange the people, mark the direction, build the relation chain or state the rule. In computer questions, state what the term does and which nearby term it is not. Both habits prevent a fast guess from being mistaken for understanding.", "The first step is your diagnostic tool. If it is missing, learn the concept. If it is wrong, use contrast examples. If it is right but slow, practise the same route with a cap."] },
      { heading: "Use contrast cards for close computer terms", paragraphs: ["A contrast card has two sides: RAM versus ROM, operating system versus application, browser versus search engine, or file versus folder. Add a tiny situation on the back so the card asks for a decision rather than a definition. Then test it among unrelated prompts.", "For reasoning, create a similar pair of questions with one important difference. Say why the second needs a different method. That small explanation is what transfers to unfamiliar questions."] },
      { heading: "Retest the same decision, not the same question", paragraphs: ["Do not replay a memorised question and call it improvement. Use a fresh question that demands the same first step or distinction. If you still hesitate, the concept needs another explanation; if you answer cleanly, move it into spaced revision."] },
    ],
    takeaway: "When the first step is visible, both reasoning and computer practice become easier to diagnose and improve.",
    sourceLinks: [{ label: "UPPSC official portal and notices", href: "https://uppsc.up.nic.in/" }, { label: "UPPSC previous question-paper desk", href: "https://uppsc.pariksha.nic.in/OuterPages/PreQuesPapers.aspx?ID=PrevQues" }],
  },
  {
    slug: "up-secretariat-ro-aro-hindi-error-log",
    examSlug: "up-secretariat-ro-aro",
    title: "UP Secretariat RO / ARO Hindi: build an error log you will actually revise",
    description: "A practical Hindi error-log system for UP Secretariat RO/ARO aspirants: capture the exact rule, create a contrast example, and revisit it before the mistake returns.",
    eyebrow: "UP Secretariat RO / ARO study guide",
    readTime: "6 min read",
    publishedAt: "6 September 2026",
    sections: [
      { heading: "An error log is not a list of wrong answers", paragraphs: ["Copying twenty wrong options teaches very little. A useful Hindi error log contains the decision you missed: the rule in plain language, one correct example, one tempting wrong example, and the clue that separates them. This turns a mistake into something you can use next time.", "Keep the system small. One page of repeat errors that you revisit is more useful than a full notebook you never open again."] },
      { heading: "The four-line repair", paragraphs: ["For each repeated error, write: 1) what I chose; 2) why it looked right; 3) the rule or clue I missed; 4) a new example I can solve tomorrow. Read the note once, cover it, and answer your own example. If the rule is still unclear, learn the smallest part again before adding more questions.", "Mix old cards with new ones every few sessions. An error that returns after a gap is the one that deserves a stronger memory anchor or more contrast practice."] },
      { heading: "Separate a rule gap from a reading slip", paragraphs: ["If the same grammar choice fails repeatedly, it is probably a knowledge or application gap. If you know the rule but ignore a word in the stem, use a reading check. Giving both errors the same label—‘careless’—stops you from repairing either one."] },
    ],
    takeaway: "The best error log preserves the decision that failed, then makes you prove the repair with a fresh example.",
    sourceLinks: [{ label: "UPPSC official portal and notices", href: "https://uppsc.up.nic.in/" }, { label: "UPPSC previous question-paper desk", href: "https://uppsc.pariksha.nic.in/OuterPages/PreQuesPapers.aspx?ID=PrevQues" }],
  },
  {
    slug: "up-secretariat-ro-aro-gs-reasoning-week",
    examSlug: "up-secretariat-ro-aro",
    title: "UP Secretariat RO / ARO: a weekly GS and reasoning preparation cycle",
    description: "A simple weekly study cycle for UP Secretariat RO/ARO aspirants: use active General Studies recall, visible reasoning methods, and a retest that proves progress.",
    eyebrow: "UP Secretariat RO / ARO study guide",
    readTime: "6 min read",
    publishedAt: "6 September 2026",
    sections: [
      { heading: "Use two lanes, not one giant syllabus", paragraphs: ["General Studies and reasoning ask for different kinds of work. General Studies needs recall, context and comparison. Reasoning needs visible conditions and a method you can repeat. Split your week into small blocks for each lane instead of waiting until you have time for an enormous session.", "This preparation rhythm is useful before a notification appears. The official UPPSC notice remains the place to confirm the current post, stages and scheme."] },
      { heading: "A repeatable week", paragraphs: ["On the first day, learn one GS cluster and one reasoning family. On the second, retrieve the GS material from a blank page and solve fresh reasoning questions. On the third, run a short mixed check. On the fourth, repair the repeated gap. On the fifth, revisit an older error log. On the sixth, do a new mixed set. On the seventh, retest the repair.", "Keep each session small enough to finish. Consistency comes from a plan that survives a busy day, not from a timetable that looks impressive on paper."] },
      { heading: "The retest tells you whether the week worked", paragraphs: ["If a GS fact disappears, reduce it to a smaller prompt and reconnect it to context. If a reasoning method is slow, identify the first step that still takes time. Use fresh questions for the retest. Repeating yesterday’s answers measures memory of the answer, not understanding of the method."] },
    ],
    takeaway: "A weekly cycle works when it ends with proof: a fresh retest of the exact gap you meant to repair.",
    sourceLinks: [{ label: "UPPSC official portal and notices", href: "https://uppsc.up.nic.in/" }, { label: "UPPSC previous question-paper desk", href: "https://uppsc.pariksha.nic.in/OuterPages/PreQuesPapers.aspx?ID=PrevQues" }],
  },
];

export function getStudyGuide(slug: string) {
  return studyGuides.find((guide) => guide.slug === slug);
}

export const examGuideMeta = {
  "ssc-cgl": { label: "SSC CGL", diagnosisHref: "/diagnose/ssc-cgl" },
  cuet: { label: "CUET UG", diagnosisHref: "/diagnose/cuet" },
  "neet-ug": { label: "NEET UG", diagnosisHref: "/diagnose/neet-ug" },
  "delhi-police-constable": { label: "Delhi Police Constable", diagnosisHref: "/diagnose/delhi-police-constable" },
  "uppsc-ro-aro": { label: "UPPSC RO / ARO", diagnosisHref: "/diagnose/uppsc-ro-aro" },
  "up-secretariat-ro-aro": { label: "UP Secretariat RO / ARO", diagnosisHref: "/diagnose/up-secretariat-ro-aro" },
  "uppsc-pcs": { label: "UPPSC PCS", diagnosisHref: "/diagnose/uppsc-pcs" },
} as const;
