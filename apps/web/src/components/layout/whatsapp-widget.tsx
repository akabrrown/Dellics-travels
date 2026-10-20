"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { SITE } from "@/lib/site";

export function WhatsappWidget() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
          }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end group">
      {/* WhatsApp Button */}
      <a
        aria-label="Contact us on WhatsApp"
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
