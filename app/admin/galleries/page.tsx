"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import { getGalleries, deleteGallery, type Gallery } from "@/services/galleries";
import { transformImageUrl } from "@/lib/image";

export default function AdminGalleriesPage() {
  const router = useRouter();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getGalleries(999)
      .then(setGalleries)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus gambar ini?")) return;
    try {
      await deleteGallery(id);
      setGalleries((prev) => prev.filter((g) => g.id !== id));
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
        <div>
          <h1 className="text-3xl font-bold text-[#333333]">Dokumentasi</h1>
          <p className="text-sm text-gray-500 mt-1">Maksimal 15 gambar terbaru akan ditampilkan di slider hero & galeri tentang.</p>
        </div>
        <button onClick={() => router.push("/admin/galleries/tambah")} className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-xl transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Tambah Gambar
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleries.length === 0 ? (
          <div className="col-span-full bg-[#EBEAF6] border border-[#D9D7EC] rounded-2xl p-12 text-center text-sm text-gray-500">
            Belum ada dokumentasi.
          </div>
        ) : (
          galleries.map((g) => (
            <div key={g.id} className="group relative bg-white rounded-2xl border border-[#D9D7EC] overflow-hidden shadow-sm aspect-[4/3]">
              <img
                src={transformImageUrl(g.url)}
                alt="Dokumentasi"
                className="w-full h-full object-contain bg-gray-100"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E";
                  (e.currentTarget as HTMLImageElement).className = "w-full h-full object-contain p-4";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleDelete(g.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                <p className="text-[10px] text-white/80 truncate">{new Date(g.created_at).toLocaleDateString("id-ID")}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
