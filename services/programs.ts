import { getAccessToken } from "@/lib/supabaseClient";

export type ImageUrl = { url: string; is_thumbnail: boolean };

export type Program = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  period: string;
  location: string;
  image_url: ImageUrl[];
  tagline: string;
  descriptions: string[];
  target: string[];
  goals: string[];
  created_at: string;
};

export type CreateProgramInput = {
  slug: string;
  title: string;
  tag: string;
  period: string;
  location: string;
  image_url: ImageUrl[];
  tagline: string;
  descriptions?: string[];
  target?: string[];
  goals?: string[];
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
if (!url || !anonKey) throw new Error("Supabase env vars not set");

async function supabaseGet<T>(path: string): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${url}${path}`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase GET failed: ${res.status} ${errText}`);
  }
  return res.json();
}

export async function getPrograms() {
  return supabaseGet<Program[]>("/rest/v1/programs?select=*&order=created_at.asc");
}

export async function createProgram(input: CreateProgramInput) {
  console.log("[createProgram] input:", JSON.stringify(input, null, 2));
  const payload = {
    slug: input.slug,
    title: input.title,
    tag: input.tag,
    period: input.period,
    location: input.location,
    image_url: input.image_url,
    tagline: input.tagline,
    descriptions: input.descriptions ?? [],
    target: input.target ?? [],
    goals: input.goals ?? [],
  };
  console.log("[createProgram] payload:", JSON.stringify(payload, null, 2));

  const token = getAccessToken();
  const res = await fetch(`${url}/rest/v1/programs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error("[createProgram] fetch error:", res.status, errText);
    throw new Error(`Supabase insert failed: ${res.status} ${errText}`);
  }
  const data: Program[] = await res.json();
  console.log("[createProgram] fetch success:", data);
  if (!data || data.length === 0) throw new Error("No data returned");
  return data[0];
}

export async function getProgramBySlug(slug: string) {
  const data = await supabaseGet<Program[]>(
    `/rest/v1/programs?select=*&slug=eq.${encodeURIComponent(slug)}`
  );
  if (!data || data.length === 0) throw new Error("Program not found");
  return data[0];
}

export async function getProgramById(id: string) {
  const data = await supabaseGet<Program[]>(
    `/rest/v1/programs?select=*&id=eq.${encodeURIComponent(id)}`
  );
  if (!data || data.length === 0) throw new Error("Program not found");
  return data[0];
}

export async function updateProgram(
  id: string,
  updates: Partial<Pick<Program, "slug" | "title" | "tag" | "period" | "location" | "image_url" | "tagline" | "descriptions" | "target" | "goals">>
) {
  const token = getAccessToken();
  const res = await fetch(`${url}/rest/v1/programs?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase update failed: ${res.status} ${errText}`);
  }
  const data: Program[] = await res.json();
  if (!data || data.length === 0) throw new Error("No data returned");
  return data[0];
}

export async function deleteProgram(id: string) {
  const token = getAccessToken();
  const res = await fetch(`${url}/rest/v1/programs?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase delete failed: ${res.status} ${errText}`);
  }
}
