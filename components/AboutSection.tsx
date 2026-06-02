import { ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-page-50 py-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2">
          <div className="bg-brand-100 rounded-3xl h-80 flex items-center justify-center text-brand-700/40">
            <span className="text-lg">Gambar Omah Nalar</span>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">
            Tentang Omah Nalar
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-3 mb-5 leading-tight">
            Selamat Datang di <br /> Omah Nalar Indonesia
          </h2>
          <p className="text-brand-700/80 leading-relaxed mb-6">
            Omah Nalar adalah platform yang menyediakan ruang aman bagi masyarakat untuk berbicara,
            belajar, dan melapor. Kami percaya bahwa setiap orang berhak mendapatkan akses terhadap
            informasi dan dukungan yang mereka butuhkan.
          </p>
          <button className="bg-brand-900 text-white font-medium px-6 py-3 rounded-full hover:bg-brand-700 transition-colors flex items-center gap-2 text-sm shadow-sm">
            Pelajari Siapa Kami <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
