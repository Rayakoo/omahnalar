import { getSupabase, getAccessToken } from "@/lib/supabaseClient";

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
  const { data, error } = await getSupabase()
    .from("quizzes")
    .select("*")
    .eq("course_id", courseId)
    .order("urutan", { ascending: true });

  if (error) throw error;
  return data as Quiz[];
}

export async function getQuizById(id: string) {
  const { data, error } = await getSupabase()
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
  const token = getAccessToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/quizzes?select=*`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${token}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(input),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase POST failed: ${res.status} ${errText}`);
  }
  const data: Quiz[] = await res.json();
  if (!data || data.length === 0) throw new Error("No data returned");
  return data[0];
}

export async function updateQuiz(
  id: string,
  updates: Partial<Pick<Quiz, "title" | "description" | "urutan">>
) {
  const token = getAccessToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/quizzes?id=eq.${id}&select=*`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${token}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(updates),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase PATCH failed: ${res.status} ${errText}`);
  }
  const data: Quiz[] = await res.json();
  if (!data || data.length === 0) throw new Error("No data returned");
  return data[0];
}

export async function deleteQuiz(id: string) {
  const token = getAccessToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/quizzes?id=eq.${id}`,
    {
      method: "DELETE",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase DELETE failed: ${res.status} ${errText}`);
  }
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
  const { data, error } = await getSupabase()
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
  const token = getAccessToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/quiz_questions?select=*`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${token}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(input),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase POST failed: ${res.status} ${errText}`);
  }
  const data: QuizQuestion[] = await res.json();
  if (!data || data.length === 0) throw new Error("No data returned");
  return data[0];
}

export async function updateQuizQuestion(
  id: string,
  updates: Partial<Pick<QuizQuestion, "question_text" | "options" | "correct_answer" | "urutan">>
) {
  const token = getAccessToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/quiz_questions?id=eq.${id}&select=*`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${token}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(updates),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase PATCH failed: ${res.status} ${errText}`);
  }
  const data: QuizQuestion[] = await res.json();
  if (!data || data.length === 0) throw new Error("No data returned");
  return data[0];
}

export async function deleteQuizQuestion(id: string) {
  const token = getAccessToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/quiz_questions?id=eq.${id}`,
    {
      method: "DELETE",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase DELETE failed: ${res.status} ${errText}`);
  }
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
  answers: Record<string, string>;
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

  const token = getAccessToken();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_quiz_results?select=*`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${token}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_id: input.user_id,
        quiz_id: input.quiz_id,
        score,
        total,
        passed,
      }),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase POST failed: ${res.status} ${errText}`);
  }
  const data = await res.json();
  if (!data || data.length === 0) throw new Error("No data returned");
  return { result: data[0], score, total, passed };
}

export async function getUserQuizResults(userId: string, quizId: string) {
  const { data, error } = await getSupabase()
    .from("user_quiz_results")
    .select("*")
    .eq("user_id", userId)
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
