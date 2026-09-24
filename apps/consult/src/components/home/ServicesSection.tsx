import Link from "next/link";
import { GraduationCap, Briefcase, Award, PlaneTakeoff, MonitorPlay, FileText } from "lucide-react";

export function ServicesSection() {
  const services = [
    { title: "University Admissions", desc: "Expert guidance on choosing the right university and program. We review your profile, shortlist institutions, and manage your complete application dossier.", icon: GraduationCap, link: "/signup", cta: "Start Application" },
    { title: "Visa Guidance & Compliance", desc: "Navigate complex visa requirements with confidence. Our visa specialists conduct rigorous financial audits and embassy interview coaching.", icon: Briefcase, link: "/contact", cta: "Get Visa Guidance", featured: true },
    { title: "Scholarship Guidance", desc: "Discover and secure scholarships worth thousands of dollars. We identify opportunities you qualify for and craft compelling applications.", icon: Award, link: "/contact", cta: "Explore Grants" },
    { title: "Dellics Travels Integration", desc: "Powered by Dellics Travels, we arrange student discounted airfares, verified accommodation, airport transfers, and eSIM cards.", icon: PlaneTakeoff, link: "/portal", cta: "View Travel Perks" },
    { title: "Online Counselling", desc: "Connect with our qualified counsellors via video call from anywhere in Ghana or Africa for personalized guidance at your convenience.", icon: MonitorPlay, link: "/contact", cta: "Book Session" },
    { title: "Tests & Exam Coordination", desc: "We act as your coordination service with accredited institutions and British Council/ETS partners for comprehensive test prep.", icon: FileText, link: "/portal", cta: "Coordinate Exam" },
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4">What We Offer</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Comprehensive <span className="text-brand-orange">Services</span></h2>
          <p className="text-slate-600 text-lg">End-to-end support for every stage of your international education journey</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, idx) => (
            <div key={idx} className={`relative p-8 rounded-3xl border transition-all ${svc.featured ? 'bg-navy border-navy text-white shadow-lg hover:-translate-y-1' : 'bg-white border-slate-200 text-slate-900 hover:shadow-md hover:shadow-brand-blue/5 hover:-translate-y-1 group'}`}>
              {svc.featured && <div className="absolute -top-4 right-8 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">High Demand</div>}
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${svc.featured ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-brand-blue/5 transition-colors'}`}>
                <svc.icon className={`w-7 h-7 ${svc.featured ? 'text-brand-orange' : 'text-navy'}`} />
              </div>
              
              <h3 className="text-xl font-bold mb-3">{svc.title}</h3>
              <p className={`mb-8 leading-relaxed text-sm ${svc.featured ? 'text-slate-300' : 'text-slate-600'}`}>{svc.desc}</p>
              
              <Link href={svc.link} className={`inline-flex items-center gap-2 font-bold text-sm transition-colors ${svc.featured ? 'text-brand-orange hover:text-white' : 'text-navy group-hover:text-brand-orange'}`}>
                {svc.cta} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
