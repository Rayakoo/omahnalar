"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Play, FileText, HelpCircle, CheckCircle2, Clock, BookOpen, BarChart } from "lucide-react";

type ContentType = "video" | "materi" | "quiz";

interface SingleMateri {
  id: string;
  title: string;
  durationOrPages: string;
  type: ContentType;
  videoUrl?: string;
  textContent?: string;
  quizRoute?: string;
}

interface BabSection {
  title: string;
  items: SingleMateri[];
}

const PLAYLIST_DATA: BabSection[] = [
  {
    title: "Bab 1: Komunikasi dalam Hubungan Sehat",
    items: [
      { id: "m-1", title: "Konsep Dasar Hubungan Sehat", durationOrPages: "09:00", type: "video", videoUrl: "dQw4w9WgXcQ" },
      { id: "m-2", title: "Mengelola Konflik & Hubungan Emosional", durationOrPages: "15:30", type: "materi", textContent: "Hubungan Sehat adalah interaksi yang saling mendukung dan menghargai antara dua individu. Dalam hubungan ini, komunikasi terbuka dan jujur menjadi kunci, di mana kedua belah pihak merasa nyaman untuk berbagi perasaan dan pikiran. Kepercayaan, rasa hormat, dan dukungan emosional adalah fondasi utama yang membuat hubungan ini kuat dan bertahan lama." },
      { id: "m-3", title: "Membangun Kepercayaan dalam Hubungan", durationOrPages: "11:45", type: "video", videoUrl: "yKNxeF4KMsY" },
      { id: "m-4", title: "Evaluasi Pemahaman Bab 1", durationOrPages: "10 Soal", type: "quiz", quizRoute: "/omah-belajar/ot-1/kuis-bab-1" },
    ]
  },
  {
    title: "Bab 2: Dinamika Hubungan dan Komitmen",
    items: [
      { id: "m-5", title: "Komunikasi Efektif dalam Hubungan", durationOrPages: "20:30", type: "video", videoUrl: "dQw4w9WgXcQ" },
      { id: "m-6", title: "Hubungan Sehat dalam Berbagai Konteks", durationOrPages: "21:00", type: "materi", textContent: "Materi Bab 2 mengenai bagaimana menempatkan batasan diri (boundaries) yang sehat bersama pasangan, keluarga, maupun lingkungan kerja..." },
      { id: "m-7", title: "Evaluasi Pemahaman Bab 2", durationOrPages: "10 Soal", type: "quiz", quizRoute: "/omah-belajar/ot-1/kuis-bab-2" },
    ]
  }
];

export default function MateriDetail() {
  const router = useRouter();

  const [activeMateri, setActiveMateri] = useState<SingleMateri>(PLAYLIST_DATA[0].items[1]);
  const [activeTab, setActiveTab] = useState<"overview" | "notes">("overview");
  const [completedItems, setCompletedItems] = useState<string[]>(["m-1"]);

  const handleMateriClick = (item: SingleMateri) => {
    if (item.type === "quiz" && item.quizRoute) {
      router.push(item.quizRoute);
    } else {
      setActiveMateri(item);
    }
  };

  return (
    <div className="min-h-screen bg-page-50 text-brand-900 font-sans antialiased">
      <nav className="bg-secondary-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-brand-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
            Ω
          </div>
        </div>
        <button
          onClick={() => router.push("/omah-belajar")}
          className="flex items-center gap-1 bg-brand-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-brand-700 transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: VIEWPORT AREA */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          <div className="w-full bg-gray-200 rounded-3xl overflow-hidden aspect-video shadow-md relative border border-gray-200/50">
            {activeMateri.type === "video" ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeMateri.videoUrl}?autoplay=1`}
                title={activeMateri.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full bg-white p-8 md:p-12 overflow-y-auto flex flex-col justify-center items-start leading-relaxed">
                <div className="bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1 rounded-md mb-4 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Modul Bacaan Teks
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-brand-900 mb-4">{activeMateri.title}</h2>
                <p className="text-sm md:text-base text-brand-900/80 font-normal whitespace-pre-line">
                  {activeMateri.textContent || "Tidak ada konten teks pratinjau tersedia."}
                </p>
              </div>
            )}
          </div>

          {/* SUB-TABS (Overview & Notes) */}
          <div className="w-full">
            <div className="bg-brand-700/20 p-1 rounded-2xl flex items-center w-full mb-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 py-2.5 text-center text-sm font-bold rounded-xl transition-all ${
                  activeTab === "overview" ? "bg-white text-brand-900 shadow-sm" : "text-brand-900/60 hover:text-brand-900"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex-1 py-2.5 text-center text-sm font-bold rounded-xl transition-all ${
                  activeTab === "notes" ? "bg-white text-brand-900 shadow-sm" : "text-brand-900/60 hover:text-brand-900"
                }`}
              >
                Notes
              </button>
            </div>

            {activeTab === "overview" ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-brand-900/80 bg-white/50 border border-gray-100 p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-700" />
                    <span>Total Durasi: <strong className="font-bold text-brand-900">4 jam 30 menit</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-700" />
                    <span>Jumlah Bab: <strong className="font-bold text-brand-900">3 bab</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart className="w-4 h-4 text-brand-700" />
                    <span>Progress: <strong className="font-bold text-brand-900">1/3 Selesai</strong></span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-brand-900">Hubungan Sehat</h3>
                  <p className="text-sm text-brand-900/70 leading-relaxed font-normal">
                    Hubungan Sehat adalah interaksi yang saling mendukung dan menghargai antara dua individu. Dalam hubungan ini, komunikasi terbuka dan jujur menjadi kunci, di mana kedua belah pihak merasa nyaman untuk berbagi perasaan dan pikiran. Kepercayaan, rasa hormat, dan dukungan emosional adalah fondasi utama yang membuat hubungan ini kuat dan bertahan lama.
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-brand-700/80">Sumber</h4>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                      alt="Laksana Ibrahim"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-brand-900">Laksana Ibrahim</p>
                      <p className="text-[10px] text-brand-700/60 font-medium">Universitas Indonesia - Kedokteran</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white rounded-2xl text-sm text-gray-500 italic">
                Fitur catatan materi belajar pribadi kawan kita akan tampil di sini.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PLAYLIST */}
        <div className="w-full">
          <div className="bg-[#E6E4F9] border border-brand-700/10 rounded-3xl overflow-hidden shadow-sm sticky top-24">
            <div className="bg-[#4A4763] text-white p-4 font-bold text-sm tracking-wide text-center">
              Daftar Materi Hubungan Sehat
            </div>

            <div className="p-4 flex flex-col gap-6 max-h-[600px] overflow-y-auto no-scrollbar">
              {PLAYLIST_DATA.map((bab, bIdx) => (
                <div key={bIdx} className="flex flex-col gap-2">
                  <h3 className="text-xs font-bold text-brand-900/80 tracking-wide px-1 mb-1">{bab.title}</h3>

                  <div className="flex flex-col gap-1.5">
                    {bab.items.map((item) => {
                      const isActive = activeMateri.id === item.id;
                      const isCompleted = completedItems.includes(item.id);

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleMateriClick(item)}
                          className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer border transition-all ${
                            isActive
                              ? "bg-white border-brand-700 shadow-sm scale-[1.01]"
                              : "bg-[#E6E4F9] border-transparent hover:bg-white/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted ? "text-brand-700" : "text-brand-900/40"
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                              ) : item.type === "video" ? (
                                <Play className="w-4 h-4 fill-brand-900/40" />
                              ) : item.type === "materi" ? (
                                <FileText className="w-4 h-4" />
                              ) : (
                                <HelpCircle className="w-4 h-4 text-orange-500" />
                              )}
                            </div>

                            <div className="flex flex-col">
                              <span className={`text-xs font-bold leading-tight ${isActive ? "text-brand-900" : "text-brand-900/80"}`}>
                                {item.title}
                              </span>
                              <span className="text-[10px] text-brand-700/60 font-semibold mt-0.5">
                                {item.durationOrPages}
                              </span>
                            </div>
                          </div>

                          {item.type === "quiz" && (
                            <span className="bg-orange-100 text-orange-600 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-md tracking-wider">
                              Quiz
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
