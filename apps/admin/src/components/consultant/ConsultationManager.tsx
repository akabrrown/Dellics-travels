"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { adminApi } from "@/lib/api";
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

export interface ConsultantOption {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty?: string;
  role?: string;
  is_active: boolean;
}

// Real consultation requests are loaded from the database via adminApi
function mapDbToUi(item: any): StudentConsultationRequest {
  const statusMap: Record<string, "Pending" | "Assigned" | "In Progress" | "Completed"> = {
    PENDING: "Pending",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Completed",
  };

  const formattedStatus = statusMap[item.status] || "Pending";
  const fullName = `${item.first_name || ""} ${item.last_name || ""}`.trim() || item.applicant_name || "Applicant";

  let assigned = item.assigned_consultant;
  if (!assigned && item.consultant) {
    assigned = {
      id: item.consultant.id,
      name: item.consultant.full_name,
      role: item.consultant.specialty || "Certified Advisor",
      email: item.consultant.email,
      phone: item.consultant.phone,
    };
  }

  return {
    id: item.id,
    referenceId: item.reference || item.referenceId || "N/A",
    studentName: fullName,
    studentEmail: item.email || "",
    studentPhone: item.phone || "",
    currentEducation: item.current_education || undefined,
    desiredDegree: item.desired_degree || undefined,
    desiredProgram: item.desired_program || "Undergraduate / Postgraduate",
    preferredDestination: item.preferred_destination || "Study Abroad",
    targetIntake: item.target_intake || undefined,
    consultationMode: item.consultation_mode || "In-Person",
    preferredDate: item.preferred_date || undefined,
    notes: item.notes || item.internal_notes || undefined,
    status: formattedStatus,
    assignedConsultant: assigned || null,
    history: [
      {
        timestamp: item.created_at || new Date().toISOString(),
        actor: fullName,
        action: "Submitted Consultation Request",
        notes: `Mode: ${item.consultation_mode || "General"} | Destination: ${item.preferred_destination || "General"}`
      }
    ],
    createdAt: item.created_at || new Date().toISOString(),
    updatedAt: item.updated_at || new Date().toISOString()
  };
}

export function ConsultationManager({ onNavigateToConsultants }: { onNavigateToConsultants?: () => void }) {
  const [requests, setRequests] = useState<StudentConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("all");

  // Real consultants loaded from API
  const [consultants, setConsultants] = useState<ConsultantOption[]>([]);
  const [loadingConsultants, setLoadingConsultants] = useState(false);

  // Assignment Modal
  const [assigningRequest, setAssigningRequest] = useState<StudentConsultationRequest | null>(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState<string>("");
  const [assignmentNote, setAssignmentNote] = useState("");

  // Dossier Modal
  const [viewingRequest, setViewingRequest] = useState<StudentConsultationRequest | null>(null);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const loadConsultants = useCallback(async () => {
    try {
      setLoadingConsultants(true);
      const res = await adminApi.get<{ status: string; data: any[] }>("/consultants?activeOnly=true");
      if (res && Array.isArray(res.data)) {
        const mapped = res.data.map((c: any) => ({
          id: c.id,
          name: c.full_name || c.name,
          email: c.email,
          phone: c.phone,
          specialty: c.specialty || "Certified Advisor",
          role: c.specialty || "Certified Advisor",
          is_active: c.is_active,
        }));
        setConsultants(mapped);
      } else {
        setConsultants([]);
      }
    } catch {
      setConsultants([]);
    } finally {
      setLoadingConsultants(false);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.get<{ status: string; data: any[] }>("/consultations");
      if (res && Array.isArray(res.data)) {
        setRequests(res.data.map(mapDbToUi));
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Failed to load consultations from API", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
    loadConsultants();

    const handleRefresh = () => {
      loadRequests();
      loadConsultants();
    };
    window.addEventListener("dellics_consultation_refresh_requested", handleRefresh);
    window.addEventListener("dellics_consultants_updated", handleRefresh);

    return () => {
      window.removeEventListener("dellics_consultation_refresh_requested", handleRefresh);
      window.removeEventListener("dellics_consultants_updated", handleRefresh);
    };
  }, [loadRequests, loadConsultants]);


  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Assign Consultant handler
  const handleConfirmAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningRequest) return;

    const consultant = consultants.find((c) => c.id === selectedConsultantId);
    if (!consultant) {
      showToast("Please select a certified consultant to assign.");
      return;
    }

    const timestamp = new Date().toISOString();

    const assignedConsultantData = {
      id: consultant.id,
      name: consultant.name,
      role: consultant.role || consultant.specialty || "Certified Advisor",
      email: consultant.email,
      phone: consultant.phone
    };

    try {
      await adminApi.patch(`/consultations/${assigningRequest.id}`, {
        status: "ASSIGNED",
        consultantId: consultant.id,
        assignedConsultant: assignedConsultantData,
        internalNotes: assignmentNote || `Assigned to ${consultant.name} (${assignedConsultantData.role})`
      });

      setRequests((prev) =>
        prev.map((req) => {
          if (req.id === assigningRequest.id) {
            return {
              ...req,
              status: "Assigned" as const,
              assignedConsultant: assignedConsultantData,
              history: [
                ...(req.history || []),
                {
                  timestamp,
                  actor: "Admissions Admin",
                  action: `Delegated to ${consultant.name}`,
                  notes: assignmentNote || `Assigned to ${consultant.name} (${assignedConsultantData.role})`
                }
              ],
              updatedAt: timestamp
            };
          }
          return req;
        })
      );

      showToast(`Student "${assigningRequest.studentName}" assigned to ${consultant.name}.`);
    } catch (err: any) {
      showToast(err?.message || "Failed to assign consultant via API.");
    } finally {
      setAssigningRequest(null);
      setAssignmentNote("");
    }
  };


  // Status Change handler
  const handleQuickStatusChange = async (requestId: string, newStatus: StudentConsultationRequest["status"]) => {
    const timestamp = new Date().toISOString();
    const dbStatusMap: Record<StudentConsultationRequest["status"], string> = {
      Pending: "PENDING",
      Assigned: "ASSIGNED",
      "In Progress": "IN_PROGRESS",
      Completed: "COMPLETED",
    };

    try {
      await adminApi.patch(`/consultations/${requestId}`, {
        status: dbStatusMap[newStatus] || "PENDING",
      });

      setRequests((prev) =>
        prev.map((req) => {
          if (req.id === requestId) {
            const updated = {
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
            if (viewingRequest && viewingRequest.id === requestId) {
              setViewingRequest(updated);
            }
            return updated;
          }
          return req;
        })
      );

      showToast(`Consultation status updated to ${newStatus}.`);
    } catch (err: any) {
      showToast(err?.message || "Failed to update consultation status via API.");
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
                            setSelectedConsultantId(consultants[0]?.id || "");
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
                            setSelectedConsultantId(req.assignedConsultant?.id || consultants[0]?.id || "");
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
      {/* 1. ASSIGN CONSULTANT MODAL (Fully Responsive bottom sheet / centered) */}
      {/* ========================================================================= */}
      {assigningRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 shrink-0">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-orange">
                  Advisory Delegation Desk
                </span>
                <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 mt-0.5 truncate">
                  Assign Consultant to {assigningRequest.studentName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAssigningRequest(null)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div><strong className="text-slate-800">Desired Program:</strong> {assigningRequest.desiredProgram}</div>
                <div><strong className="text-slate-800">Target Country:</strong> {assigningRequest.preferredDestination}</div>
                <div><strong className="text-slate-800">Session Format:</strong> {assigningRequest.consultationMode}</div>
              </div>

              <form id="assign-consultant-form" onSubmit={handleConfirmAssignment} className="space-y-4 text-left">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Select Certified Consultant *
                    </label>
                    {onNavigateToConsultants && (
                      <button
                        type="button"
                        onClick={() => {
                          setAssigningRequest(null);
                          onNavigateToConsultants();
                        }}
                        className="text-[11px] font-bold text-[#0A0060] hover:underline cursor-pointer"
                      >
                        Manage Roster &rarr;
                      </button>
                    )}
                  </div>

                  {loadingConsultants ? (
                    <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200">
                      <div className="size-5 rounded-full border-2 border-[#0A0060] border-t-transparent animate-spin mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-semibold">Loading active consultants...</p>
                    </div>
                  ) : consultants.length === 0 ? (
                    <div className="p-5 text-center bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
                      <p className="text-xs font-semibold text-amber-900">No active consultants available yet.</p>
                      <p className="text-[11px] text-amber-700">Add verified advisors to the directory before assigning student bookings.</p>
                      {onNavigateToConsultants ? (
                        <button
                          type="button"
                          onClick={() => {
                            setAssigningRequest(null);
                            onNavigateToConsultants();
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0A0060] text-white text-xs font-bold hover:bg-[#120088] cursor-pointer inline-flex items-center gap-1 mt-1"
                        >
                          <Users className="size-3.5" />
                          <span>Go to Consultants Tab</span>
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {consultants.map((c) => {
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
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-slate-900 text-xs truncate">{c.name}</div>
                              <div className="text-[11px] text-brand-orange font-semibold truncate">{c.role}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5 truncate">{c.email} &bull; {c.phone}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
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
              </form>
            </div>

            {/* Fixed Action Footer */}
            <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-slate-50/50 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setAssigningRequest(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="assign-consultant-form"
                disabled={consultants.length === 0}
                className="px-5 py-2.5 rounded-xl bg-[#0A0060] hover:bg-[#120088] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <UserCheck className="size-3.5" />
                <span>Confirm Assignment</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* 2. STUDENT DOSSIER & CONSULTATION HISTORY MODAL (Fully Responsive) */}
      {/* ========================================================================= */}
      {viewingRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 shrink-0">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-orange">
                  Ref: {viewingRequest.referenceId}
                </span>
                <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 mt-0.5 truncate">
                  {viewingRequest.studentName} — Consultation Dossier
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingRequest(null)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Quick Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 gap-3">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Stage:</div>
                  <div className="font-bold text-sm text-slate-900 mt-0.5">{viewingRequest.status}</div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(["Pending", "Assigned", "In Progress", "Completed"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleQuickStatusChange(viewingRequest.id, st)}
                      className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Contact Information</div>
                  <div className="truncate"><span className="text-slate-500">Email:</span> <strong className="text-slate-800">{viewingRequest.studentEmail}</strong></div>
                  <div className="truncate"><span className="text-slate-500">Phone:</span> <strong className="text-slate-800">{viewingRequest.studentPhone}</strong></div>
                  <div className="truncate"><span className="text-slate-500">Mode:</span> <strong className="text-slate-800">{viewingRequest.consultationMode}</strong></div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Academic Intent</div>
                  <div className="truncate"><span className="text-slate-500">Program:</span> <strong className="text-slate-800">{viewingRequest.desiredProgram}</strong></div>
                  <div className="truncate"><span className="text-slate-500">Destination:</span> <strong className="text-brand-orange">{viewingRequest.preferredDestination}</strong></div>
                  <div className="truncate"><span className="text-slate-500">Intake:</span> <strong className="text-slate-800">{viewingRequest.targetIntake || "September 2026"}</strong></div>
                </div>
              </div>

              {/* Student Inquiry Notes */}
              {viewingRequest.notes && (
                <div className="p-4 rounded-xl bg-orange-50/60 border border-brand-orange/20 text-xs">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">Student Notes & Requirements:</div>
                  <p className="text-slate-700 leading-relaxed italic break-words">"{viewingRequest.notes}"</p>
                </div>
              )}

              {/* Assigned Consultant Details */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
                <div className="font-bold text-blue-900 uppercase tracking-wider text-[10px] mb-2">Responsible Advisor:</div>
                {viewingRequest.assignedConsultant ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-sm truncate">{viewingRequest.assignedConsultant.name}</div>
                      <div className="text-slate-600 text-[11px] truncate">{viewingRequest.assignedConsultant.role}</div>
                      <div className="text-slate-500 text-[10px] truncate">{viewingRequest.assignedConsultant.email} &bull; {viewingRequest.assignedConsultant.phone}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAssigningRequest(viewingRequest);
                        setSelectedConsultantId(viewingRequest.assignedConsultant?.id || consultants[0]?.id || "");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-900 text-xs font-bold hover:bg-blue-100 cursor-pointer self-start sm:self-auto shrink-0"
                    >
                      Change Consultant
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 italic">No consultant currently assigned</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAssigningRequest(viewingRequest);
                        setSelectedConsultantId(consultants[0]?.id || "");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0A0060] text-white text-xs font-bold hover:bg-[#120088] cursor-pointer shrink-0"
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-900 truncate">{h.action}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(h.timestamp).toLocaleDateString()} {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">By: {h.actor}</div>
                        {h.notes && (
                          <div className="text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-slate-100 mt-1.5 break-words">
                            {h.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex items-center justify-end p-4 sm:p-5 border-t border-slate-100 shrink-0 bg-slate-50/50 rounded-b-3xl">
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
