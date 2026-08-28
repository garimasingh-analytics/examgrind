import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "About ExamGrind",
  description: "What ExamGrind helps exam aspirants do: identify weak topics, learn deliberately, practise and retest.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <LegalPageLayout title="About ExamGrind" updated="Last updated: 23 August 2026">
      <p>
        ExamGrind is a practice and learning companion for Indian competitive-exam aspirants. It is built for the moment after a question goes wrong: not just showing a score, but helping a student identify what failed, decide what to learn next, practise that exact area, and retest it.
      </p>

      <h2>What we do</h2>
      <ul>
        <li>Offer exam-focused quizzes, topic practice and mock-style attempts.</li>
        <li>Help students classify mistakes: concept gaps, application errors, time decisions and reading mistakes.</li>
        <li>Provide a Coach learning route for understanding a topic before returning to practice.</li>
        <li>Publish free, original preparation guides and link students to official exam sources for changing rules and notices.</li>
      </ul>

      <h2>What we do not promise</h2>
      <p>
        ExamGrind does not guarantee a rank, score, selection, admission or job. AI-generated explanations and study suggestions are learning aids, not a substitute for the current official notice, a qualified teacher, or a student&apos;s own judgment.
      </p>

      <h2>How our free guides are made</h2>
      <p>
        We write practical study guidance in our own words. When a guide mentions dates, eligibility, syllabus, exam pattern or another changing rule, we link to the issuing body and ask readers to verify the latest official document before acting on it. Preparation advice is clearly labelled as guidance rather than an official rule.
      </p>

      <h2>Who operates ExamGrind</h2>
      <p>
        ExamGrind is operated by <strong>Mobizone Technologies Private Limited</strong>. For support, corrections, privacy questions, or a concern about any page, contact us at <a href="mailto:support@examgrind.in">support@examgrind.in</a> or visit our <a href="/contact">contact page</a>.
      </p>
    </LegalPageLayout>
  );
}
