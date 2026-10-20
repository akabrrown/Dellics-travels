import Link from "next/link";
export function FaqSection() {
  const faqs = [
    { q: "Do I need IELTS or TOEFL to study abroad?", a: "Not necessarily for all universities. Many universities in the UK, Canada, and the USA accept a grade of C6 or better in WASSCE English as proof of English proficiency." },
    { q: "Does Dellics guarantee admission or a student visa?", a: "No ethical consultancy can legally guarantee admission or visa issuance. What Dellics guarantees is rigorous compliance, thorough vetting of your financial documents, and tailored interview coaching." },
    { q: "Which countries and study destinations do you support?", a: "We specialize in admissions across the United Kingdom, Canada, the United States, Australia, and European destinations including Germany, France, and the Netherlands." },
    { q: "How much does Dellics' consultancy service cost?", a: "Our initial consultation and profile evaluation are 100% free of charge. For our comprehensive service packages, we charge transparent, agreed-upon service fees with zero hidden costs." }
  ];

  return (
    <section id="faqs" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-navy/5 text-navy text-xs font-bold uppercase tracking-widest mb-4">Got Questions?</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">Frequently Asked <span className="text-brand-orange">Questions</span></h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-white rounded-2xl border border-slate-200 open:shadow-md transition-all">
              <summary className="flex items-center justify-between cursor-pointer p-6 font-bold text-slate-900 list-none [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="transition group-open:rotate-45 text-2xl font-light text-slate-400">+</span>
              </summary>
              <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
        
        <div className="mt-20 bg-navy rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange"></div>
          <h3 className="text-3xl font-display font-bold mb-4">Ready to Study Abroad?</h3>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">Book your free consultation today and take the first step toward your global future.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="px-8 py-3 rounded-full bg-white text-brand-blue font-bold hover:bg-slate-50 transition-colors shadow-lg">Book Free Consultation</Link>
            <a href="tel:+233552054174" className="px-8 py-3 rounded-full bg-transparent border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-colors">Call Us Now</a>
          </div>
        </div>
      </div>
    </section>
  );
}
