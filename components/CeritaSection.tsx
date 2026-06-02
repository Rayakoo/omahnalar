"use client";

import { useState, useMemo, useId } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, MessageSquare, Flag } from "lucide-react";

const CARD_THEMES = [
  { bg: "#F07A94", text: "#FFFFFF" },
  { bg: "#7C78A8", text: "#FFFFFF" },
  { bg: "#6BBF8A", text: "#FFFFFF" },
  { bg: "#FAC775", text: "#4A4763" },
  { bg: "#E6E4F9", text: "#4A4763" },
];

const RAW_STORIES = [
  {
    id: 1,
    title: "Aku akhirnya berani cerita ke sini setelah setahun memendam sendiri",
    date: "28 Maret 2026",
    content:
      "setelah berulang kali berpikir, aku akhirnya memutuskan untuk bercerita disini karena sudah tidak kuat menanggung beban ini sendiri. mungkin dengan bercerita sebagai anonim akan dapat membuat perasaanku lebih lega...",
    likes: 18,
    comments: 8,
  },
  {
    id: 2,
    title: "Belajar menerima kenyataan pahit dan mulai melangkah ke depan",
    date: "12 Mei 2026",
    content:
      "Terima kasih atas ruang aman ini. Menuliskan apa yang ada di kepala rasanya melepas separuh beban yang selama ini menghimpit dada. Untuk kalian yang sedang berjuang, kita tidak sendirian...",
    likes: 34,
    comments: 5,
  },
  {
    id: 3,
    title: "Perjalananku mencari jati diri di tengah tekanan sosial",
    date: "2 Mei 2026",
    content:
      "Selama ini aku merasa tertekan dengan ekspektasi orang sekitar. Melalui ruang ini, aku belajar bahwa setiap orang punya waktunya sendiri untuk tumbuh dan berkembang.",
    likes: 27,
    comments: 12,
  },
  {
    id: 4,
    title: "Berani mengatakan tidak pada toxic relationship",
    date: "19 Mei 2026",
    content:
      "Butuh waktu lama untuk menyadari bahwa aku pantas diperlakukan lebih baik. Sekarang aku lebih berani menetapkan batasan dan menghargai diriku sendiri.",
    likes: 42,
    comments: 9,
  },
  {
    id: 5,
    title: "Syukur bisa menemukan komunitas yang mendukung",
    date: "25 Mei 2026",
    content:
      "Aku tidak pernah menyangka akan menemukan tempat yang menerima aku apa adanya. Terima kasih untuk semua yang telah berbagi cerita dan memberi semangat.",
    likes: 51,
    comments: 20,
  },
];

function seededPick(seed: number, i: number, total: number) {
  const idx = (seed + i * 3) % CARD_THEMES.length;
  const prev = (seed + (i - 1) * 3) % CARD_THEMES.length;
  const final = idx === prev && i > 0 ? (idx + 1) % CARD_THEMES.length : idx;
  return CARD_THEMES[final];
}

export default function CeritaSection() {
  const router = useRouter();
  const id = useId();
  const seed = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const stories = useMemo(
    () =>
      RAW_STORIES.map((story, i) => ({
        ...story,
        theme: seededPick(seed, i, RAW_STORIES.length),
      })),
    [seed],
  );

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const currentStory = stories[index];
  const theme = currentStory.theme;

  const stackThemes = useMemo(() => {
    const COLORS = CARD_THEMES.map((t) => t.bg);
    const currentBg = theme.bg;
    const available = COLORS.filter((c) => c !== currentBg);
    const a = available[(seed + index * 3) % available.length];
    const b = available[(seed + index * 3 + 7) % available.length];
    return { bottom: a, middle: b === a ? available[(seed + index * 3 + 13) % available.length] : b };
  }, [seed, index, theme.bg]);

  return (
    <div className="w-full bg-page-50 min-h-screen text-brand-900 font-sans select-none overflow-hidden">
      {/* ================= HERO SECTION (Cerita Kita) ================= */}
      <section className="bg-brand-900 text-white px-8 md:px-20 py-16 flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-secondary-500">Cerita Kita</h1>
        <p className="text-lg md:text-xl font-normal max-w-2xl opacity-90 leading-relaxed">
          Ruang aman untuk bercerita dan menyalurkan curahan hati yang sulit diceritakan.
        </p>
        <p className="text-xs md:text-sm text-secondary-200/80 font-light tracking-wide">
          Anda tidak wajib mengisi identitas dan bisa bercerita sebagai anonim
        </p>
        <button
          onClick={() => router.push("/omah-cerita/buat-cerita")}
          className="mt-4 w-fit bg-brand-100 text-brand-900 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-brand-100/90 active:scale-95 transition-all text-sm"
        >
          Bagikan kisahku
        </button>
      </section>

      {/* ================= SLIDER SECTION (Cerita Kawan Kita) ================= */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {/* Header Slider */}
        <div className="flex justify-between items-center mb-16 relative">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 tracking-wide">
            Cerita Kawan Kita
          </h2>
          <button
            onClick={() => router.push("/omah-cerita/semua-cerita")}
            className="bg-brand-100 border border-brand-700/20 text-brand-900/80 px-5 py-2 rounded-full text-xs font-semibold shadow-sm hover:bg-brand-100/90 transition-all"
          >
            Lihat Semua Cerita
          </button>
        </div>

        {/* Slider Container */}
        <div className="relative flex items-center justify-between gap-4 md:gap-8 min-h-[460px]">
          {/* Tombol Navigasi Kiri */}
          <button
            onClick={handlePrev}
            className="z-30 p-2.5 md:p-3 bg-white border-2 border-brand-900 rounded-full text-brand-900 hover:bg-brand-900 hover:text-white transition-all shadow-md active:scale-90"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Wrapper Animasi 3D & Efek Tumpukan Kertas */}
          <div className="relative w-full max-w-3xl flex items-center justify-center [perspective:1500px]">
            {/* Dekorasi Kertas Tumpukan 2 (Paling Bawah) */}
            <div
              className="absolute inset-0 rounded-[28px] rotate-[3deg] translate-y-3 translate-x-1 border border-brand-900/5 shadow-sm pointer-events-none"
              style={{ backgroundColor: `${stackThemes.bottom}66` }}
            />

            {/* Dekorasi Kertas Tumpukan 1 (Tengah) */}
            <div
              className="absolute inset-0 rounded-[28px] -rotate-[2deg] translate-y-2 -translate-x-1 border border-brand-900/10 shadow-sm flex items-end justify-end p-5 pointer-events-none"
              style={{ backgroundColor: `${stackThemes.middle}CC` }}
            >
              <div className="flex items-center gap-1.5 text-brand-900/40 font-semibold text-xs tracking-wide">
                <Flag className="w-3.5 h-3.5" /> laporkan
              </div>
            </div>

            {/* KARTU UTAMA DENGAN ANIMASI FLIP */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={{
                  enter: (dir: number) => ({
                    rotateY: dir > 0 ? 90 : -90,
                    opacity: 0,
                    scale: 0.92,
                  }),
                  center: {
                    rotateY: 0,
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.55,
                      ease: [0.25, 1, 0.5, 1],
                    },
                  },
                  exit: (dir: number) => ({
                    rotateY: dir > 0 ? -90 : 90,
                    opacity: 0,
                    scale: 0.92,
                    transition: { duration: 0.35 },
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
                className="w-full p-8 md:p-12 rounded-[28px] shadow-xl relative z-10 flex flex-col justify-between min-h-[340px]"
              >
                {/* Isi Konten */}
                <div className="text-center flex flex-col gap-4">
                  <h3 className="text-xl md:text-2xl font-bold tracking-wide leading-snug px-4" style={{ color: theme.text }}>
                    {currentStory.title}
                  </h3>

                  <p className="text-xs font-medium tracking-widest" style={{ color: theme.text, opacity: 0.7 }}>
                    {currentStory.date}
                  </p>

                  <p className="text-xs md:text-sm leading-relaxed max-w-2xl mx-auto font-normal mt-2" style={{ color: theme.text, opacity: 0.9 }}>
                    {currentStory.content}{" "}
                    <span className="font-bold underline cursor-pointer" style={{ color: theme.text }}>
                      baca selengkapnya
                    </span>
                  </p>
                </div>

                {/* Footer Interaksi di dalam kartu */}
                <div className="flex items-center justify-between pt-6 mt-8 text-xs md:text-sm font-medium" style={{ borderTop: `1px solid ${theme.text}33` }}>
                  <div className="flex items-center gap-5">
                    <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                      <Heart className="w-4 h-4" style={{ fill: theme.text, color: theme.text }} />
                      <span>suka ({currentStory.likes})</span>
                    </button>

                    <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                      <MessageSquare className="w-4 h-4" />
                      <span>komentar ({currentStory.comments})</span>
                    </button>
                  </div>

                  <button className="flex items-center gap-1.5 transition-all" style={{ color: theme.text, opacity: 0.9 }}>
                    <Flag className="w-4 h-4" />
                    <span>laporkan</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Tombol Navigasi Kanan */}
          <button
            onClick={handleNext}
            className="z-30 p-2.5 md:p-3 bg-white border-2 border-brand-900 rounded-full text-brand-900 hover:bg-brand-900 hover:text-white transition-all shadow-md active:scale-90"
          >
            <ArrowRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </section>
    </div>
  );
}
