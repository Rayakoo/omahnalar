'use client';

import Link from 'next/link';
import { Check, Info, ClipboardList, Home } from 'lucide-react';

export default function LaporanSukses() {
  const kodeLaporan = "RPT-2025-7841";

  return (
    <div className="min-h-screen bg-[#FFFBF3] font-sans antialiased text-gray-800 flex flex-col">
      <section className="bg-[#4C4765] text-white p-8 md:p-12 text-center rounded-b-[24px] shadow-sm flex flex-col items-center justify-center">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-[#F4C46B] flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-[#F4C46B] stroke-[3]" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#F4C46B]">
            Laporan berhasil terkirim
          </h1>

          <p className="text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
            Terima kasih sudah berani bersuara. Laporanmu sudah kami terima dan akan segera ditindaklanjuti oleh tim kami.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col items-center justify-center -mt-4">
        <div className="w-full max-w-2xl bg-[#E5E2F8] bg-opacity-60 border border-[#D7D3F2] rounded-2xl p-6 md:p-8 text-center mb-8">
          <p className="text-xs font-bold tracking-wider text-[#736A9C] uppercase mb-2">
            # KODE LAPORANMU
          </p>

          <h2 className="text-3xl md:text-4xl font-extrabold text-[#3B3654] tracking-wide mb-4 select-all">
            {kodeLaporan}
          </h2>

          <div className="flex items-start gap-2 max-w-md mx-auto text-left justify-center bg-transparent">
            <Info className="w-3.5 h-3.5 text-[#736A9C] mt-0.5 shrink-0" />
            <p className="text-[11px] md:text-xs text-gray-600 leading-relaxed">
              Kode laporan sudah dikirim ke emailmu Kamu akan membutuhkannya untuk memantau status dan perkembangan laporanmu kapan saja.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center">
          <Link
            href="/tanya-nalar/detail-laporan"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4C4765] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <ClipboardList className="w-3.5 h-3.5" /> Pantau Status Laporan
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4C4765] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <Home className="w-3.5 h-3.5" /> Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  );
}
