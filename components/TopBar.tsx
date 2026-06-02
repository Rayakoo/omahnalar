"use client";

import { ChevronLeft } from "lucide-react";

export default function TopBar() {
  return (
    <nav className="bg-secondary-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-10 h-10 bg-brand-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
          Ω
        </div>
      </div>

      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-1 bg-brand-900 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-brand-700 transition-all active:scale-95 shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Kembali
      </button>
    </nav>
  );
}
