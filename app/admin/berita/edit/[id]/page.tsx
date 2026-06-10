"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { getBeritaById, updateBerita, type Berita } from "@/services/berita";

export default function EditBerita() {
  const router = useRouter();
  const params = useParams();
  const savingRef = useRef(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    author: "",
    is_published: false,
  });
  const [videos, setVideos] = useState<string[]>([""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;
    getBeritaById(id)
      .then((b: Berita) => {
        setForm({
          title: b.title,
          slug: b.slug,
          content: b.content,
          excerpt: b.excerpt ?? "",
          author: b.author,
          is_published: b.is_published,
        });
        setVideos(b.video_url?.length > 0 ? b.video_url : [""]);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Gagal memuat berita"))
      .finally(() => setLoading(false));
  }, [params?.id]);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleTitleChange = (title: string) => {
    update("title", title);
    update("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  };

  const addVideo = () => setVideos((prev) => [...prev, ""]);
  const removeVideo = (idx: number) => {
    if (videos.length <= 1) return;
    setVideos(videos.filter((_, i) => i !== idx));
  };
  const updateVideoUrl = (idx: number, url: string) => {
    const next = [...videos];
    next[idx] = url;
    setVideos(next);
  };

  const handleSubmit = async (publish: boolean) => {
    if (savingRef.current) return;
    if (!form.title || !form.content) {
      setError("Judul dan konten harus diisi.");
      return;
    }
    const validVideos = videos.filter((v) => v.trim());
    setError("");
    setSaving(true);
    savingRef.current = true;

    try {
      await updateBerita(params?.id as string, {
        title: form.title,
        slug: form.slug,
        content: form.content,
        excerpt: form.excerpt || undefined,
        video_url: validVideos,
        author: form.author,
        is_published: publish,
        published_at: publish && !form.is_published ? new Date().toISOString() : undefined,
      });
      router.push("/admin/berita");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan berita");
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
        <button onClick={() => router.push("/admin/berita")} className="p-2 rounded-lg hover:bg-[#EBEAF6] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#4D455D]" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Berita</h1>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-[#EBEAF6]/60 border border-[#D9D7EC] rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Berita <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Konten <span className="text-red-500">*</span></label>
            <textarea
              rows={10}
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ringkasan (excerpt)</label>
            <textarea
              rows={3}
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900 resize-none"
            />
          </div>

          {/* VIDEOS */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-gray-700">Video <span className="text-gray-400 font-normal text-xs">(opsional)</span></label>
              <button type="button" onClick={addVideo} className="text-[#4D455D] hover:text-[#3d364a]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {videos.map((v, idx) => (
              <div key={idx} className="flex items-start gap-2 mb-2">
                <input
                  type="url"
                  value={v}
                  onChange={(e) => updateVideoUrl(idx, e.target.value)}
                  placeholder="https://youtube.com/watch?v=... atau https://drive.google.com/file/d/..."
                  className="flex-1 px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900"
                />
                <button type="button" onClick={() => removeVideo(idx)} className="text-red-400 hover:text-red-600 mt-3">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Penulis <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => update("author", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-medium">{error}</div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-gray-500 hover:bg-gray-600 rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Draft"}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Terbitkan"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/berita")}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
