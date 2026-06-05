import { supabase, getAccessToken } from "@/lib/supabaseClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase env vars not set");

// ── Categories & Levels ──────────────────────────────────────
export type Category = { id: string; name: string; slug: string };
export type EducationLevel = { id: string; name: string; slug: string };

export async function getCategories() {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data as Category[];
}

export async function getEducationLevels() {
  const { data, error } = await supabase.from("education_levels").select("*");
  if (error) throw error;
  return data as EducationLevel[];
}

// ── Courses ──────────────────────────────────────────────────
export type Course = {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  education_level_id: string;
  created_at: string;
};

export type CourseWithRelations = Course & {
  category: Category;
  education_level: EducationLevel;
};

export async function getCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*, category:categories(*), education_level:education_levels(*)")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as CourseWithRelations[];
}

export async function getCoursesByCategory(categorySlug: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*, category:categories(*), education_level:education_levels(*)")
    .eq("category.slug", categorySlug)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as CourseWithRelations[];
}

export async function getCourseById(id: string) {
  const token = getAccessToken();
  const res = await fetch(
    `${supabaseUrl}/rest/v1/courses?id=eq.${id}&select=*,category:categories(*),education_level:education_levels(*)`,
    { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase GET failed: ${res.status} ${errText}`);
  }
  const data: CourseWithRelations[] = await res.json();
  if (!data || data.length === 0) throw new Error("Course not found");
  return data[0];
}

export type CreateCourseInput = {
  title: string;
  description?: string;
  category_id: string;
  education_level_id: string;
};

export async function createCourse(input: CreateCourseInput) {
  const { data, error } = await supabase
    .from("courses")
    .insert(input)
    .select("*, category:categories(*), education_level:education_levels(*)")
    .single();

  if (error) throw error;
  return data as CourseWithRelations;
}

export async function updateCourse(
  id: string,
  updates: Partial<Pick<Course, "title" | "description" | "category_id" | "education_level_id">>
) {
  const token = getAccessToken();
  const res = await fetch(
    `${supabaseUrl}/rest/v1/courses?id=eq.${id}&select=*,category:categories(*),education_level:education_levels(*)`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
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
  const data: CourseWithRelations[] = await res.json();
  if (!data || data.length === 0) throw new Error("No data returned");
  return data[0];
}

export async function deleteCourse(id: string) {
  const token = getAccessToken();
  const res = await fetch(`${supabaseUrl}/rest/v1/courses?id=eq.${id}`, {
    method: "DELETE",
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase delete failed: ${res.status} ${errText}`);
  }
}

// ── Course Videos ────────────────────────────────────────────
export type CourseVideo = {
  id: string;
  course_id: string;
  title: string;
  video_url: string;
  urutan: number;
  created_at: string;
};

export async function getCourseVideos(courseId: string) {
  const { data, error } = await supabase
    .from("course_videos")
    .select("*")
    .eq("course_id", courseId)
    .order("urutan", { ascending: true });

  if (error) throw error;
  return data as CourseVideo[];
}

export async function createCourseVideo(input: {
  course_id: string;
  title: string;
  video_url: string;
  urutan?: number;
}) {
  const { data, error } = await supabase
    .from("course_videos")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as CourseVideo;
}

export async function updateCourseVideo(
  id: string,
  updates: Partial<Pick<CourseVideo, "title" | "video_url" | "urutan">>
) {
  const { data, error } = await supabase
    .from("course_videos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as CourseVideo;
}

export async function deleteCourseVideo(id: string) {
  const { error } = await supabase
    .from("course_videos")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// ── Course Materials ─────────────────────────────────────────
export type CourseMaterial = {
  id: string;
  course_id: string;
  title: string;
  content: string;
  urutan: number;
  created_at: string;
};

export async function getCourseMaterials(courseId: string) {
  const { data, error } = await supabase
    .from("course_materials")
    .select("*")
    .eq("course_id", courseId)
    .order("urutan", { ascending: true });

  if (error) throw error;
  return data as CourseMaterial[];
}

export async function createCourseMaterial(input: {
  course_id: string;
  title: string;
  content: string;
  urutan?: number;
}) {
  const { data, error } = await supabase
    .from("course_materials")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as CourseMaterial;
}

export async function updateCourseMaterial(
  id: string,
  updates: Partial<Pick<CourseMaterial, "title" | "content" | "urutan">>
) {
  const { data, error } = await supabase
    .from("course_materials")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as CourseMaterial;
}

export async function deleteCourseMaterial(id: string) {
  const { error } = await supabase
    .from("course_materials")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// ── Get full content of a course (all sections ordered by urutan) ──
export type CourseSection =
  | { type: "video"; data: CourseVideo }
  | { type: "materi"; data: CourseMaterial }
  | { type: "quiz"; data: { id: string; title: string; urutan: number } };

export async function getCourseSections(courseId: string) {
  const [videos, materials, quizzes] = await Promise.all([
    getCourseVideos(courseId),
    getCourseMaterials(courseId),
    supabase
      .from("quizzes")
      .select("id, title, urutan")
      .eq("course_id", courseId)
      .order("urutan", { ascending: true })
      .then(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
  ]);

  const sections: CourseSection[] = [
    ...videos.map((v) => ({ type: "video" as const, data: v })),
    ...materials.map((m) => ({ type: "materi" as const, data: m })),
    ...quizzes.map((q) => ({ type: "quiz" as const, data: q })),
  ];

  sections.sort((a, b) => a.data.urutan - b.data.urutan);
  return sections;
}
