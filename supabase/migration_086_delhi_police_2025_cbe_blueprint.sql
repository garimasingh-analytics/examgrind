-- Delhi Police Constable: calibrate the public practice mock to the
-- SSC Constable (Executive) Male and Female in Delhi Police Examination,
-- 2025 CBE scheme. Source: SSC Notice dated 22 September 2025, para 12.3–12.10.
--
-- This is deliberately labelled as a 2025-pattern practice mock. A future
-- recruitment notice may change the scheme; the guide and public UI must point
-- students to SSC for the current notification before treating this as a live
-- recruitment promise.

update public.mock_tests
set
  display_name = 'Delhi Police Constable · 2025 Pattern Practice Mock',
  description = '100 questions in 90 minutes: 50 General Knowledge & Current Affairs, 25 Reasoning, 15 Numerical Ability and 10 Computer Fundamentals. −0.25 for each wrong answer. Based on the SSC Delhi Police Constable (Executive) 2025 CBE scheme; check the latest SSC notice before relying on a future cycle.',
  duration_seconds = 5400,
  total_questions = 100,
  positive_marks = 1,
  negative_marks = 0.25,
  sections = jsonb_build_array(
    jsonb_build_object('name', 'General Knowledge & Current Affairs', 'questions', 50, 'subject_slug', 'dp-gk'),
    jsonb_build_object('name', 'Reasoning', 'questions', 25, 'subject_slug', 'dp-reasoning'),
    jsonb_build_object('name', 'Numerical Ability', 'questions', 15, 'subject_slug', 'dp-quant'),
    jsonb_build_object('name', 'Computer Awareness', 'questions', 10, 'subject_slug', 'dp-computer')
  ),
  is_free_sample = true,
  is_active = true
where exam_id = (select id from public.exams where slug = 'delhi-police-constable')
  and slug = 'delhi-police-foundation-practice';

do $$
begin
  if not exists (
    select 1
    from public.mock_tests mt
    join public.exams e on e.id = mt.exam_id
    where e.slug = 'delhi-police-constable'
      and mt.slug = 'delhi-police-foundation-practice'
      and mt.total_questions = 100
      and mt.duration_seconds = 5400
      and mt.negative_marks = 0.25
  ) then
    raise exception 'Delhi Police 2025-pattern mock was not calibrated';
  end if;
end $$;
