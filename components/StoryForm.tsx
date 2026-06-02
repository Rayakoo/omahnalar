"use client";

import { useState } from "react";
import { PenTool } from "lucide-react";

export default function StoryForm() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [story, setStory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nama: isAnonymous ? "Anonim" : name,
      cerita: story,
    };
    console.log("Data dikirim:", payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
        <PenTool className="w-6 h-6 text-brand-900 stroke-[2.5]" />
        <h1 className="text-xl md:text-2xl font-bold tracking-wide">
          Bagikan ceritamu
        </h1>
      </div>

      <div
        className={`transition-all duration-300 origin-top flex flex-col gap-2 ${
          isAnonymous
            ? "opacity-0 h-0 pointer-events-none overflow-hidden mb-0"
            : "opacity-100 h-auto mb-2"
        }`}
      >
        <label htmlFor="nama-input" className="text-sm font-semibold text-brand-900/80">
          Nama
        </label>
        <input
          id="nama-input"
          type="text"
          disabled={isAnonymous}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Anda boleh memakai nama samaran"
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-700/30 focus:border-brand-700 transition-all shadow-sm"
        />
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
          Saya memilih sebagai anonymus
        </span>
      </div>

      <div className="bg-white/50 border border-gray-200 rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <textarea
            rows={10}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Ceritakan pengalaman mu. Identitashmu terlindungi"
            className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition-all resize-none shadow-inner leading-relaxed"
            required
          />
        </div>

        <div className="flex justify-start">
          <button
            type="submit"
            className="bg-brand-900 text-white font-medium text-xs px-6 py-2.5 rounded-lg hover:bg-brand-700 transition-all active:scale-95 shadow-md uppercase tracking-wider"
          >
            Bagikan
          </button>
        </div>
      </div>
    </form>
  );
}
