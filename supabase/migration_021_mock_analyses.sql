-- Migration 021: Mock test Deep Analysis storage
--
-- Mirrors quiz_analyses (the chapter-quiz Deep Analysis cache) but keyed
-- by mock_attempt_id instead of quiz_id. Same JSONB shape, same caching
-- semantics — a mock attempt that's already been analyzed serves from
-- cache on re-view instead of burning Anthropic spend.
--
-- Why a separate table:
--   quiz_analyses.quiz_id has a FK + unique constraint on public.quizzes;
--   we can't generalize it without dropping that referential integrity.
--   Keeping the two tables parallel is also clearer in the schema diagram.

create table if not exists public.mock_analyses (
  id            uuid primary key default gen_random_uuid(),
  mock_attempt_id uuid not null references public.mock_attempts(id) on delete cascade,
  user_id       uuid not null references public.users(id) on delete cascade,
  analysis      jsonb not null,
  model         text not null,
  is_deep_dive  boolean not null default false,
  generated_at  timestamptz not null default now(),
  -- One analysis per attempt. Re-runs / deep-dive upgrades overwrite
  -- via upsert(onConflict: mock_attempt_id).
  unique (mock_attempt_id)
);

create index if not exists mock_analyses_user_id_idx
  on public.mock_analyses (user_id);

alter table public.mock_analyses enable row level security;

-- Owner-only read. Mock attempts are private, so are their analyses.
drop policy if exists "mock_analyses select own" on public.mock_analyses;
create policy "mock_analyses select own"
  on public.mock_analyses for select
  using (user_id = auth.uid());

-- Inserts + updates flow through the service-role admin client in the
-- API route, so we don't need a public insert/update policy.
