-- Allow intensive preparation schedules up to 14 hours per day and make the
-- new profile table immediately visible to the Supabase REST API.
alter table public.user_exam_preferences
  drop constraint if exists user_exam_preferences_daily_minutes_range;

alter table public.user_exam_preferences
  add constraint user_exam_preferences_daily_minutes_range
  check (daily_study_minutes is null or daily_study_minutes between 15 and 840);

notify pgrst, 'reload schema';
