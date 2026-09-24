export function HowItWorksSection() {
  const steps = [
    { num: "01", title: "Consult", desc: "Initial discovery session with our senior counsellors to evaluate your educational aspirations, academic background, and budget." },
    { num: "02", title: "Assess", desc: "Full assessment of WASSCE / Degree transcripts and standardized test requirements (IELTS, TOEFL, SAT, GRE)." },
    { num: "03", title: "Select", desc: "Data-backed university shortlisting matching your budget, preferred intake, and long-term career goals." },
    { num: "04", title: "Apply", desc: "Dossier compilation, statement of purpose polishing, recommendation verification, and formal application submission." },
    { num: "05", title: "Offer", desc: "Securing conditional and unconditional offer letters, university scholarship negotiations, and deposit guidance." },
    { num: "06", title: "Visa", desc: "Meticulous financial document audit, CAS/I-20 procurement, and intensive embassy interview coaching." },
    { num: "07", title: "Travel", desc: "Seamless transition powered by Dellics Travels: student airfare discounts, pre-booked dorms, airport pickups, and eSIMs." }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-navy/5 text-navy text-xs font-bold uppercase tracking-widest mb-4">Transparent Roadmap</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Our <span className="text-brand-orange">7-Step</span> Journey</h2>
          <p className="text-slate-600 text-lg">Consult → Assess → Select → Apply → Offer → Visa → Travel</p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical dotted line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-slate-200 -translate-x-1/2"></div>
          
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`relative flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Content Box */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:shadow-brand-blue/5 hover:-translate-y-1 transition-all group relative">
                      <div className="text-4xl md:text-5xl font-display font-black text-slate-100 group-hover:text-brand-orange/10 transition-colors mb-3">{step.num}</div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-brand-orange items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                  </div>

                  {/* Empty Spacer for layout */}
                  <div className="hidden md:block w-1/2"></div>
                  
                  {/* Mobile dotted connector */}
                  {idx < steps.length - 1 && (
                    <div className="md:hidden h-8 border-l-2 border-dashed border-slate-200 mx-auto"></div>
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
