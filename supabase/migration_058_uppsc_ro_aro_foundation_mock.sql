-- UPPSC RO/ARO foundation practice is intentionally separate from any
-- notification-specific examination scheme. It validates the learning route
-- while the next complete official notification review is still pending.

insert into public.mock_tests
  (exam_id, subject_id, slug, display_name, description,
   duration_seconds, total_questions, positive_marks, negative_marks,
   sections, is_free_sample, is_active)
select
  e.id,
  null::text,
  'uppsc-ro-aro-foundation-practice',
  'UPPSC RO / ARO · Foundation Practice',
  '40 original questions across General Hindi, General Studies, computer and reasoning. This is an ExamGrind foundation set, not a claim about a notification-specific official paper format.',
  2100,
  40,
  1,
  0.25,
  jsonb_build_array(
    jsonb_build_object('name', 'General Hindi & Drafting', 'questions', 10, 'subject_slug', 'uppsc-ro-hindi'),
    jsonb_build_object('name', 'General Studies', 'questions', 10, 'subject_slug', 'uppsc-ro-gs'),
    jsonb_build_object('name', 'Computer & Office Skills', 'questions', 10, 'subject_slug', 'uppsc-ro-computer'),
    jsonb_build_object('name', 'Reasoning & Aptitude', 'questions', 10, 'subject_slug', 'uppsc-ro-reasoning')
  ),
  true,
  false
from public.exams e
where e.slug = 'uppsc-ro-aro'
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
