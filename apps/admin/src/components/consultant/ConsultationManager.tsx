"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserCheck,
  Headphones,
  Mail,
  Phone,
  Calendar,
  Globe,
  GraduationCap,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Edit2,
  X,
  FileText,
  Sparkles,
  ArrowRight,
  RefreshCw
} from "lucide-react";

export interface StudentConsultationRequest {
  id: string;
  referenceId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  currentEducation?: string;
  desiredDegree?: string;
  desiredProgram: string;
  preferredDestination: string;
  targetIntake?: string;
  consultationMode: string;
  preferredDate?: string;
  notes?: string;
  status: "Pending" | "Assigned" | "In Progress" | "Completed";
  assignedConsultant: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
  } | null;
  history: {
    timestamp: string;
    actor: string;
    action: string;
    notes?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const CONSULTANT_ROSTER = [
  {
    id: "cons-01",
    name: "Dr. Sarah Mensah",
    role: "Senior UK & Europe Advisor",
    email: "s.mensah@dellics.com",
    phone: "+233 55 205 4174",
    specialty: "Russell Group, Chevening & DAAD Scholarships"
  },
  {
    id: "cons-02",
    name: "Emmanuel Osei",
    role: "Canada & US Admissions Specialist",
    email: "e.osei@dellics.com",
    phone: "+233 24 412 3456",
    specialty: "U15 Canada, Ivy League & Merit Grants"
  },
  {
    id: "cons-03",
    name: "Grace Addo",
    role: "Australia & Visa Compliance Lead",
    email: "g.addo@dellics.com",
    phone: "+233 20 987 6543",
    specialty: "Post-Study Work Visas & Group of Eight"
  },
  {
    id: "cons-04",
    name: "Kofi Boateng",
    role: "Undergraduate Admissions Head",
    email: "k.boateng@dellics.com",
    phone: "+233 50 112 2334",
    specialty: "WASSCE Direct Entry & SAT Prep Pathways"
  }
];

export const DEFAULT_CONSULTATION_REQUESTS: StudentConsultationRequest[] = [
  {
    id: "req-01",
    referenceId: "DEC-GH-821943",
    studentName: "Kwabena Frimpong",
    studentEmail: "kwabena.f@gmail.com",
    studentPhone: "+233 24 881 2299",
    currentEducation: "WASSCE Graduate (Aggrey Memorial)",
    desiredDegree: "Bachelor's Degree",
    desiredProgram: "BSc Computer Science & Artificial Intelligence",
    preferredDestination: "United Kingdom",
    targetIntake: "September 2026",
    consultationMode: "In-Person (Tema Campus Office)",
    preferredDate: "2026-10-24",
    notes: "Seeking universities offering partial tuition waivers for West African students with strong mathematics grades.",
    status: "Pending",
    assignedConsultant: null,
    history: [
      {
        timestamp: "2026-10-23T08:15:00Z",
        actor: "Kwabena Frimpong",
        action: "Submitted Consultation Request",
        notes: "Booked In-Person Session at Tema Community 25 office"
      }
    ],
    createdAt: "2026-10-23T08:15:00Z",
    updatedAt: "2026-10-23T08:15:00Z"
  },
  {
    id: "req-02",
    referenceId: "DEC-GH-749102",
    studentName: "Ama Serwaa Ofori",
    studentEmail: "ama.ofori@knust.edu.gh",
    studentPhone: "+233 55 901 3344",
    currentEducation: "Bachelor of Pharmacy (KNUST)",
    desiredDegree: "Master's Degree",
    desiredProgram: "MSc Public Health & Clinical Epidemiology",
    preferredDestination: "Canada",
    targetIntake: "January 2027",
    consultationMode: "Virtual (Zoom / Google Meet)",
    preferredDate: "2026-10-25",
    notes: "Needs evaluation of post-graduate work permit (PGWP) eligibility for Alberta and Ontario medical programs.",
    status: "Assigned",
    assignedConsultant: {
      id: "cons-02",
      name: "Emmanuel Osei",
      role: "Canada & US Admissions Specialist",
      email: "e.osei@dellics.com",
      phone: "+233 24 412 3456"
    },
    history: [
      {
        timestamp: "2026-10-22T14:30:00Z",
        actor: "Ama Serwaa Ofori",
        action: "Submitted Consultation Request"
      },
      {
        timestamp: "2026-10-23T09:00:00Z",
        actor: "Admissions Admin",
        action: "Assigned Consultant",
        notes: "Assigned to Emmanuel Osei (Canada specialist)"
      }
    ],
    createdAt: "2026-10-22T14:30:00Z",
    updatedAt: "2026-10-23T09:00:00Z"
  },
  {
    id: "req-03",
    referenceId: "DEC-GH-610284",
    studentName: "Kofi Owusu-Ansah",
    studentEmail: "kofi.owusu@gmail.com",
    studentPhone: "+233 20 445 6789",
    currentEducation: "BSc Business Administration (UG Legon)",
    desiredDegree: "Master's Degree",
    desiredProgram: "MBA International Finance & FinTech",
    preferredDestination: "United States",
    targetIntake: "August 2026",
    consultationMode: "Virtual (Zoom / Google Meet)",
    preferredDate: "2026-10-24",
    notes: "Requires GMAT waiver evaluation and F-1 visa proof-of-funds structuring guidance.",
    status: "In Progress",
    assignedConsultant: {
      id: "cons-01",
      name: "Dr. Sarah Mensah",
      role: "Senior UK & Europe Advisor",
      email: "s.mensah@dellics.com",
      phone: "+233 55 205 4174"
    },
    history: [
      {
        timestamp: "2026-10-21T11:20:00Z",
        actor: "Kofi Owusu-Ansah",
        action: "Submitted Consultation Request"
      },
      {
        timestamp: "2026-10-22T10:00:00Z",
        actor: "Admissions Admin",
        action: "Assigned Consultant",
        notes: "Delegated to Dr. Sarah Mensah"
      },
      {
        timestamp: "2026-10-23T07:45:00Z",
        actor: "Dr. Sarah Mensah",
        action: "Status Changed: In Progress",
        notes: "Conducted initial dossier review; university shortlist dispatched to student email"
      }
    ],
    createdAt: "2026-10-21T11:20:00Z",
    updatedAt: "2026-10-23T07:45:00Z"
  },
  {
    id: "req-04",
    referenceId: "DEC-GH-592817",
    studentName: "Nana Yaa Appiah",
    studentEmail: "nana.appiah@stlouis.edu.gh",
    studentPhone: "+233 50 678 1234",
    currentEducation: "Currently in Senior High School (WASSCE 2025)",
    desiredDegree: "Bachelor's Degree",
    desiredProgram: "BSc Nursing & Healthcare Leadership",
    preferredDestination: "Australia",
    targetIntake: "February 2027",
    consultationMode: "Phone / WhatsApp Call",
    preferredDate: "2026-10-26",
    notes: "Looking for Australian Nursing Council accredited courses in Sydney and Brisbane with regional visa points bonus.",
    status: "Completed",
    assignedConsultant: {
      id: "cons-03",
      name: "Grace Addo",
      role: "Australia & Visa Compliance Lead",
      email: "g.addo@dellics.com",
      phone: "+233 20 987 6543"
    },
    history: [
      {
        timestamp: "2026-10-18T09:00:00Z",
        actor: "Nana Yaa Appiah",
        action: "Submitted Consultation Request"
      },
      {
        timestamp: "2026-10-19T08:30:00Z",
        actor: "Admissions Admin",
        action: "Assigned Consultant",
        notes: "Delegated to Grace Addo"
      },
      {
        timestamp: "2026-10-21T15:00:00Z",
        actor: "Grace Addo",
        action: "Completed Consultation Session",
        notes: "Admitted into QUT pathway; English proficiency waiver granted via WASSCE A1 in Core English"
      }
    ],
    createdAt: "2026-10-18T09:00:00Z",
    updatedAt: "2026-10-21T15:00:00Z"
  }
];

const STORAGE_KEY = "dellics_consultation_requests";

export function ConsultationManager() {
  const [requests, setRequests] = useState<StudentConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("all");

  // Assignment Modal
  const [assigningRequest, setAssigningRequest] = useState<StudentConsultationRequest | null>(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState(CONSULTANT_ROSTER[0].id);
  const [assignmentNote, setAssignmentNote] = useState("");

  // Dossier Modal
  const [viewingRequest, setViewingRequest] = useState<StudentConsultationRequest | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const loadRequests = () => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRequests(parsed);
            setLoading(false);
            return;
          }
        }
        // Fallback to seed requests
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONSULTATION_REQUESTS));
        setRequests(DEFAULT_CONSULTATION_REQUESTS);
      }
    } catch {
      setRequests(DEFAULT_CONSULTATION_REQUESTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();

    const handleSync = () => loadRequests();
    window.addEventListener("dellics_consultation_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("dellics_consultation_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const persistRequests = (updated: StudentConsultationRequest[], msg?: string) => {
    setRequests(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("dellics_consultation_updated"));
      } catch {}
    }
    if (msg) {
      setToast(msg);
      setTimeout(() => setToast(null), 3500);
    }
  };

  // Assign Consultant handler
  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningRequest) return;

    const consultant = CONSULTANT_ROSTER.find((c) => c.id === selectedConsultantId) || CONSULTANT_ROSTER[0];
    const timestamp = new Date().toISOString();

    const updated = requests.map((req) => {
      if (req.id === assigningRequest.id) {
        return {
          ...req,
          status: "Assigned" as const,
          assignedConsultant: {
            id: consultant.id,
            name: consultant.name,
            role: consultant.role,
            email: consultant.email,
            phone: consultant.phone
          },
          history: [
            ...(req.history || []),
            {
              timestamp,
              actor: "Admissions Admin",
              action: `Delegated to ${consultant.name}`,
              notes: assignmentNote || `Assigned to ${consultant.name} (${consultant.role})`
            }
          ],
          updatedAt: timestamp
        };
      }
      return req;
    });

    persistRequests(updated, `Student "${assigningRequest.studentName}" assigned to ${consultant.name}.`);
    setAssigningRequest(null);
    setAssignmentNote("");
  };

  // Status Change handler
  const handleQuickStatusChange = (requestId: string, newStatus: StudentConsultationRequest["status"]) => {
    const timestamp = new Date().toISOString();
    const updated = requests.map((req) => {
      if (req.id === requestId) {
        return {
          ...req,
          status: newStatus,
          history: [
            ...(req.history || []),
            {
              timestamp,
              actor: "Admissions Admin",
              action: `Status Updated: ${newStatus}`,
              notes: `Consultation stage marked as ${newStatus}`
            }
          ],
          updatedAt: timestamp
        };
      }
      return req;
    });

    persistRequests(updated, `Consultation status updated to ${newStatus}.`);
    if (viewingRequest && viewingRequest.id === requestId) {
      setViewingRequest(updated.find((r) => r.id === requestId) || null);
    }
  };

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        req.studentName.toLowerCase().includes(q) ||
        req.studentEmail.toLowerCase().includes(q) ||
        req.preferredDestination.toLowerCase().includes(q) ||
        req.desiredProgram.toLowerCase().includes(q) ||
        req.referenceId.toLowerCase().includes(q) ||
        (req.assignedConsultant?.name || "").toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || req.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesDestination =
        destinationFilter === "all" ||
        req.preferredDestination.toLowerCase().includes(destinationFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesDestination;
    });
  }, [requests, searchQuery, statusFilter, destinationFilter]);

  const counts = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "Pending").length,
      assigned: requests.filter((r) => r.status === "Assigned").length,
      inProgress: requests.filter((r) => r.status === "In Progress").length,
      completed: requests.filter((r) => r.status === "Completed").length
    };
  }, [requests]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-white/20 text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white cursor-pointer ml-2">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0A0060] via-[#120088] to-[#1e1b4b] text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm border border-white/10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#EA580C] text-white flex items-center gap-1">
              <Headphones className="size-3" /> Consultation Delegation Center
            </span>
            <span className="text-xs text-slate-300 font-medium">· Real-time Student & Consultant Mapping</span>
          </div>
          <h2 className="text-xl font-bold font-display">Student Consultations & Advisor Assignments</h2>
          <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
            Monitor incoming study-abroad inquiries submitted through the website, delegate each student to a dedicated certified consultant, and track guidance milestones from initial review to enrollment.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={loadRequests}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            <span>Sync Requests</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "all" ? "border-[#0A0060] bg-white ring-2 ring-[#0A0060]/10 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">All Inquiries</div>
          <div className="text-2xl font-bold font-display text-slate-900 mt-1">{counts.total}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("Pending")}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "Pending" ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending</span>
            {counts.pending > 0 && <span className="size-2 rounded-full bg-amber-500 animate-pulse" />}
          </div>
          <div className="text-2xl font-bold font-display text-amber-900 mt-1">{counts.pending}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("Assigned")}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "Assigned" ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Assigned</div>
          <div className="text-2xl font-bold font-display text-blue-900 mt-1">{counts.assigned}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("In Progress")}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "In Progress" ? "border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">In Progress</div>
          <div className="text-2xl font-bold font-display text-teal-900 mt-1">{counts.inProgress}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("Completed")}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer col-span-2 sm:col-span-1 ${
            statusFilter === "Completed" ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Completed</div>
          <div className="text-2xl font-bold font-display text-emerald-900 mt-1">{counts.completed}</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, email, ref ID, destination, or assigned advisor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A0060] bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A0060] bg-white text-slate-700 font-medium"
          >
            <option value="all">All Destinations</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="United States">United States</option>
            <option value="Australia">Australia</option>
            <option value="Europe">Europe</option>
          </select>

          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            {filteredRequests.length} {filteredRequests.length === 1 ? "Inquiry" : "Inquiries"}
          </span>
        </div>
      </div>

      {/* Consultations Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <div className="size-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin mx-auto mb-2" />
            <span>Loading consultation records...</span>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Users className="size-8 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No consultation requests match filters</h4>
            <p className="text-xs text-slate-400">Try adjusting your search terms or clearing status filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Student & Reference</th>
                  <th className="py-3 px-4">Program & Destination</th>
                  <th className="py-3 px-4">Mode & Preferred Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Consultant</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Student & Ref */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{req.studentName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{req.studentEmail}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{req.studentPhone}</div>
                        <span className="inline-block px-2 py-0.5 mt-1 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-600">
                          {req.referenceId}
                        </span>
                      </div>
                    </td>

                    {/* Program & Destination */}
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <div>
                        <div className="font-semibold text-slate-800 truncate" title={req.desiredProgram}>
                          {req.desiredProgram}
                        </div>
                        <div className="text-[11px] text-brand-orange font-bold mt-0.5 flex items-center gap-1">
                          <Globe className="size-3" />
                          <span>{req.preferredDestination}</span>
                        </div>
                        {req.desiredDegree && (
                          <div className="text-[10px] text-slate-500 mt-0.5">{req.desiredDegree}</div>
                        )}
                      </div>
                    </td>

                    {/* Mode & Date */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          <Headphones className="size-3 text-slate-500" />
                          <span>{req.consultationMode}</span>
                        </span>
                        {req.preferredDate && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Calendar className="size-3 text-slate-400" />
                            <span>Pref: {req.preferredDate}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.status === "Pending"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : req.status === "Assigned"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : req.status === "In Progress"
                                ? "bg-teal-100 text-teal-800 border border-teal-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {req.status === "Pending" && <span className="size-1.5 rounded-full bg-amber-500 animate-ping" />}
                        <span>{req.status}</span>
                      </span>
                    </td>

                    {/* Assigned Consultant */}
                    <td className="py-3.5 px-4">
                      {req.assignedConsultant ? (
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-full bg-[#0A0060] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {req.assignedConsultant.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{req.assignedConsultant.name}</div>
                            <div className="text-[10px] text-slate-500">{req.assignedConsultant.role}</div>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAssigningRequest(req);
                            setSelectedConsultantId(CONSULTANT_ROSTER[0].id);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-dashed border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-100 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <UserCheck className="size-3" />
                          <span>Assign Advisor</span>
                        </button>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setAssigningRequest(req);
                            setSelectedConsultantId(req.assignedConsultant?.id || CONSULTANT_ROSTER[0].id);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:text-[#0A0060] hover:border-[#0A0060] text-[11px] font-bold transition-colors cursor-pointer"
                          title="Delegate or change assigned consultant"
                        >
                          {req.assignedConsultant ? "Reassign" : "Assign"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setViewingRequest(req)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors cursor-pointer"
                          title="View student dossier and session history"
                        >
                          Dossier
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. ASSIGN CONSULTANT MODAL */}
      {/* ========================================================================= */}
      {assigningRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-orange">
                  Advisory Delegation Desk
                </span>
                <h3 className="text-lg font-bold font-display text-slate-900 mt-0.5">
                  Assign Consultant to {assigningRequest.studentName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAssigningRequest(null)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div><strong className="text-slate-800">Desired Program:</strong> {assigningRequest.desiredProgram}</div>
              <div><strong className="text-slate-800">Target Country:</strong> {assigningRequest.preferredDestination}</div>
              <div><strong className="text-slate-800">Session Format:</strong> {assigningRequest.consultationMode}</div>
            </div>

            <form onSubmit={handleConfirmAssignment} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Certified Consultant *
                </label>
                <div className="space-y-2">
                  {CONSULTANT_ROSTER.map((c) => {
                    const isSelected = selectedConsultantId === c.id;
                    return (
                      <label
                        key={c.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected ? "border-[#0A0060] bg-[#0A0060]/5 ring-1 ring-[#0A0060]" : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="consultantSelection"
                          value={c.id}
                          checked={isSelected}
                          onChange={() => setSelectedConsultantId(c.id)}
                          className="mt-0.5 text-[#0A0060] focus:ring-[#0A0060]"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 text-xs">{c.name}</div>
                          <div className="text-[11px] text-brand-orange font-semibold">{c.role}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Focus: {c.specialty}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Delegation Instructions / Internal Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                  placeholder="e.g. Student has WASSCE A1 in Elective Maths; prioritize Russell Group computing courses."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#0A0060]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningRequest(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0A0060] hover:bg-[#120088] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="size-3.5" />
                  <span>Confirm Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STUDENT DOSSIER & CONSULTATION HISTORY MODAL */}
      {/* ========================================================================= */}
      {viewingRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 duration-150 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-orange">
                  Ref: {viewingRequest.referenceId}
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 mt-0.5">
                  {viewingRequest.studentName} — Consultation Dossier
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingRequest(null)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Stage:</div>
                <div className="font-bold text-sm text-slate-900 mt-0.5">{viewingRequest.status}</div>
              </div>

              <div className="flex items-center gap-1.5">
                {(["Pending", "Assigned", "In Progress", "Completed"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleQuickStatusChange(viewingRequest.id, st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewingRequest.status === st
                        ? "bg-[#0A0060] text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Student & Academic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Contact Information</div>
                <div><span className="text-slate-500">Email:</span> <strong className="text-slate-800">{viewingRequest.studentEmail}</strong></div>
                <div><span className="text-slate-500">Phone:</span> <strong className="text-slate-800">{viewingRequest.studentPhone}</strong></div>
                <div><span className="text-slate-500">Preferred Mode:</span> <strong className="text-slate-800">{viewingRequest.consultationMode}</strong></div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Academic Intent</div>
                <div><span className="text-slate-500">Program:</span> <strong className="text-slate-800">{viewingRequest.desiredProgram}</strong></div>
                <div><span className="text-slate-500">Destination:</span> <strong className="text-brand-orange">{viewingRequest.preferredDestination}</strong></div>
                <div><span className="text-slate-500">Target Intake:</span> <strong className="text-slate-800">{viewingRequest.targetIntake || "September 2026"}</strong></div>
              </div>
            </div>

            {/* Student Inquiry Notes */}
            {viewingRequest.notes && (
              <div className="p-4 rounded-xl bg-orange-50/60 border border-brand-orange/20 text-xs">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">Student Notes & Requirements:</div>
                <p className="text-slate-700 leading-relaxed italic">"{viewingRequest.notes}"</p>
              </div>
            )}

            {/* Assigned Consultant Details */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
              <div className="font-bold text-blue-900 uppercase tracking-wider text-[10px] mb-2">Responsible Advisor:</div>
              {viewingRequest.assignedConsultant ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{viewingRequest.assignedConsultant.name}</div>
                    <div className="text-slate-600 text-[11px]">{viewingRequest.assignedConsultant.role}</div>
                    <div className="text-slate-500 text-[10px]">{viewingRequest.assignedConsultant.email} · {viewingRequest.assignedConsultant.phone}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAssigningRequest(viewingRequest);
                      setSelectedConsultantId(viewingRequest.assignedConsultant?.id || CONSULTANT_ROSTER[0].id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-900 text-xs font-bold hover:bg-blue-100 cursor-pointer"
                  >
                    Change Consultant
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 italic">No consultant currently assigned</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAssigningRequest(viewingRequest);
                      setSelectedConsultantId(CONSULTANT_ROSTER[0].id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#0A0060] text-white text-xs font-bold hover:bg-[#120088] cursor-pointer"
                  >
                    Assign Now
                  </button>
                </div>
              )}
            </div>

            {/* Consultation History Timeline */}
            <div>
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3">Audit Trail & Consultation Timeline</div>
              <div className="space-y-3">
                {(viewingRequest.history || []).map((h, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="size-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                      ✓
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{h.action}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(h.timestamp).toLocaleDateString()} {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">By: {h.actor}</div>
                      {h.notes && (
                        <div className="text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-slate-100 mt-1.5">
                          {h.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewingRequest(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
