"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PenTool } from "lucide-react";
import { createStory } from "@/services/stories";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

const FIXED_CATEGORIES = [
  "Puisi",
  "Pengalaman",
  "Curhat",
  "Opini",
  "Tips",
  "Inspirasi",
];

const LAINNYA = "__lainnya__";

export default function StoryForm() {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.omahCerita : en.omahCerita;
  const common = locale === "id" ? id.common : en.common;
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [selectedCat, setSelectedCat] = useState(FIXED_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const isLainnya = selectedCat === LAINNYA;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const category = isLainnya ? customCategory.trim() : selectedCat;
    if (!category) {
      alert(t.pilihKategori);
      return;
    }
    setLoading(true);
    try {
      await createStory({
        title,
        name: isAnonymous ? "Anonim" : name,
        content: story,
        category,
        is_anonymous: isAnonymous,
      });
      router.push("/omah-cerita/semua-cerita");
    } catch (err) {
      console.error("Gagal mengirim cerita:", err);
      alert(t.gagalKirim);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
        <PenTool className="w-6 h-6 text-brand-900 stroke-[2.5]" />
        <h1 className="text-xl md:text-2xl font-bold tracking-wide">
          {t.bagikanCeritamu}
        </h1>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="title-input" className="text-sm font-semibold text-brand-900/80">
          {t.judulCerita}
        </label>
        <input
          id="title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.judulPlaceholder}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-700/30 focus:border-brand-700 transition-all shadow-sm"
          required
        />
      </div>

      <div
        className={`transition-all duration-300 origin-top flex flex-col gap-2 ${
          isAnonymous
            ? "opacity-0 h-0 pointer-events-none overflow-hidden mb-0"
            : "opacity-100 h-auto mb-2"
        }`}
      >
        <label htmlFor="nama-input" className="text-sm font-semibold text-brand-900/80">
          {t.namaKamu}
        </label>
        <input
          id="nama-input"
          type="text"
          disabled={isAnonymous}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.namaPlaceholder}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-700/30 focus:border-brand-700 transition-all shadow-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-brand-900/80">
          {t.kategoriCerita}
        </label>
        <div className="flex flex-wrap gap-2">
          {FIXED_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                selectedCat === cat
                  ? "bg-brand-900 text-white border-brand-900"
                  : "bg-white text-brand-900/70 border-gray-300 hover:border-brand-700"
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedCat(LAINNYA)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
              isLainnya
                ? "bg-brand-900 text-white border-brand-900"
                : "bg-white text-brand-900/70 border-gray-300 hover:border-brand-700"
            }`}
          >
            {t.lainnya}
          </button>
        </div>

        {isLainnya && (
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder={t.kategoriCustomPlaceholder}
            className="mt-2 w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-700/30 focus:border-brand-700 transition-all shadow-sm"
            autoFocus
          />
        )}
      </div>

      <div className="flex items-center gap-3 my-2">
        <label className="relative flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="peer sr-only"
          />
          <div className="w-7 h-7 bg-brand-100 rounded-full border border-gray-300 peer-checked:bg-brand-900 peer-checked:border-brand-900 transition-all flex items-center justify-center shadow-inner">
            <div className="w-2.5 h-2.5 bg-white rounded-full scale-0 peer-checked:scale-100 transition-transform duration-200" />
          </div>
        </label>
        <span className="text-sm font-medium text-brand-900/90">
          {t.anonimCheckbox}
        </span>
      </div>

      <div className="bg-white/50 border border-gray-200 rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <textarea
            rows={10}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder={t.ceritaPlaceholder}
            className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition-all resize-none shadow-inner leading-relaxed"
            required
          />
        </div>

        <div className="flex justify-start">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-900 text-white font-medium text-xs px-6 py-2.5 rounded-lg hover:bg-brand-700 transition-all active:scale-95 shadow-md uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? common.loading : t.bagikanBtn}
          </button>
        </div>
      </div>
    </form>
  );
}
