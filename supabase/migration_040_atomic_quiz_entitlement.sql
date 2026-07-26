-- Migration 040: repair historical quiz counters and make the free-quiz
-- entitlement atomic. The previous read → generate → write flow allowed a
-- historical account with quizzes_started=0 to look unused forever and could
-- let parallel starts race on the last free slot.

-- Historical accounts existed before quizzes_started was introduced. Count
-- every persisted quiz start (completed or abandoned) because the product
-- promise is 3 starts, not 3 completions. Cap at the free limit so the
-- counter stays a compact entitlement value; paid users are unaffected.
with historical_starts as (
  select user_id, count(*)::integer as starts
  from public.quizzes
  group by user_id
)
update public.users as u
set quizzes_started = greatest(
  coalesce(u.quizzes_started, 0),
  least(3, historical_starts.starts)
)
from historical_starts
where u.id = historical_starts.user_id;

-- Server-only, row-locked gate. It must run before Claude generation so an
-- exhausted account cannot create an expensive quiz or bypass the limit by
-- opening concurrent requests. Service-role API calls bypass RLS and are the
-- only intended caller; direct end-user execution is revoked below.
create or replace function public.consume_quiz_slot(
  p_user_id uuid,
  p_limit integer default 3
)
returns table(allowed boolean, is_paid boolean, used integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_status text;
  v_paid_until timestamptz;
  v_started integer;
begin
  if p_limit < 1 then
    raise exception 'p_limit must be positive';
  end if;

  select subscription_status, paid_until, quizzes_started
    into v_status, v_paid_until, v_started
  from public.users
  where id = p_user_id
  for update;

  if not found then
    raise exception 'user profile not found';
  end if;

  v_started := coalesce(v_started, 0);
  if v_status = 'paid' and v_paid_until > now() then
    return query select true, true, v_started;
    return;
  end if;

  if v_started >= p_limit then
    return query select false, false, v_started;
    return;
  end if;

  update public.users
  set quizzes_started = v_started + 1
  where id = p_user_id;

  return query select true, false, v_started + 1;
end;
$$;

revoke all on function public.consume_quiz_slot(uuid, integer) from public;
revoke all on function public.consume_quiz_slot(uuid, integer) from anon;
revoke all on function public.consume_quiz_slot(uuid, integer) from authenticated;
