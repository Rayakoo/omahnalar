"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, MessageCircle, Flag, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";

// DUMMY DATA
const DUMMY_STORIES = [
  {
    id: 1,
    title: "Melangkah Pergi",
    author: "Maya",
    date: "5 November 2025",
    content:
      "Aku mengalami kekerasan fisik dari pacarku selama 3 tahun. Butuh waktu 1 tahun untuk terapi dan pulih. Sekarang aku bisa tersenyum lagi. Jangan takut meninggalkan hubungan yang tidak sehat. Keselamatanmu yang utama.",
    likes: 18,
    comments: 8,
  },
  {
    id: 2,
    title: "Mencoba bangkit dari kegagalan yang membuatku terpuruk",
    author: "Kawan Anonim",
    date: "15 April 2026",
    content:
      "Hari ini aku belajar bahwa jatuh itu biasa, yang luar biasa adalah bagaimana kita mencuci luka dan kembali berdiri meski kaki masih gemetar. Terima kasih Omah Cerita sudah jadi ruang aman...",
    likes: 42,
    comments: 12,
  },
  {
    id: 3,
    title: "Perjalananku mencari jati diri di tengah tekanan sosial",
    author: "Rian",
    date: "2 Mei 2026",
    content:
      "Selama ini aku merasa tertekan dengan ekspektasi orang sekitar. Melalui Omah Cerita, aku belajar bahwa setiap orang punya waktunya sendiri untuk tumbuh dan berkembang.",
    likes: 35,
    comments: 15,
  },
  {
    id: 4,
    title: "Berani mengatakan tidak pada toxic relationship",
    author: "Siti",
    date: "19 Mei 2026",
    content:
      "Butuh waktu lama untuk menyadari bahwa aku pantas diperlakukan lebih baik. Sekarang aku lebih berani menetapkan batasan dan menghargai diriku sendiri.",
    likes: 27,
    comments: 9,
  },
  {
    id: 5,
    title: "Syukur bisa menemukan komunitas yang mendukung",
    author: "Budi",
    date: "25 Mei 2026",
    content:
      "Aku tidak pernah menyangka akan menemukan tempat yang menerima aku apa adanya. Terima kasih untuk semua yang telah berbagi cerita dan memberi semangat.",
    likes: 51,
    comments: 20,
  },
];

export default function CeritaKawan() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % DUMMY_STORIES.length);
  };

  const prevStep = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + DUMMY_STORIES.length) % DUMMY_STORIES.length);
  };

  const story = DUMMY_STORIES[index];

  // =========================================================================
  // LOGIKA BACKGROUND CARD (2 TIPE BERGANTIAN)
  // Silakan masukkan class Tailwind (misal: bg-[url('/path/to/bg1.png')])
  // atau style inline sesuai gambar background milik Anda di bawah ini:
  // =========================================================================
  const cardBackgroundClass =
    index % 2 === 0
      ? "bg-gradient-to-b from-[#FFF5EC] via-[#FFE4D6] to-[#FFA88B] border border-white/60 shadow-xl" // Tipe Background 1
      : "bg-gradient-to-b from-[#F7EFFF] via-[#EADBFF] to-[#C0A0ED] border border-white/60 shadow-xl"; // Tipe Background 2

  return (
    <div className="min-h-screen bg-[#FAF5ED] font-sans antialiased text-[#3A2E5A]">
      {/* 1. HERO BANNER "RUANG AMAN UNTUK BERCERITA" */}
      <section className="relative bg-gradient-to-r from-[#53267d] via-[#3a2e8c] to-[#1d41a5] text-white py-14 px-6 text-center overflow-hidden">
        {/* Pattern Hiasan Halftone / Dot Samping */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          {/* Pill Badge */}
          <div className="inline-block px-5 py-1 rounded-full border border-white/40 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm">
            CERITA KITA
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-wide mb-2 uppercase">
            RUANG AMAN UNTUK BERCERITA
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-gray-200 mb-6 font-normal">
            Cerita dapat dibagikan secara anonim
          </p>

          {/* CTA Button */}
          <button
            onClick={() => router.push("/omah-cerita/buat-cerita")}
            className="inline-flex items-center gap-2 bg-white text-[#3A2E5A] px-6 py-2.5 rounded-full font-bold text-xs md:text-sm shadow-md hover:bg-gray-100 transition-all"
          >
            Bagikan Kisahku
            <span className="w-5 h-5 bg-[#3A2E5A] text-white rounded-full flex items-center justify-center">
              <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          </button>
        </div>
      </section>

      {/* 2. SECTION "CERITA KAWAN KITA" */}
      <section className="py-12 px-6 min-h-[600px] flex flex-col justify-center">
        <div className="max-w-5xl mx-auto w-full">
          {/* Header Title & Button */}
          <Reveal className="flex flex-col items-center text-center mb-10 gap-3">
            <h2 className="text-2xl md:text-3xl font-black text-[#51236E] uppercase tracking-wide">
              CERITA KAWAN KITA
            </h2>
            <button
              onClick={() => router.push("/omah-cerita/semua-cerita")}
              className="inline-flex items-center gap-2 bg-[#51236E] text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-[#3D1A54] transition-colors shadow-md"
            >
              Lihat Semua Cerita
              <span className="w-4 h-4 bg-white text-[#51236E] rounded-full flex items-center justify-center">
                <ChevronRight className="w-3 h-3 stroke-[3]" />
              </span>
            </button>
          </Reveal>

          {/* Card & Carousel Container */}
          <div className="relative flex items-center justify-center min-h-[420px]">
            {/* Navigation Buttons (Left & Right) */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center z-20 pointer-events-none px-2 md:-mx-6">
              <button
                onClick={prevStep}
                className="w-10 h-10 md:w-12 md:h-12 bg-[#51236E] text-white rounded-full flex items-center justify-center hover:bg-[#3D1A54] transition-all shadow-lg pointer-events-auto active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                onClick={nextStep}
                className="w-10 h-10 md:w-12 md:h-12 bg-[#51236E] text-white rounded-full flex items-center justify-center hover:bg-[#3D1A54] transition-all shadow-lg pointer-events-auto active:scale-95"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Card Animated Wrapper */}
            <div className="w-full max-w-3xl [perspective:1500px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={story.id}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({
                      rotateY: d > 0 ? 90 : -90,
                      opacity: 0,
                      scale: 0.9,
                    }),
                    center: {
                      rotateY: 0,
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.6,
                        ease: [0.23, 1, 0.32, 1],
                      },
                    },
                    exit: (d: number) => ({
                      rotateY: d > 0 ? -90 : 90,
                      opacity: 0,
                      scale: 0.9,
                      transition: { duration: 0.4 },
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{
                    backfaceVisibility: "hidden",
                    transformStyle: "preserve-3d",
                  }}
                  className={`p-8 md:p-12 rounded-[36px] relative flex flex-col items-center text-center transition-all duration-300 ${cardBackgroundClass}`}
                >
                  {/* Card Header Info */}
                  <h3 className="text-2xl md:text-3xl font-extrabold text-[#3A2E5A] mb-3">
                    {story.title}
                  </h3>

                  {/* Badge Curhat */}
                  <span className="bg-[#FCD34D] text-[#3A2E5A] text-xs font-extrabold px-5 py-1 rounded-full shadow-sm mb-3">
                    Curhat
                  </span>

                  {/* Author & Date */}
                  <div className="text-xs md:text-sm text-[#6C5B7B] font-semibold mb-6">
                    <p>oleh {story.author || "Anonim"}</p>
                    <p>{story.date}</p>
                  </div>

                  {/* Story Content */}
                  <p className="text-xs md:text-sm leading-relaxed text-[#3A2E5A] max-w-2xl font-medium mb-8">
                    {story.content}
                  </p>

                  {/* Card Footer Actions (Suka, Komentar, Laporkan) */}
                  <div className="w-full flex items-center justify-between pt-4 border-t border-[#3A2E5A]/10 text-[#3A2E5A]">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
                          <Heart className="w-4 h-4 fill-[#3A2E5A] text-[#3A2E5A]" />
                        </div>
                        <span className="text-xs font-bold">
                          suka ({story.likes})
                        </span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
                          <MessageCircle className="w-4 h-4 text-[#3A2E5A]" />
                        </div>
                        <span className="text-xs font-bold">
                          komentar ({story.comments})
                        </span>
                      </button>
                    </div>

                    <button className="flex items-center gap-1 text-xs font-bold hover:opacity-70 transition-opacity">
                      <Flag className="w-3.5 h-3.5" />
                      <span>Laporkan</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
