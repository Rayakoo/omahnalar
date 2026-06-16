"use client";

import { Shield, GraduationCap, HeartHandshake, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

const PILLAR_KEYS = [
  { icon: <Shield className="w-10 h-10 text-brand-700" />, titleKey: "pilarPerlindungan" as const, descKey: "pilarPerlindunganDesc" as const },
  { icon: <GraduationCap className="w-10 h-10 text-brand-700" />, titleKey: "pilarEdukasi" as const, descKey: "pilarEdukasiDesc" as const },
  { icon: <HeartHandshake className="w-10 h-10 text-brand-700" />, titleKey: "pilarDukungan" as const, descKey: "pilarDukunganDesc" as const },
  { icon: <Lightbulb className="w-10 h-10 text-brand-700" />, titleKey: "pilarInovasi" as const, descKey: "pilarInovasiDesc" as const },
];

export default function PilarSection() {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.home : en.home;

  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">
            {t.pilarTitle}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-3">
            {t.pilarSub}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLAR_KEYS.map((pilar, idx) => (
            <div key={idx} className="text-center group">
              <div className="w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-700/20 transition-colors">
                {pilar.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-2">{t[pilar.titleKey]}</h3>
              <p className="text-sm text-brand-700/80 leading-relaxed">{t[pilar.descKey]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
