"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getGalleries } from "@/services/galleries";
import { transformImageUrl } from "@/lib/image";

// Fallback sementara bila galeri belum termuat / gagal dimuat
const FALLBACK_SLIDES = [
  "/images/omah_nalar.JPG",
  "/images/features/berbagi-cerita.jpg",
  "/images/features/ikut-course.jpg",
  "/images/features/buat-laporan.jpg",
  "/images/features/main-games.jpg",
];

const SLIDE_INTERVAL_MS = 4000;
const MAX_SLIDES = 6;

export default function AboutSection() {
  const [slides, setSlides] = useState<string[]>(FALLBACK_SLIDES);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  // Sementara: pakai gambar galeri seperti hero section.
  // Daftar diputar (offset setengah) + dibatasi agar gambar yang tampil
  // berbeda dari hero yang mulai dari awal.
  useEffect(() => {
    getGalleries(15)
      .then((galleries) => {
        const urls = galleries
          .map((g) => transformImageUrl(g.url))
          .filter((url) => url.length > 0);
        if (urls.length === 0) return;
        const offset = Math.floor(urls.length / 2);
        const rotated = [...urls.slice(offset), ...urls.slice(0, offset)];
        setSlides(rotated.slice(0, MAX_SLIDES));
        setSlide(0);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <section className="w-full bg-[#f4f8fb] py-16 px-6 md:px-12 lg:px-20 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

        {/* 1. SISI KIRI: Slider foto di dalam border rumah */}
        <Reveal className="lg:col-span-5 flex justify-center">
          <div
            className="relative w-full max-w-md aspect-[2121/1755]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Slider foto di belakang (di dalam bingkai rumah) */}
            <div
              className="absolute inset-0"
              style={{
                clipPath:
                  "polygon(50.65% 4.27%, 96.6% 37.9%, 90.3% 38.5%, 90.3% 88.4%, 9.7% 88.4%, 9.4% 37.9%, 3.4% 37.9%)",
              }}
            >
              {slides.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`Kegiatan Omah Nalar ${i + 1}`}
                  draggable={false}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    i === slide ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
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
            {/* Indikator dots */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {slides.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSlide(i)}
                  aria-label={`Foto ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === slide
                      ? "w-5 bg-[#721e7c]"
                      : "w-1.5 bg-white/80 hover:bg-white shadow"
                  }`}
                />
              ))}
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
