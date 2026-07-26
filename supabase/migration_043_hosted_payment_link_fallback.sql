-- Hosted Razorpay links are used for one-time purchases when checkout.js is
-- blocked by an in-app browser or privacy extension. Keep a server-side link
-- identifier so only our own signed webhook can grant an entitlement.

alter table public.payments
  add column if not exists razorpay_payment_link_id text;

create unique index if not exists payments_razorpay_payment_link_id_key
  on public.payments (razorpay_payment_link_id)
  where razorpay_payment_link_id is not null;

