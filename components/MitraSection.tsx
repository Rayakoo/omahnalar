"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";
import Reveal from "@/components/Reveal";

const LOGO_DIR = "/Logo Mitra Omah Nalar";

// Logo mitra yang tersedia di public/Logo Mitra Omah Nalar
const MITRA_LOGOS = [
  { file: "FIK UM.png", name: "FIK UM" },
  { file: "BEM FIK UM.png", name: "BEM FIK UM" },
  { file: "HMD KESMAS UM.png", name: "HMD KESMAS UM" },
  { file: "MI NURUL HUDA 2.png", name: "MI Nurul Huda 2" },
  { file: "MTS DZUNNUROIN.png", name: "MTS Dzunnuroin" },
  { file: "MTS TAUFIQIYAH KAB. MALANG.png", name: "MTS Taufiqiyah Kab. Malang" },
  { file: "SDN MOJOREJO 2.png", name: "SDN Mojorejo 2" },
  { file: "SMPN 2 SINGOSARI.png", name: "SMPN 2 Singosari" },
  { file: "INTRANS PUBLISHING.png", name: "Intrans Publishing" },
  { file: "KOMUNITAS LENTERA NUSANTARA.png", name: "Komunitas Lentera Nusantara" },
  { file: "PUKAPS.png", name: "PUKAPS" },
  { file: "SDGS YOUTH INDONESIA.png", name: "SDGs Youth Indonesia" },
  { file: "YPK BALI.png", name: "YPK Bali" },
];

const logoSrc = (file: string) => encodeURI(`${LOGO_DIR}/${file}`);

function LogoCard({ file, name }: { file: string; name: string }) {
  return (
    <div className="group relative z-0 h-24 w-40 md:h-32 md:w-52 shrink-0 rounded-3xl bg-white border border-[#721e7c]/10 shadow-[0_2px_10px_rgba(114,30,124,0.06)] flex items-center justify-center px-5 py-4 transition-all duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:scale-110 hover:border-[#721e7c]/40 hover:shadow-[0_14px_35px_rgba(114,30,124,0.22)]">
      <img
        src={logoSrc(file)}
        alt={`Logo ${name}`}
        draggable={false}
        className="max-h-full max-w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
      />
    </div>
  );
}

function MarqueeRow({
  logos,
  direction,
}: {
  logos: typeof MITRA_LOGOS;
  direction: "left" | "right";
}) {
  return (
    <div className="mitra-marquee mitra-fade relative w-full overflow-hidden py-3">
      <div
        className={`flex w-max ${
          direction === "right" ? "mitra-track-right" : "mitra-track-left"
        }`}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex items-center gap-6 md:gap-10 pr-6 md:pr-10"
          >
            {logos.map((logo) => (
              <LogoCard key={`${copy}-${logo.file}`} file={logo.file} name={logo.name} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MitraSection() {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.home : en.home;

  const reversedLogos = [...MITRA_LOGOS].reverse();
  const countLabel =
    locale === "id" ? "mitra & kolaborator" : "partners & collaborators";

  return (
    <section className="relative w-full bg-[#f4f8fb] py-16 md:py-20 font-sans overflow-hidden">
      {/* Dekorasi lembut di latar */}
      <div className="pointer-events-none absolute -top-28 -left-24 w-72 h-72 rounded-full bg-[#721e7c]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 w-72 h-72 rounded-full bg-[#f1e5cd]/70 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        <Reveal className="text-center flex flex-col items-center gap-2 mb-10 md:mb-12">
          <span className="inline-flex items-center gap-2 text-[#00296b] font-bold text-xs md:text-sm tracking-[0.18em] uppercase">
            <span className="w-6 h-[2px] rounded-full bg-[#00296b]/30" />
            {t.mitraLabel}
            <span className="w-6 h-[2px] rounded-full bg-[#00296b]/30" />
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#721e7c]">
            {t.mitraTitle}
          </h2>
          <div className="w-14 h-1 rounded-full bg-gradient-to-r from-[#721e7c]/30 via-[#721e7c] to-[#00296b]/30 mt-1" />
          <p className="text-xs md:text-sm text-gray-600 font-normal max-w-2xl mt-2">
            {t.mitraDesc}
          </p>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white border border-[#721e7c]/10 px-4 py-1.5 shadow-sm">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-[#721e7c] opacity-60 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[#721e7c]" />
            </span>
            <span className="text-[11px] md:text-xs font-semibold text-[#721e7c]">
              {MITRA_LOGOS.length} {countLabel}
            </span>
          </div>
        </Reveal>
      </div>

      {/* Logo mitra berjalan: baris atas ke kanan, baris bawah ke kiri */}
      <div className="relative flex flex-col gap-2 md:gap-3">
        <MarqueeRow logos={MITRA_LOGOS} direction="right" />
        <MarqueeRow logos={reversedLogos} direction="left" />
      </div>
    </section>
  );
}
