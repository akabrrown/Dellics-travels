"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Smartphone,
  Car,
  Search,
  BookOpen,
  Calendar,
  Flame,
  Award,
  Compass,
  ArrowUpRight,
  Sparkles as SparklesBan
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import { 
  CatalogSchool, 
  DEFAULT_CATALOG_SCHOOLS, 
  getLocalCatalogSchools, 
  CATALOG_EVENT_KEY 
} from "@/lib/consult-catalog";

interface AppRecord {
  id: string;
  university: string;
  program: string;
  intake: string;
  country: string;
  status: "Offer Letter Issued" | "Under Review" | "Visa In Progress" | "Enrolled";
  stageStep: number;
  trackingNo: string;
}

export default function StudentPortalPage() {
  const { user } = useAuth();
  const firstName = user?.firstName || "Sam";
  const userEmail = user?.email || "samgotnothingonme@gmail.com";

  const [activeTab, setActiveTab] = useState<"ecosystem" | "applications" | "documents" | "travel_perks" | "counsellor">("ecosystem");
  const [collegeSearch, setCollegeSearch] = useState("");
  const [catalogSchools, setCatalogSchools] = useState<CatalogSchool[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const res = await fetch("/api/catalog");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            if (isMounted) {
              setCatalogSchools(json.data);
              setCatalogLoading(false);
              return;
            }
          }
        }
      } catch {}

      if (isMounted) {
        setCatalogSchools(getLocalCatalogSchools());
        setCatalogLoading(false);
      }
    };

    fetchCatalog();

    const handleUpdate = () => {
      setCatalogSchools(getLocalCatalogSchools());
    };
    window.addEventListener(CATALOG_EVENT_KEY, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener(CATALOG_EVENT_KEY, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const filteredColleges = useMemo(() => {
    if (!collegeSearch.trim()) return catalogSchools;
    const q = collegeSearch.toLowerCase().trim();
    return catalogSchools.filter(school => {
      const matchName = school.name.toLowerCase().includes(q);
      const matchCity = school.city.toLowerCase().includes(q);
      const matchLocation = school.location.toLowerCase().includes(q);
      const matchProg = school.programmes.some(p => p.toLowerCase().includes(q));
      return matchName || matchCity || matchLocation || matchProg;
    });
  }, [catalogSchools, collegeSearch]);
  const [uploadedDocs, setUploadedDocs] = useState([
    { name: "WASSCE Official Results Slip / Certificate", status: "Verified", date: "12 Sep 2026", size: "1.2 MB" },
    { name: "High School Academic Transcript", status: "Verified", date: "14 Sep 2026", size: "2.4 MB" },
    { name: "Ghana International Passport Bio-Data", status: "Verified", date: "15 Sep 2026", size: "900 KB" },
    { name: "Personal Statement of Purpose (SOP)", status: "Approved", date: "18 Sep 2026", size: "350 KB" },
    { name: "Proof of Financial Funds (Bank Statement)", status: "Action Required", date: "Pending 28-day rule", size: "--" }
  ]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocName, setNewDocName] = useState("");

  const applications: AppRecord[] = [
    {
      id: "APP-UK-2026-081",
      university: "University of Manchester",
      program: "BSc Computer Science with Artificial Intelligence",
      intake: "September 2026",
      country: "United Kingdom",
      status: "Offer Letter Issued",
      stageStep: 5,
      trackingNo: "UoM-INTL-99214"
    },
    {
      id: "APP-US-2026-104",
      university: "Northeastern University",
      program: "BSc Software Engineering & Co-op",
      intake: "January 2027",
      country: "United States",
      status: "Under Review",
      stageStep: 4,
      trackingNo: "NEU-UG-44102"
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
    <div className="min-h-screen bg-slate-50">
      {/* 1. DYNAMIC COLLEGE BOARD HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0D3866] to-[#0A2540] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Dynamic Background Ambient Canvas */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-orange/30 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[100px]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-8">
          {/* Header Typography */}
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider border border-brand-orange/30">
              <GraduationCap className="w-4 h-4" /> Dellics Consult & College Board Student Hub
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight">
              Hi, {firstName}
            </h1>
            <p className="text-slate-200 text-lg sm:text-xl font-light leading-relaxed">
              We’re here to guide you on the road to college and beyond.
            </p>
          </div>

          {/* Core College Board / BigFuture Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
            <Link
              href="/portal/sat"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/25 backdrop-blur-md transition-all group flex flex-col justify-between min-h-[96px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-orange">Testing</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-sm font-bold text-white mt-2 leading-snug">My SAT</div>
            </Link>

            <Link
              href="/portal/sat/question-of-the-day"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/25 backdrop-blur-md transition-all group flex flex-col justify-between min-h-[96px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">Daily Practice</span>
                <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-sm font-bold text-white mt-2 leading-snug">SAT Question of the Day</div>
            </Link>

            <Link
              href="/portal/scores"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/25 backdrop-blur-md transition-all group flex flex-col justify-between min-h-[96px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Reports</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-2 leading-snug">
                PSAT/NMSQT, PSAT 10, & PSAT 8/9 Scores
              </div>
            </Link>

            <Link
              href="/portal/ap-classroom"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/25 backdrop-blur-md transition-all group flex flex-col justify-between min-h-[96px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">Coursework</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-sm font-bold text-white mt-2 leading-snug">My AP Classroom</div>
            </Link>

            <Link
              href="/portal/bigfuture"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/25 backdrop-blur-md transition-all group flex flex-col justify-between min-h-[96px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-orange">College & Career</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-2 leading-snug">
                BigFuture Dashboard: College and Career Planning
              </div>
            </Link>

            <Link
              href="/portal/student-search"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/25 backdrop-blur-md transition-all group flex flex-col justify-between min-h-[96px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Outreach</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-sm font-bold text-white mt-2 leading-snug">Student Search Service</div>
            </Link>

            <Link
              href="/portal/profile"
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/25 backdrop-blur-md transition-all group flex flex-col justify-between min-h-[96px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Profile & Security</span>
                <User className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <div className="text-sm font-bold text-white mt-2 leading-snug">Account Settings</div>
            </Link>

            <Link
              href="/portal/onboarding"
              className="p-4 rounded-2xl bg-brand-orange hover:bg-brand-orange-light text-white font-bold transition-all shadow-lg shadow-brand-orange/20 flex flex-col justify-between min-h-[96px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-white/90">Registration</span>
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-bold text-white mt-2 leading-snug">
                {user?.profileCompleted ? "Edit 6-Step Profile" : "Complete Registration Form"}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THREE ANNOUNCEMENT CARDS BELOW HERO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Register for November SAT */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-brand-orange uppercase tracking-wider">Test Deadline</div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                Register by 10/23 for the November SAT
              </h3>
              <Link href="/portal/sat" className="text-xs font-semibold text-navy hover:underline inline-flex items-center gap-1 pt-0.5">
                <span>View Registration Dates</span> &rarr;
              </Link>
            </div>
          </div>

          {/* Card 2: AP Cybersecurity */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Industry Pathway</div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                The AP shaped by leading companies. Meet AP Cybersecurity.
              </h3>
              <Link href="/portal/ap-classroom" className="text-xs font-semibold text-navy hover:underline inline-flex items-center gap-1 pt-0.5">
                <span>Explore AP Framework</span> &rarr;
              </Link>
            </div>
          </div>

          {/* Card 3: Free SAT Study Plan */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Free Preparation</div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                Your Free SAT Study Plan is Ready to Download
              </h3>
              <Link href="/portal/sat/question-of-the-day" className="text-xs font-semibold text-navy hover:underline inline-flex items-center gap-1 pt-0.5">
                <span>Download Study Guide</span> &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BIGFUTURE COLLEGE SEARCH BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#002D62] via-navy to-slate-900 text-white p-8 sm:p-10 border border-slate-700 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-orange bg-brand-orange/20 px-3 py-1 rounded-full">
                BIGFUTURE™ SEARCH
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Find your dream college for you.
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
              Explore university degrees, admission requirements, living costs, and merit scholarships across the United States, United Kingdom, Canada, and Australia.
            </p>

            {/* Search Bar on the Image/Banner */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setShowSearchResults(true);
              }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by college name, major, or country..."
                  value={collegeSearch}
                  onChange={e => {
                    setCollegeSearch(e.target.value);
                    if (!showSearchResults && e.target.value.trim().length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
              <button
                type="submit"
                onClick={() => setShowSearchResults(true)}
                className="py-3 px-6 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-light shadow-md transition-colors text-center cursor-pointer"
              >
                Find Colleges
              </button>
            </form>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden lg:block">
            <div className="w-full h-full flex items-center justify-center">
              <GraduationCap className="w-64 h-64 text-white" />
            </div>
          </div>

          {/* Real-time Dynamic Schools Feed from Admin */}
          {(showSearchResults || collegeSearch.trim().length > 0) && (
            <div className="mt-8 pt-6 border-t border-slate-700/60 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Verified Universities & Programmes</span>
                  <span className="text-xs font-normal text-slate-300">
                    ({filteredColleges.length} Available)
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSearchResults(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Dismiss &times;
                </button>
              </div>

              {catalogLoading || catalogSchools.length === 0 ? (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-slate-300 text-xs font-medium">
                  <div className="size-6 rounded-full border-2 border-brand-orange border-t-transparent animate-spin mx-auto mb-2" />
                  <span>a moment loading school search</span>
                </div>
              ) : filteredColleges.length === 0 ? (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-slate-300 text-xs font-medium">
                  <span>a moment loading school search</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-1">
                  {filteredColleges.map((school) => (
                    <div
                      key={school.id}
                      className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-brand-orange/40 transition-all flex flex-col justify-between text-left space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-orange/20 text-brand-orange">
                            {school.level}
                          </span>
                          <span className="text-xs text-slate-300 font-medium">
                            {school.city}, {school.location}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-white mt-2">
                          {school.name}
                        </h4>

                        <div className="text-xs text-slate-300 mt-1">
                          <strong className="text-slate-200">Programmes:</strong>{" "}
                          {school.programmes.length > 0 ? school.programmes.join(" · ") : "General Admissions"}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                          <span>Tuition: <strong className="text-emerald-400">{school.tuition}</strong></span>
                          <span>App Fee: <strong className="text-white">{school.applicationFee}</strong></span>
                        </div>

                        {/* Exact 7 Badges */}
                        <div className="flex flex-wrap items-center gap-1 pt-2">
                          {school.badges?.highJobDemand && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                              ✓ High Job Demand
                            </span>
                          )}
                          {school.badges?.noVisaCap && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                              ✓ No Visa Cap
                            </span>
                          )}
                          {school.badges?.loans && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                              ✓ Loans
                            </span>
                          )}
                          {school.badges?.prime && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                              ★ Prime
                            </span>
                          )}
                          {school.badges?.top && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                              ★ Top
                            </span>
                          )}
                          {school.badges?.popular && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                              ♥ Popular
                            </span>
                          )}
                          {school.badges?.fastAcceptance && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">
                              ⚡ Fast Acceptance
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Intake: {school.intake || "Sep 2026"}</span>
                        <Link
                          href="/consultation"
                          className="px-3.5 py-1.5 rounded-lg bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-light transition-colors"
                        >
                          Express Interest &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4. DELLICS CONSULT APPLICATION TRACKER & PORTAL TABS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            {[
              { id: "ecosystem", label: "Overview & Quick Tools" },
              { id: "applications", label: "My Applications (2)" },
              { id: "documents", label: "Document Locker" },
              { id: "travel_perks", label: "Dellics Travels Perks" },
              { id: "counsellor", label: "My Advisor" }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-navy text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB: OVERVIEW & QUICK TOOLS */}
          {activeTab === "ecosystem" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Application Card */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">Primary University Offer</span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      Offer Letter Issued
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">University of Manchester</h3>
                    <p className="text-xs text-slate-600 mt-0.5">BSc Computer Science with Artificial Intelligence (Sept 2026)</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono">Ref: UoM-INTL-99214</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("applications")}
                      className="font-bold text-navy hover:text-brand-orange"
                    >
                      View Full Timeline &rarr;
                    </button>
                  </div>
                </div>

                {/* Test Prep Status Card */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">SAT & Test Preparation</span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                      Active Prep
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Daily Question & Diagnostics</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Diagnostic Score: 1340 / 1520 · Targeted Sitting: November 2026</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <Link href="/portal/sat/question-of-the-day" className="font-bold text-brand-orange hover:underline">
                      Answer Today's Question &rarr;
                    </Link>
                    <Link href="/portal/sat" className="font-bold text-navy hover:underline">
                      My SAT Hub &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: APPLICATIONS */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              {applications.map(app => (
                <div key={app.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400">{app.trackingNo}</span>
                      <h4 className="text-lg font-bold text-slate-900">{app.university}</h4>
                      <div className="text-xs text-slate-500">{app.program} · {app.intake}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                      app.status === "Offer Letter Issued"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  {/* 7-Step Milestones */}
                  <div className="grid grid-cols-7 gap-1 text-center pt-2">
                    {[
                      "Advisory", "Shortlist", "Docs", "Apply", "Offer", "Visa", "Arrival"
                    ].map((step, idx) => {
                      const stepNum = idx + 1;
                      const isComplete = stepNum <= app.stageStep;
                      const isCurrent = stepNum === app.stageStep;

                      return (
                        <div key={step} className="space-y-1">
                          <div className={`h-2 rounded-full ${
                            isComplete ? "bg-emerald-500" : isCurrent ? "bg-brand-orange" : "bg-slate-200"
                          }`}></div>
                          <span className={`text-[10px] block ${
                            isComplete ? "text-slate-800 font-bold" : "text-slate-400"
                          }`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Document Locker</h3>
                  <p className="text-xs text-slate-500">Secure cloud storage for official academic transcripts, WAEC slips, and visa records.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="py-2.5 px-4 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Document</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {uploadedDocs.map((doc, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-brand-orange" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{doc.name}</div>
                        <div className="text-[11px] text-slate-400">Added {doc.date} · {doc.size}</div>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      doc.status === "Verified" || doc.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TRAVEL PERKS */}
          {activeTab === "travel_perks" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-navy via-slate-900 to-navy text-white p-8 rounded-2xl relative overflow-hidden">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-bold uppercase tracking-wider mb-4">
                  <Plane className="w-3.5 h-3.5" /> Direct Ecosystem Integration
                </span>
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  Powered by Dellics Travels
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  Every Dellics Education Consult student is entitled to VIP concessions: discounted international airfares, extra baggage allowances (up to 46kg), vetted student housing, and free UK/Canada/US eSIM cards.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/10 border border-white/10 text-xs">
                    <div className="font-bold text-brand-orange mb-1">✈️ Extra Baggage Allowance</div>
                    <p className="text-slate-300">2x 23kg checked bags on British Airways, Qatar Airways, Delta, and KLM for Dellics students.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 border border-white/10 text-xs">
                    <div className="font-bold text-brand-orange mb-1">🏠 Verified Student Housing</div>
                    <p className="text-slate-300">Inspected accommodation options with student lease guarantee and zero booking fees.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: COUNSELLOR */}
          {activeTab === "counsellor" && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-navy text-white flex items-center justify-center font-bold text-xl">
                  KA
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Kofi Asare</h4>
                  <div className="text-xs text-brand-orange font-semibold">Senior Education & Visa Advisor</div>
                  <div className="text-xs text-slate-500">Dellics Education Consult · Tema / Accra</div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="py-2.5 px-5 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition-colors"
                >
                  Schedule 1-on-1 Consultation
                </Link>
                <a
                  href="https://wa.me/233241234567"
                  target="_blank"
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-900 text-lg">Upload Student Document</h3>
            <form onSubmit={handleSimulateUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Document Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WASSCE Certificate / SAT Score PDF"
                  value={newDocName}
                  onChange={e => setNewDocName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-navy"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light"
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
