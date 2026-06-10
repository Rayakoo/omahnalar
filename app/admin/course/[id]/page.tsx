"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Image,
  MoreVertical,
  Plus,
  Video,
  FileText,
  Save,
  Send,
} from "lucide-react";
import {
  getCourseById,
  getCategories,
  getEducationLevels,
  createCourse,
  updateCourse,
  getCourseVideos,
  getCourseMaterials,
  type Category,
  type EducationLevel,
  type CreateCourseInput,
  type CourseWithRelations,
  type CourseVideo,
  type CourseMaterial,
} from "@/services/courses";
import { getQuizzesByCourse, type Quiz } from "@/services/quizzes";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;
  const isNew = courseId === "new";

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courseTitle, setCourseTitle] = useState("Mengenal Kesehatan Reproduksi Dasar");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getCategories(), getEducationLevels()])
      .then(([cats, levs]) => {
        setCategories(cats);
        setEducationLevels(levs);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }
    if (!courseId) return;

    Promise.all([
      getCourseById(courseId),
      getCourseVideos(courseId),
      getCourseMaterials(courseId),
      getQuizzesByCourse(courseId),
    ])
      .then(([course, vids, mats, quiz]) => {
        setTitle(course.title);
        setDescription(course.description ?? "");
        setSelectedRole(course.category_id);
        setSelectedLevel(course.education_level_id);
        setThumbnailUrl(course.thumbnail_url ?? "");
        setCourseTitle(course.title);
        setVideos(vids);
        setMaterials(mats);
        setQuizzes(quiz);
      })
      .catch(() => router.push("/admin/courses"))
      .finally(() => setLoading(false));
  }, [courseId, isNew, router]);

  const handleSubmit = async (publish: boolean) => {
    if (saving) return;
    if (!title || !selectedRole || !selectedLevel) {
      alert("Nama course, kategori peran, dan jenjang pendidikan wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const payload: CreateCourseInput = {
        title,
        description: description || undefined,
        category_id: selectedRole,
        education_level_id: selectedLevel,
        thumbnail_url: thumbnailUrl || undefined,
        is_published: publish,
      };

      if (isNew) {
        const created = await createCourse(payload);
        router.push(`/admin/course/${created.id}`);
      } else {
        await updateCourse(courseId, payload);
        setCourseTitle(title);
        alert(publish ? "Course berhasil dipublikasikan!" : "Draft berhasil disimpan!");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan course");
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
      {/* Top Navbar */}
      <header className="bg-[#FFEAC2] py-4 px-6 md:px-12 flex items-center justify-between shadow-sm relative">
        <div className="flex flex-col items-center mx-auto text-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {isNew ? "Buat course" : "Edit course"}
          </span>
          <h1 className="text-base md:text-lg font-bold text-[#3A3A3A]">
            {isNew ? "Course Baru" : courseTitle}
          </h1>
        </div>
        <button
          onClick={() => router.push("/admin/courses")}
          className="absolute right-6 bg-[#3A3852] text-white text-xs px-4 py-1.5 rounded-lg hover:bg-[#4E4B6E] flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Kembali
        </button>
      </header>

      {/* Main Content Form */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <h2 className="text-xl font-bold mb-6 text-[#2C2C2C]">Informasi Course</h2>

        <div className="space-y-6">
          {/* Nama Course */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Nama course</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan nama course"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#9792EC] shadow-sm"
            />
          </div>

          {/* Deskripsi Singkat */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Deskripsi Singkat</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat course"
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#9792EC] shadow-sm"
            />
          </div>

          {/* Kategori Peran (Custom Radio Card) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Kategori Peran</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                    selectedRole === role.id ? "border-[#9792EC] bg-[#F4F3FF]" : "border-gray-200 bg-white"
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm">{role.name}</h4>
                    <p className="text-xs text-gray-400">Untuk {role.name.toLowerCase()}</p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedRole === role.id ? "border-[#9792EC]" : "border-gray-300"
                    }`}
                  >
                    {selectedRole === role.id && (
                      <div className="w-2 h-2 bg-[#9792EC] rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jenjang Pendidikan */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Jenjang Pendidikan</label>
            <div className="flex flex-wrap gap-3">
              {educationLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`px-5 py-2.5 text-xs font-semibold rounded-xl border-2 transition-all ${
                    selectedLevel === lvl.id
                      ? "border-[#3A3852] bg-[#E2E0FF] text-[#3A3852]"
                      : "border-gray-300 bg-white text-gray-500 hover:border-gray-400"
                  }`}
                >
                  {lvl.name} ({lvl.slug})
                </button>
              ))}
            </div>
          </div>

          {/* Thumbnail Course (URL) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Thumbnail course</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://example.com/gambar.jpg"
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#9792EC] shadow-sm"
                />
              </div>
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
            </div>
          </div>

          {/* ── SEKSI DINAMIS (hanya jika course sudah dibuat) ── */}
          {!isNew && (
            <>
              {/* Daftar Modul */}
              <div className="space-y-3">
                <h3 className="font-bold text-base text-[#2C2C2C]">Daftar Modul</h3>
                <div className="space-y-2">
                  {materials.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Belum ada modul.</p>
                  ) : (
                    materials
                      .sort((a, b) => a.urutan - b.urutan)
                      .map((modul) => (
                        <div
                          key={modul.id}
                          onClick={() => router.push(`/admin/course/${courseId}/module/${modul.id}`)}
                          className="flex items-center justify-between bg-[#F7F6FF] border border-[#E2E0FF] rounded-xl px-4 py-3.5 shadow-sm cursor-pointer hover:bg-[#EFEEFF] transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-6 h-6 rounded-full bg-[#FFEAC2] text-xs font-bold text-[#F5C469] flex items-center justify-center">
                              {modul.urutan}
                            </span>
                            <span className="text-sm font-medium text-gray-700">{modul.title}</span>
                          </div>
                          <button type="button" className="text-gray-400 hover:text-gray-600" onClick={(e) => { e.stopPropagation(); router.push(`/admin/course/${courseId}/module/${modul.id}`); }}>
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/admin/course/${courseId}/module/new`)}
                  className="inline-flex items-center gap-1 bg-[#3A3852] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#4E4B6E] transition-colors"
                >
                  <Plus className="w-3 h-3" /> Tambah Modul Baru
                </button>
              </div>

              {/* Grid Dua Kolom untuk Video & Kuis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Kolom Daftar Video */}
                <div className="space-y-3">
                  <h3 className="font-bold text-base text-[#2C2C2C]">Daftar Video</h3>
                  <div className="space-y-2">
                    {videos.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">Belum ada video.</p>
                    ) : (
                      videos
                        .sort((a, b) => a.urutan - b.urutan)
                        .map((video) => (
                          <div
                            key={video.id}
                            onClick={() => router.push(`/admin/course/${courseId}/video/${video.id}`)}
                            className="flex items-center justify-between bg-[#F7F6FF] border border-[#E2E0FF] rounded-xl p-4 shadow-sm cursor-pointer hover:bg-[#EFEEFF] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-lg border border-gray-100 text-gray-400">
                                <Video className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-gray-700">{video.title}</h4>
                                <span className="text-[10px] text-gray-400 font-medium">{video.video_url}</span>
                              </div>
                            </div>
                            <button type="button" className="text-gray-400 hover:text-gray-600" onClick={(e) => { e.stopPropagation(); router.push(`/admin/course/${courseId}/video/${video.id}`); }}>
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/course/${courseId}/video/new`)}
                    className="inline-flex items-center gap-1 bg-[#3A3852] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#4E4B6E] transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Tambah Video Baru
                  </button>
                </div>

                {/* Kolom Daftar Kuis */}
                <div className="space-y-3">
                  <h3 className="font-bold text-base text-[#2C2C2C]">Daftar kuis</h3>
                  <div className="space-y-2">
                    {quizzes.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">Belum ada kuis.</p>
                    ) : (
                      quizzes
                        .sort((a, b) => a.urutan - b.urutan)
                        .map((kuis) => (
                          <div
                            key={kuis.id}
                            onClick={() => router.push(`/admin/course/${courseId}/quiz/${kuis.id}`)}
                            className="flex items-center justify-between bg-[#FFFBF2] border border-[#FFEAC2] rounded-xl p-4 shadow-sm cursor-pointer hover:bg-[#FFF6E5] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-lg border border-gray-100 text-[#F5C469]">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-gray-700">{kuis.title}</h4>
                                <span className="text-[10px] text-gray-400 font-medium">
                                  {kuis.description || `${kuis.urutan} sesi`}
                                </span>
                              </div>
                            </div>
                            <button type="button" className="text-gray-400 hover:text-gray-600" onClick={(e) => { e.stopPropagation(); router.push(`/admin/course/${courseId}/quiz/${kuis.id}`); }}>
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/course/${courseId}/quiz/new`)}
                    className="inline-flex items-center gap-1 bg-[#3A3852] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#4E4B6E] transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Tambah Kuis Baru
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-center gap-4 pt-10 pb-6">
            {isNew ? (
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={saving}
                className="px-10 py-3.5 bg-[#524D85] text-white font-bold rounded-2xl hover:bg-[#645FA1] flex items-center gap-2 shadow-md transition-all text-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {saving ? "Menyimpan..." : "Selanjutnya"}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={saving}
                  className="px-8 py-3.5 bg-[#3A3852] text-white font-bold rounded-2xl hover:bg-[#4E4B6E] flex items-center gap-2 shadow-md transition-all text-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan Draft"}
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={saving}
                  className="px-8 py-3.5 bg-[#524D85] text-white font-bold rounded-2xl hover:bg-[#645FA1] flex items-center gap-2 shadow-md transition-all text-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {saving ? "Menyimpan..." : "Publikasikan"}
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
