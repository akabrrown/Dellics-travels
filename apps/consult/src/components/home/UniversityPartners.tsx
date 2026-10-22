"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

const universities = [
  { 
    name: "University of Oxford", 
    location: "Oxford, United Kingdom", 
    file: "university of oxford.png" 
  },
  { 
    name: "Harvard University", 
    location: "Cambridge, Massachusetts, USA", 
    file: "Harvard university.jpg" 
  },
  { 
    name: "University of Toronto", 
    location: "Toronto, Ontario, Canada", 
    file: "univerity of toronto.png" 
  },
  { 
    name: "Imperial College London", 
    location: "London, United Kingdom", 
    file: "imperial college london.png" 
  },
  { 
    name: "University of Manchester", 
    location: "Manchester, United Kingdom", 
    file: "university of manchester.jpg" 
  },
  { 
    name: "University of Sydney", 
    location: "Sydney, Australia", 
    file: "university sydney.png" 
  },
  { 
    name: "University of Melbourne", 
    location: "Melbourne, Australia", 
    file: "university of melbourne.jpg" 
  },
  { 
    name: "New York University", 
    location: "New York City, USA", 
    file: "New york university.png" 
  },
  { 
    name: "University of Ghana", 
    location: "Legon, Accra, Ghana", 
    file: "university of ghana.png" 
  },
  { 
    name: "KNUST", 
    location: "Kumasi, Ghana", 
    file: "knust.jpg" 
  },
  { 
    name: "Ashesi University", 
    location: "Berekuso, Ghana", 
    file: "ashesi univeristy.png" 
  },
];

export function UniversityPartners() {
  return (
    <section className="py-10 bg-slate-50 border-y border-slate-200 overflow-hidden">
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-6 py-2 group-hover:[animation-play-state:paused]">
          {[...universities, ...universities].map((uni, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-4 px-5 py-3.5 bg-white rounded-2xl shadow-sm border border-slate-200/90 min-w-[280px] sm:min-w-[300px] transition-all hover:-translate-y-1 hover:shadow-md hover:border-brand-orange/40 cursor-default"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-white border border-slate-200/80 p-1.5 shadow-sm overflow-hidden">
                <Image 
                  src={`/universities/${encodeURIComponent(uni.file)}`} 
                  alt={`${uni.name} official logo`} 
                  width={56} 
                  height={56} 
                  className="object-contain w-full h-full max-h-12"
                  unoptimized 
                />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-slate-900 text-sm truncate">{uni.name}</div>
                <div className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                  <span className="truncate">{uni.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </section>
  );
}

