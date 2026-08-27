"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PhoneCall, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import type { HeroSlide } from "@/data/home";

const INTERVAL_MS = 6000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="relative h-[85vh] min-h-[580px] max-h-[820px] w-full overflow-hidden bg-navy-dark"
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

          {/* Luxury Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/60 to-navy-dark/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy-dark/40 to-transparent" />

          {/* Slide Text Content */}
          <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8 pb-28 sm:pb-32">
            <div className="max-w-2xl text-left">
              {/* Category Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-pill bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange backdrop-blur-md border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <ShieldCheck className="size-3.5" />
                {slide.badge}
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md leading-[1.1] animate-in fade-in slide-in-from-bottom-3 duration-700">
                {slide.caption}
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed font-light drop-shadow animate-in fade-in slide-in-from-bottom-4 duration-900">
                {slide.subtitle}
              </p>

              {/* Action CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                <Button
                  asChild
                  size="lg"
                  className="rounded-pill bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 shadow-xl hover:shadow-2xl transition-all"
                >
                  <Link href={slide.ctaHref} className="inline-flex items-center gap-2">
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>

                <a
                  href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(`Hello Dellics Travels, I am interested in: ${slide.caption}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-pill bg-white/15 hover:bg-white/25 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md border border-white/20 transition-all"
                >
                  <PhoneCall className="size-4 text-emerald-400" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 z-20 hidden sm:flex items-center">
        <button
          type="button"
          onClick={prevSlide}
          className="flex size-11 items-center justify-center rounded-full bg-navy/60 hover:bg-brand-orange text-white backdrop-blur-md border border-white/15 transition-colors shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="size-6" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 z-20 hidden sm:flex items-center">
        <button
          type="button"
          onClick={nextSlide}
          className="flex size-11 items-center justify-center rounded-full bg-navy/60 hover:bg-brand-orange text-white backdrop-blur-md border border-white/15 transition-colors shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight className="size-6" />
        </button>
      </div>

      {/* Bottom Progress Bullets */}
      <div
        className="absolute bottom-8 right-6 z-20 flex items-center gap-2.5 rounded-pill bg-navy/70 px-4 py-2 backdrop-blur-md border border-white/15"
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
              "h-2 rounded-pill transition-all duration-500",
              i === index ? "w-8 bg-brand-orange" : "w-2 bg-white/40 hover:bg-white/70",
            )}
          />
        ))}
      </div>
    </section>
  );
}
