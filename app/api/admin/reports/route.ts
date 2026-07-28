import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

async function supabaseGet(path: string, authHeader: string) {
  const headers: Record<string, string> = { apikey: supabaseAnonKey };
  if (authHeader) headers["Authorization"] = authHeader;

  const res = await fetch(`${supabaseUrl}${path}`, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  return res.json();
}

export async function GET(request: Request) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase env vars not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("Authorization") || "";

  const queries = [
    supabaseGet("/rest/v1/profiles?select=id,full_name,role,created_at", authHeader).catch((e) => { console.error("profiles fail", e); return []; }),
    supabaseGet("/rest/v1/user_courses?select=*", authHeader).catch((e) => { console.error("user_courses fail", e); return []; }),
    supabaseGet("/rest/v1/user_quiz_results?select=*", authHeader).catch((e) => { console.error("user_quiz_results fail", e); return []; }),
    supabaseGet("/rest/v1/courses?select=id,title,jumlah_isi", authHeader).catch((e) => { console.error("courses fail", e); return []; }),
    supabaseGet("/rest/v1/quizzes?select=id,title,course_id", authHeader).catch((e) => { console.error("quizzes fail", e); return []; }),
  ];

  const [profiles, enrollments, quizResults, courses, quizzes] = await Promise.all(queries);

  const courseMap: Record<string, { title: string; jumlah_isi: number }> = {};
  for (const c of courses) {
    courseMap[c.id] = { title: c.title, jumlah_isi: c.jumlah_isi || 0 };
  }

  const quizMap: Record<string, { title: string; course_id: string }> = {};
  for (const q of quizzes) {
    quizMap[q.id] = { title: q.title, course_id: q.course_id };
  }

  const enrollmentByUser: Record<string, any[]> = {};
  for (const e of enrollments) {
    if (!enrollmentByUser[e.user_id]) enrollmentByUser[e.user_id] = [];
    enrollmentByUser[e.user_id].push(e);
  }

  const resultsByUser: Record<string, any[]> = {};
  for (const r of quizResults) {
    if (!resultsByUser[r.user_id]) resultsByUser[r.user_id] = [];
    resultsByUser[r.user_id].push(r);
  }

  function mapEnrollments(userId: string) {
    return (enrollmentByUser[userId] || []).map((e) => {
      const c = courseMap[e.course_id] || { title: "Unknown", jumlah_isi: 0 };
      return {
        course_id: e.course_id,
        course_title: c.title,
        course_jumlah_isi: c.jumlah_isi,
        current_urutan: e.current_urutan,
        is_completed: e.is_completed,
        completed_at: e.completed_at,
        total_duration_seconds: e.total_duration_seconds ?? 0,
      };
    });
  }

  function mapQuizResults(userId: string) {
    return (resultsByUser[userId] || []).map((r) => {
      const q = quizMap[r.quiz_id] || { title: "Unknown", course_id: "" };
      const c = courseMap[q.course_id] || { title: "", jumlah_isi: 0 };
      return {
        quiz_id: r.quiz_id,
        quiz_title: q.title,
        course_title: c.title,
        score: r.score,
        total: r.total,
        passed: r.passed,
        duration_seconds: r.duration_seconds ?? 0,
        created_at: r.created_at,
      };
    });
  }

  const allUserIds = new Set([
    ...profiles.map((p: any) => p.id),
    ...enrollments.map((e: any) => e.user_id),
    ...quizResults.map((r: any) => r.user_id),
  ]);

  const profileMap: Record<string, { full_name: string; role: string; created_at: string }> = {};
  for (const p of profiles) {
    profileMap[p.id] = { full_name: p.full_name, role: p.role, created_at: p.created_at };
  }

  const users = Array.from(allUserIds).map((id) => {
    const profile = profileMap[id as string];
    return {
      id,
      name: profile?.full_name || "Tanpa Nama",
      role: profile?.role || "user",
      created_at: profile?.created_at || "",
      enrollments: mapEnrollments(id as string),
      quizResults: mapQuizResults(id as string),
    };
  });

  return NextResponse.json({ users, courses });
}
