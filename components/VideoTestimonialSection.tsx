"use client";

import { useCallback, useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import {
  VIDEO_TESTIMONIALS,
  getDrivePreviewUrl,
  getDriveThumbnailUrl,
  getDriveViewUrl,
  type VideoTestimonial,
} from "@/data/videoTestimonials";

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72c0 .86.94 1.39 1.68.94l10.12-6.86a1.1 1.1 0 000-1.88L9.68 4.2A1.1 1.1 0 008 5.14z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 3h7v7M21 3l-9 9" />
      <path d="M19 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h5" />
    </svg>
  );
}

export default function VideoTestimonialSection() {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);

  const closeVideo = useCallback(() => setActiveVideo(null), []);

  useEffect(() => {
    if (!activeVideo) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeVideo();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideo, closeVideo]);

  return (
    <section
      id="testimoni-ahli"
      className="w-full bg-[#f8f3e9] py-16 px-6 md:px-12 lg:px-20 font-sans"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* ================= HEADER SECTION ================= */}
        <Reveal className="text-center flex flex-col items-center gap-2">
          <span className="text-[#00296b] font-bold text-sm tracking-widest uppercase">
            Testimoni Ahli
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-[#721e7c]">
            Testimoni Omah Nalar oleh Ahli
          </h2>
          <p className="max-w-2xl text-sm md:text-base text-[#00296b]/80 leading-relaxed">
            Dengarkan pengalaman para ahli tentang Omah Nalar. Pilih video untuk
            memutarnya langsung dari Google Drive.
          </p>
        </Reveal>

        {/* ================= GRID VIDEO ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {VIDEO_TESTIMONIALS.map((video, index) => (
            <Reveal key={video.id} delay={index * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl">
                <button
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  className="relative block aspect-video w-full overflow-hidden bg-[#00296b]"
                  aria-label={`Putar video ${video.title}`}
                >
                  <img
                    src={getDriveThumbnailUrl(video.id)}
                    alt={`Cuplikan video ${video.title}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#00296b]/60 via-transparent to-transparent" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-white/90 text-[#721e7c] shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <PlayIcon className="ml-1 h-6 w-6 md:h-7 md:w-7" />
                    </span>
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Video
                  </span>
                </button>

                <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
                  <h3 className="text-base md:text-lg font-bold text-[#00296b]">
                    {video.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#00296b]/60">
                    {video.fileName}
                  </p>

                  <p className="mt-auto pt-3 text-[11px] md:text-xs font-medium text-[#00296b]/60">
                    {video.modified}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ================= MODAL PLAYER ================= */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Video ${activeVideo.title}`}
          onClick={closeVideo}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-4 text-white">
              <div>
                <h3 className="text-base md:text-xl font-bold">{activeVideo.title}</h3>
                <p className="mt-1 text-[11px] md:text-sm text-white/70">
                  {activeVideo.fileName} · {activeVideo.modified}
                </p>
              </div>
              <button
                type="button"
                onClick={closeVideo}
                aria-label="Tutup video"
                className="shrink-0 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
              <iframe
                src={getDrivePreviewUrl(activeVideo.id)}
                title={`Video ${activeVideo.title}`}
                className="h-full w-full"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="mt-3 flex justify-end">
              <a
                href={getDriveViewUrl(activeVideo.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-white/80 transition-colors hover:text-white"
              >
                Buka di Google Drive
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
