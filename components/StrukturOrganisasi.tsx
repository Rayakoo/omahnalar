"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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

function MemberCard({
  name,
  role,
  img,
  quote,
}: {
  name: string;
  role: string;
  img: string;
  quote?: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="perspective cursor-pointer"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="relative preserve-3d w-[154px] h-[210px] md:w-[186px] md:h-[255px]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div
          className="absolute inset-0 backface-hidden bg-white border-2 border-brand-100 rounded-2xl flex flex-col overflow-hidden shadow-md"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex-1 bg-gray-100 overflow-hidden">
            <img
              src={img}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="w-full text-center shrink-0">
            <div className="bg-brand-900 text-white text-[9px] md:text-[10px] font-bold py-1.5 px-2 uppercase tracking-wider leading-tight">
              {role}
            </div>
            <div className="bg-brand-100 text-brand-900 text-[9px] md:text-[10px] font-semibold py-1.5 px-2 border-t border-brand-100/50 leading-snug min-h-[2.2rem] md:min-h-[2.5rem] flex items-center justify-center">
              {name}
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 backface-hidden bg-brand-900 text-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <h4 className="font-bold text-xs md:text-sm mb-0.5 leading-snug">{name}</h4>
          <p className="text-secondary-500 text-[9px] md:text-[10px] font-bold uppercase mb-1.5 tracking-wider">{role}</p>
          <div className="w-5 h-0.5 bg-secondary-500 rounded-full mb-1.5" />
          {quote && (
            <p className="text-[10px] md:text-[11px] text-brand-100/80 italic leading-relaxed">&ldquo;{quote}&rdquo;</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function StrukturOrganisasi() {
  return (
    <div className="flex flex-col items-center overflow-x-auto select-none pb-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-brand-900 text-white text-xl md:text-2xl font-extrabold px-8 py-3 rounded-xl shadow-md mb-12 uppercase tracking-wide border-b-4 border-secondary-500 text-center"
      >
        Struktur Kepengurusan Omah Nalar 2025/2026
      </motion.div>

      {/* Desktop */}
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
        <div className="relative w-[334px] h-0.5 bg-gray-300 -mt-1">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full h-full bg-brand-700 origin-center"
          />
        </div>

        {/* Vertical line down */}
        <div className="relative w-0.5 h-10 bg-gray-300">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            className="w-full h-full bg-brand-700 origin-top"
          />
        </div>

        {/* Branch line: spans from center of card 1 to center of card 5 */}
        <div className="relative w-[1000px] px-[100px] h-0.5 bg-gray-300">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="w-full h-full bg-brand-700 origin-center"
          />
        </div>

        {/* Vertical drops: 5-column grid matching member cards */}
        <div className="grid grid-cols-5 w-[1000px] h-8">
          {members.map((_, i) => (
            <div key={i} className="flex justify-center">
              <div className="w-0.5 h-full bg-gray-300 relative">
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1.8 + i * 0.1 }}
                  className="w-full h-full bg-brand-700 origin-top"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Level 2: Members — same grid layout */}
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

      {/* Mobile */}
      <div className="md:hidden w-full max-w-sm mx-auto space-y-6">
        <div className="text-center mb-4">
          <span className="text-[10px] font-bold text-brand-700/60 uppercase tracking-[0.2em]">Pendiri</span>
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
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          className="w-0.5 h-8 bg-brand-300 mx-auto origin-top"
        />
        <div className="text-center mb-2">
          <span className="text-[10px] font-bold text-brand-700/60 uppercase tracking-[0.2em]">Anggota</span>
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
