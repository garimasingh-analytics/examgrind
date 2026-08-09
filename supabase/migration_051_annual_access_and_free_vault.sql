-- Annual ExamGrind access is a verified one-time purchase: ₹899 grants one
-- year of the same full access as Coach, without creating a yearly mandate.

alter table public.payments drop constraint if exists payments_product_check;
alter table public.payments add constraint payments_product_check check (
  product in ('legacy_membership', 'analysis_credit', 'score_boost_21d', 'quiz_pack_3', 'quiz_pack_10', 'quiz_pack_15', 'coach_yearly')
);

alter table public.purchase_entitlements drop constraint if exists purchase_entitlements_product_check;
alter table public.purchase_entitlements add constraint purchase_entitlements_product_check check (
  product in ('analysis_credit', 'score_boost_21d', 'quiz_pack_3', 'quiz_pack_10', 'quiz_pack_15', 'coach_yearly')
);

create or replace function public.grant_one_time_entitlement(p_user_id uuid, p_product text, p_order_id text, p_payment_id text)
returns void language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uses integer;
  v_created boolean := false;
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
  elsif p_product = 'coach_yearly' then
    insert into public.purchase_entitlements (user_id, product, remaining_uses, expires_at, razorpay_order_id, razorpay_payment_id)
    values (p_user_id, p_product, 0, now() + interval '1 year', p_order_id, p_payment_id)
    on conflict (razorpay_order_id) do nothing;
    v_created := found;
    if v_created then
      update public.users
        set subscription_status = 'paid',
            subscription_state = 'annual_one_time',
            paid_until = now() + interval '1 year'
        where id = p_user_id;
    end if;
  else
    raise exception 'invalid one-time product';
  end if;
end;
$$;

-- One small daily guard keeps the permanently-free Vault available to all
-- learners without allowing automated generation to consume the shared AI
-- budget. It never limits study or access to already-saved material.
alter table public.ai_usage_daily
  add column if not exists vault_generations integer not null default 0 check (vault_generations >= 0);

create or replace function public.consume_vault_generation_slot(p_user_id uuid, p_limit integer)
returns boolean language plpgsql security definer set search_path = public, pg_temp
as $$
declare next_count integer;
begin
  if auth.uid() is distinct from p_user_id then raise exception 'not allowed'; end if;
  if p_limit < 1 then raise exception 'invalid limit'; end if;
  insert into public.ai_usage_daily (user_id, usage_date, vault_generations)
  values (p_user_id, current_date, 1)
  on conflict (user_id, usage_date) do update
    set vault_generations = public.ai_usage_daily.vault_generations + 1
    where public.ai_usage_daily.vault_generations < p_limit
  returning vault_generations into next_count;
  return next_count is not null;
end;
$$;

revoke all on function public.grant_one_time_entitlement(uuid, text, text, text) from public, anon, authenticated;
revoke all on function public.consume_vault_generation_slot(uuid, integer) from public;
grant execute on function public.consume_vault_generation_slot(uuid, integer) to authenticated;

notify pgrst, 'reload schema';
