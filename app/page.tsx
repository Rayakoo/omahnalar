import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import Features from "@/components/Features";
import StatsSection from "@/components/StatsSection";
import MitraSection from "@/components/MitraSection";
import PilarSection from "@/components/PilarSection";
import HomeCeritaSection from "@/components/HomeCeritaSection";
import ServicesSection from "@/components/ServicesSection";
import TestimonialSection from "@/components/TestimonialSection";
import VideoTestimonialSection from "@/components/VideoTestimonialSection";
import LocationSection from "@/components/LocationSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <StatsSection />
      <MitraSection />
      <PilarSection />
      <ServicesSection />
      <TestimonialSection />
      <VideoTestimonialSection />
      <LocationSection />
    </>
  );
}
