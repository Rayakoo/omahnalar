"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { getCurrentUser, signOut as authSignOut, onAuthStateChange, type User } from "@/services/auth";

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
    fetchUser().finally(() => setLoading(false));

    const sub = onAuthStateChange((u) => {
      setUser(u);
      setLoading(false);
    });

    return () => sub?.subscription.unsubscribe();
  }, [fetchUser]);

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
