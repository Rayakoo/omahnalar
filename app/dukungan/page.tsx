"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { GFORM_VOLUNTEER, GFORM_DONASI, GFORM_MITRA } from "@/lib/external";

const SUPPORTS = [
  {
    id: "volunteer",
    title: "Ikut Volunteer",
    desc: "Bergabung sebagai relawan Omah Nalar dan berkontribusi langsung dalam program edukasi, literasi, dan kegiatan komunitas.",
    cta: "Daftar Volunteer",
    href: GFORM_VOLUNTEER,
  },
  {
    id: "donasi",
    title: "Donasi",
    desc: "Dukung keberlanjutan program Omah Nalar melalui donasi buku, dana, atau sumber daya belajar untuk sekolah dan komunitas.",
    cta: "Donasi Sekarang",
    href: GFORM_DONASI,
  },
  {
    id: "gabung-mitra",
    title: "Gabung Mitra",
    desc: "Jalin kerja sama sebagai mitra sekolah, komunitas, atau organisasi untuk memperluas dampak pendidikan bersama Omah Nalar.",
    cta: "Jadi Mitra",
    href: GFORM_MITRA,
  },
];

export default function DukunganPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero */}
      <section className="bg-brand-900 text-white py-20 md:py-28 px-6 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary-500 tracking-tight">
            Dukung Omah Nalar
          </h1>
          <p className="text-sm md:text-base text-brand-100/80 mt-4 max-w-2xl mx-auto leading-relaxed">
            Ada banyak cara untuk ikut bergerak bersama kami — sebagai volunteer,
            donatur, maupun mitra.
          </p>
        </motion.div>
      </section>

      {/* Cards */}
      <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-8">
        {SUPPORTS.map((item, idx) => (
          <Reveal key={item.id} delay={(idx % 3) * 0.08}>
          <div
            id={item.id}
            className="bg-[#f1e5cd] rounded-[2rem] px-8 py-8 md:px-12 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 scroll-mt-24"
          >
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#721e7c]">
                {item.title}
              </h2>
              <p className="text-[#00296b] text-sm md:text-base leading-relaxed mt-2">
                {item.desc}
              </p>
            </div>
            <Link
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#721e7c] hover:opacity-90 text-white font-bold text-sm md:text-base rounded-full shadow-sm transition-all group shrink-0"
            >
              <span>{item.cta}</span>
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#721e7c] transition-transform group-hover:translate-x-0.5 shrink-0">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </div>
            </Link>
          </div>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
