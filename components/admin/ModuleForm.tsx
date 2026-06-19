"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Save } from "lucide-react";
import {
  createCourseMaterial,
  updateCourseMaterial,
  getNextGlobalUrutanAndIncrement,
  type CourseMaterial,
} from "@/services/courses";
import RichTextEditor from "./RichTextEditor";

interface ModuleFormProps {
  courseId: string;
  moduleData?: CourseMaterial | null;
  onSuccess?: () => void;
}

export default function ModuleForm({ courseId, moduleData, onSuccess }: ModuleFormProps) {
  const router = useRouter();
  const isNew = !moduleData;
  const [title, setTitle] = useState(moduleData?.title ?? "");
  const [content, setContent] = useState(moduleData?.content ?? "");
  const [nextUrutan, setNextUrutan] = useState(1);
  const [saving, setSaving] = useState(false);
  const maxChars = 1000;

  useEffect(() => {
    if (!isNew) return;
    getNextGlobalUrutanAndIncrement(courseId)
      .then(setNextUrutan)
      .catch(() => {});
  }, [courseId, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!title || !content) {
      alert("Judul dan isi modul wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await createCourseMaterial({
          course_id: courseId,
          title,
          content,
          urutan: nextUrutan,
        });
      } else {
        await updateCourseMaterial(moduleData.id, { title, content });
      }
      onSuccess ? onSuccess() : router.push(`/admin/course/${courseId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan modul");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!moduleData) { router.push(`/admin/course/${courseId}`); return; }
    if (!window.confirm("Yakin ingin menghapus modul ini?")) return;
    setSaving(true);
    try {
      const { deleteCourseMaterial } = await import("@/services/courses");
      await deleteCourseMaterial(moduleData.id);
      onSuccess ? onSuccess() : router.push(`/admin/course/${courseId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus modul");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-xl font-bold mb-6 text-[#2C2C2C]">Informasi Modul</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Judul Modul</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="contoh: Pentingnya Menjaga Kesehatan Reproduksi"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#9792EC] shadow-sm placeholder-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Isi Modul</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Tulis materi di sini..."
          />
        </div>

        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="px-8 py-3 bg-[#3A3852] text-white font-bold rounded-xl hover:bg-[#4E4B6E] flex items-center gap-2 shadow-md transition-all text-sm disabled:opacity-50"
            disabled={saving}
          >
            <Trash2 className="w-4 h-4" /> {moduleData ? "Hapus" : "Batal"}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#524D85] text-white font-bold rounded-xl hover:bg-[#645FA1] flex items-center gap-2 shadow-md transition-all text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
