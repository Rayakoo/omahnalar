import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function AboutSection() {
  return (
    <section className="w-full bg-[#f4f8fb] py-16 px-6 md:px-12 lg:px-20 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

        {/* 1. SISI KIRI: Foto di dalam border rumah */}
        <Reveal className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md aspect-[2121/1755]">
            {/* Foto di belakang (di dalam bingkai rumah) */}
            <div
              className="absolute inset-0"
              style={{
                clipPath:
                  "polygon(50.65% 4.27%, 96.6% 37.9%, 90.3% 38.5%, 90.3% 88.4%, 9.7% 88.4%, 9.4% 37.9%, 3.4% 37.9%)",
              }}
            >
              <Image
                src="/images/omah_nalar.JPG"
                alt="Kegiatan Omah Nalar"
                fill
                sizes="(max-width: 1024px) 100vw, 448px"
                className="object-cover"
                priority
              />
            </div>
            {/* Border rumah di depan */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <Image
                src="/images/border_rumah.svg"
                alt="Bingkai rumah Omah Nalar"
                fill
                sizes="(max-width: 1024px) 100vw, 448px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </Reveal>

        {/* 2. SISI KANAN: Konten Teks & Tombol */}
        <Reveal delay={0.15} className="lg:col-span-7 flex flex-col justify-center">

          {/* Sub-header / Category Dot & Text */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[#00296b] shrink-0" />
            <span className="text-[#00296b] font-bold tracking-wider text-xs md:text-sm uppercase">
              TENTANG OMAH NALAR
            </span>
          </div>

          {/* Heading + Maskot Otak */}
          <div className="flex items-center justify-start gap-2 mb-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#721e7c] leading-tight">
              Selamat Datang <br />
              di Omah Nalar
            </h2>

            {/* Maskot Kanan */}
            <div className="relative w-28 h-28 md:w-40 md:h-40 shrink-0">
              <Image
                src="/images/maskot_nalar.png"
                alt="Maskot Omah Nalar"
                fill
                sizes="(max-width: 768px) 112px, 160px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <p className="text-[#721e7c]/90 text-sm md:text-base leading-relaxed mb-8 max-w-xl font-medium">
            Omah Nalar adalah komunitas non-profit yang menyediakan platform
            ruang belajar menyenangkan, berbagi cerita dengan aman dan
            mendapatkan dukungan.
          </p>

          {/* Tombol Aksi */}
          <div className="flex flex-wrap items-center gap-4">

            {/* Tombol 1 */}
            <Link
              href="/tentang"
              className="inline-flex items-center justify-between gap-4 px-6 py-3 bg-[#f1e5cd] hover:bg-[#e7d8bc] text-[#00296b] font-bold text-sm md:text-base rounded-full shadow-sm transition-all group"
            >
              <span>Pelajari lebih lanjut</span>
              <div className="w-7 h-7 bg-[#721e7c] rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-0.5 shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </div>
            </Link>

            {/* Tombol 2 */}
            <Link
              href="/terlibat"
              className="inline-flex items-center justify-between gap-4 px-6 py-3 bg-[#f1e5cd] hover:bg-[#e7d8bc] text-[#00296b] font-bold text-sm md:text-base rounded-full shadow-sm transition-all group"
            >
              <span>Mau ikut terlibat</span>
              <div className="w-7 h-7 bg-[#721e7c] rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-0.5 shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </div>
            </Link>

          </div>

        </Reveal>

      </div>
    </section>
  );
}
