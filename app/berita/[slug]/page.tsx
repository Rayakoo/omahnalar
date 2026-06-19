"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { getBeritaBySlug, type Berita, type ImageUrl } from "@/services/berita";
import { transformImageUrl } from "@/lib/image";
import { getVideoEmbedUrl } from "@/lib/video";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

export default function BeritaDetail() {
  const router = useRouter();
  const params = useParams();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.berita : en.berita;
  const common = locale === "id" ? id.common : en.common;
  const [berita, setBerita] = useState<Berita | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
      day: "numeric", month: "long", year: "numeric",
    });
  }

  useEffect(() => {
    const slug = params?.slug as string;
    if (!slug) return;
    getBeritaBySlug(slug)
      .then(setBerita)
      .catch(() => setBerita(null))
      .finally(() => setLoading(false));
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-page-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="min-h-screen bg-page-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-900">{t.notFound}</h2>
          <button onClick={() => router.push("/berita")} className="mt-4 px-5 py-2 bg-brand-900 text-white rounded-xl text-sm">
            {common.back}
          </button>
        </div>
      </div>
    );
  }

  const images = berita.image_url.filter((img) => img.url);

  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased flex flex-col">
      {/* Back button */}
      <div className="max-w-4xl mx-auto w-full px-4 md:px-6 pt-24 md:pt-28">
        <button
          onClick={() => router.push("/berita")}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all text-brand-900"
        >
          <ArrowLeft className="w-4 h-4" /> {t.backToAll}
        </button>
      </div>

      <article className="max-w-4xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-900 tracking-tight leading-tight">
            {berita.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-brand-700/60">
            {berita.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {berita.author}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {formatDate(berita.published_at || berita.created_at)}
            </span>
          </div>
        </header>

        {/* Thumbnail */}
        {images.length > 0 && (
          <div className="rounded-2xl overflow-hidden bg-gray-100 mb-8 aspect-video">
            <img
              src={transformImageUrl(images[0].url)}
              alt={berita.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                const parent = (e.currentTarget as HTMLImageElement).parentElement;
                if (parent) {
                  parent.classList.add("flex", "items-center", "justify-center", "bg-gray-100");
                }
              }}
            />
          </div>
        )}

        {/* Videos */}
        {berita.video_url?.filter((v) => v.trim()).length > 0 && (
          <div className="mb-8 space-y-4">
            {berita.video_url.filter((v) => v.trim()).map((v, idx) => {
              const embedUrl = getVideoEmbedUrl(v);
              if (!embedUrl) return null;
              return (
                <div key={idx} className="rounded-2xl overflow-hidden bg-gray-100 aspect-video shadow-sm">
                  <iframe
                    src={embedUrl}
                    title={`Video ${idx + 1}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-sm md:prose-base max-w-none text-brand-700/80 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: berita.content }}
        />

        {/* Additional images */}
        {images.length > 1 && (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-brand-900 mb-4">{t.dokumentasi}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.slice(1).map((img, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden bg-gray-100 aspect-video">
                  <img
                    src={transformImageUrl(img.url)}
                    alt={`${berita.title} ${idx + 2}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
