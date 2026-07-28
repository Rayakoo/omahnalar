"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Plus, X, Gavel, ClipboardList, CheckCircle, FileText, Image, Search } from "lucide-react";
import { getUnsolvedCase, createUnsolvedCase, updateUnsolvedCase } from "@/services/unsolvedCase";
import type { UnsolvedCase, UnsolvedCaseItem } from "@/types/unsolvedCase";
import FileUploader from "@/components/FileUploader";
import UnsolvedCaseHintsEditor from "./UnsolvedCaseHintsEditor";

type Props = {
  courseId: string;
  courseTitle: string;
};

export default function UnsolvedCaseEditor({ courseId, courseTitle }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unsolvedCase, setUnsolvedCase] = useState<UnsolvedCase | null>(null);
  const [title, setTitle] = useState(courseTitle);
  const [peraturan, setPeraturan] = useState<UnsolvedCaseItem[]>([]);
  const [instruksi, setInstruksi] = useState<UnsolvedCaseItem[]>([]);
  const [jawaban, setJawaban] = useState<UnsolvedCaseItem[]>([]);

  useEffect(() => {
    if (!courseId) return;
    getUnsolvedCase(courseId).then(async (data) => {
      if (data) {
        setUnsolvedCase(data);
        setTitle(data.title);
        setPeraturan(data.peraturan || []);
        setInstruksi(data.instruksi || []);
        setJawaban(data.jawaban || []);
      } else {
        const created = await createUnsolvedCase({
          course_id: courseId,
          title: courseTitle,
          peraturan: [],
          instruksi: [],
          jawaban: [],
        });
        setUnsolvedCase(created);
        setTitle(created.title);
        setPeraturan(created.peraturan || []);
        setInstruksi(created.instruksi || []);
        setJawaban(created.jawaban || []);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [courseId, courseTitle]);

  const addItem = (list: UnsolvedCaseItem[], setter: (v: UnsolvedCaseItem[]) => void, type: UnsolvedCaseItem["type"]) => {
    setter([...list, { type, content: "" }]);
  };

  const updateItem = (list: UnsolvedCaseItem[], setter: (v: UnsolvedCaseItem[]) => void, index: number, field: "type" | "content", value: string) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setter(updated);
  };

  const removeItem = (list: UnsolvedCaseItem[], setter: (v: UnsolvedCaseItem[]) => void, index: number) => {
    setter(list.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!unsolvedCase) return;
    setSaving(true);
    try {
      await updateUnsolvedCase(unsolvedCase.id, { title, peraturan, instruksi, jawaban });
      alert("Disimpan!");
    } catch {
      alert("Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-[#4D455D]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 mb-8">
      <h2 className="font-bold text-lg text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
        <Search className="w-5 h-5 text-[#4D455D]" /> Konten Unsolved Case
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Kasus</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masukkan judul kasus"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#9792EC] focus:border-transparent"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
            <Gavel className="w-4 h-4 text-red-600" /> Peraturan Permainan
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addItem(peraturan, setPeraturan, "text")}
              className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3 h-3" /> Tambah Teks
            </button>
            <button
              type="button"
              onClick={() => addItem(peraturan, setPeraturan, "image")}
              className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-3 h-3" /> Tambah Gambar
            </button>
          </div>
        </div>
        {peraturan.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Belum ada peraturan.</p>
        ) : (
          <div className="space-y-2">
            {peraturan.map((item, i) => (
              <div key={i} className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <span className="w-6 h-6 rounded-full bg-[#4D455D] text-xs font-bold text-white flex items-center justify-center shrink-0 mt-1">
                  {i + 1}
                </span>
                {item.type === "text" ? (
                  <textarea
                    value={item.content}
                    onChange={(e) => updateItem(peraturan, setPeraturan, i, "content", e.target.value)}
                    placeholder="Tulis peraturan..."
                    rows={2}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#9792EC] focus:border-transparent resize-none"
                  />
                ) : (
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Image className="w-3 h-3" /> Gambar
                      </span>
                      <input
                        type="url"
                        value={item.content}
                        onChange={(e) => updateItem(peraturan, setPeraturan, i, "content", e.target.value)}
                        placeholder="https://example.com/gambar.jpg"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#9792EC] focus:border-transparent"
                      />
                      <FileUploader
                        accept="image/*"
                        label="Upload"
                        onUploadComplete={(url) => updateItem(peraturan, setPeraturan, i, "content", url)}
                      />
                    </div>
                    {item.content && (
                      <img
                        src={item.content}
                        alt={`Peraturan ${i + 1}`}
                        className="max-h-32 rounded border border-gray-200"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(peraturan, setPeraturan, i)}
                  className="text-red-500 hover:text-red-700 text-sm px-1 py-1 mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-purple-600" /> Instruksi
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addItem(instruksi, setInstruksi, "text")}
              className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3 h-3" /> Tambah Teks
            </button>
            <button
              type="button"
              onClick={() => addItem(instruksi, setInstruksi, "image")}
              className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-3 h-3" /> Tambah Gambar
            </button>
          </div>
        </div>
        {instruksi.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Belum ada instruksi.</p>
        ) : (
          <div className="space-y-2">
            {instruksi.map((item, i) => (
              <div key={i} className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-xs font-bold text-white flex items-center justify-center shrink-0 mt-1">
                  {i + 1}
                </span>
                {item.type === "text" ? (
                  <textarea
                    value={item.content}
                    onChange={(e) => updateItem(instruksi, setInstruksi, i, "content", e.target.value)}
                    placeholder="Tulis instruksi..."
                    rows={2}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#9792EC] focus:border-transparent resize-none"
                  />
                ) : (
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Image className="w-3 h-3" /> Gambar
                      </span>
                      <input
                        type="url"
                        value={item.content}
                        onChange={(e) => updateItem(instruksi, setInstruksi, i, "content", e.target.value)}
                        placeholder="https://example.com/gambar.jpg"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#9792EC] focus:border-transparent"
                      />
                      <FileUploader
                        accept="image/*"
                        label="Upload"
                        onUploadComplete={(url) => updateItem(instruksi, setInstruksi, i, "content", url)}
                      />
                    </div>
                    {item.content && (
                      <img
                        src={item.content}
                        alt={`Instruksi ${i + 1}`}
                        className="max-h-32 rounded border border-gray-200"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(instruksi, setInstruksi, i)}
                  className="text-red-500 hover:text-red-700 text-sm px-1 py-1 mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-gray-100" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" /> Kunci Jawaban
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => addItem(jawaban, setJawaban, "text")}
              className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3 h-3" /> Tambah Teks
            </button>
            <button
              type="button"
              onClick={() => addItem(jawaban, setJawaban, "image")}
              className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-3 h-3" /> Tambah Gambar
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400">Kunci jawaban hanya terlihat oleh admin, tidak ditampilkan ke publik.</p>
        {jawaban.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Belum ada kunci jawaban.</p>
        ) : (
          <div className="space-y-2">
            {jawaban.map((item, i) => (
              <div key={i} className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <span className="w-6 h-6 rounded-full bg-green-600 text-xs font-bold text-white flex items-center justify-center shrink-0 mt-1">
                  {i + 1}
                </span>
                {item.type === "text" ? (
                  <textarea
                    value={item.content}
                    onChange={(e) => updateItem(jawaban, setJawaban, i, "content", e.target.value)}
                    placeholder="Tulis jawaban..."
                    rows={2}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#9792EC] focus:border-transparent resize-none"
                  />
                ) : (
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Image className="w-3 h-3" /> Gambar
                      </span>
                      <input
                        type="url"
                        value={item.content}
                        onChange={(e) => updateItem(jawaban, setJawaban, i, "content", e.target.value)}
                        placeholder="https://example.com/gambar.jpg"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#9792EC] focus:border-transparent"
                      />
                      <FileUploader
                        accept="image/*"
                        label="Upload"
                        onUploadComplete={(url) => updateItem(jawaban, setJawaban, i, "content", url)}
                      />
                    </div>
                    {item.content && (
                      <img
                        src={item.content}
                        alt={`Jawaban ${i + 1}`}
                        className="max-h-32 rounded border border-gray-200"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(jawaban, setJawaban, i)}
                  className="text-red-500 hover:text-red-700 text-sm px-1 py-1 mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 bg-[#4D455D] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#3d364a] transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Menyimpan..." : "Simpan Konten Unsolved Case"}
        </button>
      </div>

      {unsolvedCase && <UnsolvedCaseHintsEditor unsolvedCaseId={unsolvedCase.id} />}
    </div>
  );
}
