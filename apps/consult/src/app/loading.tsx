"use client";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      <div className="relative flex flex-col items-center">
        <div className="relative w-28 h-28 p-2 rounded-2xl bg-white border border-slate-100 shadow-xl flex items-center justify-center animate-pulse">
          <Image 
            src="/logo.jpg" 
            alt="Dellics Education Consult" 
            width={96} 
            height={96} 
            className="object-contain" 
            priority
            unoptimized 
          />
        </div>
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-full h-full bg-brand-orange rounded-full animate-[loading_1.5s_ease-in-out_infinite_alternate]"></div>
          </div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
            Loading Dellics Consult...
          </span>
        </div>
      </div>
    </div>
  );
}
