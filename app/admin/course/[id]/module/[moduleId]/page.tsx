"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ModuleForm from "@/components/admin/ModuleForm";
import { getCourseMaterials, type CourseMaterial } from "@/services/courses";

export default function EditModulePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;
  const moduleId = params?.moduleId as string;
  const [moduleData, setModuleData] = useState<CourseMaterial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !moduleId) return;
    getCourseMaterials(courseId)
      .then((materials) => {
        const found = materials.find((m) => m.id === moduleId);
        if (found) setModuleData(found);
        else router.push(`/admin/course/${courseId}`);
      })
      .catch(() => router.push(`/admin/course/${courseId}`))
      .finally(() => setLoading(false));
  }, [courseId, moduleId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFCEF] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#4D455D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFCEF] font-sans text-[#2C2C2C]">
      <header className="bg-[#FFEAC2] py-4 px-6 md:px-12 flex items-center shadow-sm">
        <button
          onClick={() => router.push(`/admin/course/${courseId}`)}
          className="bg-[#3A3852] text-white text-xs px-4 py-1.5 rounded-lg hover:bg-[#4E4B6E] flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Kembali
        </button>
        <div className="flex-1 text-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Edit modul</span>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <ModuleForm courseId={courseId} moduleData={moduleData} />
      </main>
    </div>
  );
}
