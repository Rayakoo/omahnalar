"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { createGallery } from "@/services/galleries";
import { transformImageUrl } from "@/lib/image";

export default function TambahGalleries() {
  const router = useRouter();
  const savingRef = useRef(false);

  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (savingRef.current) return;
    if (!url.trim()) {
      setError("URL gambar harus diisi.");
      return;
    }
    setError("");
    setSaving(true);
    savingRef.current = true;

    try {
      await createGallery(url.trim());
      router.push("/admin/galleries");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.push("/admin/galleries")} className="p-2 rounded-lg hover:bg-[#EBEAF6] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#4D455D]" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Dokumentasi</h1>
      </div>

      <div className="max-w-xl space-y-6">
        <div className="bg-[#EBEAF6]/60 border border-[#D9D7EC] rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">URL Gambar <span className="text-red-500">*</span></label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/... atau https://example.com/gambar.jpg"
              className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900"
            />
            <p className="text-[10px] text-gray-400 mt-1">Gunakan link Google Drive atau URL gambar langsung.</p>
          </div>

          {url && (
            <div className="rounded-xl overflow-hidden bg-gray-100 border border-[#D9D7EC]">
              <img
                src={transformImageUrl(url)}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-medium">{error}</div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/galleries")}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
