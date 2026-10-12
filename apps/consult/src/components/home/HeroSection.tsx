"use client";

import { useState } from "react";
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
  Clock
} from "lucide-react";

interface UniversityItem {
  name: string;
  country: string;
  location: string;
  ranking: string;
  popularCourses: string[];
  intake: string;
  fees: string;
}

interface ScholarshipItem {
  title: string;
  university: string;
  country: string;
  coverage: string;
  deadline: string;
  level: string;
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
    currentLevel: "WASSCE / High School",
    targetCountry: "United Kingdom",
    desiredField: "Computer Science & IT",
    budget: "$20,000 - $35,000 / year",
    fullName: "",
    phone: "",
    email: ""
  });
  const [guideSubmitted, setGuideSubmitted] = useState(false);

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
    <section className="bg-navy pt-32 pb-24 border-b border-navy-light relative overflow-hidden min-h-[640px] flex items-center">
      {/* Background Campus Video with Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          poster="/images/services/photo-10-2026-07-22-15-35-17.jpg"
          className="w-full h-full object-cover opacity-25 scale-105 transition-transform duration-1000"
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/95 via-navy/85 to-navy/95 backdrop-blur-[1px]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center justify-center text-center gap-10">
          
          {/* Header Typography */}
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4 border border-brand-orange/30">
              <GraduationCap className="w-3.5 h-3.5" /> Ghana's Premier International Education Consult
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight">
              Your Gateway to a <span className="text-brand-orange">World-Class Degree</span>.
            </h1>
            <p className="mt-4 text-slate-300 text-base md:text-lg max-w-3xl mx-auto font-light leading-relaxed">
              Direct university placements, accredited scholarships, IELTS guidance, and visa compliance for the UK, Canada, USA, and Australia - fully integrated with Dellics Travels.
            </p>
          </div>

          {/* Central IDP/Edvoy-Style Search & Filter Container */}
          <div className="w-full max-w-4xl shrink-0 mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 text-left">
              
              {/* Category Tabs (Courses, Scholarships, Universities, Events, Guide Me) */}
              <div className="grid grid-cols-5 bg-slate-50 border-b border-slate-200">
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
                      className={`flex flex-col items-center justify-center gap-1.5 py-3.5 sm:py-4 px-2 text-xs sm:text-sm font-semibold transition-all relative ${
                        isActive 
                          ? "text-navy bg-white shadow-sm font-bold" 
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
                      }`}
                    >
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "text-brand-orange" : "text-slate-400"}`} />
                      <span className="truncate">{tab.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-brand-orange rounded-t-full"></span>
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
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Course or Subject
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="e.g. Data Science, Nursing, MBA, Law..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Study Level
                        </label>
                        <select 
                          value={studyLevel}
                          onChange={(e) => setStudyLevel(e.target.value)}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                        >
                          <option value="">All Levels</option>
                          <option value="undergraduate">Undergraduate (Bachelor's)</option>
                          <option value="postgraduate">Postgraduate (Master's)</option>
                          <option value="phd">PhD / Doctorate</option>
                          <option value="foundation">Pre-Master's / Foundation</option>
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Destination
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select 
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                          >
                            <option value="">Any Country</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="US">United States</option>
                            <option value="AU">Australia</option>
                            <option value="EU">Europe</option>
                            <option value="GH">Ghana</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Accredited programs with Post-Study Work rights included
                      </div>
                      <button 
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-hover transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20"
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
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Target Country
                        </label>
                        <select 
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                        >
                          <option value="">All Destinations</option>
                          <option value="UK">United Kingdom (Chevening, Commonwealth)</option>
                          <option value="CA">Canada (Vanier, Institutional)</option>
                          <option value="US">United States (Fulbright, Merit)</option>
                          <option value="AU">Australia (Australia Awards, Research)</option>
                          <option value="EU">Europe (DAAD, Erasmus+)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Degree Level
                        </label>
                        <select 
                          value={studyLevel}
                          onChange={(e) => setStudyLevel(e.target.value)}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                        >
                          <option value="">Undergraduate & Postgraduate</option>
                          <option value="undergraduate">Undergraduate</option>
                          <option value="postgraduate">Master's / Postgraduate</option>
                          <option value="phd">PhD / Doctoral Fellowship</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Funding Coverage
                        </label>
                        <select 
                          value={fundingType}
                          onChange={(e) => setFundingType(e.target.value)}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                        >
                          <option value="">Any Coverage</option>
                          <option value="full">100% Full Tuition + Living Stipend</option>
                          <option value="partial">50% - 75% Tuition Discount</option>
                          <option value="grant">Fixed Grants (£5,000 - £10,000)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                      <div className="text-xs text-slate-500">
                        Over 250+ university scholarship schemes verified for Ghanaian students
                      </div>
                      <button 
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-hover transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20"
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
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Search by University Name or City
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="e.g. Oxford, Toronto, Manchester, Melbourne..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Country
                        </label>
                        <select 
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                        >
                          <option value="">Worldwide</option>
                          <option value="UK">United Kingdom</option>
                          <option value="CA">Canada</option>
                          <option value="US">United States</option>
                          <option value="AU">Australia</option>
                          <option value="EU">Europe</option>
                          <option value="GH">Ghana</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                      <div className="text-xs text-slate-500">
                        Official partnership status with top Russell Group & U15 institutions
                      </div>
                      <button 
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-hover transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20"
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
                        <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-brand-orange/15 text-brand-orange">
                              {evt.format}
                            </span>
                            <h4 className="font-bold text-slate-900 text-sm mt-2 mb-1 line-clamp-2">{evt.title}</h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                              <Clock className="w-3.5 h-3.5" /> {evt.date} · {evt.time}
                            </p>
                            <p className="text-xs text-slate-600 line-clamp-2">{evt.description}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                            <span className="text-[11px] text-emerald-600 font-semibold">{evt.spotsLeft} seats left</span>
                            <button
                              onClick={() => {
                                setModalTitle(`Register: ${evt.title}`);
                                setShowResultsModal(true);
                              }}
                              className="text-xs font-bold text-navy hover:text-brand-orange transition-colors flex items-center gap-1"
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
                        className="text-xs font-bold text-brand-orange hover:underline"
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
                              <h3 className="text-sm font-bold text-slate-900">Step 1 of 2: Your Academic Profile</h3>
                              <span className="text-xs text-slate-500 font-medium">Quick 2-minute matching</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                  Current Education Level
                                </label>
                                <select 
                                  value={guideData.currentLevel}
                                  onChange={(e) => setGuideData({ ...guideData, currentLevel: e.target.value })}
                                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                                >
                                  <option value="WASSCE / High School">WASSCE / High School Graduate</option>
                                  <option value="Bachelor's Degree">Bachelor's Degree Holder</option>
                                  <option value="HND / Diploma">HND / Diploma Holder</option>
                                  <option value="Master's Degree">Master's Degree Holder</option>
                                  <option value="Working Professional">Working Professional</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                  Desired Field of Study
                                </label>
                                <select 
                                  value={guideData.desiredField}
                                  onChange={(e) => setGuideData({ ...guideData, desiredField: e.target.value })}
                                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                                >
                                  <option value="Computer Science & IT">Computer Science & IT / AI</option>
                                  <option value="Nursing & Public Health">Nursing & Public Health</option>
                                  <option value="Business Administration & MBA">Business Administration & MBA</option>
                                  <option value="Engineering & Architecture">Engineering & Architecture</option>
                                  <option value="Law & International Relations">Law & International Relations</option>
                                  <option value="Data Analytics & Finance">Data Analytics & Finance</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                  Preferred Country
                                </label>
                                <select 
                                  value={guideData.targetCountry}
                                  onChange={(e) => setGuideData({ ...guideData, targetCountry: e.target.value })}
                                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                                >
                                  <option value="United Kingdom">United Kingdom</option>
                                  <option value="Canada">Canada</option>
                                  <option value="United States">United States</option>
                                  <option value="Australia">Australia</option>
                                  <option value="Europe">Europe (Germany/Netherlands)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                  Estimated Annual Budget
                                </label>
                                <select 
                                  value={guideData.budget}
                                  onChange={(e) => setGuideData({ ...guideData, budget: e.target.value })}
                                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                                >
                                  <option value="Under $15,000 / year">Under $15,000 / year (Seeking Affordable/Grants)</option>
                                  <option value="$15,000 - $25,000 / year">$15,000 - $25,000 / year</option>
                                  <option value="$25,000 - $40,000 / year">$25,000 - $40,000 / year</option>
                                  <option value="$40,000+ / year">$40,000+ / year (Tier 1 Global)</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex justify-end pt-2">
                              <button
                                type="button"
                                onClick={() => setGuideStep(2)}
                                className="px-6 py-3 rounded-xl bg-navy text-white font-bold text-sm hover:bg-navy-light transition-colors flex items-center gap-2"
                              >
                                Next: Contact for Shortlist &rarr;
                              </button>
                            </div>
                          </div>
                        )}

                        {guideStep === 2 && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-slate-900">Step 2 of 2: Where Should We Send Your Matched List?</h3>
                              <button 
                                type="button" 
                                onClick={() => setGuideStep(1)} 
                                className="text-xs text-brand-orange hover:underline font-semibold"
                              >
                                &larr; Back to Step 1
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                  Full Name
                                </label>
                                <input 
                                  type="text"
                                  required
                                  placeholder="Kwame Mensah"
                                  value={guideData.fullName}
                                  onChange={(e) => setGuideData({ ...guideData, fullName: e.target.value })}
                                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                  Email Address
                                </label>
                                <input 
                                  type="email"
                                  required
                                  placeholder="kwame@example.com"
                                  value={guideData.email}
                                  onChange={(e) => setGuideData({ ...guideData, email: e.target.value })}
                                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                  WhatsApp / Phone
                                </label>
                                <input 
                                  type="tel"
                                  required
                                  placeholder="+233 55 205 4174"
                                  value={guideData.phone}
                                  onChange={(e) => setGuideData({ ...guideData, phone: e.target.value })}
                                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange text-slate-800"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                              <div className="text-xs text-slate-500">
                                Matched with {guideData.targetCountry} options in {guideData.desiredField}
                              </div>
                              <button 
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-hover transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20"
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
                        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Your Tailored University Shortlist is Ready!</h3>
                        <p className="text-sm text-slate-600 max-w-md mx-auto">
                          Based on your background ({guideData.currentLevel}), interest in <strong>{guideData.desiredField}</strong> in <strong>{guideData.targetCountry}</strong>, our counsellors have generated 5 recommended programs.
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                          <Link 
                            href="/portal"
                            className="px-6 py-3 rounded-xl bg-navy text-white font-bold text-sm hover:bg-navy-light transition-colors"
                          >
                            Open Student Portal &rarr;
                          </Link>
                          <Link 
                            href="/contact"
                            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
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
      </div>

      {/* ========================================================================= */}
      {/* LIVE SEARCH & FILTER RESULTS MODAL */}
      {/* ========================================================================= */}
      {showResultsModal && (
        <div className="fixed inset-0 bg-navy/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Live System Directory</span>
                <h3 className="text-xl font-bold text-navy mt-0.5">{modalTitle}</h3>
              </div>
              <button 
                onClick={() => setShowResultsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List based on active tab */}
            {activeTab === "courses" && (
              <div className="space-y-4">
                {SAMPLE_COURSES.map((course, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-orange/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-blue uppercase">
                        <span>{course.country}</span>
                        <span>·</span>
                        <span>{course.duration}</span>
                        <span>·</span>
                        <span className="text-emerald-700">{course.intake}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{course.title}</h4>
                      <div className="text-xs text-slate-600 mt-0.5">{course.uni} · <span className="font-semibold text-slate-800">{course.fees}</span></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link 
                        href="/signup"
                        className="px-4 py-2 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover transition-colors whitespace-nowrap shadow-sm"
                      >
                        Apply Now
                      </Link>
                      <Link 
                        href="/contact"
                        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap"
                      >
                        Enquire
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "scholarships" && (
              <div className="space-y-4">
                {SAMPLE_SCHOLARSHIPS.map((sch, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-orange/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-orange uppercase">
                        <Award className="w-3.5 h-3.5" />
                        <span>{sch.coverage}</span>
                        <span>·</span>
                        <span>{sch.country}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{sch.title}</h4>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {sch.university} · Deadline: <span className="font-semibold text-rose-600">{sch.deadline}</span>
                      </div>
                    </div>
                    <Link 
                      href="/contact?service=scholarship"
                      className="px-4 py-2.5 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition-colors whitespace-nowrap text-center"
                    >
                      Check Eligibility
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "universities" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_UNIVERSITIES.map((uni, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-brand-blue uppercase">{uni.country}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">{uni.ranking}</span>
                      </div>
                      <h4 className="text-base font-bold text-navy mt-2">{uni.name}</h4>
                      <p className="text-xs text-slate-500">{uni.location}</p>
                      <div className="mt-2 text-xs text-slate-600">
                        <strong>Key faculties:</strong> {uni.popularCourses.join(", ")}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">{uni.fees}</span>
                      <Link 
                        href="/contact"
                        className="text-xs font-bold text-brand-orange hover:underline"
                      >
                        Book Placement &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "events" && (
              <div className="space-y-4">
                {SAMPLE_EVENTS.map((evt, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-brand-orange uppercase">{evt.format} · {evt.date}</span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{evt.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{evt.description}</p>
                    </div>
                    <Link
                      href="/contact?event=register"
                      className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange-hover transition-colors whitespace-nowrap text-center shadow-sm"
                    >
                      Reserve Free Seat
                    </Link>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">Need personal guidance from an assigned counsellor?</span>
              <div className="flex gap-2">
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition-colors"
                >
                  Book 1-on-1 Consultation
                </Link>
                <button
                  onClick={() => setShowResultsModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
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
