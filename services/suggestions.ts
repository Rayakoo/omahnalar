import { getAccessToken, getValidToken } from "@/lib/supabaseClient";

export type SuggestionStatus = "pending" | "approved" | "rejected";

export type Suggestion = {
  id: string;
  name: string;
  category: string;
  content: string;
  is_anonymous: boolean;
  status: SuggestionStatus;
  created_at: string;
  updated_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getValidToken().catch(() => getAccessToken());
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getAllSuggestions() {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/suggestions?select=*&order=created_at.desc`,
    { headers: await authHeaders() },
  );

  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Suggestion[];
}

export async function updateSuggestionStatus(
  id: string,
  status: SuggestionStatus,
) {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/suggestions?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        ...(await authHeaders()),
        Prefer: "return=representation",
      },
      body: JSON.stringify({ status }),
    },
  );

  if (!res.ok) throw new Error(await res.text());
  const data = (await res.json()) as Suggestion[];
  return data[0];
}

export async function deleteSuggestion(id: string) {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/suggestions?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        ...(await authHeaders()),
        Prefer: "return=minimal",
      },
    },
  );

  if (!res.ok) throw new Error(await res.text());
}
