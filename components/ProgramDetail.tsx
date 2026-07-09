"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, MapPin, Target, Users, Image as ImageIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getProgramBySlug, type Program, type ImageUrl } from "@/services/programs";
import { transformImageUrl } from "@/lib/image";
import { getVideoEmbedUrl } from "@/lib/video";

function getThumbnail(image_url: ImageUrl[]): string | null {
  const thumb = image_url.find((img) => img.is_thumbnail);
  const url = thumb?.url || image_url[0]?.url || null;
  return url ? transformImageUrl(url) : null;
}

export default function ProgramDetail() {
  const router = useRouter();
  const params = useParams();
  const [prog, setProg] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params?.id as string;
    if (!slug) return;
    getProgramBySlug(slug)
      .then(setProg)
      .catch(() => setProg(null))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-page-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!prog) {
    return (
      <div className="min-h-screen bg-page-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-900">Program tidak ditemukan</h2>
          <button onClick={() => router.push("/program")} className="mt-4 px-5 py-2 bg-brand-900 text-white rounded-xl text-sm">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const images = prog.image_url.filter((img) => img.url).map((img) => ({ ...img, url: transformImageUrl(img.url) }));

  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased flex flex-col">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-secondary-500">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 relative z-10">
          <button
            onClick={() => router.push("/program")}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm text-sm font-semibold rounded-xl hover:bg-white/30 transition-all mb-6 text-brand-900"
          >
            <ArrowLeft className="w-4 h-4" /> Semua Program
          </button>

          <span className="inline-block bg-white/80 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider text-brand-900 mt-4">
            {prog.tag}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-4 text-brand-900 tracking-tight max-w-3xl">
            {prog.title}
          </h1>
          <p className="text-sm md:text-base mt-4 max-w-2xl leading-relaxed text-brand-900/80">
            {prog.tagline}
          </p>

          <div className="flex flex-wrap gap-4 mt-6 text-sm font-semibold text-brand-900">
            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Calendar className="w-4 h-4" />
              {prog.period}
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <MapPin className="w-4 h-4" />
              {prog.location}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto w-full p-4 md:p-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-brand-700" />
                <h3 className="text-lg font-bold text-brand-900">Tentang Program</h3>
              </div>
              <div className="space-y-4">
                {prog.descriptions.map((desc, i) => (
                  <p key={i} className="text-sm text-brand-700/80 leading-relaxed">{desc}</p>
                ))}
              </div>
            </div>

            <div className="bg-brand-100/50 border border-brand-100 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-brand-700" />
                <h3 className="text-lg font-bold text-brand-900">Target Peserta</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prog.target.map((t, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/70 rounded-xl p-3.5 border border-white">
                    <div className="w-8 h-8 rounded-full bg-brand-900/10 flex items-center justify-center text-brand-700 font-bold text-sm">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-brand-800">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Goals Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-brand-700" />
                <h3 className="text-base font-bold text-brand-900">Tujuan</h3>
              </div>
              <div className="space-y-3">
                {prog.goals.map((goal, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-brand-700/80 leading-relaxed">{goal}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Videos */}
        {prog.video_url?.filter((v) => v.trim()).length > 0 && (
          <section className="mt-12 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-bold text-brand-900">Video</h3>
            </div>
            <div className="space-y-4">
              {prog.video_url.filter((v) => v.trim()).map((v, idx) => {
                const embedUrl = getVideoEmbedUrl(v);
                if (!embedUrl) return null;
                return (
                  <div key={idx} className="rounded-2xl overflow-hidden bg-gray-100 aspect-video shadow-sm max-w-3xl">
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
          </section>
        )}

        {/* Documentation Section */}
        {images.length > 0 && (
          <section className="mt-12 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-brand-700" />
              <h3 className="text-lg font-bold text-brand-900">Dokumentasi Kegiatan</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl overflow-hidden border border-gray-100 bg-gray-100 ${
                    idx === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${prog.title} ${idx + 1}`}
                    className="w-full h-full object-contain bg-gray-100"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      const parent = (e.currentTarget as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.classList.add("flex", "items-center", "justify-center", "aspect-[4/3]", "bg-gray-100");
                        const fallback = document.createElement("div");
                        fallback.className = "text-gray-300";
                        fallback.innerHTML = '<svg class="w-8 h-8" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
