"use client";

import { RoleGuard } from "@/components/role-guard";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Target,
  RefreshCw,
  DollarSign,
  ExternalLink,
  Filter,
  ChevronRight,
  Calendar,
  User,
  CheckCircle2,
} from "lucide-react";
import { adminApi } from "@/lib/api";

interface PipelineLead {
  id: string;
  stage: string;
  source: string;
  estimated_value: number | null;
  currency: string;
  notes: string | null;
  next_followup: string | null;
  assigned_agent: string | null;
  created_at: string;
  user?: { id: string; name: string; email: string; phone: string | null; membership_tier: string } | null;
  inquiry?: { name: string; email: string; message: string } | null;
}

const PIPELINE_STAGES = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATING", "WON", "LOST", "DORMANT"] as const;

const STAGE_CONFIG: Record<string, { label: string; color: string; borderColor: string; dotColor: string }> = {
  NEW: { label: "New", color: "bg-amber-50", borderColor: "border-t-amber-400", dotColor: "bg-amber-400" },
  CONTACTED: { label: "Contacted", color: "bg-sky-50", borderColor: "border-t-sky-400", dotColor: "bg-sky-400" },
  QUALIFIED: { label: "Qualified", color: "bg-violet-50", borderColor: "border-t-violet-400", dotColor: "bg-violet-400" },
  PROPOSAL_SENT: { label: "Proposal Sent", color: "bg-indigo-50", borderColor: "border-t-indigo-400", dotColor: "bg-indigo-400" },
  NEGOTIATING: { label: "Negotiating", color: "bg-orange-50", borderColor: "border-t-orange-400", dotColor: "bg-orange-400" },
  WON: { label: "Won", color: "bg-emerald-50", borderColor: "border-t-emerald-400", dotColor: "bg-emerald-400" },
  LOST: { label: "Lost", color: "bg-rose-50", borderColor: "border-t-rose-400", dotColor: "bg-rose-400" },
  DORMANT: { label: "Dormant", color: "bg-slate-50", borderColor: "border-t-slate-300", dotColor: "bg-slate-400" },
};

const SOURCE_LABELS: Record<string, string> = {
  FLIGHT_SEARCH: "Flight",
  HOTEL_SEARCH: "Hotel",
  TOUR_INQUIRY: "Tour",
  ESIM_ORDER: "eSIM",
  VISA_REQUEST: "Visa",
  DIASPORA_PACKAGE: "Diaspora",
  CORPORATE_INQUIRY: "Corporate",
  TRANSFER_REQUEST: "Transfer",
  CAR_HIRE: "Car Hire",
  DIRECT_SIGNUP: "Direct",
  REFERRAL: "Referral",
  WALK_IN: "Walk-in",
};

const FALLBACK_PIPELINE: Record<string, PipelineLead[]> = {
  NEW: [
    { id: "LP-001", stage: "NEW", source: "TOUR_INQUIRY", estimated_value: 4800, currency: "GHS", notes: "Rwanda Gorilla Trekking for 2 delegates", next_followup: "2026-09-12", assigned_agent: null, created_at: "2026-09-08T09:12:00Z", user: { id: "TRV-105", name: "Amina Diallo", email: "amina.diallo@westafricaconsult.sn", phone: "+221 77 123 4567", membership_tier: "EXPLORER" }, inquiry: null },
    { id: "LP-002", stage: "NEW", source: "VISA_REQUEST", estimated_value: 1200, currency: "GHS", notes: "Student visa guidance - Frankfurt exchange program", next_followup: null, assigned_agent: null, created_at: "2026-09-08T14:30:00Z", user: { id: "TRV-107", name: "Kofi Asante", email: "kofi.asante@ug.edu.gh", phone: "+233 55 987 6543", membership_tier: "EXPLORER" }, inquiry: null },
    { id: "LP-008", stage: "NEW", source: "HOTEL_SEARCH", estimated_value: 3400, currency: "GHS", notes: "Kempinski Hotel Gold Coast - 3 nights executive suite", next_followup: null, assigned_agent: null, created_at: "2026-09-09T08:45:00Z", user: null, inquiry: { name: "James Osei-Bonsu", email: "james.ob@ghanahighcomm.gov.gh", message: "Need confirmed booking for diplomatic delegation" } },
  ],
  CONTACTED: [
    { id: "LP-003", stage: "CONTACTED", source: "DIASPORA_PACKAGE", estimated_value: 12400, currency: "GHS", notes: "Cape Coast Ancestral Pilgrimage - 4 pax, Dec dates requested", next_followup: "2026-09-10", assigned_agent: "Jane Doe", created_at: "2026-09-06T16:00:00Z", user: { id: "TRV-102", name: "Dr. Nia Washington", email: "dr.nia.washington@howard.edu", phone: "+1 404 555 0198", membership_tier: "VOYAGER" }, inquiry: null },
  ],
  QUALIFIED: [
    { id: "LP-004", stage: "QUALIFIED", source: "CORPORATE_INQUIRY", estimated_value: 28000, currency: "GHS", notes: "Gulf Logistics corporate travel mgmt - quarterly flights DXB-ACC, hotel blocks", next_followup: "2026-09-11", assigned_agent: "Kwabena Boateng", created_at: "2026-09-04T10:00:00Z", user: { id: "TRV-108", name: "Fatima Al-Rashid", email: "fatima.rashid@gulflogistics.ae", phone: "+971 50 234 5678", membership_tier: "VOYAGER" }, inquiry: null },
  ],
  PROPOSAL_SENT: [
    { id: "LP-005", stage: "PROPOSAL_SENT", source: "TOUR_INQUIRY", estimated_value: 8600, currency: "GHS", notes: "Kenya-Tanzania Safari 12-day itinerary sent - awaiting family confirmation", next_followup: "2026-09-14", assigned_agent: "Jane Doe", created_at: "2026-09-02T11:00:00Z", user: { id: "TRV-106", name: "Eshe Adebayo", email: "eshe.adebayo@zenithcapital.ng", phone: "+234 803 123 4567", membership_tier: "ELITE" }, inquiry: null },
  ],
  NEGOTIATING: [],
  WON: [
    { id: "LP-006", stage: "WON", source: "FLIGHT_SEARCH", estimated_value: 12400, currency: "GHS", notes: "Emirates EK788 ACC→DXB - converted to confirmed booking", next_followup: null, assigned_agent: "Jane Doe", created_at: "2026-08-28T09:00:00Z", user: { id: "TRV-101", name: "Kwame Mensah", email: "kwame.mensah@enterprise-gh.com", phone: "+233 24 123 4567", membership_tier: "ELITE" }, inquiry: null },
  ],
  LOST: [],
  DORMANT: [],
};

function formatDate(d: string) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function daysInStage(createdAt: string) {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
}

export default function LeadPipelineBoardPage() {
  const [pipeline, setPipeline] = useState<Record<string, PipelineLead[]>>(FALLBACK_PIPELINE);
  const [loading, setLoading] = useState(false);
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [agentFilter, setAgentFilter] = useState("ALL");

  const fetchPipeline = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (sourceFilter !== "ALL") params.set("source", sourceFilter);
      if (agentFilter !== "ALL") params.set("agent", agentFilter);
      const res = await adminApi.get<{ pipeline: Record<string, PipelineLead[]>; total: number }>(`/crm/pipeline?${params.toString()}`);
      if (res?.pipeline) setPipeline(res.pipeline);
    } catch {
      // Use fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, [sourceFilter, agentFilter]);

  const totalLeads = Object.values(pipeline).flat().length;
  const totalValue = Object.values(pipeline).flat().reduce((s, l) => s + Number(l.estimated_value || 0), 0);
  const activeLeads = Object.entries(pipeline).filter(([stage]) => !["WON", "LOST", "DORMANT"].includes(stage)).flatMap(([, leads]) => leads).length;

  const handleStageUpdate = async (leadId: string, newStage: string) => {
    try {
      await adminApi.patch(`/crm/pipeline/${leadId}`, { stage: newStage });
      // Optimistic update
      const updatedPipeline = { ...pipeline };
      for (const stage of Object.keys(updatedPipeline)) {
        const idx = updatedPipeline[stage].findIndex((l) => l.id === leadId);
        if (idx !== -1) {
          const [lead] = updatedPipeline[stage].splice(idx, 1);
          lead.stage = newStage;
          if (!updatedPipeline[newStage]) updatedPipeline[newStage] = [];
          updatedPipeline[newStage].push(lead);
          break;
        }
      }
      setPipeline({ ...updatedPipeline });
    } catch {
      // Revert on error
      fetchPipeline();
    }
  };

  const agents = [...new Set(Object.values(pipeline).flat().map((l) => l.assigned_agent).filter(Boolean))];

  return (
    <div className="space-y-6">
      <Link href="/travelers" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="size-3.5" /> Back to Customer CRM
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Lead Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage inquiries from search to conversion</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <option value="ALL">All Sources</option>
            {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <option value="ALL">All Agents</option>
            {agents.map((a) => <option key={a} value={a!}>{a}</option>)}
          </select>
          <button
            onClick={fetchPipeline}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-100 p-3">
          <p className="text-[10px] font-medium text-slate-400 uppercase">Total Leads</p>
          <p className="text-2xl font-extrabold text-slate-900">{totalLeads}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-3">
          <p className="text-[10px] font-medium text-slate-400 uppercase">Active Pipeline</p>
          <p className="text-2xl font-extrabold text-slate-900">{activeLeads}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-3">
          <p className="text-[10px] font-medium text-slate-400 uppercase">Pipeline Value</p>
          <p className="text-2xl font-extrabold text-slate-900">₵{totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 overflow-x-auto">
        <div className="grid grid-cols-8 gap-3 min-w-[1400px]">
          {PIPELINE_STAGES.map((stage) => {
            const cfg = STAGE_CONFIG[stage];
            const leads = pipeline[stage] || [];
            const stageValue = leads.reduce((s, l) => s + Number(l.estimated_value || 0), 0);

            return (
              <div key={stage} className={`rounded-xl border-t-2 ${cfg.borderColor} ${cfg.color} p-2.5 min-h-[300px]`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`size-2 rounded-full ${cfg.dotColor}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{cfg.label}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white/60 px-1.5 py-0.5 rounded">{leads.length}</span>
                </div>
                {stageValue > 0 && (
                  <p className="text-[10px] font-semibold text-slate-500 mb-2">₵{stageValue.toLocaleString()}</p>
                )}

                <div className="space-y-2">
                  {leads.map((lead) => {
                    const days = daysInStage(lead.created_at);
                    return (
                      <div key={lead.id} className="bg-white rounded-lg p-3 border border-slate-100/80 shadow-xs hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between mb-1.5">
                          <Link
                            href={lead.user ? `/travelers/${lead.user.id}` : "#"}
                            className="text-[11px] font-bold text-slate-800 hover:text-slate-900 transition-colors truncate"
                          >
                            {lead.user?.name || lead.inquiry?.name || "-"}
                          </Link>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mb-2">{lead.notes || "No notes"}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-semibold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">
                            {SOURCE_LABELS[lead.source] || lead.source}
                          </span>
                          {lead.estimated_value && (
                            <span className="text-[10px] font-bold text-emerald-600">₵{Number(lead.estimated_value).toLocaleString()}</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                          <span className="text-[9px] text-slate-400">{days}d in stage</span>
                          {lead.next_followup && (
                            <span className="flex items-center gap-0.5 text-[9px] text-slate-400">
                              <Calendar className="size-2.5" />
                              {formatDate(lead.next_followup)}
                            </span>
                          )}
                        </div>

                        {lead.assigned_agent && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <User className="size-2.5 text-slate-400" />
                            <span className="text-[9px] text-slate-400">{lead.assigned_agent}</span>
                          </div>
                        )}

                        {/* Stage progression buttons */}
                        {!["WON", "LOST", "DORMANT"].includes(stage) && (
                          <div className="flex gap-1 mt-2">
                            {stage !== "NEGOTIATING" && (
                              <button
                                onClick={() => {
                                  const idx = PIPELINE_STAGES.indexOf(stage);
                                  if (idx < PIPELINE_STAGES.length - 3) handleStageUpdate(lead.id, PIPELINE_STAGES[idx + 1]);
                                }}
                                className="flex-1 text-[9px] font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
                              >
                                Advance →
                              </button>
                            )}
                            <button
                              onClick={() => handleStageUpdate(lead.id, "WON")}
                              className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition-colors"
                            >
                              Won
                            </button>
                            <button
                              onClick={() => handleStageUpdate(lead.id, "LOST")}
                              className="text-[9px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded transition-colors"
                            >
                              Lost
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {leads.length === 0 && (
                    <p className="text-[10px] text-slate-300 text-center py-8 italic">Empty</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
