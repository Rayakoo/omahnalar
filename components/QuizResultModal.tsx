"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Zap } from "lucide-react";

interface QuizResultModalProps {
  isOpen: boolean;
  status: "correct" | "wrong";
  onNext: () => void;
  isLast: boolean;
}

export default function QuizResultModal({ isOpen, status, onNext, isLast }: QuizResultModalProps) {
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
          {isCorrect ? "Kamu Benar!" : "Kurang Tepat"}
        </h3>

        <p className="text-xs md:text-sm text-brand-900/80 font-medium leading-relaxed mb-6 max-w-[320px]">
          {isCorrect
            ? "Tubuhmu adalah otoritasmu sendiri. Tidak peduli siapa mereka, sentuhan tanpa persetujuan adalah pelanggaran batasan."
            : "Pilihanmu menunjukkan keraguan. Ingat, rasa tidak nyaman adalah sinyal valid dari tubuhmu. Kamu berhak berkata 'Tidak'."
          }
        </p>

        <div className="w-full bg-[#FFF9EE] border border-[#FCE5BF] rounded-2xl p-4 text-left flex flex-col gap-1.5 mb-6 shadow-inner">
          <div className="flex items-center gap-1.5 text-amber-600 font-extrabold text-[10px] md:text-xs uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500 stroke-[2.5]" />
            <span>Pelajaran Penting</span>
          </div>
          <p className="text-[10px] md:text-xs text-brand-700/80 leading-relaxed font-normal">
            {isCorrect
              ? "Konsep 'Consent' atau persetujuan bersifat aktif dan bisa ditarik kapan saja, bahkan dalam hubungan dekat sekalipun."
              : "Psikolog menyebut ini sebagai Personal Space Awareness. Mengenali sinyal tubuh membantu kita membangun pertahanan mental yang lebih kuat."
            }
          </p>
          {!isCorrect && (
            <p className="text-[9px] md:text-[10px] text-rose-500/70 font-semibold mt-1">
              Statistik: 70% orang merasa sulit menolak teman dekat.
            </p>
          )}
        </div>

        <button
          onClick={onNext}
          className={`text-xs font-bold px-8 py-3 rounded-xl transition-all active:scale-95 shadow-md ${
            isLast
              ? "bg-emerald-600 text-white hover:bg-emerald-500"
              : "bg-brand-900 text-white hover:bg-brand-700"
          }`}
        >
          {isLast ? "Selesai" : "Selanjutnya"}
        </button>
      </motion.div>
    </div>
  );
}
