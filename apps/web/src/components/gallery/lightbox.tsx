"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GalleryItem } from "@/data/gallery";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    lastTriggerRef.current?.focus();
  }, []);

  const openItem = openIndex === null ? undefined : items[openIndex];

  useEffect(() => {
    if (openIndex === null) return;
    closeButtonRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight")
        setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (event.key === "ArrowLeft")
        setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, items.length, close]);

  return (
    <>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={(event) => {
              lastTriggerRef.current = event.currentTarget;
              setOpenIndex(index);
            }}
            className="group relative h-56 overflow-hidden rounded-card focus-visible:outline-2 focus-visible:outline-brand-orange"
            aria-label={`Open image: ${item.alt}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && openItem ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openItem.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-white"
            onClick={close}
            aria-label="Close"
          >
            <X />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 text-white"
            aria-label="Previous image"
            onClick={() => setOpenIndex((openIndex - 1 + items.length) % items.length)}
          >
            <ChevronLeft />
          </Button>
          <div className="relative h-[75vh] w-full max-w-4xl">
            <Image src={openItem.src} alt={openItem.alt} fill className="object-contain" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 text-white"
            aria-label="Next image"
            onClick={() => setOpenIndex((openIndex + 1) % items.length)}
          >
            <ChevronRight />
          </Button>
        </div>
      ) : null}
    </>
  );
}
