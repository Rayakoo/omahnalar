"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { createProgram } from "@/services/programs";

type ImageInput = { url: string; is_thumbnail: boolean };

export default function TambahProgram() {
  const router = useRouter();

  const [form, setForm] = useState({
    slug: "",
    title: "",
    tag: "",
    periodStart: "",
    periodEnd: "",
    location: "",
    tagline: "",
  });
  const [descriptions, setDescriptions] = useState<string[]>([""]);
  const [target, setTarget] = useState<string[]>([""]);
  const [goals, setGoals] = useState<string[]>([""]);
  const [images, setImages] = useState<ImageInput[]>([{ url: "", is_thumbnail: true }]);
  const [videos, setVideos] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const savingRef = useRef(false);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleTitleChange = (title: string) => {
    update("title", title);
    update("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  };

  const addArrayItem = (arr: string[], setter: (v: string[]) => void) => setter([...arr, ""]);
  const removeArrayItem = (arr: string[], setter: (v: string[]) => void, idx: number) => {
    if (arr.length <= 1) return;
    setter(arr.filter((_, i) => i !== idx));
  };
  const updateArrayItem = (arr: string[], setter: (v: string[]) => void, idx: number, val: string) => {
    const next = [...arr];
    next[idx] = val;
    setter(next);
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

  const doSave = async () => {
    if (savingRef.current) return;
    if (!form.title || !form.tag || !form.tagline || !form.periodStart || !form.periodEnd || !form.location) {
      setError("Judul, tag, tagline, tanggal mulai, tanggal selesai, dan lokasi harus diisi.");
      return;
    }
    const validImages = images.filter((i) => i.url.trim());
    const validVideos = videos.filter((v) => v.trim());
    console.log("[TambahProgram] validImages:", JSON.stringify(validImages, null, 2));
    setError("");
    setSaving(true);
    savingRef.current = true;

    try {
      console.log("[TambahProgram] calling createProgram...");
      const program = await createProgram({
        slug: form.slug,
        title: form.title,
        tag: form.tag,
        period: `${form.periodStart} - ${form.periodEnd}`,
        location: form.location,
        image_url: validImages,
        video_url: validVideos,
        tagline: form.tagline,
        descriptions: descriptions.filter(Boolean),
        target: target.filter(Boolean),
        goals: goals.filter(Boolean),
      });
      console.log("[TambahProgram] createProgram success:", program);
      if (program) router.push("/admin/programs");
    } catch (err) {
      console.error("[TambahProgram] createProgram error:", err);
      setError(err instanceof Error ? err.message : "Gagal menyimpan program");
    } finally {
      console.log("[TambahProgram] finally block");
      setSaving(false);
      savingRef.current = false;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.push("/admin/programs")} className="p-2 rounded-lg hover:bg-[#EBEAF6] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#4D455D]" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Program</h1>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-[#EBEAF6]/60 border border-[#D9D7EC] rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Program <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Masukkan judul program"
              className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tag <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.tag}
                onChange={(e) => update("tag", e.target.value)}
                placeholder="Contoh: Event Edukasi, Pelatihan"
                className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Mulai <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={form.periodStart}
                onChange={(e) => update("periodStart", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Selesai <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={form.periodEnd}
                onChange={(e) => update("periodEnd", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Lokasi <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Contoh: Jawa Timur"
                className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tagline <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              placeholder="Kalimat singkat tentang program"
              className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900"
            />
          </div>

          {/* IMAGES */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-gray-700">Gambar <span className="text-red-500">*</span></label>
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
                <button type="button" onClick={() => removeVideo(idx)} className="text-red-400 hover:text-red-600 mt-3">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* DESCRIPTIONS */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-gray-700">Deskripsi <span className="text-gray-400 font-normal text-xs">(opsional)</span></label>
              <button type="button" onClick={() => addArrayItem(descriptions, setDescriptions)} className="text-[#4D455D] hover:text-[#3d364a]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {descriptions.map((d, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <textarea
                  rows={2}
                  value={d}
                  onChange={(e) => updateArrayItem(descriptions, setDescriptions, idx, e.target.value)}
                  placeholder={`Paragraf deskripsi ${idx + 1}`}
                  className="flex-1 px-4 py-2 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900 resize-none"
                />
                <button type="button" onClick={() => removeArrayItem(descriptions, setDescriptions, idx)} className="text-red-400 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* TARGET */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-gray-700">Target Peserta <span className="text-gray-400 font-normal text-xs">(opsional)</span></label>
              <button type="button" onClick={() => addArrayItem(target, setTarget)} className="text-[#4D455D] hover:text-[#3d364a]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {target.map((t, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={t}
                  onChange={(e) => updateArrayItem(target, setTarget, idx, e.target.value)}
                  placeholder={`Target ${idx + 1}`}
                  className="flex-1 px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900"
                />
                <button type="button" onClick={() => removeArrayItem(target, setTarget, idx)} className="text-red-400 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* GOALS */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-semibold text-gray-700">Tujuan <span className="text-gray-400 font-normal text-xs">(opsional)</span></label>
              <button type="button" onClick={() => addArrayItem(goals, setGoals)} className="text-[#4D455D] hover:text-[#3d364a]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {goals.map((g, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={g}
                  onChange={(e) => updateArrayItem(goals, setGoals, idx, e.target.value)}
                  placeholder={`Tujuan ${idx + 1}`}
                  className="flex-1 px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900"
                />
                <button type="button" onClick={() => removeArrayItem(goals, setGoals, idx)} className="text-red-400 hover:text-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
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
            className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Program"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/programs")}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
