// =====================================================================
// DB row shapes — matches the simplified schema (post-migration 005).
// =====================================================================

export type SubscriptionStatus = "free" | "trial" | "paid";
export type MasteryLevel = "novice" | "apprentice" | "adept" | "master";

/** A row from public.users. */
export type UserProfile = {
  id: string;
  email: string;
  exam_choice: string | null;
  subscription_status: SubscriptionStatus;
  xp: number;
  coins: number;
  level: number;
  quizzes_taken: number;
  analyses_taken: number;
  created_at: string;
  updated_at: string;
};

export type Subject = {
  id: string;
  name: string;
  cuet_code: string | null;
  icon: string | null;
  description: string | null;
  order_index: number;
};

export type Chapter = {
  id: string;
  subject_id: string;
  name: string;
  slug: string;
  ncert_class: number | null;
  cuet_unit: string | null;
  order_index: number;
};

export type Topic = {
  id: string;
  chapter_id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
};

export type UserTopicMastery = {
  user_id: string;
  topic_id: string;
  xp: number;
  questions_attempted: number;
  questions_correct: number;
  mastery_level: MasteryLevel;
  last_quizzed_at: string | null;
};

export type Quiz = {
  id: string;
  user_id: string;
  subject: string;
  topic: string | null;
  subtopic: string | null;
  chapter_id: string | null;
  topic_id: string | null;
  score: number | null;
  xp_awarded: number;
  coins_awarded: number;
  created_at: string;
};

export type Question = {
  id: string;
  quiz_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "A" | "B" | "C" | "D";
  user_answer: "A" | "B" | "C" | "D" | null;
  time_taken: number | null;
  created_at: string;
};

/** A topic enriched with the user's mastery for path-UI display. */
export type TopicWithMastery = Topic & {
  questions_correct: number;
  questions_attempted: number;
  mastery_level: MasteryLevel;
  /** Computed: 0 if never tried, fraction otherwise. */
  accuracy: number;
  /** Locked, available, or completed (≥70% accuracy). */
  status: "locked" | "available" | "completed";
};
