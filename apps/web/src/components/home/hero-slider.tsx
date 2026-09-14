"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/data/home";

const DEFAULT_INTERVAL_MS = 7000;

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  children?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  intervalMs?: number;
}

export function HeroSlider({
  slides,
  children,
  breadcrumbs,
  className,
  intervalMs = DEFAULT_INTERVAL_MS,
}: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVisibleRef = useRef(true);

  const currentSlide = slides[index];

  const nextSlide = useCallback(() => {
    setVideoReady(false);
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // IntersectionObserver to pause video & slideshow when scrolled offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        isVisibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        } else {
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Page Visibility API to suspend video when user switches browser tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      } else if (isVisibleRef.current) {
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Slide transition controller
  useEffect(() => {
    if (isPaused || prefersReducedMotion || !currentSlide) return;

    // For video slides: let onEnded advance the slide, with a 30s safety timeout fallback
    if (currentSlide.type === "video") {
      const safetyTimer = setTimeout(nextSlide, 30_000);
      return () => clearTimeout(safetyTimer);
    }

    // For image slides: standard interval transition
    const timer = setInterval(nextSlide, intervalMs);
    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, currentSlide?.type, nextSlide, intervalMs]);

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative min-h-[520px] sm:min-h-[540px] lg:min-h-[580px] w-full overflow-hidden bg-navy-dark flex items-center justify-center",
        className
      )}
      aria-label="Featured Travel Experiences"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Layer */}
      {slides.map((slide, i) => {
        const isActive = i === index;

        return (
          <div
            key={slide.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              isActive ? "opacity-100 z-0" : "opacity-0 z-0 pointer-events-none"
            )}
            aria-hidden={!isActive}
          >
            {/* High-resolution poster image for instant FCP/LCP and fallback */}
            {slide.poster || slide.type === "image" ? (
              <Image
                src={slide.poster || slide.src}
                alt={slide.caption || "Dellics Travels Destination"}
                fill
                priority={i === 0}
                className={cn(
                  "object-cover scale-105 transform motion-safe:animate-subtle-zoom transition-opacity duration-700",
                  slide.type === "video" && videoReady ? "opacity-0" : "opacity-100"
                )}
                sizes="100vw"
              />
            ) : null}

            {/* Video layer: Mounted only when active to prevent concurrent network & GPU memory overhead */}
            {slide.type === "video" && isActive && !prefersReducedMotion ? (
              <video
                ref={videoRef}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                  videoReady ? "opacity-100" : "opacity-0"
                )}
                src={slide.src}
                autoPlay
                muted
                playsInline
                preload="metadata"
                onCanPlay={() => setVideoReady(true)}
                onPlaying={() => setVideoReady(true)}
                onEnded={nextSlide}
              />
            ) : null}

            {/* Light Cinematic Luxury Gradients for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0060]/80 via-[#0A0060]/35 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0060]/50 via-transparent to-[#0A0060]/50 pointer-events-none" />
          </div>
        );
      })}

      {/* Hero Content Layer */}
      <div className="relative z-20 w-full mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col items-center justify-center">
        {/* Optional Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center justify-center gap-1.5 text-xs text-white/80"
          >
            <Link href="/" className="hover:text-brand-orange transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                <ChevronRight className="size-3 text-white/50" />
                {crumb.href && idx < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="hover:text-brand-orange transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-brand-orange font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}

        {children}
      </div>

      {/* Bottom Progress Dots */}
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
            onClick={() => {
              setVideoReady(false);
              setIndex(i);
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              i === index ? "w-8 bg-brand-orange" : "w-2 bg-white/40 hover:bg-white/70"
            )}
          />
        ))}
      </div>
    </section>
  );
}
