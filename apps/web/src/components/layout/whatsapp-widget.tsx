"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { SITE } from "@/lib/site";

export function WhatsappWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setShowTooltip(true), 1000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end group">
      {/* Tooltip */}
      <div
        className={`mb-3 bg-white px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-start gap-3 max-w-[240px] transition-all duration-500 origin-bottom-right ${
          showTooltip
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="size-8 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
          <span className="relative flex size-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2.5 bg-[#25D366]"></span>
          </span>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 mb-0.5">Need help?</p>
          <p className="text-[11px] text-slate-500 leading-tight">
            24/7 Support and Chat with a Travel Consultant.
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowTooltip(false);
          }}
          className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 -mt-1 -mr-1"
        >
          <X className="size-3" />
        </button>
      </div>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${SITE.whatsappNumber?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
          "Hello Dellics Travels, I need assistance with a booking or inquiry."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center size-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300 group"
      >
        <MessageCircle className="size-7" />
        {/* Outer pulse effect */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping group-hover:hidden" style={{ animationDuration: '3s' }} />
      </a>
    </div>
  );
}
