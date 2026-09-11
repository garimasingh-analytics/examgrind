-- Coach lessons are part of a learner's preparation record, not a temporary
-- chat transcript. Keep a compact, private history so a topic can be reopened
-- on another signed-in device.
create table if not exists public.coach_lesson_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_slug text not null,
  requested_topic text not null check (char_length(trim(requested_topic)) between 1 and 160),
  topic_id uuid references public.topics(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists coach_lesson_history_user_created_idx
  on public.coach_lesson_history (user_id, created_at desc);

alter table public.coach_lesson_history enable row level security;

drop policy if exists "Users read their own Coach lesson history" on public.coach_lesson_history;
create policy "Users read their own Coach lesson history"
  on public.coach_lesson_history for select using (auth.uid() = user_id);

drop policy if exists "Users insert their own Coach lesson history" on public.coach_lesson_history;
create policy "Users insert their own Coach lesson history"
  on public.coach_lesson_history for insert with check (auth.uid() = user_id);
