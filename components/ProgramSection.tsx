import { MessageCircle, BookOpen, PenLine, ArrowRight } from "lucide-react";

const PROGRAMS = [
  {
    icon: <MessageCircle className="w-10 h-10 text-brand-700" />,
    title: "Omah Cerita",
    desc: "Ruang ramah untuk berbagi cerita dan pengalaman secara anonim dengan komunitas yang mendukung.",
    tag: "Cerita",
  },
  {
    icon: <BookOpen className="w-10 h-10 text-brand-700" />,
    title: "Omah Belajar",
    desc: "Platform pembelajaran interaktif dengan modul-modul edukatif tentang kesehatan dan hak reproduksi.",
    tag: "Belajar",
  },
  {
    icon: <PenLine className="w-10 h-10 text-brand-700" />,
    title: "Tanya Nalar",
    desc: "Layanan tanya jawab seputar isu kesehatan reproduksi dan seksualitas yang aman dan terpercaya.",
    tag: "Tanya",
  },
];

export default function ProgramSection() {
  return (
    <section className="bg-page-50 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">
            Program Kami
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-3">
            Jelajahi Program Omah Nalar
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROGRAMS.map((program, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <span className="text-xs font-semibold text-secondary-600 uppercase tracking-wider mb-4">
                {program.tag}
              </span>
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mb-5">
                {program.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-3">{program.title}</h3>
              <p className="text-sm text-brand-700/80 leading-relaxed mb-6 flex-1">
                {program.desc}
              </p>
              <button className="text-brand-700 font-medium text-sm flex items-center gap-1 hover:text-brand-900 transition-colors group">
                Selengkapnya{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
