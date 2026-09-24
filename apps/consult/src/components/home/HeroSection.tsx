"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, GraduationCap, MapPin, Calendar, Compass, BookOpen, Building2 } from "lucide-react";

type SearchTab = "Courses" | "Scholarships" | "Universities" | "Events" | "Guide me";

const tabs: { id: SearchTab; icon: any; label: string }[] = [
  { id: "Courses", icon: BookOpen, label: "Courses" },
  { id: "Universities", icon: Building2, label: "Universities" },
  { id: "Scholarships", icon: GraduationCap, label: "Scholarships" },
  { id: "Events", icon: Calendar, label: "Events" },
  { id: "Guide me", icon: Compass, label: "Guide me" },
];

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<SearchTab>("Courses");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden bg-slate-900">
      {/* Dynamic Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Placeholder video - using a reliable external source for demonstration */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-40 mix-blend-overlay"
        >
          <source src="https://cdn.pixabay.com/video/2021/08/25/86274-593005830_large.mp4" type="video/mp4" />
        </video>
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 w-full max-w-5xl flex flex-col items-center text-center">
        <div className="space-y-6 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/20 text-brand-orange-light text-sm font-semibold border border-brand-orange/30 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
            </span>
            Guiding students from application to arrival
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-white leading-tight drop-shadow-lg">
            Transform Your Future Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-400">Global Education</span>
          </h1>
          
          <p className="text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto drop-shadow">
            Expert guidance for Ghanaian & African students aspiring to study abroad. Discover programs, secure scholarships, and manage your journey with confidence.
          </p>
        </div>

        {/* Search Container */}
        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl md:rounded-full p-2 shadow-2xl">
          {/* Tabs */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 p-2 border-b border-white/10 md:border-none md:bg-white/5 md:rounded-full md:p-1 mb-4 md:mb-0 md:absolute md:-top-16 md:left-1/2 md:-translate-x-1/2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/30" 
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Input Area */}
          <div className="flex flex-col md:flex-row items-center gap-3 p-2">
            {activeTab !== "Guide me" ? (
              <>
                <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl md:rounded-full border border-white/50 focus-within:ring-2 focus-within:ring-brand-orange/50 transition-all">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={`Search for ${activeTab.toLowerCase()}...`}
                    className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-500 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Optional filters depending on tab */}
                {(activeTab === "Courses" || activeTab === "Universities") && (
                  <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl md:rounded-full border border-white/50">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <select className="bg-transparent border-none outline-none text-slate-700 font-medium">
                        <option value="">Any Destination</option>
                        <option value="UK">United Kingdom</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                )}
                
                <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl md:rounded-full bg-brand-orange hover:bg-brand-orange-light text-white font-bold transition-all shadow-lg hover:-translate-y-0.5">
                  Search
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="w-full py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/80 backdrop-blur-sm rounded-xl md:rounded-full">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-800">Not sure where to start?</h3>
                  <p className="text-sm text-slate-600">Answer a few quick questions and we'll match you with the perfect study path.</p>
                </div>
                <button className="whitespace-nowrap flex items-center justify-center gap-2 px-8 py-3 rounded-xl md:rounded-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold transition-all shadow-lg hover:-translate-y-0.5">
                  Start Assessment
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats below search */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 mt-16 pt-8 border-t border-white/10 w-full max-w-4xl mx-auto text-white">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-display font-bold text-brand-orange">500+</div>
            <div className="text-sm font-medium text-slate-300 mt-1">Students Advised</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-display font-bold text-brand-orange">20+</div>
            <div className="text-sm font-medium text-slate-300 mt-1">Destinations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-display font-bold text-brand-orange">98%</div>
            <div className="text-sm font-medium text-slate-300 mt-1">Visa Success</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-display font-bold text-brand-orange">$2M+</div>
            <div className="text-sm font-medium text-slate-300 mt-1">Scholarships Secured</div>
          </div>
        </div>
      </div>
    </section>
  );
}
