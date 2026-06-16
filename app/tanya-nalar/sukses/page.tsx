"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Check, Info, ClipboardList, Home, Copy, CheckCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

export default function LaporanSuksesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFBF3] flex items-center justify-center"><div className="w-5 h-5 border-2 border-[#736A9C] border-t-transparent rounded-full animate-spin" /></div>}>
      <LaporanSukses />
    </Suspense>
  );
}

function LaporanSukses() {
  const searchParams = useSearchParams();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.tanyaNalar : en.tanyaNalar;
  const common = locale === "id" ? id.common : en.common;
  const kodeLaporan = searchParams.get("ticket") || "TN-XXXXX";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(kodeLaporan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
      const el = document.getElementById("ticket-code");
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF3] font-sans antialiased text-gray-800 flex flex-col">
      <section className="bg-[#4C4765] text-white p-8 md:p-12 text-center rounded-b-[24px] shadow-sm flex flex-col items-center justify-center">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-[#F4C46B] flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-[#F4C46B] stroke-[3]" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#F4C46B]">
            {t.suksesTitle}
          </h1>

          <p className="text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
            {t.suksesDesc}
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col items-center justify-center -mt-4">
        <div className="w-full max-w-2xl bg-[#E5E2F8] bg-opacity-60 border border-[#D7D3F2] rounded-2xl p-6 md:p-8 text-center mb-8">
          <p className="text-xs font-bold tracking-wider text-[#736A9C] uppercase mb-2">
            {t.kodeLaporanmu}
          </p>

          <div className="flex items-center justify-center gap-3 mb-4">
            <h2
              id="ticket-code"
              className="text-3xl md:text-4xl font-extrabold text-[#3B3654] tracking-wide select-all"
            >
              {kodeLaporan}
            </h2>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-[#D7D3F2] hover:bg-[#C5BFE8] transition-colors"
              title={t.salinKode}
            >
              {copied ? (
                <CheckCheck className="w-5 h-5 text-green-700" />
              ) : (
                <Copy className="w-5 h-5 text-[#4C4765]" />
              )}
            </button>
          </div>

          <div className="flex items-start gap-2 max-w-md mx-auto text-left justify-center bg-transparent">
            <Info className="w-3.5 h-3.5 text-[#736A9C] mt-0.5 shrink-0" />
            <p className="text-[11px] md:text-xs text-gray-600 leading-relaxed">
              {t.kodeHint}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center">
          <Link
            href={`/tanya-nalar/detail-laporan?ticket=${kodeLaporan}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4C4765] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <ClipboardList className="w-3.5 h-3.5" /> {t.pantauStatus}
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4C4765] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <Home className="w-3.5 h-3.5" /> {common.backToHome}
          </Link>
        </div>
      </main>
    </div>
  );
}
