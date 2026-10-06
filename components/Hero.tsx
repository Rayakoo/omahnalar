"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getGalleries, type Gallery } from "@/services/galleries";
import { transformImageUrl } from "@/lib/image";

export default function Hero() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  useEffect(() => {
    getGalleries(15).then(setGalleries).catch(() => {});
  }, []);

  useEffect(() => {
    if (galleries.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % galleries.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [galleries.length]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden shadow-xl font-sans sm:pt-12">
      {/* Background Gallery Slider - Desktop */}
      {galleries.length > 0 && (
        <div
          className="hidden sm:block absolute inset-0 z-0"
          onPointerDown={(e) => {
            setIsDragging(true);
            setDragStartX(e.clientX);
          }}
          onPointerUp={(e) => {
            if (isDragging) {
              setIsDragging(false);
              const deltaX = e.clientX - dragStartX;
              if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                  setCurrent((prev) => (prev - 1 + galleries.length) % galleries.length);
                } else {
                  setCurrent((prev) => (prev + 1) % galleries.length);
                }
              }
            }
          }}
          onPointerLeave={() => setIsDragging(false)}
        >
          {galleries.map((g, idx) => (
            <div
              key={g.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === current ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={transformImageUrl(g.url)}
                alt="Dokumentasi Omah Nalar"
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Navigator Slider - Desktop */}
          <div className="absolute bottom-12 right-32 hidden sm:flex items-center gap-3 z-40">
            {Array(4).fill(0).map((_, idx) => {
              const navIdx = idx;
              const isActive = Math.floor(current / 4) === navIdx;
              return (
                <button
                  key={navIdx}
                  onClick={() => setCurrent(Math.min(navIdx * 4, galleries.length - 1))}
                  className={`h-6 rounded-full transition-all duration-300 ease-in-out ${
                    isActive ? "w-20 bg-[#ffc580] opacity-100" : "w-8 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Slide ${navIdx + 1}`}
                />
              );
            })}
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/0 via-brand-900/10 to-brand-900/30" />
        </div>
      )}

      {/* Foreground Hero Image - hanya ini yang di-rotate saat mobile */}
      <img
        src="/images/foreground_hero.png"
        alt="Background Omah Nalar"
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className="absolute inset-0 z-10 w-full h-full object-cover pointer-events-none origin-center rotate-90 scale-[1.6] sm:rotate-0 sm:scale-100 will-change-transform"
      />

      <div className="relative z-20 flex flex-col justify-start items-start h-full min-h-0 px-4 sm:px-6 md:px-6 lg:px-12 py-0 pt-24 sm:pt-0 pb-10 sm:pb-0 text-white sm:mt-20">
        {/* Badge / Pill Atas */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-fit mb-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border-3 border-[#f6ebd9] text-white text-xs md:text-sm font-medium tracking-wide">
            Ruang belajar & bertumbuh
          </span>
        </motion.div>

        {/* Heading utama */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-5xl font-extrabold leading-tight text-white mb-4 tracking-tight"
        >
          Tempat belajar menyenangkan <br className="hidden sm:inline" />
          & bicara dengan aman
        </motion.h1>

        {/* Garis Pembatas Kecil */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-32 h-1 bg-[#f6ebd9] rounded-full my-4 sm:my-6 origin-left"
        />

        {/* Deskripsi */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-white/90 text-base md:text-lg leading-relaxed mb-6 max-w-lg font-normal my-2"
        >
          Omah Nalar membekali pengetahuan komprehensif, menguatkan critical thinking dan mendorong transformasi perilaku.
        </motion.p>

        {/* Tombol CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <a
            href="#belajar"
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#f6ebd9] hover:bg-[#ede0cb] text-[#2b1736] font-bold text-sm md:text-base rounded-full shadow-md transition-all duration-200 group sm:ml-0 md:ml-36"
          >
            <span>Belajar, yuk!</span>
            <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-0.5">
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </div>
          </a>
        </motion.div>

        {/* Gallery Mobile - dibawah tombol Belajar, yuk! (hanya layar kecil) */}
        {galleries.length > 0 && (
          <div
            className="sm:hidden w-full mt-8"
            onPointerDown={(e) => {
              setIsDragging(true);
              setDragStartX(e.clientX);
            }}
            onPointerUp={(e) => {
              if (isDragging) {
                setIsDragging(false);
                const deltaX = e.clientX - dragStartX;
                if (Math.abs(deltaX) > 50) {
                  if (deltaX > 0) {
                    setCurrent((prev) => (prev - 1 + galleries.length) % galleries.length);
                  } else {
                    setCurrent((prev) => (prev + 1) % galleries.length);
                  }
                }
              }
            }}
            onPointerLeave={() => setIsDragging(false)}
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
              {galleries.map((g, idx) => (
                <div
                  key={g.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === current ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={transformImageUrl(g.url)}
                    alt="Dokumentasi Omah Nalar"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              ))}

              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/30 via-transparent to-transparent pointer-events-none" />

              {/* Navigator Slider Mobile */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 z-40">
                {Array(4)
                  .fill(0)
                  .map((_, idx) => {
                    const isActive = Math.floor(current / 4) === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrent(Math.min(idx * 4, galleries.length - 1))}
                        className={`h-4 rounded-full transition-all duration-300 ease-in-out ${
                          isActive
                            ? "w-10 bg-[#ffc580] opacity-100"
                            : "w-4 bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}