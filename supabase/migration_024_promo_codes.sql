-- Migration 024 — Promo code redemption + expand chick variants
--
-- Expands the selected_chick CHECK constraint to allow the 4 new macho
-- variants (ninja/dragon/cyber/warrior) and the 3 code-only rares
-- (cosmic/squad/phoenix). Adds promo_codes + user_chick_unlocks tables.

-- 1. Expand CHECK constraint on users.selected_chick
do $$
declare c text;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.users'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%selected_chick%'
  loop
    execute format('alter table public.users drop constraint %I', c);
  end loop;
end $$;

alter table public.users
  add constraint users_selected_chick_check
  check (selected_chick in (
    'classic', 'scholar', 'ninja', 'bookworm', 'dragon', 'doctor',
    'cyber', 'police', 'warrior', 'royal',
    'cosmic', 'squad', 'phoenix'
  ));

-- 2. Promo codes table
create table if not exists public.promo_codes (
  code              text primary key,
  grants_chick      text not null
                    check (grants_chick in ('cosmic', 'squad', 'phoenix')),
  description       text,
  max_redemptions   integer,        -- null = unlimited
  redemption_count  integer not null default 0,
  active            boolean not null default true,
  created_at        timestamptz not null default now(),
  expires_at        timestamptz
);

comment on table public.promo_codes is
  'Marketing/referral codes that unlock code-only chicks. Mint via /api/admin/promo. Redeem via /api/promo/redeem.';

-- 3. Per-user explicit unlocks (one row per user × chick pair)
create table if not exists public.user_chick_unlocks (
  user_id      uuid not null references public.users(id) on delete cascade,
  chick        text not null,
  source       text not null,  -- 'promo:<code>' or 'referral:<friend_id>'
  unlocked_at  timestamptz not null default now(),
  primary key (user_id, chick)
);

create index if not exists user_chick_unlocks_user_idx
  on public.user_chick_unlocks (user_id);

alter table public.user_chick_unlocks enable row level security;

create policy "users_read_own_unlocks"
  on public.user_chick_unlocks for select
  using (auth.uid() = user_id);

-- (writes go through service-role admin client; no insert policy needed)

-- 4. Seed three launch promo codes
insert into public.promo_codes (code, grants_chick, description, max_redemptions, active)
values
  ('LAUNCH100',    'cosmic',  'First 100 IG followers @ launch — Day 1 contest',     100,   true),
  ('NEWSLETTER',   'cosmic',  'Newsletter signup — unlimited but one per account',  null,  true),
  ('BETA5',        'phoenix', 'Beta testers — limited 5',                            5,     true),
  ('SQUADHERO',    'squad',   'Universal friend-referral code (manual issue)',       null,  true)
on conflict (code) do nothing;
