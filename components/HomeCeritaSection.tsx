"use client";

import { useState, useMemo, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, MessageSquare, Flag } from "lucide-react";
import { getStories, type Story } from "@/services/stories";
import { DUMMY_STORIES } from "@/data/dummyStories";

const CARD_THEMES = [
  { bg: "#F07A94", text: "#FFFFFF" },
  { bg: "#7C78A8", text: "#FFFFFF" },
  { bg: "#6BBF8A", text: "#FFFFFF" },
  { bg: "#FAC775", text: "#4A4763" },
  { bg: "#E6E4F9", text: "#4A4763" },
];

function seededPick(seed: number, i: number, total: number) {
  const idx = (seed + i * 3) % CARD_THEMES.length;
  const prev = (seed + (i - 1) * 3) % CARD_THEMES.length;
  const final = idx === prev && i > 0 ? (idx + 1) % CARD_THEMES.length : idx;
  return CARD_THEMES[final];
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function HomeCeritaSection() {
  const router = useRouter();
  const [dbStories, setDbStories] = useState<Story[]>([]);
  const id = useId();
  const seed = useMemo(() => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i), h |= 0;
    return Math.abs(h) % 1000;
  }, [id]);

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
        author: s.is_anonymous ? "Anonim" : s.name,
        category: s.category || "",
        date: formatDate(s.created_at),
        content: s.content,
        likes: 0,
        comments: 0,
        theme: seededPick(seed, i, activeStories.length),
      })),
    [activeStories, seed],
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
  const theme = currentStory?.theme || CARD_THEMES[0];

  const stackThemes = useMemo(() => {
    const COLORS = CARD_THEMES.map((t) => t.bg);
    const currentBg = theme.bg;
    const available = COLORS.filter((c) => c !== currentBg);
    const a = available[(seed + index * 3) % available.length];
    const b = available[(seed + index * 3 + 7) % available.length];
    return { bottom: a, middle: b === a ? available[(seed + index * 3 + 13) % available.length] : b };
  }, [seed, index, theme.bg]);

  return (
    <section className="w-full bg-page-50 text-brand-900 font-sans select-none overflow-hidden py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-900 tracking-wide">
              Cerita Terbaru
            </h2>
            <p className="text-sm text-brand-700/60 mt-1 font-medium">Cerita terbaru dari komunitas</p>
          </div>
          <button
            onClick={() => router.push("/omah-cerita/semua-cerita")}
            className="bg-brand-100 border border-brand-700/20 text-brand-900/80 px-5 py-2 rounded-full text-xs font-semibold shadow-sm hover:bg-brand-100/90 transition-all"
          >
            Lihat Semua Cerita
          </button>
        </div>

        <div className="relative flex items-center justify-between gap-4 md:gap-8 min-h-[420px]">
          <button
            onClick={handlePrev}
            className="z-30 p-2.5 md:p-3 bg-white border-2 border-brand-900 rounded-full text-brand-900 hover:bg-brand-900 hover:text-white transition-all shadow-md active:scale-90 shrink-0"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div className="relative w-full max-w-3xl flex items-center justify-center [perspective:1500px]">
            <div
              className="absolute inset-0 rounded-[28px] rotate-[3deg] translate-y-3 translate-x-1 border border-brand-900/5 shadow-sm pointer-events-none"
              style={{ backgroundColor: `${stackThemes.bottom}66` }}
            />
            <div
              className="absolute inset-0 rounded-[28px] -rotate-[2deg] translate-y-2 -translate-x-1 border border-brand-900/10 shadow-sm flex items-end justify-end p-5 pointer-events-none"
              style={{ backgroundColor: `${stackThemes.middle}CC` }}
            >
              <div className="flex items-center gap-1.5 text-brand-900/40 font-semibold text-xs tracking-wide">
                <Flag className="w-3.5 h-3.5" /> laporkan
              </div>
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={{
                  enter: (dir: number) => ({ rotateY: dir > 0 ? 90 : -90, opacity: 0, scale: 0.92 }),
                  center: { rotateY: 0, opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] } },
                  exit: (dir: number) => ({ rotateY: dir > 0 ? -90 : 90, opacity: 0, scale: 0.92, transition: { duration: 0.35 } }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d", backgroundColor: theme.bg, color: theme.text }}
                className="w-full p-8 md:p-12 rounded-[28px] shadow-xl relative z-10 flex flex-col justify-between min-h-[340px]"
              >
                <div className="text-center flex flex-col gap-4">
                  <h3 className="text-xl md:text-2xl font-bold tracking-wide leading-snug px-4" style={{ color: theme.text }}>
                    {currentStory.title}
                  </h3>
                  <span className="inline-block mx-auto text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ backgroundColor: `${theme.text}22`, color: theme.text }}>
                    {currentStory.category}
                  </span>
                  <p className="text-xs font-medium" style={{ color: theme.text, opacity: 0.6 }}>
                    oleh {currentStory.author}
                  </p>
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

                <div className="flex items-center justify-between pt-6 mt-8 text-xs md:text-sm font-medium" style={{ borderTop: `1px solid ${theme.text}33` }}>
                  <div className="flex items-center gap-5">
                    <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                      <Heart className="w-4 h-4" style={{ fill: theme.text, color: theme.text }} />
                      <span>suka (0)</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                      <MessageSquare className="w-4 h-4" />
                      <span>komentar (0)</span>
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

          <button
            onClick={handleNext}
            className="z-30 p-2.5 md:p-3 bg-white border-2 border-brand-900 rounded-full text-brand-900 hover:bg-brand-900 hover:text-white transition-all shadow-md active:scale-90 shrink-0"
          >
            <ArrowRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}
