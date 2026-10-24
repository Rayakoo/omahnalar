"use client";

import Reveal from "@/components/Reveal";

const ALAMAT = "Perum Gurami Indah Tahap 3 Kavling E";
const WILAYAH = "Kota Malang, Jawa Timur, Indonesia";

const MAPS_QUERY = encodeURIComponent(`${ALAMAT}, ${WILAYAH}`);
const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${MAPS_QUERY}&z=16&hl=id&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

export default function LocationSection() {
  return (
    <section className="w-full bg-[#f4f8fb] py-16 px-6 md:px-12 lg:px-20 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* ================= HEADER SECTION ================= */}
        <Reveal className="text-center flex flex-col items-center gap-2">
          <span className="text-[#00296b] font-bold text-sm tracking-widest uppercase">
            LOKASI KAMI
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#721e7c]">
            Temukan Omah Nalar
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">

          {/* ================= CARD ALAMAT ================= */}
          <Reveal className="lg:col-span-5">
            <div className="h-full rounded-[2rem] bg-white border border-[#721e7c]/10 shadow-sm p-7 md:p-9 flex flex-col gap-6">

              {/* Pin + Label */}
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-[#721e7c]/10 flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5 text-[#721e7c]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                <div className="flex flex-col">
                  <span className="text-[#00296b] font-bold text-xs tracking-widest uppercase">
                    Alamat Sekretariat
                  </span>
                  <span className="text-[#721e7c] font-extrabold text-base md:text-lg">
                    Omah Nalar
                  </span>
                </div>
              </div>

              {/* Detail Alamat */}
              <div className="flex flex-col gap-3 text-sm md:text-base leading-relaxed">
                <p className="text-[#00296b] font-semibold">{ALAMAT}</p>
                <p className="text-[#00296b]/80 font-medium">{WILAYAH}</p>
              </div>

              {/* Tombol Google Maps */}
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 bg-[#721e7c] hover:bg-[#591662] text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Buka di Google Maps
              </a>

            </div>
          </Reveal>

          {/* ================= PETA ================= */}
          <Reveal delay={0.15} className="lg:col-span-7">
            <div className="relative w-full h-72 md:h-full min-h-[288px] rounded-[2rem] overflow-hidden border border-[#721e7c]/10 shadow-sm bg-white">
              <iframe
                title="Peta lokasi Omah Nalar"
                src={MAPS_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
