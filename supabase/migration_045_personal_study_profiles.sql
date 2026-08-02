-- Migration 045: Per-exam personal study profiles
--
-- A student can prepare for more than one exam over time. Keep their chosen
-- subjects and goals attached to the exam rather than overwriting a global
-- profile whenever they switch the header's exam picker.

create table if not exists public.user_exam_preferences (
  user_id uuid not null references public.users(id) on delete cascade,
  exam_id uuid not null references public.exams(id) on delete cascade,
  selected_subject_ids text[] not null,
  target_exam_date date,
  target_score text,
  daily_study_minutes integer,
  onboarding_completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, exam_id),
  constraint user_exam_preferences_subjects_not_empty
    check (cardinality(selected_subject_ids) > 0),
  constraint user_exam_preferences_target_score_length
    check (target_score is null or char_length(target_score) <= 60),
  constraint user_exam_preferences_daily_minutes_range
    check (daily_study_minutes is null or daily_study_minutes between 15 and 600)
);

create index if not exists user_exam_preferences_exam_id_idx
  on public.user_exam_preferences(exam_id);

alter table public.user_exam_preferences enable row level security;

drop policy if exists "user_exam_preferences_select_own" on public.user_exam_preferences;
drop policy if exists "user_exam_preferences_insert_own" on public.user_exam_preferences;
drop policy if exists "user_exam_preferences_update_own" on public.user_exam_preferences;

create policy "user_exam_preferences_select_own"
  on public.user_exam_preferences for select
  using (auth.uid() = user_id);

create policy "user_exam_preferences_insert_own"
  on public.user_exam_preferences for insert
  with check (auth.uid() = user_id);

create policy "user_exam_preferences_update_own"
  on public.user_exam_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists user_exam_preferences_updated_at on public.user_exam_preferences;
create trigger user_exam_preferences_updated_at
  before update on public.user_exam_preferences
  for each row execute function public.set_updated_at();

comment on table public.user_exam_preferences is
  'Selected subjects and planning goals for a user within one exam.';
