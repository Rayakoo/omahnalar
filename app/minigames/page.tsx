"use client";

import Link from "next/link";
import { Gamepad2, ArrowRight, Sparkles } from "lucide-react";
import { MINIGAMES } from "@/data/minigames";

const BG_PATTERNS = [
  "radial-gradient(circle at 30% 40%, rgba(250,199,117,0.12) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(250,199,117,0.06) 0%, transparent 40%)",
  "radial-gradient(circle at 70% 30%, rgba(124,120,168,0.12) 0%, transparent 60%), radial-gradient(circle at 20% 70%, rgba(124,120,168,0.06) 0%, transparent 40%)",
];

export default function MinigamesPage() {
  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased text-brand-900 flex flex-col">
      {/* Hero */}
      <div className="bg-brand-900 text-white py-16 md:py-24 px-6 mt-16 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-secondary-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-brand-100/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-brand-700/10 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-secondary-500 text-brand-900 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-5">
            <Gamepad2 className="w-3.5 h-3.5" /> Minigames
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-secondary-500">
            Main Sambil Belajar
          </h1>
          <p className="text-sm md:text-base text-brand-100/70 mt-4 max-w-2xl mx-auto leading-relaxed">
            Asah pengetahuanmu tentang kesehatan reproduksi melalui berbagai permainan seru dan interaktif.
          </p>
        </div>
      </div>

      {/* Cards */}
      <main className="max-w-4xl mx-auto w-full px-4 md:px-6 -mt-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MINIGAMES.map((game, idx) => (
            <Link
              key={game.id}
              href={game.slug}
              className="group relative bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 flex flex-col p-8 md:p-10"
              style={{ backgroundImage: BG_PATTERNS[idx] }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <Sparkles className="w-full h-full text-brand-900/5" />
              </div>

              <div className="flex items-start gap-6 mb-8">
                <div
                  className="w-20 h-20 rounded-[1.25rem] flex items-center justify-center text-4xl shrink-0 shadow-md"
                  style={{ backgroundColor: game.color }}
                >
                  {game.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-2xl font-bold text-brand-900 mb-2 group-hover:text-brand-700 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-sm text-brand-700/60 leading-relaxed">
                    {game.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-brand-900/10 mt-auto">
                <span className="text-sm font-bold text-brand-700 flex items-center gap-2 group-hover:gap-3 transition-all">
                  Mainkan <ArrowRight className="w-4 h-4" />
                </span>
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${game.color}22` }}
                >
                  <span className="text-lg">{game.icon}</span>
                </span>
              </div>

              <div className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-brand-900/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
