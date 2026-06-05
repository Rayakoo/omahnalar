"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { getBerita, type Berita, type ImageUrl } from "@/services/berita";

function getThumbnail(image_url: ImageUrl[]): string | null {
  const thumb = image_url.find((img) => img.is_thumbnail);
  return thumb?.url || image_url[0]?.url || null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function BeritaPage() {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBerita()
      .then(setBerita)
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
            Berita
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-secondary-500">
            Berita & Artikel
          </h1>
          <p className="text-sm text-brand-100/70 mt-3 max-w-2xl mx-auto leading-relaxed">
            Informasi dan artikel terbaru seputar kegiatan dan program Omah Nalar.
          </p>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto w-full px-4 md:px-6 -mt-8 mb-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : berita.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm mt-12">
            <p className="text-brand-700/60">Belum ada berita.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {berita.map((b) => {
              const imgUrl = getThumbnail(b.image_url);

              return (
                <Link
                  key={b.id}
                  href={`/berita/${b.slug}`}
                  className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : null}
                    {!imgUrl && (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-12 h-12" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-brand-900 leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
                        {b.title}
                      </h3>
                      {b.excerpt && (
                        <p className="text-xs text-brand-700/60 mt-2 line-clamp-2 leading-relaxed">
                          {b.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-medium text-brand-700/50">
                        {b.author && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {b.author}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(b.published_at || b.created_at)}
                        </span>
                      </div>
                      <span className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center group-hover:bg-brand-900 group-hover:text-white transition-all shrink-0">
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
