"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ModuleForm from "@/components/admin/ModuleForm";

export default function NewModulePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;

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
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Buat modul</span>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <ModuleForm courseId={courseId} />
      </main>
    </div>
  );
}
