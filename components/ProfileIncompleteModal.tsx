"use client";

import Link from "next/link";
import { IdCard, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

type Props = {
  open: boolean;
  /** Jika true, modal tidak bisa ditutup (wajib lengkapi profil dulu) */
  block?: boolean;
  onClose?: () => void;
};

export default function ProfileIncompleteModal({ open, block = false, onClose }: Props) {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.profile : en.profile;

  if (!open) return null;

  const dismissible = !block && !!onClose;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => {
        if (dismissible) onClose!();
      }}
    >
      <div
        className="w-full max-w-md bg-[#f5efe6] rounded-2xl shadow-2xl border border-[#c4a882] p-6 md:p-8 relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {dismissible && (
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#e8dcc8] hover:bg-[#d4c4a8] flex items-center justify-center text-[#5c3d2e] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="w-14 h-14 rounded-full bg-[#e8dcc8] flex items-center justify-center mx-auto mb-4">
          <IdCard className="w-7 h-7 text-[#8b4513]" />
        </div>

        <h2 className="text-lg md:text-xl font-bold text-[#3c2415]">
          {t.belumLengkap}
        </h2>
        <p className="text-xs md:text-sm text-[#8b7355] leading-relaxed mt-2 mb-6">
          {t.lengkapiDulu}
        </p>

        <Link
          href="/profile"
          className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#8b4513] hover:bg-[#6d360e] text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
        >
          {t.lengkapiSekarang}
        </Link>
      </div>
    </div>
  );
}
