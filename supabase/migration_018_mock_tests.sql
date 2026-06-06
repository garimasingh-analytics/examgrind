-- =====================================================================
-- Migration 018 — Mock tests + per-feature freemium counters
-- Run once via Supabase SQL Editor (idempotent — safe to re-run).
-- =====================================================================
--
-- This migration adds the schema for full-length, timed, proctored-style
-- mock tests (NEET, CUET, SSC CGL etc.) plus the per-feature freemium
-- counters the new pricing model needs:
--
--   FREE TIER (cumulative, not per exam):
--     • 3 chapter quizzes
--     • 1 mock test
--     • 1 deep analysis
--
--   After any of these limits is hit, the user must upgrade.
--
-- Tables added:
--   public.mock_tests              — catalog of mock-test configs per exam
--   public.mock_attempts           — one row per user attempt (session)
--   public.mock_attempt_questions  — per-question state (answer, time, flag)
--
-- Columns added to public.users:
--   mock_tests_started   integer — bumps when user starts a mock
--   mock_tests_taken     integer — bumps when user submits a mock
--   analyses_started     integer — bumps when user starts an analysis
--
-- Existing columns reused:
--   public.users.quizzes_started   — already drives the 3-quiz gate
--   public.users.analyses_taken    — kept for stats; analyses_started is
--                                    the new gate (backfilled below)
--   public.questions.time_taken    — already records per-question seconds
--                                    on chapter quizzes (just needs UI
--                                    to actually populate it)


-- ---------------------------------------------------------------------
-- 1. Per-feature counters on public.users
-- ---------------------------------------------------------------------
alter table public.users
  add column if not exists mock_tests_started integer not null default 0,
  add column if not exists mock_tests_taken   integer not null default 0,
  add column if not exists analyses_started   integer not null default 0;

-- Backfill: an existing user who has already taken N analyses should
-- not suddenly be "out of free analysis". Mirror the started counter
-- to taken so the new gate is consistent with prior behaviour.
update public.users
   set analyses_started = analyses_taken
 where analyses_started = 0
   and analyses_taken   > 0;


-- ---------------------------------------------------------------------
-- 2. public.mock_tests — catalog of mock-test configurations.
--
-- Each row is a single mock the user can choose. For CUET (per-subject
-- format) we keep subject_id non-null. For NEET / SSC the mock is whole-
-- exam, so subject_id is null and the sections jsonb describes the
-- subject mix.
-- ---------------------------------------------------------------------
create table if not exists public.mock_tests (
  id                uuid primary key default gen_random_uuid(),
  exam_id           uuid not null references public.exams(id) on delete cascade,
  -- subjects.id is a text slug (e.g. 'physics'), not a uuid — see
  -- migration_002. Must match for the FK to be implementable.
  subject_id        text          references public.subjects(id) on delete set null,
  slug              text not null,                       -- e.g. 'neet-ug-full', 'cuet-physics', 'ssc-cgl-tier-1'
  display_name      text not null,                       -- e.g. 'NEET UG Full Mock'
  description       text,                                -- short blurb for the catalog card
  duration_seconds  integer not null,                    -- exam time limit (10800 = 3h)
  total_questions   integer not null,                    -- total number of Qs across all sections
  -- Real-exam scoring rules. Per-correct gain, per-wrong deduction.
  positive_marks    numeric not null default 1,
  negative_marks    numeric not null default 0,
  -- sections jsonb structure:
  --   [{ "name":"Physics", "questions":45, "subject_slug":"physics" }, ...]
  sections          jsonb not null default '[]'::jsonb,
  -- The very first mock the user sees inside an exam is free; further
  -- mocks count against the freemium gate.
  is_free_sample    boolean not null default false,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  unique (exam_id, slug)
);

create index if not exists mock_tests_exam_id_idx     on public.mock_tests(exam_id);
create index if not exists mock_tests_is_active_idx   on public.mock_tests(is_active) where is_active = true;


-- ---------------------------------------------------------------------
-- 3. public.mock_attempts — one row per user-test session.
--
-- Lifecycle: 'in_progress' → 'submitted' (normal finish) or 'abandoned'
-- (user closed the tab; cleanup job can sweep these later).
-- ---------------------------------------------------------------------
create table if not exists public.mock_attempts (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users(id) on delete cascade,
  mock_test_id        uuid not null references public.mock_tests(id) on delete cascade,
  started_at          timestamptz not null default now(),
  submitted_at        timestamptz,
  -- Total seconds the user actually spent inside the test (set on submit).
  -- Not the same as (submitted_at - started_at) because the user could
  -- have paused / lost focus; we sum per-question time instead.
  total_time_seconds  integer,
  -- Final score = positive_marks * correct - negative_marks * wrong.
  score               numeric,
  total_correct       integer,
  total_wrong         integer,
  total_unattempted   integer,
  -- Sectional breakdown (computed at submit):
  --   [{ "name":"Physics", "correct":40, "wrong":4,
  --      "unattempted":1, "score":159, "time_seconds":3500 }, ...]
  sectional_breakdown jsonb,
  status              text not null default 'in_progress'
                      check (status in ('in_progress','submitted','abandoned')),
  created_at          timestamptz not null default now()
);

create index if not exists mock_attempts_user_id_idx     on public.mock_attempts(user_id);
create index if not exists mock_attempts_mock_test_id_idx on public.mock_attempts(mock_test_id);
create index if not exists mock_attempts_status_idx       on public.mock_attempts(status);


-- ---------------------------------------------------------------------
-- 4. public.mock_attempt_questions — per-question state.
--
-- We persist the full question payload (text + options + correct) on
-- the attempt row because the questions are generated on demand at
-- start. That way the user can come back, the mock looks identical,
-- and we don't need to keep regenerating.
-- ---------------------------------------------------------------------
create table if not exists public.mock_attempt_questions (
  id                  uuid primary key default gen_random_uuid(),
  attempt_id          uuid not null references public.mock_attempts(id) on delete cascade,
  section_name        text not null,
  question_index      integer not null,                   -- 1..n within the attempt
  question_text       text not null,
  option_a            text not null,
  option_b            text not null,
  option_c            text not null,
  option_d            text not null,
  correct_answer      text not null check (correct_answer in ('A','B','C','D')),
  explanation         text,                               -- shown on results page
  user_answer         text          check (user_answer is null or user_answer in ('A','B','C','D')),
  time_spent_seconds  integer not null default 0,
  marked_for_review   boolean not null default false,
  created_at          timestamptz not null default now(),
  unique (attempt_id, question_index)
);

create index if not exists mock_attempt_questions_attempt_id_idx
  on public.mock_attempt_questions(attempt_id);


-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.mock_tests              enable row level security;
alter table public.mock_attempts           enable row level security;
alter table public.mock_attempt_questions  enable row level security;

-- mock_tests: catalog is public-readable (it's just config, no PII).
-- Writes happen only via service role (seed migration, /admin).
drop policy if exists "mock_tests select all" on public.mock_tests;
create policy "mock_tests select all"
  on public.mock_tests for select using (true);

-- mock_attempts: own only.
drop policy if exists "mock_attempts select own" on public.mock_attempts;
drop policy if exists "mock_attempts insert own" on public.mock_attempts;
drop policy if exists "mock_attempts update own" on public.mock_attempts;

create policy "mock_attempts select own"
  on public.mock_attempts for select using (auth.uid() = user_id);
create policy "mock_attempts insert own"
  on public.mock_attempts for insert with check (auth.uid() = user_id);
create policy "mock_attempts update own"
  on public.mock_attempts for update using (auth.uid() = user_id);

-- mock_attempt_questions: tied to the attempt's owner.
drop policy if exists "maq select via attempt" on public.mock_attempt_questions;
drop policy if exists "maq insert via attempt" on public.mock_attempt_questions;
drop policy if exists "maq update via attempt" on public.mock_attempt_questions;

create policy "maq select via attempt"
  on public.mock_attempt_questions for select
  using (exists (
    select 1 from public.mock_attempts a
    where a.id = mock_attempt_questions.attempt_id and a.user_id = auth.uid()
  ));
create policy "maq insert via attempt"
  on public.mock_attempt_questions for insert
  with check (exists (
    select 1 from public.mock_attempts a
    where a.id = mock_attempt_questions.attempt_id and a.user_id = auth.uid()
  ));
create policy "maq update via attempt"
  on public.mock_attempt_questions for update
  using (exists (
    select 1 from public.mock_attempts a
    where a.id = mock_attempt_questions.attempt_id and a.user_id = auth.uid()
  ));


-- =====================================================================
-- Done. After running this:
--   • Phase B (migration_019) will seed the actual mock_tests rows.
--   • Phase C will start hitting these tables from the new mock UI.
--   • Freemium gate now reads the 3 counters: quizzes_started,
--     mock_tests_started, analyses_started.
-- =====================================================================
