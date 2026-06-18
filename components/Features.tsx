"use client";

import { MessageSquare, AlertTriangle, BookOpen, Award } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

const COLORS = [
  { bg: "bg-[#DBEAFE]", icon: "text-[#3B82F6]", title: "text-[#2563EB]" },
  { bg: "bg-[#FDE8E8]", icon: "text-[#EF4444]", title: "text-[#DC2626]" },
  { bg: "bg-[#FEF3C7]", icon: "text-[#F59E0B]", title: "text-[#D97706]" },
  { bg: "bg-[#D1FAE5]", icon: "text-[#10B981]", title: "text-[#059669]" },
];

const FEATURES_ID = [
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Berbagi Cerita",
    desc: "Curhat anonim di komunitas. Temukan ruang aman untuk menuangkan isi hati dan terhubung dengan mereka yang peduli.",
    colorIdx: 0,
    img: "/images/berbagi_cerita.png",
    href: "/omah-cerita",
  },
  {
    icon: <AlertTriangle className="w-8 h-8" />,
    title: "Buat Laporan",
    desc: "Aduan kekerasan & pelecehan. Kami dampingi proses pelaporanmu dengan aman, rahasia, dan penuh empati.",
    colorIdx: 1,
    img: "/images/buat_laporan.png",
    href: "/tanya-nalar",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Ikut Course",
    desc: "Edukasi + kuis interaktif. Perkuat pemahamanmu tentang hubungan sehat, consent, dan kekerasan berbasis gender.",
    colorIdx: 2,
    img: "/images/ikut_course.png",
    href: "/omah-belajar",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Main Games",
    desc: "Belajar sambil bermain. Asah wawasanmu lewat permainan seru yang mendidik dan memberdayakan.",
    colorIdx: 3,
    img: "/images/main_games.png",
    href: "/minigames",
  },
];

const FEATURES_EN = [
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Share Story",
    desc: "Anonymous venting in the community. Find a safe space to express your feelings and connect with those who care.",
    colorIdx: 0,
    img: "/images/berbagi_cerita.png",
    href: "/omah-cerita",
  },
  {
    icon: <AlertTriangle className="w-8 h-8" />,
    title: "Make Report",
    desc: "Violence & abuse reporting. We support your reporting process safely, confidentially, and with empathy.",
    colorIdx: 1,
    img: "/images/buat_laporan.png",
    href: "/tanya-nalar",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Take Course",
    desc: "Interactive education + quizzes. Strengthen your understanding of healthy relationships, consent, and gender-based violence.",
    colorIdx: 2,
    img: "/images/ikut_course.png",
    href: "/omah-belajar",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Play Games",
    desc: "Learn while playing. Sharpen your knowledge through fun and educational games.",
    colorIdx: 3,
    img: "/images/main_games.png",
    href: "/minigames",
  },
];

export default function Features() {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.home : en.home;
  const features = locale === "id" ? FEATURES_ID : FEATURES_EN;

  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">
            {t.featuresTitle}
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-brand-900 mt-3">
            {t.featuresSub}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => {
          const c = COLORS[feat.colorIdx];
          return (
            <Link
              key={idx}
              href={feat.href}
              className="group flex flex-col rounded-2xl overflow-hidden border border-brand-100 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="h-28 bg-cover bg-center relative" style={{ backgroundImage: `url(${feat.img})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent" />
              </div>
              <div className="p-4 pt-3 flex flex-col items-start">
                <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-2`}>
                  <span className={c.icon}>{feat.icon}</span>
                </div>
                <h3 className={`text-lg font-bold ${c.title} mb-1`}>{feat.title}</h3>
                <p className="text-sm text-brand-700/80 leading-relaxed">{feat.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
      </div>
    </section>
  );
}
