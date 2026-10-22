"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ExternalLink,
  Loader2
} from "lucide-react";

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentEducation: "WASSCE / High School Graduate",
    desiredDegree: "Undergraduate (Bachelor's)",
    desiredProgram: "",
    preferredDestination: "United Kingdom",
    targetIntake: "September 2026",
    testStatus: "WASSCE English C6 or higher",
    budgetRange: "$20,000 - $35,000 / year",
    consultationMode: "In-Person (Tema Community 25 Office)",
    preferredDate: "",
    notes: ""
  });

  const updateField = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedRef = "DEC-GH-" + Math.floor(100000 + Math.random() * 900000);
    setReferenceId(generatedRef);

    try {
      if (formData.email) localStorage.setItem("dellics_user_email", formData.email);
      const fullName = (formData.firstName + " " + formData.lastName).trim();
      if (fullName) localStorage.setItem("dellics_user_name", fullName);
    } catch (err) {}

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4">
            Official Consultation Desk
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
            Book Your <span className="text-brand-orange">Free Expert</span> Session
          </h2>
          <p className="text-slate-600 text-base md:text-lg">
            Schedule a 1-on-1 personalized academic review with our certified education advisors. Available in-person at our Tema Community 25 office or virtually via Zoom.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      First Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Kwame"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all text-slate-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Last Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Mensah"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all text-slate-900" 
                    />
                  </div>
                </div>

                {/* 2. Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="kwame@example.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all text-slate-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Phone / WhatsApp Number *
                    </label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+233 55 205 4174"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all text-slate-900" 
                    />
                  </div>
                </div>

                {/* 3. Academic Profile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Current Education Status *
                    </label>
                    <select 
                      value={formData.currentEducation}
                      onChange={(e) => updateField("currentEducation", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all font-medium text-slate-700"
                    >
                      <option value="WASSCE / High School Graduate">WASSCE / High School Graduate</option>
                      <option value="Bachelor's Degree (Completed)">Bachelor's Degree (Completed)</option>
                      <option value="Final Year University Student">Final Year University Student</option>
                      <option value="HND / Polytechnic Diploma">HND / Polytechnic Diploma</option>
                      <option value="Master's Degree Holder">Master's Degree Holder</option>
                      <option value="Working Professional">Working Professional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Desired Degree Level *
                    </label>
                    <select 
                      value={formData.desiredDegree}
                      onChange={(e) => updateField("desiredDegree", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all font-medium text-slate-700"
                    >
                      <option value="Undergraduate (Bachelor's)">Undergraduate (Bachelor's)</option>
                      <option value="Postgraduate (Master's / MSc / MBA)">Postgraduate (Master's / MSc / MBA)</option>
                      <option value="Doctorate (PhD / DBA)">Doctorate (PhD / DBA)</option>
                      <option value="Pre-Master's / Foundation">Pre-Master's / Foundation</option>
                      <option value="Professional Diploma">Professional Diploma</option>
                    </select>
                  </div>
                </div>

                {/* 4. Target Program & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Target Course of Study
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. MSc Data Science, BSc Nursing, MBA..."
                      value={formData.desiredProgram}
                      onChange={(e) => updateField("desiredProgram", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all text-slate-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Preferred Destination *
                    </label>
                    <select 
                      value={formData.preferredDestination}
                      onChange={(e) => updateField("preferredDestination", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all font-medium text-slate-700"
                    >
                      <option value="United Kingdom">United Kingdom (UK)</option>
                      <option value="Canada">Canada</option>
                      <option value="United States">United States (USA)</option>
                      <option value="Australia">Australia</option>
                      <option value="Europe (Germany / France / Netherlands)">Europe (Germany / France / Netherlands)</option>
                      <option value="Ghana (Domestic & West Africa)">Ghana (Domestic & West Africa)</option>
                    </select>
                  </div>
                </div>

                {/* 5. Intake & Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Target Intake
                    </label>
                    <select 
                      value={formData.targetIntake}
                      onChange={(e) => updateField("targetIntake", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all font-medium text-slate-700"
                    >
                      <option value="September 2026">September 2026 (Fall)</option>
                      <option value="January 2027">January 2027 (Winter)</option>
                      <option value="May 2027">May 2027 (Summer)</option>
                      <option value="September 2027">September 2027</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      English Test Status
                    </label>
                    <select 
                      value={formData.testStatus}
                      onChange={(e) => updateField("testStatus", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all font-medium text-slate-700"
                    >
                      <option value="WASSCE English C6 or higher">WASSCE English C6+ (Waiver)</option>
                      <option value="IELTS Academic Taken">IELTS Academic Taken</option>
                      <option value="TOEFL / Duolingo Taken">TOEFL / Duolingo Taken</option>
                      <option value="Planning to write test">Planning to write test</option>
                      <option value="No test taken yet">No test taken yet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Annual Budget
                    </label>
                    <select 
                      value={formData.budgetRange}
                      onChange={(e) => updateField("budgetRange", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all font-medium text-slate-700"
                    >
                      <option value="Under $15,000 / year">Under $15,000 (Need Scholarships)</option>
                      <option value="$15,000 - $25,000 / year">$15,000 - $25,000 / year</option>
                      <option value="$25,000 - $40,000 / year">$25,000 - $40,000 / year</option>
                      <option value="$40,000+ / year">$40,000+ / year</option>
                    </select>
                  </div>
                </div>

                {/* 6. Mode & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Consultation Format *
                    </label>
                    <select 
                      value={formData.consultationMode}
                      onChange={(e) => updateField("consultationMode", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all font-medium text-slate-700"
                    >
                      <option value="In-Person (Tema Community 25 Office)">In-Person (Tema Community 25 Office)</option>
                      <option value="Virtual (Zoom / Google Meet)">Virtual (Zoom / Google Meet)</option>
                      <option value="Direct Phone Call">Direct Phone Call</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Preferred Date
                    </label>
                    <input 
                      type="date" 
                      value={formData.preferredDate}
                      onChange={(e) => updateField("preferredDate", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all font-medium text-slate-700" 
                    />
                  </div>
                </div>

                {/* 7. Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Additional Notes or Specific University Preferences
                  </label>
                  <textarea 
                    rows={3} 
                    value={formData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all resize-none text-slate-900" 
                    placeholder="Tell us about your target universities, previous visa history (if any), or specific questions..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-navy text-white font-bold hover:bg-navy-light transition-colors shadow-lg shadow-navy/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Securing Consultation Slot...
                    </>
                  ) : (
                    "Submit & Confirm Free Consultation"
                  )}
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-100">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                    Booking Reference: {referenceId}
                  </span>
                  <h3 className="text-2xl font-bold text-navy mt-3">Consultation Request Confirmed!</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                    Thank you, <strong>{formData.firstName}</strong>. Your assigned advisor will contact you within 24 hours at <strong>{formData.phone}</strong> or <strong>{formData.email}</strong> to review your application for <strong>{formData.preferredDestination}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2 text-slate-700">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Destination:</span>
                    <span>{formData.preferredDestination} ({formData.targetIntake})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Degree Level:</span>
                    <span>{formData.desiredDegree}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Mode:</span>
                    <span>{formData.consultationMode}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <a 
                    href={"https://wa.me/233552054174?text=Hello%20Dellics%20Education%20Consult,%20I%20booked%20a%20consultation%20with%20reference%20" + referenceId + "%20for%20" + encodeURIComponent(formData.preferredDestination)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                  >
                    <MessageSquare className="w-4 h-4" /> Chat on WhatsApp Now
                  </a>
                  <Link 
                    href="/portal"
                    className="px-6 py-3 rounded-xl bg-navy text-white font-bold text-sm hover:bg-navy-light transition-colors flex items-center justify-center gap-2"
                  >
                    Open Student Portal &rarr;
                  </Link>
                </div>

                <button 
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-slate-500 hover:text-navy underline pt-2 block mx-auto cursor-pointer"
                >
                  Book another session
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Office Credentials, Google Place Details & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1: Office info & Contact */}
            <div className="bg-navy text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-3 p-1.5 shadow-md">
                  <Image src="/logo.jpg" width={56} height={56} alt="Dellics Logo" className="rounded-xl object-contain" unoptimized />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Dellics Education Consult</h3>
                <p className="text-xs text-slate-300 italic">"Guiding Futures. Building Global Success."</p>
              </div>

              <div className="space-y-5 text-xs relative z-10 border-t border-white/10 pt-6">
                <div className="flex gap-3.5">
                  <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-sm mb-0.5">Physical Campus / Office</div>
                    <div className="text-slate-300 leading-relaxed">
                      Community 25 Devtraco Courts Rd<br/>
                      Tema, Greater Accra, Ghana
                    </div>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <Phone className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-sm mb-0.5">Direct Enquiries</div>
                    <div className="text-slate-300 leading-relaxed">
                      +233 55 205 4174 (Admissions Desk)<br/>
                      +233 24 412 3456 (Visa Compliance)
                    </div>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-sm mb-0.5">Official Email</div>
                    <div className="text-slate-300 leading-relaxed">
                      info@dellics.com · admissions@dellics.com
                    </div>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <Clock className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-sm mb-0.5">Consulting Hours</div>
                    <div className="text-slate-300 leading-relaxed">
                      Monday - Friday: 8:30 AM - 5:30 PM GMT<br/>
                      Saturday: 10:00 AM - 2:00 PM (By Appointment)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Interactive Location Map with Google Place Embed */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-orange" />
                  <span className="font-bold text-sm text-navy">Find Our Tema Office</span>
                </div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Dellics+Travels+Tema+Ghana&query_place_id=ChIJr0avQg2BIBARdcdSU6ofrjU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
                >
                  Open in Maps <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div className="w-full h-52 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <iframe 
                  title="Dellics Education Consult Location"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy" 
                  allowFullScreen 
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.4357493631627!2d0.016335!3d5.700145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1020810d42af46af%3A0x356e1fa24652c775!2sCommunity%2025%20Devtraco%20Courts%20Rd%2C%20Tema!5e0!3m2!1sen!2sgh!4v1716000000000"
                ></iframe>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
