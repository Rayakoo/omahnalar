"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Target, BookOpen, Heart, MessageSquare, Shield, Award, ExternalLink, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getPrograms, type Program, type ImageUrl } from "@/services/programs";
import { getGalleries, type Gallery } from "@/services/galleries";
import { transformImageUrl } from "@/lib/image";

const PetaMitraJaringan = dynamic(() => import("@/components/PetaMitraJaringan"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-[#1A2332] rounded-2xl animate-pulse flex items-center justify-center text-gray-400 text-xs">
      Memuat Peta Jaringan Mitra...
    </div>
  ),
});

const timeline = [
  { year: "2023", title: "Ide dan Perencanaan", desc: "Omah Nalar lahir dari diskusi panjang mengenai pendidikan dan kesehatan reproduksi seksual di Indonesia. Berawal dari keresahan akan kurangnya ruang belajar inklusif, konsep komunitas ini mulai dirumuskan.", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" },
  { year: "2023", title: "Pembentukan Komunitas", desc: "Omah Nalar mulai dibangun sebagai komunitas yang mendorong budaya berpikir kritis dan bernalar. Nama 'Omah Nalar' dipilih — Omah berarti rumah, Nalar berarti kemampuan berpikir kritis — menjadi 'rumah untuk belajar bernalar'.", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800" },
  { year: "2024", title: "Program Perdana", desc: "Program-program edukasi pertama mulai berjalan, termasuk seminar parenting, workshop anti bullying, dan pelatihan penulisan. Kolaborasi dengan sekolah-sekolah mitra dimulai.", img: "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&q=80&w=800" },
  { year: "2025", title: "Pengembangan & Dampak", desc: "Omah Nalar terus berkembang dengan lebih banyak program, mitra, dan anggota. Fokus pada pendidikan dan kesehatan reproduksi seksual sebagai pilar utama kontribusi.", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800" },
];

const founders = [
  { name: "Tri Nurdiyanso, S.Pd", role: "Founder", text: "Pendiri Omah Nalar", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
  { name: "Paramytha M. S. Putri, S.K.M., M.Kes.", role: "Co Founder", text: "Rumah untuk belajar bernalar", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
];

const anggota = [
  { name: "Charelle Amira Jeihan S", role: "Hubungan Masyarakat", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" },
  { name: "Qhairema Abrysa S", role: "Sie PDD", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" },
  { name: "Deastri Yustinas Sari", role: "Sie PDD", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" },
  { name: "Alifia Meida Indrayati", role: "Sie Acara", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" },
  { name: "Randy Gustawan", role: "Sie Acara", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" },
];

const features = [
  { icon: MessageSquare, title: "Berbagi Cerita", desc: "Curhat anonim di komunitas yang aman dan saling mendukung." },
  { icon: Shield, title: "Buat Laporan", desc: "Aduan kekerasan & pelecehan dengan pendampingan penuh empati." },
  { icon: BookOpen, title: "Ikut Course", desc: "Edukasi interaktif tentang hubungan sehat dan kesehatan reproduksi." },
  { icon: Heart, title: "Komunitas Peduli", desc: "Bergabung dengan Kawan Nalar yang saling mendukung dan tumbuh bersama." },
];

function getThumbnail(image_url: ImageUrl[]): string | null {
  const thumb = image_url.find((img) => img.is_thumbnail);
  const url = thumb?.url || image_url[0]?.url || null;
  return url ? transformImageUrl(url) : null;
}

const THEMES: Record<string, string> = {
  "seminar-parenting": "bg-secondary-500",
  "seminar-guru": "bg-brand-100",
  "workshop-bullying": "bg-rose-100",
  "pelatihan-menulis": "bg-emerald-100",
  "buku-baca": "bg-sky-100",
  "kerjasama-eksternal": "bg-purple-100",
};

function getTheme(slug: string): string {
  return THEMES[slug] || "bg-brand-100";
}

export default function TentangPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  useEffect(() => {
    getPrograms().then(setPrograms).catch(() => {});
    getGalleries(15).then(setGalleries).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased text-brand-900 overflow-hidden">
      {/* ============ HERO ============ */}
      <section className="bg-brand-900 text-white py-20 md:py-28 px-6 mt-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-secondary-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-brand-100/10 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-extrabold text-secondary-500 tracking-tight">
            Tentang Omah Nalar
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-sm md:text-base text-brand-100/80 mt-4 max-w-2xl mx-auto leading-relaxed">
            Rumah untuk belajar bernalar — ruang tumbuh bersama bagi siapa saja tanpa memandang usia, latar belakang, maupun profesi.
          </motion.p>
        </div>
      </section>

      {/* ============ SEJARAH (Timeline) ============ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">Perjalanan</span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-2">Sejarah Omah Nalar</h2>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Center line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-brand-100 -translate-x-1/2" />

          {timeline.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative mb-12 md:mb-20 last:mb-0"
              >
                {/* Mobile layout: stacked */}
                <div className="md:hidden bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="relative h-44 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3 bg-brand-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {item.year}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-brand-900">{item.title}</h3>
                    <p className="text-xs text-brand-700/70 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {/* Desktop layout: zig-zag */}
                <div className={`hidden md:flex items-center gap-8 lg:gap-12 ${isLeft ? "" : "flex-row-reverse"}`}>
                  {/* Image side */}
                  <div className="flex-1">
                    <div className={`relative h-52 lg:h-60 rounded-2xl overflow-hidden shadow-md ${isLeft ? "lg:mr-8" : "lg:ml-8"}`}>
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-block bg-brand-900 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                          {item.year}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="relative z-10 shrink-0">
                    <div className="w-12 h-12 rounded-full bg-brand-900 border-4 border-page-50 flex items-center justify-center text-white text-xs font-black shadow-md">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Text side */}
                  <div className="flex-1">
                    <div className={`${isLeft ? "lg:ml-8" : "lg:mr-8"}`}>
                      <span className="text-xs font-extrabold text-secondary-600 uppercase tracking-wider">{item.year}</span>
                      <h3 className="text-lg font-bold text-brand-900 mt-1">{item.title}</h3>
                      <p className="text-sm text-brand-700/70 mt-2 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============ VISI MISI ============ */}
      <section className="bg-white py-20 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-100/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">Arah & Tujuan</span>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-2">Visi & Misi</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl mx-auto">
            {/* VISI */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden"
            >
              {/* Colored header */}
              <div className="relative h-28 bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center overflow-hidden">
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 blur-xl" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5 blur-xl" />
                <div className="relative flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm ring-1 ring-white/20">
                    <Target className="w-7 h-7 text-secondary-500" />
                  </div>
                  <span className="text-white/60 text-[9px] font-bold uppercase tracking-[0.15em]">Tujuan Utama</span>
                </div>
              </div>
              {/* Content */}
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-brand-900 mb-1">Visi</h3>
                <div className="w-8 h-0.5 bg-secondary-500 rounded-full mb-4" />
                <p className="text-sm text-brand-700/80 leading-relaxed">
                  Menjadi ruang belajar bernalar yang inklusif dan berdampak, serta menjadi bagian dari solusi dalam menghadapi berbagai isu sosial, khususnya di bidang pendidikan dan kesehatan reproduksi seksual di Indonesia.
                </p>
              </div>
            </motion.div>

            {/* MISI */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="group relative bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden"
            >
              {/* Colored header */}
              <div className="relative h-28 bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center overflow-hidden">
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 blur-xl" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5 blur-xl" />
                <div className="relative flex flex-col items-center gap-1">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm ring-1 ring-white/20">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-white/60 text-[9px] font-bold uppercase tracking-[0.15em]">Langkah Nyata</span>
                </div>
              </div>
              {/* Content */}
              <div className="p-6 md:p-8">
                <h3 className="text-lg font-bold text-brand-900 mb-1">Misi</h3>
                <div className="w-8 h-0.5 bg-secondary-500 rounded-full mb-4" />
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-brand-700/80">
                    <span className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-700" />
                    </span>
                    Menyediakan ruang diskusi dan edukasi yang aman dan inklusif
                  </li>
                  <li className="flex items-start gap-3 text-sm text-brand-700/80">
                    <span className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-700" />
                    </span>
                    Meningkatkan kesadaran tentang kesehatan reproduksi seksual
                  </li>
                  <li className="flex items-start gap-3 text-sm text-brand-700/80">
                    <span className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-700" />
                    </span>
                    Membangun kolaborasi dengan berbagai mitra dan komunitas
                  </li>
                  <li className="flex items-start gap-3 text-sm text-brand-700/80">
                    <span className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-700" />
                    </span>
                    Memberdayakan individu melalui pendidikan dan pelatihan
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ STRUKTUR TIM ============ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">Tim</span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-2">Kawan Nalar</h2>
          <p className="text-sm text-brand-700/60 mt-2">Anggota komunitas yang memiliki semangat untuk belajar dan bertumbuh bersama</p>
        </motion.div>

        {/* Pendiri */}
        <div className="max-w-3xl mx-auto mb-14">
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold text-secondary-600 uppercase tracking-[0.2em]">Pendiri</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            {founders.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative [perspective:600px] h-64 md:h-72 cursor-pointer group"
                onMouseEnter={() => setFlippedId("f" + idx)}
                onMouseLeave={() => setFlippedId(null)}
                onClick={() => setFlippedId(flippedId === "f" + idx ? null : "f" + idx)}
              >
                <motion.div
                  animate={{ rotateY: flippedId === "f" + idx ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="w-full h-full rounded-2xl"
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-brand-900 to-brand-700 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center border border-brand-100/20 shadow-lg"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-xl md:text-2xl mb-4 ring-2 ring-white/30">
                      {member.name.split(" ")[0][0]}
                    </div>
                    <h4 className="text-sm md:text-base font-bold text-page-50 leading-snug">{member.name}</h4>
                    <span className="inline-block mt-2 bg-secondary-500 text-brand-900 text-[9px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                      {member.role}
                    </span>
                    <p className="text-[10px] text-brand-100/60 mt-2 italic">{member.text}</p>
                    <div className="absolute bottom-4 right-4 text-brand-100/20">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  </div>

                  {/* Back: Photo */}
                  <div
                    className="absolute inset-0 rounded-2xl overflow-hidden border border-brand-100/20 shadow-lg"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white">
                      <h4 className="text-sm md:text-base font-bold leading-snug">{member.name}</h4>
                      <span className="inline-block mt-1.5 bg-secondary-500 text-brand-900 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Anggota Lainnya */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold text-brand-700/50 uppercase tracking-[0.2em]">Anggota Lainnya</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {anggota.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="relative [perspective:600px] h-48 md:h-52 cursor-pointer group"
                onMouseEnter={() => setFlippedId("a" + idx)}
                onMouseLeave={() => setFlippedId(null)}
                onClick={() => setFlippedId(flippedId === "a" + idx ? null : "a" + idx)}
              >
                <motion.div
                  animate={{ rotateY: flippedId === "a" + idx ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="w-full h-full rounded-2xl"
                >
                  {/* Front */}
                  <div className="absolute inset-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center justify-center text-center" style={{ backfaceVisibility: "hidden" }}>
                    <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-base mb-3">
                      {member.name.split(" ")[0][0]}
                    </div>
                    <h4 className="text-[11px] md:text-xs font-bold text-brand-900 leading-snug">{member.name}</h4>
                    <p className="text-[9px] text-brand-700/60 mt-1 font-medium">{member.role}</p>
                  </div>

                  {/* Back: Photo */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <h4 className="text-[11px] font-bold leading-snug">{member.name}</h4>
                      <p className="text-[9px] text-white/70 mt-0.5">{member.role}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FITUR ============ */}
      <section className="bg-brand-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-sm font-semibold text-secondary-500 uppercase tracking-wider">Fitur</span>
            <h2 className="text-2xl md:text-3xl font-bold text-page-50 mt-2">Apa yang Bisa Kamu Lakukan?</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all"
              >
                <feat.icon className="w-8 h-8 text-secondary-500 mb-4" />
                <h3 className="text-base font-bold text-page-50 mb-2">{feat.title}</h3>
                <p className="text-xs text-brand-100/70 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROGRAM ============ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">Program</span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-2">Program Kami</h2>
          <p className="text-sm text-brand-700/60 mt-2">Berbagai kegiatan dan program untuk mendukung pendidikan, perlindungan anak, dan pemberdayaan masyarakat.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {programs.map((prog, idx) => {
            const imgUrl = getThumbnail(prog.image_url);
            const theme = getTheme(prog.slug);
            return (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link
                  href={`/program/${prog.slug}`}
                  className="group block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${theme}/90 ${theme}/40`}>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={prog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block bg-white/90 text-brand-900 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {prog.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-sm font-bold text-brand-900 leading-snug group-hover:text-brand-700 transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-[11px] text-brand-700/60 mt-1.5 line-clamp-2 leading-relaxed">
                      {prog.tagline}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-medium text-brand-700/50">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" /> {prog.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" /> {prog.location}
                        </span>
                      </div>
                      <span className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center group-hover:bg-brand-900 group-hover:text-white transition-all">
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============ MITRA + MAP ============ */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">Jaringan</span>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-2">Mitra & Kolaborasi</h2>
            <p className="text-sm text-brand-700/60 mt-2">Terhubung dengan berbagai mitra di seluruh Indonesia</p>
          </motion.div>

          {/* Peta Jaringan Mitra */}
          <div className="mb-12">
            <PetaMitraJaringan />
          </div>


        </div>
      </section>

      {/* ============ MARI BERGABUNG (Gallery) ============ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">Bersama</span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-2">Mari Bergabung dengan Kita</h2>
          <p className="text-sm text-brand-700/60 mt-2 max-w-lg mx-auto">Jadilah bagian dari Kawan Nalar dan bersama kita ciptakan perubahan positif</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
          {galleries.length === 0 ? (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className={`rounded-2xl bg-gradient-to-br from-brand-100/60 to-brand-700/10 border border-gray-100 flex items-center justify-center text-brand-700/30 ${
                  i === 1 ? "col-span-2 row-span-2 aspect-square" : "aspect-[4/3]"
                }`}>
                  <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ))}
            </>
          ) : (
            galleries.map((g, idx) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-2xl overflow-hidden border border-gray-100 shadow-sm group cursor-pointer ${
                  idx === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-[4/3]"
                }`}
              >
                <img
                  src={transformImageUrl(g.url)}
                  alt="Dokumentasi Omah Nalar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </motion.div>
            ))
          )}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
          <a
            href="https://www.instagram.com/0mahnalar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-700 transition-all active:scale-95 shadow-md"
          >
            <ExternalLink className="w-4 h-4" /> Ikuti Kami di Instagram
          </a>
        </motion.div>
      </section>
    </div>
  );
}
