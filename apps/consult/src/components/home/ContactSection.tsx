import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4">Get In Touch</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Book Your <span className="text-brand-orange">Free</span> Consultation</h2>
          <p className="text-slate-600 text-lg">Fill out the form below and our expert counsellors will contact you within 24 hours</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 bg-slate-50 rounded-3xl p-4 md:p-8 border border-slate-100">
          <div className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">First Name *</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" placeholder="Your first name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Last Name *</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" placeholder="Your last name" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" placeholder="+233 XX XXX XXXX" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Study Destination</label>
                <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all appearance-none font-medium text-slate-600">
                  <option>Select a destination...</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>United States</option>
                  <option>Europe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tell Us About Your Goals</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all resize-none" placeholder="Share your study abroad goals, current qualification level..."></textarea>
              </div>
              <button type="button" className="w-full py-4 rounded-xl bg-brand-blue text-white font-bold hover:bg-brand-blue-light transition-colors shadow-lg shadow-brand-blue/20">
                Submit & Book Consultation
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-brand-blue text-white rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 rounded-full blur-2xl"></div>
              <div className="relative z-10 text-center mb-8">
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center mx-auto mb-4">
                  <Image src="/logo.jpg" width={48} height={48} alt="Dellics Logo" className="rounded-lg" />
                </div>
                <p className="font-display font-medium italic opacity-90 text-sm">"Guiding Futures. Building Success."</p>
              </div>
              <div className="space-y-6 relative z-10">
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm mb-1">Visit Our Office</div>
                    <div className="text-xs text-blue-200 leading-relaxed">Tema Community 25, Devtraco Estate<br/>Greater Accra, Ghana</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm mb-1">Call Us</div>
                    <div className="text-xs text-blue-200 leading-relaxed">+233 55 205 4174<br/>+233 24 412 3456</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm mb-1">Email Us</div>
                    <div className="text-xs text-blue-200 leading-relaxed">info@dellics.com<br/>admissions@dellics.com</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm mb-1">Working Hours</div>
                    <div className="text-xs text-blue-200 leading-relaxed">Monday - Friday: 9:00 AM - 5:00 PM<br/>Saturday - Sunday: Closed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}