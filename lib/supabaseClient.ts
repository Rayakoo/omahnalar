import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getAccessToken(): string {
  const key = Object.keys(localStorage).find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
  if (!key) throw new Error("No session in localStorage");
  const parsed = JSON.parse(localStorage.getItem(key)!);
  const token = parsed?.access_token;
  if (!token) throw new Error("No access token");
  return token;
}
