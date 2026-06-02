"use client";

import { ArrowLeft, Calendar, MapPin, Target, BookOpen, Shield, PenTool, HandshakeIcon, Users, Image as ImageIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const PROGRAMS = [
  {
    id: "seminar-parenting",
    title: "Seminar Parenting",
    tag: "Event Edukasi",
    period: "2024 – 2025",
    location: "Jawa Timur",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800",
    color: "bg-secondary-500",
    textColor: "text-brand-900",
    tagline: "Mengadakan kegiatan seminar parenting sebagai bentuk kerja sama antara sekolah dan orang tua.",
    descriptions: [
      "Mengadakan kegiatan seminar parenting sebagai bentuk kerja sama antara sekolah dan orang tua. Melalui kegiatan ini, orang tua mendapatkan edukasi seputar pola asuh, perkembangan anak, dan cara mendampingi anak dalam proses belajar.",
      "Pendidikan anak tidak hanya berjalan di sekolah, tetapi juga didukung dari rumah. Seminar ini menghadirkan psikolog dan praktisi pendidikan untuk berbagi wawasan tentang pola asuh positif, komunikasi efektif dengan anak, serta strategi mendampingi belajar di rumah.",
    ],
    icon: BookOpen,
    target: [
      "Orang tua siswa di sekolah mitra",
      "Guru dan tenaga pendidik",
      "Komunitas orang tua di wilayah Jawa Timur",
    ],
    goals: [
      "Meningkatkan pemahaman orang tua tentang pola asuh positif",
      "Memperkuat komunikasi antara sekolah dan orang tua",
      "Membangun lingkungan belajar yang suportif dari rumah",
    ],
  },
  {
    id: "seminar-guru",
    title: "Seminar & Edukasi Guru",
    tag: "Pelatihan",
    period: "2024 – 2025",
    location: "MTs Dzunuroin",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    color: "bg-brand-100",
    textColor: "text-brand-900",
    tagline: "Mengadakan seminar dan edukasi untuk para guru sebagai upaya meningkatkan kualitas pembelajaran.",
    descriptions: [
      "Mengadakan seminar dan edukasi untuk para guru sebagai upaya meningkatkan kualitas pembelajaran. Kegiatan ini membantu guru menambah wawasan, mengembangkan metode mengajar, dan menyesuaikan pembelajaran dengan kebutuhan peserta didik.",
      "Dengan adanya kegiatan ini, guru dapat terus berkembang dan memberikan pengalaman belajar yang lebih baik bagi siswa. Materi mencakup pedagogi modern, pendekatan inklusif, dan pemanfaatan teknologi dalam pembelajaran.",
    ],
    icon: Users,
    target: ["Guru MTs Dzunuroin", "Tenaga pendidik di lingkungan madrasah"],
    goals: [
      "Meningkatkan kompetensi pedagogik guru",
      "Mengembangkan metode pengajaran yang inovatif",
      "Menciptakan pengalaman belajar yang lebih baik bagi siswa",
    ],
  },
  {
    id: "workshop-bullying",
    title: "Workshop Anti Bullying & Kekerasan Seksual",
    tag: "Edukasi",
    period: "2024 – 2025",
    location: "Jawa Timur",
    image: "https://images.unsplash.com/photo-1529543544282-ea76a15d1c38?auto=format&fit=crop&q=80&w=800",
    color: "bg-rose-100",
    textColor: "text-rose-800",
    tagline: "Workshop dan seminar mengenai permasalahan bullying serta kekerasan seksual sebagai bentuk edukasi bagi warga sekolah.",
    descriptions: [
      "Mengadakan workshop dan seminar mengenai permasalahan bullying serta kekerasan seksual sebagai bentuk edukasi bagi warga sekolah. Kegiatan ini bertujuan untuk memberikan pemahaman tentang perilaku yang baik, batasan dalam berinteraksi, serta cara mencegah tindakan kekerasan di lingkungan sekolah.",
      "Melalui kegiatan ini, anak-anak diarahkan untuk membentuk pola perilaku yang lebih positif, saling menghargai, dan mampu menciptakan lingkungan sekolah yang aman serta nyaman.",
    ],
    icon: Shield,
    target: ["Siswa-siswi sekolah mitra", "Guru dan staf sekolah", "Orang tua siswa"],
    goals: [
      "Mencegah tindakan bullying dan kekerasan seksual di sekolah",
      "Membangun kesadaran tentang batasan interaksi yang sehat",
      "Menciptakan lingkungan sekolah yang aman dan nyaman",
    ],
  },
  {
    id: "pelatihan-menulis",
    title: "Pelatihan Penulisan & Diskusi",
    tag: "Pengembangan Skill",
    period: "2024 – 2025",
    location: "Komunitas",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800",
    color: "bg-emerald-100",
    textColor: "text-emerald-800",
    tagline: "Kegiatan pelatihan penulisan dan diskusi untuk meningkatkan kemampuan menulis para anggota.",
    descriptions: [
      "Kegiatan pelatihan penulisan dan diskusi ini bertujuan untuk meningkatkan kemampuan menulis para anggota, baik dalam menyusun ide, mengembangkan gagasan, maupun menuangkannya ke dalam bentuk tulisan yang jelas dan terarah.",
      "Melalui kegiatan ini, anggota diharapkan mampu memahami teknik dasar penulisan, memperbaiki struktur tulisan, memilih bahasa yang tepat, serta mengembangkan kreativitas dalam menulis. Selain itu, kegiatan diskusi juga bertujuan untuk melatih anggota agar lebih aktif dalam menyampaikan pendapat, menerima masukan, dan bertukar ide.",
    ],
    icon: PenTool,
    target: ["Anggota komunitas", "Penulis pemula", "Siswa yang tertarik dengan literasi"],
    goals: [
      "Meningkatkan kemampuan menulis anggota",
      "Mengembangkan kreativitas dan berpikir kritis",
      "Membangun budaya literasi di komunitas",
    ],
  },
  {
    id: "buku-baca",
    title: "Pemberian Buku Baca",
    tag: "Literasi",
    period: "2024 – 2025",
    location: "Jawa Timur",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800",
    color: "bg-sky-100",
    textColor: "text-sky-800",
    tagline: "Pemberian buku baca untuk mitra sekolah guna mendukung peningkatan minat baca peserta didik.",
    descriptions: [
      "Pemberian buku baca untuk mitra sekolah merupakan kegiatan yang bertujuan untuk mendukung peningkatan minat baca peserta didik. Melalui bantuan buku bacaan ini, sekolah memiliki tambahan bahan literasi yang dapat digunakan siswa untuk memperluas pengetahuan.",
      "Kegiatan ini juga menjadi bentuk dukungan terhadap sekolah mitra dalam menyediakan sumber belajar yang bermanfaat, menarik, dan sesuai dengan kebutuhan peserta didik.",
    ],
    icon: BookOpen,
    target: ["Sekolah mitra", "Peserta didik di sekolah mitra"],
    goals: [
      "Meningkatkan minat baca peserta didik",
      "Memperkaya bahan literasi di sekolah",
      "Membangun budaya literasi sejak dini",
    ],
  },
  {
    id: "kerjasama-eksternal",
    title: "Kerja Sama Pihak Eksternal",
    tag: "Kemitraan",
    period: "2024 – 2025",
    location: "Nasional",
    image: "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&q=80&w=800",
    color: "bg-purple-100",
    textColor: "text-purple-800",
    tagline: "Menjalin kerja sama dengan pihak eksternal untuk memajukan program pendidikan di sekolah.",
    descriptions: [
      "Kegiatan menjalin kerja sama dengan pihak eksternal bertujuan untuk mendukung pengembangan program sekolah agar dapat berjalan lebih luas, efektif, dan berkelanjutan. Melalui kerja sama ini, sekolah dapat memperoleh dukungan dalam bentuk pengetahuan, pelatihan, fasilitas, narasumber, maupun bantuan program.",
      "Kerja sama dengan pihak eksternal juga menjadi upaya untuk memperluas relasi sekolah, meningkatkan kualitas kegiatan pendidikan, serta menghadirkan program-program yang bermanfaat bagi kemajuan sekolah.",
    ],
    icon: HandshakeIcon,
    target: ["Sekolah mitra", "Organisasi masyarakat sipil", "Instansi pemerintah"],
    goals: [
      "Memperluas relasi dan jaringan sekolah",
      "Meningkatkan kualitas program pendidikan",
      "Menciptakan program yang berkelanjutan",
    ],
  },
];

export function getAllPrograms() {
  return PROGRAMS;
}

export function getProgramById(id: string) {
  return PROGRAMS.find((p) => p.id === id) || null;
}

export default function ProgramDetail() {
  const router = useRouter();
  const params = useParams();
  const prog = getProgramById(params.id as string);
  const IconComponent = prog?.icon;

  if (!prog) {
    return (
      <div className="min-h-screen bg-page-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-900">Program tidak ditemukan</h2>
          <button onClick={() => router.push("/program")} className="mt-4 px-5 py-2 bg-brand-900 text-white rounded-xl text-sm">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased flex flex-col">
      {/* Hero Banner */}
      <div className={`relative overflow-hidden ${prog.color}`}>
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 relative z-10">
          <button
            onClick={() => router.push("/program")}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm text-sm font-semibold rounded-xl hover:bg-white/30 transition-all mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Semua Program
          </button>

          <span className={`inline-block bg-white/80 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${prog.textColor}`}>
            {prog.tag}
          </span>
          <h1 className={`text-3xl md:text-5xl font-extrabold mt-3 ${prog.textColor} tracking-tight max-w-3xl`}>
            {prog.title}
          </h1>
          <p className={`text-sm md:text-base mt-4 max-w-2xl leading-relaxed ${prog.textColor} opacity-80`}>
            {prog.tagline}
          </p>

          <div className="flex flex-wrap gap-4 mt-6 text-sm font-semibold">
            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Calendar className="w-4 h-4" />
              {prog.period}
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <MapPin className="w-4 h-4" />
              {prog.location}
            </span>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
          {IconComponent && <IconComponent className="w-64 h-64 absolute -right-10 -top-10" />}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto w-full p-4 md:p-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-brand-700" />
                <h3 className="text-lg font-bold text-brand-900">Tentang Program</h3>
              </div>
              <div className="space-y-4">
                {prog.descriptions.map((desc, i) => (
                  <p key={i} className="text-sm text-brand-700/80 leading-relaxed">{desc}</p>
                ))}
              </div>
            </div>

            <div className="bg-brand-100/50 border border-brand-100 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-brand-700" />
                <h3 className="text-lg font-bold text-brand-900">Target Peserta</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prog.target.map((t, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/70 rounded-xl p-3.5 border border-white">
                    <div className="w-8 h-8 rounded-full bg-brand-900/10 flex items-center justify-center text-brand-700 font-bold text-sm">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-brand-800">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Goals Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-brand-700" />
                <h3 className="text-base font-bold text-brand-900">Tujuan</h3>
              </div>
              <div className="space-y-3">
                {prog.goals.map((goal, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-brand-700/80 leading-relaxed">{goal}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Section */}
        <section className="mt-12 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <ImageIcon className="w-5 h-5 text-brand-700" />
            <h3 className="text-lg font-bold text-brand-900">Dokumentasi Kegiatan</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="col-span-2 row-span-2 rounded-2xl bg-gradient-to-br from-brand-100/70 to-brand-700/10 border border-gray-100 flex items-center justify-center text-brand-700/30 hover:from-brand-100 hover:to-brand-700/20 hover:text-brand-700/50 transition-all cursor-pointer aspect-[4/3] md:aspect-auto">
              <ImageIcon className="w-10 h-10" />
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-secondary-500/40 to-secondary-600/20 border border-gray-100 flex items-center justify-center text-brand-700/30 hover:from-secondary-500/60 hover:text-brand-700/50 transition-all cursor-pointer aspect-[4/3]">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-brand-100/60 to-brand-700/10 border border-gray-100 flex items-center justify-center text-brand-700/30 hover:from-brand-100 hover:to-brand-700/20 hover:text-brand-700/50 transition-all cursor-pointer aspect-[4/3]">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-rose-100/60 to-rose-300/20 border border-gray-100 flex items-center justify-center text-brand-700/30 hover:from-rose-100/80 hover:text-brand-700/50 transition-all cursor-pointer aspect-[4/3]">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-emerald-100/60 to-emerald-300/20 border border-gray-100 flex items-center justify-center text-brand-700/30 hover:from-emerald-100/80 hover:text-brand-700/50 transition-all cursor-pointer aspect-[4/3]">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div className="col-span-2 rounded-2xl bg-gradient-to-br from-sky-100/60 to-sky-300/20 border border-gray-100 flex items-center justify-center text-brand-700/30 hover:from-sky-100/80 hover:to-sky-300/30 hover:text-brand-700/50 transition-all cursor-pointer aspect-[4/3]">
              <ImageIcon className="w-8 h-8" />
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-purple-100/60 to-purple-300/20 border border-gray-100 flex items-center justify-center text-brand-700/30 hover:from-purple-100/80 hover:text-brand-700/50 transition-all cursor-pointer aspect-[4/3]">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-brand-100/60 to-brand-700/10 border border-gray-100 flex items-center justify-center text-brand-700/30 hover:from-brand-100 hover:to-brand-700/20 hover:text-brand-700/50 transition-all cursor-pointer aspect-[4/3]">
              <ImageIcon className="w-7 h-7" />
            </div>
          </div>
          <p className="text-xs text-brand-700/40 mt-4 text-center">
            *Dokumentasi akan ditambahkan setelah kegiatan berlangsung
          </p>
        </section>
      </main>
    </div>
  );
}
