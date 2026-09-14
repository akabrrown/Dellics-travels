"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Eye } from "lucide-react";
import { ACCREDITATION_BADGES, AccreditationsModal } from "./accreditations-modal";

export function AccreditationStrip() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        aria-label="Accreditations and partners"
        className="border-y border-slate-200/80 bg-slate-50/60 py-10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck className="size-4 text-brand-orange" />
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">
                Official Accreditations &amp; Global Travel Partners
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-brand-orange hover:text-brand-orange hover:bg-orange-50/30 transition-all"
            >
              <Eye className="size-3.5" />
              <span>View Partner Credentials</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
            {ACCREDITATION_BADGES.map((badge) => (
              <button
                key={badge.src}
                type="button"
                onClick={() => setModalOpen(true)}
                title={`${badge.name} - Click to view details`}
                className="group flex h-14 items-center justify-center rounded-xl bg-white px-4 py-2 shadow-xs border border-slate-200/60 transition-all duration-200 hover:shadow-md hover:border-brand-orange/40 hover:-translate-y-0.5 cursor-pointer text-left"
              >
                <Image
                  src={badge.src}
                  alt={badge.alt}
                  width={120}
                  height={48}
                  className="h-8 w-auto object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <AccreditationsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
