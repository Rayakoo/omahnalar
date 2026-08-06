"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Eye, X, CheckCircle2, XCircle } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import TtsGridEditor, { type TtsCellData } from "@/components/tts-grid-editor";
import FindWordGridEditor, { type FindWordItem } from "@/components/findword-grid-editor";
import { buildRandomFillGrid } from "@/lib/grid-utils";
import { transformImageUrl } from "@/lib/image";
import { getNextGlobalUrutanAndIncrement } from "@/services/courses";
import {
  getMinigameById, getTtsClues, getFindWords, getTrueFalseItems,
  getDrawings, getFillBlanks, getMatchPairs, getFlashcards,
  createCourseMinigame, updateCourseMinigame,
  saveTtsClues, saveTrueFalseItems,
  saveDrawings, saveFillBlanks, saveMatchPairs, saveFlashcards,
  getFlashcardBackImage,
  MINIGAME_TYPE_LABELS,
  type CourseMinigame, type MinigameType,
  type TtsClue, type TrueFalseItem,
  type Drawing, type FillBlank, type MatchPairs, type MatchPairItem,
} from "@/services/course-minigames";

export default function MinigameFormPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const minigameId = params.minigameId as string;
  const isNew = minigameId === "new";

  const [title, setTitle] = useState("");
  const [type, setType] = useState<MinigameType>("tts");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  // TTS (visual grid editor)
  const [gridCells, setGridCells] = useState<TtsCellData[]>([]);
  const [ttsClues, setTtsClues] = useState<{ number: number; question: string; answer: string; explanation: string; row: number; col: number; direction: "across" | "down" }[]>([]);
  const [gridEditorKey, setGridEditorKey] = useState(0);

  // Find Word
  const [findWords, setFindWords] = useState<FindWordItem[]>([]);
  const [gridWidth, setGridWidth] = useState(10);
  const [gridHeight, setGridHeight] = useState(10);

  // True/False
  const [tfQuestion, setTfQuestion] = useState("");
  const [tfItems, setTfItems] = useState<TrueFalseItem[]>([]);

  // Drawing
  const [drawings, setDrawings] = useState<Omit<Drawing, "id" | "minigame_id" | "created_at">[]>([]);

  // Fill Blank
  const [fillBlanks, setFillBlanks] = useState<Omit<FillBlank, "id" | "minigame_id" | "created_at">[]>([]);

  // Match Pairs
  const [matchPairs, setMatchPairs] = useState<{
    question: string;
    pair_count: number;
    items: Omit<MatchPairItem, "id" | "match_pairs_id" | "created_at">[];
  }[]>([]);

  // Flashcard
  const [fcBackImage, setFcBackImage] = useState("");
  const [flashcards, setFlashcards] = useState<{ front_image_url: string; correct_answer: string; explanation: string; options: string[] }[]>([]);

  const [nextUrutan, setNextUrutan] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isNew) return;
    getNextGlobalUrutanAndIncrement(courseId).then(setNextUrutan).catch(() => {});
  }, [courseId, isNew]);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setLoaded(true);
      return;
    }
    Promise.all([
      getMinigameById(minigameId),
      getTtsClues(minigameId),
      getFindWords(minigameId),
      getTrueFalseItems(minigameId),
      getDrawings(minigameId),
      getFillBlanks(minigameId),
      getMatchPairs(minigameId),
      getFlashcards(minigameId),
    ])
      .then(([mg, tts, fw, tf, dw, fb, mp, fc]) => {
        setTitle(mg.title);
        setType(mg.type);
        // Load grid dimensions from settings (find_the_word)
        let loadedSettingsWords = false;
        if (mg.settings && typeof mg.settings === "object") {
          const s = mg.settings as Record<string, unknown>;
          if (s.grid_width) setGridWidth(Number(s.grid_width));
          if (s.grid_height) setGridHeight(Number(s.grid_height));
          if (s.words && Array.isArray(s.words) && s.words.length > 0) {
            loadedSettingsWords = true;
            setFindWords((s.words as any[]).map((w: any, i: number) => ({
              id: `l_${i}`,
              question: w.question || "",
              answer: w.answer || "",
              explanation: w.explanation || "",
              row: w.row ?? 0,
              col: w.col ?? 0,
              direction: (w.direction as "across" | "down") || "across",
            })));
          }
        }
        // Fallback: load from minigame_find_word table (legacy, no positions)
        if (!loadedSettingsWords && fw.length > 0) {
          setFindWords(fw.map(({ id, minigame_id, ...rest }, i) => ({
            id: `lk_${i}`,
            question: rest.question || "",
            answer: rest.answer || "",
            explanation: rest.explanation || "",
            row: 0,
            col: 0,
            direction: "across",
          })));
        }
        // Convert saved TTS clues back to grid cells
        if (tts.length > 0) {
          const cellsMap = new Map<string, TtsCellData>();
          // First pass: create cells with letters from all clues
          for (const clue of tts) {
            for (let i = 0; i < clue.answer.length; i++) {
              const r = clue.direction === "across" ? clue.row : clue.row + i;
              const c = clue.direction === "across" ? clue.col + i : clue.col;
              const id = `r${r}c${c}`;
              if (!cellsMap.has(id)) {
                cellsMap.set(id, { id, row: r, col: c, letter: clue.answer[i], clues: [] });
              }
            }
          }
          // Second pass: add clue info to starting cells (may have multiple)
          for (const clue of tts) {
            const id = `r${clue.row}c${clue.col}`;
            const cell = cellsMap.get(id);
            if (cell && !cell.clues.some(c => c.direction === clue.direction)) {
              cell.clues.push({
                number: clue.number,
                direction: clue.direction,
                question: clue.question,
                answer: clue.answer,
                explanation: clue.explanation || "",
              });
            }
          }
          setGridCells(Array.from(cellsMap.values()));
          setGridEditorKey(prev => prev + 1);
        }
        setTfQuestion(tf[0]?.question || "");
        setTfItems(tf[0]?.items || []);
        setDrawings(dw.map(({ id, minigame_id, ...rest }) => rest));
        setFillBlanks(fb.map(({ id, minigame_id, ...rest }) => ({ ...rest, answers: typeof rest.answers === "string" ? JSON.parse(rest.answers) : rest.answers })));
        setMatchPairs(mp.map(({ id, minigame_id, items, ...rest }) => ({
          ...rest,
          items: items.map(({ id, match_pairs_id, ...i }) => i),
        })));
        setFcBackImage(getFlashcardBackImage((mg.settings || {}) as Record<string, unknown>));
        setFlashcards(fc.map(({ id, minigame_id, created_at, ...rest }) => ({
          ...rest,
          explanation: rest.explanation || "",
        })));
      })
      .catch(() => router.push(`/admin/course/${courseId}`))
      .finally(() => { setLoading(false); setLoaded(true); });
  }, [minigameId, isNew, courseId, router]);

  const handleSave = async () => {
    if (saving) return;
    if (!title) { alert("Judul minigame wajib diisi."); return; }
    setSaving(true);
    try {
      let mg: CourseMinigame;
      if (isNew) {
        mg = await createCourseMinigame({ course_id: courseId, title, type, urutan: nextUrutan });
      } else {
        await updateCourseMinigame(minigameId, { title, type });
        mg = await getMinigameById(minigameId);
      }

      switch (type) {
        case "tts": {
          if (ttsClues.length === 0) {
            alert("Belum ada clue yang memiliki nomor dan pertanyaan.");
            setSaving(false);
            return;
          }
          await saveTtsClues(mg.id, ttsClues);
          break;
        }
        case "find_the_word":
          await updateCourseMinigame(mg.id, {
            settings: {
              grid_width: gridWidth,
              grid_height: gridHeight,
              words: findWords.map(({ id, ...rest }) => rest),
            },
          });
          break;
        case "true_or_false":
          await saveTrueFalseItems(mg.id, { question: tfQuestion, items: tfItems });
          break;
        case "drawing":
          await saveDrawings(mg.id, drawings);
          break;
        case "fill_the_blank":
          await saveFillBlanks(mg.id, fillBlanks);
          break;
        case "match_pairs":
          await saveMatchPairs(mg.id, matchPairs);
          break;
        case "flashcard": {
          const cardsToSave = flashcards.filter((c) => c.front_image_url.trim() || c.correct_answer.trim());
          if (cardsToSave.length === 0) {
            alert("Minimal satu kartu dengan gambar dan jawaban.");
            setSaving(false);
            return;
          }
          const normalized = cardsToSave.map((c) => ({
            front_image_url: c.front_image_url,
            correct_answer: c.correct_answer,
            explanation: c.explanation || null,
            options: c.options.map((o) => o.trim()).filter((o) => o !== ""),
          }));
          const incomplete = normalized.find((c) => !c.correct_answer || c.options.length < 2 || !c.options.includes(c.correct_answer));
          if (incomplete) {
            alert("Setiap kartu harus memiliki jawaban benar yang ditandai dan minimal 2 pilihan jawaban.");
            setSaving(false);
            return;
          }
          await updateCourseMinigame(mg.id, { settings: { back_image: fcBackImage } });
          await saveFlashcards(mg.id, normalized);
          break;
        }
      }

      alert("Minigame berhasil disimpan!");
      router.push(`/admin/course/${courseId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCEF] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCEF] font-sans text-[#2C2C2C]">
      <header className="bg-[#FFEAC2] py-4 px-6 md:px-12 flex items-center justify-between shadow-sm relative">
        <div className="flex flex-col items-center mx-auto text-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {isNew ? "Buat Minigame Baru" : "Edit Minigame"}
          </span>
          <h1 className="text-base md:text-lg font-bold text-[#3A3A3A]">{title || "Minigame"}</h1>
        </div>
        <button
          onClick={() => router.push(`/admin/course/${courseId}`)}
          className="absolute right-6 bg-[#3A3852] text-white text-xs px-4 py-1.5 rounded-lg hover:bg-[#4E4B6E] flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Kembali
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="space-y-6">
          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Judul Minigame</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: TTS Kesehatan Reproduksi"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#9792EC] shadow-sm"
            />
          </div>

          {/* Tipe */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Tipe Minigame</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.entries(MINIGAME_TYPE_LABELS) as [MinigameType, string][]).map(([key, label]) => (
                <div
                  key={key}
                  onClick={() => setType(key)}
                  className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${
                    type === key ? "border-[#E75480] bg-[#FFF0F5]" : "border-gray-200 bg-white"
                  }`}
                >
                  <h4 className="font-bold text-sm">{label}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* ── Content by type ── */}
          {type === "tts" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base">Editor Grid TTS</h3>
                <p className="text-xs text-gray-400">Klik (+) untuk menambah kotak, klik kotak untuk edit huruf &amp; clue</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <TtsGridEditor
                  key={gridEditorKey}
                  initialCells={gridCells.length > 0 ? gridCells : undefined}
                  onChange={(clues) => setTtsClues(clues)}
                />
              </div>
            </div>
          )}

          {type === "find_the_word" && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-sm">Dimensi Grid</h3>
                <p className="text-xs text-gray-400">Ukuran grid berlaku untuk semua kata dalam minigame ini.</p>
                <div className="grid grid-cols-2 gap-3 max-w-xs">
                  <div>
                    <label className="text-xs text-gray-500">Lebar</label>
                    <input type="number" value={gridWidth} onChange={(e) => setGridWidth(parseInt(e.target.value) || 10)} min={5} max={30} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Tinggi</label>
                    <input type="number" value={gridHeight} onChange={(e) => setGridHeight(parseInt(e.target.value) || 10)} min={5} max={30} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <FindWordGridEditor
                  key={`${gridWidth}x${gridHeight}-${findWords.length}`}
                  gridWidth={gridWidth}
                  gridHeight={gridHeight}
                  initialWords={findWords}
                  onChange={(words) => setFindWords(words)}
                />
              </div>
            </div>
          )}

          {type === "true_or_false" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Pertanyaan</label>
                <input
                  type="text"
                  value={tfQuestion}
                  onChange={(e) => setTfQuestion(e.target.value)}
                  placeholder="Contoh: Pilih Benar atau Salah untuk pernyataan berikut"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#9792EC] shadow-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base">Daftar Item Benar/Salah</h3>
                <button
                  type="button"
                  onClick={() => setTfItems([...tfItems, { image_url: "", title: "", answer: true, explanation: "" }])}
                  className="inline-flex items-center gap-1 bg-[#3A3852] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#4E4B6E]"
                >
                  <Plus className="w-3 h-3" /> Tambah Item
                </button>
              </div>
              {tfItems.map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Item #{i + 1}</span>
                    <button type="button" onClick={() => setTfItems(tfItems.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Judul / Pernyataan</label>
                    <input type="text" value={item.title} onChange={(e) => { const c = [...tfItems]; c[i] = { ...c[i], title: e.target.value }; setTfItems(c); }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">URL Gambar (opsional)</label>
                      <div className="flex gap-2">
                        <input type="url" value={item.image_url || ""} onChange={(e) => { const c = [...tfItems]; c[i] = { ...c[i], image_url: e.target.value }; setTfItems(c); }} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                        <FileUploader onUploadComplete={(url) => { const c = [...tfItems]; c[i] = { ...c[i], image_url: url }; setTfItems(c); }} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Jawaban</label>
                      <select value={item.answer ? "true" : "false"} onChange={(e) => { const c = [...tfItems]; c[i] = { ...c[i], answer: e.target.value === "true" }; setTfItems(c); }} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                        <option value="true">Benar</option>
                        <option value="false">Salah</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Penjelasan (opsional)</label>
                    <input type="text" value={item.explanation || ""} onChange={(e) => { const c = [...tfItems]; c[i] = { ...c[i], explanation: e.target.value }; setTfItems(c); }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === "drawing" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base">Daftar Gambar</h3>
                <button
                  type="button"
                  onClick={() => setDrawings([...drawings, { question: "", base_image_url: "" }])}
                  className="inline-flex items-center gap-1 bg-[#3A3852] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#4E4B6E]"
                >
                  <Plus className="w-3 h-3" /> Tambah
                </button>
              </div>
              {drawings.map((dw, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Item #{i + 1}</span>
                    <button type="button" onClick={() => setDrawings(drawings.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Soal</label>
                    <input type="text" value={dw.question} onChange={(e) => { const c = [...drawings]; c[i] = { ...c[i], question: e.target.value }; setDrawings(c); }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">URL Gambar Dasar (base image)</label>
                    <div className="flex gap-2">
                      <input type="url" value={dw.base_image_url || ""} onChange={(e) => { const c = [...drawings]; c[i] = { ...c[i], base_image_url: e.target.value }; setDrawings(c); }} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <FileUploader onUploadComplete={(url) => { const c = [...drawings]; c[i] = { ...c[i], base_image_url: url }; setDrawings(c); }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === "fill_the_blank" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base">Daftar Soal Isian</h3>
                <button
                  type="button"
                  onClick={() => setFillBlanks([...fillBlanks, { image_url: "", question: "", answer_count: 1, answers: [""], explanation: "" }])}
                  className="inline-flex items-center gap-1 bg-[#3A3852] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#4E4B6E]"
                >
                  <Plus className="w-3 h-3" /> Tambah Soal
                </button>
              </div>
              {fillBlanks.map((fb, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Soal #{i + 1}</span>
                    <button type="button" onClick={() => setFillBlanks(fillBlanks.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">URL Gambar (opsional)</label>
                    <div className="flex gap-2">
                      <input type="url" value={fb.image_url || ""} onChange={(e) => { const c = [...fillBlanks]; c[i] = { ...c[i], image_url: e.target.value }; setFillBlanks(c); }} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <FileUploader onUploadComplete={(url) => { const c = [...fillBlanks]; c[i] = { ...c[i], image_url: url }; setFillBlanks(c); }} />
                    </div>
                    {fb.image_url && (
                      <div className="mt-2">
                        <img src={fb.image_url} alt="" className="w-full max-w-sm rounded-xl border border-gray-200 bg-gray-50" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Soal</label>
                    <input type="text" value={fb.question} onChange={(e) => { const c = [...fillBlanks]; c[i] = { ...c[i], question: e.target.value }; setFillBlanks(c); }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Jumlah Jawaban</label>
                    <input type="number" value={fb.answer_count} onChange={(e) => { const cnt = parseInt(e.target.value) || 1; const c = [...fillBlanks]; const answers = c[i].answers; while (answers.length < cnt) answers.push(""); c[i] = { ...c[i], answer_count: cnt, answers: answers.slice(0, cnt) }; setFillBlanks(c); }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {fb.answers.map((ans, ai) => (
                        <input key={ai} type="text" value={ans} onChange={(e) => { const c = [...fillBlanks]; c[i].answers[ai] = e.target.value; setFillBlanks(c); }} placeholder={`Jawaban ${ai + 1}`} className="flex-1 min-w-[100px] max-w-[160px] bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Penjelasan (opsional)</label>
                    <input type="text" value={fb.explanation || ""} onChange={(e) => { const c = [...fillBlanks]; c[i] = { ...c[i], explanation: e.target.value }; setFillBlanks(c); }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === "match_pairs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base">Daftar Pasangan</h3>
                <button
                  type="button"
                  onClick={() => setMatchPairs([...matchPairs, { question: "", pair_count: 2, items: [{ pair_code: "A", image_url: "", card_title: "" }, { pair_code: "A", image_url: "", card_title: "" }] }])}
                  className="inline-flex items-center gap-1 bg-[#3A3852] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#4E4B6E]"
                >
                  <Plus className="w-3 h-3" /> Tambah Set
                </button>
              </div>
              {matchPairs.map((mp, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Set #{i + 1}</span>
                    <button type="button" onClick={() => setMatchPairs(matchPairs.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Soal</label>
                    <input type="text" value={mp.question} onChange={(e) => { const c = [...matchPairs]; c[i] = { ...c[i], question: e.target.value }; setMatchPairs(c); }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Jumlah Pasangan</label>
                    <input type="number" value={mp.pair_count} onChange={(e) => { const cnt = parseInt(e.target.value) || 1; const c = [...matchPairs]; const items = c[i].items; const codes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; while (items.length < cnt * 2) { const code = codes[Math.floor(items.length / 2)]; items.push({ pair_code: code, image_url: "", card_title: "" }); } c[i] = { ...c[i], pair_count: cnt, items: items.slice(0, cnt * 2) }; setMatchPairs(c); }} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mp.items.map((item, ii) => (
                      <div key={ii} className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                        <span className="text-xs font-bold text-gray-500">Card {ii + 1} — Kode: {item.pair_code}</span>
                        <div>
                          <label className="text-xs text-gray-500">URL Gambar (opsional)</label>
                          <div className="flex gap-2">
                            <input type="url" value={item.image_url || ""} onChange={(e) => { const c = [...matchPairs]; c[i].items[ii] = { ...c[i].items[ii], image_url: e.target.value }; setMatchPairs(c); }} className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                            <FileUploader onUploadComplete={(url) => { const c = [...matchPairs]; c[i].items[ii] = { ...c[i].items[ii], image_url: url }; setMatchPairs(c); }} />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Judul Card</label>
                          <input type="text" value={item.card_title} onChange={(e) => { const c = [...matchPairs]; c[i].items[ii] = { ...c[i].items[ii], card_title: e.target.value }; setMatchPairs(c); }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === "flashcard" && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-sm">Gambar Kartu Belakang</h3>
                <p className="text-xs text-gray-400">Satu gambar untuk bagian belakang semua kartu.</p>
                <div className="flex gap-2">
                  <input type="url" value={fcBackImage} onChange={(e) => setFcBackImage(e.target.value)} placeholder="URL gambar kartu belakang" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  <FileUploader onUploadComplete={(url) => setFcBackImage(url)} />
                </div>
                {fcBackImage && (
                  <img src={transformImageUrl(fcBackImage)} alt="" className="w-40 h-56 object-cover rounded-xl border border-gray-200 bg-gray-50" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base">Daftar Kartu Depan</h3>
                <button
                  type="button"
                  onClick={() => setFlashcards([...flashcards, { front_image_url: "", correct_answer: "", explanation: "", options: ["", ""] }])}
                  className="inline-flex items-center gap-1 bg-[#3A3852] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#4E4B6E]"
                >
                  <Plus className="w-3 h-3" /> Tambah Kartu
                </button>
              </div>

              {flashcards.map((card, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Kartu #{i + 1}</span>
                    <button type="button" onClick={() => setFlashcards(flashcards.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Gambar Depan</label>
                    <div className="flex gap-2">
                      <input type="url" value={card.front_image_url} onChange={(e) => { const c = [...flashcards]; c[i] = { ...c[i], front_image_url: e.target.value }; setFlashcards(c); }} placeholder="URL gambar kartu depan" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                      <FileUploader onUploadComplete={(url) => { const c = [...flashcards]; c[i] = { ...c[i], front_image_url: url }; setFlashcards(c); }} />
                    </div>
                    {card.front_image_url && (
                      <img src={transformImageUrl(card.front_image_url)} alt="" className="mt-2 w-full max-w-xs h-40 object-contain rounded-xl border border-gray-200 bg-gray-50" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Pilihan Jawaban</label>
                    <div className="space-y-2 mt-1">
                      {card.options.map((opt, oi) => {
                        const letter = String.fromCharCode(65 + oi);
                        const isCorrect = card.correct_answer === opt;
                        return (
                          <div key={oi} className="flex items-center gap-2">
                            <input type="text" value={opt} onChange={(e) => { const c = [...flashcards]; const old = c[i].options[oi]; c[i].options = c[i].options.map((o, x) => x === oi ? e.target.value : o); if (c[i].correct_answer === old) c[i].correct_answer = e.target.value; setFlashcards(c); }} placeholder={`Pilihan ${letter}`} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                            <button type="button" onClick={() => { const c = [...flashcards]; c[i] = { ...c[i], correct_answer: c[i].correct_answer === opt ? "" : opt }; setFlashcards(c); }} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isCorrect ? "border-[#2C2C2C]" : "border-gray-300"}`} title="Tandai sebagai jawaban benar">
                              {isCorrect && <div className="w-3 h-3 bg-[#2C2C2C] rounded-full" />}
                            </button>
                            {card.options.length > 2 && (
                              <button type="button" onClick={() => { const c = [...flashcards]; const removed = c[i].options[oi]; c[i].options = c[i].options.filter((_, x) => x !== oi); if (c[i].correct_answer === removed) c[i].correct_answer = ""; setFlashcards(c); }} className="text-red-400 hover:text-red-600 text-xs font-bold shrink-0 w-5" title="Hapus pilihan">
                                ✕
                              </button>
                            )}
                          </div>
                        );
                      })}
                      <button type="button" onClick={() => { const c = [...flashcards]; c[i].options = [...c[i].options, ""]; setFlashcards(c); }} className="text-xs font-bold text-[#9792EC] hover:text-[#524D85] transition-colors mt-1">
                        + Tambah pilihan
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Penjelasan (opsional)</label>
                    <textarea value={card.explanation} onChange={(e) => { const c = [...flashcards]; c[i] = { ...c[i], explanation: e.target.value }; setFlashcards(c); }} rows={2} placeholder="Penjelasan jawaban kartu ini" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-y" />
                  </div>
                </div>
              ))}
              {flashcards.length === 0 && (
                <p className="text-sm text-gray-400 italic">Belum ada kartu. Klik "Tambah Kartu" untuk mulai.</p>
              )}
            </div>
          )}

          {/* Save + Preview */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-6 py-3.5 bg-white text-[#3A3852] font-bold rounded-2xl border-2 border-[#3A3852] hover:bg-gray-50 flex items-center gap-2 shadow-md transition-all text-sm"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-10 py-3.5 bg-[#E75480] text-white font-bold rounded-2xl hover:bg-[#D0436E] flex items-center gap-2 shadow-md transition-all text-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Minigame"}
            </button>
          </div>

          {/* ── Preview Modal ── */}
          {showPreview && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
              <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
                  <div>
                    <h2 className="font-bold text-lg">{title || "Minigame"}</h2>
                    <p className="text-xs text-gray-400">{MINIGAME_TYPE_LABELS[type]}</p>
                  </div>
                  <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {type === "tts" && (
                    <div className="space-y-6">
                      {gridCells.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Belum ada cell di grid.</p>
                      ) : (
                        <>
                          <div className="w-full max-w-full overflow-x-auto pb-2">
                            {(() => {
                              const minR = Math.min(...gridCells.map(c => c.row));
                              const maxR = Math.max(...gridCells.map(c => c.row));
                              const minC = Math.min(...gridCells.map(c => c.col));
                              const maxC = Math.max(...gridCells.map(c => c.col));
                              const rows = maxR - minR + 1;
                              const cols = maxC - minC + 1;
                              const cellMap = new Map(gridCells.map(c => [c.id, c]));
                              return (
                                <div className="inline-grid gap-[2px] bg-slate-900 rounded-md p-[2px] shadow-lg" style={{ gridTemplateColumns: `repeat(${cols}, 32px)` }}>
                                  {Array.from({ length: rows }, (_, ri) =>
                                    Array.from({ length: cols }, (_, ci) => {
                                      const r = minR + ri, c = minC + ci;
                                      const cell = cellMap.get(`r${r}c${c}`);
                                      if (!cell) return <div key={`${r}-${c}`} className="w-8 h-8 bg-slate-900" />;
                                      return (
                                        <div key={`${r}-${c}`} className="relative w-8 h-8">
                                          <div className="w-full h-full bg-white border border-slate-300 flex items-center justify-center">
                                          <span className="text-xs font-bold text-brand-900">{cell.letter || "."}</span>
                                        </div>
                                        {cell.clues.length === 1 && (
                                          <span className="absolute top-[1px] left-[2px] text-[7px] font-bold text-slate-500 pointer-events-none select-none leading-none">
                                            {cell.clues[0].number}
                                          </span>
                                        )}
                                        {cell.clues.length >= 2 && (
                                          <span className="absolute top-0 left-0.5 text-[6px] font-bold text-slate-500 pointer-events-none select-none leading-tight text-left">
                                            {cell.clues.slice(0, 2).map(c => c.number).join("\n")}
                                          </span>
                                        )}
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700/60 mb-2">Mendatar</h4>
                              {ttsClues.filter(c => c.direction === "across").map(c => (
                                <div key={c.number} className="bg-brand-50 rounded-xl p-3 mb-2">
                                  <span className="text-xs font-bold">{c.number}. </span>
                                  <span className="text-xs">{c.question}</span>
                                  <p className="text-[10px] text-brand-700/50 mt-0.5">{c.answer}</p>
                                </div>
                              ))}
                              {ttsClues.filter(c => c.direction === "across").length === 0 && (
                                <p className="text-xs text-gray-400 italic">Tidak ada clue mendatar.</p>
                              )}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700/60 mb-2">Menurun</h4>
                              {ttsClues.filter(c => c.direction === "down").map(c => (
                                <div key={c.number} className="bg-brand-50 rounded-xl p-3 mb-2">
                                  <span className="text-xs font-bold">{c.number}. </span>
                                  <span className="text-xs">{c.question}</span>
                                  <p className="text-[10px] text-brand-700/50 mt-0.5">{c.answer}</p>
                                </div>
                              ))}
                              {ttsClues.filter(c => c.direction === "down").length === 0 && (
                                <p className="text-xs text-gray-400 italic">Tidak ada clue menurun.</p>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {type === "find_the_word" && (
                    <div className="space-y-4">
                      {(() => {
                        const filledGrid = buildRandomFillGrid(
                          gridWidth,
                          gridHeight,
                          findWords.map(w => ({ answer: w.answer, row: w.row, col: w.col, direction: w.direction }))
                        );
                        return (
                          <div className="w-full max-w-full overflow-x-auto">
                            <div
                              className="inline-grid gap-[2px] bg-slate-900 rounded-md p-[2px] shadow-lg"
                              style={{ gridTemplateColumns: `repeat(${gridWidth}, 28px)` }}
                            >
                              {filledGrid.map((row, ri) =>
                                row.map((cell, ci) => (
                                  <div
                                    key={`${ri}_${ci}`}
                                    className={`w-7 h-7 border flex items-center justify-center text-[10px] font-bold uppercase ${
                                      cell.isAnswer
                                        ? "border-brand-900 bg-white text-brand-900"
                                        : "border-slate-200 bg-gray-50 text-gray-500"
                                    }`}
                                  >
                                    {cell.char}
                                  </div>
                                ))
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">Grid {gridWidth}×{gridHeight}</p>
                          </div>
                        );
                      })()}
                      {findWords.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Belum ada kata.</p>
                      ) : (
                        findWords.map((fw) => (
                          <div key={fw.id} className="bg-brand-50 rounded-2xl p-4">
                            <p className="text-sm font-bold">{fw.question}</p>
                            <p className="text-xs text-brand-700/60 mt-1">
                              {fw.direction === "across" ? "→ Mendatar" : "↓ Menurun"} · posisi ({fw.row}, {fw.col}) · Jawaban: {fw.answer}
                            </p>
                            {fw.explanation && <p className="text-xs text-gray-400 mt-1">{fw.explanation}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {type === "true_or_false" && (
                    <div className="space-y-4">
                      {tfQuestion && <p className="text-sm font-bold text-brand-900">{tfQuestion}</p>}
                      {tfItems.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Belum ada item.</p>
                      ) : (
                        tfItems.map((item, i) => (
                          <div key={i} className="bg-brand-50 rounded-2xl p-4 flex items-start gap-4">
                            {item.image_url && (
                              <img src={item.image_url} alt="" className="w-20 h-20 rounded-xl object-contain bg-gray-100 shrink-0" />
                            )}
                            <div>
                              <p className="text-sm font-bold">{item.title}</p>
                              <span className={`inline-flex items-center gap-1 text-xs font-bold mt-1 ${item.answer ? "text-emerald-600" : "text-red-500"}`}>
                                {item.answer ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {item.answer ? "Benar" : "Salah"}
                              </span>
                              {item.explanation && <p className="text-xs text-gray-400 mt-1">{item.explanation}</p>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {type === "drawing" && (
                    <div className="space-y-4">
                      {drawings.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Belum ada gambar.</p>
                      ) : (
                        drawings.map((dw, i) => (
                          <div key={i} className="bg-brand-50 rounded-2xl p-4">
                            <p className="text-sm font-bold mb-3">{dw.question}</p>
                            {dw.base_image_url && (
                              <img src={dw.base_image_url} alt="" className="w-full max-w-md rounded-xl border border-gray-200" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {type === "fill_the_blank" && (
                    <div className="space-y-4">
                      {fillBlanks.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Belum ada soal.</p>
                      ) : (
                        fillBlanks.map((fb, i) => (
                          <div key={i} className="bg-brand-50 rounded-2xl p-4">
                            <p className="text-sm font-bold mb-3">{fb.question}</p>
                            {fb.image_url && <img src={fb.image_url} alt="" className="w-full max-w-md rounded-xl border border-gray-200 mb-3" />}
                            <div className="flex flex-wrap gap-2">
                              {fb.answers.map((ans, ai) => (
                                <div key={ai} className="min-w-[100px] bg-white border border-dashed border-gray-300 rounded-lg px-3 py-2 text-center">
                                  <span className="text-xs text-gray-400">{ans || `Jawaban ${ai + 1}`}</span>
                                </div>
                              ))}
                            </div>
                            {fb.explanation && <p className="text-xs text-gray-400 mt-2">{fb.explanation}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {type === "match_pairs" && (
                    <div className="space-y-4">
                      {matchPairs.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Belum ada set pasangan.</p>
                      ) : (
                        matchPairs.map((mp, i) => (
                          <div key={i} className="bg-brand-50 rounded-2xl p-4">
                            <p className="text-sm font-bold mb-4">{mp.question}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {mp.items.map((item, ii) => (
                                <div key={ii} className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                                  {item.image_url && (
                                    <img src={item.image_url} alt="" className="w-full h-20 object-contain bg-gray-50 rounded-lg mb-2" />
                                  )}
                                  <p className="text-xs font-bold">{item.card_title}</p>
                                  <span className="text-[10px] text-gray-400">Kode: {item.pair_code}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {type === "flashcard" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 bg-brand-50 rounded-2xl p-4">
                        {fcBackImage ? (
                          <img src={transformImageUrl(fcBackImage)} alt="" className="w-28 h-36 object-cover rounded-xl border border-gray-200 shrink-0" />
                        ) : (
                          <div className="w-28 h-36 rounded-xl bg-gradient-to-br from-[#4A4763] to-[#7C78A8] flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold px-2 text-center">Kartu<br />Belakang</span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold">Gambar Kartu Belakang</p>
                          <p className="text-xs text-gray-400 mt-1">Dipakai untuk belakang semua kartu.</p>
                        </div>
                      </div>
                      {flashcards.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Belum ada kartu depan.</p>
                      ) : (
                        flashcards.map((card, i) => (
                          <div key={i} className="bg-brand-50 rounded-2xl p-4">
                            <p className="text-xs font-bold text-gray-500 mb-3">Kartu #{i + 1}</p>
                            {card.front_image_url && (
                              <img src={transformImageUrl(card.front_image_url)} alt="" className="w-full max-w-md h-40 object-contain rounded-xl border border-gray-200 bg-gray-50 mb-3" />
                            )}
                            <div className="flex flex-wrap gap-2">
                              {card.options.filter((o) => o.trim() !== "").map((opt, oi) => (
                                <span key={oi} className={`min-w-[80px] px-3 py-1.5 rounded-lg text-xs font-bold border text-center ${
                                  card.correct_answer === opt ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-gray-200 text-gray-600"
                                }`}>
                                  {opt}
                                </span>
                              ))}
                            </div>
                            {card.explanation && <p className="text-xs text-gray-400 mt-2">{card.explanation}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
