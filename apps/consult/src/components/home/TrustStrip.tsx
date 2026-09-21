export function TrustStrip() {
  const logos = [
    "University of Oxford", "University of Toronto", "Harvard University", 
    "MIT", "ANU Australia", "University of Edinburgh", "UCL", "Stanford"
  ];

  return (
    <section className="bg-white border-y border-slate-200 py-10 overflow-hidden">
      <div className="container mx-auto px-6 mb-6 text-center">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Partnered with top universities worldwide</p>
      </div>
      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="flex gap-12 animate-[slide_30s_linear_infinite] px-6">
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <div key={i} className="text-xl font-display font-black text-slate-300 tracking-tight select-none">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}