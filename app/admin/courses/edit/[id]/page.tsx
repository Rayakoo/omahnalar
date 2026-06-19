"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { getCourseById, getCategories, getEducationLevels, updateCourse, type CourseWithRelations, type Category, type EducationLevel } from "@/services/courses";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditCourse() {
  const router = useRouter();
  const params = useParams();
  const savingRef = useRef(false);

  const [form, setForm] = useState({ title: "", description: "", category_id: "", education_level_id: "", thumbnail_url: "" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<EducationLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;
    Promise.all([getCourseById(id), getCategories(), getEducationLevels()])
      .then(([course, cats, levs]) => {
        setForm({
          title: course.title,
          description: course.description ?? "",
          category_id: course.category_id,
          education_level_id: course.education_level_id,
          thumbnail_url: course.thumbnail_url ?? "",
        });
        setCategories(cats);
        setLevels(levs);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Gagal memuat course"))
      .finally(() => setLoading(false));
  }, [params?.id]);

  const doSave = async () => {
    if (savingRef.current) return;
    if (!form.title || !form.category_id || !form.education_level_id) {
      setError("Judul, kategori, dan tingkat harus diisi.");
      return;
    }
    setError("");
    setSaving(true);
    savingRef.current = true;

    try {
      await updateCourse(params?.id as string, {
        title: form.title,
        description: form.description || undefined,
        category_id: form.category_id,
        education_level_id: form.education_level_id,
        thumbnail_url: form.thumbnail_url || undefined,
      });
      router.push("/admin/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan course");
    } finally {
      setSaving(false);
      savingRef.current = false;
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
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.push("/admin/courses")} className="p-2 rounded-lg hover:bg-[#EBEAF6] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#4D455D]" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-[#EBEAF6]/60 border border-[#D9D7EC] rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Course <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
            <RichTextEditor
              value={form.description}
              onChange={(v) => setForm((prev) => ({ ...prev, description: v }))}
              placeholder="Deskripsi course"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Thumbnail <span className="text-gray-400 font-normal text-xs">(opsional)</span></label>
            <input
              type="url"
              value={form.thumbnail_url}
              onChange={(e) => setForm((prev) => ({ ...prev, thumbnail_url: e.target.value }))}
              placeholder="https://example.com/gambar.jpg"
              className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
              <select
                value={form.category_id}
                onChange={(e) => setForm((prev) => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
              >
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tingkat <span className="text-red-500">*</span></label>
              <select
                value={form.education_level_id}
                onChange={(e) => setForm((prev) => ({ ...prev, education_level_id: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
              >
                <option value="">Pilih tingkat</option>
                {levels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>{lvl.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-medium">{error}</div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={doSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/courses")}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
