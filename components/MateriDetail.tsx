"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Play, FileText, HelpCircle, CheckCircle2, Clock, BookOpen, BarChart, Download, File as FileIcon, Gamepad2 } from "lucide-react";
import { getCourseById, getCourseSections, type CourseWithRelations, type CourseSection } from "@/services/courses";
import { getQuizById, getQuizIdsByCourse, getUserQuizResults } from "@/services/quizzes";
import { getUserCourse, enrollCourse, updateProgress } from "@/services/userCourses";
import { getCourseMinigames, MINIGAME_TYPE_LABELS, type CourseMinigame } from "@/services/course-minigames";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";
import { getVideoEmbedUrl } from "@/lib/video";
import { getProxiedUrl } from "@/services/garage";

function sectionIcon(type: string) {
  switch (type) {
    case "video": return Play;
    case "materi": return FileText;
    case "quiz": return HelpCircle;
    case "minigame": return Gamepad2;
    default: return FileText;
  }
}

export default function MateriDetail() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.omahBelajar : en.omahBelajar;
  const common = locale === "id" ? id.common : en.common;
  const courseId = params["id-course"] as string;

  const [course, setCourse] = useState<CourseWithRelations | null>(null);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [materiTab, setMateriTab] = useState<"materi" | "file">("materi");
  const [loading, setLoading] = useState(true);
  const [mgList, setMgList] = useState<CourseMinigame[]>([]);
  const userUrutan = useRef(0);

  useEffect(() => {
    if (!courseId) return;
    const fetchData = async () => {
      try {
        const [c, secs, mgs] = await Promise.all([
          getCourseById(courseId),
          getCourseSections(courseId),
          getCourseMinigames(courseId).catch(() => [] as CourseMinigame[]),
        ]);
        setCourse(c);
        setSections(secs);
        setMgList(mgs);

        // Restore user progress
        if (user) {
          const [uc, quizIds] = await Promise.all([
            getUserCourse(user.id, courseId),
            getQuizIdsByCourse(courseId).catch(() => [] as string[]),
          ]);
          if (uc) {
            userUrutan.current = uc.current_urutan;
            if (uc.current_urutan > 0) {
              const idx = secs.findIndex((s) => s.data.urutan === uc.current_urutan);
              if (idx >= 0) setActiveIdx(idx);
            }
          } else {
            await enrollCourse(user.id, courseId);
          }

          // Mark passed quizzes
          if (quizIds.length > 0) {
            const passedIds: string[] = [];
            for (const qid of quizIds) {
              const results = await getUserQuizResults(user.id, qid);
              if (results?.some((r) => r.passed)) {
                passedIds.push(qid);
              }
            }
            setCompletedIds(passedIds);
          }
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, user]);

  const activeSection = sections[activeIdx];
  const courseTitle = course?.title || "";

  const handleSectionClick = async (idx: number) => {
    const sec = sections[idx];
    setMateriTab("materi");
    if (user) {
      try {
        const dbUc = await getUserCourse(user.id, courseId);
        const dbUrutan = dbUc?.current_urutan ?? 0;
        if (sec.data.urutan > dbUrutan) {
          await updateProgress(user.id, courseId, sec.data.urutan);
          userUrutan.current = sec.data.urutan;
        }
      } catch (e) {
        console.error("Gagal update progress:", e);
      }
    }
    if (sec.type === "quiz") {
      const quiz = await getQuizById(sec.data.id);
      router.push(`/omah-belajar/${courseId}/${quiz.id}`);
    } else if (sec.type === "minigame") {
      router.push(`/omah-belajar/${courseId}/minigame/${sec.data.id}`);
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
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/logo_omah.png" alt="Omah Nalar" className="h-10 w-auto" />
        </Link>
        <button
          onClick={() => router.push(`/omah-belajar/${courseId}`)}
          className="flex items-center gap-1 bg-brand-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-brand-700 transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          {common.back}
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className={`w-full bg-gray-200 rounded-3xl shadow-md relative border border-gray-200/50 ${activeSection?.type === "materi" ? "" : "overflow-hidden aspect-video"}`}>
            {!activeSection ? (
              <div className="w-full h-full flex items-center justify-center text-brand-700/60 text-sm bg-white">
                {t.pilihMateri}
              </div>
            ) : activeSection.type === "video" ? (
              (() => {
                const rawUrl = activeSection.data.video_url;
                const url = getProxiedUrl(rawUrl) || rawUrl;
                const isMp4 = url?.match(/\.(mp4|webm)(\?|$)/i) || rawUrl?.includes("bucket-utama.web.43.156.104.232.sslip.io");
                if (isMp4) {
                  return (
                    <video
                      className="w-full h-full object-contain bg-black"
                      src={url}
                      controls
                    />
                  );
                }
                const embed = getVideoEmbedUrl(url);
                const base = embed || `https://www.youtube.com/embed/${url}`;
                const src = base.includes("youtube.com/embed") ? `${base}?autoplay=1` : base;
                return (
                  <iframe
                    className="w-full h-full"
                    src={src}
                    title={activeSection.data.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              })()
            ) : activeSection.type === "materi" ? (
              <div className="w-full bg-white rounded-3xl flex flex-col leading-relaxed">
                <div className="p-6 md:p-10 pb-0">
                  <h2 className="text-xl md:text-2xl font-bold text-brand-900 mb-4">{activeSection.data.title}</h2>
                  {activeSection.data.content && activeSection.data.file_url && (
                    <div className="bg-brand-700/20 p-1 rounded-2xl flex items-center w-full mb-6">
                      <button
                        onClick={() => setMateriTab("materi")}
                        className={`flex-1 py-2.5 text-center text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                          materiTab === "materi" ? "bg-white text-brand-900 shadow-sm" : "text-brand-900/60 hover:text-brand-900"
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        {locale === "id" ? "Materi" : "Text"}
                      </button>
                      <button
                        onClick={() => setMateriTab("file")}
                        className={`flex-1 py-2.5 text-center text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                          materiTab === "file" ? "bg-white text-brand-900 shadow-sm" : "text-brand-900/60 hover:text-brand-900"
                        }`}
                      >
                        <FileIcon className="w-4 h-4" />
                        {locale === "id" ? "File" : "File"}
                      </button>
                    </div>
                  )}
                </div>
                <div className="px-6 md:px-10 pb-6 md:pb-10 overflow-y-auto max-h-[60vh]">
                  {materiTab === "materi" && activeSection.data.content && (
                    <div
                      className="text-sm md:text-base text-brand-900/80 font-normal leading-relaxed prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800"
                      dangerouslySetInnerHTML={{ __html: activeSection.data.content }}
                    />
                  )}
                  {materiTab === "materi" && !activeSection.data.content && activeSection.data.file_url && (
                    <div className="text-sm text-gray-500 italic">{locale === "id" ? "Tidak ada teks materi." : "No text content."}</div>
                  )}
                  {materiTab === "file" && activeSection.data.file_url && (
                    (() => {
                      const rawUrl = activeSection.data.file_url;
                      const proxied = getProxiedUrl(rawUrl);
                      const url = proxied || rawUrl;
                      const absUrl = url.startsWith("/") ? `${window.location.origin}${url}` : url;
                      const isPdf = url?.match(/\.pdf(\?|$)/i);
                      if (isPdf) {
                        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absUrl)}&embedded=true`;
                        return (
                          <iframe
                            src={viewerUrl}
                            className="w-full h-[70vh] rounded-xl border border-gray-200"
                            title={locale === "id" ? "Pratinjau File" : "File Preview"}
                          />
                        );
                      }
                      return (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-3 bg-brand-900 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-all shadow-sm"
                        >
                          <Download className="w-4 h-4" />
                          {locale === "id" ? "Download File" : "Download File"}
                        </a>
                      );
                    })()
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="w-full">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-brand-900/80 bg-white/50 border border-gray-100 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-700" />
                  <span>{t.totalMateri} <strong className="font-bold text-brand-900">{sections.length}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-700" />
                  <span>{t.selesaiStat} <strong className="font-bold text-brand-900">{completedIds.length}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-brand-700" />
                  <span>{t.progressStat} <strong className="font-bold text-brand-900">{Math.round((completedIds.length / Math.max(sections.length, 1)) * 100)}%</strong></span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-brand-900">{course?.title}</h3>
                <p className="text-sm text-brand-900/70 leading-relaxed font-normal">
                  {course?.description || t.noDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Minigame cards for interactive courses (shown when not viewing a minigame) */}
          {course?.course_type === "interactive" && activeSection?.type !== "minigame" && mgList.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-bold text-brand-900 mb-4">Minigame</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mgList.map((mg) => (
                  <button
                    key={mg.id}
                    onClick={() => router.push(`/omah-belajar/${courseId}/minigame/${mg.id}`)}
                    className="bg-[#FFF0F5] border border-[#FFC0D5] rounded-xl p-4 text-left hover:bg-[#FFE8EF] transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Gamepad2 className="w-4 h-4 text-[#E75480] shrink-0" />
                      <span className="text-xs font-bold text-gray-700">{mg.title}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium block">
                      {MINIGAME_TYPE_LABELS[mg.type as keyof typeof MINIGAME_TYPE_LABELS] || mg.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="bg-[#E6E4F9] border border-brand-700/10 rounded-3xl overflow-hidden shadow-sm sticky top-24">
            <div className="bg-[#4A4763] text-white p-4 font-bold text-sm tracking-wide text-center">
              {t.daftarMateri.replace("{courseTitle}", courseTitle)}
            </div>

            <div className="p-4 flex flex-col gap-6 max-h-[600px] overflow-y-auto no-scrollbar">
              {sections.length === 0 ? (
                <p className="text-xs text-brand-700/60 text-center py-8">{t.noMateri}</p>
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
                            {t.quizBadge}
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
