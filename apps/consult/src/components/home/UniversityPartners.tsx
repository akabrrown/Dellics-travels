"use client";

import Image from "next/image";

const universities = [
  { name: "University of Oxford", country: "United Kingdom", logo: "oxford.svg", ranking: "Top 1 UK" },
  { name: "University of Cambridge", country: "United Kingdom", logo: "cambridge.svg", ranking: "Top 2 UK" },
  { name: "Harvard University", country: "United States", logo: "harvard.svg", ranking: "Ivy League" },
  { name: "University of Toronto", country: "Canada", logo: "toronto.svg", ranking: "#1 in Canada" },
  { name: "Imperial College London", country: "United Kingdom", logo: "imperial.svg", ranking: "Global Top 10" },
  { name: "University of Manchester", country: "United Kingdom", logo: "manchester.svg", ranking: "Russell Group" },
  { name: "University of Sydney", country: "Australia", logo: "sydney.svg", ranking: "Go8 Australia" },
  { name: "University of Melbourne", country: "Australia", logo: "melbourne.svg", ranking: "Top 1 Australia" },
  { name: "New York University", country: "United States", logo: "nyu.svg", ranking: "Global Top 25" },
  { name: "University of Ghana", country: "Ghana", logo: "ug.svg", ranking: "Premier University" },
  { name: "KNUST", country: "Ghana", logo: "knust.svg", ranking: "Top Tech University" },
  { name: "Ashesi University", country: "Ghana", logo: "ashesi.svg", ranking: "Leadership & Ethics" },
];

export function UniversityPartners() {
  return (
    <section className="py-14 bg-slate-50 border-y border-slate-200 overflow-hidden">
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 py-2 group-hover:[animation-play-state:paused]">
          {[...universities, ...universities].map((uni, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl shadow-sm border border-slate-200/80 min-w-[280px] transition-all hover:-translate-y-1 hover:shadow-md hover:border-brand-orange/40 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 border border-slate-100 p-2 relative overflow-hidden shadow-inner">
                <Image 
                  src={`/universities/${uni.logo}`} 
                  alt={`${uni.name} official logo`} 
                  width={44} 
                  height={44} 
                  className="object-contain w-full h-full"
                  unoptimized 
                />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-slate-900 text-sm truncate">{uni.name}</div>
                <div className="text-xs text-brand-blue font-medium mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0"></span>
                  <span className="truncate">{uni.country}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono ml-auto">{uni.ranking}</span>
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
          animation: marquee 28s linear infinite;
        }
      `}</style>
    </section>
  );
}
