-- Migration 012: Launch prep — default topics + user.exam_choice backfill
--
-- Two things needed before flipping SSC CGL + NEET UG to 'live' on July 1:
--
-- 1) Auto-seed one "Practice Set" topic per chapter for the new exams.
--    The quiz API (app/api/quiz/start/route.ts) requires a topicId — without
--    a topic, a chapter has nothing to click into. We add ONE topic per
--    chapter as a launch-MVP; richer multi-topic structure can come later
--    based on real user practice patterns.
--
-- 2) Backfill users.exam_choice to 'cuet' for any existing user whose
--    exam_choice is NULL. Every user must have an exam to filter /home.
--    The card-click flow will set this for new sign-ups.
--
-- Run with: paste into Supabase SQL Editor
-- Reversibility:
--   - delete from topics where slug='practice-set' and chapter_id in (
--       select c.id from chapters c
--       join subjects s on s.id = c.subject_id
--       where s.exam_id in (select id from exams where slug in ('ssc-cgl','neet-ug'))
--     );
--   - update users set exam_choice = NULL where exam_choice = 'cuet';

-- 1) Seed "Practice Set" topic for every chapter in SSC CGL + NEET UG ----
insert into public.topics (chapter_id, name, slug, description, order_index)
select
  c.id,
  'Practice Set',
  'practice-set',
  'Full-chapter MCQ practice covering every key concept.',
  1
from public.chapters c
join public.subjects s on s.id = c.subject_id
join public.exams e on e.id = s.exam_id
where e.slug in ('ssc-cgl', 'neet-ug')
on conflict (chapter_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  order_index = excluded.order_index;

-- 2) Backfill exam_choice for existing users (all of them are CUET right now) -
update public.users
   set exam_choice = 'cuet'
 where exam_choice is null
    or exam_choice not in ('cuet', 'ssc-cgl', 'neet-ug');

-- Verify with:
--   select e.slug, count(t.id) as topics
--     from exams e
--     join subjects s on s.exam_id = e.id
--     join chapters c on c.subject_id = s.id
--     join topics t on t.chapter_id = c.id
--    where e.slug in ('ssc-cgl','neet-ug')
--    group by e.slug;
--   -- expect: ssc-cgl=65, neet-ug=59
--
--   select exam_choice, count(*) from users group by exam_choice;
--   -- expect: every existing user has 'cuet'
