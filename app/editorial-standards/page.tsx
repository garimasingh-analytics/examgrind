import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Editorial standards · ExamGrind",
  description: "How ExamGrind creates, checks, updates and corrects its free study guides and official-source references.",
  alternates: { canonical: "/editorial-standards" },
};

export default function EditorialStandardsPage() {
  return (
    <LegalPageLayout title="Editorial standards" updated="Last updated: 23 August 2026">
      <p>
        Our public study guides are meant to help a student make a clearer next study decision. They are not copied coaching notes, scraped answer keys, or a substitute for an official notification.
      </p>

      <h2>Original, useful content</h2>
      <p>
        We create guides around a specific preparation problem: analysing a mock, revising a topic, handling an error pattern, or checking an exam requirement. Each guide must give the reader a concrete next action, not a generic list of keywords or a rewritten search result.
      </p>

      <h2>Official information</h2>
      <p>
        Syllabus, dates, eligibility, paper format, instructions and notices can change. For those claims, we cite or link the relevant issuing body. The official document remains the source of truth, and students should verify current instructions before making an application or exam-day decision.
      </p>

      <h2>AI-assisted learning</h2>
      <p>
        Some in-product learning explanations are generated in response to a student&apos;s topic or question. They are designed to support understanding and practice, but may need checking. Students should flag an unclear or inaccurate explanation through the feedback control or by emailing <a href="mailto:support@examgrind.in">support@examgrind.in</a>.
      </p>

      <h2>Corrections and updates</h2>
      <p>
        If we find that a factual statement is outdated, incomplete, or wrong, we correct it and update the page date. We welcome correction requests with a reliable primary source. We do not present preparation opinions as official policy or guarantee a result.
      </p>

      <h2>Advertising and independence</h2>
      <p>
        Advertising, where shown, is visually separate from editorial material. A paid placement does not determine what a guide says, which official source we link, or what a student should study.
      </p>
    </LegalPageLayout>
  );
}
