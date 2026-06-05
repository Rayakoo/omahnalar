import { supabase } from "@/lib/supabaseClient";

// ── Quizzes ──────────────────────────────────────────────────
export type Quiz = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  urutan: number;
  created_at: string;
};

export async function getQuizzesByCourse(courseId: string) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("course_id", courseId)
    .order("urutan", { ascending: true });

  if (error) throw error;
  return data as Quiz[];
}

export async function getQuizById(id: string) {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Quiz;
}

export async function createQuiz(input: {
  course_id: string;
  title: string;
  description?: string;
  urutan?: number;
}) {
  const { data, error } = await supabase
    .from("quizzes")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as Quiz;
}

export async function updateQuiz(
  id: string,
  updates: Partial<Pick<Quiz, "title" | "description" | "urutan">>
) {
  const { data, error } = await supabase
    .from("quizzes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Quiz;
}

export async function deleteQuiz(id: string) {
  const { error } = await supabase.from("quizzes").delete().eq("id", id);
  if (error) throw error;
}

// ── Quiz Questions ───────────────────────────────────────────
export type QuizQuestion = {
  id: string;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  urutan: number;
  created_at: string;
};

export async function getQuizQuestions(quizId: string) {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("urutan", { ascending: true });

  if (error) throw error;
  return data as QuizQuestion[];
}

export async function createQuizQuestion(input: {
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  urutan?: number;
}) {
  const { data, error } = await supabase
    .from("quiz_questions")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as QuizQuestion;
}

export async function updateQuizQuestion(
  id: string,
  updates: Partial<Pick<QuizQuestion, "question_text" | "options" | "correct_answer" | "urutan">>
) {
  const { data, error } = await supabase
    .from("quiz_questions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as QuizQuestion;
}

export async function deleteQuizQuestion(id: string) {
  const { error } = await supabase
    .from("quiz_questions")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function getQuizWithQuestions(quizId: string) {
  const [quiz, questions] = await Promise.all([
    getQuizById(quizId),
    getQuizQuestions(quizId),
  ]);

  return { ...quiz, questions };
}

// ── Submit quiz (for logged-in users) ────────────────────────
export async function submitQuizResult(input: {
  user_id: string;
  quiz_id: string;
  answers: Record<string, string>; // { questionId: selectedAnswer }
}) {
  const questions = await getQuizQuestions(input.quiz_id);
  let score = 0;

  for (const q of questions) {
    if (input.answers[q.id] === q.correct_answer) {
      score++;
    }
  }

  const total = questions.length;
  const passed = score / total >= 0.75;

  const { data, error } = await supabase
    .from("user_quiz_results")
    .insert({
      user_id: input.user_id,
      quiz_id: input.quiz_id,
      score,
      total,
      passed,
    })
    .select()
    .single();

  if (error) throw error;
  return { result: data, score, total, passed };
}

export async function getUserQuizResults(userId: string, quizId: string) {
  const { data, error } = await supabase
    .from("user_quiz_results")
    .select("*")
    .eq("user_id", userId)
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
