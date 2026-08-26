"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/data/home";

const INTERVAL_MS = 5000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-ink" aria-label="Featured">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={cn("absolute inset-0 transition-opacity duration-700", i === index ? "opacity-100" : "opacity-0")}
          aria-hidden={i !== index}
        >
          {slide.type === "video" ? (
            <video
              className="h-full w-full object-cover"
              src={slide.src}
              autoPlay
              muted
              playsInline
              onEnded={() => setIndex((p) => (p + 1) % slides.length)}
            />
          ) : (
            <Image src={slide.src} alt={slide.caption} fill className="object-cover" priority={i === 0} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 pb-40 text-white">
            <p className="max-w-xl font-display text-2xl font-bold sm:text-4xl">{slide.caption}</p>
          </div>
        </div>
      ))}
      <div className="absolute right-4 top-4 z-10 flex gap-2" role="tablist" aria-label="Slides">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn("h-2.5 rounded-pill transition-all", i === index ? "w-8 bg-brand-orange" : "w-2.5 bg-white/60")}
          />
        ))}
      </div>
    </section>
  );
}
