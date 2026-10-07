"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function ServicesSection() {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-12 lg:px-20 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* ================= HEADER SECTION ================= */}
        <Reveal className="text-center flex flex-col items-center gap-2">
          <span className="text-[#00296b] font-bold text-sm tracking-wider uppercase">
            LAYANAN KAMI
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#721e7c]">
            Apa yang ingin kamu pelajari?
          </h2>
        </Reveal>

        {/* ================= CARD UTAMA (OMAH BELAJAR) ================= */}
        <Reveal
          className="relative overflow-hidden rounded-3xl border border-gray-100 p-6 md:p-10 min-h-[320px] flex items-center shadow-sm bg-center bg-no-repeat bg-[#f8f3e9]"
          style={{
            backgroundImage: `url(/layanankami/background_omahbelajar%201.svg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full">

            {/* Gambar Orang (Kiri) */}
            <div className="md:col-span-5 relative h-64 md:h-80 w-full flex items-center justify-center">
              <Image
                src="/layanankami/orang_omahbelajar.png"
                alt="Omah Belajar Person"
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-contain"
              />
            </div>

            {/* Konten Teks & Button (Kanan) */}
            <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left gap-4">
              <h3 className="text-3xl md:text-5xl font-black text-[#111827]">
                Omah Belajar
              </h3>
              <p className="text-[#1f2937] text-sm md:text-base leading-relaxed max-w-xl font-medium">
                Ruang belajar interaktif dan menyenangkan. Menyediakan materi
                kesehatan reproduksi dan seksual komprehensif, kuis dan games.
                Kamu bisa bermain sambil belajar dan mendapatkan sertifikat.
              </p>
              <Link
                href="/program"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#f1e5cd] hover:bg-[#e6d6b8] text-[#00296b] font-bold text-sm rounded-full shadow-md transition-all group mt-2"
              >
                <span>Jelajahi</span>
                <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </Link>
            </div>

          </div>
        </Reveal>

        {/* ================= GRID 2 CARD BAWAH ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* CARD 2: OMAH CERITA */}
          <Reveal
            delay={0.1}
            className="relative overflow-hidden rounded-3xl border border-gray-100 p-6 flex flex-col items-center text-center justify-between min-h-[380px] shadow-sm bg-center bg-no-repeat bg-[#f8f3e9]"
            style={{
              backgroundImage: `url(/layanankami/background_lain%201.svg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >

            <div className="relative z-10 w-full flex flex-col items-center gap-4">
              {/* Gambar Orang */}
              <div className="relative h-48 md:h-56 w-full">
                <Image
                  src="/layanankami/orang_omahcerita.png"
                  alt="Omah Cerita Person"
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-contain"
                />
              </div>

              {/* Deskripsi */}
              <p className="text-[#1f2937] text-xs md:text-sm font-medium leading-relaxed max-w-sm">
                Kamu bisa berbagi cerita atau pengalaman seputar kesehatan dan
                pendidikan. Ceritamu bisa bermakna dan menginspirasi orang
                sekitarmu.
              </p>
            </div>

            {/* Tombol Jelajahi */}
            <div className="relative z-10 mt-6">
              <Link
                href="/omah-cerita"
                className="inline-flex items-center gap-2 px-6 py-2 bg-[#f1e5cd] hover:bg-[#e6d6b8] text-[#00296b] font-bold text-xs md:text-sm rounded-full shadow-md transition-all group"
              >
                <span>Jelajahi</span>
                <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </Link>
            </div>

          </Reveal>

          {/* CARD 3: TANYA NALAR */}
          <Reveal
            delay={0.2}
            className="relative overflow-hidden rounded-3xl border border-gray-100 p-6 flex flex-col items-center text-center justify-between min-h-[380px] shadow-sm bg-center bg-no-repeat bg-[#f8f3e9]"
            style={{
              backgroundImage: `url(/layanankami/background_lain%201.svg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >

            <div className="relative z-10 w-full flex flex-col items-center gap-4">
              {/* Gambar Orang */}
              <div className="relative h-48 md:h-56 w-full">
                <Image
                  src="/layanankami/orang_tanyanalar.png"
                  alt="Tanya Nalar Person"
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-contain"
                />
              </div>

              {/* Deskripsi */}
              <p className="text-[#1f2937] text-xs md:text-sm font-medium leading-relaxed max-w-sm">
                Layanan tanya jawab
              </p>
            </div>

            {/* Tombol Jelajahi */}
            <div className="relative z-10 mt-6">
              <Link
                href="/tanya-nalar"
                className="inline-flex items-center gap-2 px-6 py-2 bg-[#f1e5cd] hover:bg-[#e6d6b8] text-[#00296b] font-bold text-xs md:text-sm rounded-full shadow-md transition-all group"
              >
                <span>Jelajahi</span>
                <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </Link>
            </div>

          </Reveal>

        </div>

      </div>
    </section>
  );
}
