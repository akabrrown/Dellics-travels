"use client";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      <div className="relative w-32 h-32 animate-pulse">
        <Image src="/logo.jpg" alt="Dellics Consult Loading" fill className="object-contain" />
      </div>
      <div className="mt-6 w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="w-full h-full bg-brand-orange animate-[loading_1.5s_ease-in-out_infinite_alternate]"></div>
      </div>
    </div>
  );
}