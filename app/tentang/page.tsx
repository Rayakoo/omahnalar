"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getGalleries, type Gallery } from "@/services/galleries";
import { getBeholdPosts, type BeholdPost } from "@/services/behold";
import { transformImageUrl } from "@/lib/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";
import OrganizationalStructureSection from "@/components/StrukturOrganisasi";

const PetaMitraJaringan = dynamic(() => import("@/components/PetaMitraJaringan"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-[#1A2332] rounded-2xl animate-pulse flex items-center justify-center text-gray-400 text-xs">
      Memuat...
    </div>
  ),
});

const fiturCards = [
  {
    id: 1,
    titleId: "Berbagi Cerita",
    descId: "Curhat anonim di komunitas yang aman dan saling mendukung.",
    titleEn: "Share Stories",
    descEn: "Anonymous sharing in a safe and supportive community.",
    iconSrc: "/images/fitur1.png",
    bgColor: "bg-[#c39fe0]",
    href: "/omah-cerita",
  },
  {
    id: 2,
    titleId: "Buat Laporan",
    descId: "Aduan kekerasan & pelecehan dengan pendampingan penuh empati.",
    titleEn: "File Reports",
    descEn: "Report violence & harassment with full empathetic support.",
    iconSrc: "/images/fitur2.png",
    bgColor: "bg-[#ad82b6]",
    href: "/tanya-nalar",
  },
  {
    id: 3,
    titleId: "Ikut Course",
    descId: "Edukasi interaktif tentang hubungan sehat dan kesehatan reproduksi.",
    titleEn: "Take Courses",
    descEn: "Interactive education on healthy relationships and reproductive health.",
    iconSrc: "/images/fitur3.png",
    bgColor: "bg-[#f8f3e6]",
    href: "/omah-belajar",
  },
  {
    id: 4,
    titleId: "Komunitas Peduli",
    descId: "Bergabung dengan Kawan Nalar yang saling mendukung dan tumbuh bersama.",
    titleEn: "Caring Community",
    descEn: "Join Kawan Nalar to support each other and grow together.",
    iconSrc: "/images/fitur4.png",
    bgColor: "bg-[#fde283]",
    href: "/omah-cerita",
  },
];

export default function TentangPage() {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.tentang : en.tentang;
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [igPosts, setIgPosts] = useState<BeholdPost[]>([]);

  useEffect(() => {
    getGalleries(15).then(setGalleries).catch(() => {});
    getBeholdPosts(6).then(setIgPosts).catch(() => {});
  }, []);

  // Konten Instagram: utama dari Behold, fallback ke galeri database
  const feedPosts: BeholdPost[] =
    igPosts.length > 0
      ? igPosts
      : galleries.slice(0, 6).map((g) => ({
          id: g.id,
          imageUrl: transformImageUrl(g.url),
          postUrl: "https://www.instagram.com/0mahnalar",
          alt: "Dokumentasi Omah Nalar",
        }));

  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased text-brand-900 overflow-hidden">
      {/* ============ HERO / HEADER SECTION ============ */}
      <section className="relative w-full mt-16 py-16 px-6 md:px-12 text-center text-white overflow-hidden bg-gradient-to-r from-[#591662] via-[#721e7c] to-[#00296b]">
        {/* Background Title Image — ganti file /images/header-bg-about.png dengan gambarmu */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/header-bg-about.png"
            alt="Header Background"
            fill
            className="object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-3">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
          >
            {t.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/90 text-sm md:text-base font-normal max-w-2xl"
          >
            {t.heroDesc}
          </motion.p>
          <div className="w-16 h-1 bg-[#f1e5cd] rounded-full mt-2" />
        </div>
      </section>

      {/* ============ SEJARAH ============ */}
      <section id="siapa-kami" className="w-full bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20">
          {/* Header Sejarah */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center flex flex-col items-center gap-2 mb-12"
          >
            <span className="text-[#00296b] font-bold text-sm tracking-widest uppercase">
              {t.perjalanan}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#721e7c]">
              {t.sejarah}
            </h2>
          </motion.div>

          {/* Grid 2 Kolom (Gambar & Teks) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Gambar Kiri dengan Border Frame Ungu */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-4 border-[#721e7c] shadow-lg">
                <Image
                  src="/images/omah_nalar.JPG"
                  alt="Foto Sejarah Omah Nalar"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Teks Deskripsi Sejarah Kanan */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 flex flex-col gap-3.5 text-[#00296b] text-xs md:text-sm leading-relaxed text-justify font-normal"
            >
              {locale === "id" ? (
                <>
                  <p>
                    Omah Nalar lahir di tahun 2023. Nalar adalah buah dari sebuah
                    diskusi panjang mengenai krusialnya dunia pendidikan dan kesehatan
                    reproduksi seksual di Indonesia.
                  </p>

                  <p>
                    Kemudian semakin berlanjut dan menguat karena munculnya keresahan
                    akan kurangnya ruang belajar inklusif dan interaktif sesuai jenjang
                    pendidikan.
                  </p>

                  <p>
                    Komunitas ini mulai dirumuskan dengan nama{" "}
                    <strong className="font-bold">&apos;Omah Nalar&apos;</strong>. Omah
                    berarti rumah, sedangkan Nalar berarti kemampuan berpikir kritis.
                    Omah Nalar diasumsikan dan diharapkan mampu menjadi rumah untuk
                    belajar bernalar dan membekali diri.
                  </p>

                  <p>
                    Pada tahun 2024, program edukasi pertama kali mulai berjalan,
                    antara lain: seminar parenting, workshop{" "}
                    <em className="italic">anti bullying</em> hingga pelatihan
                    penulisan. Kami memandang sasaran bukanlah objek belaka, namun juga
                    subjek dalam setiap perubahan. Keterlibatan mereka adalah kunci
                    dari keberhasilan dalam pemberdayaan.
                  </p>

                  <p>
                    Tahun berikutnya hingga saat ini, Omah Nalar terus berkembang
                    dengan lebih banyak program, mitra, dan anggota. Kami berfokus
                    pada bidang pendidikan dan bidang kesehatan reproduksi seksual
                    sebagai fokus utama.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Omah Nalar was born in 2023, out of a long discussion about the
                    crucial state of education and sexual reproductive health in
                    Indonesia.
                  </p>

                  <p>
                    It grew stronger with the concern over the lack of inclusive and
                    interactive learning spaces tailored to each education level.
                  </p>

                  <p>
                    This community was then formulated under the name{" "}
                    <strong className="font-bold">&apos;Omah Nalar&apos;</strong>. Omah
                    means home, while Nalar means the ability to think critically.
                    Omah Nalar is envisioned to be a home for learning to reason and
                    equipping oneself.
                  </p>

                  <p>
                    In 2024, the first educational programs started running, including:
                    parenting seminars, <em className="italic">anti-bullying</em> workshops,
                    and writing training. We see our audience not merely as objects, but
                    as subjects of every change. Their involvement is the key to
                    successful empowerment.
                  </p>

                  <p>
                    From the following year until now, Omah Nalar keeps growing with
                    more programs, partners, and members. We focus on education and
                    sexual reproductive health as our main pillars.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ VISI ============ */}
      <section className="relative w-full py-16 md:py-24 px-4 md:px-8 flex items-center justify-center overflow-hidden bg-slate-100">
        {/* Background Image (low opacity) — memakai gambar yang sama dengan Sejarah */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/omah_nalar.JPG"
            alt="Section Background"
            fill
            className="object-cover opacity-15"
          />
        </div>

        {/* Main Vision Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl w-full rounded-[2.5rem] bg-gradient-to-br from-[#672f9a] to-[#9b8be2] p-8 md:p-14 text-center text-white shadow-xl"
        >
          {/* 4 Corner Decorative Dots */}
          <span className="absolute top-6 left-6 w-3.5 h-3.5 rounded-full bg-white/40" />
          <span className="absolute top-6 right-6 w-3.5 h-3.5 rounded-full bg-white/40" />
          <span className="absolute bottom-6 left-6 w-3.5 h-3.5 rounded-full bg-white/40" />
          <span className="absolute bottom-6 right-6 w-3.5 h-3.5 rounded-full bg-white/40" />

          {/* Header Badge: VISI */}
          <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-widest text-[#eab308] uppercase mb-3">
            <span className="w-8 h-[1px] bg-[#eab308]/60" />
            <span>{t.visi}</span>
            <span className="w-8 h-[1px] bg-[#eab308]/60" />
          </div>

          {/* Top Quote Icon */}
          <div className="text-[#eab308] text-4xl font-serif leading-none my-2 select-none">
            &#8221;
          </div>

          {/* Main Vision Statement */}
          <h3 className="text-base md:text-xl lg:text-2xl font-normal leading-relaxed text-white/95 max-w-2xl mx-auto mb-6">
            {locale === "id" ? (
              <>
                Omah Nalar memiliki visi menjadi sebuah{" "}
                <span className="font-bold text-[#eab308]">
                  komunitas yang berkontribusi
                </span>{" "}
                pada ranah pendidikan dan kesehatan reproduksi seksual.
              </>
            ) : (
              <>
                Omah Nalar has a vision to become a{" "}
                <span className="font-bold text-[#eab308]">
                  contributing community
                </span>{" "}
                in the field of education and reproductive health.
              </>
            )}
          </h3>

          {/* Center Divider with Accent Dot */}
          <div className="relative flex items-center justify-center my-6 max-w-xs mx-auto">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#eab308]/60 to-transparent" />
            <span className="absolute w-2 h-2 rounded-full bg-[#eab308]" />
          </div>

          {/* Secondary Statement */}
          <p className="text-xs md:text-sm font-normal text-white/90 leading-relaxed max-w-2xl mx-auto mb-2">
            {locale === "id" ? (
              <>
                Area ini menjadi esensial bagi Omah Nalar. Omah Nalar memandang sudah saatnya{" "}
                <span className="font-bold text-[#eab308]">
                  bergerak untuk menjadi bagian dari solusi
                </span>{" "}
                dalam mengurai urgensi.
              </>
            ) : (
              <>
                This area is essential for Omah Nalar. Omah Nalar believes it is time{" "}
                <span className="font-bold text-[#eab308]">
                  to move and be part of the solution
                </span>{" "}
                in addressing this urgency.
              </>
            )}
          </p>

          {/* Bottom Quote Icon */}
          <div className="text-[#eab308] text-4xl font-serif leading-none mt-2 select-none">
            &#8211; &#8211;
          </div>
        </motion.div>
      </section>

      {/* ============ MAKNA LOGO ============ */}
      <section className="w-full bg-white py-16 md:py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-10 md:gap-14">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center flex flex-col items-center gap-2"
          >
            <span className="text-[#00296b] font-bold text-xs md:text-sm tracking-widest uppercase">
              {t.maknaLogo}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#721e7c] tracking-tight">
              {t.logoTitle}
            </h2>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            {/* Gambar Logo (Kiri) — diperbesar + floating */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 flex justify-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.06, rotate: 1 }}
                className="relative w-full max-w-md aspect-square cursor-pointer"
              >
                <Image
                  src="/images/logo_omah.png"
                  alt="Logo Omah Nalar"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Deskripsi Makna Logo (Kanan) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 flex flex-col gap-5 text-[#8338ec] text-sm md:text-base leading-relaxed font-normal"
            >
              <p>{t.logoDesc1}</p>
              <p>{t.logoDesc2}</p>
              <p>{t.logoDesc3}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ STRUKTUR ORGANISASI ============ */}
      <OrganizationalStructureSection t={t} />

      {/* ============ FITUR ============ */}
      <section className="w-full bg-white py-16 md:py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-10 md:gap-14">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center flex flex-col items-center gap-2"
          >
            <span className="text-[#00296b] font-bold text-xs md:text-sm tracking-widest uppercase">
              {t.fitur}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#721e7c] tracking-tight">
              {locale === "id" ? "Jelajahi layanan Omah Nalar" : "Explore Omah Nalar Services"}
            </h2>
          </motion.div>

          {/* 4 Gambar Fitur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {fiturCards.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="block transition-all duration-300 hover:-translate-y-2 hover:shadow-lg rounded-[2rem] overflow-hidden group"
                >
                  <Image
                    src={item.iconSrc}
                    alt={locale === "id" ? item.titleId : item.titleEn}
                    width={856}
                    height={690}
                    className="w-full h-auto transition-transform group-hover:scale-[1.02]"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MITRA + MAP ============ */}
      <PetaMitraJaringan />

      {/* ============ MARI BERGABUNG (Instagram Feed) ============ */}
      <section className="w-full bg-white py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center flex flex-col items-center gap-2"
          >
            <span className="text-[#00296b] font-bold text-xs md:text-sm tracking-widest uppercase">
              {t.gallery}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#721e7c] tracking-tight">
              {t.galleryCta}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 font-normal mt-1">
              {t.gallerySub}
            </p>
          </motion.div>

          {/* Grid Postingan (3 Kolom) — konten dari feed Instagram Behold */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {feedPosts.length === 0 ? (
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 border border-gray-100 animate-pulse"
                  >
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ))}
              </>
            ) : (
              feedPosts.map((post, idx) => (
                <motion.a
                  key={post.id}
                  href={post.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {/* Overlay Hover Icon Instagram */}
                  <div className="absolute inset-0 bg-[#721e7c]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white drop-shadow-md"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </motion.a>
              ))
            )}
          </div>

          {/* Button CTA Instagram */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="https://www.instagram.com/0mahnalar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#8338ec] hover:bg-[#721e7c] text-white font-bold text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              {t.ikutiInstagram}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
