"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";
import Reveal from "@/components/Reveal";

const NILAI_IMAGES = [
  { src: "/nilai/kesetaraan.png", alt: "Kesetaraan" },
  { src: "/nilai/edukatif.png", alt: "Edukatif" },
  { src: "/nilai/pemberdayaan.png", alt: "Pemberdayaan" },
  { src: "/nilai/inovatif.png", alt: "Inovatif" },
];

export default function PilarSection() {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.home : en.home;

  return (
    <section className="bg-white py-20 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-14">
          <span className="text-sm font-semibold text-black uppercase tracking-wider font-sans">
            NILAI
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-primary-purple mt-3 font-sans">
            {t.pilarSub}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {NILAI_IMAGES.map((nilai, idx) => (
            <Reveal
              key={nilai.src}
              delay={idx * 0.1}
              className="rounded-2xl overflow-hidden shadow-sm"
            >
              <img
                src={nilai.src}
                alt={nilai.alt}
                className="w-full h-full object-cover"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
