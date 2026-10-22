import type { Metadata } from "next";
import Link from "next/link";
import { 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  Building2, 
  MessageSquare, 
  Globe2, 
  ChevronRight,
  Clock,
  Sparkles
} from "lucide-react";
import { FaqSection } from "../../components/home";

export const metadata: Metadata = {
  title: "Contact Us | Dellics Education Consult",
  description:
    "Get in touch with our education advisors for admissions, scholarships, visa assistance, and study abroad consultation.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy font-semibold">Contact Us</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4 border border-brand-orange/20">
            <Sparkles className="w-3.5 h-3.5" /> Direct Support & Advisory
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-navy tracking-tight mb-5">
            Get in Touch with Our Education Team
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Have questions about university admissions, scholarships, study destinations, or visa assistance? Contact our team for guidance and support throughout your study-abroad journey.
          </p>
        </div>

        {/* Contact Grid: 6 Core Advisory & Office Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          
          {/* Card 1: Online Inquiry Desk */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-display font-bold text-navy mb-2">
                Online Inquiry Desk
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                University Admissions, Scholarships & Student Visa Advisory
              </p>
            </div>
            <div>
              <Link
                href="/consultation"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-brand-orange-light transition-colors group-hover:translate-x-1 duration-200"
              >
                <span>Book Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Direct Enquiries */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-display font-bold text-navy mb-2">
                Direct Enquiries
              </h2>
              <div className="space-y-2 mb-6">
                <div>
                  <a href="tel:+233552054174" className="text-base font-bold font-mono text-slate-900 hover:text-brand-orange block">
                    +233 55 205 4174
                  </a>
                  <span className="text-xs text-slate-500 font-medium">Admissions Desk</span>
                </div>
                <div>
                  <a href="tel:+233244123456" className="text-base font-bold font-mono text-slate-900 hover:text-brand-orange block">
                    +233 24 412 3456
                  </a>
                  <span className="text-xs text-slate-500 font-medium">Visa Compliance</span>
                </div>
              </div>
            </div>
            <div>
              <a
                href="tel:+233552054174"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group-hover:translate-x-1 duration-200"
              >
                <span>Call Admissions Desk</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 3: Official Email */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-display font-bold text-navy mb-2">
                Official Email
              </h2>
              <div className="space-y-2 mb-6">
                <div>
                  <a href="mailto:info@dellics.com" className="text-base font-semibold text-slate-900 hover:text-brand-orange block">
                    info@dellics.com
                  </a>
                  <span className="text-xs text-slate-500">General Information</span>
                </div>
                <div>
                  <a href="mailto:admissions@dellics.com" className="text-base font-semibold text-slate-900 hover:text-brand-orange block">
                    admissions@dellics.com
                  </a>
                  <span className="text-xs text-slate-500">Application Submissions</span>
                </div>
              </div>
            </div>
            <div>
              <a
                href="mailto:info@dellics.com"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors group-hover:translate-x-1 duration-200"
              >
                <span>Email Our Team</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 4: Physical Campus / Office */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                  HQ
                </span>
                <h2 className="text-xl font-display font-bold text-navy">
                  Physical Campus / Office
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-700 font-medium mb-6 leading-relaxed">
                Community 25 Devtraco Courts Rd<br/>
                Tema, Greater Accra, Ghana
              </p>
            </div>
            <div>
              <a
                href="https://maps.google.com/?q=Community+25+Devtraco+Courts+Rd+Tema+Ghana"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-brand-orange-light transition-colors group-hover:translate-x-1 duration-200"
              >
                <span>Find Our Tema Office (Maps)</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 5: Consulting Hours */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-display font-bold text-navy mb-2">
                Consulting Hours
              </h2>
              <div className="space-y-3 mb-6 text-sm text-slate-700">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="font-medium text-slate-500">Monday - Friday:</span>
                  <span className="font-semibold text-slate-900">8:30 AM - 5:30 PM GMT</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="font-medium text-slate-500">Saturday:</span>
                  <span className="font-semibold text-slate-900">10:00 AM - 2:00 PM (Appt)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-slate-500">Sunday:</span>
                  <span className="font-semibold text-slate-400">Closed</span>
                </div>
              </div>
            </div>
            <div>
              <Link
                href="/consultation"
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group-hover:translate-x-1 duration-200"
              >
                <span>Schedule an Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 6: United States */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                  USA
                </span>
                <h2 className="text-xl font-display font-bold text-navy">
                  United States
                </h2>
              </div>
              <p className="text-sm text-slate-700 font-medium mb-6 leading-relaxed">
                30 N Gould ST, STER, SHERIDAN, WY 82801
              </p>
            </div>
            <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-slate-400" />
              <span>International Partner Office</span>
            </div>
          </div>

        </div>

        {/* Quick Consultation Banner */}
        <div className="bg-navy rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl mb-16">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider">
              1-on-1 Personalized Session
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white">
              Ready to Plan Your Study Abroad Journey?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Book a tailored consultation with our international education advisors to evaluate university choices, scholarship eligibility, and visa steps.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/consultation"
                className="px-6 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-light text-white font-bold text-sm shadow-lg shadow-brand-orange/30 transition-all flex items-center gap-2"
              >
                <span>Book Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/233552054174?text=Hello%20Dellics%20Education%20Consult,%20I%20would%20like%20to%20inquire%20about%20university%20admissions"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <FaqSection />

      </div>
    </main>
  );
}