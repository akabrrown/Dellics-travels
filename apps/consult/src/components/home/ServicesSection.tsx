import Link from "next/link";
import { GraduationCap, Briefcase, Award, PlaneTakeoff, MonitorPlay, FileText } from "lucide-react";

export function ServicesSection() {
  const services = [
    { 
      id: "admissions",
      title: "University Admissions", 
      desc: "Expert guidance on choosing the right university and program. We review your profile, shortlist institutions, and manage your complete application dossier.", 
      icon: GraduationCap, 
      subpage: "/services/admissions",
      link: "/signup", 
      cta: "Start Application",
      external: false
    },
    { 
      id: "visa",
      title: "Visa Guidance & Compliance", 
      desc: "Navigate complex visa requirements with confidence. Our visa specialists conduct rigorous financial audits and embassy interview coaching.", 
      icon: Briefcase, 
      subpage: "/services/visa",
      link: "/contact?service=visa", 
      cta: "Get Visa Guidance", 
      featured: true,
      external: false
    },
    { 
      id: "scholarship",
      title: "Scholarship Guidance", 
      desc: "Discover and secure scholarships worth thousands of dollars. We identify opportunities you qualify for and craft compelling applications.", 
      icon: Award, 
      subpage: "/services/scholarship",
      link: "/contact?service=scholarship", 
      cta: "Explore Grants",
      external: false
    },
    { 
      id: "travel",
      title: "Dellics Travels Integration", 
      desc: "Powered by Dellics Travels, we arrange student discounted airfares, verified accommodation, airport transfers, and eSIM cards.", 
      icon: PlaneTakeoff, 
      subpage: "/services/travel",
      link: "https://dellicstravels.com", 
      cta: "View Travel Perks",
      external: true
    },
    { 
      id: "online",
      title: "Online Counselling", 
      desc: "Connect with our qualified counsellors via video call from anywhere in Ghana or Africa for personalized guidance at your convenience.", 
      icon: MonitorPlay, 
      subpage: "/services/online",
      link: "/contact?service=counselling", 
      cta: "Book Session",
      external: false
    },
    { 
      id: "test",
      title: "Tests & Exam Coordination", 
      desc: "We act as your coordination service with accredited institutions and British Council/ETS partners for comprehensive IELTS, TOEFL, SAT, and GRE prep.", 
      icon: FileText, 
      subpage: "/services/test",
      link: "/services/test", 
      cta: "Coordinate Exam",
      external: false
    },
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4">
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
            Comprehensive <span className="text-brand-orange">Services</span>
          </h2>
          <p className="text-slate-600 text-lg">
            End-to-end support for every stage of your international education journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc, idx) => (
            <div 
              key={idx} 
              id={svc.id}
              className={`relative p-8 rounded-3xl border transition-all flex flex-col justify-between scroll-mt-28 ${
                svc.featured 
                  ? 'bg-navy border-navy text-white shadow-xl hover:-translate-y-1' 
                  : 'bg-white border-slate-200 text-slate-900 hover:shadow-lg hover:border-brand-orange/30 hover:-translate-y-1 group'
              }`}
            >
              {svc.featured && (
                <div className="absolute -top-3.5 right-8 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  High Demand
                </div>
              )}
              
              <div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  svc.featured ? 'bg-white/10' : 'bg-slate-50 group-hover:bg-brand-orange/10 transition-colors'
                }`}>
                  <svc.icon className={`w-7 h-7 ${svc.featured ? 'text-brand-orange' : 'text-navy group-hover:text-brand-orange transition-colors'}`} />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{svc.title}</h3>
                <p className={`mb-6 leading-relaxed text-sm ${svc.featured ? 'text-slate-300' : 'text-slate-600'}`}>
                  {svc.desc}
                </p>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={svc.subpage}
                  className={`text-xs font-bold transition-colors ${
                    svc.featured ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-navy'
                  }`}
                >
                  View Details &rarr;
                </Link>

                {svc.external ? (
                  <a 
                    href={svc.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 font-bold text-xs px-3.5 py-2 rounded-xl transition-all ${
                      svc.featured 
                        ? 'bg-brand-orange text-white hover:bg-brand-orange-hover shadow-md' 
                        : 'bg-navy text-white hover:bg-brand-orange shadow-sm'
                    }`}
                  >
                    {svc.cta}
                  </a>
                ) : (
                  <Link 
                    href={svc.link} 
                    className={`inline-flex items-center gap-1.5 font-bold text-xs px-3.5 py-2 rounded-xl transition-all ${
                      svc.featured 
                        ? 'bg-brand-orange text-white hover:bg-brand-orange-hover shadow-md' 
                        : 'bg-navy text-white hover:bg-brand-orange shadow-sm'
                    }`}
                  >
                    {svc.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
