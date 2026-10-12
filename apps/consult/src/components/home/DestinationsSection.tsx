import Link from "next/link";

export function DestinationsSection() {
  const dests = [
    { id: "uk", code: "UK", name: "United Kingdom", desc: "Home to Oxford, Cambridge, Imperial College, and 100+ world-class universities. Post-study work visa available.", tags: ["Top Rankings", "Scholarships", "Work Rights"], link: "/destinations/uk" },
    { id: "canada", code: "CA", name: "Canada", desc: "Affordable tuition, multicultural environment, and a clear pathway to permanent residency. Work while you study!", tags: ["PR Pathway", "Affordable", "Safe"], link: "/destinations/canada" },
    { id: "usa", code: "US", name: "United States", desc: "The world's leading academic destination. Access to Ivy League schools, Silicon Valley connections, and OPT opportunities.", tags: ["Ivy League", "Research", "OPT"], link: "/destinations/usa" },
    { id: "australia", code: "AU", name: "Australia", desc: "World-class education in a stunning environment. Post-study work rights, vibrant student community, and sunny lifestyle.", tags: ["Work Rights", "PR Pathway", "Quality Life"], link: "/destinations/australia" },
    { id: "europe", code: "EU", name: "Europe", desc: "Germany, Netherlands, France and more, offering low-cost tuition. Rich culture and global career opportunities.", tags: ["Low Tuition", "Culture", "Erasmus+"], link: "/contact?destination=europe" },
    { id: "ghana", code: "GH", name: "Ghana", desc: "International students seeking quality education in Ghana. We guide you through admissions to top Ghanaian universities and colleges.", tags: ["Quality Education", "Affordable", "Welcoming"], link: "/contact?destination=ghana" },
  ];

  return (
    <section id="destinations" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4">Study Destinations</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Where Will You <span className="text-brand-orange">Go?</span></h2>
          <p className="text-slate-600 text-lg">We place students in top universities across the globe</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dests.map((dest, idx) => (
            <div 
              key={idx} 
              id={dest.id}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:shadow-brand-blue/5 hover:-translate-y-1 transition-all group flex flex-col scroll-mt-28"
            >
              <div className="mb-4">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-navy text-white text-xs font-bold tracking-wider font-mono shadow-sm group-hover:bg-brand-orange transition-colors">
                  {dest.code}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{dest.name}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">{dest.desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {dest.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                ))}
              </div>
              <Link href={dest.link} className="inline-flex font-bold text-sm text-navy group-hover:text-brand-orange transition-colors">
                Explore {dest.name} &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}