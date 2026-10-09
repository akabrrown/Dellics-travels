"use client";

import Image from "next/image";

// Placeholder data for university logos
// Real university logos
const universities = [
  { name: "University of Toronto", country: "Canada", color: "bg-[#002A5C] text-white", domain: "utoronto.ca" },
  { name: "University of Ghana", country: "Ghana", color: "bg-[#0A2240] text-[#D4AF37]", domain: "ug.edu.gh" },
  { name: "University of Manchester", country: "UK", color: "bg-[#660099] text-white", domain: "manchester.ac.uk" },
  { name: "Ashesi University", country: "Ghana", color: "bg-[#800000] text-white", domain: "ashesi.edu.gh" },
  { name: "University of Sydney", country: "Australia", color: "bg-[#E03C31] text-white", domain: "sydney.edu.au" },
  { name: "New York University", country: "USA", color: "bg-[#57068C] text-white", domain: "nyu.edu" },
  { name: "KNUST", country: "Ghana", color: "bg-[#003366] text-[#FCD116]", domain: "knust.edu.gh" },
  { name: "University of Edinburgh", country: "UK", color: "bg-[#041E42] text-white", domain: "ed.ac.uk" },
  { name: "Harvard University", country: "USA", color: "bg-[#A51C30] text-white", domain: "harvard.edu" },
  { name: "Oxford University", country: "UK", color: "bg-[#002147] text-white", domain: "ox.ac.uk" },
];

export function UniversityPartners() {
  return (
    <section className="py-16 bg-slate-50 overflow-hidden border-y border-slate-200">


      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 py-4 group-hover:[animation-play-state:paused]">
          {[...universities, ...universities, ...universities].map((uni, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-sm border border-slate-100 min-w-[250px] transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-slate-50 border border-slate-100 overflow-hidden relative">
                <Image src={`https://logo.clearbit.com/${uni.domain}`} alt={uni.name} fill className="object-contain p-2" unoptimized />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-slate-900 text-sm truncate">{uni.name}</div>
                <div className="text-xs text-brand-blue font-medium mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
                  {uni.country}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Required CSS for animation (this would typically be in globals.css) */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  );
}

