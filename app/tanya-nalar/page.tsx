"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Phone, Scale, Users, UploadCloud, ArrowUpRight, Loader2, X } from "lucide-react";
import CustomDatePicker from "@/components/CustomDatePicker";
import { createReport, getReportByTicket } from "@/services/reports";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";
import { uploadToGarage } from "@/services/garage";

export default function TanyaNalarPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.tanyaNalar : en.tanyaNalar;
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
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cek status
  const [cekEmail, setCekEmail] = useState("");
  const [cekTicket, setCekTicket] = useState("");
  const [cekError, setCekError] = useState("");
  const [ceking, setCeking] = useState(false);

  const direktoriBantuan = [
    {
      nama: "Call Centre SAPA\nKementerian PPA",
      icon: <Phone className="w-5 h-5 text-[#4C4765]" />,
      links: [
        { label: "Hotline 021-129", href: "tel:021-129" },
        { label: "WA 0811129129", href: "https://wa.me/62811129129" },
      ],
    },
    {
      nama: "Komnas Perempuan",
      icon: <Scale className="w-5 h-5 text-[#4C4765]" />,
      links: [
        { label: "Hotline 021-80305399", href: "tel:021-80305399" },
        { label: "Telp 021-3903963", href: "tel:021-3903963" },
      ],
    },
    {
      nama: "Komisi Perlindungan\nAnak Indonesia (KPAI)",
      icon: <Users className="w-5 h-5 text-[#4C4765]" />,
      links: [
        { label: "WA Pengaduan 08111772273", href: "https://wa.me/628111772273" },
        { label: "humas@kpai.go.id", href: "mailto:humas@kpai.go.id" },
        { label: "pengaduan@kpai.go.id", href: "mailto:pengaduan@kpai.go.id" },
        { label: "kpai.go.id", href: "https://www.kpai.go.id" },
      ],
    },
  ];

  const handleSubmitLaporan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedDate || !location || !chronology) {
      alert(t.isiSemua);
      return;
    }
    if (!consent) {
      alert(t.consentRequired);
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
      alert(t.gagalKirim);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCekStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cekEmail || !cekTicket) {
      setCekError(t.isiEmailKode);
      return;
    }
    setCeking(true);
    setCekError("");
    try {
      const report = await getReportByTicket(cekTicket);
      if (report.email !== cekEmail) {
        setCekError(t.emailKodeTidakCocok);
        return;
      }
      router.push(`/tanya-nalar/detail-laporan?ticket=${report.ticket_id}`);
    } catch {
      setCekError(t.laporanTidakDitemukan);
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
            <h1 className="text-2xl font-bold text-[#F4C46B]">{t.title}</h1>
          </div>
          <p className="text-sm text-gray-300 mb-6">
            {t.desc}
          </p>

          <div className="ml-0">
            <p className="text-xs font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" /> {t.direktori}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {direktoriBantuan.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-[#E5E2F8] text-gray-900 rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <h4 className="text-xs font-bold text-[#3B3654] whitespace-pre-line">{item.nama}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 ml-10">
                    {item.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white/70 rounded-lg text-[10px] font-semibold text-[#4C4765] hover:bg-white transition-colors"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
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
            {t.cekStatus}
          </button>
          <button
            onClick={() => setActiveTab("buat")}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "buat"
                ? "bg-[#736A9C] text-white shadow-sm"
                : "text-[#736A9C] hover:bg-[#D7D3F2]"
            }`}
          >
            {t.buatLaporan}
          </button>
        </div>

        <div className="max-w-2xl bg-transparent">
          {activeTab === "buat" ? (
            <form onSubmit={handleSubmitLaporan} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">{t.emailLabel}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#736A9C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">{t.tanggalKejadian}</label>
                <CustomDatePicker onDateSelect={(date) => setSelectedDate(date)} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">{t.lokasiKejadian}</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t.lokasiPlaceholder}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#736A9C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">{t.kronologi}</label>
                <textarea
                  rows={4}
                  required
                  value={chronology}
                  onChange={(e) => setChronology(e.target.value)}
                  placeholder={t.kronologiPlaceholder}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#736A9C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">{t.kategori}</label>
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
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">{t.uploadOptional}</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files?.length) return;
                    setUploadingImage(true);
                    try {
                      for (const file of Array.from(files)) {
                        const url = await uploadToGarage(file);
                        if (url) setImages((prev) => [...prev, url]);
                      }
                    } finally {
                      setUploadingImage(false);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }
                  }}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl bg-[#FFFDF9] p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:border-[#736A9C] transition-colors"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-10 h-10 mb-2 text-gray-500 animate-spin" />
                  ) : (
                    <UploadCloud className="w-10 h-10 mb-2 text-gray-500" />
                  )}
                  <p className="text-xs font-medium text-gray-700">{t.uploadArea}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{t.uploadHint}</p>
                </div>
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={imgUrl}
                          alt={`Upload ${idx + 1}`}
                          className="w-20 h-20 rounded-lg object-contain bg-gray-100 border border-gray-200"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 p-4 bg-[#E5E2F8] rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-[#4C4765]"
                />
                <span className="text-xs text-[#3B3654] leading-relaxed">{t.consentLabel}</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#4C4765] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {submitting ? t.mengirim : t.kirimLaporan}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCekStatus} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">{t.emailLabel}</label>
                <input
                  type="email"
                  required
                  value={cekEmail}
                  onChange={(e) => setCekEmail(e.target.value)}
                  placeholder={t.cekEmailPlaceholder}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#736A9C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#4C4765] mb-2">{t.kodeLaporan}</label>
                <input
                  type="text"
                  required
                  value={cekTicket}
                  onChange={(e) => setCekTicket(e.target.value)}
                  placeholder={t.kodePlaceholder}
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
                {ceking ? t.memeriksa : t.cekStatusBtn}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
