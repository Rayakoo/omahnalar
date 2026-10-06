import TopBar from "@/components/TopBar";
import StoryForm from "@/components/StoryForm";
import Reveal from "@/components/Reveal";

export default function BagikanCerita() {
  return (
    <div className="min-h-screen bg-page-50 text-brand-900 font-sans antialiased">
      <TopBar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Reveal>
          <StoryForm />
        </Reveal>
      </main>
    </div>
  );
}
