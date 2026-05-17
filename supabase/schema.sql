-- =====================================================================
-- CUET Quiz App — initial schema
-- Safe to run once on a fresh Supabase project.
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------
-- gen_random_uuid() is provided by pgcrypto, which Supabase enables by
-- default. This line is a no-op if it already exists.
create extension if not exists "pgcrypto";


-- ---------------------------------------------------------------------
-- Table: public.users  (app-level profile, 1:1 with auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.users (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null unique,
  exam_choice         text,                                -- e.g. 'CUET-UG', 'CUET-PG', or specific subject mix
  subscription_status text not null default 'free'
                      check (subscription_status in ('free', 'trial', 'paid')),
  quizzes_taken       integer not null default 0,
  analyses_taken      integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

comment on table public.users is 'App profile for each authenticated user. id mirrors auth.users.id.';


-- ---------------------------------------------------------------------
-- Table: public.quizzes
-- ---------------------------------------------------------------------
create table if not exists public.quizzes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  subject     text not null,
  topic       text,
  subtopic    text,
  created_at  timestamptz not null default now()
);

create index if not exists quizzes_user_id_idx on public.quizzes(user_id);
create index if not exists quizzes_created_at_idx on public.quizzes(created_at desc);


-- ---------------------------------------------------------------------
-- Table: public.questions
-- ---------------------------------------------------------------------
create table if not exists public.questions (
  id              uuid primary key default gen_random_uuid(),
  quiz_id         uuid not null references public.quizzes(id) on delete cascade,
  question_text   text not null,
  option_a        text not null,
  option_b        text not null,
  option_c        text not null,
  option_d        text not null,
  correct_answer  text not null check (correct_answer in ('A', 'B', 'C', 'D')),
  user_answer     text          check (user_answer is null or user_answer in ('A', 'B', 'C', 'D')),
  time_taken      integer,      -- seconds spent on this question; null until answered
  created_at      timestamptz not null default now()
);

create index if not exists questions_quiz_id_idx on public.questions(quiz_id);


-- ---------------------------------------------------------------------
-- Table: public.analyses
-- ---------------------------------------------------------------------
create table if not exists public.analyses (
  id                       uuid primary key default gen_random_uuid(),
  quiz_id                  uuid not null references public.quizzes(id) on delete cascade,
  overall_verdict          text,
  mistake_classifications  jsonb,    -- e.g. [{ "question_id": "...", "type": "conceptual" }, ...]
  weakness_map             jsonb,    -- e.g. { "topic": "Trigonometry", "score": 0.4 }
  recommendations          jsonb,    -- e.g. [{ "action": "...", "resource": "..." }]
  created_at               timestamptz not null default now()
);

create index if not exists analyses_quiz_id_idx on public.analyses(quiz_id);


-- =====================================================================
-- Row Level Security
-- Default-deny on every table; users can only see/touch their own rows.
-- =====================================================================

alter table public.users     enable row level security;
alter table public.quizzes   enable row level security;
alter table public.questions enable row level security;
alter table public.analyses  enable row level security;

-- ---- public.users ----------------------------------------------------
drop policy if exists "users select own"  on public.users;
drop policy if exists "users update own"  on public.users;

create policy "users select own"
  on public.users for select
  using (auth.uid() = id);

create policy "users update own"
  on public.users for update
  using (auth.uid() = id);

-- (No insert policy needed — rows are inserted by the trigger below
--  using the postgres role, which bypasses RLS.)

-- ---- public.quizzes --------------------------------------------------
drop policy if exists "quizzes select own"  on public.quizzes;
drop policy if exists "quizzes insert own"  on public.quizzes;
drop policy if exists "quizzes update own"  on public.quizzes;
drop policy if exists "quizzes delete own"  on public.quizzes;

create policy "quizzes select own"
  on public.quizzes for select using (auth.uid() = user_id);

create policy "quizzes insert own"
  on public.quizzes for insert with check (auth.uid() = user_id);

create policy "quizzes update own"
  on public.quizzes for update using (auth.uid() = user_id);

create policy "quizzes delete own"
  on public.quizzes for delete using (auth.uid() = user_id);

-- ---- public.questions (tied to the quiz's owner) --------------------
drop policy if exists "questions select via quiz"  on public.questions;
drop policy if exists "questions insert via quiz"  on public.questions;
drop policy if exists "questions update via quiz"  on public.questions;
drop policy if exists "questions delete via quiz"  on public.questions;

create policy "questions select via quiz"
  on public.questions for select
  using (exists (
    select 1 from public.quizzes q
    where q.id = questions.quiz_id and q.user_id = auth.uid()
  ));

create policy "questions insert via quiz"
  on public.questions for insert
  with check (exists (
    select 1 from public.quizzes q
    where q.id = questions.quiz_id and q.user_id = auth.uid()
  ));

create policy "questions update via quiz"
  on public.questions for update
  using (exists (
    select 1 from public.quizzes q
    where q.id = questions.quiz_id and q.user_id = auth.uid()
  ));

create policy "questions delete via quiz"
  on public.questions for delete
  using (exists (
    select 1 from public.quizzes q
    where q.id = questions.quiz_id and q.user_id = auth.uid()
  ));

-- ---- public.analyses (tied to the quiz's owner) ---------------------
drop policy if exists "analyses select via quiz"  on public.analyses;
drop policy if exists "analyses insert via quiz"  on public.analyses;
drop policy if exists "analyses update via quiz"  on public.analyses;
drop policy if exists "analyses delete via quiz"  on public.analyses;

create policy "analyses select via quiz"
  on public.analyses for select
  using (exists (
    select 1 from public.quizzes q
    where q.id = analyses.quiz_id and q.user_id = auth.uid()
  ));

create policy "analyses insert via quiz"
  on public.analyses for insert
  with check (exists (
    select 1 from public.quizzes q
    where q.id = analyses.quiz_id and q.user_id = auth.uid()
  ));

create policy "analyses update via quiz"
  on public.analyses for update
  using (exists (
    select 1 from public.quizzes q
    where q.id = analyses.quiz_id and q.user_id = auth.uid()
  ));

create policy "analyses delete via quiz"
  on public.analyses for delete
  using (exists (
    select 1 from public.quizzes q
    where q.id = analyses.quiz_id and q.user_id = auth.uid()
  ));


-- =====================================================================
-- Auto-create a profile row when a new auth user signs up
-- (Google sign-in lands in auth.users; this mirrors them into public.users)
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- =====================================================================
-- updated_at maintenance for public.users
-- =====================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists users_touch_updated_at on public.users;
create trigger users_touch_updated_at
  before update on public.users
  for each row execute procedure public.touch_updated_at();
