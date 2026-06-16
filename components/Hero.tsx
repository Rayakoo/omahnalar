"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { getGalleries, type Gallery } from "@/services/galleries";
import { transformImageUrl } from "@/lib/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

export default function Hero() {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.home : en.home;
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getGalleries(15).then(setGalleries).catch(() => {});
  }, []);

  useEffect(() => {
    if (galleries.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % galleries.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [galleries.length]);

  return (
    <header className="bg-brand-900 text-white relative overflow-hidden">
      {/* Background Slider */}
      {galleries.length > 0 && (
        <div className="absolute inset-0">
          {galleries.map((g, idx) => (
            <div
              key={g.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === current ? "opacity-20" : "opacity-0"
              }`}
            >
              <img
                src={transformImageUrl(g.url)}
                alt="Dokumentasi Omah Nalar"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/0 via-brand-900/10 to-brand-900/30" />
        </div>
      )}

      {/* Dots */}
      {galleries.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {galleries.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === current ? "bg-secondary-500 w-4" : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center gap-6 relative z-10">
        <div className="max-w-3xl flex flex-col items-center gap-4">
          <span className="bg-secondary-500 text-brand-900 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
            {t.heroBadge}
          </span>
          <h1 className="text-3xl md:text-5xl font-normal tracking-wide leading-tight text-page-50">
            {t.heroTitle}
          </h1>
          <p className="text-brand-100/80 text-base md:text-lg max-w-xl">
            {t.heroDesc}
          </p>
        </div>
        <div className="flex gap-4 mt-2">
          <button className="bg-secondary-500 text-brand-900 font-semibold px-8 py-3 rounded-full shadow-md hover:bg-secondary-600 transition-colors flex items-center gap-2 text-sm">
            {t.heroCta} <ArrowRight className="w-4 h-4" />
          </button>
          <button className="border border-brand-100/40 text-page-50 font-medium px-8 py-3 rounded-full hover:bg-white/10 transition-colors text-sm">
            {t.heroLearn}
          </button>
        </div>
      </div>
    </header>
  );
}
