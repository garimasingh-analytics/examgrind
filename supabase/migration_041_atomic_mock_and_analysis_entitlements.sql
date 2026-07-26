-- Migration 041: close the remaining free-tier races. Quiz starts were made
-- atomic in migration 040; mock starts and analyses need the same treatment.

with historical_mock_starts as (
  select user_id, count(*)::integer as starts
  from public.mock_attempts
  group by user_id
)
update public.users as u
set mock_tests_started = greatest(coalesce(u.mock_tests_started, 0), least(1, historical_mock_starts.starts))
from historical_mock_starts
where u.id = historical_mock_starts.user_id;

with historical_analyses as (
  select user_id, count(*)::integer as starts
  from (
    select user_id from public.quiz_analyses
    union all
    select user_id from public.mock_analyses
  ) as all_analyses
  group by user_id
)
update public.users as u
set analyses_started = greatest(
  coalesce(u.analyses_started, 0),
  least(1, greatest(coalesce(u.analyses_taken, 0), historical_analyses.starts))
)
from historical_analyses
where u.id = historical_analyses.user_id;

create or replace function public.consume_freemium_slot(
  p_user_id uuid,
  p_gate text,
  p_limit integer
)
returns table(allowed boolean, is_paid boolean, used integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_status text;
  v_paid_until timestamptz;
  v_used integer;
begin
  if p_gate not in ('mock', 'analysis') or p_limit < 1 then
    raise exception 'invalid freemium gate';
  end if;

  select subscription_status, paid_until,
    case when p_gate = 'mock' then mock_tests_started else analyses_started end
    into v_status, v_paid_until, v_used
  from public.users where id = p_user_id for update;
  if not found then raise exception 'user profile not found'; end if;

  v_used := coalesce(v_used, 0);
  if v_status = 'paid' and v_paid_until > now() then
    return query select true, true, v_used; return;
  end if;
  if v_used >= p_limit then
    return query select false, false, v_used; return;
  end if;

  if p_gate = 'mock' then
    update public.users set mock_tests_started = v_used + 1 where id = p_user_id;
  else
    update public.users set analyses_started = v_used + 1 where id = p_user_id;
  end if;
  return query select true, false, v_used + 1;
end;
$$;

revoke all on function public.consume_freemium_slot(uuid, text, integer) from public;
revoke all on function public.consume_freemium_slot(uuid, text, integer) from anon;
revoke all on function public.consume_freemium_slot(uuid, text, integer) from authenticated;
