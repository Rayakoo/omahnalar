"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle2, AlertCircle, Flame, ChevronLeft, ChevronRight,
  BookOpen, Award, BarChart3, Clock, TrendingUp,
} from "lucide-react";
import {
  getCourses, getCategories, getEducationLevels,
  type CourseWithRelations, type Category, type EducationLevel,
} from "@/services/courses";
import { transformImageUrl } from "@/lib/image";
import { getUserCourse, getUserCourses, enrollCourse, type UserCourse } from "@/services/userCourses";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

function seededColor(seed: number, i: number) {
  const colors = ["#F07A94", "#7C78A8", "#6BBF8A", "#FAC775", "#E6E4F9"];
  return colors[(seed + i * 3) % colors.length];
}

interface UserStats {
  total: number;
  completed: number;
  inProgress: number;
}

export default function CoursePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.omahBelajar : en.omahBelajar;
  const common = locale === "id" ? id.common : en.common;

  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const defaultCats: Category[] = [
    { id: "default-ortu", name: "Orang Tua", slug: "orang-tua" },
    { id: "default-guru", name: "Guru", slug: "guru" },
    { id: "default-murid", name: "Murid", slug: "murid" },
    { id: "default-umum", name: "Umum", slug: "umum" },
  ];
  const [categories, setCategories] = useState<Category[]>(defaultCats);
  const [levels, setLevels] = useState<EducationLevel[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({ total: 0, completed: 0, inProgress: 0 });
  const [userCourseList, setUserCourseList] = useState<(UserCourse & { course: CourseWithRelations })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("Semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [c, cats, lvs] = await Promise.all([
          getCourses(),
          getCategories(),
          getEducationLevels(),
        ]);
        setCourses(c);
        if (cats.length > 0) setCategories(cats);
        if (lvs.length > 0) setLevels(lvs);
        setActiveTab("Semua");
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (!user) return;
    getUserCourses(user.id)
      .then((ucs) => {
        const list = ucs as unknown as (UserCourse & { course: CourseWithRelations })[];
        setUserCourseList(list);
        setUserStats({
          total: list.length,
          completed: list.filter((uc) => uc.is_completed).length,
          inProgress: list.filter((uc) => !uc.is_completed).length,
        });
      })
      .catch(() => {});
  }, [user]);

  const inProgressCourses = useMemo(
    () => userCourseList.filter((uc) => !uc.is_completed),
    [userCourseList]
  );

  const completedCourses = useMemo(
    () => userCourseList.filter((uc) => uc.is_completed),
    [userCourseList]
  );

  const progressPercent = userStats.total > 0
    ? Math.round((userStats.completed / userStats.total) * 100)
    : 0;

  const courseCats = useMemo(() => {
    const storyCatNames = new Set(["Puisi", "Pengalaman", "Curhat", "Opini", "Tips", "Inspirasi"]);
    const filtered = categories.filter((c) => !storyCatNames.has(c.name));
    return filtered;
  }, [categories]);

  const tabList = useMemo(() => {
    const semua: Category = { id: "semua", name: "Semua", slug: "semua" };
    return [semua, ...courseCats];
  }, [courseCats]);

  const filteredCourses = useMemo(() => {
    let result = courses;
    if (activeTab && activeTab !== "Semua") {
      result = result.filter((c) => c.category?.name === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q));
    }
    return result;
  }, [courses, activeTab, search]);

  const coursesByLevel = useMemo(() => {
    const map: Record<string, CourseWithRelations[]> = {};
    for (const c of filteredCourses) {
      const levelName = c.education_level.name;
      if (!map[levelName]) map[levelName] = [];
      map[levelName].push(c);
    }
    return map;
  }, [filteredCourses]);

  const seed = 42;

  const handleStartCourse = async (courseId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      const existing = await getUserCourse(user.id, courseId);
      if (!existing) {
        await enrollCourse(user.id, courseId);
      }
    } catch {}
    router.push(`/omah-belajar/${courseId}`);
  };

  const statCards = [
    { label: t.statsTotal, value: userStats.total, icon: BookOpen, color: "bg-brand-100 text-brand-700" },
    { label: t.statsProgress, value: userStats.inProgress, icon: Clock, color: "bg-amber-100 text-amber-600" },
    { label: t.statsDone, value: userStats.completed, icon: Award, color: "bg-emerald-100 text-emerald-600" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-page-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-50 text-brand-900 font-sans pb-20">
      <main className="max-w-6xl mx-auto px-6 mt-24">
        {user && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {statCards.map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                    <s.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-700/60 uppercase tracking-wider">{s.label}</p>
                    <p className="text-2xl font-black text-brand-900">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {userStats.total > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-brand-900">{t.progressTitle}</p>
                  <p className="text-xs font-semibold text-brand-700/60">{progressPercent}{t.progressPercent}</p>
                </div>
                <div className="w-full h-3 bg-brand-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-700 to-brand-900 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <p className="text-[11px] text-brand-700/50 mt-2">
                  {t.progressOf.replace("{completed}", String(userStats.completed)).replace("{total}", String(userStats.total))}
                </p>
              </div>
            )}
          </>
        )}

        {inProgressCourses.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <h2 className="text-lg font-black text-brand-900">{t.lanjutkanTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {inProgressCourses.map((uc) => {
                const course = uc.course;
                const progress = course.jumlah_isi > 0
                  ? Math.round((uc.current_urutan / course.jumlah_isi) * 100)
                  : 0;
                return (
                  <div
                    key={uc.id}
                    onClick={(e) => handleStartCourse(course.id, e)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer group"
                  >
                    <div className="w-full h-28 relative overflow-hidden bg-brand-100">
                      {course.thumbnail_url ? (
                        <img
                          src={transformImageUrl(course.thumbnail_url)}
                          alt={course.title}
                          className="w-full h-full object-contain bg-gray-100"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: seededColor(seed, parseInt(course.id.slice(0, 8), 36) || 0) }}
                        >
                          {course.title.charAt(0)}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                        <div
                          className="h-full bg-white/70 transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-bold text-brand-900 leading-snug mb-1">{course.title}</h4>
                      <p className="text-[11px] text-brand-700/60 font-semibold mb-3">
                        {course.category?.name ?? 'Unknown'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                          {Math.min(progress, 100)}%
                        </span>
                        <span className="text-brand-700 text-[10px] font-bold group-hover:underline">
                          {t.lanjutkanBtn} &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {completedCourses.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <h2 className="text-lg font-black text-brand-900">{t.selesaiTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {completedCourses.map((uc) => {
                const course = uc.course;
                return (
                  <div
                    key={uc.id}
                    onClick={(e) => handleStartCourse(course.id, e)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-emerald-100 cursor-pointer group"
                  >
                    <div className="w-full h-28 relative overflow-hidden bg-brand-100">
                      {course.thumbnail_url ? (
                        <img
                          src={transformImageUrl(course.thumbnail_url)}
                          alt={course.title}
                          className="w-full h-full object-contain bg-gray-100"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: seededColor(seed, parseInt(course.id.slice(0, 8), 36) || 0) }}
                        >
                          {course.title.charAt(0)}
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {t.selesaiBadge}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-bold text-brand-900 leading-snug mb-1">{course.title}</h4>
                      <p className="text-[11px] text-brand-700/60 font-semibold mb-3">
                        {course.category?.name ?? 'Unknown'}
                      </p>
                      <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        {t.sertifikatTersedia}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-3 p-1.5 bg-white rounded-2xl shadow-inner border border-gray-100 flex-wrap">
            {tabList.length === 0 ? (
              <span className="px-4 py-2 text-sm text-brand-700/50 font-semibold">{t.noCategory}</span>
            ) : (
              tabList.map((cat) => {
                const isSelected = activeTab === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.name)}
                    className={`relative px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                      isSelected
                        ? "bg-brand-900 text-white shadow-sm"
                        : "bg-brand-100 text-brand-900 hover:bg-brand-100/80"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {cat.name}
                  </button>
                );
              })
            )}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 shadow-sm"
            />
            <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <>
            <div className="mb-12">
              <h2 className="text-base font-bold text-brand-900/80 mb-4">{t.tersediaTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={(e) => handleStartCourse(course.id, e)}
                    className="bg-brand-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col cursor-pointer"
                  >
                    <div className="w-full h-36 relative overflow-hidden bg-brand-100">
                      {course.thumbnail_url ? (
                        <img
                          src={transformImageUrl(course.thumbnail_url)}
                          alt={course.title}
                          className="w-full h-full object-contain bg-gray-100"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: seededColor(seed, parseInt(course.id.slice(0, 8), 36) || 0) }}
                        >
                          {course.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="text-sm font-bold text-brand-900 leading-snug mb-1">{course.title}</h4>
                        <p className="text-[11px] text-brand-700/60 font-semibold mb-3">
                          {course.category?.name ?? 'Unknown'} • {course.education_level?.name ?? 'Unknown'}
                        </p>
                        {course.description && (
                          <p className="text-xs text-brand-700/80 leading-relaxed mb-4 line-clamp-2">{course.description}</p>
                        )}
                      </div>
                      <span className="bg-brand-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg w-fit shadow-sm">
                        {t.mulaiBelajar}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {activeTab === "Murid" && levels.map((level) => {
              const levelCourses = coursesByLevel[level.name];
              if (!levelCourses || levelCourses.length === 0) return null;
              return <SchoolCarousel key={level.id} level={level} courses={levelCourses} seed={seed} onStartCourse={handleStartCourse} />;
            })}
          </>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto text-brand-700/20 mb-4" />
            <h3 className="text-lg font-bold text-brand-700/60">{t.emptyTitle}</h3>
            <p className="text-sm text-brand-700/40 mt-1">{t.emptyDesc}</p>
          </div>
        )}
      </main>
    </div>
  );
}

function SchoolCarousel({ level, courses, seed, onStartCourse }: { level: EducationLevel; courses: CourseWithRelations[]; seed: number; onStartCourse: (courseId: string, e: React.MouseEvent) => void; }) {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.omahBelajar : en.omahBelajar;
  const [index, setIndex] = useState(0);
  const cardWidth = 320;
  const gap = 24;
  const maxIndex = Math.max(0, courses.length - 3);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-brand-900/80">
          {t.kategoriCourse.replace("{name}", level.name)}
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
          {courses.map((course, i) => (
            <div
              key={course.id}
              onClick={(e) => onStartCourse(course.id, e)}
              className="min-w-[280px] md:min-w-[320px] max-w-[320px] bg-brand-100 rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 transition-transform duration-200 flex flex-col shrink-0 cursor-pointer"
            >
              <div className="w-full h-36 relative overflow-hidden bg-brand-100">
                {course.thumbnail_url ? (
                  <img
                    src={transformImageUrl(course.thumbnail_url)}
                    alt={course.title}
                    className="w-full h-full object-contain bg-gray-100"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: seededColor(seed, i) }}
                  >
                    {course.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col justify-between flex-1 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-brand-900 leading-snug mb-1">{course.title}</h4>
                  <p className="text-[11px] text-brand-700/60 font-semibold">{course.category?.name ?? 'Unknown'}</p>
                </div>
                <span className="bg-brand-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg w-fit shadow-sm">
                  {t.mulaiBtn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
