"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Program", href: "/program" },
  { label: "Berita", href: "/berita" },
  { label: "Tentang", href: "/tentang" },
  { label: "Omah Cerita", href: "/omah-cerita" },
  { label: "Omah Belajar", href: "/omah-belajar" },
  { label: "Tanya Nalar", href: "/tanya-nalar" },
  { label: "Produk", href: "/produk" },
];

export default function Navbar({ isLoggedIn = true }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          {isLoggedIn ? (
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
              alt="User Profile"
              className="w-10 h-10 rounded-full border-2 border-brand-700 object-cover shadow-sm"
            />
          ) : (
            <div className="w-10 h-10" />
          )}
        </div>

        <button
          className="lg:hidden p-2 rounded-lg text-brand-900 hover:bg-brand-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
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
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
