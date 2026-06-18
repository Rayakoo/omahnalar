"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

export default function TestimonialSection() {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.home : en.home;

  return (
    <section className="bg-brand-900 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-500 uppercase tracking-wider">
            {t.testimonialsTitle}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-page-50 mt-3">
            {t.testimonialsSub}
          </h2>
        </div>

        <div className="mx-auto max-w-4xl flex flex-col lg:flex-row items-stretch gap-8">
          {/* Video */}
          <div className="flex-1">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
              <iframe
                src="https://drive.google.com/file/d/1GX3Tl4uSqmqO_gJ2_74d51wnLhyZ7Rod/preview"
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>

          {/* Card Teks */}
          <div className="flex-1 bg-white rounded-3xl p-6 md:p-8 border border-brand-100/20 shadow-lg flex flex-col justify-center">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-secondary-500/60 mb-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
            </svg>
            <p className="text-brand-900/80 leading-relaxed text-sm md:text-base">
              &ldquo;Kami sangat terbantu dengan kehadiran Omah Nalar. Sekolah kami memiliki banyak kekurangan, terutama dalam hal ketersediaan buku untuk mendukung program literasi dan numerasi siswa. Pojok baca di kelas-kelas juga masih minim, dan Omah Nalar telah memberikan kontribusi yang sangat berarti dalam menutupi kekurangan tersebut. Kami berharap kerja sama ini dapat terus berlanjut dan menjadi lebih baik lagi di masa mendatang, serta terus membantu meningkatkan kualitas pendidikan di sekolah kami, khususnya dalam penyediaan sumber daya belajar.&rdquo;
            </p>
            <p className="text-brand-900 font-bold text-sm mt-4">&mdash; Perwakilan Guru MI Nurul Huda 02</p>
          </div>
        </div>
      </div>
    </section>
  );
}
