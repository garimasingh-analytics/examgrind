-- =====================================================================
-- Migration 020 — Per-question explanations on chapter quizzes
-- Idempotent: ADD COLUMN IF NOT EXISTS.
-- =====================================================================
--
-- Mock tests already store an `explanation` per question (see
-- mock_attempt_questions in migration_018). Chapter quizzes did not.
-- That meant the results page could show 'right vs wrong' but had no
-- way to tell the student *why* their pick was wrong — the single most
-- important thing for learning from a mistake.
--
-- This adds the column. Backfill is intentionally skipped: existing
-- quizzes will have null explanations and the UI will hide that block.
-- New quizzes generated after this migration will populate it via the
-- updated /api/quiz/start prompt.

alter table public.questions
  add column if not exists explanation text;

-- No backfill. Older quizzes pre-explanation just won't show the block.
