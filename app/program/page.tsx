"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { getPrograms, type Program, type ImageUrl } from "@/services/programs";
import { transformImageUrl } from "@/lib/image";

function getThumbnail(image_url: ImageUrl[]): string | null {
  const thumb = image_url.find((img) => img.is_thumbnail);
  const url = thumb?.url || image_url[0]?.url || null;
  return url ? transformImageUrl(url) : null;
}

const THEMES: Record<string, { from: string; to: string; badge: string }> = {
  "seminar-parenting": { from: "from-secondary-500/90", to: "to-secondary-600/70", badge: "bg-secondary-500 text-brand-900" },
  "seminar-guru": { from: "from-brand-100/90", to: "to-brand-700/40", badge: "bg-brand-100 text-brand-900" },
  "workshop-bullying": { from: "from-rose-100/90", to: "to-rose-300/50", badge: "bg-rose-100 text-rose-800" },
  "pelatihan-menulis": { from: "from-emerald-100/90", to: "to-emerald-300/50", badge: "bg-emerald-100 text-emerald-800" },
  "buku-baca": { from: "from-sky-100/90", to: "to-sky-300/50", badge: "bg-sky-100 text-sky-800" },
  "kerjasama-eksternal": { from: "from-purple-100/90", to: "to-purple-300/50", badge: "bg-purple-100 text-purple-800" },
};

function getTheme(slug: string) {
  return THEMES[slug] || { from: "from-brand-100/90", to: "to-brand-700/40", badge: "bg-brand-100 text-brand-900" };
}

export default function ProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrograms()
      .then(setPrograms)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased text-brand-900 flex flex-col">
      {/* Hero */}
      <div className="bg-brand-900 text-white py-14 md:py-20 px-6 mt-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-secondary-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-brand-100/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-brand-700/10 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-block bg-secondary-500 text-brand-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            Our Programs
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-secondary-500">
            Program & Kegiatan
          </h1>
          <p className="text-sm text-brand-100/70 mt-3 max-w-2xl mx-auto leading-relaxed">
            Berbagai kegiatan dan program untuk mendukung pendidikan, perlindungan anak, dan pemberdayaan masyarakat.
          </p>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto w-full px-4 md:px-6 -mt-8 mb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs.map((prog) => {
              const imgUrl = getThumbnail(prog.image_url);
              const theme = getTheme(prog.slug);

              return (
                <Link
                  key={prog.id}
                  href={`/program/${prog.slug}`}
                  className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
                >
                  {/* Top colored section with image */}
                  <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${theme.from} ${theme.to}`}>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={prog.title}
                        className="w-full h-full object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`inline-block ${theme.badge} text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm`}>
                        {prog.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-brand-900 leading-snug group-hover:text-brand-700 transition-colors">
                        {prog.title}
                      </h3>
                      <p className="text-xs text-brand-700/60 mt-2 line-clamp-2 leading-relaxed">
                        {prog.tagline}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-medium text-brand-700/50">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {prog.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {prog.location}
                        </span>
                      </div>
                      <span className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center group-hover:bg-brand-900 group-hover:text-white transition-all">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
