import { type createServerSupabase } from "@/lib/supabase/server";

type ServerSupabase = ReturnType<typeof createServerSupabase>;

type ExamProfile = { exam_choice: string | null };
type ExamRow = { id: string };
type SubjectRow = { id: string };
type TopicRow = {
  id: string;
  chapters: { subject_id: string } | { subject_id: string }[];
};

/**
 * Keeps practice evidence attached to the exam currently selected by a user.
 *
 * Subject labels are deliberately not used: names such as Physics can exist in
 * more than one exam. A quiz is included only when its persisted topic maps
 * through chapter -> subject -> active exam. Older quizzes without topic_id
 * are excluded rather than risking an incorrect cross-exam report.
 */
export async function scopeQuizzesToActiveExam<T extends { topic_id: string | null }>(
  supabase: ServerSupabase,
  userId: string,
  quizzes: T[],
): Promise<T[]> {
  if (quizzes.length === 0) return quizzes;

  const { data: profile } = await supabase
    .from("users")
    .select("exam_choice")
    .eq("id", userId)
    .maybeSingle<ExamProfile>();
  const { data: exam } = await supabase
    .from("exams")
    .select("id")
    .eq("slug", profile?.exam_choice ?? "cuet")
    .maybeSingle<ExamRow>();

  if (!exam?.id) return [];

  const { data: subjectsRaw } = await supabase
    .from("subjects")
    .select("id")
    .eq("exam_id", exam.id);
  const activeSubjectIds = new Set(
    ((subjectsRaw ?? []) as SubjectRow[]).map((subject) => subject.id),
  );
  if (activeSubjectIds.size === 0) return [];

  const topicIds = quizzes.flatMap((quiz) => quiz.topic_id ? [quiz.topic_id] : []);
  if (topicIds.length === 0) return [];

  const { data: topicsRaw } = await supabase
    .from("topics")
    .select("id, chapters!inner(subject_id)")
    .in("id", topicIds);
  const activeTopicIds = new Set(
    ((topicsRaw ?? []) as TopicRow[])
      .filter((topic) => {
        const chapter = Array.isArray(topic.chapters)
          ? topic.chapters[0]
          : topic.chapters;
        return chapter && activeSubjectIds.has(chapter.subject_id);
      })
      .map((topic) => topic.id),
  );

  return quizzes.filter(
    (quiz) => quiz.topic_id !== null && activeTopicIds.has(quiz.topic_id),
  );
}
