"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, BookOpen, BarChart3, Users, GraduationCap, Play, ArrowRight } from "lucide-react";
import { getCourseById, type CourseWithRelations, COURSE_TYPE_LABELS } from "@/services/courses";
import { getUserCourse, enrollCourse } from "@/services/userCourses";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";
import { transformImageUrl } from "@/lib/image";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.omahBelajar : en.omahBelajar;
  const common = locale === "id" ? id.common : en.common;
  const courseId = params["id-course"] as string;

  const [course, setCourse] = useState<CourseWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    getCourseById(courseId)
      .then(setCourse)
      .catch(() => router.push("/omah-belajar"))
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (!user || !courseId) return;
    getUserCourse(user.id, courseId)
      .then((uc) => {
        if (uc) {
          setIsEnrolled(true);
          setIsCompleted(uc.is_completed);
        }
      })
      .catch(() => {});
  }, [user, courseId]);

  const handleStart = async () => {
    if (course?.course_type === "unsolved_case") {
      router.push(`/unsolved-case/${courseId}`);
      return;
    }
    if (!user) {
      router.push("/login");
      return;
    }
    if (!isEnrolled) {
      try {
        await enrollCourse(user.id, courseId);
      } catch {}
    }
    router.push(`/omah-belajar/${courseId}/materi`);
  };

  const today = new Date().toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-page-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  const courseLengthMinutes = (course.jumlah_isi || 0) * 30;

  return (
    <div className="min-h-screen bg-page-50 text-brand-900 font-sans">
      <nav className="max-w-4xl mx-auto px-4 md:px-6 pt-6 md:pt-8">
        <Link
          href="/omah-belajar"
          className="inline-flex items-center gap-1 bg-brand-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-brand-700 transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.kembaliBtn}
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100">
          {course.thumbnail_url ? (
            <div className="w-full aspect-video bg-gray-100">
              <img
                src={transformImageUrl(course.thumbnail_url)}
                alt={course.title}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-brand-300" />
            </div>
          )}

          <div className="p-6 md:p-10">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-900 mb-4">{course.title}</h1>

            {course.description && (
              <p className="text-sm md:text-base text-brand-900/70 leading-relaxed mb-8">
                {course.description}
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-brand-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-brand-700 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {locale === "id" ? "Durasi" : "Duration"}
                  </span>
                </div>
                <p className="text-sm font-bold">{courseLengthMinutes} {locale === "id" ? "menit" : "minutes"}</p>
              </div>

              <div className="bg-brand-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-brand-700 mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {locale === "id" ? "Modul" : "Modules"}
                  </span>
                </div>
                <p className="text-sm font-bold">{course.jumlah_isi} {locale === "id" ? "modul" : "modules"}</p>
              </div>

              <div className="bg-brand-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-brand-700 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {locale === "id" ? "Kategori" : "Category"}
                  </span>
                </div>
                <p className="text-sm font-bold">{course.category?.name}</p>
              </div>

              <div className="bg-brand-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-brand-700 mb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {locale === "id" ? "Level" : "Level"}
                  </span>
                </div>
                <p className="text-sm font-bold">{course.education_level?.name}</p>
              </div>

              <div className="bg-brand-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-brand-700 mb-1">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {locale === "id" ? "Tipe" : "Type"}
                  </span>
                </div>
                <p className="text-sm font-bold">{COURSE_TYPE_LABELS[course.course_type] || course.course_type}</p>
              </div>

              <div className="bg-brand-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-brand-700 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {locale === "id" ? "Mulai" : "Start"}
                  </span>
                </div>
                <p className="text-sm font-bold">{today}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStart}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-900 text-white px-8 py-4 rounded-2xl text-base font-bold hover:bg-brand-700 transition-all active:scale-95 shadow-sm"
              >
                <Play className="w-5 h-5" />
                {isCompleted
                  ? (locale === "id" ? "Lihat Lagi" : "Review")
                  : isEnrolled
                    ? (locale === "id" ? "Lanjutkan" : "Continue")
                    : (locale === "id" ? "Mulai Belajar" : "Start Learning")}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-brand-700/40 text-center">
          {locale === "id" ? "Dibuat" : "Created"}: {new Date(course.created_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </main>
    </div>
  );
}
