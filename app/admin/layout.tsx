"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AdminGuard from "@/components/AdminGuard";

const NAV_ITEMS = [
  { label: "Daftar Laporan", href: "/admin" },
  { label: "Kelola Course", href: "/admin/courses" },
  { label: "Kelola Program", href: "/admin/programs" },
  { label: "Kelola Berita", href: "/admin/berita" },
  { label: "Kelola Admin", href: "/admin/users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";
  const avatarUrl = user?.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120";

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#FFFDF6]">
        <aside className="w-64 bg-[#FDECC8] border-r border-[#F3DBA7] flex flex-col justify-between p-6 shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-10 pl-2">
              <button
                onClick={() => router.push("/")}
                className="w-10 h-10 bg-[#4D455D] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm hover:bg-[#3d364a] transition-colors"
              >
                Ω
              </button>
              <span className="font-bold text-gray-800 text-lg tracking-wide">Omah Nalar</span>
            </div>

            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-sm ${
                      isActive
                        ? "bg-[#4D455D] text-white shadow-md"
                        : "text-gray-700 hover:bg-[#F3DBA7]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#F3DBA7]">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
            <button
              onClick={async () => { await signOut(); window.location.href = "/"; }}
              className="text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-md transition-colors shrink-0"
            >
              Keluar
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
