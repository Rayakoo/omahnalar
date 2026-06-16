"use client";

import { useState, useEffect, useMemo, useId } from "react";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { ChevronLeft, Heart, MessageSquare, Flag } from "lucide-react";
import { getStoriesPaginated, type Story } from "@/services/stories";
import { DUMMY_STORIES } from "@/data/dummyStories";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

const CARD_THEMES = [
  { bg: "#F07A94", text: "#FFFFFF" },
  { bg: "#7C78A8", text: "#FFFFFF" },
  { bg: "#6BBF8A", text: "#FFFFFF" },
  { bg: "#FAC775", text: "#4A4763" },
  { bg: "#E6E4F9", text: "#4A4763" },
];

function seededTheme(seed: number, index: number) {
  const idx = (seed + index * 3) % CARD_THEMES.length;
  const prev = (seed + (index - 1) * 3) % CARD_THEMES.length;
  const final = idx === prev && index > 0 ? (idx + 1) % CARD_THEMES.length : idx;
  return CARD_THEMES[final];
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

interface DisplayStory {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
  theme: { bg: string; text: string };
}

export default function SemuaCerita() {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.omahCerita : en.omahCerita;
  const common = locale === "id" ? id.common : en.common;
  const uid = useId();
  const seed = useMemo(() => {
    let h = 0;
    for (let i = 0; i < uid.length; i++) h = ((h << 5) - h) + uid.charCodeAt(i), h |= 0;
    return Math.abs(h) % 1000;
  }, [uid]);

  const [stories, setStories] = useState<DisplayStory[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [useDummy, setUseDummy] = useState(false);

  const { ref, inView } = useInView({ threshold: 0.1 });

  const PAGE_SIZE = 9;

  const loadStories = async (startFrom: number, append: boolean) => {
    setLoading(true);
    try {
      const { data, count } = await getStoriesPaginated(startFrom, startFrom + PAGE_SIZE - 1);
      const isDummyFallback = (append && useDummy) || (!append && data.length === 0);
      if (isDummyFallback) setUseDummy(true);

      const source = isDummyFallback ? DUMMY_STORIES : data;

      const mapped = source.slice(startFrom, startFrom + PAGE_SIZE).map((s, i) => ({
        id: s.id,
        title: s.title,
        author: s.is_anonymous ? t.anonim : s.name,
        category: s.category || "",
        date: formatDate(s.created_at),
        content: s.content,
        likes: 0,
        comments: 0,
        theme: seededTheme(seed, startFrom + i),
      }));

      if (append) {
        setStories((prev) => [...prev, ...mapped]);
      } else {
        setStories(mapped);
      }

      const total = isDummyFallback ? DUMMY_STORIES.length : count;
      if (total !== null && startFrom + PAGE_SIZE >= total) {
        setHasMore(false);
      }
      setOffset(startFrom + mapped.length);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadStories(offset, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

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
          {common.back}
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8 text-brand-900 tracking-wide">
          {t.ceritaKawan}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between border min-h-[260px] cursor-pointer"
              style={{
                backgroundColor: story.theme.bg,
                color: story.theme.text,
                borderColor: `${story.theme.text}1A`,
              }}
              onClick={() => router.push(`/omah-cerita/${story.id}`)}
            >
              <div>
                <h3 className="text-base font-bold leading-snug mb-1" style={{ color: story.theme.text }}>
                  {story.title}
                </h3>
                <span className="inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3" style={{ backgroundColor: `${story.theme.text}22`, color: story.theme.text }}>
                  {story.category}
                </span>
                <p className="text-[10px] font-medium mb-4" style={{ color: story.theme.text, opacity: 0.5 }}>
                  oleh {story.author}
                </p>
                <p className="text-[11px] font-medium mb-4" style={{ color: story.theme.text, opacity: 0.6 }}>
                  {story.date}
                </p>
                <p className="text-xs md:text-sm leading-relaxed font-normal mb-6" style={{ color: story.theme.text, opacity: 0.85 }}>
                  {story.content}
                </p>
              </div>

              <div
                className="flex items-center justify-between pt-4 text-xs font-semibold"
                style={{ borderTop: `1px solid ${story.theme.text}1A`, color: story.theme.text, opacity: 0.7 }}
              >
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 transition-opacity hover:opacity-100" style={{ opacity: 0.8 }}>
                    <Heart className="w-4 h-4" style={{ fill: story.theme.text, color: story.theme.text }} />
                    <span>{story.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 transition-opacity hover:opacity-100" style={{ opacity: 0.8 }}>
                    <MessageSquare className="w-4 h-4" />
                    <span>{story.comments}</span>
                  </button>
                </div>

                <button className="flex items-center gap-1 transition-opacity hover:opacity-100" style={{ opacity: 0.7 }}>
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
              <span>{t.memuatCerita}</span>
            </div>
          ) : stories.length > 0 ? (
            <p className="text-sm text-brand-700/40 font-medium tracking-wide">
              {t.semuaDitampilkan}
            </p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
