import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Users, ShieldCheck, FileKey, GraduationCap, Plane } from "lucide-react";

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
            <div className="relative">
              <div className="w-48 h-48 rounded-full bg-white shadow-2xl border border-slate-100 flex items-center justify-center mx-auto relative z-20">
                <Image src="/logo.jpg" width={120} height={120} alt="Dellics Logo" className="rounded-xl" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 border-brand-orange/20 animate-[spin_10s_linear_infinite] z-10"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-brand-blue/10 animate-[spin_15s_linear_infinite_reverse] z-10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-16 relative z-20">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                <div className="text-3xl font-display font-black text-brand-orange mb-1">500+</div>
                <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">Students Placed</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center">
                <div className="text-3xl font-display font-black text-brand-orange mb-1">100%</div>
                <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">Tracking</div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-block py-1.5 px-4 rounded-full bg-brand-blue/5 text-brand-blue text-xs font-bold uppercase tracking-widest mb-4">Why Choose Dellics</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Guiding Students from <span className="text-brand-orange">Application to Arrival</span></h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">At Dellics Education Consult, we combine deep expertise in international education with genuine care for every student. We are not just consultants — we are your end-to-end partners with a dedicated digital platform to keep you informed at every milestone.</p>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {feats.map((feat, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <feat.icon className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{feat.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className="px-8 py-3 rounded-full bg-brand-orange text-white font-bold hover:bg-brand-orange-light transition-colors">Start Your Application</Link>
              <Link href="/contact" className="px-8 py-3 rounded-full bg-white text-brand-blue font-bold border-2 border-slate-200 hover:border-brand-blue/30 transition-colors">Book Free Consultation</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}