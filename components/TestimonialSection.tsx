"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function TestimonialSection() {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-12 lg:px-20 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">

        {/* ================= HEADER SECTION ================= */}
        <Reveal className="text-center flex flex-col items-center gap-2">
          <span className="text-[#00296b] font-bold text-sm tracking-widest uppercase">
            TESTIMONI
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#721e7c]">
            Apa kata mereka tentang Omah Nalar
          </h2>
        </Reveal>

        {/* ================= CARD 1: GAMBAR KIRI, TEKS KANAN ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Box Gambar + Fade White Gradient */}
          <Reveal className="lg:col-span-5 relative overflow-hidden rounded-[2rem] aspect-[4/3]">
            <Image
              src="/images/testi1.png"
              alt="Perwakilan Guru MI Nurul Huda 02"
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
            />
            {/* Soft White Gradient Overlays (Sisi Kanan, Bawah, & Atas) */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/90 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/40 pointer-events-none" />
          </Reveal>

          {/* Konten Teks Kanan */}
          <Reveal delay={0.15} className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-4 h-4 rounded-full bg-[#00296b] shrink-0" />
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#00296b]">
                Perwakilan Guru MI Nurul Huda 02
              </h3>
            </div>

            <p className="text-[#00296b] text-sm md:text-base leading-relaxed mb-6 font-normal text-justify">
              &ldquo;Kami sangat terbantu dengan kehadiran Omah Nalar. Sekolah
              kami memiliki banyak kekurangan, terutama dalam hal ketersediaan
              buku untuk mendukung program literasi dan numerasi siswa. Pojok
              baca di kelas-kelas juga masih minim, dan Omah Nalar telah
              memberikan kontribusi yang sangat berarti dalam meutupi kekurangan
              tersebut. Kami berharap kerja sama ini dapat terus berlanjut dan
              menjadi lebih baik lagi di masa mendatang, serta terus membantu
              meningkatkan kualitas pendidikan di sekolah kami, khususnya dalam
              penyediaan sumber daya belajar.&rdquo;
            </p>

            <div>
              <Link
                href="/testimoni/1"
                className="inline-flex items-center gap-3 px-6 py-2.5 bg-[#f1e5cd] hover:bg-[#e6d6b8] text-[#00296b] font-bold text-sm md:text-base rounded-full shadow-sm transition-all group"
              >
                <span>Pelajari lebih lanjut</span>
                <div className="w-6 h-6 bg-[#721e7c] rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-0.5 shrink-0">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
              </Link>
            </div>
          </Reveal>

        </div>

        {/* ================= CARD 2: TEKS KIRI, GAMBAR KANAN ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Konten Teks Kiri */}
          <Reveal className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-4 h-4 rounded-full bg-[#00296b] shrink-0" />
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#00296b]">
                Perwakilan Guru MI Nurul Huda 02
              </h3>
            </div>

            <p className="text-[#00296b] text-sm md:text-base leading-relaxed mb-6 font-normal text-justify">
              &ldquo;Kami sangat terbantu dengan kehadiran Omah Nalar. Sekolah
              kami memiliki banyak kekurangan, terutama dalam hal ketersediaan
              buku untuk mendukung program literasi dan numerasi siswa. Pojok
              baca di kelas-kelas juga masih minim, dan Omah Nalar telah
              memberikan kontribusi yang sangat berarti dalam meutupi kekurangan
              tersebut. Kami berharap kerja sama ini dapat terus berlanjut dan
              menjadi lebih baik lagi di masa mendatang, serta terus membantu
              meningkatkan kualitas pendidikan di sekolah kami, khususnya dalam
              penyediaan sumber daya belajar.&rdquo;
            </p>

            <div>
              <Link
                href="/testimoni/2"
                className="inline-flex items-center gap-3 px-6 py-2.5 bg-[#f1e5cd] hover:bg-[#e6d6b8] text-[#00296b] font-bold text-sm md:text-base rounded-full shadow-sm transition-all group"
              >
                <span>Pelajari lebih lanjut</span>
                <div className="w-6 h-6 bg-[#721e7c] rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-0.5 shrink-0">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
              </Link>
            </div>
          </Reveal>

          {/* Box Gambar + Fade White Gradient */}
          <Reveal delay={0.15} className="lg:col-span-5 relative overflow-hidden rounded-[2rem] aspect-[4/3] order-1 lg:order-2">
            <Image
              src="/images/testi2.png"
              alt="Perwakilan Guru MI Nurul Huda 02"
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
            />
            {/* Soft White Gradient Overlays (Sisi Kiri, Bawah, & Atas) */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/90 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/40 pointer-events-none" />
          </Reveal>

        </div>

      </div>
    </section>
  );
}
