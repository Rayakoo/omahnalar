"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Play, FileText, HelpCircle, CheckCircle2, Clock, BookOpen, BarChart } from "lucide-react";
import { getCourseById, getCourseSections, type CourseWithRelations, type CourseSection } from "@/services/courses";
import { getQuizById } from "@/services/quizzes";

function sectionIcon(type: string) {
  switch (type) {
    case "video": return Play;
    case "materi": return FileText;
    case "quiz": return HelpCircle;
    default: return FileText;
  }
}

export default function MateriDetail() {
  const router = useRouter();
  const params = useParams();
  const courseId = params["id-course"] as string;

  const [course, setCourse] = useState<CourseWithRelations | null>(null);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "notes">("overview");
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    const fetchData = async () => {
      try {
        const [c, secs] = await Promise.all([
          getCourseById(courseId),
          getCourseSections(courseId),
        ]);
        setCourse(c);
        setSections(secs);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const activeSection = sections[activeIdx];
  const courseTitle = course?.title || "";

  const handleSectionClick = async (idx: number) => {
    const sec = sections[idx];
    if (sec.type === "quiz") {
      const quiz = await getQuizById(sec.data.id);
      router.push(`/omah-belajar/${courseId}/${quiz.id}`);
    } else {
      setActiveIdx(idx);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-page-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="w-full bg-gray-200 rounded-3xl overflow-hidden aspect-video shadow-md relative border border-gray-200/50">
            {!activeSection ? (
              <div className="w-full h-full flex items-center justify-center text-brand-700/60 text-sm bg-white">
                Pilih materi dari daftar
              </div>
            ) : activeSection.type === "video" ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeSection.data.video_url}?autoplay=1`}
                title={activeSection.data.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : activeSection.type === "materi" ? (
              <div className="w-full h-full bg-white p-8 md:p-12 overflow-y-auto flex flex-col justify-center items-start leading-relaxed">
                <div className="bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1 rounded-md mb-4 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Modul Bacaan Teks
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-brand-900 mb-4">{activeSection.data.title}</h2>
                <p className="text-sm md:text-base text-brand-900/80 font-normal whitespace-pre-line">
                  {activeSection.data.content}
                </p>
              </div>
            ) : null}
          </div>

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
                    <span>Total Materi: <strong className="font-bold text-brand-900">{sections.length}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-700" />
                    <span>Selesai: <strong className="font-bold text-brand-900">{completedIds.length}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart className="w-4 h-4 text-brand-700" />
                    <span>Progress: <strong className="font-bold text-brand-900">{Math.round((completedIds.length / Math.max(sections.length, 1)) * 100)}%</strong></span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-brand-900">{course?.title}</h3>
                  <p className="text-sm text-brand-900/70 leading-relaxed font-normal">
                    {course?.description || "Tidak ada deskripsi"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white rounded-2xl text-sm text-gray-500 italic">
                Fitur catatan materi belajar pribadi kawan kita akan tampil di sini.
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <div className="bg-[#E6E4F9] border border-brand-700/10 rounded-3xl overflow-hidden shadow-sm sticky top-24">
            <div className="bg-[#4A4763] text-white p-4 font-bold text-sm tracking-wide text-center">
              Daftar Materi {courseTitle}
            </div>

            <div className="p-4 flex flex-col gap-6 max-h-[600px] overflow-y-auto no-scrollbar">
              {sections.length === 0 ? (
                <p className="text-xs text-brand-700/60 text-center py-8">Belum ada materi</p>
              ) : (
                sections.map((sec, idx) => {
                  const isActive = activeIdx === idx;
                  const isCompleted = completedIds.includes(sec.data.id);
                  const Icon = sectionIcon(sec.type);

                  return (
                    <div key={sec.data.id}>
                      {idx === 0 || sec.data.urutan === 1 ? null : (
                        <div className="text-[11px] font-bold text-brand-900/60 mb-2 px-1" />
                      )}
                      <button
                        onClick={() => handleSectionClick(idx)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl cursor-pointer border transition-all text-left ${
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
                            ) : (
                              <Icon className={`w-4 h-4 ${sec.type === "quiz" ? "text-orange-500" : ""}`} />
                            )}
                          </div>

                          <div className="flex flex-col">
                            <span className={`text-xs font-bold leading-tight ${isActive ? "text-brand-900" : "text-brand-900/80"}`}>
                              {sec.data.title}
                            </span>
                            <span className="text-[10px] text-brand-700/60 font-semibold mt-0.5 capitalize">
                              {sec.type}
                            </span>
                          </div>
                        </div>

                        {sec.type === "quiz" && (
                          <span className="bg-orange-100 text-orange-600 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-md tracking-wider">
                            Quiz
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
