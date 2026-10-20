import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Users, ShieldCheck, FileKey, GraduationCap, Plane, Globe, Award } from "lucide-react";

export function WhyChooseUsSection() {
  const feats = [
    { title: "Dedicated Consultants", desc: "Direct access to your assigned education advisor with transparent milestone updates.", icon: Users },
    { title: "Personalized Matching", desc: "Every student is unique. We match you to universities that fit your exact grades, budget, and career goals.", icon: CheckCircle },
    { title: "Visa Compliance", desc: "We rigorously review funds, holding periods, and documentation to protect your application.", icon: ShieldCheck },
    { title: "Secure Document Locker", desc: "Upload your academic transcripts, WAEC slips, and passport once into a secure student portal.", icon: FileKey },
    { title: "Test Prep Coordination", desc: "We arrange diagnostic preparation and official test bookings with accredited partner centers.", icon: GraduationCap },
    { title: "Dellics Travels Integration", desc: "Enjoy discounted student flights, verified student accommodation, airport transfers, and eSIMs.", icon: Plane },
  ];

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            {/* Institutional Trust & Agency Card */}
            <div className="relative mx-auto w-full max-w-lg">
              <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
                {/* Ambient Subtle Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none"></div>
                
                {/* Card Top: Agency Brand Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
                      <Image src="/logo.jpg" width={40} height={40} alt="Dellics Consult" className="rounded-lg object-contain" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-base leading-tight">Dellics Education Consult</div>
                      <div className="text-xs text-slate-400">Accredited International Advisory</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                    Verified Agency
                  </span>
                </div>

                {/* 3 Key Institutional Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/50 text-center">
                    <div className="text-2xl font-display font-bold text-brand-orange">97.4%</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">Visa Success</div>
                  </div>
                  <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/50 text-center">
                    <div className="text-2xl font-display font-bold text-white">150+</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">Partner Unis</div>
                  </div>
                  <div className="bg-slate-800/60 rounded-2xl p-3.5 border border-slate-700/50 text-center">
                    <div className="text-2xl font-display font-bold text-white">100%</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">Continuity</div>
                  </div>
                </div>

                {/* Verified Operational Pillars */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange/20 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-brand-orange" />
                    </div>
                    <div className="text-xs text-slate-200">
                      <span className="font-semibold text-white">Consular Pre-Screening:</span> Stringent review of financial holding periods and documentation.
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-xs text-slate-200">
                      <span className="font-semibold text-white">Four Study Hubs:</span> Direct placements across the UK, Canada, USA, and Australia.
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                      <Plane className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-xs text-slate-200">
                      <span className="font-semibold text-white">Dellics Travels Parentage:</span> Student airfares, extra baggage allowances, and relocation support.
                    </div>
                  </div>
                </div>

                {/* Footer Portal Callout */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Student Portal Real-Time Tracking</span>
                  <Link href="/portal" className="text-brand-orange hover:text-white transition-colors font-medium">
                    Preview System &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-block py-1.5 px-4 rounded-full bg-navy/5 text-navy text-xs font-bold uppercase tracking-widest mb-4">Why Choose Dellics</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Guiding Students from <span className="text-brand-orange">Application to Arrival</span></h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">At Dellics Education Consult, we combine deep expertise in international education with genuine care for every student. We are not just consultants - we are your end-to-end partners with a dedicated digital platform to keep you informed at every milestone.</p>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {feats.map((feat, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0">
                    <feat.icon className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{feat.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className="px-8 py-4 rounded-full bg-brand-orange text-white font-bold hover:bg-brand-orange-light transition-all shadow-lg shadow-brand-orange/20 hover:-translate-y-1">Start Your Application</Link>
              <Link href="/contact" className="px-8 py-4 rounded-full bg-white text-navy font-bold border-2 border-slate-200 hover:border-navy/30 transition-all hover:bg-slate-50">Book Free Consultation</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
