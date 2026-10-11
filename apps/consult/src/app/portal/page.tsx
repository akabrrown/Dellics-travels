"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  GraduationCap, 
  FileText, 
  Plane, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Upload, 
  Download, 
  ExternalLink, 
  MessageSquare, 
  User, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from "lucide-react";

interface AppRecord {
  id: string;
  university: string;
  program: string;
  intake: string;
  country: string;
  status: "Offer Letter Issued" | "Under Review" | "Visa In Progress" | "Enrolled";
  stageStep: number; // 1 to 7
  trackingNo: string;
}

export default function StudentPortalPage() {
  const [userName, setUserName] = useState("Kwame Mensah");
  const [userEmail, setUserEmail] = useState("kwame.mensah@gmail.com");
  const [activeTab, setActiveTab] = useState<"applications" | "documents" | "travel_perks" | "counsellor">("applications");
  const [uploadedDocs, setUploadedDocs] = useState([
    { name: "WASSCE Official Results Slip / Certificate", status: "Verified", date: "12 Sep 2026", size: "1.2 MB" },
    { name: "Undergraduate Degree Transcript", status: "Verified", date: "14 Sep 2026", size: "2.4 MB" },
    { name: "Ghana International Passport Bio-Data", status: "Verified", date: "15 Sep 2026", size: "900 KB" },
    { name: "Academic Statement of Purpose (SOP)", status: "Approved", date: "18 Sep 2026", size: "350 KB" },
    { name: "Proof of Financial Funds (Bank Statement)", status: "Action Required", date: "Pending 28-day rule", size: "--" }
  ]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocName, setNewDocName] = useState("");

  useEffect(() => {
    try {
      const storedName = localStorage.getItem("dellics_user_name");
      const storedEmail = localStorage.getItem("dellics_user_email");
      if (storedName) setUserName(storedName);
      if (storedEmail) setUserEmail(storedEmail);
    } catch (e) {}
  }, []);

  const applications: AppRecord[] = [
    {
      id: "APP-UK-2026-081",
      university: "University of Manchester",
      program: "MSc Advanced Computer Science & AI",
      intake: "September 2026",
      country: "United Kingdom",
      status: "Offer Letter Issued",
      stageStep: 5, // Step 5: Offer
      trackingNo: "UoM-INTL-99214"
    },
    {
      id: "APP-CA-2026-104",
      university: "University of Toronto",
      program: "Postgraduate Diploma in Cloud Architecture",
      intake: "January 2027",
      country: "Canada",
      status: "Under Review",
      stageStep: 4, // Step 4: Apply
      trackingNo: "UofT-SGS-44102"
    }
  ];

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;
    setUploadedDocs(prev => [
      ...prev,
      {
        name: newDocName,
        status: "Under Review",
        date: "Just now",
        size: "1.8 MB"
      }
    ]);
    setNewDocName("");
    setShowUploadModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Student Portal Header / Profile Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-orange to-amber-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
              {userName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display font-bold text-navy">{userName}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Student Profile
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{userEmail} · Student ID: <span className="font-mono text-slate-700 font-semibold">DEC-GH-202688</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://wa.me/233552054174?text=Hello%20Dellics%20Education%20Consult,%20I%20am%20logged%20into%20my%20Student%20Portal%20and%20need%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl border border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Message Advisor
            </a>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover shadow-md shadow-brand-orange/20 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" /> Upload Document
            </button>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">2</div>
              <div className="text-xs text-slate-500 font-medium">Active Applications</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">4 / 5</div>
              <div className="text-xs text-slate-500 font-medium">Documents Verified</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-navy">10% Off Airfare</div>
              <div className="text-xs text-slate-500 font-medium">Dellics Travels Perk Active</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-navy">Dr. K. Osei</div>
              <div className="text-xs text-slate-500 font-medium">Assigned UK & CA Advisor</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            onClick={() => setActiveTab("applications")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "applications"
                ? "border-brand-orange text-navy"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            My Applications
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "documents"
                ? "border-brand-orange text-navy"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            Document Vault
          </button>
          <button
            onClick={() => setActiveTab("travel_perks")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "travel_perks"
                ? "border-brand-orange text-navy"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            Dellics Travels Perks
          </button>
          <button
            onClick={() => setActiveTab("counsellor")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "counsellor"
                ? "border-brand-orange text-navy"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            Advisory & Support
          </button>
        </div>

        {/* TAB 1: APPLICATIONS */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase bg-brand-blue/10 text-brand-blue">
                        {app.country}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{app.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-navy">{app.program}</h3>
                    <p className="text-sm text-slate-600 mt-0.5">{app.university} · Intake: <span className="font-semibold text-slate-900">{app.intake}</span></p>
                  </div>

                  <div className="flex flex-col sm:items-end">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3.5 h-3.5" /> {app.status}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 font-mono">Ref: {app.trackingNo}</span>
                  </div>
                </div>

                {/* 7-Step Roadmap Visualization for this Application */}
                <div className="pt-6">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                    7-Step Journey Progress: Step {app.stageStep} of 7
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center text-xs">
                    {[
                      { num: 1, name: "Consult" },
                      { num: 2, name: "Assess" },
                      { num: 3, name: "Select" },
                      { num: 4, name: "Apply" },
                      { num: 5, name: "Offer" },
                      { num: 6, name: "Visa" },
                      { num: 7, name: "Travel" }
                    ].map((st) => {
                      const isCompleted = st.num < app.stageStep;
                      const isCurrent = st.num === app.stageStep;
                      return (
                        <div key={st.num} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                            isCompleted 
                              ? "bg-emerald-500 text-white shadow-sm"
                              : isCurrent
                              ? "bg-brand-orange text-white ring-4 ring-brand-orange/20 font-extrabold shadow-md"
                              : "bg-slate-100 text-slate-400"
                          }`}>
                            {isCompleted ? "✓" : st.num}
                          </div>
                          <span className={`text-[11px] font-medium hidden sm:block ${
                            isCurrent ? "text-brand-orange font-bold" : isCompleted ? "text-slate-700" : "text-slate-400"
                          }`}>
                            {st.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    Next Action: Official CAS / I-20 generation in progress with Admissions Office.
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert(`Official conditional offer letter for ${app.university} has been forwarded to your email (${userEmail}). Contact advisor for CAS questions.`)}
                      className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Offer Letter
                    </button>
                    <a
                      href={`https://wa.me/233552054174?text=Hello%20Advisor,%20I%20have%20an%20enquiry%20regarding%20my%20application%20${app.id}%20for%20${encodeURIComponent(app.university)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Contact Case Officer
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: DOCUMENT VAULT */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-navy">Academic & Visa Vault</h3>
                <p className="text-xs text-slate-500 mt-0.5">Secure cloud repository compliant with UKVI, IRCC, and US Embassy submission standards.</p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Add New Document
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {uploadedDocs.map((doc, idx) => (
                <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{doc.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{doc.size} · Uploaded: {doc.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      doc.status === "Verified" || doc.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {doc.status}
                    </span>
                    <button 
                      onClick={() => alert(`Secure file preview: ${doc.name} (Stored in Dellics Encrypted Vault)`)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DELLICS TRAVELS PERKS INTEGRATION */}
        {activeTab === "travel_perks" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-navy via-slate-900 to-navy text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-bold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5" /> Seamless Ecosystem Integration
                </span>
                <h3 className="text-3xl font-display font-bold text-white mb-3">
                  Powered by Dellics Travels
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Every Dellics Education Consult student is entitled to VIP concessions through our parent travel agency: discounted international student airfares with extra luggage allowance (up to 46kg), vetted student housing near your campus, pre-booked airport transfers, and pre-activated UK/Canada/US eSIM cards.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                    <div className="font-bold text-brand-orange text-sm mb-1">✈️ Extra Baggage Allowance</div>
                    <p className="text-xs text-slate-300">2x 23kg checked bags on British Airways, Qatar Airways, Delta, and KLM for Dellics students.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                    <div className="font-bold text-brand-orange text-sm mb-1">🏠 Verified Student Housing</div>
                    <p className="text-xs text-slate-300">Inspected accommodation options with student lease guarantee and zero booking fees.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                    <div className="font-bold text-brand-orange text-sm mb-1">📱 International eSIM</div>
                    <p className="text-xs text-slate-300">Pre-activated high-speed data ready the minute you land at Heathrow, Pearson, or JFK.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                    <div className="font-bold text-brand-orange text-sm mb-1">🚕 Airport Meet & Greet</div>
                    <p className="text-xs text-slate-300">Safe, direct campus transfer coordinated directly with university arrival teams.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href="https://dellicstravels.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-hover transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20"
                  >
                    Visit Dellics Travels Portal <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href="https://wa.me/233552054174?text=Hello%20Dellics%20Travels,%20I%20am%20a%20Consult%20student%20ready%20to%20book%20my%20discounted%20student%20flight."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors text-center"
                  >
                    Book Flights via Travel Desk
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COUNSELLOR & ADVISORY */}
        {activeTab === "counsellor" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-navy mb-4">Dedicated Academic Counsel</h3>
            <div className="flex flex-col sm:flex-row items-start gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-16 h-16 rounded-2xl bg-navy text-white flex items-center justify-center font-bold text-2xl shrink-0">
                KO
              </div>
              <div className="space-y-2">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Dr. Kofi Osei</h4>
                  <p className="text-xs text-brand-orange font-bold uppercase tracking-wider">Head of Admissions & International Compliance</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                  Over 12 years of experience placing Ghanaian students into the UK Russell Group, Canada U15, and US Tier-1 institutions. Specialist in CAS procurement and UKVI / IRCC financial compliance audits.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/233552054174?text=Hello%20Dr.%20Osei,%20I%20am%20enquiring%20about%20my%20university%20application."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Direct
                  </a>
                  <Link
                    href="/contact"
                    className="px-4 py-2 rounded-xl bg-navy text-white font-bold text-xs hover:bg-navy-light transition-colors"
                  >
                    Book 1-on-1 In-Person Session
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-navy/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-navy mb-1">Upload Document to Vault</h3>
            <p className="text-xs text-slate-500 mb-4">Supported formats: PDF, JPG, PNG up to 15MB.</p>

            <form onSubmit={handleSimulateUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Document Type / Title *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Bank Statement (28-day proof), WASSCE Scratch Card..."
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-brand-orange outline-none"
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-xs text-slate-600 font-medium block">Click to select file or drag & drop</span>
                <span className="text-[10px] text-slate-400">PDF, PNG, JPG (Max 15MB)</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover"
                >
                  Upload & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
