import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Contact — ExamGrind",
  description: "Get in touch with the ExamGrind team.",
};

export default function ContactPage() {
  return (
    <LegalPageLayout title="Contact us" updated="Last updated: 16 May 2026">
      <p>
        We&apos;re a small team. Drop us a line and we&apos;ll get back —
        usually within 1 business day, always within 2.
      </p>

      <h2>Support &amp; general questions</h2>
      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:support@examgrind.in">support@examgrind.in</a>
      </p>
      <p>
        For account issues, bugs, refund requests, privacy questions, or
        general feedback. Please include the email address on your account
        and a clear description of what&apos;s going on.
      </p>

      <h2>Privacy &amp; data requests</h2>
      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:privacy@examgrind.in">privacy@examgrind.in</a>
      </p>
      <p>
        For exercising your rights under the Digital Personal Data
        Protection Act, 2023 — access, correction, deletion, withdrawal of
        consent.
      </p>

      <h2>Business details</h2>
      <p>
        <strong>Operated by:</strong> Mobizone Technologies Private Limited
        <br />
        <strong>Address:</strong> Flat-702, Tower-9, Unitech Horizon, Pi-2, Greater Noida-201310, India
        <br />
        <strong>GSTIN:</strong> 09AAICM6882B1Z8
      </p>

      <h2>Response times</h2>
      <ul>
        <li>Support inquiries — within 2 business days.</li>
        <li>Refund requests — within 2 business days.</li>
        <li>Privacy / data requests — within 30 days (per DPDP Act).</li>
        <li>Security disclosures — within 1 business day.</li>
      </ul>

      <p className="!mt-10 text-sm text-cocoa-500">
        See also our <a href="/terms">Terms</a>,{" "}
        <a href="/privacy">Privacy Policy</a>, and{" "}
        <a href="/refund">Refund &amp; Cancellation Policy</a>.
      </p>
    </LegalPageLayout>
  );
}
