-- Migration 016: Nightly subscription sweep
--
-- Backstop for the lazy-downgrade logic in lib/subscription.ts. That
-- helper only fires when an expired user actually loads /home or /me.
-- This cron catches users who lapse and don't log in — keeps the admin
-- dashboard honest and avoids the "why is X still 'paid' three months
-- after expiry?" question.
--
-- Runs at 03:30 UTC daily (09:00 IST — a low-traffic hour for an
-- Indian student audience that's mostly asleep).
--
-- pg_cron is enabled on Supabase by default since 2024.

create extension if not exists pg_cron;

-- Unschedule any earlier version of the job so re-runs are idempotent.
do $$
begin
  if exists (select 1 from cron.job where jobname = 'examgrind_downgrade_expired') then
    perform cron.unschedule('examgrind_downgrade_expired');
  end if;
end;
$$;

select cron.schedule(
  'examgrind_downgrade_expired',
  '30 3 * * *',  -- 03:30 UTC daily
  $$
    update public.users
       set subscription_status = 'free'
     where subscription_status = 'paid'
       and paid_until is not null
       and paid_until < now();
  $$
);

-- Verify with:
--   select jobname, schedule, command from cron.job
--    where jobname = 'examgrind_downgrade_expired';
