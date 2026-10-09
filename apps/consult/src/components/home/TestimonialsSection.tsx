"use client";
import { Star, CheckCircle2 } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Kwame Asare",
      destination: "University of Toronto, Canada",
      role: "MSc Computer Science",
      location: "Accra, Ghana",
      rating: 5,
      quote: "Dellics Consult made my Canadian visa and admission process seamless. From school selection to securing my study permit, their team was hands-on and incredibly supportive.",
      source: "GOOGLE",
    },
    {
      id: 2,
      name: "Grace Osei",
      destination: "University of Manchester, UK",
      role: "BSc Business Management",
      location: "Kumasi, Ghana",
      rating: 5,
      quote: "I was overwhelmed by the UCAS application, but Dellics guided me through every step. They even helped me secure discounted student flights when it was time to travel!",
      source: "INTERNAL",
    },
    {
      id: 3,
      name: "Daniel Mensah",
      destination: "Harvard University, USA",
      role: "MBA Candidate",
      location: "Accra, Ghana",
      rating: 5,
      quote: "The test prep coordination for my GMAT and the interview coaching for my US student visa were game changers. Highly recommend Dellics Education Consult to anyone looking to study abroad.",
      source: "GOOGLE",
    },
  ];

  return (
    <section className="bg-slate-50 py-24 border-t border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-brand-orange font-bold text-sm tracking-widest uppercase mb-3">Social Proof</p>
          <h2 className="text-3xl font-display font-bold text-navy sm:text-4xl">What Our Students Say</h2>
          <p className="mt-4 text-slate-600">Read verified reviews from students who successfully secured admissions and visas through Dellics.</p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 pb-8 border-b border-slate-200/60 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 font-bold text-xl text-blue-600">G</div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 leading-tight">Google</span>
              <div className="flex text-amber-400 text-sm tracking-widest">
                ★★★★★
              </div>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-300 hidden sm:block"></div>
          <div className="flex flex-col text-center sm:text-left">
            <span className="font-bold text-slate-800 leading-tight">Excellent 4.9 out of 5</span>
            <span className="text-sm text-slate-500">Based on 150+ verified reviews</span>
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="flex flex-col justify-between rounded-3xl bg-white p-8 border border-slate-200/80 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div>
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((starIndex) => (
                      <Star key={starIndex} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700 ml-1 font-mono">
                    5.0
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700 italic">
                  "{review.quote}"
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 flex items-end justify-between">
                <div>
                  <p className="font-display text-sm font-bold text-navy">
                    {review.name}
                  </p>
                  <p className="text-xs text-brand-orange font-medium mt-0.5">
                    {review.destination}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {review.role} · {review.location}
                  </p>
                </div>

                {review.source === 'GOOGLE' && (
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-slate-700 text-[11px] font-bold px-2 py-0.5 border border-slate-200 rounded-sm flex items-center gap-1 bg-white shadow-sm">
                      <span className="text-blue-600 font-extrabold text-[12px]">G</span> Google
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium"><CheckCircle2 className="w-3 h-3 text-blue-500" /> Verified</span>
                  </div>
                )}
                {review.source === 'INTERNAL' && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium"><CheckCircle2 className="w-3 h-3 text-brand-orange" /> Verified Student</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}