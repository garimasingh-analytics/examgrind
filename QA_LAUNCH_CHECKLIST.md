# Pre-launch Quiz QA Checklist

**Goal:** Verify generated quiz quality per exam before flipping `waitlist → live`.

**How to test without making the exam public:** `/start/[slug]` works even while the homepage card still shows "waitlist". You just visit the URL directly — it flips your `users.exam_choice` and lands you on `/home` filtered to that exam.

---

## 🟢 Pre-flight (Vercel must be rebuilt)

- [ ] Wait ~60 seconds after the last push, then visit `https://<your-vercel-url>/` and hard-refresh (Cmd+Shift+R)
- [ ] Page title in the browser tab now says **"ExamGrind — AI-graded practice for CUET, SSC CGL & NEET UG"**
- [ ] Footer says **"AI-graded practice for India's biggest exams"** (not "Practice CUET")
- [ ] Hero CTA says **"Pick your exam ↓"** and scrolls to the exam-picker grid (no auto sign-in)

---

## 🟢 Account flow — CUET (regression check)

- [ ] Click **CUET UG** card → lands on `/start/cuet`
- [ ] If signed in: instant redirect to `/home`, header pill says **CUET UG**
- [ ] If signed out: focused sign-in card with "You picked / CUET UG" headline
- [ ] After sign-in: `/home` shows 41 CUET subjects (existing behavior)

---

## 🟡 SSC CGL — full path

1. **Switch exam**: visit `/start/ssc-cgl` (or click pill on `/me` → "SSC CGL")
2. **`/home` check**:
   - [ ] Header pill says **SSC CGL** (not CUET UG)
   - [ ] Subject grid shows exactly **4 subjects**: Quantitative Aptitude, General Intelligence & Reasoning, English Language & Comprehension, General Awareness
   - [ ] No CUET subjects bleeding through
3. **Quiz quality — pick these 5 chapters and run 5-question quizzes:**

| Subject | Chapter | What to look for |
|---|---|---|
| Quant | Percentages | Should be Indian context (₹, salaries, percentage gains/losses). Modal difficulty = one-step application. |
| Quant | Trigonometry | Should use standard SSC ratios (sin/cos/tan of 30°, 45°, 60°, 90°). No advanced calculus. |
| Reasoning | Blood Relations | Should be relationship-puzzle format. "Pointing to a photograph, A said..." style. |
| English | Spotting Errors | Should follow the SSC subject-verb-agreement / preposition / tense pattern. Should call out the error span. |
| GA | Indian Polity | Should be static-fact questions about the Constitution / Articles / Schedules. No half-baked current affairs. |

**Red flags** (means prompt needs tuning):
- Quant questions referencing "NCERT Class XX" → SSC students don't use NCERT
- Reasoning questions in passive academic voice (SSC reasoning is punchy, time-constrained)
- English using British literary register from the 1800s (SSC English is functional/journalistic)
- GA questions about overseas politics / world history (the Indian Polity chapter should stay India-only)

---

## 🟡 NEET UG — full path

1. **Switch exam**: visit `/start/neet-ug` (or `/me` → "NEET UG")
2. **`/home` check**:
   - [ ] Header pill says **NEET UG**
   - [ ] Subject grid shows exactly **3 subjects**: Physics, Chemistry, Biology
3. **Quiz quality — pick these 5 chapters and run 5-question quizzes:**

| Subject | Chapter | NCERT class | What to look for |
|---|---|---|---|
| Physics | Kinematics | 11 | SI units. 1-D and 2-D motion. Graphs (v-t, x-t). Standard NEET tropes. |
| Physics | Electromagnetic Induction and AC | 12 | Faraday's law, inductance, RLC circuits. Concept-heavy, not derivation-heavy. |
| Chemistry | Chemical Bonding & Molecular Structure | 11 | VSEPR, hybridisation, bond order, dipole moments. Plausible distractors from sibling concepts. |
| Chemistry | Aldehydes, Ketones & Carboxylic Acids | 12 | Named reactions (Cannizzaro, Aldol, Clemmensen). Standard NCERT examples. |
| Biology | Genetics and Evolution | 12 | NCERT vocabulary verbatim (esp. for Biology — NEET biology is line-by-line NCERT). |

**Red flags** (means prompt needs tuning):
- Physics questions requiring multi-page derivations (NEET is concept-heavy, not derivation-heavy)
- Chemistry questions citing JEE-style organic mechanisms (NEET organic is more recall + standard reactions)
- Biology questions in non-NCERT phrasing ("eukaryotic ribosomes" vs NCERT's "80S ribosomes")
- Any question referencing "CUET" or "for undergraduate aspirants" generally (should say NEET / medical aspirant)

---

## 🟡 Deep Analysis — both exams

After completing one quiz per exam:

- [ ] Click into the result page → click **"Get Deep Analysis"** (free tier gets 1 per account; you may need to clear `quizzes_started` / `analyses_taken` in DB for repeat testing)
- [ ] Verify the coach voice matches the exam:
   - CUET: NCERT references with section numbers
   - SSC CGL: References R.S. Aggarwal Quant / S.P. Bakshi English / Lucent GK (NOT NCERT)
   - NEET UG: NCERT references for Physics/Chemistry; line-by-line NCERT vocabulary for Biology
- [ ] No CUET-specific phrases bleeding into SSC/NEET analyses

---

## 🟢 Exam switching — round-trip

- [ ] On `/me`, click the **CUET UG** pill (active one should highlight cocoa-dark)
- [ ] Should land on `/home` with the CUET subject grid
- [ ] XP + streak preserved across the switch
- [ ] Click **SSC CGL** pill → confirms `/home` now SSC, XP unchanged

---

## 🔴 Stop-launch criteria

If any of these are true, do NOT flip `waitlist → live` until fixed:

- [ ] Factual errors in 2+ of the 10 sample quizzes
- [ ] Wrong difficulty band (e.g., SSC Quant generating JEE-level math)
- [ ] CUET-specific phrasing surfacing in non-CUET quizzes
- [ ] Deep Analysis citing NCERT for SSC CGL questions
- [ ] Subject filter not working (CUET subjects showing for SSC user)
- [ ] Exam switch losing XP / streak

---

## 🟢 Acceptance criteria

Ready to launch on July 1 if:

- [ ] All 10 sample quizzes look exam-appropriate
- [ ] Deep Analysis voice matches exam in all 2 tests
- [ ] Subject filter respected for all 3 exams
- [ ] No stray CUET references on landing / home / share / OG card
- [ ] Exam switching works clean both ways

---

## Notes from QA pass

(fill in as you go)

- [ ] CUET sanity: ____
- [ ] SSC CGL pass: ____
- [ ] NEET UG pass: ____
- [ ] Issues to fix before launch: ____
