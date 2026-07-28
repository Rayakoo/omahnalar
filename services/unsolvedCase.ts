import { getSupabase, getAccessToken, getValidToken } from "@/lib/supabaseClient";
import type { UnsolvedCase, UserDetective, UnsolvedCaseHint, UnsolvedCaseHintPayload } from "@/types/unsolvedCase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function headers(token?: string) {
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_KEY,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function authHeaders() {
  let token: string | undefined;
  try { token = getAccessToken(); } catch { /* noop */ }
  return headers(token);
}

export async function getUnsolvedCase(courseId: string): Promise<UnsolvedCase | null> {
  const { data } = await getSupabase()
    .from("unsolved_cases")
    .select("*")
    .eq("course_id", courseId)
    .maybeSingle();
  return data;
}

export async function getUnsolvedCaseById(id: string): Promise<UnsolvedCase | null> {
  const { data } = await getSupabase()
    .from("unsolved_cases")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function createUnsolvedCase(input: Partial<UnsolvedCase>): Promise<UnsolvedCase> {
  const token = await getValidToken().catch(() => getAccessToken());
  const res = await fetch(`${SUPABASE_URL}/rest/v1/unsolved_cases?select=*`, {
    method: "POST",
    headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Gagal membuat unsolved case");
  const data: UnsolvedCase[] = await res.json();
  return data[0];
}

export async function updateUnsolvedCase(id: string, input: Partial<UnsolvedCase>): Promise<void> {
  const token = await getValidToken().catch(() => getAccessToken());
  await fetch(`${SUPABASE_URL}/rest/v1/unsolved_cases?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...headers(token), Prefer: "return=minimal" },
    body: JSON.stringify({ ...input, updated_at: new Date().toISOString() }),
  });
}

export async function submitDetective(input: Partial<UserDetective>): Promise<UserDetective> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_detectives?select=*`, {
    method: "POST",
    headers: { ...headers(), Prefer: "return=representation" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Gagal mengirim laporan");
  const data: UserDetective[] = await res.json();
  return data[0];
}

export async function getDetectives(unsolvedCaseId: string): Promise<UserDetective[]> {
  const { data } = await getSupabase()
    .from("user_detectives")
    .select("*")
    .eq("unsolved_case_id", unsolvedCaseId)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getHints(unsolvedCaseId: string): Promise<UnsolvedCaseHint[]> {
  const { data } = await getSupabase()
    .from("unsolved_case_hints")
    .select("*")
    .eq("unsolved_case_id", unsolvedCaseId)
    .order("urutan");
  return data || [];
}

export async function createHint(input: UnsolvedCaseHintPayload): Promise<UnsolvedCaseHint> {
  const token = await getValidToken().catch(() => getAccessToken());
  const res = await fetch(`${SUPABASE_URL}/rest/v1/unsolved_case_hints?select=*`, {
    method: "POST",
    headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Gagal membuat hint");
  const data: UnsolvedCaseHint[] = await res.json();
  return data[0];
}

export async function updateHint(id: string, input: Partial<UnsolvedCaseHintPayload>): Promise<void> {
  const token = await getValidToken().catch(() => getAccessToken());
  await fetch(`${SUPABASE_URL}/rest/v1/unsolved_case_hints?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...headers(token), Prefer: "return=minimal" },
    body: JSON.stringify({ ...input, updated_at: new Date().toISOString() }),
  });
}

export async function deleteHint(id: string): Promise<void> {
  const { error } = await getSupabase().from("unsolved_case_hints").delete().eq("id", id);
  if (error) throw error;
}

export async function updateHintOrder(updates: { id: string; urutan: number }[]): Promise<void> {
  const h = await authHeaders();
  await Promise.all(
    updates.map((u) =>
      fetch(`${SUPABASE_URL}/rest/v1/unsolved_case_hints?id=eq.${u.id}`, {
        method: "PATCH",
        headers: { ...h, Prefer: "return=minimal" },
        body: JSON.stringify({ urutan: u.urutan }),
      })
    )
  );
}

export async function getNextHintUrutan(unsolvedCaseId: string): Promise<number> {
  const hints = await getHints(unsolvedCaseId);
  if (hints.length === 0) return 0;
  return Math.max(...hints.map((h) => h.urutan)) + 1;
}
