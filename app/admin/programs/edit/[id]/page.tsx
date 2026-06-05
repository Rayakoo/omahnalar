"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { getProgramById, updateProgram, type Program } from "@/services/programs";

export default function EditProgram() {
  const router = useRouter();
  const params = useParams();
  const savingRef = useRef(false);

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = params?.id as string;
    if (!id) return;
    getProgramById(id)
      .then((p: Program) => {
        const parts = p.period.split(" - ");
        setForm({
          slug: p.slug,
          title: p.title,
          tag: p.tag,
          periodStart: parts[0] || "",
          periodEnd: parts[1] || "",
          location: p.location,
          tagline: p.tagline,
        });
        setDescriptions(p.descriptions.length > 0 ? p.descriptions : [""]);
        setTarget(p.target.length > 0 ? p.target : [""]);
        setGoals(p.goals.length > 0 ? p.goals : [""]);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Gagal memuat program"))
      .finally(() => setLoading(false));
  }, [params?.id]);

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

  const doSave = async () => {
    if (savingRef.current) return;
    if (!form.title || !form.tag || !form.tagline || !form.periodStart || !form.periodEnd || !form.location) {
      setError("Judul, tag, tagline, tanggal mulai, tanggal selesai, dan lokasi harus diisi.");
      return;
    }
    setError("");
    setSaving(true);
    savingRef.current = true;

    try {
      await updateProgram(params?.id as string, {
        slug: form.slug,
        title: form.title,
        tag: form.tag,
        period: `${form.periodStart} - ${form.periodEnd}`,
        location: form.location,
        tagline: form.tagline,
        descriptions: descriptions.filter(Boolean),
        target: target.filter(Boolean),
        goals: goals.filter(Boolean),
      });
      router.push("/admin/programs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan program");
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
        <button onClick={() => router.push("/admin/programs")} className="p-2 rounded-lg hover:bg-[#EBEAF6] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#4D455D]" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Program</h1>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-[#EBEAF6]/60 border border-[#D9D7EC] rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Program <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tag <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.tag}
                onChange={(e) => update("tag", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
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
                className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tagline <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-gray-900"
            />
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
            className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
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
