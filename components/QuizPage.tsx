"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Loader2, AlertTriangle } from "lucide-react";
import { getQuizWithQuestions, upsertQuizResult, type QuizQuestion } from "@/services/quizzes";
import { transformImageUrl } from "@/lib/image";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";
import QuizResultModal from "./QuizResultModal";

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params["id-course"] as string;
  const quizId = params["id-quiz"] as string;
  const { user } = useAuth();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.omahBelajar : en.omahBelajar;
  const common = locale === "id" ? id.common : en.common;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizProgress, setQuizProgress] = useState<Record<string, "correct" | "wrong">>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"correct" | "wrong">("correct");
  const [loading, setLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;
    getQuizWithQuestions(quizId)
      .then((data) => setQuestions(data.questions))
      .catch(() => setErrorPopup(t.gagalSoal))
      .finally(() => setLoadingData(false));
  }, [quizId]);

  const isLastQuestion = currentIdx === questions.length - 1;

  const handleAnswer = (questionId: string, optionText: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionText }));
  };

  const allAnswered = questions.every((q) => quizProgress[q.id] !== undefined);

  const handleSubmit = useCallback(() => {
    const question = questions[currentIdx];
    const selected = selectedAnswers[question.id];
    if (!selected) return;

    if (isLastQuestion) {
      const answeredCount = Object.keys(quizProgress).length;
      if (answeredCount < questions.length - 1) {
        setErrorPopup(t.belumSemua);
        return;
      }
    }

    const status = selected === question.correct_answer ? "correct" : "wrong";
    setQuizProgress((prev) => ({ ...prev, [question.id]: status }));
    setModalStatus(status);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalOpen(true);
    }, 800);
  }, [currentIdx, selectedAnswers, quizProgress, isLastQuestion, questions]);

  const handleModalNext = useCallback(async () => {
    setModalOpen(false);
    if (isLastQuestion) {
      if (user) {
        try {
          await upsertQuizResult({
            user_id: user.id,
            quiz_id: quizId,
            answers: selectedAnswers,
          });
        } catch {}
      }
      const score = Object.values(quizProgress).filter((v) => v === "correct").length;
      router.push(`/omah-belajar/${courseId}/${quizId}/hasil?score=${score}&total=${questions.length}`);
    } else {
      setCurrentIdx((p) => p + 1);
    }
  }, [isLastQuestion, user, quizId, selectedAnswers, router, courseId, quizProgress, questions.length]);

  const getBoxStyle = (qId: string, index: number) => {
    const isCurrent = currentIdx === index;
    const status = quizProgress[qId];

    if (isCurrent) return "bg-brand-900 text-white border-brand-900 ring-4 ring-brand-900/20 z-10";
    if (status === "correct") return "bg-emerald-500 text-white border-emerald-600";
    if (status === "wrong") return "bg-rose-500 text-white border-rose-600";
    return "bg-white text-brand-900 border-gray-200 hover:bg-gray-50";
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-page-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-page-50 flex items-center justify-center text-brand-900 font-sans antialiased p-6">
        <div className="text-center max-w-md bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <p className="text-lg font-bold mb-2">{t.belumSoal}</p>
          <p className="text-sm text-brand-900/70 mb-6">{t.belumSoalDesc}</p>
          <button
            onClick={() => router.push(`/omah-belajar/${courseId}/materi`)}
            className="bg-brand-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-all"
          >
            {t.kembaliCourse}
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const isAnswered = selectedAnswers[currentQuestion.id] !== undefined;
  const isSubmitted = quizProgress[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-page-50 text-brand-900 flex flex-col">
      <nav className="bg-secondary-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <span className="font-bold text-lg">{t.kuisNav}</span>
        <button
          onClick={() => router.push(`/omah-belajar/${courseId}/materi`)}
          className="flex items-center gap-1 bg-brand-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-brand-700 transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" /> {common.back}
        </button>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8 flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:flex-1 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 min-h-[400px] shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-700/60">
              {t.soalCounter.replace("{current}", String(currentIdx + 1)).replace("{total}", String(questions.length))}
            </span>
            {isSubmitted && (
              <span
                className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                  quizProgress[currentQuestion.id] === "correct"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {quizProgress[currentQuestion.id] === "correct" ? t.benarBadge : t.salahBadge}
              </span>
            )}
          </div>

          {currentQuestion.image_url && (
            <div className="mb-4 rounded-xl overflow-hidden border border-gray-200 bg-brand-50">
              <img
                src={transformImageUrl(currentQuestion.image_url)}
                alt="Gambar soal"
                className="w-full max-h-64 object-contain mx-auto"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}

          <p className="text-base md:text-lg font-bold text-brand-900 mb-6">
            {currentQuestion.question_text}
          </p>

          <div className="flex flex-col gap-3 mb-8">
            {currentQuestion.options.map((option, oIdx) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option;
              const isCorrectAnswer = currentQuestion.correct_answer === option;

              let optionStyle = "border-gray-200 bg-white hover:bg-brand-100/30";
              if (isSubmitted) {
                if (isCorrectAnswer) optionStyle = "border-emerald-500 bg-emerald-50";
                else if (isSelected && !isCorrectAnswer) optionStyle = "border-rose-500 bg-rose-50";
                else optionStyle = "border-gray-200 bg-white opacity-50";
              } else if (isSelected) {
                optionStyle = "border-brand-700 bg-brand-100";
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => !isSubmitted && handleAnswer(currentQuestion.id, option)}
                  disabled={isSubmitted}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-sm font-medium text-left transition-all ${optionStyle}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSubmitted
                        ? isCorrectAnswer
                          ? "border-emerald-500 bg-emerald-500"
                          : isSelected
                          ? "border-rose-500 bg-rose-500"
                          : "border-gray-300"
                        : isSelected
                        ? "border-brand-700 bg-brand-700"
                        : "border-gray-300"
                    }`}
                  >
                    {(isSubmitted && isCorrectAnswer) || (isSubmitted && isSelected) || (isSelected && !isSubmitted) ? (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    ) : null}
                  </div>
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-auto flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
              disabled={currentIdx === 0}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-brand-700 hover:bg-brand-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t.sebelumnya}
            </button>

            {loading ? (
              <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-900/60 text-white text-sm font-bold shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.memeriksa}
              </div>
            ) : !isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!isAnswered}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed ${
                  isLastQuestion
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "bg-brand-900 text-white hover:bg-brand-700"
                }`}
              >
                {isLastQuestion ? t.selesaiBtn : t.jawabBtn}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIdx((p) => Math.min(questions.length - 1, p + 1))}
                disabled={currentIdx === questions.length - 1}
                className="px-6 py-2.5 rounded-xl bg-brand-900 text-white text-sm font-bold hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              >
                {t.selanjutnya}
              </button>
            )}
          </div>
        </div>

        <div className="w-full lg:w-72 bg-[#E6E4F9]/60 border border-brand-700/10 rounded-3xl p-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900/60 mb-4">
            {t.nomorSoal}
          </h3>

          <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 gap-3">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`aspect-square w-full rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all duration-200 active:scale-95 shadow-sm ${getBoxStyle(
                  q.id,
                  idx
                )}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex flex-col gap-2 mt-6 pt-4 border-t border-brand-700/10 text-[11px] font-semibold text-brand-700/70">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-brand-900 rounded-sm" /> <span>{t.legendSaatIni}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white border border-gray-300 rounded-sm" /> <span>{t.legendBelum}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm" /> <span>{t.legendBenar}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded-sm" /> <span>{t.legendSalah}</span>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {errorPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-rose-600 text-white px-6 py-4 rounded-2xl shadow-xl"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-bold">{errorPopup}</span>
            <button
              onClick={() => setErrorPopup(null)}
              className="ml-2 text-white/70 hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && (
          <QuizResultModal
            isOpen={modalOpen}
            status={modalStatus}
            onNext={handleModalNext}
            isLast={isLastQuestion}
            question={currentQuestion.question_text}
            selectedAnswer={selectedAnswers[currentQuestion.id]}
            correctAnswer={currentQuestion.correct_answer}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
