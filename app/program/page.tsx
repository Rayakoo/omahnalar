"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { getPrograms, type Program } from "@/services/programs";
import { getBerita, type Berita } from "@/services/berita";
import { getBeholdPosts } from "@/services/behold";
import { transformImageUrl } from "@/lib/image";

const FALLBACK_IMG = "/images/omah_nalar.JPG";
const IG_HANDLE = "@omahnalar";
const SOSMED_BATCH = 9;

type CardItem = {
  id: string;
  category: "Sosmed" | "Berita";
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  href: string;
  external?: boolean;
};

const staticData: CardItem[] = [
  {
    id: "static-1",
    category: "Berita",
    title:
      "Tim Penelitian Omah Nalar Edukasi Kesehatan Reproduksi pada Siswa MTS Taufiqiyah Kabupaten Malang",
    excerpt:
      "Omah Nalar melalui tim penelitiannya menyelenggarakan kegiatan edukasi kesehatan reproduksi bagi siswa-siswi....",
    author: "Alfia & Randy",
    date: "11 September 2026",
    image: "/images/berita-1.jpg",
    href: "/berita/tim-penelitian-omah-nalar-edukasi",
  },
  {
    id: "static-2",
    category: "Berita",
    title:
      "Cegah Anemia Sejak Dini, Mahasiswa FK UM Bersama Omah Nalar Gelar Skrining dan Edukasi Kesehatan di MTS Dzunnurain, Malang",
    excerpt:
      "Omah Nalar berkolaborasi dengan mahasiswa Fakultas Kedokteran Universitas Negeri Malang (FK UM) dalam kegiatan",
    author: "Rafi Ananta",
    date: "3 Oktober 2026",
    image: "/images/berita-2.jpg",
    href: "/berita/cegah-anemia-sejak-dini",
  },
  {
    id: "static-3",
    category: "Berita",
    title: "",
    excerpt: "",
    author: "User",
    date: "3 Oktober 2026",
    image: "/images/berita-3.jpg",
    href: "/berita/artikel-terbaru",
  },
];

function getThumbnail(image_url: { url: string; is_thumbnail: boolean }[]): string {
  const thumb = image_url.find((img) => img.is_thumbnail);
  const url = thumb?.url || image_url[0]?.url || null;
  return url ? transformImageUrl(url) : FALLBACK_IMG;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsSection() {
  const [activeTab, setActiveTab] = useState<"semua" | "sosmed" | "berita">("semua");
  const [items, setItems] = useState<CardItem[]>(staticData);
  const [sosmedCount, setSosmedCount] = useState(SOSMED_BATCH);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      getPrograms(),
      getBerita(),
      getBeholdPosts().catch(() => []),
    ])
      .then(([progs, news, posts]) => {
        const programItems: CardItem[] = progs.map((p: Program) => ({
          id: `program-${p.id}`,
          category: "Berita",
          title: p.title,
          excerpt: p.tagline,
          author: p.location || "Omah Nalar",
          date: p.period || "",
          image: getThumbnail(p.image_url),
          href: `/program/${p.slug}`,
        }));
        const beritaItems: CardItem[] = news.map((b: Berita) => ({
          id: `berita-${b.id}`,
          category: "Berita",
          title: b.title,
          excerpt: b.excerpt || "",
          author: b.author || "Omah Nalar",
          date: formatDate(b.published_at || b.created_at),
          image: getThumbnail(b.image_url),
          href: `/berita/${b.slug}`,
        }));
        const sosmedItems: CardItem[] = posts.map((post) => ({
          id: `sosmed-${post.id}`,
          category: "Sosmed",
          title: post.alt,
          excerpt: "",
          author: IG_HANDLE,
          date: formatDate(post.timestamp),
          image: post.imageUrl,
          href: post.postUrl,
          external: true,
        }));
        setItems([...sosmedItems, ...programItems, ...beritaItems, ...staticData]);
      })
      .catch(() => {});
  }, []);

  const filteredArticles = items.filter((item) => {
    if (activeTab === "semua") return true;
    return item.category.toLowerCase() === activeTab;
  });

  // Lazy load tab Sosmed: tampilkan bertahap per batch agar ringan,
  // otomatis tambah saat sentinel terlihat (infinite scroll).
  const sosmedTotal = useMemo(
    () => items.filter((item) => item.category === "Sosmed").length,
    [items]
  );
  const displayedItems = useMemo(() => {
    if (activeTab !== "sosmed") return filteredArticles;
    return filteredArticles.slice(0, sosmedCount);
  }, [filteredArticles, activeTab, sosmedCount]);

  useEffect(() => {
    if (activeTab !== "sosmed" || displayedItems.length >= sosmedTotal) return;
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSosmedCount((c) => (c < sosmedTotal ? c + SOSMED_BATCH : c));
        }
      },
      { rootMargin: "400px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [activeTab, displayedItems.length, sosmedTotal]);

  return (
    <div className="w-full bg-white font-sans pb-20">

      {/* ================= HERO / TITLE SECTION ================= */}
      <section className="relative w-full py-16 px-6 md:px-12 text-center text-white overflow-hidden bg-gradient-to-r from-[#591662] via-[#721e7c] to-[#00296b] mt-16">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-4"
        >
          {/* Badge Outline */}
          <div className="px-5 py-1 rounded-full border border-white/80 text-xs font-semibold tracking-wider uppercase bg-white/10 backdrop-blur-sm">
            SOSMED & BERITA
          </div>

          {/* Title Utama */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Sosmed &amp; Berita
          </h1>

          {/* Subtitle */}
          <p className="text-white/90 text-sm md:text-base font-normal max-w-2xl">
            Konten Instagram dan berita terbaru seputar kegiatan dan program Omah Nalar
          </p>

          {/* Garis Accent Kecil */}
          <div className="w-16 h-1 bg-[#f1e5cd] rounded-full mt-2" />
        </motion.div>
      </section>

      {/* ================= CONTENT SECTION ================= */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 mt-10">

        {/* Filter Tabs */}
        <Reveal className="flex items-center gap-3 mb-10">
          <button
            onClick={() => setActiveTab("semua")}
            className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${
              activeTab === "semua"
                ? "bg-[#721e7c] text-white shadow-sm"
                : "bg-[#f1e5cd] text-[#721e7c] hover:bg-[#e6d6b8]"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveTab("sosmed")}
            className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${
              activeTab === "sosmed"
                ? "bg-[#721e7c] text-white shadow-sm"
                : "bg-[#f1e5cd] text-[#721e7c] hover:bg-[#e6d6b8]"
            }`}
          >
            Sosmed
          </button>
          <button
            onClick={() => setActiveTab("berita")}
            className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${
              activeTab === "berita"
                ? "bg-[#721e7c] text-white shadow-sm"
                : "bg-[#f1e5cd] text-[#721e7c] hover:bg-[#e6d6b8]"
            }`}
          >
            Berita
          </button>
        </Reveal>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedItems.map((item, idx) => (
            <Reveal
              key={item.id}
              delay={(idx % 3) * 0.08}
              className="h-full"
            >
            <div
              className="bg-[#f1e5cd] border-2 border-[#721e7c] rounded-[2rem] p-3 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 shadow-sm overflow-hidden h-full"
            >
              {/* Top Image Section */}
              <div className="relative w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4">
                <img
                  src={item.image}
                  alt={item.title || "Gambar Berita"}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.src !== window.location.origin + FALLBACK_IMG) {
                      el.src = FALLBACK_IMG;
                    }
                  }}
                />

                {/* Soft White Gradient Overlays (Atas & Bawah Image) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#f1e5cd] via-transparent to-transparent opacity-80" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-[#f1e5cd] text-[#721e7c] font-bold text-xs px-4 py-1 rounded-full shadow-sm">
                  {item.category}
                </div>
              </div>

              {/* Body Content */}
              <div className="px-2 flex-1 flex flex-col justify-between">
                <div>
                  {item.title && (
                    <h3 className="text-[#00296b] font-bold text-sm md:text-base leading-snug mb-2 line-clamp-3">
                      {item.title}
                    </h3>
                  )}
                  {item.excerpt && (
                    <p className="text-[#00296b]/80 text-xs leading-relaxed mb-4 line-clamp-3 font-medium">
                      {item.excerpt}
                    </p>
                  )}
                </div>

                {/* Card Footer / Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-[#721e7c]/10 text-[11px] text-[#721e7c] font-medium mt-auto">
                  <div className="flex items-center gap-3">
                    {/* Author */}
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <span>{item.author}</span>
                    </div>

                    {/* Date */}
                    {item.date && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                        </svg>
                        <span>{item.date}</span>
                      </div>
                    )}
                  </div>

                  {/* Arrow Action Button */}
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 bg-[#721e7c] rounded-full flex items-center justify-center text-white hover:bg-[#591662] transition-colors shrink-0"
                      aria-label="Lihat postingan Instagram"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="w-7 h-7 bg-[#721e7c] rounded-full flex items-center justify-center text-white hover:bg-[#591662] transition-colors shrink-0"
                      aria-label="Baca selengkapnya"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>

            </div>
            </Reveal>
          ))}
        </div>

        {/* Sentinel lazy load tab Sosmed */}
        {activeTab === "sosmed" && displayedItems.length < sosmedTotal && (
          <div ref={loadMoreRef} className="flex justify-center mt-10">
            <button
              onClick={() => setSosmedCount((c) => c + SOSMED_BATCH)}
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#f1e5cd] text-[#721e7c] hover:bg-[#e6d6b8] transition-all shadow-sm"
            >
              Muat lebih banyak ({displayedItems.length}/{sosmedTotal})
            </button>
          </div>
        )}

        {/* Button CTA Instagram (sama seperti page Tentang) */}
        {activeTab === "sosmed" && (
          <Reveal className="flex justify-center mt-10">
            <a
              href="https://www.instagram.com/0mahnalar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#8338ec] hover:bg-[#721e7c] text-white font-bold text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Ikuti Kami di Instagram
            </a>
          </Reveal>
        )}

      </section>
    </div>
  );
}
