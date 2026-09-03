"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GalleryItem } from "@/data/gallery";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    if (filter === "ghana") return item.alt.toLowerCase().includes("ghana") || item.src.includes("africa/cape") || item.src.includes("kakum");
    if (filter === "dubai") return item.alt.toLowerCase().includes("dubai");
    if (filter === "safari") return item.alt.toLowerCase().includes("safari") || item.alt.toLowerCase().includes("kenya") || item.alt.toLowerCase().includes("tanzania");
    if (filter === "beach") return item.alt.toLowerCase().includes("beach") || item.alt.toLowerCase().includes("zanzibar") || item.alt.toLowerCase().includes("villa");
    return true;
  });

  const close = useCallback(() => {
    setOpenIndex(null);
    lastTriggerRef.current?.focus();
  }, []);

  const openItem = openIndex === null ? undefined : filteredItems[openIndex];

  useEffect(() => {
    if (openIndex === null) return;
    closeButtonRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight")
        setOpenIndex((i) => (i === null ? i : (i + 1) % filteredItems.length));
      if (event.key === "ArrowLeft")
        setOpenIndex((i) => (i === null ? i : (i - 1 + filteredItems.length) % filteredItems.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, filteredItems.length, close]);

  const categories = [
    { id: "all", label: "All Photos" },
    { id: "ghana", label: "Ghana & Heritage" },
    { id: "dubai", label: "Dubai & Middle East" },
    { id: "safari", label: "Safaris & Wildlife" },
    { id: "beach", label: "Beaches & Stays" },
  ];

  return (
    <>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 py-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilter(cat.id)}
            className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
              filter === cat.id
                ? "bg-brand-orange text-white shadow-md"
                : "bg-white text-navy hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:px-8 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={(event) => {
              lastTriggerRef.current = event.currentTarget;
              setOpenIndex(index);
            }}
            className="group relative h-72 w-full overflow-hidden rounded-3xl bg-slate-100 border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-brand-orange"
            aria-label={`Open image: ${item.alt}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-orange">
                <MapPin className="size-3" />
                Verified Travel Moment
              </span>
              <p className="mt-1 font-display text-sm font-bold line-clamp-2">
                {item.alt}
              </p>
            </div>

            <div className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="size-4" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {openIndex !== null && openItem ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openItem.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-dark/95 backdrop-blur-md p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="icon"
            className="absolute right-6 top-6 text-white hover:bg-white/20 rounded-full"
            onClick={close}
            aria-label="Close"
          >
            <X className="size-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 sm:left-8 text-white hover:bg-white/20 rounded-full"
            aria-label="Previous image"
            onClick={() => setOpenIndex((openIndex - 1 + filteredItems.length) % filteredItems.length)}
          >
            <ChevronLeft className="size-8" />
          </Button>

          <div className="flex flex-col items-center max-w-4xl w-full">
            <div className="relative h-[65vh] w-full overflow-hidden rounded-2xl">
              <Image
                src={openItem.src}
                alt={openItem.alt}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center text-white">
              <p className="font-display text-base font-bold">{openItem.alt}</p>
              <p className="text-xs text-white/70 mt-1">
                Image {openIndex + 1} of {filteredItems.length}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 sm:right-8 text-white hover:bg-white/20 rounded-full"
            aria-label="Next image"
            onClick={() => setOpenIndex((openIndex + 1) % filteredItems.length)}
          >
            <ChevronRight className="size-8" />
          </Button>
        </div>
      ) : null}
    </>
  );
}
