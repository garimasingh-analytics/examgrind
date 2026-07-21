-- Migration 037: make the chapter-quiz analysis cache reproducible.
--
-- The application has used public.quiz_analyses for a long time, but the
-- table was never captured in the repository migrations. That schema drift
-- made a clean environment unable to run Deep Analysis reliably.

create table if not exists public.quiz_analyses (
  id            uuid primary key default gen_random_uuid(),
  quiz_id       uuid not null references public.quizzes(id) on delete cascade,
  user_id       uuid not null references public.users(id) on delete cascade,
  analysis      jsonb not null,
  model         text not null,
  is_deep_dive  boolean not null default false,
  generated_at  timestamptz not null default now(),
  unique (quiz_id)
);

create index if not exists quiz_analyses_user_id_idx
  on public.quiz_analyses (user_id);

alter table public.quiz_analyses enable row level security;

drop policy if exists "quiz_analyses own" on public.quiz_analyses;

drop policy if exists "quiz_analyses select own" on public.quiz_analyses;
create policy "quiz_analyses select own"
  on public.quiz_analyses for select
  using (user_id = auth.uid());

drop policy if exists "quiz_analyses insert own" on public.quiz_analyses;
create policy "quiz_analyses insert own"
  on public.quiz_analyses for insert
  with check (user_id = auth.uid());

drop policy if exists "quiz_analyses update own" on public.quiz_analyses;
create policy "quiz_analyses update own"
  on public.quiz_analyses for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
