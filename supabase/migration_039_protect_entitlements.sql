-- Migration 039: prevent end-user tokens from changing billing or quota
-- entitlements on their own profile row. Trusted server writes use the
-- service_role JWT and Razorpay is verified server-side before any upgrade.

create or replace function public.protect_user_entitlements()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  jwt_role text := coalesce(auth.jwt() ->> 'role', '');
begin
  if jwt_role in ('authenticated', 'anon') and (
    new.subscription_status is distinct from old.subscription_status or
    new.paid_until is distinct from old.paid_until or
    new.last_razorpay_payment is distinct from old.last_razorpay_payment or
    new.quizzes_started is distinct from old.quizzes_started or
    new.mock_tests_started is distinct from old.mock_tests_started or
    new.analyses_started is distinct from old.analyses_started or
    new.analyses_taken is distinct from old.analyses_taken
  ) then
    raise exception 'Entitlement fields can only be updated by the billing server';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_user_entitlements_trigger on public.users;
create trigger protect_user_entitlements_trigger
before update on public.users
for each row execute function public.protect_user_entitlements();

revoke all on function public.protect_user_entitlements() from public;
alter table public.users enable row level security;
