import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");
    _client = createClient(url, key);
  }
  return _client;
}

export function getAccessToken(): string {
  const key = Object.keys(localStorage).find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
  if (!key) throw new Error("No session in localStorage");
  const parsed = JSON.parse(localStorage.getItem(key)!);
  const token = parsed?.access_token;
  if (!token) throw new Error("No access token");
  return token;
}
