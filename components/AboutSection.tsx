"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

export default function AboutSection() {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.home : en.home;

  return (
    <section className="bg-page-50 py-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2"
        >
          <div className="relative bg-brand-100 rounded-3xl overflow-hidden">
            <img
              src="/images/omah_nalar.JPG"
              alt="Omah Nalar"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2"
        >
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">
            {t.aboutTitle}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-3 mb-5 leading-tight">
            {t.aboutHeading}
          </h2>
          <p className="text-brand-700/80 leading-relaxed mb-6">
            {t.aboutDesc}
          </p>
          <button onClick={() => router.push("/tentang")} className="bg-brand-900 text-white font-medium px-6 py-3 rounded-full hover:bg-brand-700 transition-colors flex items-center gap-2 text-sm shadow-sm">
            {t.aboutCta} <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
