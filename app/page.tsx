import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import Features from "@/components/Features";
import StatsSection from "@/components/StatsSection";
import PilarSection from "@/components/PilarSection";
import ProgramSection from "@/components/ProgramSection";
import HomeCeritaSection from "@/components/HomeCeritaSection";
import TestimonialSection from "@/components/TestimonialSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <Features />
      <StatsSection />
      <PilarSection />
      <HomeCeritaSection />
      <ProgramSection />
      <TestimonialSection />
    </>
  );
}
