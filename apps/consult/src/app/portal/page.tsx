"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  FileText,
  ShieldCheck,
  Plane,
  MessageSquare,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Upload,
  ExternalLink,
  LogOut,
  Send,
  Building2,
  Calendar,
  Trash2,
  HelpCircle,
  ChevronRight,
  UserCheck
} from "lucide-react";

interface Application {
  id: string;
  university: string;
  country: string;
  program: string;
  intake: string;
  status: "In Review" | "Documents Needed" | "Submitted" | "Conditional Offer";
  date: string;
}

interface DocumentItem {
  id: string;
  name: string;
  category: string;
  status: "Required" | "Uploaded" | "Verified";
  filename?: string;
  uploadedAt?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "advisor";
  text: string;
  time: string;
}

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  { id: "doc-1", name: "WASSCE / High School or Degree Transcripts", category: "Academic", status: "Required" },
  { id: "doc-2", name: "International Passport (Bio-data Page)", category: "Identification", status: "Required" },
  { id: "doc-3", name: "Statement of Purpose / Personal Essay", category: "Academic", status: "Required" },
  { id: "doc-4", name: "Academic / Professional Recommendation Letters", category: "References", status: "Required" },
  { id: "doc-5", name: "English Proficiency / WAEC C6+ Attestation", category: "Testing", status: "Required" },
  { id: "doc-6", name: "Financial Sponsorship / Bank Statement", category: "Visa & Finance", status: "Required" },
];

export default function PortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "applications" | "documents" | "visa" | "travel" | "chat">("overview");
  
  // Real dynamic user info without fake mock hardcoding
  const [userName, setUserName] = useState("Student");
  const [userEmail, setUserEmail] = useState("");
  
  // Dynamic persistent state
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>(DEFAULT_DOCUMENTS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState("");

  // Modal for new application
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUni, setNewUni] = useState("");
  const [newCountry, setNewCountry] = useState("United Kingdom");
  const [newProgram, setNewProgram] = useState("");
  const [newIntake, setNewIntake] = useState("September 2026");

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedEmail = localStorage.getItem("dellics_user_email") || "";
      const storedName = localStorage.getItem("dellics_user_name") || "";
      if (storedEmail) setUserEmail(storedEmail);
      if (storedName) {
        setUserName(storedName);
      } else if (storedEmail) {
        const namePart = (storedEmail.split("@")[0] || "").replace(/[._-]/g, " ");
        setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
      }

      const storedApps = localStorage.getItem("dellics_portal_apps");
      if (storedApps) setApplications(JSON.parse(storedApps));

      const storedDocs = localStorage.getItem("dellics_portal_docs");
      if (storedDocs) setDocuments(JSON.parse(storedDocs));

      const storedMsgs = localStorage.getItem("dellics_portal_msgs");
      if (storedMsgs) {
        setMessages(JSON.parse(storedMsgs));
      } else {
        setMessages([
          {
            id: "msg-welcome",
            sender: "advisor",
            text: "Welcome to Dellics Education Consult! I am your assigned international education advisor. Feel free to ask any questions regarding university selection, entry requirements, or visa guidelines.",
            time: "Just now"
          }
        ]);
      }
    } catch (e) {
      console.warn("Local storage unavailable:", e);
    }
  }, []);

  // Save changes to localStorage
  const saveApps = (newApps: Application[]) => {
    setApplications(newApps);
    localStorage.setItem("dellics_portal_apps", JSON.stringify(newApps));
  };

  const saveDocs = (newDocs: DocumentItem[]) => {
    setDocuments(newDocs);
    localStorage.setItem("dellics_portal_docs", JSON.stringify(newDocs));
  };

  const saveMsgs = (newMsgs: ChatMessage[]) => {
    setMessages(newMsgs);
    localStorage.setItem("dellics_portal_msgs", JSON.stringify(newMsgs));
  };

  // Add new application
  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUni.trim() || !newProgram.trim()) return;

    const newApp: Application = {
      id: "app-" + Date.now(),
      university: newUni.trim(),
      country: newCountry,
      program: newProgram.trim(),
      intake: newIntake,
      status: "In Review",
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };

    saveApps([newApp, ...applications]);
    setNewUni("");
    setNewProgram("");
    setShowAddModal(false);
  };

  // Delete application
  const handleDeleteApplication = (id: string) => {
    const updated = applications.filter((a) => a.id !== id);
    saveApps(updated);
  };

  // Simulate file upload
  const handleUploadDoc = (docId: string) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.doc,.docx,.jpg,.png";
    fileInput.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const updated = documents.map((d) => {
          if (d.id === docId) {
            return {
              ...d,
              status: "Uploaded" as const,
              filename: file.name,
              uploadedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            };
          }
          return d;
        });
        saveDocs(updated);
      }
    };
    fileInput.click();
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: newMessageText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMsgs = [...messages, userMsg];
    saveMsgs(nextMsgs);
    setNewMessageText("");

    // Automated advisor acknowledgment
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: "msg-reply-" + Date.now(),
        sender: "advisor",
        text: "Thank you for your message. Your consultant will review your query and respond shortly during standard business hours (8:00 AM - 6:00 PM GMT).",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      saveMsgs([...nextMsgs, replyMsg]);
    }, 1200);
  };

  const handleSignOut = () => {
    localStorage.removeItem("dellics_user_email");
    localStorage.removeItem("dellics_user_name");
    router.push("/login");
  };

  // Calculate metrics
  const uploadedCount = documents.filter((d) => d.status === "Uploaded" || d.status === "Verified").length;
  const progressPercent = Math.round((uploadedCount / documents.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="relative h-10 w-28 shrink-0">
              <Image src="/logo.jpg" alt="Dellics Education Consult" fill className="object-contain object-left" unoptimized />
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider">
              Student Portal
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <a 
              href="https://dellicstravels.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-navy flex items-center gap-1.5 transition-colors"
            >
              <Plane className="w-4 h-4 text-brand-orange" />
              Dellics Travels
            </a>
            
            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {userName.charAt(0)}
              </div>
              <span className="hidden md:inline-block text-sm font-bold text-slate-800">
                {userName}
              </span>
              <button
                onClick={handleSignOut}
                className="text-slate-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm sticky top-24">
            <div className="px-3 py-2 mb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Navigation</h2>
            </div>
            
            <nav className="space-y-1">
              {[
                { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
                { id: "applications", label: "My Applications", icon: GraduationCap, badge: applications.length },
                { id: "documents", label: "Document Vault", icon: FileText, badge: `${uploadedCount}/${documents.length}` },
                { id: "visa", label: "Visa & Compliance", icon: ShieldCheck },
                { id: "travel", label: "Dellics Travel Perks", icon: Plane },
                { id: "chat", label: "Advisor Channel", icon: MessageSquare, badge: messages.length > 1 ? "Active" : undefined },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-navy text-white shadow-md shadow-navy/10"
                        : "text-slate-600 hover:text-navy hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-brand-orange" : "text-slate-400"}`} />
                      {tab.label}
                    </div>
                    {tab.badge !== undefined && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-100 px-3">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200/60">
                <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs text-amber-900 leading-tight">
                  <strong>Need immediate help?</strong><br/>
                  Call +233 55 205 4174 or message your consultant.
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Tab Content Panel */}
        <main className="lg:col-span-9 space-y-6">

          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-bold uppercase tracking-wider mb-4">
                    Active Study Abroad Journey
                  </span>
                  <h1 className="text-3xl font-display font-bold mb-2">
                    Welcome back, {userName}!
                  </h1>
                  <p className="text-slate-200 text-sm leading-relaxed mb-6 font-light">
                    Track your admissions roadmap, upload required university transcripts, and coordinate travel perks with Dellics Travels.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-brand-orange text-white font-bold text-xs hover:bg-brand-orange-hover transition-colors flex items-center gap-2 shadow-md shadow-brand-orange/30"
                    >
                      <Plus className="w-4 h-4" /> Add University Choice
                    </button>
                    <button 
                      onClick={() => setActiveTab("documents")}
                      className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-colors flex items-center gap-2 border border-white/20"
                    >
                      <Upload className="w-4 h-4" /> Upload Transcripts
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Metric Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Applications</div>
                  <div className="text-2xl font-black text-navy">{applications.length}</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-brand-orange" />
                    {applications.length === 0 ? "No active applications" : "In progression"}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Document Readiness</div>
                  <div className="text-2xl font-black text-navy">{progressPercent}%</div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-brand-orange h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Visa Compliance</div>
                  <div className="text-2xl font-black text-navy">Ready</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 28-Day Audit Ready
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Travel Ecosystem</div>
                  <div className="text-2xl font-black text-navy">Active</div>
                  <div className="text-xs text-brand-orange font-semibold mt-1 flex items-center gap-1">
                    <Plane className="w-3.5 h-3.5" /> Perks Available
                  </div>
                </div>
              </div>

              {/* 7-Step Milestone Tracker */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-navy">7-Step Admission Roadmap</h2>
                    <p className="text-xs text-slate-500">Your current status along the Dellics pathway</p>
                  </div>
                  <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
                    Step 02: Profile Assessment
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center">
                  {[
                    { step: "01", name: "Consult", done: true },
                    { step: "02", name: "Assess", current: true },
                    { step: "03", name: "Select", done: false },
                    { step: "04", name: "Apply", done: false },
                    { step: "05", name: "Offer", done: false },
                    { step: "06", name: "Visa", done: false },
                    { step: "07", name: "Travel", done: false },
                  ].map((s, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        s.done 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                          : s.current 
                          ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20" 
                          : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}
                    >
                      <span className="text-xs font-black font-mono">{s.step}</span>
                      <span className="text-xs font-bold mt-1">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions & Recent Updates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-brand-orange" />
                    University Applications
                  </h3>
                  {applications.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl p-4">
                      <p className="text-sm text-slate-500 mb-3">No applications logged yet.</p>
                      <button 
                        onClick={() => setShowAddModal(true)}
                        className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover"
                      >
                        + Add your first university target
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {applications.slice(0, 3).map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div>
                            <div className="font-bold text-sm text-slate-900">{app.university}</div>
                            <div className="text-xs text-slate-500">{app.program} · {app.intake}</div>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange">
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                    <Plane className="w-5 h-5 text-brand-orange" />
                    Dellics Travels Integrated Perks
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Student Discount Flights</span>
                      <a href="https://dellicstravels.com" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
                        Book <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Verified Student Accommodation</span>
                      <button onClick={() => setActiveTab("travel")} className="text-xs font-bold text-brand-orange hover:underline">
                        Explore
                      </button>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">Free International eSIM Card</span>
                      <button onClick={() => setActiveTab("travel")} className="text-xs font-bold text-brand-orange hover:underline">
                        Request
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: APPLICATIONS */}
          {/* ========================================================================= */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-display font-bold text-navy">University Applications</h2>
                  <p className="text-sm text-slate-600">Track and manage your university submissions across UK, Canada, USA, and Australia.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-hover transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Application
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-brand-orange" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Applications Added Yet</h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                    Click the button below to add your target university program and start tracking your admission progress.
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 rounded-xl bg-navy text-white font-bold text-sm hover:bg-navy-light transition-colors"
                  >
                    + Add University Target
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group hover:border-brand-orange/40 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                            {app.country}
                          </span>
                          <h3 className="text-lg font-bold text-navy mt-1.5">{app.university}</h3>
                          <p className="text-sm text-slate-600 font-medium">{app.program}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteApplication(app.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                          title="Remove Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Intake: {app.intake}
                        </span>
                        <span className="font-bold px-2.5 py-1 rounded-full bg-brand-orange/15 text-brand-orange">
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: DOCUMENT VAULT */}
          {/* ========================================================================= */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-navy">Document Vault</h2>
                <p className="text-sm text-slate-600">
                  Upload your academic and identification documents. Our admissions officers review each upload for international compliance.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
                {documents.map((doc) => {
                  const isUploaded = doc.status === "Uploaded" || doc.status === "Verified";
                  return (
                    <div key={doc.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isUploaded ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-100 text-slate-400"
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{doc.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Category: {doc.category} {doc.filename ? `· ${doc.filename} (${doc.uploadedAt})` : ""}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          isUploaded
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {doc.status}
                        </span>
                        <button
                          onClick={() => handleUploadDoc(doc.id)}
                          className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {isUploaded ? "Replace" : "Upload File"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: VISA & COMPLIANCE */}
          {/* ========================================================================= */}
          {activeTab === "visa" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-navy">Visa Guidance & Compliance Center</h2>
                <p className="text-sm text-slate-600">
                  Strict regulatory guidance for UKVI, Canada IRCC, US Embassy, and Australian Department of Home Affairs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🇬🇧</span>
                    <h3 className="font-bold text-navy text-lg">UKVI Student Visa Checklist</h3>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>28-Day Holding Period:</strong> Total tuition balance + £9,207 (£12,006 London) held consecutively for 28 days.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>TB Clearance:</strong> Valid Tuberculosis Screening Certificate from the IOM Accra clinic.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>CAS Number:</strong> Official Confirmation of Acceptance for Studies issued by the UK university.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🇨🇦</span>
                    <h3 className="font-bold text-navy text-lg">Canada Study Permit Checklist</h3>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Provincial Attestation Letter (PAL):</strong> Mandatory PAL from the provincial government.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Proof of Funds:</strong> Minimum CAD $20,635+ living allowance plus 1st year tuition payment.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Upfront Medical:</strong> Exam completed with an approved IRCC panel physician in Ghana.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🇺🇸</span>
                    <h3 className="font-bold text-navy text-lg">US Embassy F-1 Visa Checklist</h3>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Form I-20:</strong> Issued by university SEVIS DSO with registered program dates.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>I-901 SEVIS Fee:</strong> Official payment receipt verified prior to visa appointment.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Embassy Interview Coaching:</strong> Rigorous 1-on-1 mock sessions with Dellics advisors.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🇦🇺</span>
                    <h3 className="font-bold text-navy text-lg">Australia Student Subclass 500</h3>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>CoE (Confirmation of Enrolment):</strong> Issued upon deposit payment to Australian institution.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Genuine Student (GS) Criterion:</strong> Comprehensive statement of purpose vetted by Dellics.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>OSHC Health Insurance:</strong> Mandatory health cover for the entire duration of your stay.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: TRAVEL PERKS */}
          {/* ========================================================================= */}
          {activeTab === "travel" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="max-w-2xl mb-8">
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-orange/15 text-brand-orange text-xs font-bold uppercase tracking-wider mb-3">
                    Dellics Travels Ecosystem
                  </span>
                  <h2 className="text-2xl font-display font-bold text-navy mb-2">
                    Exclusive Perks for Education Consult Students
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    As a student of Dellics Education Consult, you enjoy discounted airfares, free extra baggage allowances, guaranteed housing, and airport reception powered by Dellics Travels.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 text-xl">
                        ✈️
                      </div>
                      <h3 className="font-bold text-navy text-lg mb-2">Student Discount Flights</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">
                        Special discounted student airfares to London, Toronto, New York, and Sydney with extra 23kg luggage allowance included.
                      </p>
                    </div>
                    <a
                      href="https://dellicstravels.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition-colors"
                    >
                      Book on Dellics Travels <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 text-xl">
                        🏠
                      </div>
                      <h3 className="font-bold text-navy text-lg mb-2">Verified Student Housing</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">
                        Direct partnerships with university halls of residence and private student accommodation (PBSAs) in the UK, Canada, and Australia.
                      </p>
                    </div>
                    <Link
                      href="/contact?service=accommodation"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover transition-colors"
                    >
                      Request Housing Options
                    </Link>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 text-xl">
                        🚐
                      </div>
                      <h3 className="font-bold text-navy text-lg mb-2">Airport Pickup & Transfer</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">
                        Safe, verified airport pickup upon landing at Heathrow, Pearson Toronto, or JFK directly to your university accommodation.
                      </p>
                    </div>
                    <Link
                      href="/contact?service=airport-pickup"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition-colors"
                    >
                      Book Airport Transfer
                    </Link>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 text-xl">
                        📶
                      </div>
                      <h3 className="font-bold text-navy text-lg mb-2">Free Student eSIM Card</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">
                        Stay connected immediately upon arrival with a pre-activated UK, USA, or European data eSIM delivered to your phone.
                      </p>
                    </div>
                    <Link
                      href="/contact?service=esim"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover transition-colors"
                    >
                      Request Free Student eSIM
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: CHAT WITH ADVISOR */}
          {/* ========================================================================= */}
          {activeTab === "chat" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm">
                    DC
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-navy">Dellics Education Advisory Desk</h3>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Advisor Online · Accra Office
                    </div>
                  </div>
                </div>
                <a href="https://wa.me/233552054174" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-600 hover:underline">
                  Chat on WhatsApp &rarr;
                </a>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] ${
                      msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-navy text-white rounded-tr-none shadow-sm"
                          : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex gap-3">
                <input
                  type="text"
                  placeholder="Type a message or question for your education counsellor..."
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-hover transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD APPLICATION */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy">Add Target University</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  University Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University of Toronto, Oxford, Harvard..."
                  value={newUni}
                  onChange={(e) => setNewUni(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Country Destination
                </label>
                <select
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-orange bg-white"
                >
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="United States">United States</option>
                  <option value="Australia">Australia</option>
                  <option value="Europe">Europe (Germany/France/Netherlands)</option>
                  <option value="Ghana">Ghana</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Desired Program of Study
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MSc Data Science, BSc Nursing, MBA..."
                  value={newProgram}
                  onChange={(e) => setNewProgram(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Intake
                </label>
                <select
                  value={newIntake}
                  onChange={(e) => setNewIntake(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-orange bg-white"
                >
                  <option value="September 2026">September 2026 (Fall)</option>
                  <option value="January 2027">January 2027 (Winter / Spring)</option>
                  <option value="May 2027">May 2027 (Summer)</option>
                  <option value="September 2027">September 2027</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-bold hover:bg-brand-orange-hover transition-colors shadow-sm"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
