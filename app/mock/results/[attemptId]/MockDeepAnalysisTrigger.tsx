"use client";

import DeepAnalysis, {
  type AnalysisJson,
} from "@/app/results/[id]/DeepAnalysis";

/**
 * Mock Deep Analysis section on /mock/results/[attemptId].
 *
 * Thin wrapper around the chapter-quiz <DeepAnalysis> component that
 * points it at /api/mock/analyze instead of /api/quiz/analyze.
 * Same JSON shape comes back, same UI rendering — the only delta is
 * the endpoint (and the id field name in the request body).
 *
 * Why not a fresh component:
 *   AnalysisJson is identical between quizzes and mocks, and re-render-
 *   ing the Read / Watch / Work / Drill ladder, the pacing block, and
 *   the per-question table is ~400 lines that already work. Reusing
 *   DeepAnalysis is the only sane choice.
 *
 * Drill button behaviour:
 *   The drill button is gated on topicId being non-null. Mocks span
 *   multiple topics so we pass null — the button auto-hides. The user
 *   can still drill manually via the chapter quiz path.
 */
type Props = {
  attemptId: string;
  initialAnalysis: AnalysisJson | null;
  initialIsDeepDive: boolean;
  freeAnalysisUsed: boolean;
  isPaid: boolean;
};

export default function MockDeepAnalysisTrigger({
  attemptId,
  initialAnalysis,
  initialIsDeepDive,
  freeAnalysisUsed,
  isPaid,
}: Props) {
  return (
    <DeepAnalysis
      quizId={attemptId}
      topicId={null}
      initialAnalysis={initialAnalysis}
      initialIsDeepDive={initialIsDeepDive}
      freeAnalysisUsed={freeAnalysisUsed}
      isPaid={isPaid}
      analyzeEndpoint="/api/mock/analyze"
      analyzeIdField="attemptId"
    />
  );
}
