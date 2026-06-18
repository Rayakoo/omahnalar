"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { ChevronLeft, Download, Award, AlertTriangle, RefreshCw } from "lucide-react";
import { getCourseById } from "@/services/courses";
import { areAllQuizzesPassed, getQuizIdsByCourse } from "@/services/quizzes";
import { completeCourse } from "@/services/userCourses";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

export default function HasilQuiz() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params["id-course"] as string;
  const { user } = useAuth();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.omahBelajar : en.omahBelajar;
  const common = locale === "id" ? id.common : en.common;

  const [courseTitle, setCourseTitle] = useState("");
  const [allPassed, setAllPassed] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(true);

  useEffect(() => {
    if (!courseId || !user) return;
    const init = async () => {
      try {
        const c = await getCourseById(courseId);
        setCourseTitle(c.title);

        if (isPassed) {
          const allDone = await areAllQuizzesPassed(user.id, courseId);
          setAllPassed(allDone);
          if (allDone) {
            await completeCourse(user.id, courseId);
          }
        }
      } catch {}
      setLoadingCourse(false);
    };
    init();
  }, [courseId, user]);

  const score = parseInt(searchParams.get("score") || "0");
  const total = parseInt(searchParams.get("total") || "1");
  const percentage = Math.round((score / total) * 100);
  const isPassed = percentage >= 75;

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || t.kawanKita;
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const options = {
        margin: 0,
        filename: `Sertifikat_${displayName.replace(/\s+/g, "_")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: { unit: "px", format: [940, 665], orientation: "landscape" },
      };

      await html2pdf().set(options).from(certificateRef.current).save();
    } catch (error) {
      console.error("Gagal mengunduh PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (loadingCourse) {
    return (
      <div className="min-h-screen bg-page-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-50 text-brand-900 font-sans antialiased flex flex-col">
      <nav className="bg-secondary-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <img src="/images/logo_omah.png" alt="Omah Nalar" className="h-10 w-auto" />
          <span className="font-bold text-sm tracking-wide ml-2 hidden sm:inline">{t.title}</span>
          <span className="font-bold text-sm bg-brand-900 text-white px-4 py-1.5 rounded-full ml-2 shadow-sm">{t.hasilTitle}</span>
        </div>
        <button
          onClick={() => router.push(`/omah-belajar/${courseId}`)}
          className="flex items-center gap-1 bg-brand-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-brand-700 transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" /> {common.back}
        </button>
      </nav>

      {isPassed && allPassed ? (
        <div className="flex-1 flex flex-col">
          <div className="bg-[#4A4763] text-white text-center py-12 px-6 shadow-inner">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              {t.selamatBadge}
            </span>
            <h1 className="text-2xl md:text-4xl font-black mt-4 tracking-wide max-w-3xl mx-auto leading-tight">
              {t.selesaiCourse}
            </h1>
            <p className="text-xs md:text-sm text-white/70 mt-3 max-w-xl mx-auto leading-relaxed">
              {t.skorMsg.replace("{score}", String(score)).replace("{total}", String(total)).replace("{percentage}", String(percentage))}
            </p>
          </div>

          <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 flex flex-col items-center gap-8">
            <div className="w-full max-w-[940px] shadow-2xl rounded-2xl overflow-hidden border border-gray-200 bg-white">
              <div
                ref={certificateRef}
                className="relative w-full aspect-[940/665] bg-white select-none flex flex-col justify-center items-center p-12 text-center overflow-hidden"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1200')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-6 border-4 border-double border-brand-900/10 pointer-events-none rounded-lg" />

                <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1E293B] tracking-wide mb-2 uppercase">
                  {t.certificateTitle}
                </h2>
                <p className="text-xs md:text-sm text-gray-500 font-medium tracking-widest uppercase mb-10">
                  {t.certificateTo}
                </p>

                <h3 className="text-4xl md:text-5xl font-sans font-black text-brand-700 tracking-wider border-b-2 border-brand-700/30 pb-2 px-8 min-w-[300px]">
                  {displayName}
                </h3>

                <p className="text-xs md:text-sm text-gray-600 font-medium max-w-md leading-relaxed mt-8">
                  {t.certificateDesc} <br />
                  <strong className="text-brand-900 font-bold">{courseTitle}</strong>
                </p>

                <div className="mt-12 flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">{t.certificateBy}</span>
                  <span className="font-bold text-sm text-[#4A4763] tracking-wide mt-1">{t.certificateAcademy}</span>
                  <span className="text-[9px] text-gray-400 mt-0.5">
                    {new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-[#4A4763] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#3b3852] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-md mb-8"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {t.processingPdf}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {t.downloadCert}
                </>
              )}
            </button>
          </main>
        </div>
      ) : isPassed ? (
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-8 text-center shadow-lg flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
              <Award className="w-7 h-7 stroke-[2]" />
            </div>
            <h2 className="text-lg font-black text-emerald-700 tracking-wide">
              {t.lulusTitle}
            </h2>
            <p className="text-xs md:text-sm text-emerald-900/80 font-semibold leading-relaxed max-w-xs">
              {t.lulusMsg.replace("{score}", String(score)).replace("{total}", String(total)).replace("{percentage}", String(percentage))}
            </p>
            <p className="text-[11px] text-emerald-700/60">
              {t.selesaikanSemua}
            </p>
            <div className="w-full h-[1px] bg-emerald-200/60 my-2" />
            <button
              onClick={() => router.push(`/omah-belajar/${courseId}`)}
              className="flex items-center gap-1 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-sm"
            >
              {t.lanjutMateri}
            </button>
          </div>
        </main>
      ) : (
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-rose-50 border-2 border-rose-200 rounded-3xl p-8 text-center shadow-lg flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
              <AlertTriangle className="w-7 h-7 stroke-[2]" />
            </div>

            <h2 className="text-lg font-black text-rose-700 tracking-wide">
              {t.gagalTitle}
            </h2>

            <p className="text-xs md:text-sm text-rose-900/80 font-semibold leading-relaxed max-w-xs">
              {t.gagalMsg.replace("{score}", String(score)).replace("{total}", String(total)).replace("{percentage}", String(percentage))}
            </p>

            <div className="w-full h-[1px] bg-rose-200/60 my-2" />

            <button
              onClick={() => router.push(`/omah-belajar/${courseId}`)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors bg-white border border-rose-200 px-4 py-2 rounded-xl shadow-sm"
            >
              {t.cobaUlang}
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
