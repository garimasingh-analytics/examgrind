-- Quiz packs are one-time, server-enforced quiz starts. They use the same
-- Razorpay order + verified webhook path as the existing ₹19/₹49 products.

alter table public.payments drop constraint if exists payments_product_check;
alter table public.payments add constraint payments_product_check
  check (product in ('legacy_membership', 'analysis_credit', 'score_boost_21d', 'quiz_pack_3', 'quiz_pack_10', 'quiz_pack_15'));

alter table public.purchase_entitlements drop constraint if exists purchase_entitlements_product_check;
alter table public.purchase_entitlements add constraint purchase_entitlements_product_check
  check (product in ('analysis_credit', 'score_boost_21d', 'quiz_pack_3', 'quiz_pack_10', 'quiz_pack_15'));

-- Extend the existing row-locked gate. Membership remains unlimited; an
-- active pack is consumed oldest-first; only then is the 3-free-start limit
-- considered. No browser state is trusted.
create or replace function public.consume_quiz_slot(p_user_id uuid, p_limit integer default 3)
returns table(allowed boolean, is_paid boolean, used integer)
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_status text; v_paid_until timestamptz; v_started integer; v_entitlement_id uuid;
begin
  if p_limit < 1 then raise exception 'p_limit must be positive'; end if;
  select subscription_status, paid_until, quizzes_started into v_status, v_paid_until, v_started
    from public.users where id = p_user_id for update;
  if not found then raise exception 'user profile not found'; end if;
  v_started := coalesce(v_started, 0);
  if v_status = 'paid' and v_paid_until > now() then return query select true, true, v_started; return; end if;
  select id into v_entitlement_id from public.purchase_entitlements
    where user_id = p_user_id and product in ('quiz_pack_3', 'quiz_pack_10', 'quiz_pack_15')
      and remaining_uses > 0 and (expires_at is null or expires_at > now())
    order by created_at asc limit 1 for update skip locked;
  if v_entitlement_id is not null then
    update public.purchase_entitlements set remaining_uses = remaining_uses - 1 where id = v_entitlement_id;
    return query select true, false, v_started; return;
  end if;
  if v_started >= p_limit then return query select false, false, v_started; return; end if;
  update public.users set quizzes_started = v_started + 1 where id = p_user_id;
  return query select true, false, v_started + 1;
end;
$$;

create or replace function public.grant_one_time_entitlement(p_user_id uuid, p_product text, p_order_id text, p_payment_id text)
returns void language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_uses integer;
begin
  if p_product = 'analysis_credit' then v_uses := 1;
  elsif p_product = 'quiz_pack_3' then v_uses := 3;
  elsif p_product = 'quiz_pack_10' then v_uses := 10;
  elsif p_product = 'quiz_pack_15' then v_uses := 15;
  end if;
  if v_uses is not null then
    insert into public.purchase_entitlements (user_id, product, remaining_uses, expires_at, razorpay_order_id, razorpay_payment_id)
    values (p_user_id, p_product, v_uses, now() + interval '1 year', p_order_id, p_payment_id)
    on conflict (razorpay_order_id) do nothing;
  elsif p_product = 'score_boost_21d' then
    insert into public.purchase_entitlements (user_id, product, remaining_uses, expires_at, razorpay_order_id, razorpay_payment_id)
    values (p_user_id, p_product, 0, now() + interval '21 days', p_order_id, p_payment_id)
    on conflict (razorpay_order_id) do nothing;
  else raise exception 'invalid one-time product'; end if;
end;
$$;

revoke all on function public.consume_quiz_slot(uuid, integer) from public, anon, authenticated;
revoke all on function public.grant_one_time_entitlement(uuid, text, text, text) from public, anon, authenticated;
