import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — ExamGrind",
  description:
    "How ExamGrind collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updated="Last updated: 16 May 2026">
      <p>
        ExamGrind respects your privacy. This Privacy Policy explains what we
        collect, why we collect it, and the choices you have. It applies to
        anyone who uses the ExamGrind website or services
        (&ldquo;Service&rdquo;), operated by{" "}
        <strong>Mobizone Technologies Private Limited</strong>.
      </p>

      <h2>1. Information we collect</h2>

      <h3>a. Information you give us</h3>
      <ul>
        <li>
          <strong>Account info</strong> — when you sign in with Google we
          receive your name, email address, and profile photo from Google.
        </li>
        <li>
          <strong>Your quiz activity</strong> — which subjects, chapters, and
          topics you practise; the answers you select; time spent on each
          question; XP earned; streak history; mastery progress.
        </li>
        <li>
          <strong>Payment info</strong> — handled entirely by Razorpay (an
          RBI-authorised payment aggregator). We never see or store your full
          card number, CVV, UPI PIN, or bank credentials. We do store the
          transaction reference, amount, status, and the masked last four
          digits Razorpay shares.
        </li>
      </ul>

      <h3>b. Information collected automatically</h3>
      <ul>
        <li>
          Standard server logs (IP address, browser type, pages requested,
          timestamps) used to keep the Service reliable and secure.
        </li>
        <li>
          A small set of cookies needed to keep you signed in (Supabase auth
          session tokens). We do not currently use third-party advertising
          cookies.
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To run the Service — generate quizzes, score answers, show progress.</li>
        <li>
          To generate personalised AI analyses of your quiz answers, which is
          the core feature of ExamGrind. Question text and your answers are
          sent to Anthropic&apos;s API to produce the analysis; Anthropic does
          not retain customer data for training under our agreement.
        </li>
        <li>
          To process payments and prevent fraud (in coordination with
          Razorpay).
        </li>
        <li>
          To send you essential service messages (e.g. payment receipts,
          account notices). We will not send marketing email without your
          consent.
        </li>
        <li>To improve the Service in aggregate, anonymous form.</li>
      </ul>

      <h2>3. Who we share information with</h2>
      <p>We share information only with the following processors:</p>
      <ul>
        <li>
          <strong>Supabase</strong> — our database and auth provider. Your
          profile and quiz data sit in our Supabase project (hosted in the
          Asia-Pacific region).
        </li>
        <li>
          <strong>Anthropic</strong> — receives quiz text and answers when
          generating questions or analyses. Used only to fulfil your request;
          not retained for training.
        </li>
        <li>
          <strong>Razorpay</strong> — receives payment details directly from
          you (we never see them). Acts as a processor under their own
          privacy policy.
        </li>
        <li>
          <strong>Vercel</strong> — hosts the website and serves it to your
          browser. Standard web logs apply.
        </li>
        <li>
          <strong>Google</strong> — provides the Sign-in with Google flow.
        </li>
      </ul>
      <p>
        We do not sell your personal information to anyone. We may disclose
        information when required by a valid Indian legal process.
      </p>

      <h2>4. Your rights under the DPDP Act, 2023</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Correct any inaccurate data.</li>
        <li>Request deletion of your data (subject to legal retention limits).</li>
        <li>Withdraw consent at any time (this will end your access to the Service).</li>
        <li>Nominate someone to exercise your rights in case of incapacity.</li>
        <li>Make a complaint to the Data Protection Board of India.</li>
      </ul>
      <p>
        To exercise any of these rights, write to us via the{" "}
        <a href="/contact">contact page</a>. We&apos;ll respond within 30 days.
      </p>

      <h2>5. How long we keep your data</h2>
      <p>
        We keep account and quiz data for as long as your account is active.
        If you delete your account, we delete personal data within 30 days,
        except where Indian tax, accounting, or anti-fraud law requires us to
        retain payment records for a longer period.
      </p>

      <h2>6. Security</h2>
      <p>
        Communication with the Service is encrypted in transit (TLS).
        Database access is restricted via row-level security policies — your
        rows can only be read or modified by your own authenticated session.
        No system is perfectly secure; please use a strong Google password
        and contact us immediately if you suspect unauthorised access.
      </p>

      <h2>7. Children</h2>
      <p>
        ExamGrind is built for Indian competitive-exam aspirants (currently
        CUET UG, SSC CGL, and NEET UG). If you are under 18, you may use the
        Service only with a parent or legal guardian&apos;s consent. We do not
        knowingly collect personal data from anyone under 13.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>
        We&apos;ll change the &ldquo;Last updated&rdquo; date at the top when
        we revise this policy. Material changes will be notified by email or
        in-app.
      </p>

      <h2>9. Contact</h2>
      <p>
        Privacy questions, deletion requests, complaints — please use the{" "}
        <a href="/contact">contact page</a>.
      </p>
    </LegalPageLayout>
  );
}
