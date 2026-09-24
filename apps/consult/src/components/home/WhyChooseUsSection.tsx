import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Users, ShieldCheck, FileKey, GraduationCap, Plane, Globe, Award, Sparkles } from "lucide-react";

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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-orange/5 blur-3xl -z-10"></div>
            
            {/* Visual Graphic Representation */}
            <div className="relative w-full max-w-md mx-auto aspect-square">
              {/* Central Element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white shadow-2xl shadow-brand-blue/10 border border-slate-100 flex items-center justify-center z-20 overflow-hidden">
                <Image src="/logo.jpg" width={120} height={120} alt="Dellics Consult" className="rounded-xl object-contain" />
              </div>
              
              {/* Orbit Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-slate-200 z-10"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-slate-100 border-dashed animate-[spin_30s_linear_infinite_reverse] z-10"></div>
              
              {/* Floating Perks */}
              <div className="absolute top-[10%] left-[20%] bg-white p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 animate-[bounce_4s_infinite] z-30">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-brand-blue" />
                </div>
                <div className="pr-2">
                  <div className="text-xs font-bold text-slate-900">Global</div>
                  <div className="text-[10px] text-slate-500">Reach</div>
                </div>
              </div>

              <div className="absolute bottom-[20%] left-[10%] bg-white p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 animate-[bounce_5s_infinite_0.5s] z-30">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-brand-orange" />
                </div>
                <div className="pr-2">
                  <div className="text-xs font-bold text-slate-900">Seamless</div>
                  <div className="text-[10px] text-slate-500">Travel</div>
                </div>
              </div>

              <div className="absolute top-[30%] right-[5%] bg-white p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 animate-[bounce_6s_infinite_1s] z-30">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div className="pr-2">
                  <div className="text-xs font-bold text-slate-900">Expert</div>
                  <div className="text-[10px] text-slate-500">Guidance</div>
                </div>
              </div>
              
              <div className="absolute bottom-[10%] right-[20%] bg-slate-900 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-[pulse_3s_infinite_1s] z-30">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div className="pr-2">
                  <div className="text-xs font-bold text-white">Full</div>
                  <div className="text-[10px] text-slate-400">Integration</div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-block py-1.5 px-4 rounded-full bg-brand-blue/5 text-brand-blue text-xs font-bold uppercase tracking-widest mb-4">Why Choose Dellics</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Guiding Students from <span className="text-brand-orange">Application to Arrival</span></h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">At Dellics Education Consult, we combine deep expertise in international education with genuine care for every student. We are not just consultants &mdash; we are your end-to-end partners with a dedicated digital platform to keep you informed at every milestone.</p>
            
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
              <Link href="/contact" className="px-8 py-4 rounded-full bg-white text-brand-blue font-bold border-2 border-slate-200 hover:border-brand-blue/30 transition-all hover:bg-slate-50">Book Free Consultation</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
