-- Migration 013: Partner applications
--
-- The /partners landing page collects applications from coaching centres
-- that want to refer students. We need a place to put those before they
-- get approved as a real referral_partner.
--
-- Approach: separate `partner_applications` table for the inbound queue.
-- When an application is approved, we copy the relevant fields into
-- referral_partners with status='active' and a generated short code.
--
-- The inbound form is publicly POSTable (RLS allows insert from anon)
-- but never readable from the client — only the service role (server
-- API and Supabase dashboard) can read.
--
-- Run with: paste into Supabase SQL Editor
-- Reversibility: drop table partner_applications;

create table if not exists public.partner_applications (
  id              uuid primary key default gen_random_uuid(),
  centre_name     text not null,
  contact_name    text not null,
  contact_email   text not null,
  contact_phone   text not null,
  city            text not null,
  student_count   text,                                   -- free-text estimate
  exams_taught    text,                                   -- 'CUET, SSC CGL' etc.
  notes           text,
  utm_source      text,
  status          text not null default 'pending'
                  check (status in ('pending', 'contacted', 'approved', 'rejected')),
  reviewed_at     timestamptz,
  reviewer_notes  text,
  created_at      timestamptz not null default now(),
  ip_address      text                                    -- for spam triage
);

create index if not exists partner_applications_status_idx
  on public.partner_applications(status);
create index if not exists partner_applications_created_at_idx
  on public.partner_applications(created_at desc);

-- RLS: anyone can submit, only service role can read.
alter table public.partner_applications enable row level security;
drop policy if exists "Anyone can submit a partner application" on public.partner_applications;
create policy "Anyone can submit a partner application"
  on public.partner_applications for insert to anon, authenticated with check (true);
-- No select policy = no public reads. Service role bypasses RLS.

-- Verify with:
--   select status, count(*) from partner_applications group by status;
