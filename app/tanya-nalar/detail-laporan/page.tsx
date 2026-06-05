"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Paperclip,
  Image as ImageIcon,
  Send,
  MessageSquare,
  Scale,
  Brain,
  Users,
  ShieldAlert,
  BarChart3,
} from "lucide-react";
import { getReportByTicket, getReportLogs, getConversations, addConversationMessage, type Report, type ReportLog, type ReportConversation } from "@/services/reports";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "Menunggu", color: "bg-red-100 text-red-700" },
  in_progress: { label: "Diproses", color: "bg-amber-100 text-amber-700" },
  resolved: { label: "Selesai", color: "bg-green-100 text-green-700" },
  closed: { label: "Ditutup", color: "bg-gray-100 text-gray-600" },
};

const direktoriBantuan = [
  { nama: "LBH Malang", sub: "Bantuan hukum", icon: Scale },
  { nama: "Psikolog & Konselor", sub: "Penanganan mental", icon: Brain },
  { nama: "KPAI", sub: "021-319-015-32", icon: Users },
  { nama: "Polres / Polda", sub: "Call center 110", icon: ShieldAlert },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function DetailLaporan() {
  const searchParams = useSearchParams();
  const ticket = searchParams.get("ticket") || "";

  const [report, setReport] = useState<Report | null>(null);
  const [logs, setLogs] = useState<ReportLog[]>([]);
  const [conversations, setConversations] = useState<ReportConversation[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDetail = async () => {
    if (!ticket) return;
    setLoading(true);
    try {
      const r = await getReportByTicket(ticket);
      setReport(r);
      const [l, c] = await Promise.all([
        getReportLogs(r.id),
        getConversations(r.id),
      ]);
      setLogs(l);
      setConversations(c);
    } catch {
      // report not found
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !report) return;
    setSending(true);
    try {
      const msg = await addConversationMessage({
        report_id: report.id,
        sender: "user",
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
      <div className="min-h-screen bg-[#FFFBF3] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#736A9C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[#FFFBF3] font-sans antialiased flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-sm text-gray-500">Laporan tidak ditemukan.</p>
        <Link href="/tanya-nalar" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4C4765] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali
        </Link>
      </div>
    );
  }

  const status = STATUS_MAP[report.status] || STATUS_MAP.pending;

  return (
    <div className="min-h-screen bg-[#FFFBF3] font-sans antialiased text-gray-800 flex flex-col">
      <nav className="bg-[#FFF1D6] p-4 flex items-center justify-between border-b border-orange-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#736A9C] flex items-center justify-center text-white font-bold text-xs">PA</div>
          <span className="text-sm font-bold text-[#3B3654] tracking-wide">{report.ticket_id}</span>
        </div>
        <Link
          href="/tanya-nalar"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#4C4765] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <section className="lg:col-span-2 space-y-6">
          <h1 className="text-xl md:text-2xl font-bold text-[#3B3654] text-center lg:text-left">Detail Laporan</h1>

          <div className="bg-[#E5E2F8] bg-opacity-40 border border-[#D7D3F2] rounded-2xl p-5 space-y-3.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-500">ID Laporan</span>
              <span className="font-bold text-[#3B3654]">{report.ticket_id}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-500">Status saat ini</span>
              <span className={`px-3 py-0.5 text-xs font-bold rounded-full ${status.color}`}>{status.label}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-500">Tanggal laporan masuk</span>
              <span className="font-medium text-gray-800">{formatDate(report.created_at)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-500">Tanggal kejadian</span>
              <span className="font-medium text-gray-800">{formatDate(report.date)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-500">Lokasi kejadian</span>
              <span className="font-medium text-gray-800">{report.location}</span>
            </div>
          </div>

          {report.category && (
            <div className="bg-[#E5E2F8] bg-opacity-40 border border-[#D7D3F2] rounded-2xl p-5 flex items-center gap-3">
              <span className="text-lg">🏷️</span>
              <div>
                <p className="text-xs font-semibold text-gray-500">Klasifikasi Laporan</p>
                <p className="text-sm font-bold text-[#3B3654]">{report.category}</p>
              </div>
            </div>
          )}

          <div className="bg-[#DADAFA] bg-opacity-70 border border-[#C9C4E9] rounded-2xl p-5 space-y-5">
            <div className="bg-white bg-opacity-80 rounded-xl p-4 border border-white space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <FileText className="w-4 h-4 text-[#736A9C]" />
                <h4 className="text-sm font-bold text-[#3B3654]">Kronologi kejadian</h4>
              </div>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {report.chronology}
              </p>

              {report.images.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B3654] mb-3">
                    <Paperclip className="w-3.5 h-3.5 text-[#736A9C]" />
                    <span>Bukti yang dilampirkan</span>
                  </div>
                  <div className="flex gap-3">
                    {report.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-14 h-14 rounded-lg bg-[#E5E2F8] border border-[#D7D3F2] flex items-center justify-center text-[#736A9C] cursor-pointer hover:bg-opacity-80 transition-colors"
                      >
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <section className="space-y-6">
          {/* TIMELINE */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#3B3654] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#736A9C]" /> Riwayat tindakan
            </h3>
            <div className="relative border-l-2 border-[#736A9C] ml-2 pl-4 space-y-5">
              {logs.length === 0 && (
                <div className="relative">
                  <span className="absolute -left-[21px] mt-1 bg-[#736A9C] w-2 h-2 rounded-full border-4 border-[#FFFBF3]"></span>
                  <span className={`inline-block ${status.color} text-[10px] font-bold px-2 py-0.5 rounded-md mb-1`}>{status.label}</span>
                  <h5 className="text-xs font-bold text-gray-800">Laporan diterima</h5>
                  <p className="text-[10px] text-gray-400">{formatDateTime(report.created_at)}</p>
                </div>
              )}
              {logs.map((log, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[21px] mt-1 bg-[#736A9C] w-2 h-2 rounded-full border-4 border-[#FFFBF3]"></span>
                  <span className="inline-block bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md mb-1">{log.action}</span>
                  <h5 className="text-xs font-bold text-gray-800">{log.description || log.action}</h5>
                  <p className="text-[10px] text-gray-400">{formatDateTime(log.created_at)} — {log.created_by}</p>
                </div>
              ))}
            </div>
          </div>

          {/* DIREKTORI */}
          <div className="space-y-2">
            {direktoriBantuan.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={idx}
                  href="#"
                  className="flex items-center justify-between p-2.5 bg-[#E5E2F8] bg-opacity-70 text-gray-900 rounded-xl hover:bg-opacity-100 transition-all border border-[#D7D3F2] group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#736A9C]">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#3B3654]">{item.nama}</h4>
                      <p className="text-[10px] text-gray-500">{item.sub}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700" />
                </a>
              );
            })}
          </div>

          {/* CHAT */}
          <div className="border border-orange-100 rounded-2xl p-4 bg-[#FFFDF9] space-y-4">
            <h4 className="text-xs font-bold text-[#3B3654] border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#736A9C]" /> Pertanyaan Lebih Lanjut
            </h4>

            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
              {conversations.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === "admin" ? "items-start" : "items-end"} max-w-[85%] ${msg.sender === "admin" ? "" : "ml-auto"}`}
                >
                  <span className="text-[9px] font-semibold text-gray-400 mx-1 mb-0.5">
                    {msg.sender === "admin" ? "Admin" : "Anda"}
                  </span>
                  <div
                    className={`text-[11px] p-2.5 leading-relaxed ${
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

            <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-1 bg-white">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                placeholder="Ketik diskusi..."
                className="w-full text-xs px-2 py-1.5 focus:outline-none text-gray-700 bg-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim()}
                className="p-1.5 bg-[#4C4765] text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
