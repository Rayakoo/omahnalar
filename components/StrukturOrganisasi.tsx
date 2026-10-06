"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const founders = [
  {
    name: "Tri Nurdiyanso, S.Pd",
    role: "Founder",
    quote: "Berdedikasi untuk mengembangkan potensi nalar bersama Omah Nalar 2025/2026.",
    img: "/struktur_organisasi/PAK TRI.png",
  },
  {
    name: "Paramytha M. S. Putri, S.K.M., M.Kes.",
    role: "Co-Founder",
    quote: "Rumah untuk belajar bernalar — ruang tumbuh bersama bagi siapa saja.",
    img: "/struktur_organisasi/BU MAGDA.png",
  },
];

const members = [
  { name: "Charelle Amira Jeihan S", role: "Hubungan Masyarakat", img: "/struktur_organisasi/CHARELLE.png" },
  { name: "Qhairema Abrysa S", role: "Sie PDD", img: "/struktur_organisasi/QHAIREMA.png" },
  { name: "Deastri Yustinas Sari", role: "Sie PDD", img: "/struktur_organisasi/DEA.png" },
  { name: "Alifia Meida Indrayati", role: "Sie Acara", img: "/struktur_organisasi/ALIFIA.png" },
  { name: "Randy Gustawan", role: "Sie Acara", img: "/struktur_organisasi/RANDY.png" },
];

// ================= MEMBER CARD COMPONENT (flip on hover) =================
function MemberCard({
  name,
  role,
  img,
  quote,
}: {
  name: string;
  role: string;
  img?: string;
  quote?: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="perspective cursor-pointer w-[165px] md:w-[175px] h-[212px] md:h-[222px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="relative preserve-3d w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Depan: foto + badge role + nama */}
        <div
          className="absolute inset-0 backface-hidden bg-[#721e7c] border-2 border-[#721e7c] rounded-2xl p-1.5 flex flex-col items-center shadow-md overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Container Gambar */}
          <div className="relative w-full aspect-[4/3.2] rounded-xl overflow-hidden bg-[#cbe3f7] mb-1.5">
            {img ? (
              <Image
                src={img}
                alt={name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#721e7c] text-3xl font-extrabold">
                {name.charAt(0)}
              </div>
            )}
          </div>

          {/* Role Badge (Pill Putih) */}
          <div className="w-full bg-white text-[#721e7c] font-black text-[11px] py-0.5 rounded-full text-center uppercase tracking-wider mb-1 shadow-sm truncate px-2">
            {role}
          </div>

          {/* Nama Anggota */}
          <div className="text-white font-medium text-[10px] md:text-[11px] text-center px-1 truncate max-w-full">
            {name}
          </div>
        </div>

        {/* Belakang: nama + role + quote (muncul saat hover/klik) */}
        <div
          className="absolute inset-0 backface-hidden bg-[#721e7c] border-2 border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h4 className="font-bold text-white text-xs md:text-sm mb-1 leading-snug">{name}</h4>
          <p className="text-[#eab308] text-[9px] md:text-[10px] font-bold uppercase mb-1.5 tracking-wider">{role}</p>
          <div className="w-5 h-0.5 bg-[#eab308] rounded-full mb-1.5" />
          <p className="text-[10px] md:text-[11px] text-white/80 italic leading-relaxed">
            &ldquo;{quote || "Kawan Nalar — saling belajar dan berkolaborasi bersama."}&rdquo;
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ================= MAIN SECTION & STRUKTUR ORGANISASI =================
export default function OrganizationalStructureSection({ t }: { t: any }) {
  return (
    <section id="tim" className="w-full bg-[#fffdfa] py-16 px-6 scroll-mt-24 font-sans">

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 max-w-2xl mx-auto"
      >
        <span className="text-xs font-bold text-[#00296b] uppercase tracking-widest">
          {t?.tim || "TIM"}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#721e7c] mt-1">
          {t?.kawanNalar || "Kawan Omah Nalar"}
        </h2>
        <p className="text-xs md:text-sm text-gray-600 mt-2 font-normal">
          {t?.anggota || "Anggota komunitas yang memberi diri untuk saling belajar dan berkolaborasi"}
        </p>
      </motion.div>

      {/* Komponen Struktur Organisasi */}
      <StrukturOrganisasi />
    </section>
  );
}

export function StrukturOrganisasi() {
  return (
    <div className="flex flex-col items-center overflow-x-auto select-none pb-8 w-full">

      {/* Title Badge / Pill Border Teal & Ungu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white text-[#00296b] text-sm md:text-lg font-black px-8 py-2.5 rounded-full shadow-md mb-14 uppercase tracking-wide border-4 border-[#721e7c] ring-2 ring-[#14b8a6] text-center"
      >
        Struktur Kepengurusan Omah Nalar 2024/2026
      </motion.div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:flex flex-col items-center relative">

        {/* Level 1: Founders */}
        <div className="flex justify-between w-[520px] relative z-10">
          {founders.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              <MemberCard name={f.name} role={f.role} img={f.img} quote={f.quote} />
            </motion.div>
          ))}
        </div>

        {/* Line connecting founders */}
        <div className="relative w-[345px] h-0.5 bg-gray-200 -mt-1">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full h-full bg-[#00296b] origin-center"
          />
        </div>

        {/* Vertical line down */}
        <div className="relative w-0.5 h-10 bg-gray-200">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            className="w-full h-full bg-[#00296b] origin-top"
          />
        </div>

        {/* Branch line: spans across 5 columns */}
        <div className="relative w-[1000px] px-[100px] h-0.5 bg-gray-200">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="w-full h-full bg-[#00296b] origin-center"
          />
        </div>

        {/* Vertical drops: 5-column grid matching member cards */}
        <div className="grid grid-cols-5 w-[1000px] h-8">
          {members.map((_, i) => (
            <div key={i} className="flex justify-center">
              <div className="w-0.5 h-full bg-gray-200 relative">
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.8 + i * 0.1 }}
                  className="w-full h-full bg-[#00296b] origin-top"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Level 2: Members — 5 Grid Layout */}
        <div className="grid grid-cols-5 w-[1000px] mt-1 relative z-10">
          {members.map((m, i) => (
            <motion.div
              key={m.name}
              className="flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2.2 + i * 0.12 }}
            >
              <MemberCard name={m.name} role={m.role} img={m.img} />
            </motion.div>
          ))}
        </div>

      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden w-full max-w-sm mx-auto space-y-6">
        <div className="text-center mb-2">
          <span className="text-[10px] font-bold text-[#00296b] uppercase tracking-[0.2em]">
            Pendiri
          </span>
        </div>
        <div className="flex justify-center gap-4">
          {founders.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <MemberCard name={f.name} role={f.role} img={f.img} quote={f.quote} />
            </motion.div>
          ))}
        </div>

        {/* Vertical line connecting mobile levels */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          className="w-0.5 h-8 bg-[#00296b] mx-auto origin-top"
        />

        <div className="text-center mb-2">
          <span className="text-[10px] font-bold text-[#00296b] uppercase tracking-[0.2em]">
            Anggota
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {members.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <MemberCard name={m.name} role={m.role} img={m.img} />
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
