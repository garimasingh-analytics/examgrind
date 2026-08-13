-- Consent-based lifecycle email. Transactional mail (welcome, receipts) remains
-- separate; these rows are only eligible after a learner explicitly opts in.

create table if not exists public.email_preferences (
  user_id uuid primary key references public.users(id) on delete cascade,
  marketing_email_opt_in boolean not null default false,
  opted_in_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.email_lifecycle_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  email text not null,
  exam_slug text,
  template text not null check (template in ('first_topic', 'first_repair', 'weekly_direction')),
  scheduled_for timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'cancelled', 'skipped', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  sent_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, template)
);

create index if not exists email_lifecycle_due_idx
  on public.email_lifecycle_messages (status, scheduled_for)
  where status = 'pending';

alter table public.email_preferences enable row level security;
alter table public.email_lifecycle_messages enable row level security;

-- Preferences can be surfaced in the profile. Delivery rows remain server-only
-- so a user cannot infer anything about another learner's email activity.
drop policy if exists "email_preferences_select_own" on public.email_preferences;
create policy "email_preferences_select_own"
  on public.email_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "email_preferences_insert_own" on public.email_preferences;
create policy "email_preferences_insert_own"
  on public.email_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "email_preferences_update_own" on public.email_preferences;
create policy "email_preferences_update_own"
  on public.email_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

comment on table public.email_preferences is 'Explicit consent for non-transactional ExamGrind email.';
comment on table public.email_lifecycle_messages is 'Server-managed, behaviour-aware lifecycle email queue.';

notify pgrst, 'reload schema';
