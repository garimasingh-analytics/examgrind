-- Coach lessons are premium AI generations. Keep a small, explicit daily
-- allowance so a browser loop cannot consume the shared model budget.
-- This is deliberately separate from the free Study Vault allowance.

alter table public.ai_usage_daily
  add column if not exists coach_lessons integer not null default 0
  check (coach_lessons >= 0);

create or replace function public.consume_coach_lesson_slot(p_user_id uuid, p_limit integer)
returns boolean language plpgsql security definer set search_path = public, pg_temp
as $$
declare next_count integer;
begin
  if auth.uid() is distinct from p_user_id then raise exception 'not allowed'; end if;
  if p_limit < 1 then raise exception 'invalid limit'; end if;

  insert into public.ai_usage_daily (user_id, usage_date, coach_lessons)
  values (p_user_id, current_date, 1)
  on conflict (user_id, usage_date) do update
    set coach_lessons = public.ai_usage_daily.coach_lessons + 1
    where public.ai_usage_daily.coach_lessons < p_limit
  returning coach_lessons into next_count;

  return next_count is not null;
end;
$$;

revoke all on function public.consume_coach_lesson_slot(uuid, integer) from public;
grant execute on function public.consume_coach_lesson_slot(uuid, integer) to authenticated;

notify pgrst, 'reload schema';
