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
    <section className="bg-navy pt-24 pb-20 border-b border-navy-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-light text-brand-orange text-xs font-bold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
              Admissions Open 2026
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
              Your Journey to a Global Education.
            </h1>
            
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-10">
              Expert guidance for Ghanaian and African students aspiring to study abroad. Discover programs, secure scholarships, and manage your applications with confidence.
            </p>


          </div>

          {/* Right Search Box */}
          <div className="w-full lg:w-[500px] shrink-0">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              
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
                          ? "text-navy bg-white border-b-2 border-navy" 
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-b-2 border-transparent"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Form Area */}
              <div className="p-6">
                {activeTab !== "Guide me" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        What do you want to study?
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder={`Search ${activeTab.toLowerCase()}...`}
                          className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {(activeTab === "Courses" || activeTab === "Universities") && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Where?
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy appearance-none">
                            <option value="">Any Destination</option>
                            <option value="UK">United Kingdom</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="AU">Australia</option>
                          </select>
                        </div>
                      </div>
                    )}
                    
                    <button className="w-full py-3.5 mt-2 rounded-lg bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange-hover transition-colors flex items-center justify-center gap-2">
                      Search {activeTab}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Not sure where to start?</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Take our 2-minute assessment. We'll match your profile with the perfect study destination and program.
                      </p>
                    </div>
                    <button className="w-full py-3.5 rounded-lg bg-navy text-white font-bold text-sm hover:bg-navy-light transition-colors flex items-center justify-center gap-2">
                      Start Free Assessment
                      <ArrowRight className="w-4 h-4" />
                    </button>
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

