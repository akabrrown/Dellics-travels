"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  GraduationCap, 
  Building2, 
  Award, 
  Calendar, 
  Compass, 
  ArrowRight, 
  MapPin, 
  CheckCircle2, 
  X, 
  Clock,
  Sparkles
} from "lucide-react";
import {
  CatalogSchool,
  DEFAULT_CATALOG_SCHOOLS,
  getLocalCatalogSchools,
  CATALOG_EVENT_KEY
} from "@/lib/consult-catalog";

interface UniversityItem {
  name: string;
  country: string;
  location: string;
  ranking: string;
  popularCourses: string[];
  intake: string;
  fees: string;
  badges?: CatalogSchool["badges"];
}

interface ScholarshipItem {
  title: string;
  university: string;
  country: string;
  coverage: string;
  deadline: string;
  level: string;
  badges?: CatalogSchool["badges"];
}

interface EventItem {
  title: string;
  date: string;
  time: string;
  format: string;
  description: string;
  spotsLeft: number;
}

const TABS = [
  { id: "courses", label: "Courses", icon: GraduationCap },
  { id: "scholarships", label: "Scholarships", icon: Award },
  { id: "universities", label: "Universities", icon: Building2 },
  { id: "events", label: "Events", icon: Calendar },
  { id: "guide", label: "Guide Me", icon: Compass },
];

const SAMPLE_COURSES = [
  { title: "MSc Advanced Computer Science & AI", uni: "University of Manchester", country: "United Kingdom", duration: "1 Year", fees: "£28,000 / yr", intake: "Sep 2026" },
  { title: "BSc Computer Science (Co-op)", uni: "University of Toronto", country: "Canada", duration: "4 Years", fees: "CAD $42,000 / yr", intake: "Sep 2026" },
  { title: "Master of Public Health (MPH)", uni: "Imperial College London", country: "United Kingdom", duration: "1 Year", fees: "£31,500 / yr", intake: "Sep 2026" },
  { title: "Master of Business Administration (MBA)", uni: "Harvard University", country: "United States", duration: "2 Years", fees: "USD $55,000 / yr", intake: "Sep 2026" },
  { title: "Master of Information Technology", uni: "University of Melbourne", country: "Australia", duration: "2 Years", fees: "AUD $44,000 / yr", intake: "Jul 2026" },
  { title: "BSc Business Administration", uni: "Ashesi University", country: "Ghana", duration: "4 Years", fees: "$8,500 / yr", intake: "Aug 2026" },
];

const SAMPLE_SCHOLARSHIPS: ScholarshipItem[] = [
  { title: "Vice-Chancellor's Excellence Award", university: "University of Manchester", country: "United Kingdom", coverage: "50% Tuition Waiver", deadline: "30 May 2026", level: "Postgraduate" },
  { title: "Lester B. Pearson International Scholarship", university: "University of Toronto", country: "Canada", coverage: "Full Tuition + Living Costs", deadline: "15 Jan 2027", level: "Undergraduate" },
  { title: "Global Leaders Scholarship", university: "Imperial College London", country: "United Kingdom", coverage: "£10,000 Grant", deadline: "15 Jun 2026", level: "Postgraduate" },
  { title: "Melbourne International Undergraduate Scholarship", university: "University of Melbourne", country: "Australia", coverage: "100% or 50% Tuition Fee Remission", deadline: "31 Oct 2026", level: "Undergraduate" },
];

const SAMPLE_UNIVERSITIES: UniversityItem[] = [
  { name: "University of Oxford", country: "United Kingdom", location: "Oxford, England", ranking: "Top 3 Worldwide", popularCourses: ["Law", "Medicine", "Philosophy"], intake: "Oct 2026", fees: "£29,000 - £44,000" },
  { name: "University of Toronto", country: "Canada", location: "Toronto, Ontario", ranking: "No. 1 in Canada", popularCourses: ["Computer Science", "Business"], intake: "Sep 2026 / Jan 2027", fees: "CAD $38,000 - $55,000" },
  { name: "University of Melbourne", country: "Australia", location: "Melbourne, Victoria", ranking: "No. 1 in Australia", popularCourses: ["Data Science", "Biomedicine"], intake: "Feb / Jul 2027", fees: "AUD $36,000 - $48,000" },
  { name: "Harvard University", country: "United States", location: "Cambridge, Massachusetts", ranking: "Ivy League", popularCourses: ["Economics", "Computer Science"], intake: "Aug 2026", fees: "USD $54,000 - $62,000" },
];

const SAMPLE_EVENTS: EventItem[] = [
  { title: "UK & Canada Study Abroad Fair 2026", date: "Saturday, 25 October 2026", time: "10:00 AM - 4:00 PM GMT", format: "In-Person (Accra/Tema)", description: "Meet official admissions representatives from 25+ UK and Canadian universities. Free on-the-spot profile evaluation and spot offers.", spotsLeft: 34 },
  { title: "Visa & Financial Proof Masterclass (UKVI & IRCC)", date: "Wednesday, 4 November 2026", time: "6:00 PM - 7:30 PM GMT", format: "Virtual Webinar", description: "Detailed breakdown of the 28-day fund rule, CAD living cost calculations, and sponsorship evidence.", spotsLeft: 85 },
  { title: "Australia & US Direct Admissions Day", date: "Saturday, 21 November 2026", time: "11:00 AM - 3:00 PM GMT", format: "In-Person (Accra/Tema)", description: "Explore Post-Study Work rights (up to 4 years in Australia and 3-year STEM OPT in the US). Application fee waiver codes distributed.", spotsLeft: 42 },
];

export function HeroSection() {
  const [activeTab, setActiveTab] = useState("courses");
  
  // Search inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [destination, setDestination] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [fundingType, setFundingType] = useState("");

  // Guide wizard state
  const [guideStep, setGuideStep] = useState(1);
  const [guideData, setGuideData] = useState({
    currentLevel: "",
    targetCountry: "",
    desiredField: "",
    budget: "",
    fullName: "",
    phone: "",
    email: ""
  });
  const [guideSubmitted, setGuideSubmitted] = useState(false);

  // Dynamic School Feed from Admin
  const [catalogSchools, setCatalogSchools] = useState<CatalogSchool[]>([]);

  useEffect(() => {
    const loadFeed = () => {
      setCatalogSchools(getLocalCatalogSchools());
    };
    loadFeed();

    if (typeof window !== "undefined") {
      window.addEventListener(CATALOG_EVENT_KEY, loadFeed);
      window.addEventListener("storage", loadFeed);
      return () => {
        window.removeEventListener(CATALOG_EVENT_KEY, loadFeed);
        window.removeEventListener("storage", loadFeed);
      };
    }
  }, []);

  const activeSchools = useMemo(() => {
    return catalogSchools.length > 0 ? catalogSchools : DEFAULT_CATALOG_SCHOOLS;
  }, [catalogSchools]);

  // Destination matcher helper
  const matchesDestination = (country: string, code: string) => {
    if (!code || code === "all") return true;
    const c = country.toLowerCase();
    if (code === "UK") return c.includes("united kingdom") || c.includes("uk") || c.includes("england") || c.includes("scotland");
    if (code === "CA") return c.includes("canada") || c.includes("ontario") || c.includes("toronto");
    if (code === "US") return c.includes("united states") || c.includes("usa") || c.includes("us") || c.includes("america");
    if (code === "AU") return c.includes("australia") || c.includes("melbourne") || c.includes("sydney");
    if (code === "GH") return c.includes("ghana") || c.includes("accra") || c.includes("berekuso");
    if (code === "EU") return c.includes("europe") || c.includes("germany") || c.includes("france") || c.includes("netherlands") || c.includes("ireland");
    return c.includes(code.toLowerCase());
  };

  // Level matcher helper
  const matchesStudyLevel = (schoolLevel: string, levelCode: string) => {
    if (!levelCode || levelCode === "all") return true;
    const s = schoolLevel.toLowerCase();
    const l = levelCode.toLowerCase();
    if (l === "undergraduate") return s.includes("undergraduate");
    if (l === "postgraduate") return s.includes("postgraduate");
    if (l === "phd") return s.includes("postgraduate") || s.includes("phd") || s.includes("doctorate");
    if (l === "foundation") return s.includes("foundation") || s.includes("undergraduate");
    return true;
  };

  // Matched dynamic courses
  const matchedCourses = useMemo(() => {
    const list: any[] = [];
    activeSchools.forEach(school => {
      if (!matchesDestination(school.location, destination)) return;
      if (!matchesStudyLevel(school.level, studyLevel)) return;

      school.programmes.forEach(prog => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchProg = prog.toLowerCase().includes(q);
          const matchUni = school.name.toLowerCase().includes(q);
          const matchCity = school.city.toLowerCase().includes(q);
          if (!matchProg && !matchUni && !matchCity) return;
        }

        list.push({
          title: prog,
          uni: school.name,
          country: school.location,
          city: school.city,
          duration: school.level.toLowerCase().includes("undergraduate") && !school.level.toLowerCase().includes("postgraduate") ? "3 - 4 Years" : "1 - 2 Years",
          fees: school.tuition,
          intake: school.intake || "Sep 2026",
          badges: school.badges
        });
      });
    });
    return list.length > 0 ? list : SAMPLE_COURSES;
  }, [activeSchools, destination, studyLevel, searchQuery]);

  // Matched dynamic scholarships
  const matchedScholarships = useMemo(() => {
    const list: any[] = [];
    activeSchools.forEach(school => {
      if (!matchesDestination(school.location, destination)) return;
      if (!matchesStudyLevel(school.level, studyLevel)) return;

      if (school.scholarshipCoverage) {
        list.push({
          title: `${school.name} Merit & International Award`,
          university: school.name,
          country: school.location,
          coverage: school.scholarshipCoverage,
          deadline: "Rolling / 30 Jun 2026",
          level: school.level,
          badges: school.badges
        });
      }
    });
    return list.length > 0 ? list : SAMPLE_SCHOLARSHIPS;
  }, [activeSchools, destination, studyLevel]);

  // Matched dynamic universities
  const matchedUniversities = useMemo(() => {
    const res = activeSchools
      .filter(school => {
        if (!matchesDestination(school.location, destination)) return false;
        if (!matchesStudyLevel(school.level, studyLevel)) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = school.name.toLowerCase().includes(q);
          const matchCity = school.city.toLowerCase().includes(q);
          const matchProg = school.programmes.some(p => p.toLowerCase().includes(q));
          if (!matchName && !matchCity && !matchProg) return false;
        }
        return true;
      })
      .map(s => ({
        id: s.id,
        name: s.name,
        country: s.location,
        location: `${s.city}, ${s.location}`,
        ranking: s.ranking || (s.badges?.top ? "Top Tier Institution" : "Verified Partner"),
        popularCourses: s.programmes.slice(0, 3),
        intake: s.intake || "Sep 2026",
        fees: s.tuition,
        badges: s.badges
      }));
    return res.length > 0 ? res : SAMPLE_UNIVERSITIES;
  }, [activeSchools, destination, studyLevel, searchQuery]);

  // Results Modal State
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "courses") setModalTitle("Matched University Courses");
    else if (activeTab === "scholarships") setModalTitle("Matched Scholarships & Grants");
    else if (activeTab === "universities") setModalTitle("Matched Partner Universities");
    else if (activeTab === "events") setModalTitle("Upcoming Education Fairs & Webinars");
    setShowResultsModal(true);
  };

  const handleGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGuideSubmitted(true);
    try {
      if (guideData.email) localStorage.setItem("dellics_user_email", guideData.email);
      if (guideData.fullName) localStorage.setItem("dellics_user_name", guideData.fullName);
    } catch (err) {}
  };

  return (
    <section 
      aria-label="Dellics Education Consult Hero"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 border-b border-slate-800 bg-slate-950 min-h-[760px] flex items-center"
    >
      {/* 1. BACKGROUND VIDEO - Main_herosection.mp4 */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Main_herosection.mp4" type="video/mp4" />
        </video>

        {/* Multi-stage calibrated overlay for maximum readability & premium contrast */}
        <div className="absolute inset-0 z-10 bg-slate-950/65 backdrop-blur-[1px]" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/40" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/85 via-transparent to-slate-950/90" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 w-full space-y-8 sm:space-y-10">
        
        {/* Top Typography & Call To Actions */}
        <div className="max-w-4xl text-left space-y-5">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-brand-orange/40 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Ghana’s Trusted Partner for International Education
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight">
            Dellics <span className="text-brand-orange">Education Consult</span>
          </h1>

          <p className="text-brand-orange-light text-base sm:text-lg lg:text-xl font-medium italic max-w-2xl">
            &ldquo;Guiding Futures. Building Global Success.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/consultation"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange-light text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-orange/30 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/destinations"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all text-center"
            >
              <span>Explore Destinations</span>
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/10 transition-all text-center"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>

        {/* Central Search & Filter Container (TRANSPARENT FROSTED GLASS WIDGET BOX) */}
        <div className="w-full max-w-5xl shrink-0 mx-auto">
          <div className="bg-slate-950/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 text-left">
              
            {/* Category Tabs (Courses, Scholarships, Universities, Events, Guide Me) */}
            <div className="overflow-x-auto scrollbar-none flex sm:grid sm:grid-cols-5 bg-white/5 border-b border-white/15">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setGuideSubmitted(false);
                    }}
                    className={`flex-1 min-w-[76px] sm:min-w-0 flex flex-col items-center justify-center gap-1.5 py-3 sm:py-4 px-2 text-[11px] sm:text-xs md:text-sm font-semibold transition-all relative ${
                      isActive 
                        ? "text-brand-orange bg-white/10 shadow-sm font-bold backdrop-blur-md" 
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "text-brand-orange" : "text-slate-300"}`} />
                    <span className="truncate">{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-brand-orange rounded-t-full shadow-lg shadow-brand-orange/50"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Form Content Area */}
            <div className="p-6 md:p-8">
              
              {/* 1. COURSES TAB */}
              {activeTab === "courses" && (
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6">
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                        Course or Subject
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="text" 
                          placeholder="e.g. Data Science, Nursing, MBA, Law..."
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white placeholder-slate-400 backdrop-blur-md"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                        Study Level
                      </label>
                      <select 
                        value={studyLevel}
                        onChange={(e) => setStudyLevel(e.target.value)}
                        className="w-full px-3 py-3 bg-slate-900/90 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white backdrop-blur-md"
                      >
                        <option value="" className="bg-slate-900 text-white">All Levels</option>
                        <option value="undergraduate" className="bg-slate-900 text-white">Undergraduate (Bachelor's)</option>
                        <option value="postgraduate" className="bg-slate-900 text-white">Postgraduate (Master's)</option>
                        <option value="phd" className="bg-slate-900 text-white">PhD / Doctorate</option>
                        <option value="foundation" className="bg-slate-900 text-white">Pre-Master's / Foundation</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                        Destination
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        <select 
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white backdrop-blur-md"
                        >
                          <option value="" className="bg-slate-900 text-white">Any Country</option>
                          <option value="UK" className="bg-slate-900 text-white">United Kingdom</option>
                          <option value="CA" className="bg-slate-900 text-white">Canada</option>
                          <option value="US" className="bg-slate-900 text-white">United States</option>
                          <option value="AU" className="bg-slate-900 text-white">Australia</option>
                          <option value="EU" className="bg-slate-900 text-white">Europe</option>
                          <option value="GH" className="bg-slate-900 text-white">Ghana</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                    <div className="text-xs text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Accredited programs with Post-Study Work rights included
                    </div>
                    <button 
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-light transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/30 cursor-pointer"
                    >
                      Search Courses
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* 2. SCHOLARSHIPS TAB */}
              {activeTab === "scholarships" && (
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                        Target Country
                      </label>
                      <select 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-3 py-3 bg-slate-900/90 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white backdrop-blur-md"
                      >
                        <option value="" className="bg-slate-900 text-white">All Destinations</option>
                        <option value="UK" className="bg-slate-900 text-white">United Kingdom (Chevening, Commonwealth)</option>
                        <option value="CA" className="bg-slate-900 text-white">Canada (Vanier, Institutional)</option>
                        <option value="US" className="bg-slate-900 text-white">United States (Fulbright, Merit)</option>
                        <option value="AU" className="bg-slate-900 text-white">Australia (Australia Awards, Research)</option>
                        <option value="EU" className="bg-slate-900 text-white">Europe (DAAD, Erasmus+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                        Degree Level
                      </label>
                      <select 
                        value={studyLevel}
                        onChange={(e) => setStudyLevel(e.target.value)}
                        className="w-full px-3 py-3 bg-slate-900/90 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white backdrop-blur-md"
                      >
                        <option value="" className="bg-slate-900 text-white">Undergraduate & Postgraduate</option>
                        <option value="undergraduate" className="bg-slate-900 text-white">Undergraduate</option>
                        <option value="postgraduate" className="bg-slate-900 text-white">Master's / Postgraduate</option>
                        <option value="phd" className="bg-slate-900 text-white">PhD / Doctoral Fellowship</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                        Funding Coverage
                      </label>
                      <select 
                        value={fundingType}
                        onChange={(e) => setFundingType(e.target.value)}
                        className="w-full px-3 py-3 bg-slate-900/90 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white backdrop-blur-md"
                      >
                        <option value="" className="bg-slate-900 text-white">Any Coverage</option>
                        <option value="full" className="bg-slate-900 text-white">100% Full Tuition + Living Stipend</option>
                        <option value="partial" className="bg-slate-900 text-white">50% - 75% Tuition Discount</option>
                        <option value="grant" className="bg-slate-900 text-white">Fixed Grants (£5,000 - £10,000)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                    <div className="text-xs text-slate-300">
                      Over 250+ university scholarship schemes verified for Ghanaian students
                    </div>
                    <button 
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-light transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/30 cursor-pointer"
                    >
                      Find Scholarships
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* 3. UNIVERSITIES TAB */}
              {activeTab === "universities" && (
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                        Search by University Name or City
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="text" 
                          placeholder="e.g. Oxford, Toronto, Manchester, Melbourne..."
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white placeholder-slate-400 backdrop-blur-md"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                        Country
                      </label>
                      <select 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-3 py-3 bg-slate-900/90 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white backdrop-blur-md"
                      >
                        <option value="" className="bg-slate-900 text-white">Worldwide</option>
                        <option value="UK" className="bg-slate-900 text-white">United Kingdom</option>
                        <option value="CA" className="bg-slate-900 text-white">Canada</option>
                        <option value="US" className="bg-slate-900 text-white">United States</option>
                        <option value="AU" className="bg-slate-900 text-white">Australia</option>
                        <option value="EU" className="bg-slate-900 text-white">Europe</option>
                        <option value="GH" className="bg-slate-900 text-white">Ghana</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                    <div className="text-xs text-slate-300">
                      Official partnership status with top Russell Group & U15 institutions
                    </div>
                    <button 
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-light transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/30 cursor-pointer"
                    >
                      Explore Universities
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* 4. EVENTS TAB */}
              {activeTab === "events" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {SAMPLE_EVENTS.map((evt, idx) => (
                      <div key={idx} className="bg-white/10 p-4 rounded-2xl border border-white/15 flex flex-col justify-between backdrop-blur-md">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                            {evt.format}
                          </span>
                          <h4 className="font-bold text-white text-sm mt-2 mb-1 line-clamp-2">{evt.title}</h4>
                          <p className="text-xs text-slate-300 flex items-center gap-1 mb-2">
                            <Clock className="w-3.5 h-3.5 text-brand-orange" /> {evt.date} · {evt.time}
                          </p>
                          <p className="text-xs text-slate-300 line-clamp-2">{evt.description}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[11px] text-emerald-400 font-semibold">{evt.spotsLeft} seats left</span>
                          <button
                            onClick={() => {
                              setModalTitle(`Register: ${evt.title}`);
                              setShowResultsModal(true);
                            }}
                            className="text-xs font-bold text-brand-orange hover:text-brand-orange-light transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            Free Pass &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center pt-2">
                    <button 
                      onClick={() => {
                        setModalTitle("All Upcoming Education Events");
                        setShowResultsModal(true);
                      }}
                      className="text-xs font-bold text-brand-orange hover:underline cursor-pointer"
                    >
                      View Full 2026/2027 Event Calendar &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* 5. GUIDE ME WIZARD TAB */}
              {activeTab === "guide" && (
                <div>
                  {!guideSubmitted ? (
                    <form onSubmit={handleGuideSubmit} className="space-y-4">
                      {guideStep === 1 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-white">Step 1 of 2: Your Academic Profile</h3>
                            <span className="text-xs text-slate-300 font-medium">Quick 2-minute matching</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                                Current Education Level
                              </label>
                              <select 
                                value={guideData.currentLevel}
                                onChange={(e) => setGuideData({ ...guideData, currentLevel: e.target.value })}
                                className="w-full px-3 py-3 bg-slate-900/90 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white backdrop-blur-md"
                              >
                                <option value="" className="bg-slate-900 text-white">Select Current Education</option>
                                <option value="WASSCE / High School" className="bg-slate-900 text-white">WASSCE / High School Graduate</option>
                                <option value="Bachelor's Degree" className="bg-slate-900 text-white">Bachelor's Degree Holder</option>
                                <option value="HND / Diploma" className="bg-slate-900 text-white">HND / Diploma Holder</option>
                                <option value="Master's Degree" className="bg-slate-900 text-white">Master's Degree Holder</option>
                                <option value="Working Professional" className="bg-slate-900 text-white">Working Professional</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                                Desired Field of Study
                              </label>
                              <select 
                                value={guideData.desiredField}
                                onChange={(e) => setGuideData({ ...guideData, desiredField: e.target.value })}
                                className="w-full px-3 py-3 bg-slate-900/90 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white backdrop-blur-md"
                              >
                                <option value="" className="bg-slate-900 text-white">Select Desired Field</option>
                                <option value="Computer Science & IT" className="bg-slate-900 text-white">Computer Science & IT / AI</option>
                                <option value="Nursing & Public Health" className="bg-slate-900 text-white">Nursing & Public Health</option>
                                <option value="Business Administration & MBA" className="bg-slate-900 text-white">Business Administration & MBA</option>
                                <option value="Engineering & Architecture" className="bg-slate-900 text-white">Engineering & Architecture</option>
                                <option value="Law & International Relations" className="bg-slate-900 text-white">Law & International Relations</option>
                                <option value="Data Analytics & Finance" className="bg-slate-900 text-white">Data Analytics & Finance</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                                Preferred Country
                              </label>
                              <select 
                                value={guideData.targetCountry}
                                onChange={(e) => setGuideData({ ...guideData, targetCountry: e.target.value })}
                                className="w-full px-3 py-3 bg-slate-900/90 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white backdrop-blur-md"
                              >
                                <option value="" className="bg-slate-900 text-white">Select Preferred Country</option>
                                <option value="United Kingdom" className="bg-slate-900 text-white">United Kingdom</option>
                                <option value="Canada" className="bg-slate-900 text-white">Canada</option>
                                <option value="United States" className="bg-slate-900 text-white">United States</option>
                                <option value="Australia" className="bg-slate-900 text-white">Australia</option>
                                <option value="Europe" className="bg-slate-900 text-white">Europe (Germany/Netherlands)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                                Estimated Annual Budget
                              </label>
                              <select 
                                value={guideData.budget}
                                onChange={(e) => setGuideData({ ...guideData, budget: e.target.value })}
                                className="w-full px-3 py-3 bg-slate-900/90 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white backdrop-blur-md"
                              >
                                <option value="" className="bg-slate-900 text-white">Select Budget</option>
                                <option value="Under $15,000 / year" className="bg-slate-900 text-white">Under $15,000 / year (Seeking Affordable/Grants)</option>
                                <option value="$15,000 - $25,000 / year" className="bg-slate-900 text-white">$15,000 - $25,000 / year</option>
                                <option value="$25,000 - $40,000 / year" className="bg-slate-900 text-white">$25,000 - $40,000 / year</option>
                                <option value="$40,000+ / year" className="bg-slate-900 text-white">$40,000+ / year (Tier 1 Global)</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => setGuideStep(2)}
                              className="px-6 py-3 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-light transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-brand-orange/30"
                            >
                              Next: Contact for Shortlist &rarr;
                            </button>
                          </div>
                        </div>
                      )}

                      {guideStep === 2 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-white">Step 2 of 2: Where Should We Send Your Matched List?</h3>
                            <button 
                              type="button" 
                              onClick={() => setGuideStep(1)} 
                              className="text-xs text-brand-orange hover:underline font-semibold cursor-pointer"
                            >
                              &larr; Back to Step 1
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                                Full Name
                              </label>
                              <input 
                                type="text"
                                required
                                placeholder="Kwame Mensah"
                                value={guideData.fullName}
                                onChange={(e) => setGuideData({ ...guideData, fullName: e.target.value })}
                                className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white placeholder-slate-400 backdrop-blur-md"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                                Email Address
                              </label>
                              <input 
                                type="email"
                                required
                                placeholder="kwame@example.com"
                                value={guideData.email}
                                onChange={(e) => setGuideData({ ...guideData, email: e.target.value })}
                                className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white placeholder-slate-400 backdrop-blur-md"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                                WhatsApp / Phone
                              </label>
                              <input 
                                type="tel"
                                required
                                placeholder="+233 55 205 4174"
                                value={guideData.phone}
                                onChange={(e) => setGuideData({ ...guideData, phone: e.target.value })}
                                className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-white placeholder-slate-400 backdrop-blur-md"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                            <div className="text-xs text-slate-300">
                              Matched with {guideData.targetCountry || "global"} options in {guideData.desiredField || "your chosen field"}
                            </div>
                            <button 
                              type="submit"
                              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-light transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/30 cursor-pointer"
                            >
                              View My Matched Programs
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </form>
                  ) : (
                    <div className="text-center py-6 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Your Tailored University Shortlist is Ready!</h3>
                      <p className="text-sm text-slate-200 max-w-md mx-auto">
                        Based on your background ({guideData.currentLevel || "High School/Degree"}), interest in <strong>{guideData.desiredField || "Higher Education"}</strong> in <strong>{guideData.targetCountry || "Abroad"}</strong>, our counsellors have generated recommended programs.
                      </p>
                      <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                        <Link 
                          href="/portal"
                          className="px-6 py-3 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-light transition-colors shadow-lg shadow-brand-orange/30"
                        >
                          Open Student Portal &rarr;
                        </Link>
                        <Link 
                          href="/consultation"
                          className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-colors backdrop-blur-md"
                        >
                          Book Advisor Session
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LIVE SEARCH & FILTER RESULTS MODAL */}
      {/* ========================================================================= */}
      {showResultsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-white/15">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Live System Directory</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{modalTitle}</h3>
              </div>
              <button 
                onClick={() => setShowResultsModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List based on active tab */}
            {activeTab === "courses" && (
              <div className="space-y-4">
                {matchedCourses.length === 0 ? (
                  <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-slate-300 text-xs">
                    No courses matched your specific filters. Try searching by subject or choosing "All Destinations".
                  </div>
                ) : (
                  matchedCourses.map((course, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-orange/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-brand-orange uppercase">
                          <span>{course.country}</span>
                          <span>·</span>
                          <span>{course.duration}</span>
                          <span>·</span>
                          <span className="text-emerald-400">{course.intake}</span>
                          {course.badges?.fastAcceptance && (
                            <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] normal-case">
                              ⚡ Fast Acceptance
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">{course.title}</h4>
                        <div className="text-xs text-slate-300 mt-0.5">{course.uni} · <span className="font-semibold text-white">{course.fees}</span></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link 
                          href="/signup"
                          className="px-4 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-light transition-colors whitespace-nowrap shadow-sm"
                        >
                          Apply Now
                        </Link>
                        <Link 
                          href="/consultation"
                          className="px-4 py-2 rounded-xl border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-colors whitespace-nowrap"
                        >
                          Enquire
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "scholarships" && (
              <div className="space-y-4">
                {matchedScholarships.length === 0 ? (
                  <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-slate-300 text-xs">
                    No verified scholarship schemes found for this destination. Contact our counsellors for tailored funding opportunities.
                  </div>
                ) : (
                  matchedScholarships.map((sch, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-orange/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-brand-orange uppercase">
                          <Award className="w-3.5 h-3.5" />
                          <span>{sch.coverage}</span>
                          <span>·</span>
                          <span>{sch.country}</span>
                          {sch.badges?.noVisaCap && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] normal-case">
                              No Visa Cap
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">{sch.title}</h4>
                        <div className="text-xs text-slate-300 mt-0.5">
                          {sch.university} · Deadline: <span className="font-semibold text-rose-400">{sch.deadline}</span>
                        </div>
                      </div>
                      <Link 
                        href="/consultation"
                        className="px-4 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-light transition-colors whitespace-nowrap text-center"
                      >
                        Check Eligibility
                      </Link>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "universities" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchedUniversities.length === 0 ? (
                  <div className="col-span-2 p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-slate-300 text-xs">
                    No partner universities matched your query. Contact us to enquire about additional global partnerships.
                  </div>
                ) : (
                  matchedUniversities.map((uni, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-brand-orange uppercase">{uni.country}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">{uni.ranking}</span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-2">{uni.name}</h4>
                        <p className="text-xs text-slate-300">{uni.location}</p>
                        <div className="mt-2 text-xs text-slate-400">
                          <strong className="text-slate-200">Key faculties:</strong> {uni.popularCourses.join(", ")}
                        </div>

                        {/* Badges */}
                        {uni.badges && (
                          <div className="flex flex-wrap items-center gap-1 pt-2">
                            {uni.badges.highJobDemand && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                                High Job Demand
                              </span>
                            )}
                            {uni.badges.noVisaCap && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                                No Visa Cap
                              </span>
                            )}
                            {uni.badges.loans && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                                Loans
                              </span>
                            )}
                            {uni.badges.prime && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                                Prime
                              </span>
                            )}
                            {uni.badges.top && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                                Top Tier
                              </span>
                            )}
                            {uni.badges.popular && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                                Popular
                              </span>
                            )}
                            {uni.badges.fastAcceptance && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">
                                Fast Acceptance
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-orange">{uni.fees}</span>
                        <Link 
                          href="/consultation"
                          className="text-xs font-bold text-white hover:text-brand-orange transition-colors"
                        >
                          Book Placement &rarr;
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "events" && (
              <div className="space-y-4">
                {SAMPLE_EVENTS.map((evt, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-brand-orange uppercase">{evt.format} · {evt.date}</span>
                      <h4 className="text-base font-bold text-white mt-1">{evt.title}</h4>
                      <p className="text-xs text-slate-300 mt-1">{evt.description}</p>
                    </div>
                    <Link
                      href="/consultation"
                      className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-light transition-colors whitespace-nowrap text-center shadow-sm"
                    >
                      Reserve Free Seat
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">Need personal guidance from an assigned counsellor?</span>
              <div className="flex gap-2">
                <Link
                  href="/consultation"
                  className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-light transition-colors"
                >
                  Book 1-on-1 Consultation
                </Link>
                <button
                  onClick={() => setShowResultsModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/20 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
