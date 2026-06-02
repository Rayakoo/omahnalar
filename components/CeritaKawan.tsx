"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, MessageCircle, Flag } from "lucide-react";

const CARD_THEMES = [
  { bg: "#F07A94", text: "#FFFFFF", accent: "white" },
  { bg: "#7C78A8", text: "#FFFFFF", accent: "white" },
  { bg: "#6BBF8A", text: "#FFFFFF", accent: "white" },
  { bg: "#FAC775", text: "#4A4763", accent: "#4A4763" },
  { bg: "#E6E4F9", text: "#4A4763", accent: "#4A4763" },
];

function randomTheme() {
  return CARD_THEMES[Math.floor(Math.random() * CARD_THEMES.length)];
}

const DUMMY_STORIES = [
  {
    id: 1,
    title: "Aku akhirnya berani cerita ke sini setelah setahun memendam sendiri",
    date: "28 Maret 2026",
    content:
      "Setelah berulang kali berpikir, aku akhirnya memutuskan untuk bercerita di sini karena sudah tidak kuat menanggung beban ini sendiri, mungkin dengan bercerita sebagai anonim akan membuat perasaanku lebih lega...",
    likes: 18,
    comments: 8,
    theme: randomTheme(),
  },
  {
    id: 2,
    title: "Mencoba bangkit dari kegagalan yang membuatku terpuruk",
    date: "15 April 2026",
    content:
      "Hari ini aku belajar bahwa jatuh itu biasa, yang luar biasa adalah bagaimana kita mencuci luka dan kembali berdiri meski kaki masih gemetar. Terima kasih Omah Cerita sudah jadi ruang aman...",
    likes: 42,
    comments: 12,
    theme: randomTheme(),
  },
  {
    id: 3,
    title: "Perjalananku mencari jati diri di tengah tekanan sosial",
    date: "2 Mei 2026",
    content:
      "Selama ini aku merasa tertekan dengan ekspektasi orang sekitar. Melalui Omah Cerita, aku belajar bahwa setiap orang punya waktunya sendiri untuk tumbuh dan berkembang.",
    likes: 35,
    comments: 15,
    theme: randomTheme(),
  },
  {
    id: 4,
    title: "Berani mengatakan tidak pada toxic relationship",
    date: "19 Mei 2026",
    content:
      "Butuh waktu lama untuk menyadari bahwa aku pantas diperlakukan lebih baik. Sekarang aku lebih berani menetapkan batasan dan menghargai diriku sendiri.",
    likes: 27,
    comments: 9,
    theme: randomTheme(),
  },
  {
    id: 5,
    title: "Syukur bisa menemukan komunitas yang mendukung",
    date: "25 Mei 2026",
    content:
      "Aku tidak pernah menyangka akan menemukan tempat yang menerima aku apa adanya. Terima kasih untuk semua yang telah berbagi cerita dan memberi semangat.",
    likes: 51,
    comments: 20,
    theme: randomTheme(),
  },
];

export default function CeritaKawan() {
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
  const theme = story.theme;

  return (
    <section className="bg-page-50 py-16 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <h2 className="text-3xl font-bold text-brand-900 border-b-4 border-secondary-500 pb-2">
            Cerita Kawan Kita
          </h2>
          <button className="bg-brand-100 text-brand-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-brand-700 hover:text-white transition-colors shadow-sm">
            Lihat Semua Cerita
          </button>
        </div>

        <div className="relative flex items-center justify-center min-h-[500px]">
          <div className="absolute inset-x-0 flex justify-between items-center z-20 pointer-events-none">
            <button
              onClick={prevStep}
              className="p-3 bg-brand-900 text-white rounded-full hover:bg-brand-700 transition-all shadow-lg pointer-events-auto active:scale-95"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextStep}
              className="p-3 bg-brand-900 text-white rounded-full hover:bg-brand-700 transition-all shadow-lg pointer-events-auto active:scale-95"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>

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
                  backgroundColor: theme.bg,
                  color: theme.text,
                }}
                className="p-10 md:p-14 rounded-[40px] shadow-2xl relative"
              >
                <div className="text-center">
                  <h3 className="text-2xl md:text-4xl font-medium leading-tight mb-6">
                    &ldquo;{story.title}&rdquo;
                  </h3>
                  <p
                    className="text-lg mb-6 font-light"
                    style={{ opacity: 0.9 }}
                  >
                    {story.date}
                  </p>
                  <p
                    className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto italic"
                    style={{ opacity: 0.9 }}
                  >
                    {story.content}{" "}
                    <span className="font-bold underline cursor-pointer">
                      ...baca selengkapnya
                    </span>
                  </p>
                </div>

                <div
                  className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-6"
                  style={{ borderTop: `1px solid ${theme.accent}33` }}
                >
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 hover:scale-110 transition-transform">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${theme.accent}33` }}
                      >
                        <Heart
                          className="w-5 h-5"
                          style={{
                            fill: theme.text,
                            color: theme.text,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        suka ({story.likes})
                      </span>
                    </button>
                    <button className="flex items-center gap-2 hover:scale-110 transition-transform">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${theme.accent}33` }}
                      >
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">
                        komentar ({story.comments})
                      </span>
                    </button>
                  </div>

                  <button
                    className="flex items-center gap-2 transition-colors"
                    style={{
                      color: `${theme.text}CC`,
                    }}
                  >
                    <Flag className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Laporkan
                    </span>
                  </button>
                </div>

                <div className="absolute -bottom-10 right-4 md:right-0">
                  <button
                    className="flex items-center gap-2 font-bold transition-colors"
                    style={{
                      color: `${theme.text}99`,
                    }}
                  >
                    <Flag className="w-4 h-4" /> laporkan
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
