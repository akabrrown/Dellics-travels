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
          <span className="inline-block py-1.5 px-4 rounded-full bg-brand-blue/5 text-brand-blue text-xs font-bold uppercase tracking-widest mb-4">Transparent Roadmap</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Our <span className="text-brand-orange">7-Step</span> Journey</h2>
          <p className="text-slate-600 text-lg">Consult → Assess → Select → Apply → Offer → Visa → Travel</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:shadow-brand-blue/5 hover:-translate-y-1 transition-all group">
              <div className="text-5xl font-display font-black text-slate-100 group-hover:text-brand-orange/10 transition-colors mb-4">{step.num}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}