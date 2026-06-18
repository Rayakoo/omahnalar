"use client";

import { Shield, GraduationCap, HeartHandshake, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

const PILLAR_KEYS = [
  { icon: <Shield className="w-10 h-10 text-brand-900" />, titleKey: "pilarPerlindungan" as const, descKey: "pilarPerlindunganDesc" as const, color: "#BFDBFE" },
  { icon: <GraduationCap className="w-10 h-10 text-brand-900" />, titleKey: "pilarEdukasi" as const, descKey: "pilarEdukasiDesc" as const, color: "#BBF7D0" },
  { icon: <HeartHandshake className="w-10 h-10 text-brand-900" />, titleKey: "pilarDukungan" as const, descKey: "pilarDukunganDesc" as const, color: "#FED7AA" },
  { icon: <Lightbulb className="w-10 h-10 text-brand-900" />, titleKey: "pilarInovasi" as const, descKey: "pilarInovasiDesc" as const, color: "#DDD6FE" },
];

export default function PilarSection() {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.home : en.home;

  return (
    <section className="bg-page-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">
            {t.pilarTitle}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-3">
            {t.pilarSub}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLAR_KEYS.map((pilar, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-6 text-brand-900 flex flex-col items-center text-center min-h-[220px] justify-center"
              style={{ backgroundColor: pilar.color }}
            >
              <div className="mb-4">
                {pilar.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{t[pilar.titleKey]}</h3>
              <p className="text-sm leading-relaxed opacity-90">{t[pilar.descKey]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
