import { supabase } from "@/lib/supabaseClient";

// ── User Course Progress ─────────────────────────────────────
export type UserCourse = {
  id: string;
  user_id: string;
  course_id: string;
  current_urutan: number;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getUserCourse(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from("user_courses")
    .select("*")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (error) throw error;
  return data as UserCourse | null;
}

export async function enrollCourse(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from("user_courses")
    .insert({ user_id: userId, course_id: courseId })
    .select()
    .single();

  if (error) throw error;
  return data as UserCourse;
}

export async function updateProgress(
  userId: string,
  courseId: string,
  urutan: number
) {
  const { data, error } = await supabase
    .from("user_courses")
    .update({ current_urutan: urutan })
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .select()
    .single();

  if (error) throw error;
  return data as UserCourse;
}

export async function completeCourse(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from("user_courses")
    .update({
      is_completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .select()
    .single();

  if (error) throw error;
  return data as UserCourse;
}

export async function getUserCourses(userId: string) {
  const { data, error } = await supabase
    .from("user_courses")
    .select("*, course:courses(*)")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

// ── User Quiz Results ────────────────────────────────────────
export type UserQuizResult = {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total: number;
  passed: boolean;
  created_at: string;
};

export async function getUserQuizResults(userId: string, quizId: string) {
  const { data, error } = await supabase
    .from("user_quiz_results")
    .select("*")
    .eq("user_id", userId)
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as UserQuizResult[];
}

export async function getLatestQuizResult(userId: string, quizId: string) {
  const { data, error } = await supabase
    .from("user_quiz_results")
    .select("*")
    .eq("user_id", userId)
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as UserQuizResult | null;
}
