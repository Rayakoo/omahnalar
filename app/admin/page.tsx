"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllReports, type Report } from "@/services/reports";

function statusStyle(status: string) {
  switch (status) {
    case "pending": return { label: "Baru", bg: "bg-[#D3455B]" };
    case "in_progress": return { label: "Diproses", bg: "bg-[#E2A955]" };
    case "resolved":
    case "closed": return { label: "Selesai", bg: "bg-[#10A37F]" };
    default: return { label: status, bg: "bg-gray-400" };
  }
}

const FILTERS = [
  { key: null, label: "Semua Laporan" },
  { key: "pending", label: "Baru" },
  { key: "in_progress", label: "Diproses" },
  { key: "resolved", label: "Selesai" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    getAllReports()
      .then(setReports)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterStatus
    ? reports.filter((r) => filterStatus === "resolved" ? (r.status === "resolved" || r.status === "closed") : r.status === filterStatus)
    : reports;

  const baru = reports.filter((r) => r.status === "pending").length;
  const diproses = reports.filter((r) => r.status === "in_progress").length;
  const selesai = reports.filter((r) => r.status === "resolved" || r.status === "closed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-[#333333] mb-8">Laporan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 max-w-2xl">
        <button onClick={() => setFilterStatus("pending")} className={`rounded-2xl p-6 text-center shadow-sm border transition-all ${
          filterStatus === "pending" ? "bg-[#FCEBF3] border-[#D3455B] ring-2 ring-[#D3455B]/30" : "bg-[#FCEBF3] border-[#F5D1E3] hover:opacity-80"
        }`}>
          <span className="block text-4xl font-extrabold text-[#333333] mb-1">{baru}</span>
          <span className="text-sm font-medium text-gray-600">Baru</span>
        </button>
        <button onClick={() => setFilterStatus("in_progress")} className={`rounded-2xl p-6 text-center shadow-sm border transition-all ${
          filterStatus === "in_progress" ? "bg-[#FEF2DC] border-[#E2A955] ring-2 ring-[#E2A955]/30" : "bg-[#FEF2DC] border-[#FADFA9] hover:opacity-80"
        }`}>
          <span className="block text-4xl font-extrabold text-[#333333] mb-1">{diproses}</span>
          <span className="text-sm font-medium text-gray-600">Diproses</span>
        </button>
        <button onClick={() => setFilterStatus("resolved")} className={`rounded-2xl p-6 text-center shadow-sm border transition-all ${
          filterStatus === "resolved" ? "bg-[#E5F7F4] border-[#10A37F] ring-2 ring-[#10A37F]/30" : "bg-[#E5F7F4] border-[#C6EDE6] hover:opacity-80"
        }`}>
          <span className="block text-4xl font-extrabold text-[#333333] mb-1">{selesai}</span>
          <span className="text-sm font-medium text-gray-600">Selesai</span>
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.key || "all"}
            onClick={() => setFilterStatus(f.key)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              filterStatus === f.key
                ? "bg-[#4D455D] text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-[#EBEAF6] border border-[#D9D7EC] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D9D7EC]">
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider w-1/5">ID Laporan</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider w-1/4">Kategori</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider w-1/4">Tanggal</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider text-center w-1/6">Status</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider text-center w-1/6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1DFEF]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-gray-500">Tidak ada laporan.</td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const st = statusStyle(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-[#E4E2F2]/50 transition-colors">
                      <td className="p-5 text-sm font-medium text-[#4D4D4D]">{item.ticket_id}</td>
                      <td className="p-5 text-sm font-medium text-[#4D4D4D]">{item.category || "-"}</td>
                      <td className="p-5 text-sm font-medium text-[#4D4D4D]">
                        {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </td>
                      <td className="p-5 text-center">
                        <span className={`inline-block px-4 py-1 text-xs font-bold text-white rounded-full ${st.bg} shadow-sm min-w-[80px]`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => router.push(`/admin/laporan/${item.id}`)}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-lg transition-colors shadow-sm"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
