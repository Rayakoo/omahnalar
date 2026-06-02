import { MessageSquare, AlertTriangle, BookOpen, Award } from "lucide-react";

const FEATURES = [
  {
    icon: <MessageSquare className="w-8 h-8 text-brand-700" />,
    title: "Berbagi Cerita",
    desc: "Curhat anonim di komunitas. Temukan ruang aman untuk menuangkan isi hati dan terhubung dengan mereka yang peduli.",
  },
  {
    icon: <AlertTriangle className="w-8 h-8 text-brand-700" />,
    title: "Buat Laporan",
    desc: "Aduan kekerasan & pelecehan. Kami dampingi proses pelaporanmu dengan aman, rahasia, dan penuh empati.",
  },
  {
    icon: <BookOpen className="w-8 h-8 text-brand-700" />,
    title: "Ikut Course",
    desc: "Edukasi + kuis interaktif. Perkuat pemahamanmu tentang hubungan sehat, consent, dan kekerasan berbasis gender.",
  },
  {
    icon: <Award className="w-8 h-8 text-brand-700" />,
    title: "Main Games",
    desc: "Belajar sambil bermain. Asah wawasanmu lewat permainan seru yang mendidik dan memberdayakan.",
  },
];

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">
            Layanan Kami
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-brand-900 mt-3">
            Apa yang ingin kamu lakukan?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feat, idx) => (
          <div
            key={idx}
            className="group cursor-pointer flex flex-col items-start p-2 transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="w-14 h-14 bg-brand-700/10 rounded-2xl flex items-center justify-center mb-4 transition-colors group-hover:bg-brand-700/20">
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold text-brand-700 mb-1">{feat.title}</h3>
            <p className="text-sm text-brand-700/80">{feat.desc}</p>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
