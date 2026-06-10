"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Phone, Scale, Brain, Users, Shield, UploadCloud, ArrowUpRight } from "lucide-react";
import CustomDatePicker from "@/components/CustomDatePicker";
import { createReport, getReportByTicket } from "@/services/reports";

export default function TanyaNalarPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"cek" | "buat">("buat");

  const KATEGORI_OPTIONS = [
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

  // Form fields
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [location, setLocation] = useState("");
  const [chronology, setChronology] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Cek status
  const [cekEmail, setCekEmail] = useState("");
  const [cekTicket, setCekTicket] = useState("");
  const [cekError, setCekError] = useState("");
  const [ceking, setCeking] = useState(false);

  const direktoriBantuan = [
    { nama: "LBH Malang", sub: "Bantuan hukum", icon: <Scale className="w-5 h-5 text-[#4C4765]" /> },
    { nama: "Psikolog & Konselor", sub: "Penanganan mental", icon: <Brain className="w-5 h-5 text-[#4C4765]" /> },
    { nama: "KPAI", sub: "021-319-015-32", icon: <Users className="w-5 h-5 text-[#4C4765]" /> },
    { nama: "Polres / Polda", sub: "Call center 110", icon: <Shield className="w-5 h-5 text-[#4C4765]" /> },
  ];

  const handleSubmitLaporan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedDate || !location || !chronology) {
      alert("Harap isi semua field");
      return;
    }
    setSubmitting(true);
    try {
      const report = await createReport({
        email,
        date: selectedDate,
        location,
        chronology,
        images,
        category: category || undefined,
      });
      router.push(`/tanya-nalar/sukses?ticket=${report.ticket_id}`);
    } catch (err) {
      console.error("Gagal mengirim laporan:", err);
      alert("Gagal mengirim laporan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCekStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cekEmail || !cekTicket) {
      setCekError("Harap isi email dan kode laporan");
      return;
    }
    setCeking(true);
    setCekError("");
    try {
      const report = await getReportByTicket(cekTicket);
      if (report.email !== cekEmail) {
        setCekError("Email atau kode laporan tidak cocok");
        return;
      }
      router.push(`/tanya-nalar/detail-laporan?ticket=${report.ticket_id}`);
    } catch {
      setCekError("Laporan tidak ditemukan. Periksa kembali kode dan email.");
    } finally {
      setCeking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF3] font-sans antialiased text-gray-800">
      <header className="bg-[#4C4765] text-white p-6 md:p-8 rounded-b-[24px] shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-8 h-8 text-[#F4C46B]" />
            <h1 className="text-2xl font-bold text-[#F4C46B]">Pusat Aduan</h1>
          </div>
          <p className="text-sm text-gray-300 mb-6">
            Ruang aman untuk melapor, memantau, dan mendapatkan bantuan
          </p>

          <div className="ml-0">
            <p className="text-xs font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" /> Direktori bantuan
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {direktoriBantuan.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center justify-between p-3 bg-[#E5E2F8] text-gray-900 rounded-xl hover:bg-opacity-90 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#3B3654]">{item.nama}</h4>
                      <p className="text-[10px] text-gray-500">{item.sub}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="inline-flex p-1 bg-[#E5E2F8] rounded-2xl mb-8">
          <button
            onClick={() => setActiveTab("cek")}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "cek"
                ? "bg-[#736A9C] text-white shadow-sm"
                : "text-[#736A9C] hover:bg-[#D7D3F2]"
            }`}
          >
            Cek Status Laporan
          </button>
          <button
            onClick={() => setActiveTab("buat")}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "buat"
                ? "bg-[#736A9C] text-white shadow-sm"
                : "text-[#736A9C] hover:bg-[#D7D3F2]"
            }`}
          >
            Buat Laporan
          </button>
        </div>

        <div className="max-w-2xl bg-transparent">
          {activeTab === "buat" ? (
            <form onSubmit={handleSubmitLaporan} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="XXXX@example.com"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#736A9C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">Tanggal Kejadian</label>
                <CustomDatePicker onDateSelect={(date) => setSelectedDate(date)} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">Lokasi Kejadian</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="mis. Malang"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#736A9C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">Kronologi Kejadian</label>
                <textarea
                  rows={4}
                  required
                  value={chronology}
                  onChange={(e) => setChronology(e.target.value)}
                  placeholder="Ceritakan yang terjadi secara runtut. Tidak perlu sempurna, tulis sesuai yang kamu ingat"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#736A9C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">Kategori Laporan</label>
                <div className="flex flex-wrap gap-2">
                  {KATEGORI_OPTIONS.map((kat) => (
                    <button
                      key={kat}
                      type="button"
                      onClick={() => setCategory(category === kat ? "" : kat)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        category === kat
                          ? "border-[#4C4765] bg-[#E5E2F8] text-[#3B3654]"
                          : "border-gray-200 bg-white text-gray-600 hover:border-[#736A9C]"
                      }`}
                    >
                      {kat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl bg-[#FFFDF9] p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:border-[#736A9C] transition-colors">
                  <UploadCloud className="w-10 h-10 mb-2 text-gray-500" />
                  <p className="text-xs font-medium text-gray-700">Seret file ke sini atau pilih dari perangkat</p>
                  <p className="text-[10px] text-gray-400 mt-1">Foto, dokumen, tangkapan layar - Maks. 10MB per file</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#4C4765] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {submitting ? "Mengirim..." : "Kirim Laporan"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCekStatus} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={cekEmail}
                  onChange={(e) => setCekEmail(e.target.value)}
                  placeholder="XXXX@example.com"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#736A9C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">Kode Laporan</label>
                <input
                  type="text"
                  required
                  value={cekTicket}
                  onChange={(e) => setCekTicket(e.target.value)}
                  placeholder="Contoh: TN-A8K3M"
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#736A9C]"
                />
              </div>

              {cekError && (
                <p className="text-xs text-red-600 font-medium">{cekError}</p>
              )}

              <button
                type="submit"
                disabled={ceking}
                className="px-5 py-2 bg-[#4C4765] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {ceking ? "Memeriksa..." : "Cek Status"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
