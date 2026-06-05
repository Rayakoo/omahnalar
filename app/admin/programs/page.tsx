"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { getPrograms, deleteProgram, type Program } from "@/services/programs";

export default function AdminProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrograms()
      .then(setPrograms)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus program "${title}"?`)) return;
    try {
      await deleteProgram(id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
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
        <h1 className="text-3xl font-bold text-[#333333]">Kelola Program</h1>
        <button onClick={() => router.push("/admin/programs/tambah")} className="px-5 py-2 text-sm font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-xl transition-colors shadow-sm">
          + Tambah Program
        </button>
      </div>
      <div className="bg-[#EBEAF6] border border-[#D9D7EC] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D9D7EC]">
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Judul</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Tag</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Lokasi</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1DFEF]">
              {programs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm text-gray-500">Belum ada program.</td>
                </tr>
              ) : (
                programs.map((p) => (
                  <tr key={p.id} className="hover:bg-[#E4E2F2]/50 transition-colors">
                    <td className="p-5 text-sm font-medium text-[#4D4D4D]">{p.title}</td>
                    <td className="p-5 text-sm font-medium text-[#4D4D4D]">{p.tag}</td>
                    <td className="p-5 text-sm font-medium text-[#4D4D4D]">{p.location}</td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => router.push(`/admin/programs/edit/${p.id}`)} className="px-4 py-1.5 text-xs font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-lg transition-colors shadow-sm">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p.id, p.title)} className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors" title="Hapus">
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
