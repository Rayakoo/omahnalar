"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Save, Plus, Upload } from "lucide-react";
import { transformImageUrl } from "@/lib/image";
import RichTextEditor from "./RichTextEditor";
import { createQuiz, updateQuiz, deleteQuiz } from "@/services/quizzes";
import FileUploader from "@/components/FileUploader";
import { getNextGlobalUrutanAndIncrement } from "@/services/courses";
import type { Quiz } from "@/services/quizzes";

interface QuestionState {
  id: number;
  tempId: string;
  text: string;
  options: string[];
  correctAnswer: string;
  imageUrl: string;
  explanation: string;
}

interface QuizFormProps {
  courseId: string;
  quizData?: Quiz | null;
  existingQuestions?: { id: string; question_text: string; options: string[]; correct_answer: string; urutan: number; image_url?: string | null; explanation?: string | null }[];
  onSuccess?: () => void;
}

let tempIdCounter = 0;
const genTempId = () => `new_${++tempIdCounter}`;

export default function QuizForm({ courseId, quizData, existingQuestions, onSuccess }: QuizFormProps) {
  const router = useRouter();
  const isNew = !quizData;
  const [title, setTitle] = useState(quizData?.title ?? "");
  const [description, setDescription] = useState(quizData?.description ?? "");
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [nextUrutan, setNextUrutan] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) return;
    getNextGlobalUrutanAndIncrement(courseId)
      .then(setNextUrutan)
      .catch(() => {});
  }, [courseId, isNew]);

  useEffect(() => {
    if (existingQuestions && existingQuestions.length > 0) {
      setQuestions(
        existingQuestions.map((q, i) => {
          let correctAnswer = q.correct_answer;
          // Convert old letter-based (A/B/C/D) to option text
          if (/^[A-D]$/.test(correctAnswer)) {
            const idx = correctAnswer.charCodeAt(0) - 65;
            correctAnswer = (q.options[idx] ?? correctAnswer);
          }
          return {
            id: i + 1,
            tempId: q.id,
            text: q.question_text,
            options: q.options.length >= 2 ? q.options : ["", ""],
            correctAnswer,
            imageUrl: q.image_url || "",
            explanation: q.explanation || "",
          };
        })
      );
    } else {
      setQuestions([{ id: 1, tempId: genTempId(), text: "", options: ["", ""], correctAnswer: "", imageUrl: "", explanation: "" }]);
    }
  }, [existingQuestions]);

  const handleAddQuestion = () => {
    const newId = questions.length + 1;
    setQuestions([...questions, { id: newId, tempId: genTempId(), text: "", options: ["", ""], correctAnswer: "", imageUrl: "", explanation: "" }]);
  };

  const handleRemoveQuestion = (id: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleQuestionText = (id: number, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)));
  };

  const handleOptionText = (qId: number, optIdx: number, text: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        const oldOpt = q.options[optIdx];
        const newOptions = q.options.map((o, i) => (i === optIdx ? text : o));
        // If correctAnswer was the old text, update to new text
        const correctAnswer = q.correctAnswer === oldOpt ? text : q.correctAnswer;
        return { ...q, options: newOptions, correctAnswer };
      })
    );
  };

  const handleSelectAnswer = (qId: number, optionText: string) => {
    setQuestions(questions.map((q) =>
      q.id === qId
        ? { ...q, correctAnswer: q.correctAnswer === optionText ? "" : optionText }
        : q
    ));
  };

  const handleAddOption = (qId: number) => {
    setQuestions(questions.map((q) =>
      q.id === qId ? { ...q, options: [...q.options, ""] } : q
    ));
  };

  const handleRemoveOption = (qId: number, optIdx: number) => {
    setQuestions(questions.map((q) => {
      if (q.id !== qId) return q;
      if (q.options.length <= 2) return q;
      const removed = q.options[optIdx];
      const newOptions = q.options.filter((_, i) => i !== optIdx);
      const correctAnswer = q.correctAnswer === removed ? "" : q.correctAnswer;
      return { ...q, options: newOptions, correctAnswer };
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!title) { alert("Judul quiz wajib diisi."); return; }

    const invalidQuestion = questions.find((q) => {
      if (!q.text || q.options.length < 2 || q.options.some((o) => !o)) return true;
      return false;
    });
    if (invalidQuestion) { alert("Setiap soal minimal 2 pilihan jawaban dan semua harus diisi."); return; }
    const noCorrectAnswer = questions.find((q) => !q.correctAnswer);
    if (noCorrectAnswer) { alert("Pilih jawaban benar untuk setiap soal."); return; }

    setSaving(true);
    try {
      let quizId = quizData?.id;

      if (isNew) {
        const created = await createQuiz({ course_id: courseId, title, description: description || undefined, urutan: nextUrutan });
        quizId = created.id;
      } else {
        await updateQuiz(quizData.id, { title, description: description || undefined });
      }

      const { createQuizQuestion, updateQuizQuestion, deleteQuizQuestion } = await import("@/services/quizzes");

      const existingIds = new Set((existingQuestions ?? []).map((q) => q.id));
      const submittedIds = new Set<string>();

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const isTempId = q.tempId.startsWith("new_");

        if (isTempId) {
          await createQuizQuestion({
            quiz_id: quizId!,
            question_text: q.text,
            options: q.options,
            correct_answer: q.correctAnswer,
            urutan: i,
            image_url: q.imageUrl || null,
            explanation: q.explanation || null,
          });
        } else {
          submittedIds.add(q.tempId);
          await updateQuizQuestion(q.tempId, {
            question_text: q.text,
            options: q.options,
            correct_answer: q.correctAnswer,
            urutan: i,
            image_url: q.imageUrl || null,
            explanation: q.explanation || null,
          });
        }
      }

      for (const existingId of existingIds) {
        if (!submittedIds.has(existingId)) {
          await deleteQuizQuestion(existingId);
        }
      }

      onSuccess ? onSuccess() : router.push(`/admin/course/${courseId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!quizData) { router.push(`/admin/course/${courseId}`); return; }
    if (!window.confirm("Yakin ingin menghapus quiz ini?")) return;
    setSaving(true);
    try {
      await deleteQuiz(quizData.id);
      onSuccess ? onSuccess() : router.push(`/admin/course/${courseId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus quiz");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-xl font-bold mb-6 text-[#2C2C2C]">Informasi Quiz</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Judul Quiz</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="contoh: Evaluasi Pemahaman"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#9792EC] shadow-sm placeholder-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Deskripsi (opsional)</label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Petunjuk atau informasi tambahan"
            minHeight={120}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-600">Daftar Soal</label>

          {questions.map((q, index) => (
            <div key={q.id} className="bg-white border-2 border-[#E2E0FF] rounded-2xl p-5 shadow-sm space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-[#E2E0FF] text-xs font-bold text-[#524D85] flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">Jawaban Benar</span>
                  {questions.length > 1 && (
                    <button type="button" onClick={() => handleRemoveQuestion(q.id)} className="text-red-400 hover:text-red-600 text-xs font-bold">
                      Hapus
                    </button>
                  )}
                </div>
              </div>

              <input
                type="text"
                value={q.text}
                onChange={(e) => handleQuestionText(q.id, e.target.value)}
                placeholder={`Soal nomor ${index + 1}`}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9792EC] placeholder-gray-300"
              />

              <div>
                <div className="flex items-start gap-2">
                  <input
                    type="text"
                    value={q.imageUrl}
                    onChange={(e) => setQuestions(questions.map((x) => x.id === q.id ? { ...x, imageUrl: e.target.value } : x))}
                    placeholder="URL gambar (opsional, untuk ditampilkan di soal)"
                    className="flex-1 w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9792EC] placeholder-gray-300"
                  />
                  <FileUploader onUploadComplete={(url) => setQuestions(questions.map((x) => x.id === q.id ? { ...x, imageUrl: url } : x))} />
                </div>
                {q.imageUrl && (
                  <img
                    src={transformImageUrl(q.imageUrl)}
                    alt="Preview"
                    className="mt-2 max-h-32 rounded-lg object-contain border border-gray-200"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>

              <div className="space-y-3">
                {q.options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isCorrect = q.correctAnswer === opt;
                  return (
                    <div key={letter} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionText(q.id, optIdx, e.target.value)}
                        placeholder={`Pilihan jawaban ${letter}`}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9792EC] placeholder-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => opt && handleSelectAnswer(q.id, opt)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                          isCorrect ? "border-[#2C2C2C] bg-white" : q.correctAnswer ? "border-gray-200" : "border-gray-300 bg-white"
                        }`}
                        title="Tandai sebagai jawaban benar"
                      >
                        {isCorrect && <div className="w-3 h-3 bg-[#2C2C2C] rounded-full" />}
                      </button>
                      {q.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(q.id, optIdx)}
                          className="text-red-400 hover:text-red-600 text-xs font-bold shrink-0 w-5"
                          title="Hapus pilihan jawaban"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
                {q.options.length < 6 && (
                  <button
                    type="button"
                    onClick={() => handleAddOption(q.id)}
                    className="text-xs font-bold text-[#9792EC] hover:text-[#524D85] transition-colors mt-1"
                  >
                    + Tambah pilihan
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Penjelasan Jawaban (opsional)</label>
                <textarea
                  value={q.explanation}
                  onChange={(e) => setQuestions(questions.map((x) => x.id === q.id ? { ...x, explanation: e.target.value } : x))}
                  placeholder="Penjelasan kenapa jawaban ini benar. Ditampilkan setelah user menjawab."
                  rows={3}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9792EC] placeholder-gray-300 resize-y"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddQuestion}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3A3852] hover:text-[#524D85] transition-colors pt-2"
          >
            <Plus className="w-4 h-4" /> Tambah Soal
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 pt-8">
          <button
            type="button"
            onClick={handleDelete}
            className="px-8 py-3 bg-[#3A3852] text-white font-bold rounded-xl hover:bg-[#4E4B6E] flex items-center gap-2 shadow-md transition-all text-sm disabled:opacity-50"
            disabled={saving}
          >
            <Trash2 className="w-4 h-4" /> {quizData ? "Hapus" : "Batal"}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#524D85] text-white font-bold rounded-xl hover:bg-[#645FA1] flex items-center gap-2 shadow-md transition-all text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
