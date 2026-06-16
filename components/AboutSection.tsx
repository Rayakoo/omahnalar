"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getGalleries, type Gallery } from "@/services/galleries";
import { transformImageUrl } from "@/lib/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

export default function AboutSection() {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.home : en.home;
  const common = locale === "id" ? id.common : en.common;
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getGalleries(15).then(setGalleries).catch(() => {});
  }, []);

  useEffect(() => {
    if (galleries.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % galleries.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [galleries.length]);

  return (
    <section className="bg-page-50 py-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2">
          <div className="relative bg-brand-100 rounded-3xl h-80 overflow-hidden">
            {galleries.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-brand-700/40 text-lg">
                Gambar Omah Nalar
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleries[current].id}
                  src={transformImageUrl(galleries[current].url)}
                  alt="Dokumentasi Omah Nalar"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </AnimatePresence>
            )}

            {/* Dots */}
            {galleries.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {galleries.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === current ? "bg-secondary-500 w-4" : "bg-white/60 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">
            {t.aboutTitle}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-3 mb-5 leading-tight">
            {t.aboutHeading}
          </h2>
          <p className="text-brand-700/80 leading-relaxed mb-6">
            {t.aboutDesc}
          </p>
          <button className="bg-brand-900 text-white font-medium px-6 py-3 rounded-full hover:bg-brand-700 transition-colors flex items-center gap-2 text-sm shadow-sm">
            {t.aboutCta} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
