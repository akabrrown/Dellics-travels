"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/data/home";

const INTERVAL_MS = 6000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
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
      className="relative h-[58vh] min-h-[440px] max-h-[560px] sm:h-[62vh] w-full overflow-hidden bg-navy-dark"
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
            i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none",
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
              alt={slide.caption}
              fill
              className="object-cover scale-105 transform motion-safe:animate-subtle-zoom"
              priority={i === 0}
            />
          )}

          {/* Light Cinematic Gradients for clear picture visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0060]/75 via-[#0A0060]/25 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0060]/60 via-[#0A0060]/20 to-transparent" />

          {/* Slide Text Content */}
          <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 pt-6 sm:pt-8">
            <div className="max-w-2xl text-left">
              {/* Title */}
              <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl drop-shadow-md leading-[1.15] animate-in fade-in slide-in-from-bottom-3 duration-700">
                {slide.caption}
              </h1>

              {/* Subtitle */}
              <p className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed font-light drop-shadow animate-in fade-in slide-in-from-bottom-4 duration-900 max-w-xl">
                {slide.subtitle}
              </p>

              {/* Action CTA */}
              <div className="mt-5 sm:mt-6 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                <Button
                  asChild
                  size="default"
                  className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-7 shadow-xl hover:shadow-2xl transition-all"
                >
                  <Link href={slide.ctaHref} className="inline-flex items-center gap-2">
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Bottom Progress Indicator Dots */}
      <div
        className="absolute bottom-24 sm:bottom-28 right-6 z-20 flex items-center gap-2 rounded-full bg-navy/80 px-3.5 py-1.5 backdrop-blur-md border border-white/15 shadow-lg"
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
