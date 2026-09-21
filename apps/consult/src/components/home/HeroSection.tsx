import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-brand-orange/5 blur-3xl" />
        <div className="absolute top-40 -left-40 w-[600px] h-[600px] rounded-full bg-brand-blue/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-sm font-semibold border border-brand-orange/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
            </span>
            Guiding students from application to arrival
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-tight">
            Transform Your Future Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-orange-light">Global Education</span>
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
            Expert guidance for Ghanaian & African students aspiring to study abroad. From university shortlisting and test coordination to visa approval and travel — manage your entire journey with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-orange hover:bg-brand-orange-light text-white font-bold transition-all shadow-lg shadow-brand-orange/25 hover:-translate-y-1">
              Start Your Application
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#how-it-works" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-brand-blue font-bold border-2 border-slate-200 hover:border-brand-blue/30 transition-all">
              Explore Our Process
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
            <div>
              <div className="text-3xl font-display font-bold text-brand-blue">500+</div>
              <div className="text-sm font-medium text-slate-500">Students Advised</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-brand-blue">20+</div>
              <div className="text-sm font-medium text-slate-500">Destinations</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-brand-blue">100%</div>
              <div className="text-sm font-medium text-slate-500">Transparency</div>
            </div>
          </div>
        </div>

        <div className="relative lg:h-[600px] hidden lg:block">
          {/* Main Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white rounded-[2rem] shadow-2xl shadow-brand-blue/10 border border-slate-100 flex items-center justify-center z-20">
            <Image src="/logo.jpg" width={180} height={180} alt="Dellics Logo" className="rounded-2xl shadow-sm" />
          </div>

          {/* Floating Cards */}
          <div className="absolute top-20 right-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-[bounce_4s_infinite] z-30">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">🎉</div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Visa Approved</div>
              <div className="text-xs text-slate-500">UK Student Visa</div>
            </div>
          </div>

          <div className="absolute bottom-32 left-0 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-[bounce_5s_infinite_0.5s] z-30">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl">🎓</div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Offer Letter</div>
              <div className="text-xs text-slate-500">University of Toronto</div>
            </div>
          </div>
          
          <div className="absolute bottom-20 right-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-[bounce_6s_infinite_1s] z-30">
            <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange text-xl">💰</div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Scholarship Found!</div>
              <div className="text-xs text-slate-500">£25,000 Award</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}