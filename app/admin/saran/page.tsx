"use client";

import { useEffect, useState } from "react";
import { Check, Clock, MessageSquareText, Trash2, X } from "lucide-react";
import {
  deleteSuggestion,
  getAllSuggestions,
  updateSuggestionStatus,
  type Suggestion,
  type SuggestionStatus,
} from "@/services/suggestions";

function statusStyle(status: SuggestionStatus) {
  switch (status) {
    case "pending":
      return { label: "Menunggu", bg: "bg-[#E2A955]" };
    case "approved":
      return { label: "Ditampilkan", bg: "bg-[#10A37F]" };
    case "rejected":
      return { label: "Ditolak", bg: "bg-[#D3455B]" };
    default:
      return { label: status, bg: "bg-gray-400" };
  }
}

const FILTERS: { key: SuggestionStatus | null; label: string }[] = [
  { key: null, label: "Semua Saran" },
  { key: "pending", label: "Menunggu" },
  { key: "approved", label: "Ditampilkan" },
  { key: "rejected", label: "Ditolak" },
];

export default function AdminSaranPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SuggestionStatus | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getAllSuggestions()
      .then((data) => {
        if (active) setSuggestions(data);
      })
      .catch((err) => {
        console.error(err);
        if (active) {
          setError("Gagal memuat saran. Pastikan tabel suggestions sudah dibuat.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleStatus = async (id: string, status: SuggestionStatus) => {
    setUpdating(id);
    setError("");
    try {
      const updated = await updateSuggestionStatus(id, status);
      setSuggestions((prev) =>
        prev.map((item) => (item.id === id ? updated : item)),
      );
    } catch (err) {
      console.error(err);
      setError("Gagal memperbarui status saran.");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (item: Suggestion) => {
    if (
      !window.confirm(
        `Hapus saran dari "${item.name}"? Tindakan ini tidak bisa dibatalkan.`,
      )
    ) {
      return;
    }

    setUpdating(item.id);
    setError("");
    try {
      await deleteSuggestion(item.id);
      setSuggestions((prev) => prev.filter((s) => s.id !== item.id));
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus saran.");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter
    ? suggestions.filter((item) => item.status === filter)
    : suggestions;

  const pending = suggestions.filter((s) => s.status === "pending").length;
  const approved = suggestions.filter((s) => s.status === "approved").length;
  const rejected = suggestions.filter((s) => s.status === "rejected").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#333333]">Saran</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tinjau saran dari pengunjung sebelum ditampilkan di halaman /saran.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 max-w-2xl">
        <button
          onClick={() => setFilter("pending")}
          className={`rounded-2xl p-6 text-center shadow-sm border transition-all ${
            filter === "pending"
              ? "bg-[#FEF2DC] border-[#E2A955] ring-2 ring-[#E2A955]/30"
              : "bg-[#FEF2DC] border-[#FADFA9] hover:opacity-80"
          }`}
        >
          <span className="block text-4xl font-extrabold text-[#333333] mb-1">
            {pending}
          </span>
          <span className="text-sm font-medium text-gray-600">Menunggu</span>
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`rounded-2xl p-6 text-center shadow-sm border transition-all ${
            filter === "approved"
              ? "bg-[#E5F7F4] border-[#10A37F] ring-2 ring-[#10A37F]/30"
              : "bg-[#E5F7F4] border-[#C6EDE6] hover:opacity-80"
          }`}
        >
          <span className="block text-4xl font-extrabold text-[#333333] mb-1">
            {approved}
          </span>
          <span className="text-sm font-medium text-gray-600">Ditampilkan</span>
        </button>
        <button
          onClick={() => setFilter("rejected")}
          className={`rounded-2xl p-6 text-center shadow-sm border transition-all ${
            filter === "rejected"
              ? "bg-[#FCEBF3] border-[#D3455B] ring-2 ring-[#D3455B]/30"
              : "bg-[#FCEBF3] border-[#F5D1E3] hover:opacity-80"
          }`}
        >
          <span className="block text-4xl font-extrabold text-[#333333] mb-1">
            {rejected}
          </span>
          <span className="text-sm font-medium text-gray-600">Ditolak</span>
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.key || "all"}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              filter === f.key
                ? "bg-[#4D455D] text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="bg-[#EBEAF6] border border-[#D9D7EC] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D9D7EC]">
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">
                  Pengirim
                </th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">
                  Kategori
                </th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">
                  Saran
                </th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">
                  Tanggal
                </th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider text-center">
                  Status
                </th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1DFEF]">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-sm text-gray-500"
                  >
                    Tidak ada saran.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const st = statusStyle(item.status);
                  const busy = updating === item.id;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#E4E2F2]/50 transition-colors align-top"
                    >
                      <td className="p-5 text-sm font-medium text-[#4D4D4D]">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4D455D] text-xs font-bold text-white">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            {item.is_anonymous && (
                              <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                Anonim
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-sm font-medium text-[#4D4D4D]">
                        <span className="inline-block rounded-full bg-[#FCD34D] px-3 py-1 text-xs font-bold text-[#3A2E5A]">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-5 text-sm text-[#4D4D4D] max-w-md">
                        <p className="line-clamp-3 whitespace-pre-line">
                          {item.content}
                        </p>
                      </td>
                      <td className="p-5 text-sm font-medium text-[#4D4D4D] whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-5 text-center">
                        <span
                          className={`inline-block px-4 py-1 text-xs font-bold text-white rounded-full shadow-sm min-w-[90px] ${st.bg}`}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-2">
                          {item.status !== "approved" && (
                            <button
                              onClick={() => handleStatus(item.id, "approved")}
                              disabled={busy}
                              title="Setujui & tampilkan"
                              className="inline-flex items-center gap-1 rounded-lg bg-[#10A37F] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#0c8467] disabled:opacity-50"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Setujui
                            </button>
                          )}
                          {item.status !== "rejected" && (
                            <button
                              onClick={() => handleStatus(item.id, "rejected")}
                              disabled={busy}
                              title="Tolak"
                              className="inline-flex items-center gap-1 rounded-lg bg-[#E2A955] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#c98f3e] disabled:opacity-50"
                            >
                              <X className="h-3.5 w-3.5" />
                              Tolak
                            </button>
                          )}
                          {item.status === "rejected" && (
                            <button
                              onClick={() => handleStatus(item.id, "pending")}
                              disabled={busy}
                              title="Kembalikan ke menunggu"
                              className="inline-flex items-center gap-1 rounded-lg bg-[#4D455D] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#3d364a] disabled:opacity-50"
                            >
                              <Clock className="h-3.5 w-3.5" />
                              Menunggu
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item)}
                            disabled={busy}
                            title="Hapus"
                            className="inline-flex items-center gap-1 rounded-lg bg-[#D3455B] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#b33549] disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <MessageSquareText className="h-4 w-4" />
        Total {suggestions.length} saran tersimpan.
      </p>
    </>
  );
}
