-- Migration 038: production reliability hardening.
-- Apply after migration_037. Safe to re-run.

-- Webhook events are now marked processed only after all entitlement writes
-- succeed. A failed event remains retryable by Razorpay instead of being
-- incorrectly deduplicated after a partial failure.
alter table public.razorpay_webhook_events
  alter column processed_at drop not null,
  alter column processed_at drop default;

alter table public.razorpay_webhook_events
  add column if not exists last_error text;

create index if not exists razorpay_webhook_events_pending_idx
  on public.razorpay_webhook_events (event_id)
  where processed_at is null;

-- Atomic daily fair-use guard for expensive Sonnet Deep Dives. The RPC checks
-- auth.uid() itself and has no public table policy, so a client cannot modify
-- another user's counter or reset its own limit.
create table if not exists public.ai_usage_daily (
  user_id uuid not null references public.users(id) on delete cascade,
  usage_date date not null default current_date,
  deep_dive_runs integer not null default 0 check (deep_dive_runs >= 0),
  primary key (user_id, usage_date)
);

alter table public.ai_usage_daily enable row level security;

create or replace function public.consume_deep_dive_slot(
  p_user_id uuid,
  p_limit integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  next_count integer;
begin
  if auth.uid() is distinct from p_user_id then
    raise exception 'not allowed';
  end if;
  if p_limit < 1 then
    raise exception 'invalid limit';
  end if;

  insert into public.ai_usage_daily (user_id, usage_date, deep_dive_runs)
  values (p_user_id, current_date, 1)
  on conflict (user_id, usage_date) do update
    set deep_dive_runs = public.ai_usage_daily.deep_dive_runs + 1
    where public.ai_usage_daily.deep_dive_runs < p_limit
  returning deep_dive_runs into next_count;

  return next_count is not null;
end;
$$;

revoke all on function public.consume_deep_dive_slot(uuid, integer) from public;
grant execute on function public.consume_deep_dive_slot(uuid, integer) to authenticated;

