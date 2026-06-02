"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, AlertCircle, Flame, ChevronLeft, ChevronRight } from "lucide-react";

type Category = "Orang Tua" | "Guru" | "Murid";

interface CourseCardData {
  id: string;
  title: string;
  meta: string;
  progress: number;
  kuis: number;
  img: string;
}

const MOCK_DATA_BY_CATEGORY: Record<Category, {
  tracker: { modul: number; kuis: number; waktu: string; lencana: number };
  streak: { days: { name: string; checked: boolean | "warning" }[]; activeCount: number; maxCount: number };
  terakhirAkses: CourseCardData[];
}> = {
  "Orang Tua": {
    tracker: { modul: 3, kuis: 5, waktu: "3j 20m", lencana: 3 },
    streak: {
      days: [
        { name: "Sen", checked: true }, { name: "Sel", checked: true },
        { name: "Rab", checked: true }, { name: "Kam", checked: true },
        { name: "Jum", checked: "warning" }, { name: "Sab", checked: false }, { name: "Min", checked: false },
      ],
      activeCount: 4, maxCount: 12,
    },
    terakhirAkses: [
      { id: "ot-1", title: "Consent & Hubungan Sehat", meta: "6 modul • Pemula", progress: 35, kuis: 3, img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400" },
      { id: "ot-2", title: "Relasi Sehat & Tanda Bahaya", meta: "5 modul • Pemula", progress: 60, kuis: 4, img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=400" },
    ],
  },
  "Guru": {
    tracker: { modul: 8, kuis: 12, waktu: "7j 45m", lencana: 6 },
    streak: {
      days: [
        { name: "Sen", checked: true }, { name: "Sel", checked: true },
        { name: "Rab", checked: true }, { name: "Kam", checked: true },
        { name: "Jum", checked: true }, { name: "Sab", checked: false }, { name: "Min", checked: false },
      ],
      activeCount: 5, maxCount: 20,
    },
    terakhirAkses: [
      { id: "gr-1", title: "Pedagogi Responsif Gender di Kelas", meta: "8 modul • Menengah", progress: 50, kuis: 5, img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=400" },
    ],
  },
  "Murid": {
    tracker: { modul: 2, kuis: 3, waktu: "1j 10m", lencana: 1 },
    streak: {
      days: [
        { name: "Sen", checked: false }, { name: "Sel", checked: true },
        { name: "Rab", checked: true }, { name: "Kam", checked: false },
        { name: "Jum", checked: false }, { name: "Sab", checked: false }, { name: "Min", checked: false },
      ],
      activeCount: 2, maxCount: 5,
    },
    terakhirAkses: [
      { id: "mr-1", title: "Mengenali & Mencegah Cyberbullying", meta: "4 modul • Pemula", progress: 90, kuis: 2, img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400" },
    ],
  },
};

const SCHOOL_COURSE_TEMPLATES = {
  SD: [
    { title: "Batasan Tubuhku (Sentuhan Baik & Buruk)", meta: "3 modul • Dasar", kuis: 2, img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400" },
    { title: "Mengekspresikan Emosi dengan Sehat", meta: "4 modul • Dasar", kuis: 3, img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=400" },
    { title: "Berteman Tanpa Mengejek", meta: "3 modul • Dasar", kuis: 2, img: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400" },
    { title: "Mengenal Emosi Diri Sendiri", meta: "4 modul • Dasar", kuis: 3, img: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=400" },
    { title: "Hidup Sehat & Bersih", meta: "3 modul • Dasar", kuis: 2, img: "https://images.unsplash.com/photo-1540479859555-17af4d1e5cdc?auto=format&fit=crop&q=80&w=400" },
    { title: "Belajar Berbagi dengan Teman", meta: "3 modul • Dasar", kuis: 2, img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400" },
  ],
  SMP: [
    { title: "Menavigasi Pubertas & Perubahan Diri", meta: "5 modul • Menengah", kuis: 4, img: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=400" },
    { title: "Etika Berkomunikasi di Media Sosial", meta: "4 modul • Menengah", kuis: 3, img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400" },
    { title: "Menolak Tekanan Teman Sebaya (Peer Pressure)", meta: "5 modul • Menengah", kuis: 4, img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400" },
    { title: "Mengelola Stres & Kecemasan", meta: "5 modul • Menengah", kuis: 3, img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=400" },
    { title: "Komunikasi Efektif dengan Orang Tua", meta: "4 modul • Menengah", kuis: 3, img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400" },
    { title: "Pentingnya Consent dalam Pergaulan", meta: "5 modul • Menengah", kuis: 4, img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400" },
  ],
  SMA: [
    { title: "Kesehatan Mental & Manajemen Stres Akademik", meta: "6 modul • Lanjutan", kuis: 5, img: "https://images.unsplash.com/photo-1513258496099-48168024addd?auto=format&fit=crop&q=80&w=400" },
    { title: "Mengenali Hubungan Toksik (Toxic Relationship)", meta: "5 modul • Lanjutan", kuis: 3, img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400" },
    { title: "Persiapan Karir & Pengembangan Karakter", meta: "6 modul • Lanjutan", kuis: 6, img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400" },
    { title: "Kesetaraan Gender & Hak Reproduksi", meta: "6 modul • Lanjutan", kuis: 5, img: "https://images.unsplash.com/photo-1573164574511-73c773253279?auto=format&fit=crop&q=80&w=400" },
    { title: "Pencegahan Kekerasan Berbasis Gender", meta: "5 modul • Lanjutan", kuis: 4, img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=400" },
    { title: "Literasi Digital & Keamanan Online", meta: "6 modul • Lanjutan", kuis: 5, img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400" },
  ],
};

function generateSchoolCourses(level: string, startIdx: number, count: number) {
  const templates = SCHOOL_COURSE_TEMPLATES[level as keyof typeof SCHOOL_COURSE_TEMPLATES];
  return Array.from({ length: count }).map((_, i) => {
    const t = templates[(startIdx + i) % templates.length];
    return { id: `${level}-${startIdx + i}`, ...t };
  });
}

const TABS: Category[] = ["Orang Tua", "Guru", "Murid"];

function getTabStyles(tab: Category) {
  switch (tab) {
    case "Orang Tua":
      return { active: "bg-brand-900 text-white", normal: "bg-brand-100 text-brand-900 hover:bg-brand-100/80" };
    case "Guru":
      return { active: "bg-[#7C78A8] text-white", normal: "bg-[#E6E4F9] text-[#7C78A8] hover:bg-[#E6E4F9]/80" };
    case "Murid":
      return { active: "bg-[#E4B56A] text-brand-900", normal: "bg-[#FDE5C0] text-brand-900 hover:bg-[#FDE5C0]/80" };
  }
}

export default function CoursePage() {
  const [activeTab, setActiveTab] = useState<Category>("Orang Tua");
  const activeData = MOCK_DATA_BY_CATEGORY[activeTab];

  return (
    <div className="min-h-screen bg-page-50 text-brand-900 font-sans pb-20">
      <main className="max-w-6xl mx-auto px-6 mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-3 p-1.5 bg-white rounded-2xl shadow-inner border border-gray-100">
            {TABS.map((tab) => {
              const isSelected = activeTab === tab;
              const styles = getTabStyles(tab);
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    isSelected ? styles.active : styles.normal
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-xl bg-black/5 mix-blend-overlay"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Cari Course..."
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 shadow-sm"
            />
            <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <h2 className="text-base font-bold text-brand-900/80 mb-4">Progress tracker</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="bg-[#F6EBF1] p-4 rounded-2xl shadow-sm flex flex-col items-center text-center">
                <span className="text-2xl font-black text-brand-900">{activeData.tracker.modul}</span>
                <span className="text-[11px] text-brand-700 font-semibold mt-1">Modul Selesai</span>
              </div>
              <div className="bg-[#EBF1F6] p-4 rounded-2xl shadow-sm flex flex-col items-center text-center">
                <span className="text-2xl font-black text-brand-900">{activeData.tracker.kuis}</span>
                <span className="text-[11px] text-brand-700 font-semibold mt-1">Kuis Lulus</span>
              </div>
              <div className="bg-[#F5EFE4] p-4 rounded-2xl shadow-sm flex flex-col items-center text-center">
                <span className="text-2xl font-black text-brand-900">{activeData.tracker.waktu}</span>
                <span className="text-[11px] text-brand-700 font-semibold mt-1">Waktu Belajar</span>
              </div>
              <div className="bg-[#E4F5EF] p-4 rounded-2xl shadow-sm flex flex-col items-center text-center">
                <span className="text-2xl font-black text-brand-900">{activeData.tracker.lencana}</span>
                <span className="text-[11px] text-brand-700 font-semibold mt-1">Lencana Didapat</span>
              </div>
            </div>

            <div className="bg-white/60 border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between gap-8 mb-12 items-center">
              <div>
                <h3 className="text-base font-bold text-brand-900/80 mb-4">Streak belajar</h3>
                <div className="flex items-center gap-3">
                  {activeData.streak.days.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                        day.checked === true ? "bg-brand-100 text-brand-700" :
                        day.checked === "warning" ? "bg-secondary-200 text-secondary-600" : "bg-gray-200 text-gray-400"
                      }`}>
                        {day.checked === true && <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />}
                        {day.checked === "warning" && <AlertCircle className="w-5 h-5 stroke-[2.5]" />}
                        {!day.checked && <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                      </div>
                      <span className="text-[11px] font-bold text-brand-700/60">{day.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-6 border-l-0 md:border-l border-gray-200 pl-0 md:pl-8 w-full md:w-auto justify-center">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-brand-700">
                    <span className="text-secondary-600 font-black text-lg">{activeData.streak.activeCount} hari</span> berturut - turut
                  </p>
                  <p className="text-xs text-brand-700/60 mt-1 max-w-[200px]">Selesaikan satu materi hari ini untuk menjaga streakmu!</p>
                </div>
                <div className="bg-[#FAEDD5] px-5 py-4 rounded-2xl flex flex-col items-center text-center min-w-[110px] shadow-sm relative">
                  <Flame className="w-5 h-5 text-secondary-600 absolute -top-2.5" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-700/60">Terbaik sepanjang waktu</span>
                  <span className="text-2xl font-black text-brand-900 mt-1">{activeData.streak.maxCount}</span>
                </div>
              </div>
            </div>

            <h2 className="text-base font-bold text-brand-900/80 mb-6">Terakhir kamu akses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {activeData.terakhirAkses.map((course) => (
                <Link key={course.id} href={`/omah-belajar/${course.id}`} className="bg-brand-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <img src={course.img} alt={course.title} className="w-full h-40 object-cover" />
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-sm font-bold text-brand-900 leading-snug mb-1">{course.title}</h4>
                      <p className="text-[11px] text-brand-700/60 font-semibold mb-4">{course.meta}</p>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-4 overflow-hidden">
                        <div className="h-full bg-brand-700 rounded-full" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                    <span className="bg-brand-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg w-fit shadow-sm">
                      {course.kuis} kuis
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <SchoolLevelSection level="SD" />
        <SchoolLevelSection level="SMP" />
        <SchoolLevelSection level="SMA" />
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function SchoolLevelSection({ level }: { level: "SD" | "SMP" | "SMA" }) {
  const [index, setIndex] = useState(0);
  const allCourses = generateSchoolCourses(level, 0, 6);
  const maxIndex = allCourses.length - 3;
  const cardWidth = 320;
  const gap = 24;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-brand-900/80">
          Kategori Course: Tingkat {level}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIndex((p) => Math.max(0, p - 1))}
            disabled={index === 0}
            className="p-2.5 rounded-full bg-brand-900 text-white shadow-md hover:bg-brand-700 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIndex((p) => Math.min(maxIndex, p + 1))}
            disabled={index >= maxIndex}
            className="p-2.5 rounded-full bg-brand-900 text-white shadow-md hover:bg-brand-700 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{ transform: `translateX(-${index * (cardWidth + gap)}px)`, gap }}
        >
          {allCourses.map((course) => (
            <Link
              key={course.id}
              href={`/omah-belajar/${course.id}`}
              className="min-w-[280px] md:min-w-[320px] max-w-[320px] bg-brand-100 rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 transition-transform duration-200 flex flex-col shrink-0"
            >
              <img src={course.img} alt={course.title} className="w-full h-36 object-cover" />
              <div className="p-4 flex flex-col justify-between flex-1 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-brand-900 leading-snug mb-1">{course.title}</h4>
                  <p className="text-[11px] text-brand-700/60 font-semibold">{course.meta}</p>
                </div>
                <span className="bg-brand-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg w-fit shadow-sm">
                  {course.kuis} kuis
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
