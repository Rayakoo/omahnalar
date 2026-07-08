"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Gamepad2, ArrowLeft, Clock, GripHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { PUZZLES, type PuzzleData } from "@/data/puzzleData";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";
import PlayerNamePrompt from "@/components/PlayerNamePrompt";
import { usePlayerName } from "@/contexts/PlayerNameContext";
import { saveMinigameResult } from "@/services/minigames";

type GamePhase = "welcome" | "playing" | "finished";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function PuzzlePage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.puzzle : en.puzzle;
  const common = locale === "id" ? id.common : en.common;
  const min = locale === "id" ? id.minigames : en.minigames;
  const { playerName } = usePlayerName();

  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [phase, setPhase] = useState<GamePhase>("welcome");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownKey, setCountdownKey] = useState(0);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [placedPieces, setPlacedPieces] = useState<(number | null)[]>([null, null, null, null, null]);
  const [remainingPieces, setRemainingPieces] = useState<number[]>([]);
  const [completedPuzzle, setCompletedPuzzle] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalTimeMs, setFinalTimeMs] = useState(0);
  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const [allPuzzleTimes, setAllPuzzleTimes] = useState<number[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const puzzleStartRef = useRef<number | null>(null);

  const currentPuzzle = PUZZLES[currentPuzzleIndex];
  const totalPuzzles = PUZZLES.length;

  const initPuzzle = useCallback((puzzle: PuzzleData) => {
    setPlacedPieces(new Array(puzzle.pieces.length).fill(null));
    const indices = puzzle.pieces.map((_, i) => i);
    const shuffled = shuffleArray(indices);
    setRemainingPieces(shuffled);
    setCompletedPuzzle(false);
    setShowFact(false);
  }, []);

  const handleStart = useCallback(() => {
    setShowNamePrompt(true);
  }, []);

  const handleNameConfirm = useCallback(() => {
    setShowNamePrompt(false);
    setCountdown(3);
    setCountdownKey((k) => k + 1);
  }, []);

  const handlePieceDragStart = useCallback((pieceIndex: number) => {
    setDraggingPiece(pieceIndex);
  }, []);

  const handlePieceDragEnd = useCallback(() => {
    setDraggingPiece(null);
  }, []);

  const handleSlotDrop = useCallback(
    (slotIndex: number) => {
      if (draggingPiece === null) return;
      if (placedPieces[slotIndex] !== null) return;

      const newPlaced = [...placedPieces];
      newPlaced[slotIndex] = draggingPiece;
      setPlacedPieces(newPlaced);

      const newRemaining = remainingPieces.filter((p) => p !== draggingPiece);
      setRemainingPieces(newRemaining);
      setDraggingPiece(null);

      const allCorrect = currentPuzzle.correctOrder.every((correctIdx, i) => newPlaced[i] === correctIdx);
      if (allCorrect || newRemaining.length === 0) {
        setCompletedPuzzle(true);
        if (puzzleStartRef.current !== null) {
          const puzzleTime = Date.now() - puzzleStartRef.current;
          setAllPuzzleTimes((prev) => [...prev, puzzleTime]);
        }
        setTimeout(() => {
          setShowCompletion(true);
          setTimeout(() => setShowFact(true), 600);
        }, 400);
      }
    },
    [draggingPiece, placedPieces, remainingPieces, currentPuzzle]
  );

  const handleRemoveFromSlot = useCallback(
    (slotIndex: number) => {
      if (completedPuzzle) return;
      const piece = placedPieces[slotIndex];
      if (piece === null) return;

      const newPlaced = [...placedPieces];
      newPlaced[slotIndex] = null;
      setPlacedPieces(newPlaced);
      setRemainingPieces((prev) => [...prev, piece]);
    },
    [placedPieces, completedPuzzle]
  );

  const handleNextPuzzle = useCallback(() => {
    setShowCompletion(false);
    if (currentPuzzleIndex >= totalPuzzles - 1) {
      const timeMs = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
      if (startTimeRef.current !== null) {
        setFinalTimeMs(timeMs);
      }
      const totalCompleted = allPuzzleTimes.length + 1;
      saveMinigameResult({
        player_name: playerName || "Unknown",
        minigame: "puzzle",
        score: totalCompleted,
        total: totalPuzzles,
        time_ms: timeMs,
        wrong: totalPuzzles - totalCompleted,
      });
      setPhase("finished");
      return;
    }
    const next = currentPuzzleIndex + 1;
    setCurrentPuzzleIndex(next);
    initPuzzle(PUZZLES[next]);
    puzzleStartRef.current = Date.now();
  }, [currentPuzzleIndex, totalPuzzles, initPuzzle, playerName, allPuzzleTimes]);

  const handleSkip = useCallback(() => {
    handleNextPuzzle();
  }, [handleNextPuzzle]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown < 0) {
      setCountdown(null);
      setPhase("playing");
      setCurrentPuzzleIndex(0);
      initPuzzle(PUZZLES[0]);
      startTimeRef.current = Date.now();
      puzzleStartRef.current = Date.now();
      setElapsedMs(0);
      setFinalTimeMs(0);
      setAllPuzzleTimes([]);
      return;
    }
    const tm = setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 800);
    return () => clearTimeout(tm);
  }, [countdown, initPuzzle]);

  useEffect(() => {
    if (phase !== "playing" || startTimeRef.current === null) return;
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current!);
    }, 200);
    return () => clearInterval(id);
  }, [phase]);

  if (showNamePrompt) {
    return <PlayerNamePrompt onStart={handleNameConfirm} />;
  }

  if (countdown !== null) {
    return <CountdownOverlay value={countdown} key={countdownKey} />;
  }

  if (phase === "welcome") {
    return <WelcomeScreen onStart={handleStart} onBack={() => router.back()} />;
  }

  if (phase === "finished") {
    const totalPlaced = allPuzzleTimes.length;
    const allComplete = totalPlaced === totalPuzzles;
    return (
      <ResultScreen
        totalPuzzles={totalPuzzles}
        completedCount={totalPlaced}
        finalTimeMs={finalTimeMs}
        allComplete={allComplete}
        onRestart={() => { router.refresh(); }}
        onBack={() => router.push("/minigames")}
      />
    );
  }

  const slotCount = currentPuzzle.pieces.length;

  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased text-brand-900 flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary-500/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-brand-100/20 blur-3xl" />
      </div>

      <div className="bg-white/80 backdrop-blur-md border-b border-brand-100 relative z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.push("/minigames")}
              className="flex items-center gap-1 text-sm text-brand-700 hover:text-brand-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> {common.back}
            </button>
            <span className="text-xs text-brand-700/60 font-medium">
              {t.soal} {currentPuzzleIndex + 1} / {totalPuzzles}
            </span>
          </div>

          <div className="h-2 bg-brand-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentPuzzleIndex + 1) / totalPuzzles) * 100}%`,
                background: "linear-gradient(90deg, #6BBF8A, #FAC775)",
              }}
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "rgba(107,191,138,0.15)", color: "#6BBF8A" }}
            >
              {currentPuzzle.category}
            </span>
            <span className="text-xs text-brand-700/60 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(elapsedMs)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-lg mx-auto">
          {!showCompletion ? (
            <>
              <p className="text-center text-sm text-brand-700/60 mb-6">
                {locale === "id"
                  ? "Seret potongan kata ke slot yang tepat untuk menyusun kalimat yang benar"
                  : "Drag word pieces to the correct slots to form the correct sentence"}
              </p>

              {/* Drop target slots */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {Array.from({ length: slotCount }, (_, i) => {
                  const placedPiece = placedPieces[i];
                  const isCorrect = placedPiece !== null && currentPuzzle.correctOrder[i] === placedPiece;
                  return (
                    <DropSlot
                      key={i}
                      index={i}
                      pieceText={placedPiece !== null ? currentPuzzle.pieces[placedPiece] : null}
                      isCorrect={isCorrect}
                      isLocked={completedPuzzle}
                      onDrop={() => handleSlotDrop(i)}
                      onRemove={() => handleRemoveFromSlot(i)}
                    />
                  );
                })}
              </div>

              {/* Draggable pieces */}
              <div className="flex flex-wrap justify-center gap-3">
                {remainingPieces.map((pieceIdx) => (
                  <DraggablePiece
                    key={pieceIdx}
                    pieceIndex={pieceIdx}
                    text={currentPuzzle.pieces[pieceIdx]}
                    onDragStart={() => handlePieceDragStart(pieceIdx)}
                    onDragEnd={handlePieceDragEnd}
                  />
                ))}
              </div>

              {remainingPieces.length === 0 && !completedPuzzle && (
                <button
                  onClick={() => {
                    setCompletedPuzzle(true);
                    const startTime = puzzleStartRef.current;
                    if (startTime !== null) {
                      setAllPuzzleTimes((prev) => [...prev, Date.now() - startTime]);
                    }
                    setTimeout(() => setShowCompletion(true), 300);
                  }}
                  className="mt-8 w-full py-4 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-md relative overflow-hidden group"
                  style={{ background: "linear-gradient(135deg, #6BBF8A, #3D7A57)" }}
                >
                  <span className="relative z-10">{t.selesai}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              )}
            </>
          ) : (
            /* Completion overlay */
            <div
              className="bg-white rounded-2xl border border-brand-100 shadow-lg p-6 md:p-8 text-center"
              style={{ animation: "fade-in 0.4s ease-out" }}
            >
              <div className="text-4xl mb-3">{completedPuzzle ? "🎉" : "💪"}</div>
              <h3 className="text-xl font-bold text-brand-900 mb-2">
                {completedPuzzle
                  ? locale === "id" ? "Puzzle Terselesaikan!" : "Puzzle Completed!"
                  : locale === "id" ? "Semua Potongan Terpasang" : "All Pieces Placed"}
              </h3>
              <p className="text-sm text-brand-700/60 mb-4">
                {currentPuzzleIndex + 1} / {totalPuzzles} {locale === "id" ? "puzzle selesai" : "puzzles done"}
              </p>

              {/* Fact display */}
              <div
                style={{
                  maxHeight: showFact ? "300px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.5s ease",
                  marginBottom: showFact ? "1rem" : "0",
                }}
              >
                <div
                  className="bg-brand-100/50 rounded-xl p-4 border border-brand-200 text-left"
                  style={{
                    opacity: showFact ? 1 : 0,
                    transform: showFact ? "translateY(0)" : "translateY(10px)",
                    transition: "all 0.4s ease 0.1s",
                  }}
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-2">
                    💡 {t.faktanya}
                  </div>
                  <p className="text-sm text-brand-800 leading-relaxed">
                    {locale === "id" ? currentPuzzle.fact : currentPuzzle.factEn}
                  </p>
                </div>
              </div>

              <button
                onClick={handleNextPuzzle}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-md relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #6BBF8A, #3D7A57)",
                  opacity: showFact ? 1 : 0.5,
                }}
                disabled={!showFact}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {currentPuzzleIndex === totalPuzzles - 1 ? "🏆 " + t.lihatHasil : t.lanjutkan + " →"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>

              <button
                onClick={handleSkip}
                className="w-full py-2 mt-2 rounded-xl text-sm font-medium text-brand-700/50 hover:text-brand-700 hover:bg-brand-100/30 transition-colors"
              >
                {currentPuzzleIndex === totalPuzzles - 1
                  ? locale === "id" ? "Lewati ke hasil" : "Skip to results"
                  : locale === "id" ? "Lewati" : "Skip"}
              </button>
            </div>
          )}
        </div>
      </div>

      {showCompletion && <Confetti />}
    </div>
  );
}

function DropSlot({
  index,
  pieceText,
  isCorrect,
  isLocked,
  onDrop,
  onRemove,
}: {
  index: number;
  pieceText: string | null;
  isCorrect: boolean;
  isLocked: boolean;
  onDrop: () => void;
  onRemove: () => void;
}) {
  const [isOver, setIsOver] = useState(false);

  let bg = "bg-white border-dashed border-2 border-brand-200";
  let textColor = "text-brand-700/40";
  if (pieceText !== null) {
    if (isLocked) {
      bg = isCorrect
        ? "bg-emerald-100 border-2 border-emerald-300"
        : "bg-amber-100 border-2 border-amber-300";
      textColor = isCorrect ? "text-emerald-700" : "text-amber-700";
    } else {
      bg = "bg-brand-100 border-2 border-brand-300";
      textColor = "text-brand-800";
    }
  }
  if (isOver && !pieceText) {
    bg = "bg-brand-100 border-2 border-brand-500 border-dashed";
  }

  return (
    <div
      className={`relative rounded-xl px-4 py-3 min-w-[80px] min-h-[44px] flex items-center justify-center text-sm font-semibold transition-all duration-200 cursor-pointer select-none ${bg} ${textColor}`}
      style={{ boxShadow: pieceText ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        onDrop();
      }}
      onClick={() => {
        if (pieceText && !isLocked) onRemove();
      }}
    >
      {pieceText ? (
        <span>{pieceText}</span>
      ) : (
        <span className="text-xs">
          {index + 1}
        </span>
      )}
      {isLocked && isCorrect && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
          ✓
        </span>
      )}
    </div>
  );
}

function DraggablePiece({
  pieceIndex,
  text,
  onDragStart,
  onDragEnd,
}: {
  pieceIndex: number;
  text: string;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart();
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={() => {
        setIsDragging(false);
        onDragEnd();
      }}
      className="relative rounded-xl px-4 py-3 bg-white border-2 border-brand-200 text-sm font-semibold text-brand-800 cursor-grab active:cursor-grabbing select-none transition-all duration-200 hover:border-brand-400 hover:shadow-md hover:-translate-y-0.5"
      style={{
        opacity: isDragging ? 0.5 : 1,
        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
      }}
    >
      <GripHorizontal className="w-3.5 h-3.5 text-brand-300 absolute top-1.5 left-1/2 -translate-x-1/2" />
      <span className="mt-2 block">{text}</span>
    </div>
  );
}

function CountdownOverlay({ value }: { value: number }) {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.puzzle : en.puzzle;
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
            {t.go}
          </span>
        )}
      </div>
    </div>
  );
}

function WelcomeScreen({
  onStart,
  onBack,
}: {
  onStart: () => void;
  onBack: () => void;
}) {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.puzzle : en.puzzle;
  const common = locale === "id" ? id.common : en.common;
  const min = locale === "id" ? id.minigames : en.minigames;

  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased text-brand-900 flex flex-col">
      <div className="bg-brand-900 text-white py-16 md:py-24 px-6 mt-16 relative overflow-hidden">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors z-20"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          {common.back}
        </button>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-brand-100/10 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-secondary-500 text-brand-900 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-5">
            <Gamepad2 className="w-3.5 h-3.5" /> {min.badge}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-emerald-300">Puzzle</span>{" "}
            <span className="text-brand-100/60">Edukasi</span>
          </h1>
          <p className="text-sm md:text-base text-brand-100/70 mt-4 max-w-2xl mx-auto leading-relaxed">
            {t.desc}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 mt-8 mb-16">
        <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: "🧩", label: `${PUZZLES.length} ${t.soal}`, sub: t.pieces },
              { icon: "👆", label: t.dragDrop, sub: t.seretSusun },
              { icon: "📖", label: t.edukatif, sub: t.penjelasanLengkap },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-brand-100/50 rounded-xl p-3 text-center border border-brand-100"
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="font-semibold text-brand-900 text-sm">{item.label}</div>
                <div className="text-brand-700/60 text-xs">{item.sub}</div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-200">
            <div className="flex gap-3">
              <span className="text-lg flex-shrink-0">💡</span>
              <p className="text-sm text-emerald-800/80 leading-relaxed">{t.tooltip}</p>
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full py-4 px-8 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-md relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #6BBF8A, #3D7A57)",
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {t.mulai}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          <p className="text-center text-brand-700/40 text-xs mt-4">{t.footerNote}</p>
        </div>
      </div>
    </div>
  );
}

function ResultScreen({
  totalPuzzles,
  completedCount,
  finalTimeMs,
  allComplete,
  onRestart,
  onBack,
}: {
  totalPuzzles: number;
  completedCount: number;
  finalTimeMs: number;
  allComplete: boolean;
  onRestart: () => void;
  onBack: () => void;
}) {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.puzzle : en.puzzle;
  const common = locale === "id" ? id.common : en.common;
  const min = locale === "id" ? id.minigames : en.minigames;
  const [animScore, setAnimScore] = useState(0);
  const [showItems, setShowItems] = useState(false);

  const pct = totalPuzzles > 0 ? Math.round((completedCount / totalPuzzles) * 100) : 0;

  let message = { emoji: "💪", title: t.terusBelajar };
  if (allComplete) message = { emoji: "🎉", title: t.lengkap };
  else if (pct >= 60) message = { emoji: "👍", title: t.bagus };

  useEffect(() => {
    const t1 = setTimeout(() => {
      let n = 0;
      const step = Math.max(1, completedCount / 30);
      const interval = setInterval(() => {
        n = Math.min(n + step, completedCount);
        setAnimScore(Math.round(n));
        if (n >= completedCount) clearInterval(interval);
      }, 40);
    }, 300);
    const t2 = setTimeout(() => setShowItems(true), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [completedCount]);

  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased text-brand-900 flex flex-col relative overflow-hidden">
      <div className="bg-white/80 backdrop-blur-md border-b border-brand-100 sticky top-16 z-30 relative">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-brand-700 hover:text-brand-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {common.back} ke {min.badge}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 py-8 relative z-10">
        <div className="text-center mb-8" style={{ animation: "fade-in 0.6s ease-out" }}>
          <div className="inline-flex items-center justify-center relative mb-4">
            <svg width="140" height="140" viewBox="0 0 100 100" className="-rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(107,191,138,0.15)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="#6BBF8A" strokeWidth="6"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 283,
                  strokeDashoffset: 283 - (completedCount / totalPuzzles) * 283,
                  transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl">{message.emoji}</span>
              <span className="font-bold text-3xl text-brand-900 leading-none">{animScore}</span>
              <span className="text-brand-700/60 text-xs">{t.dari} {totalPuzzles}</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-brand-900 mb-1">{message.title}</h2>
          <p className="text-sm text-brand-700/60">
            {allComplete
              ? t.semuaBenar
              : `${completedCount} ${t.dari} ${totalPuzzles} ${t.potonganTersusun}`}
          </p>
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-brand-100 border border-brand-200">
            <span className="font-bold text-brand-700 text-lg">{pct}%</span>
            <span className="text-brand-700/60 text-sm">{t.persenBenar}</span>
          </div>
          {finalTimeMs > 0 && (
            <div className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 rounded-full bg-brand-100 border border-brand-200">
              <Clock className="w-3.5 h-3.5 text-brand-700/60" />
              <span className="text-brand-700/60 text-sm">{t.waktuPengerjaan}:</span>
              <span className="font-bold text-brand-700 text-sm">{formatTime(finalTimeMs)}</span>
            </div>
          )}
        </div>

        <div
          style={{
            opacity: showItems ? 1 : 0,
            transform: showItems ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease",
          }}
        >
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-md relative overflow-hidden group"
            style={{ background: "linear-gradient(135deg, #6BBF8A, #3D7A57)" }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              🔄 {t.ulangi}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
          <button
            onClick={onBack}
            className="w-full py-2.5 mt-2 rounded-xl text-sm font-medium text-brand-700/70 hover:text-brand-900 hover:bg-brand-100/50 transition-colors"
          >
            {t.kembaliMinigames}
          </button>
        </div>
      </div>
    </div>
  );
}

function Confetti() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!particlesRef.current) return;
    const container = particlesRef.current;
    const colors = ["#6BBF8A", "#FAC775", "#7C78A8", "#F07A94", "#E6E4F9"];
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
