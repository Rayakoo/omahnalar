"use client";

import { useState, useEffect } from "react";
import { Trash2, Clock, Target, XCircle } from "lucide-react";
import { getMinigameResults, deleteMinigameResult, getMinigameName, formatTimeMs, type MinigameResultRow } from "@/services/minigames";
import { getAccessToken } from "@/lib/supabaseClient";

function getAttemptCounts(rows: MinigameResultRow[]) {
  const counts: Record<string, number> = {};
  for (const r of rows) {
    if (!counts[r.player_name]) counts[r.player_name] = 0;
    counts[r.player_name]++;
  }
  return counts;
}

const MINIGAME_COLORS: Record<string, string> = {
  tts: "#FAC775",
  "mitos-atau-fakta": "#7C78A8",
  puzzle: "#6BBF8A",
};

export default function AdminMinigamesPage() {
  const [rows, setRows] = useState<MinigameResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | string>("all");

  useEffect(() => {
    getMinigameResults()
      .then(setRows)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const gameTypes = ["all", "tts", "mitos-atau-fakta", "puzzle"];
  const filtered = filter === "all" ? rows : rows.filter((r) => r.minigame === filter);
  const attemptCounts = getAttemptCounts(filtered);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Yakin hapus hasil "${name}"?`)) return;
    try {
      const token = getAccessToken();
      await deleteMinigameResult(id, token);
      setRows((prev) => prev.filter((r) => r.id !== id));
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

  const totalPemainUnik = new Set(filtered.map((r) => r.player_name)).size;
  const avgScore = filtered.length > 0
    ? Math.round(filtered.reduce((s, r) => s + r.score, 0) / filtered.length)
    : 0;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#333333]">Hasil Minigames</h1>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Permainan", value: filtered.length, bg: "#EBEAF6", color: "#4D455D" },
          { label: "Pemain Unik", value: totalPemainUnik, bg: "#E5F7F4", color: "#10A37F" },
          { label: "Rata-rata Skor", value: `${avgScore}%`, bg: "#FEF2DC", color: "#E2A955" },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-2xl shadow-sm" style={{ background: stat.bg }}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4">
        {gameTypes.map((g) => {
          const label = g === "all" ? "Semua" : getMinigameName(g);
          const count = g === "all" ? rows.length : rows.filter((r) => r.minigame === g).length;
          return (
            <button
              key={g}
              onClick={() => setFilter(g)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === g ? "bg-[#4D455D] text-white" : "bg-[#EBEAF6] text-[#4D455D] hover:bg-[#D9D7EC]"
              }`}
            >
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
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Nama Pemain</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Minigame</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider">Percobaan</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider text-center">Skor</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider text-center">Salah</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider text-center">Waktu</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider text-center">Tanggal</th>
                <th className="p-5 text-sm font-bold text-[#333333] tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1DFEF]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-gray-500">Belum ada data hasil minigames.</td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const attempts = attemptCounts[r.player_name];
                  return (
                    <tr key={r.id} className="hover:bg-[#E4E2F2]/50 transition-colors">
                      <td className="p-5 text-sm font-medium text-[#4D4D4D]">{r.player_name}</td>
                      <td className="p-5">
                        <span
                          className="inline-block px-3 py-1 text-xs font-bold text-white rounded-full shadow-sm"
                          style={{ background: MINIGAME_COLORS[r.minigame] || "#4D455D" }}
                        >
                          {getMinigameName(r.minigame)}
                        </span>
                      </td>
                      <td className="p-5 text-sm font-semibold text-[#4D455D]">
                        {attempts > 1 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700">
                            #{attempts} ×
                          </span>
                        ) : (
                          <span className="text-gray-400">1</span>
                        )}
                      </td>
                      <td className="p-5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-[#4D455D]" />
                          <span className={`text-sm font-bold ${r.score >= 60 ? "text-[#10A37F]" : r.score >= 40 ? "text-[#E2A955]" : "text-[#D3455B]"}`}>
                            {r.score}%
                          </span>
                          <span className="text-xs text-gray-400">({r.score > 0 ? Math.round(r.score * r.total / 100) : 0}/{r.total})</span>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-[#D3455B]" />
                          <span className="text-sm font-semibold text-[#D3455B]">{r.wrong}</span>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm font-medium text-[#4D4D4D]">{formatTimeMs(r.time_ms)}</span>
                        </div>
                      </td>
                      <td className="p-5 text-center text-sm text-gray-400">
                        {new Date(r.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => handleDelete(r.id, r.player_name)}
                          className="p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
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
