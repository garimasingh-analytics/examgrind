# Razorpay Setup — 10 minutes, no code

You don't need to know what an API does. Just follow these screenshots.

---

## Step 1 — Create the ₹75/month Plan (3 min)

1. Sign in at **https://dashboard.razorpay.com**
2. Left sidebar → **Subscriptions** → **Plans** → click **+ Create plan**
3. Fill in:
   - **Plan name**: `ExamGrind Monthly`
   - **Billing frequency**: Monthly
   - **Billing cycle**: Every 1 month
   - **Amount**: 75
   - **Currency**: INR
   - **Description**: `Unlimited quizzes + Deep Analysis on every quiz`
4. Click **Create plan**
5. On the plan detail page, copy the **Plan ID** — it looks like `plan_PXxxxxxxxxxxx`

**Paste it into Vercel:**

- Vercel Dashboard → your project → **Settings** → **Environment Variables**
- Add new: `RAZORPAY_PLAN_ID` = `plan_PXxxxxxxxxxxx` (the value you just copied)
- Select all three environments (Production, Preview, Development) → Save

---

## Step 2 — Set up the Webhook (3 min)

This is what tells our app when someone pays / cancels / renews.

1. Razorpay Dashboard → **Settings** (bottom-left gear icon) → **Webhooks**
2. Click **+ Add New Webhook**
3. Fill in:
   - **Webhook URL**: `https://YOUR-VERCEL-URL/api/billing/webhook`
     (replace `YOUR-VERCEL-URL` with your live domain — e.g. `https://examgrind.vercel.app` or `https://examgrind.com` once custom domain is live)
   - **Secret**: Click **Generate secret** OR type any long random string (24+ chars). **Copy this value** — you'll paste it into Vercel below.
   - **Alert email**: your email
4. Under **Active Events**, tick these (and only these):
   - `subscription.activated`
   - `subscription.charged`
   - `subscription.completed`
   - `subscription.cancelled`
   - `subscription.pending`
   - `subscription.halted`
   - `subscription.paused`
   - `subscription.resumed`
   - `payment.failed`
5. Click **Create Webhook**

**Paste the secret into Vercel:**

- Vercel → Settings → Environment Variables
- Add new: `RAZORPAY_WEBHOOK_SECRET` = the secret you copied/typed
- All three environments → Save

---

## Step 3 — Flip from Test to Live keys (2 min)

If you're already using test keys (they start with `rzp_test_…`), keep using them until you've personally clicked through the flow once. Then:

1. Razorpay Dashboard → top-right toggle → switch from **Test Mode** to **Live Mode**
2. Settings → **API Keys** → **Generate Live Keys** (one-time)
3. Copy the **Key ID** and **Key Secret** — Razorpay shows the secret only once, so save it somewhere safe.
4. Vercel → Settings → Environment Variables, update these two:
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` → the new `rzp_live_…` Key ID
   - `RAZORPAY_KEY_SECRET` → the new live Key Secret
5. **Redeploy** (Vercel → Deployments → newest one → Redeploy)

**Important:** in Live mode you also need to:
- Repeat **Step 1** (create the same ₹75 Plan again in Live mode — test plans don't carry over)
- Repeat **Step 2** (create the webhook again in Live mode)
- Update `RAZORPAY_PLAN_ID` and `RAZORPAY_WEBHOOK_SECRET` to the live values

This is annoying but unavoidable — Razorpay keeps test and live data fully isolated, which is actually a feature.

---

## Step 4 — Test the full flow (2 min)

Still in Test Mode is fine for this:

1. Sign in to your app with a fresh Google account
2. Take 3 free quizzes (burn through the gate)
3. Click **Upgrade** on the modal → Razorpay checkout opens
4. Choose **UPI**, enter `success@razorpay` as the UPI ID (this is Razorpay's test handle that auto-succeeds)
5. The mandate signs → you should see "You're paid up!" → refresh `/me` → status should say **Paid**

If you want to test the UPI mandate fail flow, use `failure@razorpay` instead.

If you want to test cancellation: go to `/me` → scroll to the plan panel → click **Cancel subscription** → confirm. Within a few seconds you should see "Subscription cancelled. You keep access until..."

---

## What you'll see when a real student subscribes

- They sign the UPI mandate at Razorpay checkout
- Within 5-30 seconds, the webhook fires `subscription.activated`
- Your alert webhook (if you set `ALERT_WEBHOOK_URL`) pings you: **🚨 ExamGrind: New SUBSCRIPTION activated — ₹75/mo recurring from user XXXXXXXX**
- Their `/home` shows full paid access
- 30 days later, Razorpay auto-debits via UPI Autopay
- `subscription.charged` fires, paid_until extends by another 30 days, you get another ping
- Repeat for 12 cycles, then `subscription.completed` and they have to renew (we'll add a renewal nudge email when you have an email provider)

---

## Common gotchas

**"Plans dropdown is empty in Live Mode"** — You created the plan in Test Mode. Repeat Step 1 in Live Mode.

**"Webhook fires but state doesn't change"** — Most likely `RAZORPAY_WEBHOOK_SECRET` in Vercel doesn't match what's in the Razorpay Dashboard. Re-copy and redeploy.

**"User signed mandate but `/me` still says Free"** — The webhook may have failed delivery. Razorpay Dashboard → Webhooks → click the webhook → check recent deliveries. You'll see the failed payload and the HTTP response. If it's a 401 from Supabase RLS, redeploy with the latest code (the admin client should handle that).

**"How do I issue a refund?"** — Razorpay Dashboard → Payments → find the payment → **Refund**. Then manually update the user's row in Supabase: `update users set subscription_status='free', paid_until=null where id='…'`. We'll wire this into /admin later.
