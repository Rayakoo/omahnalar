"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Languages } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";
const NAV_LINKS = [
  { key: "program", href: "/program" },
  { key: "tentang", href: "/tentang" },
  { key: "omahCerita", href: "/omah-cerita" },
  { key: "tanyaNalar", href: "/tanya-nalar" },
  { key: "produk", href: "/produk" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, profileComplete, loading, signOut } = useAuth();
  const { locale, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = locale === "id" ? id.nav : en.nav;

  const profileIncomplete = !!user && !profileComplete;

  return (
    <div className="absolute top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 px-6 py-2 bg-[#fafafa] rounded-2xl shadow-sm font-sans relative">
        {/* 1. Logo Kiri */}
        <Link href="/" className="flex items-center shrink-0">
          <img src="/images/logo_omah.png" alt="Omah Nalar" className="h-14 w-auto object-contain" />
        </Link>

        {/* 2. Menu Navigasi + Tombol Bahasa (terbagi sama rata) */}
        <div className="hidden lg:flex flex-1 items-center justify-evenly mx-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-dark-blue text-white"
                    : "text-dark-blue hover:bg-dark-blue/10"
                }`}
              >
                {t[link.key as keyof typeof t]}
              </Link>
            );
          })}

          {/* Tombol Switch Bahasa */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-brand-800 hover:bg-brand-100 transition-colors border border-brand-200 shrink-0"
            title={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
            aria-label="Switch Language"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{locale === "id" ? "EN" : "ID"}</span>
          </button>
        </div>

        {/* 3. Kanan: info user + Maskot */}
        <div className="flex items-center gap-4 shrink-0">
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
                <Link
                  href="/profile"
                  className="relative shrink-0"
                  title={t.profil}
                >
                  <img
                    src={user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"}
                    alt={user.user_metadata?.full_name || "Profile"}
                    className="w-10 h-10 rounded-full border-2 border-brand-700 object-cover shadow-sm hover:border-brand-900 transition-all"
                  />
                  {profileIncomplete && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 border-2 border-secondary-200 rounded-full" />
                  )}
                </Link>
                <button
                  onClick={signOut}
                  className="text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition-colors hidden lg:block"
                >
                  {t.logout}
                </button>
              </div>
            ) : null}
          </div>

          {/* Maskot Kanan */}
          <Link href="/" className="flex items-center shrink-0" aria-label="Maskot Nalar">
            <img
              src="/images/maskot_nalar.png"
              alt="Maskot Nalar"
              className="h-12 w-12 rounded-full object-cover"
            />
          </Link>

          <button
            className="lg:hidden p-2 rounded-lg text-brand-900 hover:bg-brand-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t.toggleMenu}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#fafafa] rounded-b-2xl shadow-lg lg:hidden z-50">
            <div className="flex flex-col p-4 gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`nav-link px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-dark-blue text-white"
                        : "text-dark-blue hover:bg-dark-blue/10"
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
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium bg-brand-100 text-brand-900 text-center"
                  >
                    {t.profil}
                  </Link>
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
              ) : null}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
