import { getStoryById } from "@/services/stories";
import { DUMMY_STORIES } from "@/data/dummyStories";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default async function CeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let story;
  try {
    story = await getStoryById(id);
  } catch {
    story = DUMMY_STORIES.find((s) => s.id === id);
  }

  if (!story) notFound();

  const author = story.is_anonymous ? "Anonim" : story.name;

  return (
    <div className="min-h-screen bg-page-50 font-sans antialiased">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/omah-cerita"
          className="inline-flex items-center gap-1.5 text-sm text-brand-700 hover:text-brand-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-brand-100 overflow-hidden">
          <div className="h-2" style={{ background: "linear-gradient(90deg, #7C78A8, #FAC775, #F07A94)" }} />

          <div className="p-6 md:p-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-brand-100 text-brand-700">
                {story.category || "Cerita"}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-brand-900 leading-snug mb-4">
              {story.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-brand-700/60 mb-6 pb-6 border-b border-brand-100">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> {author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {formatDate(story.created_at)}
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-brand-900/80 leading-relaxed whitespace-pre-line">
              {story.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
