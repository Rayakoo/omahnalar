"use client";

import Reveal from "@/components/Reveal";

const STAT_IMAGES = [
  { src: "/stat/stat_mitra.png", alt: "Jumlah Mitra" },
  { src: "/stat/stat_kawan.png", alt: "Kawan Nalar" },
  { src: "/stat/stat_program.png", alt: "Program" },
  { src: "/stat/stat_siswa.png", alt: "Siswa" },
];

export default function StatsSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-1">
        {STAT_IMAGES.map((stat, idx) => (
          <Reveal key={stat.src} delay={idx * 0.1}>
            <img
              src={stat.src}
              alt={stat.alt}
              className="w-full h-auto rounded-3xl"
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
