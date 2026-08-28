-- A transparent foundation mock for Delhi Police Constable.
--
-- This is intentionally labelled ExamGrind Practice Mock, not “official” or
-- “real-paper timing”. It measures the four preparation areas without
-- claiming a fixed notification-specific marks split or duration.

insert into public.mock_tests
  (exam_id, subject_id, slug, display_name, description,
   duration_seconds, total_questions, positive_marks, negative_marks,
   sections, is_free_sample, is_active)
select
  e.id,
  null::text,
  'delhi-police-foundation-practice',
  'Delhi Police Constable · Foundation Practice',
  '40 original questions across GK, reasoning, numerical ability and computer awareness. This is an ExamGrind practice set, not a claim about a future official paper format.',
  1800,
  40,
  1,
  0.25,
  jsonb_build_array(
    jsonb_build_object('name', 'General Knowledge & Current Affairs', 'questions', 10, 'subject_slug', 'dp-gk'),
    jsonb_build_object('name', 'Reasoning', 'questions', 10, 'subject_slug', 'dp-reasoning'),
    jsonb_build_object('name', 'Numerical Ability', 'questions', 10, 'subject_slug', 'dp-quant'),
    jsonb_build_object('name', 'Computer Awareness', 'questions', 10, 'subject_slug', 'dp-computer')
  ),
  true,
  true
from public.exams e
where e.slug = 'delhi-police-constable'
on conflict (exam_id, slug) do update set
  display_name = excluded.display_name,
  description = excluded.description,
  duration_seconds = excluded.duration_seconds,
  total_questions = excluded.total_questions,
  positive_marks = excluded.positive_marks,
  negative_marks = excluded.negative_marks,
  sections = excluded.sections,
  is_free_sample = excluded.is_free_sample,
  is_active = excluded.is_active;
