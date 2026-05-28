-- Migration 006: Multi-exam pivot + partner referral program
--
-- 1. Adds `exams` table — CUET, SSC CGL, Banking, NEET UG, UPSC, State PSCs
-- 2. Adds exam_id to subjects (backfilled to CUET)
-- 3. Adds `waitlist_signups` for unreleased exams
-- 4. Adds `referral_partners` + `partner_referrals` for the 50/50 revenue
--    share model (replaces the abandoned B2B admin dashboard approach)
--
-- Run with: supabase db push  OR  paste into Supabase SQL Editor
--
-- Reversibility: drop the new tables and the exam_id column. Existing
-- queries that don't reference exam_id keep working — the column is
-- nullable to make the deploy zero-downtime.

-- 1. Exams table ----------------------------------------------------------
create table if not exists exams (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,        -- 'cuet', 'ssc-cgl', 'neet-ug'
  name          text not null,               -- Display name: 'CUET UG'
  status        text not null default 'waitlist'
                check (status in ('live', 'waitlist', 'coming_soon')),
  description   text,
  display_order int not null default 100,
  hero_color    text,                        -- Tailwind token: 'moss', 'ember', 'sun'
  created_at    timestamptz not null default now()
);

-- Seed the live + waitlist exams. ON CONFLICT so re-running is safe.
insert into exams (slug, name, status, description, display_order, hero_color) values
  ('cuet',         'CUET UG',          'live',         '12 subjects · Full NTA syllabus',           10, 'moss'),
  ('ssc-cgl',      'SSC CGL',          'waitlist',     'Quant · Reasoning · English · GA',          20, 'ember'),
  ('banking',      'IBPS PO / SBI PO', 'waitlist',     'Banking, insurance and RBI Grade B',        30, 'ember'),
  ('neet-ug',      'NEET UG',          'waitlist',     'Physics · Chemistry · Biology · NCERT',     40, 'ember'),
  ('upsc-prelims', 'UPSC Prelims',     'coming_soon',  'GS Paper 1 + CSAT · Year-round prep',       50, 'cocoa'),
  ('state-psc',    'State PSCs',       'coming_soon',  'UPPSC, BPSC, MPSC and more',                60, 'cocoa')
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  display_order = excluded.display_order,
  hero_color = excluded.hero_color;

-- 2. Link existing subjects → exam_id ------------------------------------
-- All current subjects belong to CUET. Nullable for safety so a stale
-- query without exam_id still returns rows during the rollout.
alter table subjects
  add column if not exists exam_id uuid references exams(id) on delete cascade;

update subjects
   set exam_id = (select id from exams where slug = 'cuet')
 where exam_id is null;

create index if not exists subjects_exam_id_idx on subjects(exam_id);

-- 3. Waitlist signups ----------------------------------------------------
create table if not exists waitlist_signups (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  exam_slug   text not null,
  source      text default 'homepage',
  created_at  timestamptz not null default now(),
  unique (email, exam_slug)
);

create index if not exists waitlist_signups_exam_slug_idx on waitlist_signups(exam_slug);
create index if not exists waitlist_signups_created_at_idx on waitlist_signups(created_at desc);

alter table waitlist_signups enable row level security;
drop policy if exists "Public can insert waitlist signups" on waitlist_signups;
create policy "Public can insert waitlist signups"
  on waitlist_signups for insert to anon, authenticated with check (true);

-- 4. Exams are publicly readable -----------------------------------------
alter table exams enable row level security;
drop policy if exists "Exams are public" on exams;
create policy "Exams are public"
  on exams for select to anon, authenticated using (true);

-- 5. Partner referral program --------------------------------------------
-- Replaces the abandoned B2B admin dashboard. Coaching centres get a
-- short referral code (e.g. 'NOIDA-RAVI'). Students who sign up via
-- ?ref=NOIDA-RAVI are attributed forever. We split the ₹75/mo 50/50
-- with the centre. No subscriptions, no contracts, no batches —
-- just a referral code per partner.
create table if not exists referral_partners (
  id                  uuid primary key default gen_random_uuid(),
  code                text unique not null,                  -- shareable: 'NOIDA-RAVI'
  name                text not null,                          -- "Ravi's Coaching Centre, Greater Noida"
  contact_email       text,
  contact_phone       text,
  city                text,
  revenue_share_pct   int not null default 50
                      check (revenue_share_pct between 0 and 100),
  payout_method       text,                                   -- 'upi', 'bank_transfer'
  payout_destination  text,                                   -- UPI ID or masked bank info
  status              text not null default 'active'
                      check (status in ('active', 'paused', 'terminated')),
  notes               text,
  created_at          timestamptz not null default now()
);

create index if not exists referral_partners_status_idx on referral_partners(status);

-- Each user can be attributed to at most one partner (first-touch).
-- Lifetime attribution: even if a student renews years later, the same
-- partner gets the cut. This makes the partner pitch incredibly simple:
-- "Anyone you bring earns you 50% forever as long as they pay us."
create table if not exists partner_referrals (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  partner_id   uuid not null references referral_partners(id),
  ref_code     text not null,                  -- denormalized for audit
  referred_at  timestamptz not null default now(),
  first_payment_at timestamptz                 -- set when user becomes paid
);

create index if not exists partner_referrals_partner_id_idx on partner_referrals(partner_id);

-- RLS: partners table is admin-only. Referrals are admin-only too.
-- The /partners landing page reads via service role.
alter table referral_partners enable row level security;
alter table partner_referrals enable row level security;
-- No policies = no public access. Service role bypasses RLS.

-- Seed a single test partner so we can verify the attribution flow
-- end-to-end before we onboard real coaching centres.
insert into referral_partners (code, name, city, revenue_share_pct, status, notes)
values ('TEST-DEMO', 'Test Demo Partner', 'Greater Noida', 50, 'active',
        'Internal QA partner — do not delete')
on conflict (code) do nothing;

-- Done. Verify with:
--   select slug, name, status from exams order by display_order;
--   select count(*) from subjects where exam_id is null;            -- expect 0
--   select code, name, revenue_share_pct from referral_partners;
