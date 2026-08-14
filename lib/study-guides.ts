export type StudyGuide = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  readTime: string;
  publishedAt: string;
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  takeaway: string;
};

export const studyGuides: StudyGuide[] = [
  {
    slug: "ssc-cgl-mock-test-analysis",
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
];

export function getStudyGuide(slug: string) {
  return studyGuides.find((guide) => guide.slug === slug);
}
