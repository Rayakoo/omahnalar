"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getBerita, deleteBerita, type Berita } from "@/services/berita";

export default function AdminBeritaPage() {
  const router = useRouter();
  const [berita, setBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    getBerita(true)
      .then(setBerita)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayed = berita.filter((b) => {
    if (filter === "published") return b.is_published === true;
    if (filter === "draft") return b.is_published === false;
    return true;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus berita "${title}"?`)) return;
    try {
      await deleteBerita(id);
      setBerita((prev) => prev.filter((b) => b.id !== id));
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
        <h1 className="text-3xl font-bold text-[#333333]">Kelola Berita</h1>
        <button onClick={() => router.push("/admin/berita/tambah")} className="px-5 py-2 text-sm font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-xl transition-colors shadow-sm">
          + Tambah Berita
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {(["all", "published", "draft"] as const).map((f) => {
          const label = f === "all" ? "Semua Berita" : f === "published" ? "Terbit" : "Draft";
          const count = f === "all" ? berita.length : f === "published" ? berita.filter((b) => b.is_published).length : berita.filter((b) => !b.is_published).length;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === f ? "bg-[#4D455D] text-white" : "bg-[#EBEAF6] text-[#4D455D] hover:bg-[#D9D7EC]"
              }`}>
              {label} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-[#EBEAF6] border border-[#D9D7EC] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D9D7EC]">
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Judul</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Penulis</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Status</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1DFEF]">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm text-gray-500">Belum ada berita.</td>
                </tr>
              ) : (
                displayed.map((b) => (
                  <tr key={b.id} className="hover:bg-[#E4E2F2]/50 transition-colors">
                    <td className="p-5 text-sm font-medium text-[#4D4D4D]">{b.title}</td>
                    <td className="p-5 text-sm font-medium text-[#4D4D4D]">{b.author}</td>
                    <td className="p-5">
                      <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full shadow-sm ${
                        b.is_published ? "bg-[#10A37F]" : "bg-[#E2A955]"
                      }`}>
                        {b.is_published ? "Terbit" : "Draft"}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => router.push(`/admin/berita/edit/${b.id}`)} className="px-4 py-1.5 text-xs font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-lg transition-colors shadow-sm">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(b.id, b.title)} className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
