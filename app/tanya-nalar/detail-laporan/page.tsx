'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Paperclip,
  Image as ImageIcon,
  Send,
  MessageSquare,
  Scale,
  Brain,
  Users,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';

export default function DetailLaporan() {
  const direktoriBantuan = [
    { nama: 'LBH Malang', sub: 'Bantuan hukum', icon: Scale },
    { nama: 'Psikolog & Konselor', sub: 'Penanganan mental', icon: Brain },
    { nama: 'KPAI', sub: '021-319-015-32', icon: Users },
    { nama: 'Polres / Polda', sub: 'Call center 110', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF3] font-sans antialiased text-gray-800 flex flex-col">

      {/* TOP NAVIGATION BAR */}
      <nav className="bg-[#FFF1D6] p-4 flex items-center justify-between border-b border-orange-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#736A9C] flex items-center justify-center text-white font-bold text-xs">PA</div>
          <span className="text-sm font-bold text-[#3B3654] tracking-wide">RPT-2025-7841</span>
        </div>
        <Link
          href="/tanya-nalar"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#4C4765] text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <section className="lg:col-span-2 space-y-6">
          <h1 className="text-xl md:text-2xl font-bold text-[#3B3654] text-center lg:text-left">Detail Laporan</h1>

          <div className="bg-[#E5E2F8] bg-opacity-40 border border-[#D7D3F2] rounded-2xl p-5 space-y-3.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-500">ID Laporan</span>
              <span className="font-bold text-[#3B3654]">RPT-2025-7841</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-500">Status saat ini</span>
              <span className="px-3 py-0.5 bg-[#F4C46B] text-amber-900 text-xs font-bold rounded-full">Diproses</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-500">Tanggal laporan masuk</span>
              <span className="font-medium text-gray-800">10 Mei 2026</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-500">Tanggal kejadian</span>
              <span className="font-medium text-gray-800">8 Mei 2026</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-500">Lokasi kejadian</span>
              <span className="font-medium text-gray-800">Kota Malang, Jawa Timur</span>
            </div>
          </div>

          <div className="bg-[#E5E2F8] bg-opacity-40 border border-[#D7D3F2] rounded-2xl p-5 flex items-center gap-3">
            <span className="text-lg">🏷️</span>
            <div>
              <p className="text-xs font-semibold text-gray-500">Klasifikasi Laporan</p>
              <p className="text-sm font-bold text-[#3B3654]">Kekerasan Seksual A</p>
            </div>
          </div>

          <div className="bg-[#DADAFA] bg-opacity-70 border border-[#C9C4E9] rounded-2xl p-5 space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#3B3654] mb-2">Pesan dari konselor</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Halo, terima kasih sudah berani melaporkan. Saya sudah membaca kronologimu dengan seksama. Apa yang kamu alami adalah sesuatu yang nyata, dan kamu tidak salah sama sekali. Saya akan mengirimkan jadwal sesi konseling awal ke email kamu dalam 24 jam ke depan — kamu bisa memilih waktu yang paling nyaman.
              </p>
            </div>

            <div className="bg-white bg-opacity-80 rounded-xl p-4 border border-white space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <FileText className="w-4 h-4 text-[#736A9C]" />
                <h4 className="text-sm font-bold text-[#3B3654]">Kronologi kejadian</h4>
              </div>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                Saya mengalami pelecehan saat naik angkot di jalur Arjosari menuju Landungsari. Pelaku duduk di sebelah saya dan melakukan sentuhan yang tidak saya inginkan berulang kali. Saya terlalu syok dan takut untuk bereaksi, akhirnya turun di halte berikutnya. Kejadian ini membuat saya trauma dan tidak berani naik kendaraan umum rute tersebut lagi. Saya tidak tahu harus melapor ke mana dan apakah ada tindak lanjut yang bisa dilakukan.
              </p>

              <div className="pt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B3654] mb-3">
                  <Paperclip className="w-3.5 h-3.5 text-[#736A9C]" />
                  <span>Bukti yang dilampirkan</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-[#E5E2F8] border border-[#D7D3F2] flex items-center justify-center text-[#736A9C] cursor-pointer hover:bg-opacity-80 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="w-14 h-14 rounded-lg bg-[#E5E2F8] border border-[#D7D3F2] flex items-center justify-center text-[#736A9C] cursor-pointer hover:bg-opacity-80 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <section className="space-y-6">

          {/* 1. TIMELINE */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#3B3654] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#736A9C]" /> Riwayat tindakan
            </h3>
            <div className="relative border-l-2 border-[#736A9C] ml-2 pl-4 space-y-5">
              <div className="relative">
                <span className="absolute -left-[21px] mt-1 bg-[#736A9C] w-2 h-2 rounded-full border-4 border-[#FFFBF3]"></span>
                <span className="inline-block bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-md mb-1">Menunggu</span>
                <h5 className="text-xs font-bold text-gray-800">Laporan diterima sistem</h5>
                <p className="text-[10px] text-gray-400">10 Mei 2026, 14.22</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] mt-1 bg-[#736A9C] w-2 h-2 rounded-full border-4 border-[#FFFBF3]"></span>
                <span className="inline-block bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md mb-1">Diproses</span>
                <h5 className="text-xs font-bold text-gray-800">Diverifikasi oleh Admin</h5>
                <p className="text-[10px] text-gray-400">11 Mei 2026, 09.05</p>
              </div>
            </div>
          </div>

          {/* 2. DIREKTORI */}
          <div className="space-y-2">
            {direktoriBantuan.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={idx}
                  href="#"
                  className="flex items-center justify-between p-2.5 bg-[#E5E2F8] bg-opacity-70 text-gray-900 rounded-xl hover:bg-opacity-100 transition-all border border-[#D7D3F2] group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#736A9C]">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#3B3654]">{item.nama}</h4>
                      <p className="text-[10px] text-gray-500">{item.sub}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700" />
                </a>
              );
            })}
          </div>

          {/* 3. CHAT */}
          <div className="border border-orange-100 rounded-2xl p-4 bg-[#FFFDF9] space-y-4">
            <h4 className="text-xs font-bold text-[#3B3654] border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#736A9C]" /> Pertanyaan Lebih Lanjut
            </h4>

            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
              <div className="flex flex-col items-start max-w-[85%]">
                <span className="text-[9px] font-semibold text-gray-400 ml-1 mb-0.5">Admin</span>
                <div className="bg-[#C9C4E9] text-[#3B3654] text-[11px] p-2.5 rounded-r-xl rounded-bl-xl leading-relaxed">
                  Iya nih kemaren saya lihat ada kecelakaan yang disebabkan oleh bolongan ini, sungguh meresahkan
                </div>
              </div>

              <div className="flex flex-col items-end max-w-[85%] ml-auto">
                <span className="text-[9px] font-semibold text-gray-400 mr-1 mb-0.5">Anda</span>
                <div className="bg-[#9CD3D3] text-teal-950 text-[11px] p-2.5 rounded-l-xl rounded-br-xl leading-relaxed">
                  Benar... saya harap bisa segera dibenahi agar arus lalu lintas juga lancar
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-1 bg-white">
              <input
                type="text"
                placeholder="Ketik diskusi..."
                className="w-full text-xs px-2 py-1.5 focus:outline-none text-gray-700 bg-transparent"
              />
              <button className="p-1.5 bg-[#4C4765] text-white rounded-lg hover:bg-opacity-90 transition-colors">
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}
