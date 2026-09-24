import { Star } from "lucide-react";

export function TestimonialsSection() {
  const reviews = [
    { name: "Ama Kyei", school: "University of Manchester, UK", init: "AK", text: "Dellics made my dream of studying in the UK a reality. They guided me through every step — from IELTS prep to my Tier 4 visa. I'm now at the University of Manchester!" },
    { name: "Kwame Boateng", school: "University of Calgary, Canada", init: "KB", text: "I had tried twice before with other agents and failed. Dellics Education Consult got my Canadian study permit approved in just 6 weeks! Professional and thorough." },
    { name: "Abena Frimpong", school: "Chevening Scholar, LSE London", init: "AF", text: "The scholarship guidance from Dellics was phenomenal. They helped me secure a Chevening Scholarship worth £25,000. I couldn't have done it without their expert help!" },
  ];

  return (
    <section id="testimonials" className="py-24 bg-white border-y border-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4">Success Stories</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">What students <span className="text-brand-orange">say</span></h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
              <div className="flex gap-1 mb-6 text-brand-orange">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <blockquote className="text-slate-700 leading-relaxed mb-8 flex-1 text-sm">
                "{rev.text}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold">{rev.init}</div>
                <div>
                  <div className="font-bold text-slate-900">{rev.name}</div>
                  <div className="text-xs text-slate-500">{rev.school}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}