import { getAccessToken } from "@/lib/supabaseClient";

export type ImageUrl = { url: string; is_thumbnail: boolean };

export type Berita = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: ImageUrl[];
  author: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateBeritaInput = {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image_url?: ImageUrl[];
  author: string;
  is_published?: boolean;
  published_at?: string;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase env vars not set");
  return { url, anonKey };
}

async function supabaseGet<T>(path: string): Promise<T> {
  const { url, anonKey } = getSupabaseConfig();
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

export async function getBerita(includeAll?: boolean) {
  let path = `/rest/v1/berita?select=*`;
  if (!includeAll) path += `&is_published=eq.true`;
  path += `&order=published_at.desc.nullslast`;
  return supabaseGet<Berita[]>(path);
}

export async function getBeritaBySlug(slug: string) {
  const data = await supabaseGet<Berita[]>(
    `/rest/v1/berita?select=*&slug=eq.${encodeURIComponent(slug)}`
  );
  if (!data || data.length === 0) throw new Error("Berita not found");
  return data[0];
}

export async function getBeritaById(id: string) {
  const data = await supabaseGet<Berita[]>(
    `/rest/v1/berita?select=*&id=eq.${encodeURIComponent(id)}`
  );
  if (!data || data.length === 0) throw new Error("Berita not found");
  return data[0];
}

export async function createBerita(input: CreateBeritaInput) {
  console.log("[createBerita] input:", JSON.stringify(input, null, 2));
  const payload = {
    title: input.title,
    slug: input.slug,
    content: input.content,
    excerpt: input.excerpt ?? null,
    image_url: input.image_url ?? [],
    author: input.author,
    is_published: input.is_published ?? false,
    published_at: input.published_at ?? null,
  };
  console.log("[createBerita] payload:", JSON.stringify(payload, null, 2));

  const { url, anonKey } = getSupabaseConfig();
  const token = getAccessToken();
  const res = await fetch(`${url}/rest/v1/berita`, {
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
    console.error("[createBerita] fetch error:", res.status, errText);
    throw new Error(`Supabase insert failed: ${res.status} ${errText}`);
  }
  const data: Berita[] = await res.json();
  console.log("[createBerita] fetch success:", data);
  if (!data || data.length === 0) throw new Error("No data returned");
  return data[0];
}

export async function updateBerita(
  id: string,
  updates: Partial<Pick<Berita, "title" | "slug" | "content" | "excerpt" | "image_url" | "author" | "is_published" | "published_at">>
) {
  const { url, anonKey } = getSupabaseConfig();
  const token = getAccessToken();
  const res = await fetch(`${url}/rest/v1/berita?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase update failed: ${res.status} ${errText}`);
  }
  const data: Berita[] = await res.json();
  if (!data || data.length === 0) throw new Error("No data returned");
  return data[0];
}

export async function deleteBerita(id: string) {
  const { url, anonKey } = getSupabaseConfig();
  const token = getAccessToken();
  const res = await fetch(`${url}/rest/v1/berita?id=eq.${id}`, {
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
