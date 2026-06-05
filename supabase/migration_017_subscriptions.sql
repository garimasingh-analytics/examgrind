-- Migration 017: Razorpay Subscriptions (UPI Autopay)
--
-- Replaces the one-tap monthly checkout with real auto-renew. The
-- subscription resource lives on Razorpay's side; we mirror it locally
-- so admin views and refund flows don't need a Razorpay API call.
--
-- Lifecycle (matches Razorpay's subscription states verbatim so the
-- webhook handler is a dumb map):
--   created     → user just clicked Subscribe, awaiting mandate auth
--   authenticated → mandate signed, first charge pending
--   active      → currently paid, auto-renewing
--   pending     → renewal payment attempted, awaiting bank confirmation
--   halted      → bank rejected renewal twice, subscription paused
--   cancelled   → user cancelled (cancel_at_cycle_end or immediate)
--   completed   → finished total billing cycles (we use a long horizon)
--   expired     → mandate revoked by user via UPI app
--
-- Run with: paste into Supabase SQL Editor.

-- 1) Track the subscription on the user --------------------------------
alter table public.users
  add column if not exists razorpay_subscription_id text,
  add column if not exists subscription_state       text;

create index if not exists users_razorpay_subscription_id_idx
  on public.users(razorpay_subscription_id);

-- 2) Subscriptions mirror table ---------------------------------------
create table if not exists public.subscriptions (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  razorpay_subscription_id text not null unique,
  razorpay_plan_id      text not null,
  state                 text not null default 'created'
                        check (state in (
                          'created','authenticated','active','pending',
                          'halted','cancelled','completed','expired'
                        )),
  current_start         timestamptz,           -- start of current billing cycle
  current_end           timestamptz,           -- end of current billing cycle
  charge_at             timestamptz,           -- next scheduled charge
  paid_count            int  not null default 0,
  remaining_count       int,                   -- null = unlimited
  cancel_at_cycle_end   boolean not null default false,
  notes                 jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_state_idx   on public.subscriptions(state);

-- 3) Auto-update updated_at -------------------------------------------
drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- 4) RLS — service role only ------------------------------------------
alter table public.subscriptions enable row level security;
-- No policies = no public access. We never let the client read this
-- directly; /me reads through the server with admin client.

-- 5) Webhook events log ------------------------------------------------
-- Razorpay can replay webhooks. We log every event with the X-Razorpay-
-- Event-Id for idempotency — if we see the same event id twice, we
-- skip the side-effects. Keeps payments + subscriptions clean during
-- network blips and Razorpay re-deliveries.
create table if not exists public.razorpay_webhook_events (
  id             uuid primary key default gen_random_uuid(),
  event_id       text unique,        -- X-Razorpay-Event-Id header
  event_type     text not null,
  payload        jsonb not null,
  processed_at   timestamptz not null default now()
);

create index if not exists razorpay_webhook_events_event_type_idx
  on public.razorpay_webhook_events(event_type);

alter table public.razorpay_webhook_events enable row level security;

-- Verify with:
--   select column_name from information_schema.columns
--    where table_name='users' and column_name like 'razorpay%';
--   select count(*) from subscriptions;
