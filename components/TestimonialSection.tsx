"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { id, en } from "@/data/translations";

const TESTIMONIALS_ID = [
  {
    name: "Ani, 19 tahun",
    role: "Siswa",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    content:
      "Omah Nalar membantu saya memahami kesehatan reproduksi dengan cara yang mudah dan tidak memalukan. Sekarang saya lebih percaya diri untuk menjaga diri sendiri dan berbicara terbuka dengan teman-teman.",
  },
  {
    name: "Pak Budi",
    role: "Guru",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    content:
      "Sebagai guru, modul Omah Belajar sangat membantu dalam menyampaikan materi kesehatan reproduksi ke murid-murid saya. Bahasanya mudah dipahami dan interaktif.",
  },
  {
    name: "Sari",
    role: "Relawan",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    content:
      "Saya bangga menjadi bagian dari komunitas Omah Nalar. Bersama kita bisa menciptakan perubahan positif untuk generasi muda Indonesia.",
  },
  {
    name: "Dimas, 21 tahun",
    role: "Mahasiswa",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    content:
      "Awalnya ragu untuk ikut course, tapi ternyata materinya seru dan relevan banget. Kuis interaktifnya bikin belajar jadi nggak membosankan.",
  },
];

const TESTIMONIALS_EN = [
  {
    name: "Ani, 19 years",
    role: "Student",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    content:
      "Omah Nalar helped me understand reproductive health in a way that's easy and not embarrassing. Now I'm more confident in taking care of myself and talking openly with friends.",
  },
  {
    name: "Mr. Budi",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    content:
      "As a teacher, the Omah Belajar modules are very helpful in delivering reproductive health material to my students. The language is easy to understand and interactive.",
  },
  {
    name: "Sari",
    role: "Volunteer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    content:
      "I am proud to be part of the Omah Nalar community. Together we can create positive change for Indonesia's young generation.",
  },
  {
    name: "Dimas, 21 years",
    role: "College Student",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    content:
      "At first I was hesitant to take the course, but the material turned out to be fun and very relevant. The interactive quizzes make learning not boring.",
  },
];

export default function TestimonialSection() {
  const { locale } = useLanguage();
  const t = locale === "id" ? id.home : en.home;
  const testimonials = locale === "id" ? TESTIMONIALS_ID : TESTIMONIALS_EN;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((p) => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const item = testimonials[index];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <section className="bg-brand-900 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-secondary-500 uppercase tracking-wider">
            {t.testimonialsTitle}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-page-50 mt-3">
            {t.testimonialsSub}
          </h2>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white rounded-3xl p-6 md:p-10 border border-brand-100/20 shadow-lg flex flex-col md:flex-row items-center gap-6 md:gap-10"
            >
              {/* LEFT: Avatar + Name */}
              <div className="flex flex-col items-center md:items-center shrink-0">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-secondary-500/50 shadow-lg"
                />
                <p className="text-brand-900 font-bold text-sm mt-3 text-center">{item.name}</p>
                <p className="text-brand-700/60 text-xs text-center">{item.role}</p>
              </div>

              {/* RIGHT: Testimonial Text */}
              <div className="flex-1">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-secondary-500/60 mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                </svg>
                <p className="text-brand-900/80 leading-relaxed text-sm md:text-base">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setDirection(idx > index ? 1 : -1); setIndex(idx); }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === index ? "bg-secondary-500 w-6" : "bg-brand-100/30 hover:bg-brand-100/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
