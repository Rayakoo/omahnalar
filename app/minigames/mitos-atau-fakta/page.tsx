"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Gamepad2, ArrowLeft, Sparkles, Clock, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { MITOS_FAKTA_QUESTIONS, type MitosFaktaQuestion } from "@/data/mitosFaktaQuestions";

type AnswerType = "MITOS" | "FAKTA";
type GamePhase = "welcome" | "playing" | "finished";

const TIME_LIMIT = 20;

const CATEGORY_ICONS: Record<string, string> = {
  "Stigma & Victim Blaming": "\u{1F6E1}\uFE0F",
  "Kerahasiaan & Keamanan Data": "\u{1F510}",
  "Hak Korban & Akses Layanan": "\u{2696}\uFE0F",
  "Peran Pendamping & Komunitas": "\u{1F91D}",
  "Sistem Digital & Fitur Tracking": "\u{1F4BB}",
  "Bentuk Kekerasan Seksual": "\u{1F4D6}",
};

function getScoreMessage(pct: number) {
  if (pct === 100) return { emoji: "\u{1F31F}", title: "Sempurna!", sub: "Kamu memahami semua topik dengan sangat baik." };
  if (pct >= 80) return { emoji: "\u{1F389}", title: "Luar Biasa!", sub: "Pemahaman kamu tentang pelaporan digital sangat baik." };
  if (pct >= 60) return { emoji: "\u{1F44D}", title: "Bagus!", sub: "Terus tingkatkan pemahamanmu tentang hak korban." };
  if (pct >= 40) return { emoji: "\u{1F4DA}", title: "Terus Belajar!", sub: "Baca kembali penjelasan untuk memperdalam pemahaman." };
  return { emoji: "\u{1F4AA}", title: "Jangan Menyerah!", sub: "Setiap langkah belajar adalah kemajuan yang berarti." };
}

export default function MitosAtauFaktaPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<GamePhase>("welcome");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownKey, setCountdownKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<AnswerType | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [animClass, setAnimClass] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isTimeout, setIsTimeout] = useState(false);

  const questions = MITOS_FAKTA_QUESTIONS;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleStart = useCallback(() => {
    setCountdown(3);
    setCountdownKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown < 0) {
      setCountdown(null);
      setPhase("playing");
      setCurrentIndex(0);
      setAnswers(new Array(totalQuestions).fill(null));
      setScore(0);
      setSelected(null);
      setRevealed(false);
      setTimeLeft(TIME_LIMIT);
      setIsTimeout(false);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 800);
    return () => clearTimeout(t);
  }, [countdown, totalQuestions]);

  const handleAnswer = useCallback((choice: AnswerType | null) => {
    if (revealed) return;
    const isTimeoutAnswer = choice === null;
    const correct = !isTimeoutAnswer && choice === currentQuestion.answer;
    setSelected(choice);
    setIsCorrect(correct);
    setIsTimeout(isTimeoutAnswer);
    if (isTimeoutAnswer) {
      setAnimClass("animate-[pulse_0.5s_ease-in-out]");
      setTimeout(() => {
        setRevealed(true);
        setTimeout(() => setShowExplanation(true), 200);
      }, 300);
    } else {
      setAnimClass(correct ? "scale-[1.03]" : "animate-[wiggle_0.4s_ease-in-out]");
      setTimeout(() => setAnimClass(""), 500);
      setTimeout(() => {
        setRevealed(true);
        if (correct) setScore((s) => s + 1);
        setTimeout(() => setShowExplanation(true), 200);
      }, 350);
    }
  }, [revealed, currentQuestion]);

  const handleNext = useCallback(() => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selected;
    const correctCount = newAnswers.reduce((acc, a, i) => {
      if (a === questions[i]?.answer) return acc + 1;
      return acc;
    }, 0);

    if (currentIndex >= totalQuestions - 1) {
      setPhase("finished");
      if (correctCount / totalQuestions >= 0.6) {
        setTimeout(() => setShowConfetti(true), 500);
      }
      return;
    }

    setScore(correctCount);
    setAnswers(newAnswers);
    setCurrentIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
    setShowExplanation(false);
    setTimeLeft(TIME_LIMIT);
    setIsTimeout(false);
  }, [currentIndex, totalQuestions, answers, selected, questions]);

  // Timer
  useEffect(() => {
    if (phase !== "playing" || revealed) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleAnswer(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, revealed, currentIndex]);

  // Timer color
  const timerPct = timeLeft / TIME_LIMIT;
  const timerColor =
    timerPct > 0.5
      ? "#7C78A8"
      : timerPct > 0.25
        ? "#E4B56A"
        : "#FB7185";
  const timerBg = timerPct > 0.5 ? "rgba(124,120,168,0.15)" : timerPct > 0.25 ? "rgba(228,181,106,0.2)" : "rgba(251,113,133,0.2)";
  const timerPulse = timerPct <= 0.25 ? "animate-[timer-pulse_1s_ease-in-out_infinite]" : "";
  const circumference = 188;
  const offset = circumference - timerPct * circumference;

  if (countdown !== null) {
    return <CountdownOverlay value={countdown} key={countdownKey} />;
  }

  if (phase === "welcome") {
    return <WelcomeScreen questions={questions} onStart={handleStart} onBack={() => router.back()} />;
  }

  if (phase === "finished") {
    const allAnswers = [...answers];
    allAnswers[currentIndex] = selected;
    const finalScore = allAnswers.reduce((acc, a, i) => {
      if (a === questions[i]?.answer) return acc + 1;
      return acc;
    }, 0);
    return (
      <ResultScreen
        questions={questions}
        answers={allAnswers}
        score={finalScore}
        showConfetti={showConfetti}
        onRestart={handleStart}
        onBack={() => router.push("/minigames")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased text-brand-900 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary-500/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-brand-100/20 blur-3xl" />
      </div>

      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-2 h-2 rounded-full bg-brand-700/20 animate-[float_6s_ease-in-out_infinite]" style={{ top: "15%", left: "10%" }} />
        <div className="absolute w-3 h-3 rounded-full bg-secondary-500/20 animate-[float_8s_ease-in-out_infinite_1s]" style={{ top: "25%", right: "15%" }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-brand-700/15 animate-[float_7s_ease-in-out_infinite_2s]" style={{ bottom: "30%", left: "20%" }} />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-rose-300/20 animate-[float_9s_ease-in-out_infinite_0.5s]" style={{ bottom: "20%", right: "10%" }} />
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-brand-100 relative">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-brand-700 hover:text-brand-900 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
            <span className="text-xs text-brand-700/60 font-medium">
              Soal {currentIndex + 1} / {totalQuestions}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-brand-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                background: "linear-gradient(90deg, #7C78A8, #FAC775)",
              }}
            />
          </div>

          {/* Dots */}
          <div className="flex gap-1 mt-1.5 justify-center">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-500"
                style={{
                  width: i <= currentIndex ? "14px" : "5px",
                  height: "5px",
                  background: i <= currentIndex
                    ? "linear-gradient(90deg, #7C78A8, #FAC775)"
                    : "rgba(124,120,168,0.12)",
                }}
              />
            ))}
          </div>

          {/* Timer & Category row */}
          <div className="flex items-center justify-between mt-3">
            {/* Category */}
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-500"
                style={{
                  background: timerBg,
                  color: timerColor,
                }}
              >
                <span>{CATEGORY_ICONS[currentQuestion.category] || "\u{1F4CC}"}</span>
                {currentQuestion.category}
              </span>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-2 transition-all duration-500 ${timerPulse}`}>
              <svg width="36" height="36" viewBox="0 0 64 64" className="transform -rotate-90">
                <circle cx="32" cy="32" r="30" fill="none" stroke={timerBg} strokeWidth="4" />
                <circle
                  cx="32" cy="32" r="30" fill="none"
                  stroke={timerColor} strokeWidth="4"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: offset,
                    transition: "stroke-dashoffset 1s linear, stroke 0.5s ease",
                  }}
                />
              </svg>
              <span
                className="text-sm font-bold tabular-nums transition-colors duration-500"
                style={{ color: timerColor }}
              >
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-start justify-center px-4 pb-8 relative z-10">
        <div className="w-full max-w-2xl mx-auto mt-16">
          {/* Question card */}
          <div
            className="bg-white rounded-2xl border shadow-sm p-6 md:p-8 mb-4 relative overflow-hidden transition-all duration-500"
            style={{
              borderColor: "var(--color-brand-100)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.02] pointer-events-none">
              <Sparkles className="w-full h-full text-brand-900" />
            </div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-tr from-brand-100/40 to-transparent pointer-events-none" />

            {/* Question number badge */}
            <div className="inline-flex items-center gap-1.5 bg-brand-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-4">
              <span className="text-secondary-500">#{currentIndex + 1}</span>
            </div>

            <p className="text-lg md:text-xl font-semibold text-brand-900 leading-relaxed relative z-10">
              &ldquo;{currentQuestion.statement}&rdquo;
            </p>

            {/* Timer urgency indicator */}
            {timerPct <= 0.25 && !revealed && (
              <div className="absolute top-3 right-3 flex items-center gap-1 text-rose-500 text-[10px] font-bold animate-[pulse_1s_ease-in-out_infinite]">
                <AlertTriangle className="w-3 h-3" /> CEPAT!
              </div>
            )}
          </div>

          {/* Answer buttons */}
          <div className={`grid grid-cols-2 transition-all duration-300 ${revealed ? "gap-2 mb-0" : "gap-6 mb-6"}`}>
            {(["MITOS", "FAKTA"] as const).map((choice) => {
              const isMitos = choice === "MITOS";
              const isSelected = selected === choice;
              const isRevealedCorrect = revealed && choice === currentQuestion.answer;

              let btnStyle = "";
              if (isTimeout && !isSelected) {
                btnStyle = isMitos
                  ? "border-rose-200 bg-rose-50/30 text-rose-300"
                  : "border-emerald-200 bg-emerald-50/30 text-emerald-300";
              } else if (!revealed) {
                btnStyle = isMitos
                  ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-300 hover:shadow-2xl hover:-translate-y-2 hover:shadow-rose-300/60 active:scale-[0.98] cursor-pointer"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-2xl hover:-translate-y-2 hover:shadow-emerald-300/60 active:scale-[0.98] cursor-pointer";
              } else if (isRevealedCorrect) {
                btnStyle = isMitos
                  ? "border-rose-500 bg-rose-100 text-rose-800 ring-2 ring-rose-300"
                  : "border-emerald-500 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300";
              } else if (isSelected && !isCorrect) {
                btnStyle = "border-red-300 bg-red-50 text-red-600 ring-2 ring-red-200";
              } else {
                btnStyle = isMitos
                  ? "border-rose-200 bg-rose-50/50 text-rose-400 opacity-40"
                  : "border-emerald-200 bg-emerald-50/50 text-emerald-400 opacity-40";
              }

              const disableClick = revealed || (timeLeft === 0 && !revealed);

              return (
                <button
                  key={choice}
                  onClick={() => handleAnswer(choice)}
                  disabled={disableClick}
                  className={`relative rounded-2xl text-center font-bold transition-all duration-300 ${btnStyle} ${animClass} disabled:cursor-default select-none ${
                    revealed ? "p-3 border-2" : "py-20 px-4 border-4"
                  }`}
                >
                  {/* Hover shimmer */}
                  {!revealed && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 rounded-xl pointer-events-none" />
                  )}

                  <div className={`relative z-10 transition-all duration-300 ${revealed ? "text-base" : "text-5xl mb-2"}`}>
                    {revealed
                      ? isRevealedCorrect
                        ? "\u2705"
                        : isSelected
                          ? "\u274C"
                          : isMitos
                            ? "\u26A0\uFE0F"
                            : "\u{1F4A1}"
                      : isTimeout
                        ? "\u23F3"
                        : isMitos
                          ? "\u{1F6AB}"
                          : "\u2714\uFE0F"}
                  </div>
                  <span className={`relative z-10 transition-all duration-300 ${
                    revealed ? "text-xs" : "text-3xl font-extrabold"
                  }`}>
                    {revealed && isRevealedCorrect ? "✓ Benar" : choice}
                  </span>
                  {isTimeout && !revealed && (
                    <div className="absolute inset-0 flex items-center justify-center text-rose-500/20">
                      <Clock className="w-16 h-16" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Timer warning bar */}
          {timerPct <= 0.25 && !revealed && (
            <div className="flex items-center justify-center gap-2 mb-3 animate-[fade-in_0.3s_ease-out]">
              <div className="h-1 flex-1 max-w-xs rounded-full bg-rose-200 overflow-hidden">
                <div className="h-full rounded-full bg-rose-500 animate-[timer-shrink_1s_linear_infinite]" style={{ width: `${timerPct * 100}%` }} />
              </div>
            </div>
          )}

          {/* Explanation */}
          <div
            className="mt-3"
            style={{
              maxHeight: showExplanation ? "600px" : "0",
              overflow: "hidden",
              transition: "max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div
              className="bg-white rounded-2xl border border-brand-100 shadow-sm p-5 mb-4"
              style={{
                opacity: showExplanation ? 1 : 0,
                transform: showExplanation ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.4s ease 0.1s",
              }}
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                isTimeout
                  ? "bg-rose-100 text-rose-700"
                  : isCorrect
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
              }`}>
                {isTimeout
                  ? "\u23F3 Waktu habis!"
                  : isCorrect
                    ? "\u{1F389} Benar!"
                    : `\u{1F4CC} Jawabannya adalah ${currentQuestion.answer}`}
              </div>

              <p className="text-sm text-brand-700/80 leading-relaxed mb-4">
                {currentQuestion.explanation}
              </p>

              <div className="bg-brand-100/50 rounded-xl p-4 border-l-4 border-brand-700">
                <div className="flex items-start gap-2">
                  <span className="text-brand-700 text-sm flex-shrink-0 mt-0.5">💡</span>
                  <div>
                    <div className="text-brand-700 text-xs font-bold uppercase tracking-wider mb-1">
                      Pesan Kunci
                    </div>
                    <p className="text-sm text-brand-900/80 leading-relaxed">
                      {currentQuestion.keyMessage}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-md relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, #7C78A8, #4A4763)",
                opacity: showExplanation ? 1 : 0,
                transform: showExplanation ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.4s ease 0.3s",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {currentIndex === totalQuestions - 1 ? "\u{1F3C6} Lihat Hasil" : "Lanjut \u2192"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({
  questions,
  onStart,
  onBack,
}: {
  questions: MitosFaktaQuestion[];
  onStart: () => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased text-brand-900 flex flex-col">
      {/* Hero */}
      <div className="bg-brand-900 text-white py-16 md:py-24 px-6 mt-16 relative overflow-hidden">
        <button onClick={onBack} className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors z-20">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
          Kembali
        </button>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-secondary-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-brand-100/10 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-secondary-500 text-brand-900 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-5">
            <Gamepad2 className="w-3.5 h-3.5" /> Minigames
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-rose-300">Mitos</span>{" "}
            <span className="text-brand-100/60">atau</span>{" "}
            <span className="text-emerald-300">Fakta</span>
            <span className="text-secondary-500">?</span>
          </h1>
          <p className="text-sm md:text-base text-brand-100/70 mt-4 max-w-2xl mx-auto leading-relaxed">
            Pelaporan Kekerasan Seksual Berbasis Digital
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto w-full px-4 mt-8 mb-16">
        <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-6 md:p-8">
          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: "\u{1F4CB}", label: `${questions.length} Soal`, sub: "pertanyaan" },
              { icon: "\u{1F3AF}", label: "Mitos/Fakta", sub: "tipe jawaban" },
              { icon: "\u{1F4DA}", label: "Edukatif", sub: "penjelasan lengkap" },
            ].map((item, i) => (
              <div key={i} className="bg-brand-100/50 rounded-xl p-3 text-center border border-brand-100">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="font-semibold text-brand-900 text-sm">{item.label}</div>
                <div className="text-brand-700/60 text-xs">{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Notice */}
          <div className="bg-brand-100/30 rounded-xl p-4 mb-6 border border-brand-100">
            <div className="flex gap-3">
              <span className="text-lg flex-shrink-0">💜</span>
              <p className="text-sm text-brand-700/80 leading-relaxed">
                Kuis ini bersifat <strong className="text-brand-900">edukatif</strong>, bukan menggali
                pengalaman pribadi. Setiap soal dilengkapi penjelasan rinci untuk membangun pemahaman bersama.
              </p>
            </div>
          </div>

          {/* Timer info */}
          <div className="flex items-center gap-2 mb-6 text-xs text-brand-700/60 justify-center">
            <Clock className="w-3.5 h-3.5" />
            <span>Setiap soal punya batas waktu <strong className="text-brand-900">{TIME_LIMIT} detik</strong></span>
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="w-full py-4 px-8 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-md relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #7C78A8, #4A4763)",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Mulai Kuis
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          <p className="text-center text-brand-700/40 text-xs mt-4">
            Bacaan setelah menjawab, bukan penilaian
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultScreen({
  questions,
  answers,
  score,
  showConfetti,
  onRestart,
  onBack,
}: {
  questions: MitosFaktaQuestion[];
  answers: (AnswerType | null)[];
  score: number;
  showConfetti: boolean;
  onRestart: () => void;
  onBack: () => void;
}) {
  const [animScore, setAnimScore] = useState(0);
  const [showItems, setShowItems] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const total = questions.length;
  const pct = Math.round((score / total) * 100);
  const msg = getScoreMessage(pct);

  useEffect(() => {
    const t1 = setTimeout(() => {
      let n = 0;
      const step = Math.max(1, score / 30);
      const interval = setInterval(() => {
        n = Math.min(n + step, score);
        setAnimScore(Math.round(n));
        if (n >= score) clearInterval(interval);
      }, 40);
    }, 300);
    const t2 = setTimeout(() => setShowItems(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [score]);

  const categoryStats = questions.reduce((acc, q, i) => {
    const cat = q.category;
    if (!acc[cat]) acc[cat] = { correct: 0, total: 0 };
    acc[cat].total++;
    if (answers[i] === q.answer) acc[cat].correct++;
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased text-brand-900 flex flex-col relative overflow-hidden">
      {showConfetti && <Confetti />}

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-brand-100 sticky top-16 z-30 relative">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <button onClick={onBack} className="flex items-center gap-1 text-sm text-brand-700 hover:text-brand-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Minigames
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 py-8 relative z-10">
        {/* Score hero */}
        <div className="text-center mb-8 animate-[fade-in_0.6s_ease-out]">
          <div className="inline-flex items-center justify-center relative mb-4">
            <svg width="140" height="140" viewBox="0 0 100 100" className="-rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(124,120,168,0.15)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="#7C78A8" strokeWidth="6"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 283,
                  strokeDashoffset: 283 - (score / total) * 283,
                  transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl">{msg.emoji}</span>
              <span className="font-bold text-3xl text-brand-900 leading-none">{animScore}</span>
              <span className="text-brand-700/60 text-xs">dari {total}</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-brand-900 mb-1">{msg.title}</h2>
          <p className="text-sm text-brand-700/60 max-w-xs mx-auto">{msg.sub}</p>
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-brand-100 border border-brand-200">
            <span className="font-bold text-brand-700 text-lg">{pct}%</span>
            <span className="text-brand-700/60 text-sm">jawaban benar</span>
          </div>
        </div>

        {/* Category breakdown */}
        <div
          className="bg-white rounded-2xl border border-brand-100 shadow-sm p-5 mb-6"
          style={{
            opacity: showItems ? 1 : 0,
            transform: showItems ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease",
          }}
        >
          <h3 className="font-semibold text-brand-900 mb-4 text-sm uppercase tracking-wider">
            {"\u{1F4CA}"} Performa per Kategori
          </h3>
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([cat, stat]) => {
              const catPct = (stat.correct / stat.total) * 100;
              return (
                <div key={cat}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-brand-700/70 text-xs">{cat}</span>
                    <span className={`text-xs font-semibold ${
                      catPct === 100 ? "text-emerald-600" : catPct >= 50 ? "text-brand-700" : "text-rose-600"
                    }`}>
                      {stat.correct}/{stat.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-brand-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-brand-700 to-secondary-500"
                      style={{ width: showItems ? `${catPct}%` : "0%", transitionDelay: "0.3s" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review */}
        <div
          style={{
            opacity: showItems ? 1 : 0,
            transform: showItems ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease 0.2s",
          }}
        >
          <h3 className="font-semibold text-brand-900 mb-3 text-sm uppercase tracking-wider px-1">
            {"\u{1F4CB}"} Review Semua Soal
          </h3>
          <div className="space-y-2 mb-8">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const correct = userAns === q.answer;
              const isOpen = expandedId === q.id;

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-xl border border-brand-100 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? null : q.id)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-brand-50 transition-colors"
                  >
                    <span className="font-bold text-sm text-brand-700/40 w-6 flex-shrink-0">{i + 1}</span>
                    <span className="text-base flex-shrink-0">{correct ? "\u2705" : "\u274C"}</span>
                    <span className="text-sm text-brand-700/80 flex-1 truncate">{q.statement}</span>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      q.answer === "FAKTA"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}>
                      {q.answer}
                    </span>
                    <svg
                      width="16" height="16" viewBox="0 0 20 20" fill="currentColor"
                      className="text-brand-700/30 flex-shrink-0 transition-transform duration-200"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div style={{
                    maxHeight: isOpen ? "300px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.35s ease",
                  }}>
                    <div className="px-4 pb-4 border-t border-brand-100">
                      <p className="text-sm text-brand-700/70 leading-relaxed mt-3">{q.explanation}</p>
                      <div className="bg-brand-100/50 rounded-lg p-3 mt-3 border-l-4 border-brand-700">
                        <p className="text-sm text-brand-900/70 leading-relaxed">
                          <span className="text-brand-700 font-semibold">💡 </span>
                          {q.keyMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <button
            onClick={onRestart}
            className="w-full py-4 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-md relative overflow-hidden group"
            style={{ background: "linear-gradient(135deg, #7C78A8, #4A4763)" }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {"\u{1F504}"} Ulangi Kuis
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
          <p className="text-center text-brand-700/40 text-xs mt-4">
            Bagikan pengetahuan ini kepada orang-orang di sekitarmu 💜
          </p>
        </div>
      </div>
    </div>
  );
}

function CountdownOverlay({ value }: { value: number }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-900">
      <div className="text-center">
        {value > 0 ? (
          <span
            key={value}
            className="text-9xl md:text-[12rem] font-extrabold text-white drop-shadow-xl inline-block"
            style={{ animation: "countdown-pop 0.6s ease-out forwards" }}
          >
            {value}
          </span>
        ) : (
          <span
            className="text-8xl md:text-9xl font-extrabold text-secondary-500 drop-shadow-lg inline-block"
            style={{ animation: "fade-in 0.4s ease-out" }}
          >
            Go!
          </span>
        )}
      </div>
    </div>
  );
}

function Confetti() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!particlesRef.current) return;
    const container = particlesRef.current;
    const colors = ["#7C78A8", "#FAC775", "#F07A94", "#E6E4F9", "#6BBF8A"];
    const elements: HTMLDivElement[] = [];

    for (let i = 0; i < 40; i++) {
      const el = document.createElement("div");
      const size = 5 + Math.random() * 8;
      el.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: -10px;
        width: ${Math.random() > 0.5 ? size : size * 2}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        animation: confetti-fall ${2 + Math.random() * 3}s ease-in ${Math.random() * 2}s forwards;
        pointer-events: none;
      `;
      container.appendChild(el);
      elements.push(el);
    }

    return () => elements.forEach((el) => el.remove());
  }, []);

  return <div ref={particlesRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden" />;
}
