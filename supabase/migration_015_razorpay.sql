-- Migration 015: Razorpay payment tracking
--
-- Adds the bare minimum we need on the users table to track that a paid
-- subscription is currently active and when it expires. Plus a dedicated
-- payments table for the full audit trail (every charge ever attempted,
-- including failures, refunds, and replays of the webhook).
--
-- The freemium gate already reads users.subscription_status; this
-- migration keeps that contract — we set subscription_status='paid'
-- and paid_until=now+30days on a successful payment, and a tiny daily
-- sweep job (or a check in /home) downgrades back to 'free' when
-- paid_until passes.
--
-- Run with: paste into Supabase SQL Editor.

-- 1) Add payment-tracking columns to users -----------------------------
alter table public.users
  add column if not exists paid_until            timestamptz,
  add column if not exists last_razorpay_payment text;

create index if not exists users_paid_until_idx on public.users(paid_until);

-- 2) Audit table for every payment attempt -----------------------------
-- We keep all attempts (success, failure, refund) so we can debug
-- billing disputes and partner-attribution claims without relying on
-- Razorpay's UI. payment_id is the canonical Razorpay ID; row id is
-- our own UUID so a single payment can have multiple rows if Razorpay
-- replays the webhook (we just upsert on payment_id).
create table if not exists public.payments (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  razorpay_order_id    text not null,
  razorpay_payment_id  text unique,                    -- null until paid
  razorpay_signature   text,                            -- captured at verify
  amount_paise         int  not null,                   -- ₹75 = 7500
  currency             text not null default 'INR',
  status               text not null default 'created'
                       check (status in (
                         'created',   -- order created, awaiting payment
                         'paid',      -- payment captured + verified
                         'failed',    -- Razorpay reported failure
                         'refunded'   -- we refunded (full or partial)
                       )),
  failure_reason       text,
  notes                jsonb not null default '{}'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists payments_user_id_idx     on public.payments(user_id);
create index if not exists payments_status_idx      on public.payments(status);
create index if not exists payments_created_at_idx  on public.payments(created_at desc);

-- 3) RLS: service role only ---------------------------------------------
-- Users should NEVER read or write the payments table directly. All
-- access goes through the server with the service-role client.
alter table public.payments enable row level security;
-- No policies = no public access.

-- 4) Auto-update updated_at on changes ----------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- Done. Verify with:
--   select column_name, data_type from information_schema.columns
--    where table_name='users' and column_name in ('paid_until','last_razorpay_payment');
--   select count(*) from payments;
