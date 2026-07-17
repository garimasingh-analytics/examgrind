-- =====================================================================
-- Migration 036 — Enable Row-Level Security (RLS) on all public tables
-- Fixes Supabase security warning: "RLS is disabled on public tables"
--
-- APPLIED to production 2026-07-16 via SQL editor. Result:
--   unprotected_tables_remaining = 0.
--
-- IMPORTANT: this file only enables RLS + adds policies for tables that
-- actually exist in the deployed database. Historical migration files
-- reference tables (user_progress, user_topic_mastery, user_cosmetics,
-- subjects, topics, story_arcs, story_nodes, cosmetics) that were never
-- deployed or were dropped later. Skipped here — add back if you ever
-- deploy those tables.
--
-- Server admin client (createAdminSupabase, lib/supabase/admin.ts) uses
-- service_role and bypasses RLS for all privileged writes.
-- =====================================================================


-- ---------------------------------------------------------------------
-- USER-DATA TABLES — owner-scoped policies (auth.uid() = user_id)
-- ---------------------------------------------------------------------

-- users (profile) — id references auth.users(id), so use id not user_id
alter table public.users enable row level security;

drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own" on public.users
  for insert with check (auth.uid() = id);


-- quizzes
alter table public.quizzes enable row level security;

drop policy if exists "quizzes_select_own" on public.quizzes;
create policy "quizzes_select_own" on public.quizzes
  for select using (auth.uid() = user_id);

drop policy if exists "quizzes_insert_own" on public.quizzes;
create policy "quizzes_insert_own" on public.quizzes
  for insert with check (auth.uid() = user_id);

drop policy if exists "quizzes_update_own" on public.quizzes;
create policy "quizzes_update_own" on public.quizzes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "quizzes_delete_own" on public.quizzes;
create policy "quizzes_delete_own" on public.quizzes
  for delete using (auth.uid() = user_id);


-- analyses — no direct user_id, joined via quizzes
alter table public.analyses enable row level security;

drop policy if exists "analyses_select_own" on public.analyses;
create policy "analyses_select_own" on public.analyses
  for select using (
    exists (
      select 1 from public.quizzes q
      where q.id = analyses.quiz_id
        and q.user_id = auth.uid()
    )
  );

drop policy if exists "analyses_insert_own" on public.analyses;
create policy "analyses_insert_own" on public.analyses
  for insert with check (
    exists (
      select 1 from public.quizzes q
      where q.id = analyses.quiz_id
        and q.user_id = auth.uid()
    )
  );


-- mock_attempts
alter table public.mock_attempts enable row level security;

drop policy if exists "mock_attempts_select_own" on public.mock_attempts;
create policy "mock_attempts_select_own" on public.mock_attempts
  for select using (auth.uid() = user_id);

drop policy if exists "mock_attempts_insert_own" on public.mock_attempts;
create policy "mock_attempts_insert_own" on public.mock_attempts
  for insert with check (auth.uid() = user_id);

drop policy if exists "mock_attempts_update_own" on public.mock_attempts;
create policy "mock_attempts_update_own" on public.mock_attempts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- mock_attempt_questions — no direct user_id, joined via mock_attempts
alter table public.mock_attempt_questions enable row level security;

drop policy if exists "mock_attempt_questions_select_own" on public.mock_attempt_questions;
create policy "mock_attempt_questions_select_own" on public.mock_attempt_questions
  for select using (
    exists (
      select 1 from public.mock_attempts ma
      where ma.id = mock_attempt_questions.attempt_id
        and ma.user_id = auth.uid()
    )
  );

drop policy if exists "mock_attempt_questions_insert_own" on public.mock_attempt_questions;
create policy "mock_attempt_questions_insert_own" on public.mock_attempt_questions
  for insert with check (
    exists (
      select 1 from public.mock_attempts ma
      where ma.id = mock_attempt_questions.attempt_id
        and ma.user_id = auth.uid()
    )
  );

drop policy if exists "mock_attempt_questions_update_own" on public.mock_attempt_questions;
create policy "mock_attempt_questions_update_own" on public.mock_attempt_questions
  for update using (
    exists (
      select 1 from public.mock_attempts ma
      where ma.id = mock_attempt_questions.attempt_id
        and ma.user_id = auth.uid()
    )
  );


-- ---------------------------------------------------------------------
-- REFERENCE / CATALOG TABLES — public read, block writes for anon/authed
-- ---------------------------------------------------------------------

-- chapters
alter table public.chapters enable row level security;

drop policy if exists "chapters_public_read" on public.chapters;
create policy "chapters_public_read" on public.chapters
  for select using (true);


-- mock_tests
alter table public.mock_tests enable row level security;

drop policy if exists "mock_tests_public_read" on public.mock_tests;
create policy "mock_tests_public_read" on public.mock_tests
  for select using (true);


-- promo_codes — fully locked, only server admin client can access
alter table public.promo_codes enable row level security;
-- No policies → all client access blocked. Server admin bypasses RLS.


-- ---------------------------------------------------------------------
-- Sanity check (uncomment to verify)
-- ---------------------------------------------------------------------
-- select count(*) as unprotected_tables_remaining
--   from pg_tables
--   where schemaname='public' and rowsecurity=false;   -- expect 0
