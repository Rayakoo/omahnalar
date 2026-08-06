"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

interface QuizResultModalProps {
  isOpen: boolean;
  status: "correct" | "wrong";
  onNext: () => void;
  isLast: boolean;
  question?: string;
  selectedAnswer?: string;
  correctAnswer?: string;
  explanation?: string | null;
}

export default function QuizResultModal({ isOpen, status, onNext, isLast, question, selectedAnswer, correctAnswer, explanation }: QuizResultModalProps) {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.omahBelajar : en.omahBelajar;
  const common = locale === "id" ? id.common : en.common;

  if (!isOpen) return null;

  const isCorrect = status === "correct";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
        className={`w-full max-w-md rounded-[32px] p-6 md:p-8 flex flex-col items-center text-center shadow-xl border ${
          isCorrect
            ? "bg-[#E4F5EF] border-emerald-500/10"
            : "bg-[#FCECEF] border-rose-500/10"
        }`}
      >
        <div className="mb-4">
          {isCorrect ? (
            <CheckCircle2 className="w-16 h-16 text-emerald-500 stroke-[1.5]" />
          ) : (
            <XCircle className="w-16 h-16 text-rose-400 stroke-[1.5]" />
          )}
        </div>

        <h3 className={`text-xl font-black tracking-wide mb-3 ${
          isCorrect ? "text-emerald-600" : "text-rose-500"
        }`}>
          {isCorrect ? t.kamuBenar : t.kurangTepat}
        </h3>

        {question && (
          <div className="w-full bg-white/60 rounded-xl p-3 mb-4 text-left border border-brand-100/50">
            <p className="text-xs font-semibold text-brand-700/60 mb-1">{t.soalCounter.replace("{current}", "").replace("{total}", "").trim()}</p>
            <p className="text-sm font-bold text-brand-900 leading-snug">{question}</p>
          </div>
        )}

        <div className="w-full flex flex-col gap-2 mb-5">
          {selectedAnswer && (
            <div className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium ${
              isCorrect
                ? "bg-emerald-100/80 text-emerald-800"
                : "bg-rose-100/80 text-rose-800"
            }`}>
              <span>{t.jawabanMu || "Jawabanmu"}:</span>
              <span className="font-bold">{selectedAnswer}</span>
            </div>
          )}
          {!isCorrect && correctAnswer && (
            <div className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium bg-emerald-100/80 text-emerald-800">
              <span>{t.jawabanBenar}:</span>
              <span className="font-bold">{correctAnswer}</span>
            </div>
          )}
        </div>

        {explanation && (
          <div className={`w-full rounded-xl p-4 mb-5 text-left border ${
            isCorrect ? "bg-emerald-50/80 border-emerald-200/60" : "bg-brand-50 border-brand-200/60"
          }`}>
            <p className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 mb-1.5 ${
              isCorrect ? "text-emerald-600" : "text-brand-700"
            }`}>
              <Lightbulb className="w-3.5 h-3.5" /> {t.penjelasanJawaban}
            </p>
            <p className="text-sm font-medium text-brand-900/90 leading-relaxed whitespace-pre-line">{explanation}</p>
          </div>
        )}

        <button
          onClick={onNext}
          className={`text-xs font-bold px-8 py-3 rounded-xl transition-all active:scale-95 shadow-md ${
            isLast
              ? "bg-emerald-600 text-white hover:bg-emerald-500"
              : "bg-brand-900 text-white hover:bg-brand-700"
          }`}
        >
          {isLast ? t.selesaiBtn : t.selanjutnya}
        </button>
      </motion.div>
    </div>
  );
}
