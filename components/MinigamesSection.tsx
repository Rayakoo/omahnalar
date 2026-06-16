"use client";

import { useRouter } from "next/navigation";
import { Gamepad2, ArrowRight, Sparkles } from "lucide-react";
import { MINIGAMES } from "@/data/minigames";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

const BG_PATTERNS = [
  "radial-gradient(circle at 20% 50%, rgba(250,199,117,0.15) 0%, transparent 60%)",
  "radial-gradient(circle at 80% 50%, rgba(124,120,168,0.15) 0%, transparent 60%)",
];

export default function MinigamesSection() {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.home : en.home;
  const common = locale === "id" ? id.common : en.common;
  const min = locale === "id" ? id.minigames : en.minigames;

  return (
    <section className="bg-brand-900 py-20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-secondary-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-700/10 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-500 uppercase tracking-wider bg-secondary-500/10 px-4 py-1.5 rounded-full">
            <Gamepad2 className="w-4 h-4" /> {min.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-5 tracking-tight">
            {t.minigamesSub}
          </h2>
          <p className="text-sm text-brand-100/60 mt-3 max-w-xl mx-auto leading-relaxed">
            {t.minigamesDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MINIGAMES.map((game, idx) => (
            <button
              key={game.id}
              onClick={() => router.push(game.slug)}
              className="group relative bg-white/5 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 text-left transition-all duration-500 hover:bg-white/10 hover:scale-[1.03] border border-white/10 hover:border-white/20 overflow-hidden"
              style={{ backgroundImage: BG_PATTERNS[idx] }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <Sparkles className="w-full h-full text-secondary-500/10" />
              </div>

              <div className="flex items-start gap-6">
                <div
                  className="w-20 h-20 rounded-[1.25rem] flex items-center justify-center text-4xl shrink-0 shadow-lg"
                  style={{ backgroundColor: game.color }}
                >
                  {game.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    {locale === "id" ? game.title : game.titleEn}
                  </h3>
                  <p className="text-sm text-brand-100/60 leading-relaxed mb-6">
                    {locale === "id" ? game.description : game.descriptionEn}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-secondary-500 group-hover:gap-3 transition-all">
                    {common.play} <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </button>
          ))}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={() => router.push("/minigames")}
            className="inline-flex items-center gap-2 bg-secondary-500 text-brand-900 px-8 py-3.5 rounded-full text-sm font-bold hover:bg-secondary-600 transition-all shadow-lg hover:shadow-secondary-500/25"
          >
            {common.seeAll} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
