"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  CreditCard,
  Sparkles,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TourPackage } from "@/lib/tours";
import { TourBookingModal } from "./tour-booking-modal";

interface TourListProps {
  tours: TourPackage[];
}

export function TourList({ tours }: TourListProps) {
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleBookWithPaystack = (tour: TourPackage) => {
    setSelectedTour(tour);
    setModalOpen(true);
  };

  return (
    <>
      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {tours.map((tour) => (
          <article
            key={tour.id || tour.name}
            className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={tour.image}
                alt={tour.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-navy/80 via-navy/20 to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-navy/90 backdrop-blur-xs px-3 py-1 text-xs font-bold text-white shadow-xs">
                  {tour.badge}
                </span>
                {tour.isDellicsSignature && (
                  <span className="rounded-full bg-brand-orange px-3 py-1 text-xs font-bold text-white shadow-xs flex items-center gap-1">
                    <CreditCard className="size-3" />
                    Paystack Direct
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-1.5 text-xs text-white/80 mb-1">
                  <MapPin className="size-3.5 text-brand-orange" />
                  <span>{tour.destination}</span>
                  <span className="mx-1.5">•</span>
                  <Clock className="size-3.5 text-brand-orange" />
                  <span>{tour.duration}</span>
                </div>
                <h3 className="font-display text-xl font-bold leading-snug">{tour.name}</h3>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
              <div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{tour.copy}</p>

                <div className="mb-6 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <span className="block text-xs font-bold text-navy uppercase tracking-wider mb-2.5">
                    Package Inclusions
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {tour.includes.slice(0, 4).map((inc) => (
                      <li key={inc} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div>
                  <span className="block text-[11px] text-slate-500 uppercase tracking-wider">
                    Starting From
                  </span>
                  <span className="font-display text-2xl font-extrabold text-brand-orange">
                    {tour.price}
                  </span>
                  <span className="text-xs text-slate-500 font-normal"> / person</span>
                </div>

                <div className="flex items-center gap-2">
                  {tour.isDellicsSignature ? (
                    <>
                      <Button
                        type="button"
                        onClick={() => handleBookWithPaystack(tour)}
                        className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-5 py-2.5 text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                      >
                        <CreditCard className="size-3.5" />
                        <span>Book with Paystack</span>
                        <ArrowRight className="size-3.5 ml-0.5" />
                      </Button>

                      <a
                        href={tour.viatorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-navy px-2 py-1.5 transition-colors"
                        title="View reviews and international dates on Viator partner"
                      >
                        <span>Viator</span>
                        <ExternalLink className="size-3" />
                      </a>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/inquire?service=tours&tour=${encodeURIComponent(tour.name)}&destination=${encodeURIComponent(tour.destination)}&price=${encodeURIComponent(tour.price)}`}
                        className="text-xs font-semibold text-slate-500 hover:text-navy px-3 py-2"
                      >
                        Inquire
                      </Link>

                      <a
                        href={tour.viatorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-5 py-2.5 text-xs shadow-md transition-all active:scale-95"
                      >
                        <span>Book on Viator</span>
                        <ExternalLink className="size-3.5" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <TourBookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tour={selectedTour}
      />
    </>
  );
}
