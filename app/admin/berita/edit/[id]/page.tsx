"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { getBeritaById, updateBerita, type Berita } from "@/services/berita";
import FileUploader from "@/components/FileUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";

type ImageInput = { url: string; is_thumbnail: boolean };

export default function EditBerita() {
  const router = useRouter();
  const params = useParams();
  const savingRef = useRef(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    kategori: "Artikel",
    author: "",
    is_published: false,
  });
  const [images, setImages] = useState<ImageInput[]>([{ url: "", is_thumbnail: true }]);
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
          kategori: b.kategori || "Artikel",
          author: b.author,
          is_published: b.is_published,
        });
        setImages(b.image_url?.length > 0 ? b.image_url : [{ url: "", is_thumbnail: true }]);
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

  const addImage = () => setImages((prev) => [...prev, { url: "", is_thumbnail: false }]);
  const removeImage = (idx: number) => {
    if (images.length <= 1) return;
    const next = images.filter((_, i) => i !== idx);
    if (images[idx].is_thumbnail && next.length > 0) next[0].is_thumbnail = true;
    setImages(next);
  };
  const updateImageUrl = (idx: number, url: string) => {
    const next = [...images];
    next[idx].url = url;
    setImages(next);
  };
  const setImageAsThumbnail = (idx: number) => {
    const next = images.map((img, i) => ({ ...img, is_thumbnail: i === idx }));
    setImages(next);
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
    const validVideos = videos.map((v) => v.replace(/["']/g, "").trim()).filter(Boolean);
    const validImages = images.filter((img) => img.url.trim());
    setError("");
    setSaving(true);
    savingRef.current = true;

    try {
      await updateBerita(params?.id as string, {
        title: form.title,
        slug: form.slug,
        content: form.content,
        excerpt: form.excerpt || undefined,
        kategori: form.kategori,
        image_url: validImages,
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
            <RichTextEditor
              value={form.content}
              onChange={(v) => update("content", v)}
              placeholder="Tulis konten berita di sini..."
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

          {/* KATEGORI */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
            <div className="flex gap-4">
              {["Artikel", "Berita"].map((kat) => (
                <label
                  key={kat}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                    form.kategori === kat
                      ? "border-[#4D455D] bg-[#EBEAF6] text-[#4D455D]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#4D455D]"
                  }`}
                >
                  <input
                    type="radio"
                    name="kategori"
                    value={kat}
                    checked={form.kategori === kat}
                    onChange={(e) => update("kategori", e.target.value)}
                    className="sr-only"
                  />
                  {kat}
                </label>
              ))}
            </div>
          </div>

          {/* IMAGES */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-gray-700">Gambar</label>
              <button type="button" onClick={addImage} className="text-[#4D455D] hover:text-[#3d364a]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {images.map((img, idx) => (
              <div key={idx} className="flex items-start gap-2 mb-2">
                <input
                  type="url"
                  value={img.url}
                  onChange={(e) => updateImageUrl(idx, e.target.value)}
                  placeholder="https://example.com/gambar.jpg"
                  className="flex-1 px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900"
                />
                <FileUploader onUploadComplete={(url) => updateImageUrl(idx, url)} />
                <button
                  type="button"
                  onClick={() => setImageAsThumbnail(idx)}
                  className={`shrink-0 px-2.5 py-3 rounded-xl text-xs font-bold transition-colors ${
                    img.is_thumbnail ? "bg-[#4D455D] text-white" : "bg-white border border-[#D9D7EC] text-gray-500 hover:border-[#4D455D]"
                  }`}
                  title="Jadikan thumbnail"
                >
                  {img.is_thumbnail ? "Thumbnail" : "Thumbnail?"}
                </button>
                <button type="button" onClick={() => removeImage(idx)} className="text-red-400 hover:text-red-600 mt-3">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <p className="text-[10px] text-gray-400 mt-1">Gambar pertama akan otomatis jadi thumbnail.</p>
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
                <FileUploader onUploadComplete={(url) => updateVideoUrl(idx, url)} accept="video/*" label="Upload Video" />
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
