import type { Metadata } from "next";
import QuizRunner from "@/app/quiz/[id]/QuizRunner";

export const metadata: Metadata = {
  title: "ExamGrind reviewer quiz",
  robots: { index: false, follow: false },
};

const questions = [
  {
    id: "play-review-q1",
    question: "A shopkeeper marks an item 25% above its cost price and then gives a 10% discount. What is the profit percentage?",
    A: "10%",
    B: "12.5%",
    C: "15%",
    D: "22.5%",
  },
  {
    id: "play-review-q2",
    question: "If the cost price of 20 articles equals the selling price of 16 articles, what is the profit percentage?",
    A: "20%",
    B: "25%",
    C: "30%",
    D: "35%",
  },
  {
    id: "play-review-q3",
    question: "A discount of 20% is followed by another discount of 10%. What is the single equivalent discount?",
    A: "28%",
    B: "30%",
    C: "32%",
    D: "18%",
  },
] as const;

export default function PlayReviewQuizPage() {
  return (
    <QuizRunner
      quizId="play-review-quiz"
      topicLabel="Google Play reviewer demo · SSC CGL percentage change"
      questions={[...questions]}
      previewResultsHref="/play-review/results"
    />
  );
}
