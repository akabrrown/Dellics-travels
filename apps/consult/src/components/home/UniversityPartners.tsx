"use client";

import Image from "next/image";

// Placeholder data for university logos
const universities = [
  { name: "University of Toronto", country: "Canada" },
  { name: "University of Ghana", country: "Ghana" },
  { name: "University of Manchester", country: "UK" },
  { name: "Ashesi University", country: "Ghana" },
  { name: "University of Sydney", country: "Australia" },
  { name: "New York University", country: "USA" },
  { name: "KNUST", country: "Ghana" },
  { name: "University of Edinburgh", country: "UK" },
];

export function UniversityPartners() {
  return (
    <section className="py-16 bg-slate-50 overflow-hidden border-y border-slate-200">
      <div className="container mx-auto px-6 mb-8 text-center">
        <h3 className="text-xl font-display font-bold text-slate-800">
          Partnering with <span className="text-brand-orange">Top Universities</span> Worldwide
        </h3>
        <p className="text-sm text-slate-500 mt-2">Connecting Ghanaian students to global excellence</p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 py-4 group-hover:[animation-play-state:paused]">
          {[...universities, ...universities, ...universities].map((uni, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-sm border border-slate-100 min-w-[250px] transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400 shrink-0">
                {uni.name.charAt(0)}
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
