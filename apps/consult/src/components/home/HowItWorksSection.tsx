export function HowItWorksSection() {
  const steps = [
    { phase: "Phase 1", title: "Advisory Session", badge: "Discovery", desc: "Initial consultation with our senior counsellors to evaluate your educational aspirations, academic background, and budget." },
    { phase: "Phase 2", title: "Credential Assessment", badge: "Audit", desc: "Full assessment of WASSCE or degree transcripts alongside standardized test requirements (IELTS, TOEFL, SAT, GRE)." },
    { phase: "Phase 3", title: "Institution Selection", badge: "Matching", desc: "Data-backed university shortlisting matching your budget, preferred intake, and long-term career goals." },
    { phase: "Phase 4", title: "Dossier Submission", badge: "Filing", desc: "Application compilation, statement of purpose polishing, recommendation verification, and formal institution submission." },
    { phase: "Phase 5", title: "Admission Securing", badge: "Offer", desc: "Securing conditional and unconditional offer letters, university scholarship negotiations, and deposit guidance." },
    { phase: "Phase 6", title: "Visa Processing", badge: "Compliance", desc: "Meticulous financial document audit, CAS or I-20 procurement, and intensive embassy interview coaching." },
    { phase: "Phase 7", title: "Departure & Arrival", badge: "Logistics", desc: "Coordinated transition powered by Dellics Travels: student airfare discounts, verified housing, airport pickups, and eSIMs." }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="inline-block py-1.5 px-4 rounded-full bg-brand-orange/15 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4 border border-brand-orange/30">
            Admissions Pipeline
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            Milestone-Driven <span className="text-brand-orange">Student Pathway</span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg">
            A milestone-driven pathway from your first consultation to touchdown at your chosen campus.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="hidden md:block absolute left-1/2 top-4 bottom-12 w-1 bg-gradient-to-b from-brand-orange via-brand-orange/70 to-brand-orange -translate-x-1/2 rounded-full shadow-sm"></div>
          
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`relative flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                    <div className="bg-white p-7 md:p-8 rounded-3xl border-2 border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-orange hover:-translate-y-1 transition-all group relative border-t-4 border-t-brand-orange">
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-brand-orange text-white text-xs font-bold tracking-wider shadow-sm font-mono">
                          {step.phase}
                        </span>
                        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider bg-brand-orange/10 px-2.5 py-1 rounded-md">
                          {step.badge}
                        </span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 group-hover:text-brand-orange transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>

                  {/* Center Node with Vibrant Glowing Orange Ring */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-brand-orange items-center justify-center z-10 shadow-[0_0_15px_rgba(244,116,13,0.45)]">
                    <div className="w-3.5 h-3.5 rounded-full bg-brand-orange animate-pulse"></div>
                  </div>

                  {/* Empty Spacer for layout */}
                  <div className="hidden md:block w-1/2"></div>
                  
                  {/* Mobile connector */}
                  {idx < steps.length - 1 && (
                    <div className="md:hidden h-8 w-1 bg-brand-orange mx-auto rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
