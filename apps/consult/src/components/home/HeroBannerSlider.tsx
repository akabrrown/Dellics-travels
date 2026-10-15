"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles as SparklesIcon, Pause, Play } from "lucide-react";

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  badge: string;
  title: string;
  description: string;
  link: string;
  ctaText: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "big-future",
    image: "/5940703325818917439_121.jpg",
    alt: "Dellics Education Consult - Big Future, Find Your Dream College For You",
    badge: "BigFuture™ Partner",
    title: "Find Your Dream College For You",
    description: "USA, UK, Canada, Australia, Germany & More. Direct university applications, scholarships, and visa guidance.",
    link: "/portal/bigfuture",
    ctaText: "Explore BigFuture",
  },
  {
    id: "sat-registration",
    image: "/5940703325818917438_121.jpg",
    alt: "Dellics Education Consult - Register for the SAT, Your Next Step to a Global Future",
    badge: "SAT® Suite of Assessments",
    title: "Register for the SAT®",
    description: "Open more doors. Study at world-class universities. Expert guidance, study materials, and official testing.",
    link: "/portal/sat",
    ctaText: "Register for SAT",
  },
  {
    id: "dream-university",
    image: "/5940703325818917440_121.jpg",
    alt: "Dellics Education Consult - Your Dream University Is Closer Than You Think",
    badge: "Global Admissions",
    title: "Your Dream University Is Closer Than You Think",
    description: "Connect directly with Harvard, Oxford, Toronto, Melbourne, McGill, Cambridge and 100+ partner universities.",
    link: "/services/admissions",
    ctaText: "Explore Admissions",
  },
];

export function HeroBannerSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = HERO_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  // Auto-play timer (5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchEndX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Dellics Education Consult Featured Highlights"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-slate-900 group focus:outline-none focus:ring-2 focus:ring-brand-orange/50 select-none"
    >
      {/* Aspect Ratio Container matching the 1280x480 banners (8:3 aspect ratio) */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[2.2/1] lg:aspect-[8/3]">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${total}: ${slide.title}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Link
                href={slide.link}
                className="relative block w-full h-full group/slide overflow-hidden cursor-pointer"
              >
                {/* Banner Image */}
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1200px"
                  className="object-cover object-center transform group-hover/slide:scale-[1.015] transition-transform duration-700 ease-out"
                />

                {/* Subtle bottom gradient overlay for readability of interactive controls */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                {/* Accessible Floating CTA Chip (Bottom Right) */}
                <div className="absolute right-4 bottom-4 z-20 hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-lg hover:bg-brand-orange-light transition-all transform group-hover/slide:translate-x-1">
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow: Previous */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          prevSlide();
        }}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Navigation Arrow: Next */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          nextSlide();
        }}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Bottom Control Bar: Indicators + Counter */}
      <div className="absolute bottom-3 left-4 sm:left-6 z-30 flex items-center gap-2 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
        {/* Indicators */}
        <div className="flex items-center gap-1.5">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === current}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-7 bg-brand-orange shadow-sm"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Counter */}
        <span className="text-[11px] font-mono font-bold text-white/90 pl-1">
          0{current + 1} / 0{total}
        </span>
      </div>
    </div>
  );
}
