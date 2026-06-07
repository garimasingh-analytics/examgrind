# ExamGrind

A warm, simple practice app for CUET UG. Pick a chapter, take a quiz, see what to revise — with AI-powered Deep Analysis on every answer.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + custom warm palette (Maxima-inspired)
- **Supabase** (Postgres + Google OAuth + Row Level Security)
- **Anthropic Claude** (Haiku 4.5 for question generation + Deep Analysis; Sonnet for Deep Dive)
- **Razorpay** for ₹199/month subscription (wiring in progress)

## Local dev

```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# ANTHROPIC_API_KEY, NEXT_PUBLIC_SITE_URL

npm install
npm run dev
```

Visit `http://localhost:3000`.

## Production deploy

Hosted on Vercel. Push to `main`, Vercel auto-deploys. Env vars live in
**Vercel → Project Settings → Environment Variables**.

## Key routes

- `/` — landing + Google sign-in
- `/home` — subject grid with mastery progress + freemium banner
- `/subject/[id]` — chapter list grouped by NCERT class
- `/chapter/[id]` — Duolingo-style winding topic path with mastery tiers
- `/topic/[id]` — question-count picker (5–25)
- `/quiz/[id]` — quiz runner with anti-cheat (correct answers stay server-side)
- `/results/[id]` — score + Deep Analysis (READ / WORK / PRACTICE per weakness)
- `/me` — profile, stats, streak, weakness map, plan & upgrade
- `/terms` `/privacy` `/refund` `/contact` — Razorpay-required legal pages

## Architecture notes

- **Quiz answers never leak to the client.** The runner only knows question text and option labels. Correctness is computed server-side at submission.
- **Deep Analysis** is cached per `quiz_id` in `quiz_analyses`. Free tier gets 1 analysis lifetime; paid tier unlimited; Deep Dive (Sonnet) paid-only.
- **Freemium gate** at `/api/quiz/start`: 3 lifetime quiz starts on free tier. Drill quizzes from Deep Analysis count too.
