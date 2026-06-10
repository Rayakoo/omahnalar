"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle,
  FileText,
  Layers,
  HelpCircle,
  Video,
  Search,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import {
  getCoursesWithCounts,
  getCourseStats,
  deleteCourse,
  type CourseWithCounts,
  type CourseStats,
} from "@/services/courses";

export default function AdminKelolaCourse() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseWithCounts[]>([]);
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([getCoursesWithCounts(), getCourseStats()])
      .then(([c, s]) => {
        setCourses(c);
        setStats(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus course "${title}"?`)) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      const updatedStats = await getCourseStats();
      setStats(updatedStats);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total course", value: stats?.totalCourses ?? 0, icon: BookOpen },
    { label: "Total modul", value: stats?.totalModules ?? 0, icon: Layers },
    { label: "Total video", value: stats?.totalVideos ?? 0, icon: Video },
    { label: "Total kuis", value: stats?.totalQuizzes ?? 0, icon: HelpCircle },
  ];

  return (
    <div className="min-h-full font-sans">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#333333]">Kelola Course</h1>
        <button
          onClick={() => router.push("/admin/course/new")}
          className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tambah Course
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-[#E2E0FF] rounded-2xl p-5 text-center shadow-sm flex flex-col justify-center items-center"
            >
              <Icon className="w-5 h-5 text-[#5A5A5A] mb-1" />
              <span className="text-3xl font-extrabold text-[#2C2C2C]">{stat.value}</span>
              <span className="text-xs text-[#5A5A5A] font-medium mt-0.5">{stat.label}</span>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xs mb-6">
        <input
          type="text"
          placeholder="Cari Course"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#E5E5E5] rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#C4C2FF] placeholder-gray-400 shadow-sm"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
      </div>

      {/* Course List */}
      <div className="bg-white border-2 border-[#E2E0FF] rounded-2xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            {search ? "Course tidak ditemukan." : "Belum ada course."}
          </div>
        ) : (
          <div className="divide-y-2 divide-[#F4F3FF]">
            {filtered.map((course) => (
              <div
                key={course.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-[#FAF9FF] transition-colors gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-[#2C2C2C] mb-1 truncate">{course.title}</h3>
                  <p className="text-sm text-gray-500">
                    {course.materialCount} Modul &bull; {course.videoCount} Video &bull; {course.quizCount} kuis
                  </p>
                </div>

                <div className="w-40 md:text-left shrink-0">
                  <span className="text-sm font-medium text-[#5A5A5A]">{course.education_level?.name || "-"}</span>
                </div>

                <div className="flex items-center gap-6 justify-between md:justify-end shrink-0">
                  <div className="w-24">
                    {course.status === "Draft" ? (
                      <span className="inline-flex items-center gap-1 bg-[#F5C469] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        <FileText className="w-3 h-3" /> Draft
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-[#9792EC] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        <CheckCircle className="w-3 h-3" /> Publish
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/admin/course/${course.id}`)}
                      className="p-2 bg-[#3A3852] text-white rounded-lg hover:bg-[#4E4B6E] transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id, course.title)}
                      className="p-2 bg-[#3A3852] text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
