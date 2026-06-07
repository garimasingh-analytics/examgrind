-- Migration 022: Student feedback inbox
--
-- Stores every submission from the in-app feedback widget. We also fire
-- a Slack alert on insert (in the API route, not via trigger) so Garima
-- sees them realtime — but the DB row stays the searchable history.

create table if not exists public.feedbacks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.users(id) on delete set null,
  email        text,
  message      text not null,
  -- Useful breadcrumbs for triage: which page, which device.
  source_path  text,
  user_agent   text,
  status       text not null default 'open' check (status in ('open','triaged','closed')),
  created_at   timestamptz not null default now(),
  resolved_at  timestamptz
);

create index if not exists feedbacks_created_at_idx
  on public.feedbacks (created_at desc);
create index if not exists feedbacks_status_idx
  on public.feedbacks (status);

alter table public.feedbacks enable row level security;

-- Public insert — anyone, logged in or not, can submit feedback. Read /
-- update goes through service-role from the admin dashboard only.
drop policy if exists "feedbacks insert any" on public.feedbacks;
create policy "feedbacks insert any"
  on public.feedbacks for insert
  with check (true);
