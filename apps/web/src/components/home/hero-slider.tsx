"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/data/home";

const INTERVAL_MS = 6000;

interface HeroSliderProps {
  slides: HeroSlide[];
  children?: React.ReactNode;
}

export function HeroSlider({ slides, children }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="relative min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] w-full overflow-hidden bg-navy-dark flex items-center justify-center"
      aria-label="Featured Travel Experiences"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Backgrounds */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            i === index ? "opacity-100 z-0" : "opacity-0 z-0 pointer-events-none",
          )}
          aria-hidden={i !== index}
        >
          {slide.type === "video" ? (
            <video
              className="h-full w-full object-cover"
              src={slide.src}
              autoPlay
              muted
              playsInline
              onEnded={nextSlide}
            />
          ) : (
            <Image
              src={slide.src}
              alt={slide.caption || "Dellics Travels Destination"}
              fill
              className="object-cover scale-105 transform motion-safe:animate-subtle-zoom"
              priority={i === 0}
            />
          )}

          {/* Light Cinematic Gradients for high contrast and picture vibrancy */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0060]/75 via-[#0A0060]/30 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0060]/50 via-transparent to-[#0A0060]/50" />
        </div>
      ))}

      {/* Hero Content Layer (QuickBook Transparent Feature) */}
      <div className="relative z-20 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex items-center justify-center">
        {children}
      </div>

      {/* Bottom Progress Indicator Dots */}
      <div
        className="absolute bottom-2 sm:bottom-3 right-6 z-20 flex items-center gap-2 rounded-full bg-navy/80 px-3 py-1 backdrop-blur-md border border-white/15 shadow-md"
        role="tablist"
        aria-label="Slide Selector"
      >
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              i === index ? "w-8 bg-brand-orange" : "w-2 bg-white/40 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </section>
  );
}
