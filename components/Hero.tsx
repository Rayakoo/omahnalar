import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <header className="bg-brand-900 text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center gap-6">
        <div className="max-w-3xl flex flex-col items-center gap-4">
          <span className="bg-secondary-500 text-brand-900 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
            Ruang aman & terpercaya
          </span>
          <h1 className="text-3xl md:text-5xl font-normal tracking-wide leading-tight text-page-50">
            Tempat bicara, belajar, <br /> dan melapor dengan aman
          </h1>
          <p className="text-brand-100/80 text-base md:text-lg max-w-xl">
            Omah Nalar adalah ruang aman bagi siapa saja untuk berbicara, belajar, dan mendapatkan dukungan.
          </p>
        </div>
        <div className="flex gap-4 mt-2">
          <button className="bg-secondary-500 text-brand-900 font-semibold px-8 py-3 rounded-full shadow-md hover:bg-secondary-600 transition-colors flex items-center gap-2 text-sm">
            Ikut Terlibat <ArrowRight className="w-4 h-4" />
          </button>
          <button className="border border-brand-100/40 text-page-50 font-medium px-8 py-3 rounded-full hover:bg-white/10 transition-colors text-sm">
            Pelajari Lebih Lanjut
          </button>
        </div>
      </div>
    </header>
  );
}
