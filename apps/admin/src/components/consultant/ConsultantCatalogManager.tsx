"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  GraduationCap,
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  CheckCircle2,
  ArrowUpDown,
  MoveUp,
  MoveDown,
  X,
  Sparkles,
  RefreshCw,
  Award,
  Globe2,
  Banknote,
  FileCheck,
  AlertTriangle
} from "lucide-react";
import {
  CatalogSchool,
  DEFAULT_CATALOG_SCHOOLS,
  CATALOG_STORAGE_KEY,
  CATALOG_EVENT_KEY,
  CONSULT_API_BASE
} from "@/lib/consult-catalog";

type SortField = "name-asc" | "name-desc" | "recent" | "tuition";

export function ConsultantCatalogManager() {
  const [schools, setSchools] = useState<CatalogSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [badgeFilter, setBadgeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortField>("recent");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [schoolToDelete, setSchoolToDelete] = useState<CatalogSchool | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    level: "Undergraduate & Postgraduate" as "Undergraduate" | "Postgraduate" | "Undergraduate & Postgraduate" | "Master's" | "PhD / Doctorate",
    programmes: "",
    location: "",
    city: "",
    tuition: "",
    applicationFee: "",
    intake: "Sep 2026",
    ranking: "",
    scholarshipCoverage: "",
    badges: {
      highJobDemand: false,
      noVisaCap: false,
      loans: false,
      prime: false,
      top: false,
      popular: false,
      fastAcceptance: false,
    },
  });

  // 1. Load initial schools from API or LocalStorage
  const loadSchools = async () => {
    setLoading(true);
    let loaded: CatalogSchool[] = [];

    // Attempt API fetch first
    try {
      const res = await fetch(`${CONSULT_API_BASE}/api/catalog`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          loaded = json.data;
        }
      }
    } catch {
      // Fallback
    }

    // LocalStorage fallback
    if (loaded.length === 0 && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loaded = parsed;
          }
        }
      } catch {}
    }

    // Default seed fallback
    if (loaded.length === 0) {
      loaded = DEFAULT_CATALOG_SCHOOLS;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(DEFAULT_CATALOG_SCHOOLS));
        } catch {}
      }
    }

    setSchools(loaded);
    setLoading(false);
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  // Sync state to local and remote
  const persistSchools = async (updated: CatalogSchool[], successMsg: string) => {
    setSchools(updated);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent(CATALOG_EVENT_KEY, { detail: updated }));
      } catch {}
    }

    showToast(successMsg);

    // Broadcast to Consult API in background
    try {
      await Promise.allSettled(
        updated.map((s) =>
          fetch(`${CONSULT_API_BASE}/api/catalog`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(s),
          })
        )
      );
    } catch {}
  };

  // Open modal for new school
  const handleAddNew = () => {
    setEditingSchoolId(null);
    setFormData({
      name: "",
      level: "Undergraduate & Postgraduate",
      programmes: "",
      location: "",
      city: "",
      tuition: "",
      applicationFee: "",
      intake: "Sep 2026",
      ranking: "",
      scholarshipCoverage: "",
      badges: {
        highJobDemand: false,
        noVisaCap: false,
        loans: false,
        prime: false,
        top: false,
        popular: false,
        fastAcceptance: false,
      },
    });
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (school: CatalogSchool) => {
    setEditingSchoolId(school.id);
    setFormData({
      name: school.name,
      level: school.level,
      programmes: school.programmes.join(", "),
      location: school.location,
      city: school.city,
      tuition: school.tuition,
      applicationFee: school.applicationFee,
      intake: school.intake || "Sep 2026",
      ranking: school.ranking || "",
      scholarshipCoverage: school.scholarshipCoverage || "",
      badges: {
        highJobDemand: Boolean(school.badges?.highJobDemand),
        noVisaCap: Boolean(school.badges?.noVisaCap),
        loans: Boolean(school.badges?.loans),
        prime: Boolean(school.badges?.prime),
        top: Boolean(school.badges?.top),
        popular: Boolean(school.badges?.popular),
        fastAcceptance: Boolean(school.badges?.fastAcceptance),
      },
    });
    setIsModalOpen(true);
  };

  // Delete School
  const handleDelete = (school: CatalogSchool) => {
    setSchoolToDelete(school);
  };

  const confirmDeleteSchool = async () => {
    if (!schoolToDelete) return;
    const target = schoolToDelete;
    setSchoolToDelete(null);
    const updated = schools.filter((s) => s.id !== target.id);
    await persistSchools(updated, `"${target.name}" removed from Consult search feed.`);

    try {
      await fetch(`${CONSULT_API_BASE}/api/catalog?id=${encodeURIComponent(target.id)}`, {
        method: "DELETE",
      });
    } catch {}
  };

  // Move Up / Move Down for sort accessibility
  const handleMove = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === schools.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...schools];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    persistSchools(reordered, "Catalog search order updated.");
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    if (!confirm("Reset the Consult search catalog to the default partner universities?")) return;
    persistSchools(DEFAULT_CATALOG_SCHOOLS, "Catalog reset to default verified partner universities.");
  };

  // Submit Form (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.location.trim()) {
      alert("University name and location/country are required.");
      return;
    }

    const progsArray = formData.programmes
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const now = new Date().toISOString();

    if (editingSchoolId) {
      // Edit
      const updated = schools.map((s) => {
        if (s.id === editingSchoolId) {
          return {
            ...s,
            name: formData.name.trim(),
            level: formData.level,
            programmes: progsArray.length > 0 ? progsArray : s.programmes,
            location: formData.location.trim(),
            city: formData.city.trim(),
            tuition: formData.tuition.trim() || "Contact admissions",
            applicationFee: formData.applicationFee.trim() || "Free",
            intake: formData.intake.trim() || "Sep 2026",
            ranking: formData.ranking.trim(),
            scholarshipCoverage: formData.scholarshipCoverage.trim(),
            badges: { ...formData.badges },
            updatedAt: now,
          };
        }
        return s;
      });
      await persistSchools(updated, `University "${formData.name}" updated successfully.`);
    } else {
      // Add
      const newSchool: CatalogSchool = {
        id: `school-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: formData.name.trim(),
        level: formData.level,
        programmes: progsArray.length > 0 ? progsArray : ["General Degree Programmes"],
        location: formData.location.trim(),
        city: formData.city.trim(),
        tuition: formData.tuition.trim() || "Contact admissions",
        applicationFee: formData.applicationFee.trim() || "Free",
        intake: formData.intake.trim() || "Sep 2026",
        ranking: formData.ranking.trim(),
        scholarshipCoverage: formData.scholarshipCoverage.trim(),
        badges: { ...formData.badges },
        createdAt: now,
        updatedAt: now,
      };
      await persistSchools([newSchool, ...schools], `University "${newSchool.name}" added to Consult search feed.`);
    }

    setIsModalOpen(false);
  };

  // Filtered and sorted schools
  const filteredSchools = useMemo(() => {
    return schools
      .filter((school) => {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          school.name.toLowerCase().includes(q) ||
          school.location.toLowerCase().includes(q) ||
          school.city.toLowerCase().includes(q) ||
          school.programmes.some((p) => p.toLowerCase().includes(q));

        const matchesLevel =
          levelFilter === "all" ||
          (levelFilter === "undergraduate" && school.level.toLowerCase().includes("undergraduate")) ||
          (levelFilter === "postgraduate" && school.level.toLowerCase().includes("postgraduate")) ||
          (levelFilter === "masters" && (school.level.toLowerCase().includes("master") || school.level.toLowerCase().includes("postgraduate") || school.programmes.some((p) => p.toLowerCase().includes("msc") || p.toLowerCase().includes("mba") || p.toLowerCase().includes("master"))));

        const matchesBadge =
          badgeFilter === "all" ||
          (badgeFilter === "highJobDemand" && school.badges.highJobDemand) ||
          (badgeFilter === "noVisaCap" && school.badges.noVisaCap) ||
          (badgeFilter === "loans" && school.badges.loans) ||
          (badgeFilter === "prime" && school.badges.prime) ||
          (badgeFilter === "top" && school.badges.top) ||
          (badgeFilter === "popular" && school.badges.popular) ||
          (badgeFilter === "fastAcceptance" && school.badges.fastAcceptance);

        return matchesQuery && matchesLevel && matchesBadge;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        if (sortBy === "recent") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        return 0;
      });
  }, [schools, searchQuery, levelFilter, badgeFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Control Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0A0060] via-[#120088] to-[#1e1b4b] text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm border border-white/10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#EA580C] text-white flex items-center gap-1">
              <Sparkles className="size-3" /> Live Feed Controller
            </span>
            <span className="text-xs text-slate-300 font-medium">· Powers Hero Search & Student Portal</span>
          </div>
          <h2 className="text-xl font-bold font-display">Hero Search & University Catalog Feed</h2>
          <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
            Feed institutions, tuition durations, and scholarship opportunities directly to the Consult homepage hero search bar (Courses, Scholarships, Universities, Study Level, Destinations) and the Student Portal College Search engine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleResetDefaults}
            type="button"
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5"
            title="Restore seed verified universities"
          >
            <RefreshCw className="size-3.5" />
            <span>Defaults</span>
          </button>

          <button
            onClick={handleAddNew}
            type="button"
            className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#F4740D] text-white text-xs font-bold shadow-lg shadow-orange-950/40 transition-all flex items-center gap-2"
          >
            <Plus className="size-4" />
            <span>Add University</span>
          </button>
        </div>
      </div>

      {/* Search, Filter & Sort Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          {/* Text Search */}
          <div className="relative w-full sm:w-72">
            <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search university, country, city, programme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A0060] bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A0060] bg-white text-slate-700 font-medium"
          >
            <option value="all">All Study Levels</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="masters">Master's</option>
            <option value="postgraduate">Postgraduate</option>
          </select>

          {/* Badge Filter */}
          <select
            value={badgeFilter}
            onChange={(e) => setBadgeFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A0060] bg-white text-slate-700 font-medium"
          >
            <option value="all">All Feature Badges</option>
            <option value="highJobDemand">High Job Demand</option>
            <option value="noVisaCap">No Visa Cap</option>
            <option value="loans">Loans Available</option>
            <option value="prime">Prime</option>
            <option value="top">Top Tier</option>
            <option value="popular">Popular</option>
            <option value="fastAcceptance">Fast Acceptance</option>
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 self-end lg:self-center">
          <ArrowUpDown className="size-3.5 text-slate-400" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortField)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A0060] bg-white text-slate-800 font-semibold"
          >
            <option value="recent">Recently Updated</option>
            <option value="name-asc">Name (A &rarr; Z)</option>
            <option value="name-desc">Name (Z &rarr; A)</option>
          </select>
          <span className="text-xs font-semibold text-slate-500 ml-2">
            ({filteredSchools.length} {filteredSchools.length === 1 ? "School" : "Schools"})
          </span>
        </div>
      </div>

      {/* School Cards / List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
          <div className="size-8 rounded-full border-2 border-[#EA580C] border-t-transparent animate-spin mx-auto mb-3" />
          <span>a moment loading school search feed...</span>
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
          <GraduationCap className="size-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No universities matching your filter criteria.</p>
          <p className="text-xs text-slate-400">Click &ldquo;Add University&rdquo; above to register a new school to the feed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredSchools.map((school, index) => (
            <div
              key={school.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#0A0060]/30 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4 group"
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#0A0060]/10 text-[#0A0060]">
                    {school.level}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Globe2 className="size-3.5 text-slate-400" />
                    <strong>{school.location}</strong> · {school.city}
                  </span>
                  {school.ranking && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {school.ranking}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0A0060] transition-colors">
                  {school.name}
                </h3>

                {/* Key Programmes */}
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Programmes:</span>{" "}
                  {school.programmes.length > 0 ? school.programmes.join(" · ") : "General Admissions"}
                </div>

                {/* Fees & Details Row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Banknote className="size-3.5 text-emerald-600" />
                    <span>Tuition:</span> <strong className="text-slate-800">{school.tuition}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <FileCheck className="size-3.5 text-blue-600" />
                    <span>Application Fee:</span> <strong className="text-slate-800">{school.applicationFee}</strong>
                  </span>
                  {school.scholarshipCoverage && (
                    <span className="flex items-center gap-1 text-amber-700 font-medium">
                      <Award className="size-3.5 text-amber-600" />
                      <span>{school.scholarshipCoverage}</span>
                    </span>
                  )}
                </div>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  {school.badges.highJobDemand && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ High Job Demand
                    </span>
                  )}
                  {school.badges.noVisaCap && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      ✓ No Visa Cap
                    </span>
                  )}
                  {school.badges.loans && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                      ✓ Loans
                    </span>
                  )}
                  {school.badges.prime && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      ★ Prime
                    </span>
                  )}
                  {school.badges.top && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                      ★ Top
                    </span>
                  )}
                  {school.badges.popular && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      ♥ Popular
                    </span>
                  )}
                  {school.badges.fastAcceptance && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                      ⚡ Fast Acceptance
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                {/* Reorder Buttons */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
                    title="Move up in search priority"
                  >
                    <MoveUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(index, "down")}
                    disabled={index === filteredSchools.length - 1}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none"
                    title="Move down in search priority"
                  >
                    <MoveDown className="size-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleEdit(school)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:text-[#0A0060] hover:border-[#0A0060] text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Edit2 className="size-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(school)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                  title="Remove from feed"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#EA580C]">
                  {editingSchoolId ? "Update Existing Feed Record" : "Add Institution to Live Feed"}
                </span>
                <h3 className="text-xl font-bold font-display text-[#0A0060] mt-0.5">
                  {editingSchoolId ? "Edit University Details" : "New University Entry"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              {/* 1. University Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  The Name of the University *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. University of Manchester, Oxford, Harvard, Ashesi..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060] focus:ring-1 focus:ring-[#0A0060]"
                />
              </div>

              {/* 2. Study Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Study Level (Undergrad / Master's / Post / Both) *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060] bg-white text-slate-800"
                  >
                    <option value="Undergraduate">Undergraduate (Bachelor's)</option>
                    <option value="Master's">Master's Degree (Postgraduate Taught / MSc / MA / MBA)</option>
                    <option value="Postgraduate">Postgraduate (Master's / PhD)</option>
                    <option value="Undergraduate & Postgraduate">Undergraduate & Postgraduate Programmes</option>
                    <option value="PhD / Doctorate">PhD / Doctorate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Upcoming Intake
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sep 2026, Jan 2027"
                    value={formData.intake}
                    onChange={(e) => setFormData({ ...formData, intake: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                  />
                </div>
              </div>

              {/* 3. Programmes / Postgraduate Programmes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Programmes / Postgraduate Programmes (Comma-separated)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. MSc Advanced Computer Science, BSc Biomedical Science, MBA International Business, Law (LLB)"
                  value={formData.programmes}
                  onChange={(e) => setFormData({ ...formData, programmes: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                />
                <span className="text-[11px] text-slate-500">
                  These feed into the subject search on the Consult home page and student portal.
                </span>
              </div>

              {/* 4. Location & Campus City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Location (Country) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United Kingdom, Canada, United States, Australia, Ghana"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Campus City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manchester, Oxford, Toronto, Cambridge, Melbourne"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                  />
                </div>
              </div>

              {/* 5. Tuition (Duration if a year) & Application Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tuition (Duration if a year) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. £28,000 / year, CAD $42,000 / year, $8,500 / year"
                    value={formData.tuition}
                    onChange={(e) => setFormData({ ...formData, tuition: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Application Fee *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. £60 (Fee Waiver Available), CAD $125, Free"
                    value={formData.applicationFee}
                    onChange={(e) => setFormData({ ...formData, applicationFee: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                  />
                </div>
              </div>

              {/* Optional: Ranking & Scholarship Coverage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ranking / Tier (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Russell Group · Top 30 Global, Ivy League"
                    value={formData.ranking}
                    onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Scholarship Scheme / Coverage (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50% Tuition Waiver, Full Lester B. Pearson"
                    value={formData.scholarshipCoverage}
                    onChange={(e) => setFormData({ ...formData, scholarshipCoverage: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                  />
                </div>
              </div>

              {/* 6. Exact 7 Badges Checkboxes */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="block text-xs font-bold text-[#0A0060] uppercase tracking-wider">
                  Target Student Badges (Select all that apply)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.badges.highJobDemand}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          badges: { ...formData.badges, highJobDemand: e.target.checked },
                        })
                      }
                      className="size-4 rounded text-[#EA580C] focus:ring-[#EA580C]"
                    />
                    <span>High Job Demand</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.badges.noVisaCap}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          badges: { ...formData.badges, noVisaCap: e.target.checked },
                        })
                      }
                      className="size-4 rounded text-[#EA580C] focus:ring-[#EA580C]"
                    />
                    <span>No Visa Cap</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.badges.loans}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          badges: { ...formData.badges, loans: e.target.checked },
                        })
                      }
                      className="size-4 rounded text-[#EA580C] focus:ring-[#EA580C]"
                    />
                    <span>Loans</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.badges.prime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          badges: { ...formData.badges, prime: e.target.checked },
                        })
                      }
                      className="size-4 rounded text-[#EA580C] focus:ring-[#EA580C]"
                    />
                    <span>Prime</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.badges.top}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          badges: { ...formData.badges, top: e.target.checked },
                        })
                      }
                      className="size-4 rounded text-[#EA580C] focus:ring-[#EA580C]"
                    />
                    <span>Top</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.badges.popular}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          badges: { ...formData.badges, popular: e.target.checked },
                        })
                      }
                      className="size-4 rounded text-[#EA580C] focus:ring-[#EA580C]"
                    />
                    <span>Popular</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer col-span-2 sm:col-span-1">
                    <input
                      type="checkbox"
                      checked={formData.badges.fastAcceptance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          badges: { ...formData.badges, fastAcceptance: e.target.checked },
                        })
                      }
                      className="size-4 rounded text-[#EA580C] focus:ring-[#EA580C]"
                    />
                    <span>Fast Acceptance</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#F4740D] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="size-4" />
                  <span>{editingSchoolId ? "Save Changes" : "Add to Feed"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* PROFESSIONAL DELETE CONFIRMATION MODAL */}
      {schoolToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <Trash2 className="size-6 text-rose-600" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Confirm Catalog Removal</span>
                <h3 className="text-base font-bold font-display text-slate-900">
                  Remove {schoolToDelete.name}?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to remove <strong className="text-slate-700">{schoolToDelete.name}</strong> ({schoolToDelete.city}, {schoolToDelete.location}) from the Consult search catalog?
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div><strong className="text-slate-700">Tuition:</strong> {schoolToDelete.tuition}</div>
              <div><strong className="text-slate-700">Level:</strong> {schoolToDelete.level}</div>
              <div className="text-rose-600 font-semibold pt-1">
                This will immediately remove the institution from live hero search feeds and student portal college search.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSchoolToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteSchool}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Yes, Remove Institution</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
