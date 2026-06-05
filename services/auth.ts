import { supabase } from "@/lib/supabaseClient";

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
  const { data, error } = await supabase.auth.signUp({
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const { data: profile } = await supabase
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
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ── Get Current User ─────────────────────────────────────────
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: profile } = await supabase
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
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// ── Reset Password ───────────────────────────────────────────
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

// ── Update Password ──────────────────────────────────────────
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
}

// ── Update Profile ──────────────────────────────────────────
export async function updateProfile(data: { full_name?: string; avatar_url?: string }) {
  const { error } = await supabase.auth.updateUser({
    data,
  });
  if (error) throw error;
}

export async function getUserRole(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data?.role as string) || "user";
}

// ── Auth State Listener ──────────────────────────────────────
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
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
