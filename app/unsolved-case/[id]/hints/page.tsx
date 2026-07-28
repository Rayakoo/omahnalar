"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Lightbulb, Lock, ChevronRight, ArrowLeft, Book, MessageSquare, User, IdCard, Paperclip,
  BookOpen, X, Maximize2, Minimize2, Undo2, Images, Expand, UserCheck,
} from "lucide-react";
import { getHints, getUnsolvedCase } from "@/services/unsolvedCase";
import { getCourseById } from "@/services/courses";
import { transformImageUrl } from "@/lib/image";
import { getDetectiveName, getConfirmed, getRevealedHints, addRevealedHint } from "@/lib/unsolvedCaseStorage";
import type { UnsolvedCaseHint, UnsolvedCaseHintType, UnsolvedCaseHintBuku, UnsolvedCaseHintKartu, UnsolvedCaseHintChat, UnsolvedCaseHintKarakter, UnsolvedCaseHintLainnya } from "@/types/unsolvedCase";

const CATEGORY_CONFIG: Record<UnsolvedCaseHintType, { icon: typeof Book; label: string; color: string; rotate: string }> = {
  chat: { icon: MessageSquare, label: "Chat", color: "from-emerald-500 to-emerald-700", rotate: "-rotate-2" },
  buku: { icon: Book, label: "Buku", color: "from-amber-600 to-amber-800", rotate: "rotate-1" },
  kartu: { icon: IdCard, label: "Kartu", color: "from-blue-600 to-blue-800", rotate: "-rotate-1" },
  karakter: { icon: User, label: "Karakter", color: "from-purple-600 to-purple-800", rotate: "rotate-3" },
  lainnya: { icon: Paperclip, label: "Lainnya", color: "from-stone-600 to-stone-800", rotate: "-rotate-3" },
};

function KartuFlip({ konten, zoomed }: { konten: UnsolvedCaseHintKartu; zoomed?: boolean }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="relative mx-auto"
      style={{
        width: zoomed ? "min(90vw, 600px)" : "min(80vw, 340px)",
        aspectRatio: "4 / 3",
        animation: "kartuFloat 4s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes kartuFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.6s ease-in-out",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
          }}
        >
          <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg" style={{ backfaceVisibility: "hidden" }}>
            {konten.kartu_depan ? (
              <img src={transformImageUrl(konten.kartu_depan)} alt="Kartu depan" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#f5efe6] text-[#a09080] text-sm">Depan</div>
            )}
          </div>
          <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            {konten.kartu_belakang ? (
              <img src={transformImageUrl(konten.kartu_belakang)} alt="Kartu belakang" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#f5efe6] text-[#a09080] text-sm">Belakang</div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-7 left-0 right-0 text-center">
        <p className="text-[10px] text-white/70 font-mono italic">
          <Undo2 className="w-3 h-3 inline mr-1" />
          Tekan untuk memutar kartu
        </p>
      </div>
    </div>
  );
}

export default function HintsPage() {
  const params = useParams();
  const courseId = params?.id as string;
  const [hints, setHints] = useState<UnsolvedCaseHint[]>([]);
  const [unsolvedCaseId, setUnsolvedCaseId] = useState("");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const [denied, setDenied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<UnsolvedCaseHintType | null>(null);
  const [selectedKartuId, setSelectedKartuId] = useState<string | null>(null);
  const [selectedBukuId, setSelectedBukuId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedKarakterId, setSelectedKarakterId] = useState<string | null>(null);
  const [selectedLainnyaId, setSelectedLainnyaId] = useState<string | null>(null);
  const [bookOpen, setBookOpen] = useState(false);
  const [bookPage, setBookPage] = useState(0);
  const [chatPage, setChatPage] = useState(0);
  const [kartuPopup, setKartuPopup] = useState<{ konten: UnsolvedCaseHintKartu } | null>(null);
  const [hoveredHintType, setHoveredHintType] = useState<UnsolvedCaseHintType | null>(null);

  useEffect(() => {
    const name = getDetectiveName();
    const confirmed = getConfirmed();
    if (!name || !confirmed) { setDenied(true); setReady(true); return; }
    getCourseById(courseId).then((c) => {
      if (!c) { setReady(true); return; }
      getUnsolvedCase(c.id).then((uc) => {
        if (uc) {
          setUnsolvedCaseId(uc.id);
          getHints(uc.id).then((h) => setHints(h));
          setRevealed(getRevealedHints(uc.id));
        }
        setReady(true);
      });
    });
  }, [courseId]);

  const reveal = (id: string) => {
    if (!unsolvedCaseId) return;
    addRevealedHint(unsolvedCaseId, id);
    setRevealed(new Set([...revealed, id]));
  };

  const grouped = hints.reduce((acc, h) => {
    if (!acc[h.tipe]) acc[h.tipe] = [];
    acc[h.tipe].push(h);
    return acc;
  }, {} as Record<string, UnsolvedCaseHint[]>);

  useEffect(() => {
    if (!selectedKartuId || selectedCategory !== "kartu") {
      setKartuPopup(null);
      return;
    }
    const hint = grouped["kartu"]?.find((h) => h.id === selectedKartuId);
    if (hint) setKartuPopup({ konten: hint.konten as UnsolvedCaseHintKartu });
  }, [selectedKartuId, selectedCategory, grouped]);

  const resetSelection = () => {
    setSelectedCategory(null);
    setSelectedKartuId(null);
    setSelectedBukuId(null);
    setSelectedChatId(null);
    setSelectedKarakterId(null);
    setSelectedLainnyaId(null);
    setBookOpen(false);
    setBookPage(0);
    setChatPage(0);
    setKartuPopup(null);
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-[3px] border-[#8b4513] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (denied) {
    return (
      <div className="bg-[#f5efe6] rounded-2xl shadow-md border border-[#c4a882] p-8 text-center">
        <p className="text-sm text-[#8b7355]">Buat identitas detektif terlebih dahulu.</p>
      </div>
    );
  }

  // Category detail view
  if (selectedCategory) {
    const catHints = grouped[selectedCategory] || [];
    const cfg = CATEGORY_CONFIG[selectedCategory];
    const Icon = cfg.icon;

    const selectedBukuHint = selectedBukuId ? catHints.find((h) => h.id === selectedBukuId) : undefined;
    const selectedChatHint = selectedChatId ? catHints.find((h) => h.id === selectedChatId) : undefined;
    const selectedKarakterHint = selectedKarakterId ? catHints.find((h) => h.id === selectedKarakterId) : undefined;
    const selectedLainnyaHint = selectedLainnyaId ? catHints.find((h) => h.id === selectedLainnyaId) : undefined;

    return (
      <div className="bg-[#f5efe6] rounded-2xl shadow-md border border-[#c4a882] overflow-hidden">
        <div className="bg-[#5c3d2e] text-white px-5 py-3 flex items-center gap-2">
          <button onClick={resetSelection} className="hover:text-[#c4a882] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Icon className="w-4 h-4" />
          <h2 className="font-bold text-sm uppercase tracking-wider">{cfg.label}</h2>
          <span className="text-xs text-[#c4a882] ml-auto font-mono">{catHints.length} petunjuk</span>
        </div>
        <div className="p-4 md:p-5 space-y-4">
          {selectedCategory === "buku" ? (
            selectedBukuId && selectedBukuHint ? (
              bookOpen ? (
                <BukuReader
                  konten={selectedBukuHint.konten as UnsolvedCaseHintBuku}
                  onClose={() => { setBookOpen(false); setBookPage(0); }}
                  onBack={() => setBookOpen(false)}
                  pageIndex={bookPage}
                  onPageChange={setBookPage}
                />
              ) : (
                <BukuCoverPreview
                  konten={selectedBukuHint.konten as UnsolvedCaseHintBuku}
                  onOpenBook={() => setBookOpen(true)}
                  onBack={() => { setSelectedBukuId(null); setBookOpen(false); setBookPage(0); }}
                />
              )
            ) : (
              catHints.map((hint) => (
                <div key={hint.id}>
                  {revealed.has(hint.id) ? (
                    <button onClick={() => { setSelectedBukuId(hint.id); setBookOpen(false); setBookPage(0); }}
                      className="w-full text-left bg-white border border-[#d4c4a8] rounded-xl px-4 py-3.5 hover:border-[#8b4513]/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shrink-0">
                          <Book className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#3c2415] truncate">{(hint.konten as UnsolvedCaseHintBuku).judul_buku}</p>
                          <p className="text-[10px] text-[#8b7355] mt-0.5">Klik untuk buka sampul buku</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#c4a882]" />
                      </div>
                    </button>
                  ) : (
                    <LockedHintBtn label="Petunjuk Buku" onClick={() => reveal(hint.id)} />
                  )}
                </div>
              ))
            )
          ) : selectedCategory === "chat" ? (
            selectedChatId && selectedChatHint ? (
              <ChatPhonePopup
                konten={selectedChatHint.konten as UnsolvedCaseHintChat}
                onClose={() => { setSelectedChatId(null); setChatPage(0); }}
                pageIndex={chatPage}
                onPageChange={setChatPage}
              />
            ) : (
              catHints.map((hint) => (
                <div key={hint.id}>
                  {revealed.has(hint.id) ? (
                    <button onClick={() => { setSelectedChatId(hint.id); setChatPage(0); }}
                      className="w-full text-left bg-white border border-[#d4c4a8] rounded-xl px-4 py-3.5 hover:border-[#8b4513]/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#3c2415] truncate">
                            {(hint.konten as UnsolvedCaseHintChat).judul_hint || (hint.konten as UnsolvedCaseHintChat).nama_lawan_chat || "Chat"}
                          </p>
                          <p className="text-[10px] text-[#8b7355] mt-0.5">Klik untuk buka mockup chat</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#c4a882]" />
                      </div>
                    </button>
                  ) : (
                    <LockedHintBtn label="Petunjuk Chat" onClick={() => reveal(hint.id)} />
                  )}
                </div>
              ))
            )
          ) : selectedCategory === "karakter" ? (
            selectedKarakterId && selectedKarakterHint ? (
              <KarakterPreviewPopup
                konten={selectedKarakterHint.konten as UnsolvedCaseHintKarakter}
                onBack={() => { setSelectedKarakterId(null); }}
              />
            ) : (
              catHints.map((hint) => (
                <div key={hint.id}>
                  {revealed.has(hint.id) ? (
                    <button onClick={() => { setSelectedKarakterId(hint.id); }}
                      className="w-full text-left bg-white border border-[#d4c4a8] rounded-xl px-4 py-3.5 hover:border-[#8b4513]/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#3c2415] truncate">{(hint.konten as UnsolvedCaseHintKarakter).nama || "Karakter"}</p>
                          <p className="text-[10px] text-[#8b7355] mt-0.5">Klik untuk buka profil karakter</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#c4a882]" />
                      </div>
                    </button>
                  ) : (
                    <LockedHintBtn label="Petunjuk Karakter" onClick={() => reveal(hint.id)} />
                  )}
                </div>
              ))
            )
          ) : selectedCategory === "lainnya" ? (
            selectedLainnyaId && selectedLainnyaHint ? (
              <FloatingGalleryPopup
                title={(selectedLainnyaHint.konten as UnsolvedCaseHintLainnya).nama_hint || "Hint Lainnya"}
                images={Array.from({ length: Math.max(1, (selectedLainnyaHint.konten as UnsolvedCaseHintLainnya).jumlah || 1) }, () => (selectedLainnyaHint.konten as UnsolvedCaseHintLainnya).gambar).filter(Boolean)}
                onClose={() => { setSelectedLainnyaId(null); }}
              />
            ) : (
              catHints.map((hint) => (
                <div key={hint.id}>
                  {revealed.has(hint.id) ? (
                    <button onClick={() => { setSelectedLainnyaId(hint.id); }}
                      className="w-full text-left bg-white border border-[#d4c4a8] rounded-xl px-4 py-3.5 hover:border-[#8b4513]/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-stone-600 to-stone-800 flex items-center justify-center shrink-0">
                          <Paperclip className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#3c2415] truncate">{(hint.konten as UnsolvedCaseHintLainnya).nama_hint || "Lainnya"}</p>
                          <p className="text-[10px] text-[#8b7355] mt-0.5">Klik untuk lihat gambar</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#c4a882]" />
                      </div>
                    </button>
                  ) : (
                    <LockedHintBtn label="Petunjuk Lainnya" onClick={() => reveal(hint.id)} />
                  )}
                </div>
              ))
            )
          ) : (
            // kartu or other types
            catHints.map((hint) => (
              <div key={hint.id}>
                {revealed.has(hint.id) ? (
                  hint.tipe === "kartu" ? (
                    <button onClick={() => setSelectedKartuId(hint.id)}
                      className="w-full text-left bg-white border border-[#d4c4a8] rounded-xl px-4 py-3.5 hover:border-[#8b4513]/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0">
                          <IdCard className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#3c2415] truncate">Kartu Identitas</p>
                          <p className="text-[10px] text-[#8b7355] mt-0.5">Klik untuk buka kartu</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#c4a882]" />
                      </div>
                    </button>
                  ) : (
                    <div className="bg-white border border-[#c4a882] rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold text-[#8b4513] bg-[#e8dcc8] px-2 py-0.5 rounded-full border border-[#c4a882]">
                          {cfg.label}
                        </span>
                      </div>
                      <div className="text-[#3c2415] text-sm leading-relaxed">
                        {hint.tipe === "chat" && <ChatContent konten={hint.konten as UnsolvedCaseHintChat} />}
                        {hint.tipe === "buku" && <BukuContent konten={hint.konten as UnsolvedCaseHintBuku} />}
                        {hint.tipe === "karakter" && <KarakterContent konten={hint.konten as UnsolvedCaseHintKarakter} />}
                        {hint.tipe === "lainnya" && <LainnyaContent konten={hint.konten as UnsolvedCaseHintLainnya} />}
                      </div>
                    </div>
                  )
                ) : (
                  <LockedHintBtn label={`Petunjuk ${cfg.label}`} onClick={() => reveal(hint.id)} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Main grid view
  return (
    <div className="bg-[#f5efe6] rounded-2xl shadow-md border border-[#c4a882] overflow-hidden"
      style={{ boxShadow: "0 2px 12px rgba(139, 69, 19, 0.08)" }}
    >
      <div className="bg-[#5c3d2e] text-white px-5 py-3 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-300" />
        <h2 className="font-bold text-sm uppercase tracking-wider">Petunjuk</h2>
        <span className="text-xs text-[#c4a882] ml-auto font-mono">{revealed.size}/{hints.length}</span>
      </div>
      <div className="p-6 md:p-8">
        {hints.length === 0 ? (
          <p className="text-sm text-[#a09080] italic text-center py-6">Belum ada petunjuk.</p>
        ) : (
          <div
            className="relative min-h-[320px] rounded-2xl border-2 border-[#c4a882] p-6 mb-4 overflow-hidden"
            style={{
              backgroundImage: "url('/background_hint.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-4">
              {Object.entries(grouped).map(([tipe, items], idx) => {
                const hintType = tipe as UnsolvedCaseHintType;
                const cfg = CATEGORY_CONFIG[hintType];
                const revealedCount = items.filter((h) => revealed.has(h.id)).length;
                const Icon = cfg.icon;
                const isHovered = hoveredHintType === hintType;
                const isAnyHovered = hoveredHintType !== null;
                return (
                  <button
                    key={tipe}
                    onClick={() => setSelectedCategory(hintType)}
                    onMouseEnter={() => setHoveredHintType(hintType)}
                    onMouseLeave={() => setHoveredHintType(null)}
                    className={`bg-white rounded-2xl border-2 border-[#d4c4a8] p-5 shadow-[0_16px_30px_rgba(92,61,46,0.3)] hover:shadow-[0_0_0_4px_rgba(255,255,255,0.9),0_20px_38px_rgba(92,61,46,0.48)] transition-all duration-200 text-center w-36 ${cfg.rotate} ${
                      isHovered ? "scale-105 -translate-y-1 opacity-100" : isAnyHovered ? "opacity-45" : "opacity-100"
                    }`}
                    style={{ marginTop: idx % 2 === 0 ? "12px" : "28px" }}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cfg.color} flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-sm text-[#3c2415]">{cfg.label}</p>
                    <p className="text-[10px] text-[#8b7355] mt-1 font-mono">{revealedCount}/{items.length}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LockedHintBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center justify-between bg-white border border-[#d4c4a8] rounded-xl px-4 py-3 hover:border-[#8b4513]/40 transition-colors text-left group shadow-[0_12px_24px_rgba(92,61,46,0.22)]"
    >
      <span className="text-sm font-medium text-[#8b7355] group-hover:text-[#5c3d2e] transition-colors">
        <Lock className="w-3.5 h-3.5 inline mr-2 text-[#c4a882]" />
        {label}
      </span>
      <ChevronRight className="w-3.5 h-3.5 text-[#c4a882]" />
    </button>
  );
}

function ChatContent({ konten }: { konten: UnsolvedCaseHintChat }) {
  return (
    <div className="space-y-2">
      {konten.judul_hint && <p className="font-bold">{konten.judul_hint}</p>}
      {konten.nama_lawan_chat && <p className="text-xs text-[#8b7355] italic">Dari: {konten.nama_lawan_chat}</p>}
      {konten.images?.map((img, i) => (
        <img key={i} src={transformImageUrl(img)} alt={`Chat ${i + 1}`} className="max-h-48 rounded-lg border border-[#d4c4a8]" />
      ))}
    </div>
  );
}

function BukuContent({ konten }: { konten: UnsolvedCaseHintBuku }) {
  return (
    <div className="space-y-2">
      <p className="font-bold italic" style={{ fontFamily: "serif" }}>{konten.judul_buku}</p>
      {konten.cover_buku && (
        <img src={transformImageUrl(konten.cover_buku)} alt="Cover" className="max-h-40 rounded-lg border border-[#c4a882]" />
      )}
      {konten.isi_buku?.map((img, i) => (
        <img key={i} src={transformImageUrl(img)} alt={`Halaman ${i + 1}`} className="max-h-40 rounded-lg border border-[#d4c4a8]" />
      ))}
    </div>
  );
}

function KarakterContent({ konten }: { konten: UnsolvedCaseHintKarakter }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {konten.foto_karakter ? (
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#c4a882] shrink-0 bg-[#e8dcc8]">
            <img src={transformImageUrl(konten.foto_karakter)} alt={konten.nama} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#c4a882] shrink-0 bg-[#e8dcc8] flex items-center justify-center">
            <User className="w-5 h-5 text-[#8b7355]" />
          </div>
        )}
        <p className="font-bold">{konten.nama || "Guest Logo"}</p>
      </div>
      {konten.images?.map((img, i) => (
        <img key={i} src={transformImageUrl(img)} alt={`Kesaksian ${i + 1}`} className="max-h-40 rounded-lg border border-[#d4c4a8]" />
      ))}
    </div>
  );
}

function LainnyaContent({ konten }: { konten: UnsolvedCaseHintLainnya }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-bold">{konten.nama_hint}</p>
        {konten.jumlah > 1 && (
          <span className="bg-[#e8dcc8] text-[#8b4513] text-[10px] font-bold px-2 py-0.5 rounded-full">x{konten.jumlah}</span>
        )}
      </div>
      {konten.gambar && (
        <img src={transformImageUrl(konten.gambar)} alt={konten.nama_hint} className="max-h-40 rounded-lg border border-[#d4c4a8]" />
      )}
    </div>
  );
}

function BukuCoverPreview({ konten, onOpenBook, onBack }: { konten: UnsolvedCaseHintBuku; onOpenBook: () => void; onBack: () => void }) {
  const [zoomed, setZoomed] = useState(false);
  return (
    <div className="fixed inset-0 z-50 bg-[#3c2415]/60 backdrop-blur-sm" onClick={onBack}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <div className={`rounded-[28px] border-2 border-[#c4a882] bg-[#f8f1e5] p-3 shadow-[0_20px_40px_rgba(53,33,18,0.35)] transition-all duration-200 ${zoomed ? "scale-110" : "scale-100"}`}>
          <div className="rounded-[20px] border border-[#d4c4a8] bg-white p-2 shadow-inner">
            <img src={transformImageUrl(konten.cover_buku)} alt={konten.judul_buku} className="w-[220px] max-w-[60vw] h-auto rounded-xl object-cover" />
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          <button onClick={() => setZoomed((prev) => !prev)}
            className="text-[11px] text-white/90 hover:text-white bg-[#3c2415]/70 backdrop-blur-sm px-4 py-1.5 rounded-full font-semibold transition-colors flex items-center gap-1 shadow-md"
          >
            {zoomed ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            {zoomed ? "Perkecil" : "Zoom"}
          </button>
          <button onClick={onOpenBook}
            className="text-[11px] text-white/90 hover:text-white bg-[#8b4513]/80 backdrop-blur-sm px-4 py-1.5 rounded-full font-semibold transition-colors flex items-center gap-1 shadow-md"
          >
            <BookOpen className="w-3 h-3" />
            Buka Buku
          </button>
          <button onClick={onBack}
            className="text-[11px] text-white/90 hover:text-white bg-[#3c2415]/70 backdrop-blur-sm px-4 py-1.5 rounded-full font-semibold transition-colors flex items-center gap-1 shadow-md"
          >
            <X className="w-3 h-3" />
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function BukuReader({ konten, onClose, onBack, pageIndex, onPageChange }: {
  konten: UnsolvedCaseHintBuku; onClose: () => void; onBack: () => void;
  pageIndex: number; onPageChange: (page: number) => void;
}) {
  const pages = konten.isi_buku || [];
  const currentPage = pages[Math.max(0, Math.min(pageIndex, pages.length - 1))] || konten.cover_buku;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button onClick={onBack}
          className="text-xs font-semibold text-[#5c3d2e] bg-white/80 hover:bg-white border border-[#c4a882] rounded-full px-3 py-1.5 shadow-sm"
        >
          <ArrowLeft className="w-3 h-3 inline mr-1" />
          Kembali
        </button>
        <div className="text-[11px] font-bold text-[#8b4513] bg-[#e8dcc8] px-3 py-1 rounded-full border border-[#c4a882]">
          {pageIndex + 1} / {pages.length}
        </div>
        <button onClick={onClose}
          className="text-xs font-semibold text-[#5c3d2e] bg-white/80 hover:bg-white border border-[#c4a882] rounded-full px-3 py-1.5 shadow-sm"
        >
          <X className="w-3 h-3 inline mr-1" />
          Tutup Buku
        </button>
      </div>
      <div className="relative mx-auto w-full max-w-[420px] rounded-[28px] border-2 border-[#c4a882] bg-[#f2e7d4] p-3 shadow-[0_18px_34px_rgba(92,61,46,0.2)]">
        <div className="relative rounded-[22px] border border-[#d4c4a8] bg-[#faf6f0] p-3 shadow-inner">
          <div className="relative z-10 flex items-center justify-center min-h-[420px] overflow-hidden rounded-[16px] bg-white">
            <img src={transformImageUrl(currentPage)} alt={`Halaman buku ${pageIndex + 1}`}
              className="max-h-[420px] w-auto object-contain rounded-[12px]" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
          disabled={pageIndex === 0}
          className="text-xs font-bold text-white bg-[#8b4513] hover:bg-[#6b3410] disabled:opacity-40 rounded-full px-4 py-2 shadow-[0_10px_20px_rgba(92,61,46,0.24)] transition-all"
        >
          Prev
        </button>
        <button onClick={() => onPageChange(Math.min(pages.length - 1, pageIndex + 1))}
          disabled={pageIndex >= pages.length - 1}
          className="text-xs font-bold text-white bg-[#8b4513] hover:bg-[#6b3410] disabled:opacity-40 rounded-full px-4 py-2 shadow-[0_10px_20px_rgba(92,61,46,0.24)] transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function KarakterPreviewPopup({ konten, onBack }: { konten: UnsolvedCaseHintKarakter; onBack: () => void }) {
  const avatar = konten.foto_karakter ? transformImageUrl(konten.foto_karakter) : "";
  return (
    <div className="fixed inset-0 z-50 bg-[#3c2415]/60 backdrop-blur-sm" onClick={onBack}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,760px)] rounded-[32px] border-2 border-[#c4a882] bg-[#f8f1e5] p-4 shadow-[0_24px_50px_rgba(53,33,18,0.4)]" onClick={(e) => e.stopPropagation()}>
        <div className="grid gap-4 md:grid-cols-[240px_minmax(0,1fr)] items-start">
          <div className="rounded-[24px] border-2 border-[#c4a882] bg-white p-3 shadow-inner">
            <div className="rounded-[18px] overflow-hidden bg-[#efe4d0] aspect-[4/5] border border-[#d4c4a8]">
              {avatar ? (
                <img src={avatar} alt={konten.nama || "Karakter"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8b7355]">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[20px] border border-[#d4c4a8] bg-[#fffdf8] p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#8b7355]">Surat Petunjuk</p>
              <h3 className="font-bold text-[#3c2415] text-2xl mt-2">{konten.nama || "Guest Logo"}</h3>
              <p className="text-sm text-[#5c3d2e] mt-2 leading-relaxed">
                baca kesaksian dari karakter ini yang didapat dari hasil interogasi
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {konten.images && konten.images.length > 0 && (
                <Images className="w-4 h-4 text-[#8b7355]" />
              )}
              <button onClick={onBack}
                className="text-[11px] text-white/90 hover:text-white bg-[#3c2415]/70 backdrop-blur-sm px-4 py-1.5 rounded-full font-semibold transition-colors flex items-center gap-1 shadow-md"
              >
                <X className="w-3 h-3" />
                Tutup
              </button>
            </div>
            {konten.images?.map((img, i) => (
              <img key={i} src={transformImageUrl(img)} alt={`Kesaksian ${i + 1}`} className="max-h-60 rounded-lg border border-[#d4c4a8]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatPhonePopup({ konten, onClose, pageIndex, onPageChange }: {
  konten: UnsolvedCaseHintChat; onClose: () => void; pageIndex: number; onPageChange: (page: number) => void;
}) {
  const [detailMode, setDetailMode] = useState(false);
  const pages = konten.images || [];
  const currentImage = pages[Math.max(0, Math.min(pageIndex, pages.length - 1))] || "/card_detektif.png";
  const contactName = konten.nama_lawan_chat || konten.judul_hint || "Kontak";
  return (
    <div className="fixed inset-0 z-50 bg-[#3c2415]/60 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" onClick={(e) => e.stopPropagation()}>
        {!detailMode ? (
          <div className="mx-auto w-[min(90vw,360px)] rounded-[36px] border-[8px] border-[#22160c] bg-[#0f172a] p-2 shadow-[0_24px_50px_rgba(53,33,18,0.45)]">
            <div className="rounded-[28px] overflow-hidden border border-[#374151] bg-[#0f172a]">
              <div className="flex items-center gap-2 bg-[#0f172a] px-3 py-2 text-white">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                <p className="font-bold text-[12px]">{contactName}</p>
              </div>
              <div className="bg-[#0f172a] p-1">
                <img src={transformImageUrl(currentImage)} alt={`Chat ${pageIndex + 1}`} className="w-full h-auto max-h-[420px] object-contain rounded-[18px] bg-[#111827]" />
              </div>
              <div className="flex justify-center gap-2 p-3 bg-[#0f172a]">
                <button onClick={() => onPageChange(Math.max(0, pageIndex - 1))} disabled={pageIndex === 0}
                  className="text-[10px] font-bold text-white bg-[#8b4513] hover:bg-[#6b3410] disabled:opacity-40 rounded-full px-3 py-1.5">Prev</button>
                <button onClick={() => onPageChange(Math.min(pages.length - 1, pageIndex + 1))} disabled={pageIndex >= pages.length - 1}
                  className="text-[10px] font-bold text-white bg-[#8b4513] hover:bg-[#6b3410] disabled:opacity-40 rounded-full px-3 py-1.5">Next</button>
                <button onClick={() => setDetailMode(true)}
                  className="text-[10px] font-bold text-white bg-[#8b4513] hover:bg-[#6b3410] rounded-full px-3 py-1.5">Lihat Detail</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[30px] border-2 border-[#c4a882] bg-[#f8f1e5] p-4 shadow-[0_24px_50px_rgba(53,33,18,0.5)] w-[min(94vw,980px)]">
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8b7355]">Lihat Detail</p>
                <p className="font-bold text-[#3c2415]">{contactName}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setDetailMode(false)}
                  className="text-[11px] text-white/90 hover:text-white bg-[#3c2415]/70 backdrop-blur-sm px-4 py-1.5 rounded-full font-semibold transition-colors flex items-center gap-1 shadow-md">
                  <ArrowLeft className="w-3 h-3" />
                  Kembali
                </button>
                <button onClick={onClose}
                  className="text-[11px] text-white/90 hover:text-white bg-[#3c2415]/70 backdrop-blur-sm px-4 py-1.5 rounded-full font-semibold transition-colors flex items-center gap-1 shadow-md">
                  <X className="w-3 h-3" />
                  Tutup
                </button>
              </div>
            </div>
            <div className="rounded-[20px] border border-[#d4c4a8] bg-[#f8f1e5] p-4 shadow-inner">
              <div className="flex items-center justify-center min-h-[52vh]">
                <img src={transformImageUrl(currentImage)} alt={`Chat detail ${pageIndex + 1}`}
                  className="max-h-[70vh] w-auto rounded-[18px] object-contain shadow-[0_18px_34px_rgba(92,61,46,0.24)]" />
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <button onClick={() => onPageChange(Math.max(0, pageIndex - 1))} disabled={pageIndex === 0}
                  className="text-[10px] font-bold text-white bg-[#8b4513] hover:bg-[#6b3410] disabled:opacity-40 rounded-full px-3 py-1.5">Prev</button>
                <button onClick={() => onPageChange(Math.min(pages.length - 1, pageIndex + 1))} disabled={pageIndex >= pages.length - 1}
                  className="text-[10px] font-bold text-white bg-[#8b4513] hover:bg-[#6b3410] disabled:opacity-40 rounded-full px-3 py-1.5">Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FloatingGalleryPopup({ title, images, onClose }: { title: string; images: string[]; onClose: () => void }) {
  const [zoomed, setZoomed] = useState(false);
  const safeImages = images.length > 0 ? images : ["/card_detektif.png"];
  return (
    <div className="fixed inset-0 z-50 bg-[#3c2415]/60 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(94vw,980px)] rounded-[30px] border-2 border-[#c4a882] bg-[#f8f1e5]/95 p-4 shadow-[0_24px_50px_rgba(53,33,18,0.5)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8b7355]">Gallery</p>
            <p className="font-bold text-[#3c2415]">{title}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setZoomed(!zoomed)}
              className="text-[11px] text-white/90 hover:text-white bg-[#3c2415]/70 backdrop-blur-sm px-4 py-1.5 rounded-full font-semibold transition-colors flex items-center gap-1 shadow-md">
              {zoomed ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              {zoomed ? "Perkecil" : "Zoom"}
            </button>
            <button onClick={onClose}
              className="text-[11px] text-white/90 hover:text-white bg-[#3c2415]/70 backdrop-blur-sm px-4 py-1.5 rounded-full font-semibold transition-colors flex items-center gap-1 shadow-md">
              <X className="w-3 h-3" />
              Tutup
            </button>
          </div>
        </div>
        <div className="rounded-[20px] border border-[#d4c4a8] bg-[#f8f1e5] p-4 shadow-inner">
          {zoomed ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <img src={transformImageUrl(safeImages[0])} alt={title}
                className="max-w-full max-h-[calc(100vh-160px)] w-auto h-auto object-contain rounded-[18px]" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 items-center justify-center min-h-[40vh]">
              {safeImages.map((img, idx) => (
                <div key={idx} className="rounded-[18px] border-2 border-[#c4a882] bg-white p-2 shadow-[0_18px_34px_rgba(92,61,46,0.2)]"
                  style={{ transform: `rotate(${-5 + idx * 7}deg)` }}>
                  <img src={transformImageUrl(img)} alt={`${title} ${idx + 1}`}
                    className="w-[160px] max-w-[32vw] h-auto rounded-[12px] object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
