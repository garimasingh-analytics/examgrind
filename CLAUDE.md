# CUET Arena — Project Context for Claude

This file is loaded into every Claude session in this repo. It explains the
product, the CUET UG syllabus we anchor to, and the conventions for generating
quiz questions and analyses.

---

## Product

**CUET Arena** is a gamified, story-driven CUET prep app. Students pick a
chapter (e.g. Physics → Thermodynamics), play 8–15 question MCQ quizzes, earn
XP and coins, level up an avatar, and unlock cosmetics + story chapters in an
RPG framing inspired by Avatar: The Last Airbender. The world: **The Lost
Library of Nalanda**, where each subject is guarded by a Spirit.

**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind + Three.js (R3F)
on the frontend; Supabase (Postgres + Auth) on the backend; Anthropic SDK
(Claude) for question generation, explanation, and weakness analysis.

**Pricing:** ₹75/month subscription. Heavy AI features must be cost-disciplined
— prefer Claude Haiku 4.5 for routine explanations, reserve Sonnet 4.6 for
deep weakness analysis.

---

## CUET UG Syllabus — Reference

CUET UG = Common University Entrance Test for Undergraduate admissions in
India. Conducted by NTA. Three sections:

- **Section IA (Languages)** — 13 languages
- **Section II (Domain)** — 27 domain subjects, NCERT Class 11+12 syllabus
- **Section III (General Test)** — GK, current affairs, mental ability,
  numerical ability, logical & analytical reasoning, quantitative reasoning

We seed **all 37 subjects** that a CUET UG aspirant can choose. (Section IB's
20 additional languages can be added later if requested.)

### Subjects seeded (all 37)

**Section IA — 13 Languages**

| Slug | Name | CUET code |
|------|------|-----------|
| `english`   | English   | CUET-101 |
| `hindi`     | Hindi     | CUET-102 |
| `assamese`  | Assamese  | CUET-103 |
| `bengali`   | Bengali   | CUET-104 |
| `gujarati`  | Gujarati  | CUET-105 |
| `kannada`   | Kannada   | CUET-107 |
| `malayalam` | Malayalam | CUET-109 |
| `marathi`   | Marathi   | CUET-110 |
| `odia`      | Odia      | CUET-108 |
| `punjabi`   | Punjabi   | CUET-113 |
| `tamil`     | Tamil     | CUET-111 |
| `telugu`    | Telugu    | CUET-112 |
| `urdu`      | Urdu      | CUET-114 |

**Section II — 23 Domain subjects**

| Slug | Name | CUET code | NCERT |
|------|------|-----------|-------|
| `accountancy`           | Accountancy                              | 301-Acc | 11+12 |
| `agriculture`           | Agriculture                              | 302-Agr | 11+12 |
| `anthropology`          | Anthropology                             | 304     | 11+12 |
| `biology`               | Biology                                  | 303     | 11+12 |
| `business-studies`      | Business Studies                         | 305     | 11+12 |
| `chemistry`             | Chemistry                                | 302     | 11+12 |
| `computer-science`      | Computer Science / Informatics Practices | 306     | 11+12 |
| `economics`             | Economics / Business Economics           | 308     | 11+12 |
| `engineering-graphics`  | Engineering Graphics                     | 309     | 11+12 |
| `entrepreneurship`      | Entrepreneurship                         | 310     | 11+12 |
| `environmental-studies` | Environmental Studies                    | 311     | —     |
| `fine-arts`             | Fine Arts / Visual Arts                  | 312     | 11+12 |
| `geography`             | Geography / Geology                      | 313     | 11+12 |
| `history`               | History                                  | 314     | 11+12 |
| `home-science`          | Home Science                             | 315     | 11+12 |
| `knowledge-tradition`   | Knowledge Tradition & Practices of India | 316     | —     |
| `legal-studies`         | Legal Studies                            | 317     | 11+12 |
| `mass-media`            | Mass Media / Mass Communication          | 318     | 11+12 |
| `mathematics`           | Mathematics                              | 319     | 11+12 |
| `performing-arts`       | Performing Arts                          | 321     | —     |
| `physical-education`    | Physical Education / NCC / Yoga          | 322     | 11+12 |
| `physics`               | Physics                                  | 301     | 11+12 |
| `political-science`     | Political Science                        | 324     | 11+12 |
| `psychology`            | Psychology                               | 325     | 11+12 |
| `sanskrit`              | Sanskrit                                 | 326     | 11+12 |
| `sociology`             | Sociology                                | 327     | 11+12 |
| `teaching-aptitude`     | Teaching Aptitude                        | 328     | —     |

**Section III — General Test**

| Slug | Name | CUET code |
|------|------|-----------|
| `general` | General Test | CUET-501 |

Total: **37 subjects**, ~400+ chapters across the syllabus tree.

### Chapter structure (NCERT-aligned)

Chapter slugs mirror the official NCERT unit ordering. Examples:

- `physics/thermodynamics` (Class 11, Unit VIII)
- `physics/electrostatics` (Class 12, Unit I)
- `chemistry/atomic-structure` (Class 11, Unit II)
- `chemistry/coordination` (Class 12, Unit VIII)
- `mathematics/integrals` (Class 12, Unit VII)

Topics under each chapter follow NCERT subsection structure.

---

## Question Generation Conventions

When Claude generates a CUET-style MCQ, follow these rules:

1. **Format**: One question + exactly 4 options (A, B, C, D). Single correct
   answer. No "all of the above" or "none of the above" unless the chapter
   genuinely uses them (avoid as a default).
2. **Difficulty calibration** (return as `difficulty: 1|2|3`):
   - **1 (easy)** — Direct recall from NCERT. Definition, formula, basic
     example. ~70% of average students get it right.
   - **2 (medium)** — Conceptual application. One step of reasoning. ~50%.
   - **3 (hard)** — Multi-step / numerical / tricky distractors. ~25%.
3. **Stem clarity** — No ambiguity. Specify units. State all required values.
4. **Distractors** — Plausible wrong answers (common student errors,
   sign-flip, off-by-factor, conceptual confusions). Never gibberish.
5. **Length** — Stem under 60 words. Options under 20 words each.
6. **Indian context where natural** — Use rupees, Indian place names, Indian
   examples in word problems when subject-appropriate.
7. **Output schema** (always JSON):
   ```json
   {
     "question": "...",
     "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
     "correct": "B",
     "explanation": "1-2 sentence explanation referencing the relevant NCERT concept.",
     "difficulty": 2,
     "topic_slug": "first-law"
   }
   ```

---

## Weakness Analysis Conventions

When Claude analyzes a completed quiz, output:

```json
{
  "overall_verdict": "1-2 sentences in second person, warm but honest.",
  "mistake_classifications": [
    { "question_id": "...", "type": "conceptual" | "calculation" | "careless" | "knowledge_gap", "note": "..." }
  ],
  "weakness_map": [
    { "topic_slug": "first-law", "score": 0.4, "diagnosis": "..." }
  ],
  "recommendations": [
    { "action": "Re-read NCERT XI Ch 12 §12.4", "reason": "...", "priority": "high" }
  ]
}
```

Tone: encouraging, specific, never generic. Reference NCERT chapters/units
by name when recommending revision.

---

## Database Schema (current)

See `supabase/schema.sql` (initial) and `supabase/migration_002_quest_system.sql`
(quest system + syllabus). Key tables:

- `users` — profile + progression (xp, coins, level, house, avatar_config)
- `subjects`, `chapters`, `topics` — syllabus tree
- `quizzes`, `questions` — quiz data (questions linked to a chapter/topic)
- `user_topic_mastery` — per-topic XP and accuracy (the weakness map source)
- `cosmetics`, `user_cosmetics` — wardrobe system
- `story_arcs`, `story_nodes`, `user_progress` — narrative quest system
- `analyses` — Claude's deep analysis on completed quizzes

All user-owned tables have RLS policies restricting reads/writes to the
authenticated user.

---

## Brand voice

- **Warm but uncluttered.** Like a good tutor — never condescending, never
  cheerleading.
- **Indian, not generic.** "₹", "lakh", "crore", Indian names in examples.
- **Avatar TLA flavor in story copy** — "Scholar," "Spirit," "Hall," "Sage,"
  poetic but never purple. Two-three sentence beats, not paragraphs.
- **No emojis in serious copy** (analyses, explanations). Emojis OK as
  navigation icons / subject markers.
