import { getSupabase, getAccessToken } from "@/lib/supabaseClient";

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
  const { data, error } = await getSupabase().auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName ?? "",
        role: "user",
      },
    },
  });

  if (error) throw error;

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
    session: data.session,
  };
}

// ── Sign In ──────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { data, error } = await getSupabase().auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const { data: profile } = await getSupabase()
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      user_metadata: {
        full_name: data.user.user_metadata?.full_name as string | undefined,
        avatar_url: data.user.user_metadata?.avatar_url as string | undefined,
        role: (profile?.role as string) || data.user.user_metadata?.role || "user",
      },
    },
    session: data.session,
  };
}

// ── Sign Out ─────────────────────────────────────────────────
export async function signOut() {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw error;
}

// ── Get Current User ─────────────────────────────────────────
export async function getCurrentUser() {
  const { data, error } = await getSupabase().auth.getUser();
  if (error || !data.user) return null;

  const { data: profile } = await getSupabase()
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  return {
    id: data.user.id,
    email: data.user.email!,
    user_metadata: {
      full_name: data.user.user_metadata?.full_name as string | undefined,
      avatar_url: data.user.user_metadata?.avatar_url as string | undefined,
      role: (profile?.role as string) || data.user.user_metadata?.role || "user",
    },
  } as User;
}

// ── Get Session ──────────────────────────────────────────────
export async function getSession() {
  const { data, error } = await getSupabase().auth.getSession();
  if (error) throw error;
  return data.session;
}

// ── Reset Password ───────────────────────────────────────────
export async function resetPassword(email: string) {
  const { error } = await getSupabase().auth.resetPasswordForEmail(email);
  if (error) throw error;
}

// ── Update Password ──────────────────────────────────────────
export async function updatePassword(newPassword: string) {
  const { error } = await getSupabase().auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
}

// ── Update Profile ──────────────────────────────────────────
export async function updateProfile(data: { full_name?: string; avatar_url?: string }) {
  const { error } = await getSupabase().auth.updateUser({
    data,
  });
  if (error) throw error;
}

export async function getUserRole(userId: string) {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data?.role as string) || "user";
}

// ── Auth State Listener ──────────────────────────────────────
export function onAuthStateChange(callback: (user: User | null) => void) {
  return getSupabase().auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      callback({
        id: session.user.id,
        email: session.user.email!,
        user_metadata: {
          full_name: session.user.user_metadata?.full_name as string | undefined,
          avatar_url: session.user.user_metadata?.avatar_url as string | undefined,
          role: (profile?.role as string) || session.user.user_metadata?.role || "user",
        },
      });
    } else {
      callback(null);
    }
  });
}

// ── User Management (Admin) ───────────────────────────────────
export async function getProfiles(): Promise<Profile[]> {
  const token = getAccessToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_all_profiles_admin`, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch profiles: ${res.status} ${errText}`);
  }
  return res.json();
}

export async function updateUserRole(userId: string, newRole: string): Promise<void> {
  const token = getAccessToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/update_user_role_admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user_id: userId, new_role: newRole }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to update role: ${res.status} ${errText}`);
  }
}
