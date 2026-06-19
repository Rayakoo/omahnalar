import { getAccessToken, getValidToken } from "@/lib/supabaseClient";

export type Gallery = {
  id: string;
  url: string;
  created_at: string;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase env vars not set");
  return { url, anonKey };
}

async function supabaseGet<T>(path: string): Promise<T> {
  const { url, anonKey } = getSupabaseConfig();
  const headers: Record<string, string> = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
  };
  const res = await fetch(`${url}${path}`, { headers });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase GET failed: ${res.status} ${errText}`);
  }
  return res.json();
}

export async function getGalleries(limit = 15) {
  const data = await supabaseGet<Gallery[]>(
    `/rest/v1/galleries?select=*&order=created_at.desc&limit=${limit}`
  );
  return data || [];
}

export async function createGallery(url: string) {
  const { url: baseUrl, anonKey } = getSupabaseConfig();
  const token = await getValidToken().catch(() => getAccessToken());
  const res = await fetch(`${baseUrl}/rest/v1/galleries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Supabase insert failed: ${res.status} ${errText}`);
  }
  const data: Gallery[] = await res.json();
  if (!data || data.length === 0) throw new Error("No data returned");
  return data[0];
}

export async function deleteGallery(id: string) {
  const { url, anonKey } = getSupabaseConfig();
  const token = await getValidToken().catch(() => getAccessToken());
  const res = await fetch(`${url}/rest/v1/galleries?id=eq.${id}`, {
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
