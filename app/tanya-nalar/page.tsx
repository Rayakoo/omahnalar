"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
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
      icon: <Phone className="w-5 h-5" />,
      links: [
        { label: "Hotline 021-129", href: "tel:021-129" },
        { label: "WA 0811129129", href: "https://wa.me/62811129129" },
      ],
    },
    {
      nama: "Komnas Perempuan",
      icon: <Scale className="w-5 h-5" />,
      links: [
        { label: "Hotline 021-80305399", href: "tel:021-80305399" },
        { label: "Telp 021-3903963", href: "tel:021-3903963" },
      ],
    },
    {
      nama: "Komisi Perlindungan\nAnak Indonesia (KPAI)",
      icon: <Users className="w-5 h-5" />,
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
    <div className="min-h-screen bg-[#FAF5ED] font-sans antialiased text-gray-800">
      {/* Banner / Header */}
      <header className="relative bg-gradient-to-r from-[#53267d] via-[#3a2e8c] to-[#1d41a5] text-white p-6 md:p-10 pb-12 overflow-hidden">
        {/* Pattern Hiasan Samping */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-2"
          >
            <ShieldCheck className="w-9 h-9 text-[#FCD34D] stroke-[2.2]" />
            <h1 className="text-3xl md:text-4xl font-black text-[#FCD34D] tracking-tight">
              {t.title}
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm md:text-base text-gray-100 mb-8 max-w-2xl font-normal"
          >
            {t.desc}
          </motion.p>

          <div className="ml-0">
            <Reveal className="text-xs md:text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4" /> {t.direktori}
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {direktoriBantuan.map((item, index) => (
                <Reveal key={index} delay={(index % 3) * 0.08}>
                <div
                  className="p-4 bg-[#F5EAD6] text-gray-900 rounded-2xl shadow-sm border border-[#E8DCBF] h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#7552A8] text-white flex items-center justify-center shrink-0">
                      <div className="text-white [&>svg]:text-white [&>svg]:w-5 [&>svg]:h-5">
                        {item.icon}
                      </div>
                    </div>
                    <h4 className="text-xs md:text-sm font-extrabold text-[#1F1938] leading-tight whitespace-pre-line">
                      {item.nama}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-1">
                    {item.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#7B53B8] hover:bg-[#683F9E] rounded-lg text-[11px] font-bold text-white transition-colors"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content Form / Cek Status */}
      <main className="max-w-6xl mx-auto p-6 md:p-10">
        {/* Toggle Tab */}
        <Reveal className="inline-flex p-1.5 bg-[#D8CCF1] rounded-2xl mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("cek")}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
              activeTab === "cek"
                ? "bg-[#51236E] text-[#FCD34D] shadow-md"
                : "text-[#51236E] hover:bg-[#C9B8E8]"
            }`}
          >
            {t.cekStatus}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("buat")}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
              activeTab === "buat"
                ? "bg-[#51236E] text-[#FCD34D] shadow-md"
                : "text-[#51236E] hover:bg-[#C9B8E8]"
            }`}
          >
            {t.buatLaporan}
          </button>
        </Reveal>

        <Reveal delay={0.1} className="max-w-2xl bg-transparent">
          {activeTab === "buat" ? (
            <form onSubmit={handleSubmitLaporan} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-[#1E1735] mb-2">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full p-3.5 bg-white border border-[#C2B2E8] rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#683F9E]"
                />
              </div>

              {/* Tanggal Kejadian */}
              <div>
                <label className="block text-sm font-bold text-[#1E1735] mb-2">
                  {t.tanggalKejadian}
                </label>
                <CustomDatePicker onDateSelect={(date) => setSelectedDate(date)} />
              </div>

              {/* Lokasi Kejadian */}
              <div>
                <label className="block text-sm font-bold text-[#1E1735] mb-2">
                  {t.lokasiKejadian}
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t.lokasiPlaceholder}
                  className="w-full p-3.5 bg-white border border-[#C2B2E8] rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#683F9E]"
                />
              </div>

              {/* Kronologi */}
              <div>
                <label className="block text-sm font-bold text-[#1E1735] mb-2">
                  {t.kronologi}
                </label>
                <textarea
                  rows={4}
                  required
                  value={chronology}
                  onChange={(e) => setChronology(e.target.value)}
                  placeholder={t.kronologiPlaceholder}
                  className="w-full p-3.5 bg-white border border-[#C2B2E8] rounded-xl text-sm text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#683F9E]"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-bold text-[#1E1735] mb-2">
                  {t.kategori}
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {KATEGORI_OPTIONS.map((kat) => (
                    <button
                      key={kat}
                      type="button"
                      onClick={() => setCategory(category === kat ? "" : kat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        category === kat
                          ? "border-[#51236E] bg-[#51236E] text-white shadow-sm"
                          : "border-[#C2B2E8] bg-white text-[#1E1735] hover:border-[#855CB8]"
                      }`}
                    >
                      {kat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload File */}
              <div>
                <label className="block text-sm font-bold text-[#1E1735] mb-2">
                  {t.uploadOptional}
                </label>
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
                  className="border-2 border-dashed border-[#A387D9] rounded-2xl bg-white p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50/20 transition-colors"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-9 h-9 mb-2 text-[#7B53B8] animate-spin" />
                  ) : (
                    <UploadCloud className="w-9 h-9 mb-2 text-[#7B53B8]" />
                  )}
                  <p className="text-xs font-bold text-[#1E1735]">{t.uploadArea}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{t.uploadHint}</p>
                </div>
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 mt-3">
                    {images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={imgUrl}
                          alt={`Upload ${idx + 1}`}
                          className="w-20 h-20 rounded-xl object-contain bg-white border border-[#C2B2E8]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
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

              {/* Consent Box */}
              <label className="flex items-start gap-3 p-4 bg-[#D8CCF1] rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-[#51236E]"
                />
                <span className="text-xs font-semibold text-[#1E1735] leading-relaxed">
                  {t.consentLabel}
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3 bg-[#172B68] hover:bg-[#122152] text-white text-xs md:text-sm font-bold rounded-xl transition-colors disabled:opacity-50 shadow-md"
              >
                {submitting ? t.mengirim : t.kirimLaporan}
              </button>
            </form>
          ) : (
            /* Cek Status Form */
            <form onSubmit={handleCekStatus} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#1E1735] mb-2">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={cekEmail}
                  onChange={(e) => setCekEmail(e.target.value)}
                  placeholder={t.cekEmailPlaceholder}
                  className="w-full p-3.5 bg-white border border-[#C2B2E8] rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#683F9E]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1E1735] mb-2">
                  {t.kodeLaporan}
                </label>
                <input
                  type="text"
                  required
                  value={cekTicket}
                  onChange={(e) => setCekTicket(e.target.value)}
                  placeholder={t.kodePlaceholder}
                  className="w-full p-3.5 bg-white border border-[#C2B2E8] rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#683F9E]"
                />
              </div>

              {cekError && (
                <p className="text-xs text-red-600 font-bold">{cekError}</p>
              )}

              <button
                type="submit"
                disabled={ceking}
                className="px-7 py-3 bg-[#172B68] hover:bg-[#122152] text-white text-xs md:text-sm font-bold rounded-xl transition-colors disabled:opacity-50 shadow-md"
              >
                {ceking ? t.memeriksa : t.cekStatusBtn}
              </button>
            </form>
          )}
        </Reveal>
      </main>
    </div>
  );
}
