import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Delete your ExamGrind account",
  description: "How to request deletion of your ExamGrind account and data.",
};

export default function AccountDeletionPage() {
  return (
    <LegalPageLayout
      title="Delete your account"
      updated="Last updated: 13 September 2026"
    >
      <p>
        You can request deletion of your ExamGrind account and associated
        learning data at any time.
      </p>

      <h2>How to request deletion</h2>
      <ol>
        <li>
          Email <a href="mailto:info@examgrind.in">info@examgrind.in</a> from
          the email address linked to your ExamGrind account.
        </li>
        <li>
          Use the subject line <strong>Delete my ExamGrind account</strong>.
        </li>
        <li>
          We may ask you to confirm the request before we proceed, to protect
          your account from an unauthorised deletion.
        </li>
      </ol>

      <h2>What we delete</h2>
      <p>
        We delete your profile, sign-in association, quiz attempts, answers,
        Coach lesson history, flashcards, mastery progress, XP and streak data
        within 30 days of confirming your request.
      </p>

      <h2>What may be retained</h2>
      <p>
        We may retain payment transaction records only where required for tax,
        accounting, fraud-prevention or other legal obligations. These records
        are kept for the minimum period required by law and are not used to
        restore your ExamGrind account.
      </p>

      <h2>Need help?</h2>
      <p>
        For questions about deletion or your data, contact us at{" "}
        <a href="mailto:info@examgrind.in">info@examgrind.in</a>.
      </p>
    </LegalPageLayout>
  );
}
