"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, BookOpen, Heart, MessageSquare, Shield, ExternalLink, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getPrograms, type Program, type ImageUrl } from "@/services/programs";
import { getGalleries, type Gallery } from "@/services/galleries";
import { transformImageUrl } from "@/lib/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";
import StrukturOrganisasi from "@/components/StrukturOrganisasi";

const PetaMitraJaringan = dynamic(() => import("@/components/PetaMitraJaringan"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-[#1A2332] rounded-2xl animate-pulse flex items-center justify-center text-gray-400 text-xs">
      Memuat...
    </div>
  ),
});

const featuresId = [
  { icon: MessageSquare, title: "Berbagi Cerita", desc: "Curhat anonim di komunitas yang aman dan saling mendukung.", href: "/omah-cerita" },
  { icon: Shield, title: "Buat Laporan", desc: "Aduan kekerasan & pelecehan dengan pendampingan penuh empati.", href: "/tanya-nalar" },
  { icon: BookOpen, title: "Ikut Course", desc: "Edukasi interaktif tentang hubungan sehat dan kesehatan reproduksi.", href: "/omah-belajar" },
  { icon: Heart, title: "Komunitas Peduli", desc: "Bergabung dengan Kawan Nalar yang saling mendukung dan tumbuh bersama.", href: "/omah-cerita" },
];

const featuresEn = [
  { icon: MessageSquare, title: "Share Stories", desc: "Anonymous sharing in a safe and supportive community.", href: "/omah-cerita" },
  { icon: Shield, title: "File Reports", desc: "Report violence & harassment with full empathetic support.", href: "/tanya-nalar" },
  { icon: BookOpen, title: "Take Courses", desc: "Interactive education on healthy relationships and reproductive health.", href: "/omah-belajar" },
  { icon: Heart, title: "Caring Community", desc: "Join Kawan Nalar to support each other and grow together.", href: "/omah-cerita" },
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
  const { locale } = useLanguage();
  const t = locale === "id" ? id.tentang : en.tentang;
  const features = locale === "id" ? featuresId : featuresEn;
  const [programs, setPrograms] = useState<Program[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);

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
            {t.heroTitle}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-sm md:text-base text-brand-100/80 mt-4 max-w-2xl mx-auto leading-relaxed">
            {t.heroDesc}
          </motion.p>
        </div>
      </section>

      {/* ============ SEJARAH ============ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">{t.perjalanan}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-2">{t.sejarah}</h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img src="/images/omah_nalar.JPG" alt="Omah Nalar" className="w-full h-full object-cover" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2"
          >
            <p className="text-brand-700/80 leading-relaxed text-sm md:text-base">
              {locale === "id" ? (
                <>Omah Nalar lahir pada 2023 dari diskusi panjang mengenai pendidikan dan kesehatan reproduksi seksual di Indonesia. Berawal dari keresahan akan kurangnya ruang belajar inklusif, komunitas ini mulai dirumuskan dengan nama 'Omah Nalar' — Omah berarti rumah, Nalar berarti kemampuan berpikir kritis — menjadi rumah untuk belajar bernalar. Pada 2024 program edukasi pertama berjalan, termasuk seminar parenting, workshop anti bullying, dan pelatihan penulisan. Kini di 2025, Omah Nalar terus berkembang dengan lebih banyak program, mitra, dan anggota, berfokus pada pendidikan dan kesehatan reproduksi seksual sebagai pilar utama kontribusi.</>
              ) : (
                <>Omah Nalar was born in 2023 from lengthy discussions about education and reproductive health in Indonesia. Stemming from concerns about the lack of inclusive learning spaces, this community was formulated under the name 'Omah Nalar' — Omah means home, Nalar means the ability to think critically — becoming a home for learning to reason. In 2024 the first educational programs began, including parenting seminars, anti-bullying workshops, and writing training. Now in 2025, Omah Nalar continues to grow with more programs, partners, and members, focusing on education and reproductive health as the main pillars of contribution.</>
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ VISI ============ */}
      <section className="relative overflow-hidden">
        {/* Full-width dark section */}
        <div className="bg-brand-900 py-24 md:py-32 relative">
          {/* Decorative blobs */}
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-secondary-500/8 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-100/8 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-brand-700/10 blur-3xl pointer-events-none" />

          {/* Abstract decorative dots */}
          <div className="absolute top-16 left-8 md:left-16 w-2 h-2 rounded-full bg-secondary-500/30" />
          <div className="absolute top-32 right-12 md:right-24 w-3 h-3 rounded-full bg-secondary-500/20" />
          <div className="absolute bottom-24 left-1/4 w-1.5 h-1.5 rounded-full bg-brand-100/30" />
          <div className="absolute bottom-32 right-16 md:right-32 w-2 h-2 rounded-full bg-brand-100/20" />

          <div className="max-w-4xl mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              {/* Label */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-secondary-500/60" />
                <span className="text-secondary-500 text-[11px] font-bold uppercase tracking-[0.25em]">{t.visi}</span>
                <div className="h-px w-8 bg-secondary-500/60" />
              </div>

              {/* Large opening mark */}
              <div className="text-secondary-500/30 text-7xl md:text-8xl font-serif leading-none mb-2 select-none">
                &rdquo;
              </div>

              {/* Vision text */}
              <p className="text-page-50/95 text-lg md:text-2xl leading-relaxed md:leading-relaxed font-light max-w-3xl mx-auto tracking-wide">
                {locale === "id" ? (
                  <>Omah Nalar memiliki visi menjadi sebuah <span className="text-secondary-500 font-semibold">komunitas yang berkontribusi</span> pada ranah pendidikan dan kesehatan reproduksi seksual.</>
                ) : (
                  <>Omah Nalar has a vision to become a <span className="text-secondary-500 font-semibold">contributing community</span> in the field of education and reproductive health.</>
                )}
              </p>

              {/* Spacer with decorative line */}
              <div className="flex items-center justify-center gap-3 my-6">
                <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-brand-100/20 to-transparent" />
                <div className="w-2 h-2 rotate-45 bg-secondary-500/50" />
                <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-brand-100/20 to-transparent" />
              </div>

              <p className="text-page-50/85 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light">
                {locale === "id" ? (
                  <>Area ini menjadi esensial bagi Omah Nalar. Omah Nalar memandang sudah saatnya{' '}
                    <span className="text-secondary-500 font-medium">bergerak untuk menjadi bagian dari solusi</span>{' '}
                    dalam mengurai urgensi.</>
                ) : (
                  <>This area is essential for Omah Nalar. Omah Nalar believes it is time{' '}
                    <span className="text-secondary-500 font-medium">to move and be part of the solution</span>{' '}
                    in addressing this urgency.</>
                )}
              </p>

              {/* Bottom decorative mark */}
              <div className="text-secondary-500/20 text-5xl md:text-6xl font-serif leading-none mt-4 select-none rotate-180">
                &rdquo;
              </div>

              {/* Decorative line at bottom */}
              <div className="mt-10 flex justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 rounded-full bg-secondary-500/40" />
                  <span className="w-6 h-0.5 rounded-full bg-secondary-500/60" />
                  <span className="w-4 h-0.5 rounded-full bg-secondary-500/40" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Curved transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-page-50 to-transparent pointer-events-none" />
      </section>

      {/* ============ MAKNA LOGO ============ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">{t.maknaLogo}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-2">{t.logoTitle}</h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Floating Logo */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="shrink-0"
          >
            <img src="/images/logo_omah.png" alt="Logo Omah Nalar" className="w-72 md:w-96 h-auto" />
          </motion.div>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 space-y-4 text-center lg:text-left max-w-xl"
          >
            <p className="text-sm md:text-base text-brand-900/80 leading-relaxed">
              {t.logoDesc1}
            </p>
            <p className="text-sm md:text-base text-brand-900/80 leading-relaxed">
              {t.logoDesc2}
            </p>
            <p className="text-sm md:text-base text-brand-900/80 leading-relaxed">
              {t.logoDesc3}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ STRUKTUR ORGANISASI ============ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">{t.tim}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-2">{t.kawanNalar}</h2>
          <p className="text-sm text-brand-700/60 mt-2">{t.anggota}</p>
        </motion.div>
        <StrukturOrganisasi />
      </section>

      {/* ============ FITUR ============ */}
      <section className="bg-brand-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-sm font-semibold text-secondary-500 uppercase tracking-wider">{t.fitur}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-page-50 mt-2">{t.fiturDesc}</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <Link key={idx} href={feat.href}>
                <motion.div
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROGRAM ============ */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">{t.program}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-2">{t.programKami}</h2>
          <p className="text-sm text-brand-700/60 mt-2">{t.programDesc}</p>
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
            <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">{t.jaringan}</span>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-2">{t.mitra}</h2>
            <p className="text-sm text-brand-700/60 mt-2">{t.mitraDesc}</p>
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
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">{t.gallery}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-2">{t.galleryCta}</h2>
          <p className="text-sm text-brand-700/60 mt-2 max-w-lg mx-auto">{t.gallerySub}</p>
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
                  alt="Omah Nalar documentation"
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
            <ExternalLink className="w-4 h-4" /> {t.ikutiInstagram}
          </a>
        </motion.div>
      </section>
    </div>
  );
}
