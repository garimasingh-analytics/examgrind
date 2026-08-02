import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin-auth";
import QuizRunner from "@/app/quiz/[id]/QuizRunner";

export const dynamic = "force-dynamic";

const previewQuestions = [
  {
    id: "founder-preview-q1",
    question: "A shopkeeper marks an item 25% above its cost price and then gives a 10% discount. What is the profit percentage?",
    A: "10%",
    B: "12.5%",
    C: "15%",
    D: "22.5%",
  },
  {
    id: "founder-preview-q2",
    question: "If the cost price of 20 articles equals the selling price of 16 articles, what is the profit percentage?",
    A: "20%",
    B: "25%",
    C: "30%",
    D: "35%",
  },
  {
    id: "founder-preview-q3",
    question: "A discount of 20% is followed by another discount of 10%. What is the single equivalent discount?",
    A: "28%",
    B: "30%",
    C: "32%",
    D: "18%",
  },
] as const;

export default async function FounderQuizPreviewPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) redirect("/home");

  return (
    <QuizRunner
      quizId="founder-quiz-preview"
      topicLabel="Founder preview · Basic Profit/Loss"
      questions={[...previewQuestions]}
      previewResultsHref="/admin/experience-preview/results"
    />
  );
}
