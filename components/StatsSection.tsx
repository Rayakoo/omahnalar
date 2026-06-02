import { Handshake, Users, BookOpen, GraduationCap } from "lucide-react";

const STATS = [
  {
    icon: <Handshake className="w-8 h-8" />,
    value: "50+",
    label: "Jumlah Mitra",
    bg: "bg-[#FDE8E8]",
    color: "text-[#EF4444]",
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: "500+",
    label: "Kawan Nalar",
    bg: "bg-[#DBEAFE]",
    color: "text-[#3B82F6]",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    value: "12",
    label: "Program",
    bg: "bg-[#FEF3C7]",
    color: "text-[#F59E0B]",
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    value: "1.200+",
    label: "Siswa Terlibat",
    bg: "bg-[#D1FAE5]",
    color: "text-[#10B981]",
  },
];

export default function StatsSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.bg} rounded-3xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className={`${stat.color} mb-4`}>{stat.icon}</div>
            <span className={`text-3xl md:text-4xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </span>
            <span className="text-sm text-brand-700/80 font-medium">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
