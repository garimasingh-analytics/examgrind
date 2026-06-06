-- =====================================================================
-- Migration 019 — Seed mock_tests catalog rows
-- Idempotent: ON CONFLICT (exam_id, slug) DO NOTHING.
-- =====================================================================
--
-- Mock formats by exam (mirror the real exams as closely as possible):
--
--   NEET UG    1 full mock  | 180q   | 180 min | +4 / -1
--     Physics 45, Chemistry 45, Biology 90.
--
--   SSC CGL    1 Tier-1 mock | 100q  |  60 min | +2 / -0.5
--     Reasoning 25, GA 25, Quant 25, English 25.
--
--   CUET UG    1 mock per subject (real CUET runs each subject as a
--              separate timed slot)             | 50q  | 45 min | +5 / -1
--     One row per (exam=cuet, subject=<slug>).
--
-- The `sections` jsonb describes the subject mix; client uses this to
-- partition the question generation prompt + the in-test navigator.
--
-- All seeded mocks are marked is_free_sample=true so the catalog UI
-- can show a "Free" badge. The hard freemium gate still lives in
-- users.mock_tests_started (so the user's _first_ mock attempt of any
-- kind is free; the second one is paywalled).

-- ---------------------------------------------------------------------
-- 1. NEET UG full mock
-- ---------------------------------------------------------------------
insert into public.mock_tests
  (exam_id, subject_id, slug, display_name, description,
   duration_seconds, total_questions, positive_marks, negative_marks,
   sections, is_free_sample)
select
  e.id,
  null::text,
  'neet-ug-full',
  'NEET UG Full Mock',
  '180 questions across Physics, Chemistry, and Biology. Real NEET timing and scoring (+4 / -1).',
  10800,
  180,
  4,
  1,
  jsonb_build_array(
    jsonb_build_object('name','Physics',   'questions',45, 'subject_slug','physics'),
    jsonb_build_object('name','Chemistry', 'questions',45, 'subject_slug','chemistry'),
    jsonb_build_object('name','Biology',   'questions',90, 'subject_slug','biology')
  ),
  true
from public.exams e
where e.slug = 'neet-ug'
on conflict (exam_id, slug) do nothing;


-- ---------------------------------------------------------------------
-- 2. SSC CGL Tier 1 mock
-- ---------------------------------------------------------------------
insert into public.mock_tests
  (exam_id, subject_id, slug, display_name, description,
   duration_seconds, total_questions, positive_marks, negative_marks,
   sections, is_free_sample)
select
  e.id,
  null::text,
  'ssc-cgl-tier-1',
  'SSC CGL Tier 1 Mock',
  '100 questions in 60 minutes — General Intelligence, General Awareness, Quantitative Aptitude, English Comprehension. +2 / -0.5.',
  3600,
  100,
  2,
  0.5,
  jsonb_build_array(
    jsonb_build_object('name','General Intelligence & Reasoning', 'questions',25, 'subject_slug','reasoning'),
    jsonb_build_object('name','General Awareness',                'questions',25, 'subject_slug','general-awareness'),
    jsonb_build_object('name','Quantitative Aptitude',            'questions',25, 'subject_slug','quantitative-aptitude'),
    jsonb_build_object('name','English Comprehension',            'questions',25, 'subject_slug','english')
  ),
  true
from public.exams e
where e.slug = 'ssc-cgl'
on conflict (exam_id, slug) do nothing;


-- ---------------------------------------------------------------------
-- 3. CUET UG — per-subject mocks
--
-- One mock per CUET subject that has at least one chapter seeded.
-- This matches the real exam where each CUET subject is its own
-- 50-question, 45-minute test. We use INSERT ... SELECT against
-- public.subjects so we don't have to hardcode slugs that may differ
-- between dev and prod.
-- ---------------------------------------------------------------------
insert into public.mock_tests
  (exam_id, subject_id, slug, display_name, description,
   duration_seconds, total_questions, positive_marks, negative_marks,
   sections, is_free_sample)
select
  e.id,
  s.id,
  'cuet-' || s.id,
  'CUET ' || s.name || ' Mock',
  '50 questions, 45 minutes. Real CUET ' || s.name || ' timing and scoring (+5 / -1).',
  2700,
  50,
  5,
  1,
  jsonb_build_array(
    jsonb_build_object('name', s.name, 'questions', 50, 'subject_slug', s.id)
  ),
  true
from public.exams e
join public.subjects s on s.exam_id = e.id
where e.slug = 'cuet'
  -- Only seed for subjects that actually have chapters — otherwise
  -- the question generator has nothing to feed from.
  and exists (select 1 from public.chapters c where c.subject_id = s.id)
on conflict (exam_id, slug) do nothing;


-- =====================================================================
-- Smoke check (purely informational, won't fail the migration).
-- =====================================================================
do $$
declare
  v_count int;
begin
  select count(*) into v_count from public.mock_tests where is_active = true;
  raise notice 'Mock tests catalog now has % active rows.', v_count;
end $$;
