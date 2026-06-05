"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.user_metadata?.role !== "admin") {
      router.push("/");
      return;
    }

    setAuthorized(true);
  }, [user, loading, router]);

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-[#FFFDF6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
