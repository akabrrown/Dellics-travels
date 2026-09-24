"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, X, ExternalLink, Award, CheckCircle2 } from "lucide-react";

export interface AccreditationBadge {
  src: string;
  alt: string;
  name: string;
  category: string;
  description: string;
  highlight?: string;
}

export const ACCREDITATION_BADGES: AccreditationBadge[] = [
  {
    src: "/badges/gta.png",
    alt: "Ghana Tourism Authority (GTA)",
    name: "Ghana Tourism Authority (GTA)",
    category: "National Tourism Regulator",
    description: "Official statutory licensing and regulation under the Ministry of Tourism, Arts and Culture of Ghana, guaranteeing fully vetted travel operations.",
    highlight: "Licensed & Regulated Operator",
  },
  {
    src: "/badges/iata.png",
    alt: "IATA Accredited Agency",
    name: "IATA Accredited",
    category: "Global Aviation Certification",
    description: "International Air Transport Association certification enabling direct electronic ticket issuance across all major global airlines without brokers.",
    highlight: "Direct Global Airline Ticketing",
  },
  {
    src: "/badges/tougha.jpg",
    alt: "Tour Operators Union of Ghana (TOUGHA)",
    name: "TOUGHA Ghana",
    category: "Tourism Trade Union",
    description: "Tour Operators Union of Ghana active member upholding strict professional codes of conduct, ethical travel standards, and tour safety protocols.",
    highlight: "Verified Tour Quality",
  },
  {
    src: "/badges/amadeus.png",
    alt: "Amadeus Global Travel Partner",
    name: "Amadeus IT Group",
    category: "Global Distribution System (GDS)",
    description: "Real-time airline inventory, live schedule tracking, instant PNR issuance, and automated fare calculations across 500+ global carriers.",
    highlight: "Real-Time Seat Inventory",
  },
  
  {
    src: "/badges/travel-port.png",
    alt: "Travelport Partner",
    name: "Travelport GDS",
    category: "GDS Travel Distribution",
    description: "Leading distribution system powering direct multi-leg flight ticketing, regional African routes, baggage add-ons, and hotel reservations.",
    highlight: "Regional & Global Distribution",
  },
  {
    src: "/badges/airalo.jpg",
    alt: "Airalo eSIM Partner",
    name: "Airalo eSIM",
    category: "Digital Mobile Connectivity",
    description: "Global digital eSIM provider ensuring Dellics travelers enjoy affordable, high-speed mobile internet immediately upon landing in 200+ countries.",
    highlight: "200+ Countries eSIM Coverage",
  },
  {
    src: "/badges/viator-travel-agents.png",
    alt: "Viator Travel Agent Partner",
    name: "Viator Experiences",
    category: "Excursions & Activities",
    description: "Curated destination excursions, fast-track museum tickets, and private guided tours in over 2,500 cities worldwide.",
    highlight: "Pre-screened Tour Guides",
  },
  {
    src: "/badges/we-travel.png",
    alt: "WeTravel Booking Partner",
    name: "WeTravel",
    category: "Group & Retreat Logistics",
    description: "Specialized group retreat logistics and flexible split payment management platform for family delegations and corporate retreats.",
    highlight: "Flexible Group Management",
  },
  {
    src: "/badges/pay-stack.png",
    alt: "Secured by Paystack",
    name: "Paystack Payments",
    category: "PCI-DSS Level 1 Gateway",
    description: "End-to-end 256-bit encrypted checkout supporting Ghana Mobile Money (MTN MoMo, Telecel Cash), Visa, Mastercard, and international cards.",
    highlight: "Bank-Grade Encryption",
  },
];

export function AccreditationsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accreditations-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-navy-dark/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-navy-dark px-6 py-8 sm:px-10 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/20 via-transparent to-transparent pointer-events-none" />
          
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-6 right-6 flex size-10 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>

          <div className="flex items-center gap-3 text-brand-orange text-xs sm:text-sm font-bold uppercase tracking-wider">
            <ShieldCheck className="size-5 text-brand-orange" />
            <span>Verified Credentials &amp; Industry Trust</span>
          </div>

          <h2
            id="accreditations-modal-title"
            className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white"
          >
            Official Accreditations &amp; Global Travel Partners
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-white/75 leading-relaxed">
            Dellics Travels is licensed by the Ghana Tourism Authority (GTA), certified by IATA, and directly integrated with the world&apos;s leading aviation, hospitality, and payment networks.
          </p>
        </div>

        {/* Modal Body: Logos Grid */}
        <div className="max-h-[60vh] overflow-y-auto p-6 sm:p-8 bg-slate-50/50">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {ACCREDITATION_BADGES.map((badge) => (
              <div
                key={badge.name}
                className="group flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-200/70 shadow-sm transition-all duration-200 hover:border-brand-orange/40 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="relative flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-2 border border-slate-100 group-hover:border-brand-orange/20 transition-colors">
                    <Image
                      src={badge.src}
                      alt={badge.alt}
                      width={100}
                      height={48}
                      className="max-h-12 max-w-full object-contain h-auto w-auto"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-block rounded-md bg-navy/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy">
                      {badge.category}
                    </span>
                    <h3 className="mt-1 font-display text-base font-bold text-navy truncate">
                      {badge.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {badge.highlight && (
                  <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-2 text-[11px] font-medium text-emerald-700">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                    <span>{badge.highlight}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 bg-white px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Award className="size-4 text-brand-orange" />
            <span>10 Verified Institutional Partners &amp; Accreditations</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <Link
              href="/credentials"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2 text-xs font-bold text-white hover:bg-navy-light transition-colors"
            >
              <span>View Full Credentials Page</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
