"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogIn, Languages } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

const NAV_LINKS = [
  { key: "program", href: "/program" },
  { key: "berita", href: "/berita" },
  { key: "tentang", href: "/tentang" },
  { key: "omahCerita", href: "/omah-cerita" },
  { key: "omahBelajar", href: "/omah-belajar" },
  { key: "tanyaNalar", href: "/tanya-nalar" },
  { key: "produk", href: "/produk" },
  { key: "minigames", href: "/minigames" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const { locale, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = locale === "id" ? id.nav : en.nav;

  return (
    <nav className="bg-secondary-200 px-6 py-4 flex items-center justify-between shadow-sm relative">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-brand-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
          Ω
        </div>
      </Link>

      <div className="hidden lg:flex items-center gap-6">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-brand-900 text-white shadow-md"
                  : "text-brand-900 hover:bg-brand-100"
              }`}
            >
              {t[link.key as keyof typeof t]}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-brand-800 hover:bg-brand-100 transition-colors border border-brand-200"
          title={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
        >
          <Languages className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{locale === "id" ? "EN" : "ID"}</span>
        </button>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden lg:block text-sm font-semibold text-brand-900">
                {t.hai}, {(user.user_metadata?.full_name || user.email).split(" ")[0]}
              </span>
              {user.user_metadata?.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-[10px] font-bold bg-[#4D455D] hover:bg-[#3d364a] text-white px-3 py-1.5 rounded-md transition-colors hidden lg:block"
                >
                  {t.admin}
                </Link>
              )}
              <img
                src={user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"}
                alt={user.user_metadata?.full_name || "Profile"}
                className="w-10 h-10 rounded-full border-2 border-brand-700 object-cover shadow-sm"
              />
              <button
                onClick={signOut}
                className="text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition-colors hidden lg:block"
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-brand-900 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-brand-700 transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              {t.login}
            </Link>
          )}
        </div>

        <button
          className="lg:hidden p-2 rounded-lg text-brand-900 hover:bg-brand-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t.toggleMenu}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-secondary-200 border-t border-brand-700/10 shadow-lg lg:hidden z-50">
          <div className="flex flex-col p-4 gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-brand-900 text-white shadow-md"
                      : "text-brand-900 hover:bg-brand-100"
                  }`}
                >
                  {t[link.key as keyof typeof t]}
                </Link>
              );
            })}
            <button
              onClick={() => { toggleLanguage(); }}
              className="px-4 py-3 rounded-xl text-sm font-medium bg-brand-100 text-brand-900 text-center flex items-center justify-center gap-2"
            >
              <Languages className="w-4 h-4" />
              {locale === "id" ? "English" : "Indonesia"}
            </button>
            {user ? (
              <>
                {user.user_metadata?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium bg-[#4D455D] text-white text-center"
                  >
                    {t.adminPanel}
                  </Link>
                )}
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="px-4 py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white text-center"
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium bg-brand-900 text-white text-center"
              >
                {t.login}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
