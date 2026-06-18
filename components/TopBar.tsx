"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

export default function TopBar() {
  const { locale } = useLanguage();
  const common = locale === "id" ? id.common : en.common;

  return (
    <nav className="bg-secondary-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <Link href="/" className="flex items-center gap-2">
        <img src="/images/logo_omah.png" alt="Omah Nalar" className="h-10 w-auto" />
        <span className="text-lg font-black text-[#7B1E84] tracking-tight">Omah Nalar</span>
      </Link>

      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-1 bg-brand-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-brand-700 transition-all active:scale-95 shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        {common.back}
      </button>
    </nav>
  );
}
