"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOut as authSignOut, onAuthStateChange, type User } from "@/services/auth";
import { createClient } from "@/utils/supabase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Cek apakah URL mengandung ?code= (fallback jika callback route tidak ditangkap)
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      const exchangeCode = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          // Bersihkan URL dari ?code=
          router.replace(window.location.pathname);
        }
      };
      exchangeCode();
    }

    fetchUser().finally(() => setLoading(false));

    const sub = onAuthStateChange((u) => {
      setUser(u);
      setLoading(false);
    });

    return () => sub?.subscription.unsubscribe();
  }, [fetchUser, router]);

  const signOut = async () => {
    await authSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
