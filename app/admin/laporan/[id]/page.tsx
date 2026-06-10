"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, Paperclip, Image as ImageIcon, Send, MessageSquare, BarChart3 } from "lucide-react";
import { getReportById, getReportLogs, getConversations, addConversationMessage, addReportLog, updateReport, type Report, type ReportLog, type ReportConversation } from "@/services/reports";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_LIST = [
  { key: "pending", label: "Menunggu", color: "bg-[#D3455B]" },
  { key: "in_progress", label: "Diproses", color: "bg-[#E2A955]" },
  { key: "resolved", label: "Selesai", color: "bg-[#10A37F]" },
];

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "Menunggu", color: "bg-red-100 text-red-700" },
  in_progress: { label: "Diproses", color: "bg-amber-100 text-amber-700" },
  resolved: { label: "Selesai", color: "bg-green-100 text-green-700" },
  closed: { label: "Ditutup", color: "bg-gray-100 text-gray-600" },
};

const CATEGORY_OPTIONS = [
  "Kekerasan fisik",
  "Kekerasan Psikis/emosional",
  "Kekerasan seksual",
  "Kekerasan verbal",
  "KDRT",
  "Diskriminasi",
  "Bullying",
  "Kekerasan digital",
  "Lainnya",
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminDetailLaporan() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;
  const { user } = useAuth();

  const [report, setReport] = useState<Report | null>(null);
  const [logs, setLogs] = useState<ReportLog[]>([]);
  const [conversations, setConversations] = useState<ReportConversation[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadDetail = async () => {
    if (!reportId) return;
    setLoading(true);
    try {
      const r = await getReportById(reportId);
      setReport(r);
      const [l, c] = await Promise.all([
        getReportLogs(r.id),
        getConversations(r.id),
      ]);
      setLogs(l);
      setConversations(c);
    } catch {
      // not found
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  const handleSaveStatus = async () => {
    if (!report || !selectedStatus) return;
    setUpdatingStatus(true);
    try {
      await updateReport(report.id, { status: selectedStatus as Report["status"] });
      const statusLabel = STATUS_LIST.find((s) => s.key === selectedStatus)?.label || selectedStatus;
      await addReportLog({
        report_id: report.id,
        action: `laporan ${statusLabel.toLowerCase()}`,
        description: statusNote || `Status diubah ke ${statusLabel}`,
        created_by: user?.user_metadata?.full_name || user?.email || "Admin",
      });
      setSelectedStatus(null);
      setStatusNote("");
      await loadDetail();
    } catch (err) {
      console.error("Gagal update status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSetCategory = async (category: string) => {
    if (!report) return;
    if (!window.confirm(`Apakah anda yakin laporan ini termasuk kategori "${category}"?`)) return;
    try {
      await updateReport(report.id, { category });
      await addReportLog({
        report_id: report.id,
        action: "category_set",
        description: `Kategori ditetapkan: ${category}`,
        created_by: user?.user_metadata?.full_name || user?.email || "Admin",
      });
      await loadDetail();
    } catch (err) {
      console.error("Gagal set kategori:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !report) return;
    setSending(true);
    try {
      const msg = await addConversationMessage({
        report_id: report.id,
        sender: "admin",
        message: newMessage.trim(),
      });
      setConversations((prev) => [...prev, msg]);
      setNewMessage("");
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#FFFDF6] flex items-center justify-center gap-4 p-6">
        <p className="text-sm text-gray-500">Laporan tidak ditemukan.</p>
        <button onClick={() => router.push("/admin")} className="px-4 py-2 bg-[#4D455D] text-white text-xs font-semibold rounded-lg hover:bg-[#3d364a] transition-colors">
          Kembali
        </button>
      </div>
    );
  }

  const status = STATUS_MAP[report.status] || STATUS_MAP.pending;

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.push("/admin")} className="p-2 rounded-lg hover:bg-[#EBEAF6] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#4D455D]" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Detail Laporan</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: REPORT CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* META INFO */}
            <div className="bg-[#EBEAF6]/60 border border-[#D9D7EC] rounded-2xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">ID Laporan</span>
                <span className="font-semibold text-gray-900">{report.ticket_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Status saat ini</span>
                <span className={`px-3 py-0.5 text-xs font-bold rounded-full ${status.color}`}>{status.label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Tanggal laporan masuk</span>
                <span className="font-medium text-gray-900">{formatDate(report.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Tanggal kejadian</span>
                <span className="font-medium text-gray-900">{formatDate(report.date)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Lokasi kejadian</span>
                <span className="font-medium text-gray-900">{report.location}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">Email pelapor</span>
                <span className="font-medium text-gray-900">{report.email}</span>
              </div>
            </div>

            {/* KRONOLOGI & BUKTI */}
            <div className="bg-[#EBEAF6] border border-[#D9D7EC] rounded-2xl p-6 space-y-6">
              <div className="bg-white/80 rounded-xl p-5 border border-[#E1DFEF] space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <FileText className="w-5 h-5 text-gray-700" />
                  <h3>Kronologi kejadian (ditulis pelapor)</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{report.chronology}</p>
              </div>

              {report.images.length > 0 && (
                <div className="bg-white/80 rounded-xl p-5 border border-[#E1DFEF] space-y-3">
                  <div className="flex items-center gap-2 text-gray-900 font-bold">
                    <Paperclip className="w-5 h-5 text-gray-700 -rotate-45" />
                    <h3>Bukti yang dilampirkan</h3>
                  </div>
                  <div className="flex gap-4 pt-1">
                    {report.images.map((img, idx) => (
                      <div key={idx} className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PESAN KE PELAPOR */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <MessageSquare className="w-5 h-5 text-gray-700" />
                  <h3>Pesan ke Pelapor</h3>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Catatan</label>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    placeholder="Tulis pesan atau arahan untuk dikirim ke pelapor"
                    className="w-full px-4 py-3 bg-white border border-[#D9D7EC] rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900 shadow-sm"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> Kirim
                </button>
              </div>

              {/* KONVERSASI SEBELUMNYA */}
              {conversations.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-[#E1DFEF]">
                  <h4 className="text-sm font-bold text-gray-700">Riwayat Percakapan</h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {conversations.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${msg.sender === "admin" ? "items-start" : "items-end"} max-w-[85%] ${msg.sender === "admin" ? "" : "ml-auto"}`}
                      >
                        <span className="text-[10px] font-semibold text-gray-400 mx-1 mb-0.5 flex items-center gap-1">
                          {msg.sender === "admin" ? (
                            <>
                              <span className="bg-[#4D455D] text-white text-[8px] font-bold px-1.5 py-0.5 rounded">Admin</span>
                              Admin
                            </>
                          ) : "Pelapor"}
                        </span>
                        <div
                          className={`text-xs p-2.5 leading-relaxed ${
                            msg.sender === "admin"
                              ? "bg-[#C9C4E9] text-[#3B3654] rounded-r-xl rounded-bl-xl"
                              : "bg-[#9CD3D3] text-teal-950 rounded-l-xl rounded-br-xl"
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: MANAGEMENT SIDEBAR */}
          <div className="space-y-8">
            {/* KLASIFIKASI KATEGORI */}
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                <BarChart3 className="w-5 h-5 text-gray-800" />
                Klasifikasi kategori
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORY_OPTIONS.map((kat) => (
                  <button
                    key={kat}
                    onClick={() => handleSetCategory(kat)}
                    className={`border rounded-xl p-3 text-[10px] font-medium text-center flex items-center justify-center leading-tight min-h-[60px] transition-all ${
                      report.category === kat
                        ? "border-[#4D455D] bg-[#EBEAF6] text-[#4D455D] font-bold"
                        : "border-[#D9D7EC] text-gray-600 bg-[#EBEAF6]/20 hover:bg-[#EBEAF6]"
                    }`}
                  >
                    {kat}
                  </button>
                ))}
              </div>
              {report.category && (
                <p className="text-xs text-[#4D455D] font-semibold">Kategori dipilih: {report.category}</p>
              )}
            </div>

            {/* UPDATE STATUS */}
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                <ArrowLeft className="w-5 h-5 text-gray-800 rotate-90" />
                Update status laporan
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {STATUS_LIST.map((s, idx) => {
                  const currentIdx = STATUS_LIST.findIndex((st) => st.key === report.status);
                  const isBefore = idx < currentIdx;
                  const isCurrent = report.status === s.key;
                  const isSelected = selectedStatus === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setSelectedStatus(isSelected ? null : s.key)}
                      disabled={isCurrent || isBefore}
                      className={`py-2.5 text-xs font-bold text-white rounded-xl shadow-sm transition-all ${
                        isCurrent || isBefore
                          ? `${s.color} opacity-60 cursor-not-allowed`
                          : isSelected
                          ? `${s.color} ring-2 ring-offset-2 ring-[#4D455D] scale-105`
                          : `${s.color} hover:opacity-90`
                      } disabled:opacity-50`}
                    >
                      {isCurrent ? "✓ " : ""}{s.label}
                    </button>
                  );
                })}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan (opsional)</label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="mis. sudah dihubungi lewat email"
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-400 text-sm text-gray-900 resize-none shadow-sm"
                />
              </div>
              {selectedStatus && (
                <button
                  onClick={handleSaveStatus}
                  disabled={updatingStatus}
                  className="w-full py-2.5 text-xs font-bold text-white bg-[#4D455D] hover:bg-[#3d364a] rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {updatingStatus ? "Menyimpan..." : "Simpan"}
                </button>
              )}
            </div>

            {/* RIWAYAT TINDAKAN */}
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                <BarChart3 className="w-5 h-5 text-gray-800" />
                Riwayat tindakan
              </h2>
              <div className="relative pl-6 space-y-6 border-l-2 border-gray-200 ml-2 pt-2">
                {logs.length === 0 && (
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 bg-white p-0.5 rounded-full">
                      <span className="block w-2.5 h-2.5 bg-[#4D455D] rounded-full" />
                    </span>
                    <span className="inline-block px-3 py-0.5 text-[10px] font-bold text-white bg-[#E2A955] rounded-full">
                      {status.label}
                    </span>
                    <h4 className="text-sm font-bold text-gray-800 mt-1">Laporan diterima sistem</h4>
                    <p className="text-xs text-gray-400">{formatDateTime(report.created_at)}</p>
                  </div>
                )}
                {logs.map((log, idx) => {
                  const logStatus = log.action.startsWith("laporan ") ? STATUS_LIST.find((s) => log.action.includes(s.label.toLowerCase())) : null;
                  const statusBg = logStatus?.color || (log.action === "category_set" ? "bg-[#4D455D]" : "bg-gray-400");
                  const statusLabel = logStatus?.label || (log.action === "category_set" ? "Kategori" : log.action);
                  return (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[31px] top-1 bg-white p-0.5 rounded-full">
                        <span className="block w-2.5 h-2.5 bg-[#4D455D] rounded-full" />
                      </span>
                      <span className={`inline-block px-3 py-0.5 text-[10px] font-bold text-white rounded-full ${statusBg}`}>
                        {statusLabel}
                      </span>
                      <h4 className="text-sm font-bold text-gray-800 mt-1">{log.description || log.action}</h4>
                      <p className="text-xs text-gray-400">{formatDateTime(log.created_at)} — {log.created_by}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
