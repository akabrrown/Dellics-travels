"use client";

import React, { useState } from "react";
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
  Loader2,
  Calendar,
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function ConsultationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  // All inputs and dropdowns start EMPTY as strictly requested (no auto-fill)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentEducation: "",
    desiredDegree: "",
    desiredProgram: "",
    preferredDestination: "",
    targetIntake: "",
    testStatus: "",
    budgetRange: "",
    consultationMode: "",
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

      if (typeof window !== "undefined") {
        const existingRaw = localStorage.getItem("dellics_consultation_requests");
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const newRequest = {
          id: "req-" + Date.now(),
          referenceId: generatedRef,
          studentName: fullName,
          studentEmail: formData.email,
          studentPhone: formData.phone,
          currentEducation: formData.currentEducation,
          desiredDegree: formData.desiredDegree,
          desiredProgram: formData.desiredProgram,
          preferredDestination: formData.preferredDestination,
          targetIntake: formData.targetIntake,
          consultationMode: formData.consultationMode,
          preferredDate: formData.preferredDate,
          notes: formData.notes,
          status: "Pending",
          assignedConsultant: null,
          history: [
            {
              timestamp: new Date().toISOString(),
              actor: fullName,
              action: "Submitted Consultation Request",
              notes: `Requested ${formData.consultationMode || "In-Person/Virtual"} session for ${formData.preferredDestination || "Study Abroad"}`
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        existing.unshift(newRequest);
        localStorage.setItem("dellics_consultation_requests", JSON.stringify(existing));
        window.dispatchEvent(new Event("dellics_consultation_updated"));
      }
    } catch (err) {}

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans pt-20 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy font-semibold">Book Consultation</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4 border border-brand-orange/20">
            <Sparkles className="w-3.5 h-3.5" /> Official Consultation Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-navy tracking-tight mb-5">
            Book Your <span className="text-brand-orange">Free Expert</span> Session
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
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
                      required
                      value={formData.currentEducation}
                      onChange={(e) => updateField("currentEducation", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all font-medium text-slate-700"
                    >
                      <option value="">Select Current Education Status</option>
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
                      required
                      value={formData.desiredDegree}
                      onChange={(e) => updateField("desiredDegree", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all font-medium text-slate-700"
                    >
                      <option value="">Select Desired Degree Level</option>
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
                      required
                      value={formData.preferredDestination}
                      onChange={(e) => updateField("preferredDestination", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all font-medium text-slate-700"
                    >
                      <option value="">Select Preferred Destination</option>
                      <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                      <option value="Canada">Canada</option>
                      <option value="United States">United States (USA)</option>
                      <option value="Australia">Australia</option>
                      <option value="Europe (Germany / France / Netherlands)">Europe (Germany / France / Netherlands)</option>
                      <option value="Ghana (Domestic & West Africa)">Ghana (Domestic & West Africa)</option>
                    </select>
                  </div>
                </div>

                {/* 5. Intake, Test Status & Budget */}
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
                      <option value="">Select Intake</option>
                      <option value="September 2026 (Fall)">September 2026 (Fall)</option>
                      <option value="January 2027 (Winter)">January 2027 (Winter)</option>
                      <option value="May 2027 (Summer)">May 2027 (Summer)</option>
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
                      <option value="">Select Test Status</option>
                      <option value="WASSCE English C6+ (Waiver)">WASSCE English C6+ (Waiver)</option>
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
                      <option value="">Select Budget</option>
                      <option value="Under $15,000 (Need Scholarships)">Under $15,000 (Need Scholarships)</option>
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
                      required
                      value={formData.consultationMode}
                      onChange={(e) => updateField("consultationMode", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-orange text-sm outline-none transition-all font-medium text-slate-700"
                    >
                      <option value="">Select Consultation Format</option>
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
                    Thank you, <strong>{formData.firstName}</strong>. Your assigned advisor will contact you within 24 hours at <strong>{formData.phone}</strong> or <strong>{formData.email}</strong> to review your application for <strong>{formData.preferredDestination || "your chosen destination"}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2 text-slate-700">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Destination:</span>
                    <span>{formData.preferredDestination || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Degree Level:</span>
                    <span>{formData.desiredDegree || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Mode:</span>
                    <span>{formData.consultationMode || "In-Person"}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <a 
                    href={"https://wa.me/233552054174?text=Hello%20Dellics%20Education%20Consult,%20I%20booked%20a%20consultation%20with%20reference%20" + referenceId}
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

          {/* Right Column: Physical Campus, Place Details & Hours */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card: Office Info & Place Details */}
            <div className="bg-navy text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-3 p-1.5 shadow-md">
                  <Image src="/logo.jpg" width={56} height={56} alt="Dellics Logo" className="rounded-xl object-contain" unoptimized />
                </div>
                <h2 className="font-display font-bold text-lg text-white">Dellics Education Consult</h2>
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
                    <div className="text-slate-300">
                      +233 55 205 4174 (Admissions Desk)<br/>
                      +233 24 412 3456 (Visa Compliance)
                    </div>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-sm mb-0.5">Official Email</div>
                    <div className="text-slate-300">
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

              {/* Map Link */}
              <div className="mt-6 pt-5 border-t border-white/10 relative z-10">
                <a 
                  href="https://maps.google.com/?q=Community+25+Devtraco+Courts+Rd+Tema+Ghana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-white/15"
                >
                  <MapPin className="w-4 h-4 text-brand-orange" />
                  <span>Find Our Tema Office (Open in Maps)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Assurance Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                What to Expect at Your Session
              </h3>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0 mt-1.5" />
                  <span>Comprehensive eligibility assessment based on your WASSCE, HND, or Degree grades.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0 mt-1.5" />
                  <span>Tailored course & university recommendations with fee schedules and living cost breakdowns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0 mt-1.5" />
                  <span>Direct guidance on scholarship applications, waiver options, and visa compliance timelines.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
