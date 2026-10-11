"use client";

import { useState } from "react";
import { Search, GraduationCap, Building2, MapPin, Compass, ArrowRight } from "lucide-react";

const tabs = [
  { id: "Courses", label: "Courses", icon: GraduationCap },
  { id: "Universities", label: "Universities", icon: Building2 },
  { id: "Destinations", label: "Destinations", icon: MapPin },
  { id: "Guide me", label: "Guide Me", icon: Compass },
];

export function HeroSection() {
  const [activeTab, setActiveTab] = useState("Courses");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="bg-navy pt-32 pb-24 border-b border-navy-light relative overflow-hidden min-h-[580px] flex items-center">
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
          {/* High-reliability video streams representing international campus life */}
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/95 via-navy/85 to-navy/95 backdrop-blur-[1px]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center justify-center text-center gap-10">
          
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4 border border-brand-orange/30">
              Trusted Education Consultancy in Ghana
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight">
              Your Journey to a <span className="text-brand-orange">Global Education</span>.
            </h1>
            <p className="mt-4 text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Admissions, scholarships, test coordination, and visa compliance for top universities in the UK, Canada, USA, and Australia.
            </p>
          </div>

          {/* Centered Search Box */}
          <div className="w-full max-w-3xl shrink-0 mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
              
              {/* Tabs */}
              <div className="flex bg-slate-50 border-b border-slate-200">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-4 text-xs font-semibold transition-colors ${
                        isActive 
                          ? "text-navy bg-white border-b-2 border-brand-orange" 
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-b-2 border-transparent"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-brand-orange" : "text-slate-400"}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Form Area */}
              <div className="p-6 md:p-8">
                {activeTab !== "Guide me" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-left">
                        What do you want to study?
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder={`Search ${activeTab.toLowerCase()} (e.g. Computer Science, MBA, Nursing, Law)...`}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-slate-800"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {(activeTab === "Courses" || activeTab === "Universities") && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-left">
                          Target Country
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange appearance-none text-slate-800">
                            <option value="">Any Destination (Global)</option>
                            <option value="UK">United Kingdom</option>
                            <option value="CA">Canada</option>
                            <option value="US">United States</option>
                            <option value="AU">Australia</option>
                            <option value="EU">Europe (Germany, France, Netherlands)</option>
                          </select>
                        </div>
                      </div>
                    )}
                    
                    <a 
                      href="/contact"
                      className="w-full py-3.5 mt-2 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-hover transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20"
                    >
                      Search {activeTab}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Not sure where to start?</h3>
                      <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                        Take our tailored 2-minute assessment. We will match your academic profile, budget, and career goals with the ideal university programs abroad.
                      </p>
                    </div>
                    <a 
                      href="/contact" 
                      className="inline-flex w-full py-3.5 rounded-xl bg-navy text-white font-bold text-sm hover:bg-navy-light transition-colors items-center justify-center gap-2 shadow-md"
                    >
                      Start Free Assessment
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
