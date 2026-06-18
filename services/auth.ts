import { getSupabase, getAccessToken } from "@/lib/supabaseClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase env vars not set");
  return { url: supabaseUrl, anonKey: supabaseAnonKey };
}

export type Profile = {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
  };
};

// ── Sign Up ──────────────────────────────────────────────────
export async function signUp(email: string, password: string, fullName?: string) {
  const { url, anonKey } = getSupabaseConfig();
  const res = await fetch(`${url}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
    },
    body: JSON.stringify({
      email,
      password,
      data: { full_name: fullName ?? "", role: "user" },
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || err.error || "Sign up failed");
  }
  const data = await res.json();
  return {
    user: data.user
      ? {
          id: data.user.id,
          email: data.user.email!,
          user_metadata: {
            full_name: data.user.user_metadata?.full_name as string | undefined,
            avatar_url: data.user.user_metadata?.avatar_url as string | undefined,
            role: data.user.user_metadata?.role as string | undefined,
          },
        }
      : null,
    session: null,
  };
}

// ── Sign In ──────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { url, anonKey } = getSupabaseConfig();
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || err.error || "Login failed");
  }
  const data = await res.json();

  // Hapus session lama sebelum simpan yang baru
  const oldKey = Object.keys(localStorage).find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
  if (oldKey) localStorage.removeItem(oldKey);

  const projectId = url.match(/\/\/([^.]+)/)?.[1] ?? "local";
  const storageKey = `sb-${projectId}-auth-token`;

  localStorage.setItem(
    storageKey,
    JSON.stringify({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + (data.expires_in || 3600) * 1000,
      user: data.user,
    })
  );

  const role = await getUserRole(data.user.id, data.access_token);

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      user_metadata: {
        full_name: data.user.user_metadata?.full_name as string | undefined,
        avatar_url: data.user.user_metadata?.avatar_url as string | undefined,
        role: role || data.user.user_metadata?.role || "user",
      },
    },
    session: { access_token: data.access_token, refresh_token: data.refresh_token },
  };
}

// ── Sign Out ─────────────────────────────────────────────────
export async function signOut() {
  try {
    const { url, anonKey } = getSupabaseConfig();
    const token = getAccessToken();
    await fetch(`${url}/auth/v1/logout`, {
      method: "POST",
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
    });
  } catch {}
  // Hapus session dari localStorage
  const key = Object.keys(localStorage).find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
  if (key) localStorage.removeItem(key);
}

// ── Get Current User ─────────────────────────────────────────
export async function getCurrentUser() {
  try {
    const token = getAccessToken();
    const { url, anonKey } = getSupabaseConfig();
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const userData = await res.json();
    if (!userData?.id) return null;

    const role = await getUserRole(userData.id, token);

    return {
      id: userData.id,
      email: userData.email!,
      user_metadata: {
        full_name: userData.user_metadata?.full_name as string | undefined,
        avatar_url: userData.user_metadata?.avatar_url as string | undefined,
        role: role || userData.user_metadata?.role || "user",
      },
    } as User;
  } catch {
    return null;
  }
}

// ── Get Session ──────────────────────────────────────────────
export async function getSession() {
  try {
    const token = getAccessToken();
    return { access_token: token };
  } catch {
    return null;
  }
}

// ── Reset Password ───────────────────────────────────────────
export async function resetPassword(email: string) {
  const { url, anonKey } = getSupabaseConfig();
  const res = await fetch(`${url}/auth/v1/recover`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
    },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || err.error || "Reset password failed");
  }
}

// ── Update Password ──────────────────────────────────────────
export async function updatePassword(newPassword: string) {
  const token = getAccessToken();
  const { url, anonKey } = getSupabaseConfig();
  const res = await fetch(`${url}/auth/v1/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password: newPassword }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || err.error || "Update password failed");
  }
}

// ── Update Profile ──────────────────────────────────────────
export async function updateProfile(input: { full_name?: string; avatar_url?: string }) {
  const token = getAccessToken();
  const { url, anonKey } = getSupabaseConfig();
  const res = await fetch(`${url}/auth/v1/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: input }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.msg || err.error || "Update profile failed");
  }
}

export async function getUserRole(userId: string, accessToken?: string) {
  const token = accessToken || getAccessToken();
  const { url, anonKey } = getSupabaseConfig();
  const res = await fetch(`${url}/rest/v1/profiles?select=role&id=eq.${userId}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return "user";
  const data = await res.json();
  return (data?.[0]?.role as string) || "user";
}

// ── Auth State Listener ──────────────────────────────────────
export function onAuthStateChange(callback: (user: User | null) => void) {
  const { data } = getSupabase().auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const role = await getUserRole(session.user.id, session.access_token);
      callback({
        id: session.user.id,
        email: session.user.email!,
        user_metadata: {
          full_name: session.user.user_metadata?.full_name as string | undefined,
          avatar_url: session.user.user_metadata?.avatar_url as string | undefined,
          role: role || session.user.user_metadata?.role || "user",
        },
      });
    } else {
      callback(null);
    }
  });
  return data;
}

// ── User Management (Admin) ───────────────────────────────────
export async function getProfiles(): Promise<Profile[]> {
  const token = getAccessToken();
  const { url, anonKey } = getSupabaseConfig();
  const res = await fetch(`${url}/rest/v1/rpc/get_all_profiles_admin`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch profiles: ${res.status} ${errText}`);
  }
  return res.json();
}

export async function updateUserRole(userId: string, newRole: string): Promise<void> {
  const token = getAccessToken();
  const { url, anonKey } = getSupabaseConfig();
  const res = await fetch(`${url}/rest/v1/rpc/update_user_role_admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId, new_role: newRole }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to update role: ${res.status} ${errText}`);
  }
}
