"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, MessageCircle, Flag, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { getStories, type Story } from "@/services/stories";
import { DUMMY_STORIES } from "@/data/dummyStories";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

// Background card bergantian (peach / ungu) mengikuti desain
function cardBackgroundClass(index: number) {
  return index % 2 === 0
    ? "bg-gradient-to-b from-[#FFF5EC] via-[#FFE4D6] to-[#FFA88B] border border-white/60 shadow-xl"
    : "bg-gradient-to-b from-[#F7EFFF] via-[#EADBFF] to-[#C0A0ED] border border-white/60 shadow-xl";
}

export default function CeritaSection() {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.omahCerita : en.omahCerita;
  const [dbStories, setDbStories] = useState<Story[]>([]);

  useEffect(() => {
    getStories()
      .then(setDbStories)
      .catch(() => {});
  }, []);

  const activeStories = dbStories.length > 0 ? dbStories : DUMMY_STORIES;

  const stories = useMemo(
    () =>
      activeStories.map((s, i) => ({
        id: s.id,
        title: s.title,
        author: s.is_anonymous ? t.anonim : s.name,
        category: s.category || "",
        date: formatDate(s.created_at),
        content: s.content,
        likes: 0,
        comments: 0,
      })),
    [activeStories, t.anonim],
  );

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const currentStory = stories[index] || stories[0];

  return (
    <div className="min-h-screen bg-[#FAF5ED] font-sans antialiased text-[#3A2E5A]">
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-r from-[#53267d] via-[#3a2e8c] to-[#1d41a5] text-white py-14 px-6 text-center overflow-hidden">
        {/* Pattern Hiasan Halftone / Dot */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-5 py-1 rounded-full border border-white/40 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-sm"
          >
            {locale === "id" ? "CERITA KITA" : t.ceritaKita.toUpperCase()}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl md:text-4xl font-extrabold tracking-wide mb-2 uppercase"
          >
            {locale === "id" ? "Ruang Aman untuk Bercerita" : "A Safe Space for Sharing"}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base text-gray-200 mb-6 font-normal"
          >
            {locale === "id" ? "Cerita dapat dibagikan secara anonim" : "Stories can be shared anonymously"}
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => router.push("/omah-cerita/buat-cerita")}
            className="inline-flex items-center gap-2 bg-white text-[#3A2E5A] px-6 py-2.5 rounded-full font-bold text-xs md:text-sm shadow-md hover:bg-gray-100 transition-all"
          >
            {t.bagikanKisah}
            <span className="w-5 h-5 bg-[#3A2E5A] text-white rounded-full flex items-center justify-center">
              <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          </motion.button>
        </div>
      </section>

      {/* 2. SECTION CAROUSEL CERITA */}
      <section className="py-12 px-6 min-h-[600px] flex flex-col justify-center">
        <div className="max-w-5xl mx-auto w-full">
          {/* Header Title & Button */}
          <Reveal className="flex flex-col items-center text-center mb-10 gap-3">
            <h2 className="text-2xl md:text-3xl font-black text-[#51236E] uppercase tracking-wide">
              {locale === "id" ? "Cerita Kawan Kita" : t.ceritaKawan}
            </h2>
            <button
              onClick={() => router.push("/omah-cerita/semua-cerita")}
              className="inline-flex items-center gap-2 bg-[#51236E] text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-[#3D1A54] transition-colors shadow-md"
            >
              {t.lihatSemua}
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
                onClick={handlePrev}
                className="w-10 h-10 md:w-12 md:h-12 bg-[#51236E] text-white rounded-full flex items-center justify-center hover:bg-[#3D1A54] transition-all shadow-lg pointer-events-auto active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 md:w-12 md:h-12 bg-[#51236E] text-white rounded-full flex items-center justify-center hover:bg-[#3D1A54] transition-all shadow-lg pointer-events-auto active:scale-95"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Card Animated Wrapper */}
            <div className="w-full max-w-3xl [perspective:1500px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStory.id}
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
                  onClick={() => router.push(`/omah-cerita/${currentStory.id}`)}
                  className={`p-8 md:p-12 rounded-[36px] relative flex flex-col items-center text-center transition-all duration-300 cursor-pointer ${cardBackgroundClass(index)}`}
                >
                  {/* Card Header Info */}
                  <h3 className="text-2xl md:text-3xl font-extrabold text-[#3A2E5A] mb-3">
                    {currentStory.title}
                  </h3>

                  {/* Badge Kategori */}
                  <span className="bg-[#FCD34D] text-[#3A2E5A] text-xs font-extrabold px-5 py-1 rounded-full shadow-sm mb-3">
                    {currentStory.category || "Curhat"}
                  </span>

                  {/* Author & Date */}
                  <div className="text-xs md:text-sm text-[#6C5B7B] font-semibold mb-6">
                    <p>oleh {currentStory.author || "Anonim"}</p>
                    <p>{currentStory.date}</p>
                  </div>

                  {/* Story Content */}
                  <p className="text-xs md:text-sm leading-relaxed text-[#3A2E5A] max-w-2xl font-medium mb-8">
                    {currentStory.content}{" "}
                    <span
                      className="font-bold underline cursor-pointer"
                      onClick={() => router.push(`/omah-cerita/${currentStory.id}`)}
                    >
                      {t.bacaSelengkapnya}
                    </span>
                  </p>

                  {/* Card Footer Actions (Suka, Komentar, Laporkan) */}
                  <div className="w-full flex items-center justify-between pt-4 border-t border-[#3A2E5A]/10 text-[#3A2E5A]">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
                          <Heart className="w-4 h-4 fill-[#3A2E5A] text-[#3A2E5A]" />
                        </div>
                        <span className="text-xs font-bold">
                          {t.suka.replace("{likes}", String(currentStory.likes))}
                        </span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center shadow-sm">
                          <MessageCircle className="w-4 h-4 text-[#3A2E5A]" />
                        </div>
                        <span className="text-xs font-bold">
                          {t.komentar.replace("{comments}", String(currentStory.comments))}
                        </span>
                      </button>
                    </div>

                    <button className="flex items-center gap-1 text-xs font-bold hover:opacity-70 transition-opacity">
                      <Flag className="w-3.5 h-3.5" />
                      <span>{t.laporkan}</span>
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
