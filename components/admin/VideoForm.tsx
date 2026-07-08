"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Save, Upload } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import {
  createCourseVideo,
  updateCourseVideo,
  getNextGlobalUrutanAndIncrement,
  type CourseVideo,
} from "@/services/courses";
import FileUploader from "@/components/FileUploader";

interface VideoFormProps {
  courseId: string;
  videoData?: CourseVideo | null;
  onSuccess?: () => void;
}

export default function VideoForm({ courseId, videoData, onSuccess }: VideoFormProps) {
  const router = useRouter();
  const isNew = !videoData;
  const [title, setTitle] = useState(videoData?.title ?? "");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState(videoData?.video_url ?? "");
  const [nextUrutan, setNextUrutan] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) return;
    getNextGlobalUrutanAndIncrement(courseId)
      .then(setNextUrutan)
      .catch(() => {});
  }, [courseId, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!title || !videoUrl) {
      alert("Judul dan link video wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await createCourseVideo({
          course_id: courseId,
          title,
          video_url: videoUrl,
          urutan: nextUrutan,
        });
      } else {
        await updateCourseVideo(videoData.id, { title, video_url: videoUrl });
      }
      onSuccess ? onSuccess() : router.push(`/admin/course/${courseId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan video");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!videoData) { router.push(`/admin/course/${courseId}`); return; }
    if (!window.confirm("Yakin ingin menghapus video ini?")) return;
    setSaving(true);
    try {
      const { deleteCourseVideo } = await import("@/services/courses");
      await deleteCourseVideo(videoData.id);
      onSuccess ? onSuccess() : router.push(`/admin/course/${courseId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus video");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-xl font-bold mb-6 text-[#2C2C2C]">Informasi Video</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Judul Video</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="contoh: Pentingnya Menjaga Kesehatan Reproduksi"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#9792EC] shadow-sm placeholder-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Deskripsi (opsional)</label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Petunjuk atau informasi tambahan"
            minHeight={120}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Link Video (YouTube/Google Drive)</label>
          <div className="flex items-start gap-2">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch..."
              className="flex-1 w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#9792EC] shadow-sm placeholder-gray-300"
            />
            <FileUploader onUploadComplete={(url) => setVideoUrl(url)} accept="video/*" label="Upload Video" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="px-8 py-3 bg-[#3A3852] text-white font-bold rounded-xl hover:bg-[#4E4B6E] flex items-center gap-2 shadow-md transition-all text-sm disabled:opacity-50"
            disabled={saving}
          >
            <Trash2 className="w-4 h-4" /> {videoData ? "Hapus" : "Batal"}
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
