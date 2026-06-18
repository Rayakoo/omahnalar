"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOut as authSignOut, onAuthStateChange, exchangeOAuthCode, type User } from "@/services/auth";

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
    // Cek apakah URL mengandung ?code= (handle OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      exchangeOAuthCode(code).then(() => {
        router.replace(window.location.pathname);
      }).catch(() => {});
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
