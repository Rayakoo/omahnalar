"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getCourses, getCategories, deleteCourse, type CourseWithRelations, type Category } from "@/services/courses";

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCourses(), getCategories()])
      .then(([c, cats]) => { setCourses(c); setCategories(cats); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus course "${title}"?`)) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#333333]">Kelola Course</h1>
        <button className="px-5 py-2 text-sm font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-xl transition-colors shadow-sm">
          + Tambah Course
        </button>
      </div>
      <div className="bg-[#EBEAF6] border border-[#D9D7EC] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D9D7EC]">
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Judul</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Kategori</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Tingkat</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1DFEF]">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm text-gray-500">Belum ada course.</td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr key={c.id} className="hover:bg-[#E4E2F2]/50 transition-colors">
                    <td className="p-5 text-sm font-medium text-[#4D4D4D]">{c.title}</td>
                    <td className="p-5 text-sm font-medium text-[#4D4D4D]">{c.category?.name || "-"}</td>
                    <td className="p-5 text-sm font-medium text-[#4D4D4D]">{c.education_level?.name || "-"}</td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => router.push(`/admin/courses/edit/${c.id}`)} className="px-4 py-1.5 text-xs font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-lg transition-colors shadow-sm">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(c.id, c.title)} className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
