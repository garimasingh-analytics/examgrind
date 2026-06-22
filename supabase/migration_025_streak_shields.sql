-- Migration 025 — Streak Insurance (XP-purchased shields that auto-protect streak)
--
-- Adds two columns to public.users:
--   streak_shields       — current count of unused shields (cap 3)
--   total_shields_used   — lifetime usage stat (for /me UI + analytics)
--
-- Economics (defined in lib/streak.ts, not the DB):
--   - Cost: 500 XP per shield (5 quizzes of 10Q each at 10 XP/correct, rough)
--   - Max held: 3 (prevents hoarding for indefinite streak protection)
--   - Auto-consume: when quiz/complete sees a 2+ day gap, debit 1 shield
--     and bump last_active_date to (today - 1 day) so the streak survives.
--   - Manual purchase: POST /api/streak/buy-shield debits XP + increments.
--
-- Optional log table for transparency on the /me page (and for future
-- "you saved your 7-day streak on Tue" UX). We log every PURCHASE and
-- every USE separately so the user can see their shield history.
--
-- Run with: paste into Supabase SQL Editor (Production).
-- Reversibility:
--   drop table if exists public.shield_events;
--   alter table public.users
--     drop column if exists streak_shields,
--     drop column if exists total_shields_used;

-- 1. Add columns to users -------------------------------------------------
alter table public.users
  add column if not exists streak_shields integer not null default 0
    check (streak_shields >= 0 and streak_shields <= 3);

alter table public.users
  add column if not exists total_shields_used integer not null default 0
    check (total_shields_used >= 0);

comment on column public.users.streak_shields is
  'XP-purchased shields available to auto-protect daily streak. Max 3.';
comment on column public.users.total_shields_used is
  'Lifetime count of shields auto-consumed by the streak sweep.';

-- 2. Audit log for purchases + usage --------------------------------------
create table if not exists public.shield_events (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  kind         text not null check (kind in ('purchase', 'auto_use')),
  xp_cost      integer,         -- non-null for purchase, null for auto_use
  shields_after integer not null,
  created_at   timestamptz not null default now()
);

create index if not exists shield_events_user_id_idx
  on public.shield_events(user_id, created_at desc);

comment on table public.shield_events is
  'Audit trail of streak-shield purchases and auto-consumptions for /me UI.';

-- 3. RLS — own rows only ---------------------------------------------------
alter table public.shield_events enable row level security;

drop policy if exists "shield_events read own" on public.shield_events;
create policy "shield_events read own"
  on public.shield_events for select
  using (user_id = auth.uid());

-- Writes go through service role (api routes), so no insert policy for end users.
