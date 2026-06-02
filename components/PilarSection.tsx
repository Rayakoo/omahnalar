import { Shield, GraduationCap, HeartHandshake, Lightbulb } from "lucide-react";

const PILLARS = [
  {
    icon: <Shield className="w-10 h-10 text-brand-700" />,
    title: "Perlindungan",
    desc: "Memberikan ruang aman dan terpercaya bagi setiap individu tanpa diskriminasi.",
  },
  {
    icon: <GraduationCap className="w-10 h-10 text-brand-700" />,
    title: "Edukasi",
    desc: "Menyediakan akses pembelajaran dan informasi yang akurat dan komprehensif.",
  },
  {
    icon: <HeartHandshake className="w-10 h-10 text-brand-700" />,
    title: "Dukungan",
    desc: "Mendampingi dan mendukung setiap langkah menuju pemulihan dan pemberdayaan.",
  },
  {
    icon: <Lightbulb className="w-10 h-10 text-brand-700" />,
    title: "Inovasi",
    desc: "Mengembangkan solusi kreatif untuk tantangan sosial yang kompleks.",
  },
];

export default function PilarSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">
            Pilar Kami
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mt-3">
            Nilai-nilai yang Kami Junjung
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLARS.map((pilar, idx) => (
            <div key={idx} className="text-center group">
              <div className="w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-700/20 transition-colors">
                {pilar.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-2">{pilar.title}</h3>
              <p className="text-sm text-brand-700/80 leading-relaxed">{pilar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
