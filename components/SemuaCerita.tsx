"use client";

import { useState, useEffect, useMemo, useId } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, MessageSquare, Flag } from "lucide-react";

const CARD_THEMES = [
  { bg: "#F07A94", text: "#FFFFFF" },
  { bg: "#7C78A8", text: "#FFFFFF" },
  { bg: "#6BBF8A", text: "#FFFFFF" },
  { bg: "#FAC775", text: "#4A4763" },
  { bg: "#E6E4F9", text: "#4A4763" },
];

interface Story {
  id: string;
  title: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
  theme: { bg: string; text: string };
}

function seededTheme(seed: number, index: number) {
  const idx = (seed + index * 3) % CARD_THEMES.length;
  const prev = (seed + (index - 1) * 3) % CARD_THEMES.length;
  const final = idx === prev && index > 0 ? (idx + 1) % CARD_THEMES.length : idx;
  return CARD_THEMES[final];
}

const BASE_TITLE = "Aku akhirnya berani cerita ke sini setelah setahun memendam sendiri";
const BASE_DATE = "28 Maret 2026";
const BASE_CONTENT =
  "setelah berulang kali berpikir, aku akhirnya memutuskan untuk bercerita disini karena sudah tidak kuat menanggung beban ini sendiri. mungkin dengan bercerita sebagai anonim akan dapat membuat perasaanku lebih lega... baca selengkapnya";

function generateMockStories(startIndex: number, seed: number, limit: number = 9): Story[] {
  return Array.from({ length: limit }).map((_, index) => {
    const globalIndex = startIndex + index;
    return {
      id: `story-${globalIndex}`,
      title: BASE_TITLE,
      date: BASE_DATE,
      content: BASE_CONTENT,
      likes: Math.floor(Math.abs(Math.sin(seed + globalIndex)) * 50) + 1,
      comments: Math.floor(Math.abs(Math.cos(seed + globalIndex * 2)) * 30) + 1,
      theme: seededTheme(seed, globalIndex),
    };
  });
}

export default function SemuaCerita() {
  const router = useRouter();
  const id = useId();
  const seed = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const [stories, setStories] = useState<Story[]>(() => generateMockStories(0, seed, 9));
  const [offset, setOffset] = useState(9);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView && hasMore) {
      const timer = setTimeout(() => {
        const newStories = generateMockStories(offset, seed, 6);

        if (offset >= 33) {
          setHasMore(false);
        }

        setStories((prev) => [...prev, ...newStories]);
        setOffset((prev) => prev + 6);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [inView, offset, hasMore, seed]);

  return (
    <div className="min-h-screen bg-page-50 text-brand-900 font-sans antialiased">
      <nav className="bg-secondary-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-brand-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
            Ω
          </div>
        </div>

        <button
          onClick={() => router.push("/omah-cerita")}
          className="flex items-center gap-1 bg-brand-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-brand-700 transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8 text-brand-900 tracking-wide">
          Cerita Kawan Kita
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between border min-h-[260px]"
              style={{
                backgroundColor: story.theme.bg,
                color: story.theme.text,
                borderColor: `${story.theme.text}1A`,
              }}
            >
              <div>
                <h3
                  className="text-base font-bold leading-snug mb-1"
                  style={{ color: story.theme.text }}
                >
                  {story.title}
                </h3>

                <p
                  className="text-[11px] font-medium mb-4"
                  style={{ color: story.theme.text, opacity: 0.6 }}
                >
                  {story.date}
                </p>

                <p
                  className="text-xs md:text-sm leading-relaxed font-normal mb-6"
                  style={{ color: story.theme.text, opacity: 0.85 }}
                >
                  {story.content}
                </p>
              </div>

              <div
                className="flex items-center justify-between pt-4 text-xs font-semibold"
                style={{
                  borderTop: `1px solid ${story.theme.text}1A`,
                  color: story.theme.text,
                  opacity: 0.7,
                }}
              >
                <div className="flex items-center gap-4">
                  <button
                    className="flex items-center gap-1 transition-opacity hover:opacity-100"
                    style={{ opacity: 0.8 }}
                  >
                    <Heart className="w-4 h-4" style={{ fill: story.theme.text, color: story.theme.text }} />
                    <span>{story.likes}</span>
                  </button>
                  <button
                    className="flex items-center gap-1 transition-opacity hover:opacity-100"
                    style={{ opacity: 0.8 }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{story.comments}</span>
                  </button>
                </div>

                <button
                  className="flex items-center gap-1 transition-opacity hover:opacity-100"
                  style={{ opacity: 0.7 }}
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div ref={ref} className="w-full flex items-center justify-center py-10 mt-6">
          {hasMore ? (
            <div className="flex items-center gap-2 text-sm text-brand-700/70 font-medium">
              <div className="w-5 h-5 border-2 border-brand-700 border-t-transparent rounded-full animate-spin" />
              <span>Memuat cerita lainnya...</span>
            </div>
          ) : (
            <p className="text-sm text-brand-700/40 font-medium tracking-wide">
              Semua cerita telah ditampilkan
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
