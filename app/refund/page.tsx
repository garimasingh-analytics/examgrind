import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — ExamGrind",
  description:
    "How cancellations and refunds work for the ExamGrind subscription.",
};

export default function RefundPage() {
  return (
    <LegalPageLayout
      title="Refund & Cancellation Policy"
      updated="Last updated: 16 May 2026"
    >
      <p>
        ExamGrind is a digital subscription service sold by{" "}
        <strong>[Your Registered Business Name]</strong> for ₹199 per month,
        inclusive of applicable Indian taxes (e.g. GST). This page explains
        when refunds are available and how to request one.
      </p>

      <h2>1. The free tier is free</h2>
      <p>
        You can use ExamGrind&apos;s free tier (3 quizzes + 1 Deep Analysis)
        without any payment. We recommend you use the free tier to evaluate
        whether the Service is right for you before upgrading.
      </p>

      <h2>2. Cancellation</h2>
      <p>
        You can cancel your monthly subscription at any time from your
        profile (<code>/me</code>). Cancellation takes effect at the end of
        the current billing cycle:
      </p>
      <ul>
        <li>You keep paid features until the end of the cycle you&apos;ve already paid for.</li>
        <li>No further charges happen after cancellation.</li>
      </ul>

      <h2>3. Refund eligibility</h2>
      <p>You may request a full refund of your most recent monthly payment if:</p>
      <ul>
        <li>
          The request is made within <strong>7 days</strong> of that payment,
          AND
        </li>
        <li>
          You have used <strong>fewer than 5 paid-tier quizzes</strong> in
          that billing cycle.
        </li>
      </ul>
      <p>
        We track this server-side using the same quiz counter that powers
        the free-tier gate, so eligibility is checked automatically.
      </p>

      <h3>Cases where refunds are not available</h3>
      <ul>
        <li>
          Requests made more than 7 days after the most recent payment.
        </li>
        <li>
          Accounts that have used 5 or more paid-tier quizzes in the
          relevant cycle (you&apos;ve used a material portion of the value).
        </li>
        <li>
          Renewals from earlier billing cycles. Only the most recent
          monthly payment is in scope.
        </li>
        <li>
          Accounts terminated for violating our{" "}
          <a href="/terms">Terms of Service</a>.
        </li>
      </ul>

      <h2>4. How to request a refund</h2>
      <p>
        Email us via the <a href="/contact">contact page</a> with the
        subject line &ldquo;Refund request&rdquo; and include:
      </p>
      <ul>
        <li>The email address on your ExamGrind account.</li>
        <li>The date of the payment you want refunded.</li>
        <li>One line on why you&apos;re asking — it genuinely helps us improve.</li>
      </ul>
      <p>
        We&apos;ll respond within 2 business days. Approved refunds are
        credited to the original payment method via Razorpay within 5–10
        business days. The actual time to show up in your account depends on
        your card-issuing bank or UPI provider.
      </p>

      <h2>5. Failed or duplicate payments</h2>
      <p>
        If a payment is debited from your account but the subscription
        didn&apos;t activate, or you were charged twice for the same period,
        write to us and we&apos;ll fix it within 2 business days at no
        question.
      </p>

      <h2>6. Pricing changes</h2>
      <p>
        We may change the subscription price. If we do, the new price will
        apply only to billing cycles after the change. We&apos;ll notify you
        at least 14 days in advance. You can cancel before the new price
        takes effect.
      </p>

      <h2>7. Contact</h2>
      <p>
        All refund questions go through the{" "}
        <a href="/contact">contact page</a>. We aim to respond within 2
        business days.
      </p>
    </LegalPageLayout>
  );
}
