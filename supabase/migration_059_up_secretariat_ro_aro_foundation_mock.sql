-- UP Secretariat RO / ARO foundation practice.
-- This is original practice content, not a claim about a fixed official paper pattern,
-- eligibility rule, skill test, or typing requirement for a future notification.

insert into public.mock_tests (
  exam_id,
  subject_id,
  slug,
  display_name,
  description,
  duration_seconds,
  total_questions,
  positive_marks,
  negative_marks,
  sections,
  is_free_sample,
  is_active
)
select
  exams.id,
  null::text,
  'up-secretariat-ro-aro-foundation-practice',
  'UP Secretariat RO / ARO · Foundation Practice',
  'Original foundation practice across Hindi, General Studies, computer skills and reasoning. This practice set is not a notification-specific official paper pattern.',
  2100,
  40,
  1,
  0.25,
  jsonb_build_array(
    jsonb_build_object('name', 'General Hindi & Drafting', 'questions', 10, 'subject_slug', 'up-secretariat-hindi'),
    jsonb_build_object('name', 'General Studies', 'questions', 10, 'subject_slug', 'up-secretariat-gs'),
    jsonb_build_object('name', 'Computer & Office Skills', 'questions', 10, 'subject_slug', 'up-secretariat-computer'),
    jsonb_build_object('name', 'Reasoning & Aptitude', 'questions', 10, 'subject_slug', 'up-secretariat-reasoning')
  ),
  true,
  false
from public.exams
where slug = 'up-secretariat-ro-aro'
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
