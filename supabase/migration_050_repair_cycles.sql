-- Migration 050: connect a diagnosed weakness to its targeted repair quiz.
-- Source quiz + diagnosed concept -> one fresh repair quiz -> recorded result.

create table if not exists public.repair_cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  source_quiz_id uuid not null references public.quizzes(id) on delete cascade,
  repair_quiz_id uuid not null unique references public.quizzes(id) on delete cascade,
  concept text not null check (char_length(concept) between 1 and 180),
  evidence text not null default '' check (char_length(evidence) <= 600),
  severity text not null check (severity in ('high', 'medium', 'low')),
  status text not null default 'started' check (status in ('started', 'completed')),
  repair_correct integer check (repair_correct is null or repair_correct >= 0),
  repair_total integer check (repair_total is null or repair_total > 0),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists repair_cycles_user_created_idx
  on public.repair_cycles (user_id, created_at desc);
create index if not exists repair_cycles_source_quiz_idx
  on public.repair_cycles (source_quiz_id);

alter table public.repair_cycles enable row level security;

drop policy if exists "repair_cycles_select_own" on public.repair_cycles;
create policy "repair_cycles_select_own"
  on public.repair_cycles for select
  using (auth.uid() = user_id);
