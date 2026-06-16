"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Gamepad2, ArrowLeft, ChevronRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { CROSSWORD_CLUES, GRID_ROWS, GRID_COLS, buildGrid, type Clue } from "@/data/crosswordData";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

type GamePhase = "welcome" | "playing" | "finished";

const STORAGE_KEY = "omahnalar-tts-progress";

interface CrosswordCell {
  answer: string;
  number: number | null;
  active: boolean;
}

function getCellsForClue(clue: Clue): { row: number; col: number }[] {
  const cells: { row: number; col: number }[] = [];
  let r = clue.row;
  let c = clue.col;
  for (let i = 0; i < clue.answer.length; i++) {
    if (r < GRID_ROWS && c < GRID_COLS) {
      cells.push({ row: r, col: c });
      if (clue.direction === "across") c++;
      else r++;
    }
  }
  return cells;
}

function mergeLockedCells(answers: string[][] | null): string[][] {
  const grid = buildGrid();
  const merged = grid.map((row) => row.map(() => ""));
  if (answers) {
    for (let r = 0; r < Math.min(answers.length, merged.length); r++) {
      for (let c = 0; c < Math.min(answers[r].length, merged[r].length); c++) {
        merged[r][c] = answers[r][c];
      }
    }
  }
  for (const clue of CROSSWORD_CLUES) {
    const cells = getCellsForClue(clue);
    if (cells.length > 0) merged[cells[0].row][cells[0].col] = clue.answer[0];
  }
  return merged;
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function loadProgress(): string[][] | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function saveProgress(grid: string[][]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
  } catch {}
}

function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export default function TTSPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = locale === "id" ? id.tts : en.tts;
  const common = locale === "id" ? id.common : en.common;
  const [phase, setPhase] = useState<GamePhase>("welcome");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownKey, setCountdownKey] = useState(0);
  const [grid] = useState<CrosswordCell[][]>(buildGrid);
  const initAnswers = useCallback(() => {
    return mergeLockedCells(loadProgress());
  }, []);
  const [userAnswers, setUserAnswers] = useState<string[][]>(initAnswers);
  const [activeClue, setActiveClue] = useState<Clue | null>(null);
  const [focusCell, setFocusCell] = useState<{ row: number; col: number } | null>(null);
  const [completedClues, setCompletedClues] = useState<Set<number>>(new Set());
  const [showCompletion, setShowCompletion] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalTimeMs, setFinalTimeMs] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);
  const activeClueRef = useRef(activeClue);

  useEffect(() => { activeClueRef.current = activeClue; }, [activeClue]);

  const acrossClues = CROSSWORD_CLUES.filter((c) => c.direction === "across");
  const downClues = CROSSWORD_CLUES.filter((c) => c.direction === "down");
  const totalClues = CROSSWORD_CLUES.length;

  const lockedCells = useMemo(() => {
    const locked = new Set<string>();
    for (const clue of CROSSWORD_CLUES) {
      const cells = getCellsForClue(clue);
      if (cells.length > 0) locked.add(`${cells[0].row},${cells[0].col}`);
    }
    return locked;
  }, []);

  useEffect(() => {
    inputRefs.current = Array.from({ length: GRID_ROWS }, () =>
      Array.from({ length: GRID_COLS }, () => null)
    );
  }, []);

  useEffect(() => {
    if (focusCell && inputRefs.current[focusCell.row]?.[focusCell.col]) {
      inputRefs.current[focusCell.row][focusCell.col]?.focus();
    }
  }, [focusCell]);

  const focusFirstCell = useCallback((clue: Clue) => {
    const cells = getCellsForClue(clue);
    if (cells.length > 0) {
      setFocusCell(cells[0]);
    }
  }, []);

  const getNextCell = useCallback(
    (row: number, col: number, clue: Clue): { row: number; col: number } | null => {
      const cells = getCellsForClue(clue);
      const idx = cells.findIndex((c) => c.row === row && c.col === col);
      if (idx >= 0 && idx < cells.length - 1) {
        return cells[idx + 1];
      }
      return null;
    },
    []
  );

  const getPrevCell = useCallback(
    (row: number, col: number, clue: Clue): { row: number; col: number } | null => {
      const cells = getCellsForClue(clue);
      const idx = cells.findIndex((c) => c.row === row && c.col === col);
      if (idx > 0) {
        return cells[idx - 1];
      }
      return null;
    },
    []
  );

  const checkClueComplete = useCallback(
    (clue: Clue, answers: string[][]): boolean => {
      const cells = getCellsForClue(clue);
      for (const cell of cells) {
        const userChar = answers[cell.row]?.[cell.col]?.toUpperCase() || "";
        const answerChar = grid[cell.row][cell.col].answer;
        if (userChar !== answerChar) return false;
      }
      return true;
    },
    [grid]
  );

  const checkAllClues = useCallback(
    (answers: string[][]): Set<number> => {
      const completed = new Set<number>();
      for (const clue of CROSSWORD_CLUES) {
        if (checkClueComplete(clue, answers)) {
          completed.add(clue.id);
        }
      }
      return completed;
    },
    [checkClueComplete]
  );

  const handleCellChange = useCallback(
    (row: number, col: number, value: string, clue: Clue) => {
      const char = value.slice(-1).toUpperCase();
      const newAnswers = userAnswers.map((r) => [...r]);
      newAnswers[row][col] = char;
      setUserAnswers(newAnswers);
      saveProgress(newAnswers);

      const completed = checkAllClues(newAnswers);
      setCompletedClues(completed);

      if (completed.size === totalClues) {
        clearProgress();
        if (startTimeRef.current !== null) {
          setFinalTimeMs(Date.now() - startTimeRef.current);
        }
        setTimeout(() => setShowCompletion(true), 600);
        return;
      }

      if (char && grid[row][col].answer === char) {
        const next = getNextCell(row, col, clue);
        if (next) {
          setFocusCell(next);
        } else {
          const nextClueIdx = CROSSWORD_CLUES.findIndex((c) => c.id === clue.id) + 1;
          if (nextClueIdx < CROSSWORD_CLUES.length) {
            const nextClue = CROSSWORD_CLUES[nextClueIdx];
            setActiveClue(nextClue);
            focusFirstCell(nextClue);
          }
        }
      } else if (!char) {
        const prev = getPrevCell(row, col, clue);
        if (prev) setFocusCell(prev);
      }
    },
    [userAnswers, grid, checkAllClues, getNextCell, getPrevCell, focusFirstCell, totalClues]
  );

  const handleCellKeyDown = useCallback(
    (e: React.KeyboardEvent, row: number, col: number, clue: Clue) => {
      if (e.key === "Backspace") {
        if (!userAnswers[row][col]) {
          const cells = getCellsForClue(clue);
          const idx = cells.findIndex((c) => c.row === row && c.col === col);
          let prevIdx = idx - 1;
          while (prevIdx >= 0 && lockedCells.has(`${cells[prevIdx].row},${cells[prevIdx].col}`)) {
            prevIdx--;
          }
          if (prevIdx >= 0) {
            const prev = cells[prevIdx];
            const newAnswers = userAnswers.map((r) => [...r]);
            newAnswers[prev.row][prev.col] = "";
            setUserAnswers(newAnswers);
            saveProgress(newAnswers);
            setCompletedClues(checkAllClues(newAnswers));
            setFocusCell(prev);
          }
        }
        return;
      }

      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        let tr = row, tc = col;
        if (e.key === "ArrowUp") tr = Math.max(0, row - 1);
        if (e.key === "ArrowDown") tr = Math.min(GRID_ROWS - 1, row + 1);
        if (e.key === "ArrowLeft") tc = Math.max(0, col - 1);
        if (e.key === "ArrowRight") tc = Math.min(GRID_COLS - 1, col + 1);
        if ((tr !== row || tc !== col) && grid[tr][tc].active) {
          setFocusCell({ row: tr, col: tc });
        }
      }
    },
    [userAnswers, getCellsForClue, lockedCells, checkAllClues, grid]
  );

  const handleCellFocus = useCallback((row: number, col: number) => {
    setFocusCell({ row, col });

    const containingClues = CROSSWORD_CLUES.filter((c) =>
      getCellsForClue(c).some((cc) => cc.row === row && cc.col === col)
    );
    if (containingClues.length === 0) return;

    const current = activeClueRef.current;
    if (current && containingClues.some((c) => c.id === current.id)) return;

    const across = containingClues.find((c) => c.direction === "across");
    setActiveClue(across || containingClues[0]);
  }, []);

  const handleClueClick = useCallback(
    (clue: Clue) => {
      setActiveClue(clue);
      focusFirstCell(clue);
    },
    [focusFirstCell]
  );

  const handleStart = useCallback(() => {
    setCountdown(3);
    setCountdownKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown < 0) {
      setCountdown(null);
      setPhase("playing");
      startTimeRef.current = Date.now();
      setElapsedMs(0);
      setFinalTimeMs(0);
      const saved = loadProgress();
      if (saved) {
        setUserAnswers(mergeLockedCells(saved));
        const completed = checkAllClues(mergeLockedCells(saved));
        setCompletedClues(completed);
      }
      setTimeout(() => {
        if (CROSSWORD_CLUES.length > 0) {
          setActiveClue(CROSSWORD_CLUES[0]);
          focusFirstCell(CROSSWORD_CLUES[0]);
        }
      }, 100);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 800);
    return () => clearTimeout(t);
  }, [countdown, checkAllClues, focusFirstCell]);

  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setUserAnswers(mergeLockedCells(saved));
      const completed = checkAllClues(mergeLockedCells(saved));
      setCompletedClues(completed);
    }
  }, [checkAllClues]);

  useEffect(() => {
    if (phase !== "playing" || startTimeRef.current === null) return;
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current!);
    }, 200);
    return () => clearInterval(id);
  }, [phase]);

  const handleReset = useCallback(() => {
    const empty = Array.from({ length: GRID_ROWS }, () =>
      Array.from({ length: GRID_COLS }, () => "")
    );
    for (const clue of CROSSWORD_CLUES) {
      const cells = getCellsForClue(clue);
      if (cells.length > 0) empty[cells[0].row][cells[0].col] = clue.answer[0];
    }
    setUserAnswers(empty);
    setCompletedClues(new Set());
    setActiveClue(CROSSWORD_CLUES[0]);
    clearProgress();
    if (CROSSWORD_CLUES.length > 0) {
      focusFirstCell(CROSSWORD_CLUES[0]);
    }
  }, [focusFirstCell]);

  if (countdown !== null) {
    return <CountdownOverlay value={countdown} key={countdownKey} />;
  }

  if (phase === "welcome") {
    return <WelcomeScreen onStart={handleStart} onBack={() => router.back()} />;
  }

  if (!activeClue) return null;

  const activeCells = getCellsForClue(activeClue);

  const completedCells = new Set<string>();
  for (const clue of CROSSWORD_CLUES) {
    if (!completedClues.has(clue.id)) continue;
    for (const cell of getCellsForClue(clue)) {
      completedCells.add(`${cell.row},${cell.col}`);
    }
  }

  let finishLetterCorrect = 0;
  let finishLetterTotal = 0;
  if (phase === "finished") {
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (grid[r][c].active) {
          finishLetterTotal++;
          if ((userAnswers[r]?.[c] || "").toUpperCase() === grid[r][c].answer) {
            finishLetterCorrect++;
          }
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-brand-50 font-sans antialiased text-brand-900 flex flex-col relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-brand-100 relative z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/minigames")}
              className="flex items-center gap-1 text-sm text-brand-700 hover:text-brand-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> {common.back}
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-brand-700/60 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(elapsedMs)}
              </span>
              <span className="text-xs text-brand-700/60 font-medium">
                {completedClues.size}/{totalClues} {t.soalTerjawab}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Grid panel */}
          <div className="flex-shrink-0 flex flex-col items-center w-full lg:w-auto">
            <div className="w-full max-w-full overflow-x-auto pb-2 scrollbar-thin" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div
                className="inline-grid gap-[2px] bg-slate-900 rounded-md p-[2px] shadow-lg"
                style={{
                  gridTemplateColumns: `repeat(${GRID_COLS}, 32px)`,
                }}
              >
                {Array.from({ length: GRID_ROWS }, (_, r) =>
                  Array.from({ length: GRID_COLS }, (_, c) => {
                    const cell = grid[r][c];
                    const isActive = cell.active;
                    const isFocused = focusCell?.row === r && focusCell?.col === c;
                    const isInActiveClue = activeCells.some((ac) => ac.row === r && ac.col === c);
                    const userChar = userAnswers[r]?.[c] || "";
                    const isCorrectLetter = isActive && userChar.toUpperCase() === cell.answer;
                    const isInCompletedClue = completedCells.has(`${r},${c}`);
                    const isLocked = lockedCells.has(`${r},${c}`);

                    const hasGreen = isInCompletedClue || (userChar && isCorrectLetter);

                    let cellBg = "bg-white";
                    let cellBorder = "border border-slate-300";
                    let cellRing = "";
                    let cellText = "text-brand-900";

                    if (isLocked) {
                      cellBg = "bg-amber-100";
                      cellBorder = "border border-amber-300";
                      cellText = "text-amber-800";
                    } else if (isFocused) {
                      cellBg = "bg-amber-200";
                      cellBorder = "border border-amber-400";
                      cellRing = "ring-2 ring-amber-400/60";
                    } else if (hasGreen) {
                      cellBg = "bg-emerald-100";
                      cellBorder = "border border-emerald-300";
                      cellText = "text-emerald-700";
                    } else if (isInActiveClue) {
                      cellBg = "bg-brand-100/60";
                    }

                    return (
                      <div
                        key={`${r}-${c}`}
                        className="relative"
                        style={{ width: 32, height: 32 }}
                      >
                        {isActive ? (
                          <input
                            ref={(el) => {
                              if (!inputRefs.current[r]) inputRefs.current[r] = [];
                              inputRefs.current[r][c] = el;
                            }}
                            type="text"
                            maxLength={1}
                            value={userChar}
                            readOnly={isLocked}
                            onChange={(e) => handleCellChange(r, c, e.target.value, activeClue)}
                            onKeyDown={(e) => handleCellKeyDown(e, r, c, activeClue)}
                            onFocus={() => handleCellFocus(r, c)}
                            className={`w-full h-full text-center font-bold text-xs uppercase outline-none transition-colors duration-100 ${cellBg} ${cellBorder} ${cellRing} ${cellText}`}
                            autoComplete="off"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900" />
                        )}
                        {cell.number && (
                          <span className="absolute top-[1px] left-[2px] text-[7px] font-bold text-slate-500 pointer-events-none select-none leading-none">
                            {cell.number}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
            </div>
          </div>
          </div>

          {/* Clues panel */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Active clue card */}
            <div className="bg-white rounded-xl border border-brand-100 shadow-sm p-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-900 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  {activeClue.number}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700/60">
                    {activeClue.direction === "across" ? t.mendatar : t.menurun}
                  </span>
                  <p className="text-sm font-semibold text-brand-900 mt-0.5 leading-relaxed">
                    {activeClue.question}
                  </p>
                  <p className="text-xs text-brand-700/50 mt-0.5">
                    {activeClue.answer.length} {t.huruf}
                  </p>
                </div>
              </div>
            </div>

            {/* Clue lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-brand-700/80 mb-2 flex items-center gap-1.5">
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                  {t.mendatar}
                </h3>
                <div className="space-y-0.5">
                  {acrossClues.map((clue) => {
                    const isCompleted = completedClues.has(clue.id);
                    const isActive = activeClue?.id === clue.id;
                    return (
                      <button
                        key={clue.id}
                        onClick={() => handleClueClick(clue)}
                        className={`w-full text-left flex items-start gap-2 p-2 rounded-lg transition-all duration-150 ${
                          isActive
                            ? "bg-amber-100 ring-1 ring-amber-400"
                            : isCompleted
                              ? "bg-emerald-50"
                              : "hover:bg-brand-100/30"
                        }`}
                      >
                        <span className={`text-xs font-bold w-5 flex-shrink-0 mt-0.5 ${
                          isCompleted ? "text-emerald-600" : isActive ? "text-amber-700" : "text-brand-700/50"
                        }`}>
                          {clue.number}.
                        </span>
                        <span className={`text-xs leading-relaxed flex-1 ${
                          isCompleted ? "text-emerald-700 line-through decoration-emerald-300" : isActive ? "text-brand-900 font-semibold" : "text-brand-700/70"
                        }`}>
                          {clue.question}
                        </span>
                        {isCompleted && (
                          <span className="text-emerald-500 text-xs flex-shrink-0 mt-0.5">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-brand-700/80 mb-2 flex items-center gap-1.5">
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  {t.menurun}
                </h3>
                <div className="space-y-0.5">
                  {downClues.map((clue) => {
                    const isCompleted = completedClues.has(clue.id);
                    const isActive = activeClue?.id === clue.id;
                    return (
                      <button
                        key={clue.id}
                        onClick={() => handleClueClick(clue)}
                        className={`w-full text-left flex items-start gap-2 p-2 rounded-lg transition-all duration-150 ${
                          isActive
                            ? "bg-amber-100 ring-1 ring-amber-400"
                            : isCompleted
                              ? "bg-emerald-50"
                              : "hover:bg-brand-100/30"
                        }`}
                      >
                        <span className={`text-xs font-bold w-5 flex-shrink-0 mt-0.5 ${
                          isCompleted ? "text-emerald-600" : isActive ? "text-amber-700" : "text-brand-700/50"
                        }`}>
                          {clue.number}.
                        </span>
                        <span className={`text-xs leading-relaxed flex-1 ${
                          isCompleted ? "text-emerald-700 line-through decoration-emerald-300" : isActive ? "text-brand-900 font-semibold" : "text-brand-700/70"
                        }`}>
                          {clue.question}
                        </span>
                        {isCompleted && (
                          <span className="text-emerald-500 text-xs flex-shrink-0 mt-0.5">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleReset}
                className="text-xs text-brand-700/50 hover:text-brand-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-100/30"
              >
                {t.resetJawaban}
              </button>
              <button
                onClick={() => {
                  if (startTimeRef.current !== null) {
                    setFinalTimeMs(Date.now() - startTimeRef.current);
                  }
                  setPhase("finished");
                  setTimeout(() => setShowCompletion(false), 100);
                }}
                className="px-5 py-2 rounded-xl font-bold text-xs text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md relative overflow-hidden group"
                style={{ background: "linear-gradient(135deg, #7C78A8, #4A4763)" }}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {t.selesai} <ChevronRight className="w-3 h-3" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Completion overlay */}
      {showCompletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Confetti />
          <div
            className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl"
            style={{ animation: "fade-in 0.4s ease-out" }}
          >
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-brand-900 mb-2">{t.selamat}</h2>
            <p className="text-sm text-brand-700/70 mb-2 leading-relaxed">
              {t.allComplete}<br />{t.completed}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-medium mb-6">
              <Clock className="w-3 h-3" />
              {t.waktuPengerjaan}: {formatTime(finalTimeMs)}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowCompletion(false);
                  setPhase("finished");
                }}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: "linear-gradient(135deg, #7C78A8, #4A4763)" }}
              >
                {t.lihatHasil}
              </button>
              <button
                onClick={() => setShowCompletion(false)}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-brand-700/70 hover:text-brand-900 hover:bg-brand-100/50 transition-colors"
              >
                {t.lanjutkan}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finished result screen */}
      {phase === "finished" && (
        <ResultScreen
          correctLetters={finishLetterCorrect}
          totalLetters={finishLetterTotal}
          totalClues={totalClues}
          completedClues={completedClues.size}
          finalTimeMs={finalTimeMs}
          onRestart={() => { clearProgress(); router.refresh(); }}
          onBack={() => router.push("/minigames")}
        />
      )}
    </div>
  );
}

function CountdownOverlay({ value }: { value: number }) {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.tts : en.tts;
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
  const t = locale === "id" ? id.tts : en.tts;
  const common = locale === "id" ? id.common : en.common;
  const min = locale === "id" ? id.minigames : en.minigames;
  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased text-brand-900 flex flex-col">
      <div className="bg-brand-900 text-white py-16 md:py-24 px-6 mt-16 relative overflow-hidden">
        <button onClick={onBack} className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors z-20">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
          {common.back}
        </button>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-secondary-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-brand-100/10 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-secondary-500 text-brand-900 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-5">
            <Gamepad2 className="w-3.5 h-3.5" /> {min.badge}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-secondary-500">Teka Teki</span>{" "}
            <span className="text-brand-100/60">Silang</span>
          </h1>
          <p className="text-sm md:text-base text-brand-100/70 mt-4 max-w-2xl mx-auto leading-relaxed">
            {locale === "id" ? "Isi kotak-kotak kosong dengan jawaban yang tepat berdasarkan petunjuk yang diberikan" : "Fill in the blanks with the correct answers based on the clues provided"}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 mt-8 mb-16">
        <div className="bg-white rounded-2xl border border-brand-100 shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: "📋", label: `${CROSSWORD_CLUES.length} ${locale === "id" ? "Soal" : "Questions"}`, sub: t.tekaTeki },
              { icon: "✏️", label: t.ketikJawaban, sub: t.inputHuruf },
              { icon: "📖", label: t.edukatif, sub: t.penjelasanLengkap },
            ].map((item, i) => (
              <div key={i} className="bg-brand-100/50 rounded-xl p-3 text-center border border-brand-100">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="font-semibold text-brand-900 text-sm">{item.label}</div>
                <div className="text-brand-700/60 text-xs">{item.sub}</div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-200">
            <div className="flex gap-3">
              <span className="text-lg flex-shrink-0">💡</span>
              <p className="text-sm text-amber-800/80 leading-relaxed">
                {t.tooltip}
              </p>
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full py-4 px-8 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-md relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #7C78A8, #4A4763)",
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
        </div>
      </div>
    </div>
  );
}

function ResultScreen({
  correctLetters,
  totalLetters,
  totalClues,
  completedClues,
  finalTimeMs,
  onRestart,
  onBack,
}: {
  correctLetters: number;
  totalLetters: number;
  totalClues: number;
  completedClues: number;
  finalTimeMs: number;
  onRestart: () => void;
  onBack: () => void;
}) {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.tts : en.tts;
  const common = locale === "id" ? id.common : en.common;
  const [animScore, setAnimScore] = useState(0);
  const [showItems, setShowItems] = useState(false);

  const allComplete = completedClues === totalClues;
  const pct = totalLetters > 0 ? Math.round((correctLetters / totalLetters) * 100) : 0;

  useEffect(() => {
    const t1 = setTimeout(() => {
      let n = 0;
      const step = Math.max(1, correctLetters / 30);
      const interval = setInterval(() => {
        n = Math.min(n + step, correctLetters);
        setAnimScore(Math.round(n));
        if (n >= correctLetters) clearInterval(interval);
      }, 40);
    }, 300);
    const t2 = setTimeout(() => setShowItems(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [correctLetters]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl w-full"
        style={{ animation: "fade-in 0.4s ease-out" }}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center relative mb-4">
            <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(124,120,168,0.15)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="#7C78A8" strokeWidth="6"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 283,
                  strokeDashoffset: 283 - (correctLetters / totalLetters) * 283,
                  transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl">{allComplete ? "🎉" : pct >= 60 ? "👍" : "💪"}</span>
              <span className="font-bold text-3xl text-brand-900 leading-none">{animScore}</span>
              <span className="text-brand-700/60 text-xs">{t.dari} {totalLetters}</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-brand-900 mb-1">
            {allComplete ? t.lengkap : pct >= 60 ? t.bagus : t.terusBelajar}
          </h2>
          <p className="text-sm text-brand-700/60">
            {allComplete
              ? t.allComplete
              : `${completedClues} ${t.dari} ${totalClues} ${t.soalBenar}`}
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
            style={{ background: "linear-gradient(135deg, #7C78A8, #4A4763)" }}
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
