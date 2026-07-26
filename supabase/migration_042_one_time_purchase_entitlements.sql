-- One-time products must be granted independently of the ₹199 membership.
-- This keeps a valid ₹19 payment from ever becoming a monthly subscription.

alter table public.payments
  add column if not exists product text not null default 'legacy_membership'
  check (product in ('legacy_membership', 'analysis_credit', 'score_boost_21d'));

create table if not exists public.purchase_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product text not null check (product in ('analysis_credit', 'score_boost_21d')),
  remaining_uses integer not null default 0 check (remaining_uses >= 0),
  roadmap jsonb,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  razorpay_order_id text not null unique,
  razorpay_payment_id text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists purchase_entitlements_user_active_idx
  on public.purchase_entitlements (user_id, product, expires_at, remaining_uses);

alter table public.purchase_entitlements enable row level security;
-- Server-only table: user-facing access is always through verified routes.

-- Atomically gives a standard analysis access. The paid plan wins, then a
-- purchased ₹19 credit, then the single free analysis. Locking prevents two
-- simultaneous requests from spending one credit twice.
create or replace function public.consume_analysis_entitlement(p_user_id uuid)
returns table(allowed boolean, is_paid boolean, source text, used integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_status text;
  v_paid_until timestamptz;
  v_used integer;
  v_entitlement_id uuid;
begin
  select subscription_status, paid_until, analyses_started
    into v_status, v_paid_until, v_used
  from public.users where id = p_user_id for update;
  if not found then raise exception 'user profile not found'; end if;

  v_used := coalesce(v_used, 0);
  if v_status = 'paid' and v_paid_until > now() then
    return query select true, true, 'membership', v_used; return;
  end if;

  select id into v_entitlement_id
  from public.purchase_entitlements
  where user_id = p_user_id
    and product = 'analysis_credit'
    and remaining_uses > 0
    and (expires_at is null or expires_at > now())
  order by created_at asc
  limit 1 for update skip locked;
  if v_entitlement_id is not null then
    update public.purchase_entitlements
      set remaining_uses = remaining_uses - 1
      where id = v_entitlement_id;
    return query select true, false, 'analysis_credit', v_used; return;
  end if;

  if v_used >= 1 then
    return query select false, false, 'none', v_used; return;
  end if;
  update public.users set analyses_started = v_used + 1 where id = p_user_id;
  return query select true, false, 'free', v_used + 1;
end;
$$;

revoke all on function public.consume_analysis_entitlement(uuid) from public;
revoke all on function public.consume_analysis_entitlement(uuid) from anon;
revoke all on function public.consume_analysis_entitlement(uuid) from authenticated;

-- Called only after Razorpay HMAC verification. The unique Razorpay IDs make
-- webhook/client retries safe: one payment can issue one entitlement only.
create or replace function public.grant_one_time_entitlement(
  p_user_id uuid, p_product text, p_order_id text, p_payment_id text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_product = 'analysis_credit' then
    insert into public.purchase_entitlements
      (user_id, product, remaining_uses, expires_at, razorpay_order_id, razorpay_payment_id)
    values (p_user_id, p_product, 1, now() + interval '1 year', p_order_id, p_payment_id)
    on conflict (razorpay_order_id) do nothing;
  elsif p_product = 'score_boost_21d' then
    insert into public.purchase_entitlements
      (user_id, product, remaining_uses, expires_at, razorpay_order_id, razorpay_payment_id)
    values (p_user_id, p_product, 0, now() + interval '21 days', p_order_id, p_payment_id)
    on conflict (razorpay_order_id) do nothing;
  else
    raise exception 'invalid one-time product';
  end if;
end;
$$;

revoke all on function public.grant_one_time_entitlement(uuid, text, text, text) from public;
revoke all on function public.grant_one_time_entitlement(uuid, text, text, text) from anon;
revoke all on function public.grant_one_time_entitlement(uuid, text, text, text) from authenticated;
