-- Subject identifiers in ExamGrind are stable text slugs (for example,
-- "ssc-quant"), not UUIDs. Align the saved-plan column with that schema.
alter table public.user_exam_preferences
  alter column selected_subject_ids type text[]
  using selected_subject_ids::text[];

notify pgrst, 'reload schema';
