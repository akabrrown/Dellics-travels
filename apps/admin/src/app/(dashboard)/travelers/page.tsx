import { RoleGuard } from "@/components/role-guard";
"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  User,
  Shield,
  Award,
  Crown,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  MessageSquare,
  Compass,
  Plane,
  Building2,
  Globe,
  FileText,
  DollarSign,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  ExternalLink,
  TrendingUp,
  AlertTriangle,
  Wifi,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Zap,
  BarChart3,
} from "lucide-react";
import { adminApi } from "@/lib/api";

/* ─── Types ─── */

export interface CRMTravelerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  membershipTier: "EXPLORER" | "VOYAGER" | "ELITE";
  pointsBalance: number;
  totalTrips: number;
  totalBookings: number;
  lifetimeSpendGhs: number;
  lifetimeSpendUsd: number;
  activeProducts: ("FLIGHTS" | "HOTELS" | "TOURS" | "ESIM" | "DIASPORA" | "VISA")[];
  currentStatus: "IN_TRANSIT" | "CONFIRMED" | "LEAD" | "COMPLETED" | "INACTIVE";
  primaryRouteOrInterest: string;
  lastActive: string;
  passportVerified: boolean;
  passportExpiry: string;
  hasOpenInquiry: boolean;
  inquirySummary?: string;
  eSimActive?: boolean;
  leadSource?: string | null;
  churnRiskDays?: number;
}

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

interface CRMStats {
  totalCustomers: number;
  activeThisMonth: number;
  newLeads7d: number;
  conversionRate: number;
  activeEsims: number;
  openInquiries: number;
  atRiskCount: number;
  wonLeads: number;
}

/* ─── Fallback Data ─── */

const FALLBACK_CRM_RECORDS: CRMTravelerRecord[] = [
  {
    id: "TRV-101",
    name: "Kwame Mensah",
    email: "kwame.mensah@enterprise-gh.com",
    phone: "+233 24 123 4567",
    country: "Ghana",
    countryCode: "GH",
    membershipTier: "ELITE",
    pointsBalance: 12450,
    totalTrips: 18,
    totalBookings: 24,
    lifetimeSpendGhs: 64200,
    lifetimeSpendUsd: 4140,
    activeProducts: ["FLIGHTS", "HOTELS", "ESIM"],
    currentStatus: "IN_TRANSIT",
    primaryRouteOrInterest: "ACC → DXB (Emirates EK788)",
    lastActive: "Today, 10:14 AM",
    passportVerified: true,
    passportExpiry: "2031-08-14",
    hasOpenInquiry: false,
    eSimActive: true,
    leadSource: null,
    churnRiskDays: 0,
  },
  {
    id: "TRV-102",
    name: "Dr. Nia Washington",
    email: "dr.nia.washington@howard.edu",
    phone: "+1 404 555 0198",
    country: "United States",
    countryCode: "US",
    membershipTier: "VOYAGER",
    pointsBalance: 6800,
    totalTrips: 4,
    totalBookings: 6,
    lifetimeSpendGhs: 42800,
    lifetimeSpendUsd: 2760,
    activeProducts: ["DIASPORA", "TOURS", "HOTELS", "ESIM"],
    currentStatus: "CONFIRMED",
    primaryRouteOrInterest: "Dec in GH: Cape Coast Ancestral Pilgrimage",
    lastActive: "Yesterday at 04:30 PM",
    passportVerified: true,
    passportExpiry: "2029-11-20",
    hasOpenInquiry: true,
    inquirySummary: "Requested private Elmina Castle naming ceremony extension for 4 pax",
    eSimActive: true,
    leadSource: "DIASPORA_PACKAGE",
    churnRiskDays: 1,
  },
  {
    id: "TRV-103",
    name: "Akosua Boateng",
    email: "akosua.b@kumasitrading.com",
    phone: "+233 20 876 5432",
    country: "Ghana",
    countryCode: "GH",
    membershipTier: "ELITE",
    pointsBalance: 9500,
    totalTrips: 9,
    totalBookings: 12,
    lifetimeSpendGhs: 38900,
    lifetimeSpendUsd: 2510,
    activeProducts: ["FLIGHTS", "HOTELS", "TOURS"],
    currentStatus: "CONFIRMED",
    primaryRouteOrInterest: "Cape Town Family Escape (Radisson Blu)",
    lastActive: "2 days ago",
    passportVerified: true,
    passportExpiry: "2028-04-12",
    hasOpenInquiry: false,
    eSimActive: false,
    leadSource: null,
    churnRiskDays: 2,
  },
  {
    id: "TRV-104",
    name: "Marcus Sterling",
    email: "marcus.sterling@techpartners.co.uk",
    phone: "+44 7700 900123",
    country: "United Kingdom",
    countryCode: "GB",
    membershipTier: "VOYAGER",
    pointsBalance: 4200,
    totalTrips: 5,
    totalBookings: 7,
    lifetimeSpendGhs: 26400,
    lifetimeSpendUsd: 1700,
    activeProducts: ["FLIGHTS", "ESIM"],
    currentStatus: "IN_TRANSIT",
    primaryRouteOrInterest: "ACC → LHR (British Airways BA078)",
    lastActive: "3 hours ago",
    passportVerified: true,
    passportExpiry: "2027-02-18",
    hasOpenInquiry: false,
    eSimActive: true,
    leadSource: "FLIGHT_SEARCH",
    churnRiskDays: 0,
  },
  {
    id: "TRV-105",
    name: "Amina Diallo",
    email: "amina.diallo@westafricaconsult.sn",
    phone: "+221 77 123 4567",
    country: "Senegal",
    countryCode: "SN",
    membershipTier: "EXPLORER",
    pointsBalance: 1100,
    totalTrips: 2,
    totalBookings: 2,
    lifetimeSpendGhs: 14600,
    lifetimeSpendUsd: 940,
    activeProducts: ["VISA", "TOURS"],
    currentStatus: "LEAD",
    primaryRouteOrInterest: "Rwanda Gorilla Trekking & Kenya Safari Quote",
    lastActive: "Yesterday at 09:12 AM",
    passportVerified: false,
    passportExpiry: "2026-10-05",
    hasOpenInquiry: true,
    inquirySummary: "Requires East Africa Tourist Visa assistance for 2 delegates",
    eSimActive: false,
    leadSource: "VISA_REQUEST",
    churnRiskDays: 1,
  },
  {
    id: "TRV-106",
    name: "Eshe Adebayo",
    email: "eshe.adebayo@zenithcapital.ng",
    phone: "+234 803 123 4567",
    country: "Nigeria",
    countryCode: "NG",
    membershipTier: "ELITE",
    pointsBalance: 15300,
    totalTrips: 11,
    totalBookings: 15,
    lifetimeSpendGhs: 58400,
    lifetimeSpendUsd: 3770,
    activeProducts: ["HOTELS", "TOURS", "ESIM"],
    currentStatus: "COMPLETED",
    primaryRouteOrInterest: "Zanzibar Luxury Honeymoon Villa Retreat",
    lastActive: "3 days ago",
    passportVerified: true,
    passportExpiry: "2030-05-15",
    hasOpenInquiry: false,
    eSimActive: true,
    leadSource: null,
    churnRiskDays: 3,
  },
  {
    id: "TRV-107",
    name: "Kofi Asante",
    email: "kofi.asante@ug.edu.gh",
    phone: "+233 55 987 6543",
    country: "Ghana",
    countryCode: "GH",
    membershipTier: "EXPLORER",
    pointsBalance: 850,
    totalTrips: 1,
    totalBookings: 1,
    lifetimeSpendGhs: 8200,
    lifetimeSpendUsd: 530,
    activeProducts: ["FLIGHTS", "VISA"],
    currentStatus: "LEAD",
    primaryRouteOrInterest: "Student Academic Exchange: ACC → FRA",
    lastActive: "5 hours ago",
    passportVerified: true,
    passportExpiry: "2029-01-10",
    hasOpenInquiry: true,
    inquirySummary: "Inquiring about student excess baggage allowance on FX Flights GDS",
    eSimActive: false,
    leadSource: "FLIGHT_SEARCH",
    churnRiskDays: 0,
  },
  {
    id: "TRV-108",
    name: "Fatima Al-Rashid",
    email: "fatima.rashid@gulflogistics.ae",
    phone: "+971 50 234 5678",
    country: "UAE",
    countryCode: "AE",
    membershipTier: "VOYAGER",
    pointsBalance: 5200,
    totalTrips: 6,
    totalBookings: 8,
    lifetimeSpendGhs: 31500,
    lifetimeSpendUsd: 2030,
    activeProducts: ["FLIGHTS", "HOTELS"],
    currentStatus: "CONFIRMED",
    primaryRouteOrInterest: "DXB → ACC (Return) Corporate Account",
    lastActive: "1 hour ago",
    passportVerified: true,
    passportExpiry: "2032-03-22",
    hasOpenInquiry: false,
    eSimActive: false,
    leadSource: "CORPORATE_INQUIRY",
    churnRiskDays: 0,
  },
];

const FALLBACK_PIPELINE: Record<string, PipelineLead[]> = {
  NEW: [
    { id: "LP-001", stage: "NEW", source: "TOUR_INQUIRY", estimated_value: 4800, currency: "GHS", notes: "Rwanda Gorilla Trekking for 2", next_followup: "2026-09-12", assigned_agent: null, created_at: "2026-09-08T09:12:00Z", user: { id: "TRV-105", name: "Amina Diallo", email: "amina.diallo@westafricaconsult.sn", phone: "+221 77 123 4567", membership_tier: "EXPLORER" }, inquiry: null },
    { id: "LP-002", stage: "NEW", source: "VISA_REQUEST", estimated_value: 1200, currency: "GHS", notes: "Student visa guidance for Frankfurt exchange", next_followup: null, assigned_agent: null, created_at: "2026-09-08T14:30:00Z", user: { id: "TRV-107", name: "Kofi Asante", email: "kofi.asante@ug.edu.gh", phone: "+233 55 987 6543", membership_tier: "EXPLORER" }, inquiry: null },
  ],
  CONTACTED: [
    { id: "LP-003", stage: "CONTACTED", source: "DIASPORA_PACKAGE", estimated_value: 12400, currency: "GHS", notes: "Cape Coast Ancestral Pilgrimage — 4 pax, Dec dates", next_followup: "2026-09-10", assigned_agent: "Jane Doe", created_at: "2026-09-06T16:00:00Z", user: { id: "TRV-102", name: "Dr. Nia Washington", email: "dr.nia.washington@howard.edu", phone: "+1 404 555 0198", membership_tier: "VOYAGER" }, inquiry: null },
  ],
  QUALIFIED: [
    { id: "LP-004", stage: "QUALIFIED", source: "CORPORATE_INQUIRY", estimated_value: 28000, currency: "GHS", notes: "Gulf Logistics corporate travel management account — quarterly flights DXB-ACC", next_followup: "2026-09-11", assigned_agent: "Kwabena Boateng", created_at: "2026-09-04T10:00:00Z", user: { id: "TRV-108", name: "Fatima Al-Rashid", email: "fatima.rashid@gulflogistics.ae", phone: "+971 50 234 5678", membership_tier: "VOYAGER" }, inquiry: null },
  ],
  PROPOSAL_SENT: [],
  NEGOTIATING: [],
  WON: [],
  LOST: [],
  DORMANT: [],
};

const FALLBACK_STATS: CRMStats = {
  totalCustomers: 847,
  activeThisMonth: 312,
  newLeads7d: 23,
  conversionRate: 34,
  activeEsims: 156,
  openInquiries: 18,
  atRiskCount: 42,
  wonLeads: 89,
};

/* ─── Helpers ─── */

const TIER_STYLES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  EXPLORER: { bg: "bg-slate-100", text: "text-slate-700", icon: <Compass className="size-3" /> },
  VOYAGER: { bg: "bg-sky-50", text: "text-sky-700", icon: <Award className="size-3" /> },
  ELITE: { bg: "bg-amber-50", text: "text-amber-700", icon: <Crown className="size-3" /> },
};

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  IN_TRANSIT: { dot: "bg-emerald-500 animate-pulse", label: "In Transit" },
  CONFIRMED: { dot: "bg-blue-500", label: "Confirmed" },
  LEAD: { dot: "bg-amber-400", label: "Lead" },
  COMPLETED: { dot: "bg-slate-400", label: "Completed" },
  INACTIVE: { dot: "bg-rose-400", label: "Inactive" },
};

const PRODUCT_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  FLIGHTS: { icon: <Plane className="size-3" />, color: "text-sky-600 bg-sky-50" },
  HOTELS: { icon: <Building2 className="size-3" />, color: "text-emerald-600 bg-emerald-50" },
  TOURS: { icon: <Compass className="size-3" />, color: "text-violet-600 bg-violet-50" },
  ESIM: { icon: <Wifi className="size-3" />, color: "text-orange-600 bg-orange-50" },
  VISA: { icon: <FileText className="size-3" />, color: "text-rose-600 bg-rose-50" },
  DIASPORA: { icon: <Globe className="size-3" />, color: "text-teal-600 bg-teal-50" },
};

const LEAD_SOURCE_LABELS: Record<string, string> = {
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

const PIPELINE_STAGES = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATING", "WON", "LOST"] as const;
const PIPELINE_STAGE_COLORS: Record<string, string> = {
  NEW: "border-t-amber-400",
  CONTACTED: "border-t-sky-400",
  QUALIFIED: "border-t-violet-400",
  PROPOSAL_SENT: "border-t-indigo-400",
  NEGOTIATING: "border-t-orange-400",
  WON: "border-t-emerald-400",
  LOST: "border-t-rose-400",
};

type SegmentFilter = "ALL" | "ACTIVE" | "LEADS" | "DIASPORA" | "VIP" | "ESIM" | "CORPORATE" | "AT_RISK" | "DORMANT";
type ViewMode = "TABLE" | "PIPELINE";

/* ─── Component ─── */

export default function CustomerCRMCommandCenter() {
  const [travelers, setTravelers] = useState<CRMTravelerRecord[]>(FALLBACK_CRM_RECORDS);
  const [pipeline, setPipeline] = useState<Record<string, PipelineLead[]>>(FALLBACK_PIPELINE);
  const [stats, setStats] = useState<CRMStats>(FALLBACK_STATS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSegment, setActiveSegment] = useState<SegmentFilter>("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<ViewMode>("TABLE");
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const fetchCRMData = async () => {
    try {
      setLoading(true);
      const [customersRes, pipelineRes, statsRes] = await Promise.allSettled([
        adminApi.get<{ data: CRMTravelerRecord[]; total: number }>("/crm/customers?limit=100"),
        adminApi.get<{ pipeline: Record<string, PipelineLead[]> }>("/crm/pipeline"),
        adminApi.get<CRMStats>("/crm/stats"),
      ]);

      if (customersRes.status === "fulfilled" && customersRes.value?.data?.length > 0) {
        setTravelers(customersRes.value.data);
        setSyncNotice(`CRM synced — ${customersRes.value.total} customers loaded from live database`);
      }
      if (pipelineRes.status === "fulfilled" && pipelineRes.value?.pipeline) {
        setPipeline(pipelineRes.value.pipeline);
      }
      if (statsRes.status === "fulfilled" && statsRes.value?.totalCustomers !== undefined) {
        setStats(statsRes.value);
      }
    } catch {
      setSyncNotice(null);
    } finally {
      setLoading(false);
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  useEffect(() => {
    fetchCRMData();
  }, []);

  const filtered = useMemo(() => {
    let result = [...travelers];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.phone.includes(q) ||
          t.primaryRouteOrInterest.toLowerCase().includes(q),
      );
    }

    if (activeSegment === "ACTIVE") result = result.filter((t) => ["IN_TRANSIT", "CONFIRMED"].includes(t.currentStatus));
    else if (activeSegment === "LEADS") result = result.filter((t) => t.currentStatus === "LEAD" || t.hasOpenInquiry);
    else if (activeSegment === "DIASPORA") result = result.filter((t) => t.activeProducts.includes("DIASPORA"));
    else if (activeSegment === "VIP") result = result.filter((t) => t.membershipTier === "ELITE");
    else if (activeSegment === "ESIM") result = result.filter((t) => t.eSimActive || t.activeProducts.includes("ESIM"));
    else if (activeSegment === "CORPORATE") result = result.filter((t) => t.leadSource === "CORPORATE_INQUIRY");
    else if (activeSegment === "AT_RISK") result = result.filter((t) => (t.churnRiskDays || 0) >= 60);
    else if (activeSegment === "DORMANT") result = result.filter((t) => (t.churnRiskDays || 0) >= 90);

    if (tierFilter !== "ALL") result = result.filter((t) => t.membershipTier === tierFilter);
    if (serviceFilter !== "ALL") result = result.filter((t) => t.activeProducts.includes(serviceFilter as any));

    return result;
  }, [travelers, search, activeSegment, tierFilter, serviceFilter]);

  const segments: { key: SegmentFilter; label: string; count: number; icon: React.ReactNode }[] = [
    { key: "ALL", label: "All Customers", count: travelers.length, icon: <Users className="size-3.5" /> },
    { key: "ACTIVE", label: "Active", count: travelers.filter((t) => ["IN_TRANSIT", "CONFIRMED"].includes(t.currentStatus)).length, icon: <Zap className="size-3.5" /> },
    { key: "LEADS", label: "Leads", count: travelers.filter((t) => t.currentStatus === "LEAD" || t.hasOpenInquiry).length, icon: <Target className="size-3.5" /> },
    { key: "DIASPORA", label: "Diaspora", count: travelers.filter((t) => t.activeProducts.includes("DIASPORA")).length, icon: <Globe className="size-3.5" /> },
    { key: "VIP", label: "VIP / Elite", count: travelers.filter((t) => t.membershipTier === "ELITE").length, icon: <Crown className="size-3.5" /> },
    { key: "ESIM", label: "eSIM", count: travelers.filter((t) => t.eSimActive || t.activeProducts.includes("ESIM")).length, icon: <Wifi className="size-3.5" /> },
    { key: "CORPORATE", label: "Corporate", count: travelers.filter((t) => t.leadSource === "CORPORATE_INQUIRY").length, icon: <Building2 className="size-3.5" /> },
    { key: "AT_RISK", label: "At Risk", count: travelers.filter((t) => (t.churnRiskDays || 0) >= 60).length, icon: <AlertTriangle className="size-3.5" /> },
    { key: "DORMANT", label: "Dormant", count: travelers.filter((t) => (t.churnRiskDays || 0) >= 90).length, icon: <Clock className="size-3.5" /> },
  ];

  const totalPipelineValue = Object.values(pipeline).flat().reduce((s, l) => s + Number(l.estimated_value || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Customer CRM</h1>
          <p className="text-xs text-slate-500 mt-0.5">Unified customer lifecycle · Lead pipeline · Revenue attribution</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("TABLE")}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all ${viewMode === "TABLE" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Directory
            </button>
            <button
              onClick={() => setViewMode("PIPELINE")}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all ${viewMode === "PIPELINE" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Pipeline
            </button>
          </div>
          <button
            onClick={fetchCRMData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Sync CRM
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
            <Download className="size-3.5" />
            Export
          </button>
        </div>
      </div>

      {syncNotice && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] font-medium text-emerald-700 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="size-3.5 shrink-0" />
          {syncNotice}
        </div>
      )}

      {/* KPI Strip — 8 metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "Customers", value: stats.totalCustomers.toLocaleString(), icon: <Users className="size-4" />, color: "text-slate-600", bg: "bg-slate-50" },
          { label: "Active (30d)", value: stats.activeThisMonth.toLocaleString(), icon: <Zap className="size-4" />, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "New Leads (7d)", value: stats.newLeads7d.toString(), icon: <Target className="size-4" />, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Conversion", value: `${stats.conversionRate}%`, icon: <TrendingUp className="size-4" />, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Pipeline Value", value: `₵${(totalPipelineValue / 1000).toFixed(0)}k`, icon: <DollarSign className="size-4" />, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Active eSIMs", value: stats.activeEsims.toString(), icon: <Wifi className="size-4" />, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Open Inquiries", value: stats.openInquiries.toString(), icon: <MessageSquare className="size-4" />, color: "text-sky-600", bg: "bg-sky-50" },
          { label: "At Risk", value: stats.atRiskCount.toString(), icon: <AlertTriangle className="size-4" />, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-100 p-3 hover:shadow-sm transition-shadow">
            <div className={`inline-flex items-center justify-center size-7 rounded-lg ${kpi.bg} ${kpi.color} mb-2`}>
              {kpi.icon}
            </div>
            <p className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">{kpi.value}</p>
            <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, phone, or route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <option value="ALL">All Tiers</option>
            <option value="ELITE">Elite</option>
            <option value="VOYAGER">Voyager</option>
            <option value="EXPLORER">Explorer</option>
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <option value="ALL">All Products</option>
            <option value="FLIGHTS">Flights</option>
            <option value="HOTELS">Hotels</option>
            <option value="TOURS">Tours</option>
            <option value="ESIM">eSIM</option>
            <option value="VISA">Visa</option>
            <option value="DIASPORA">Diaspora</option>
          </select>
        </div>
      </div>

      {/* Segment Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {segments.map((seg) => (
          <button
            key={seg.key}
            onClick={() => setActiveSegment(seg.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              activeSegment === seg.key
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {seg.icon}
            {seg.label}
            <span className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activeSegment === seg.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
            }`}>
              {seg.count}
            </span>
          </button>
        ))}
      </div>

      {/* Pipeline View */}
      {viewMode === "PIPELINE" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Lead Pipeline Board</h2>
            <Link
              href="/travelers/pipeline"
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Full Pipeline View <ExternalLink className="size-3" />
            </Link>
          </div>
          <div className="grid grid-cols-7 gap-3 overflow-x-auto">
            {PIPELINE_STAGES.map((stage) => {
              const leads = pipeline[stage] || [];
              const stageValue = leads.reduce((s, l) => s + Number(l.estimated_value || 0), 0);
              return (
                <div key={stage} className={`min-w-[180px] bg-slate-50/60 rounded-xl border-t-2 ${PIPELINE_STAGE_COLORS[stage]} p-2.5`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stage.replace("_", " ")}</span>
                    <span className="text-[10px] font-semibold text-slate-400">{leads.length}</span>
                  </div>
                  {stageValue > 0 && (
                    <p className="text-[10px] font-medium text-slate-400 mb-2">₵{stageValue.toLocaleString()}</p>
                  )}
                  <div className="space-y-2">
                    {leads.map((lead) => (
                      <Link
                        key={lead.id}
                        href={lead.user ? `/travelers/${lead.user.id}` : "#"}
                        className="block bg-white rounded-lg p-2.5 border border-slate-100 hover:shadow-sm hover:border-slate-200 transition-all group"
                      >
                        <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-slate-900">{lead.user?.name || lead.inquiry?.name || "—"}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{lead.notes || "No notes"}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">
                            {LEAD_SOURCE_LABELS[lead.source] || lead.source}
                          </span>
                          {lead.estimated_value && (
                            <span className="text-[10px] font-bold text-emerald-600">₵{Number(lead.estimated_value).toLocaleString()}</span>
                          )}
                        </div>
                        {lead.assigned_agent && (
                          <p className="text-[9px] text-slate-400 mt-1.5">→ {lead.assigned_agent}</p>
                        )}
                      </Link>
                    ))}
                    {leads.length === 0 && (
                      <p className="text-[10px] text-slate-300 text-center py-4 italic">No leads</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Directory Table View */}
      {viewMode === "TABLE" && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Tier</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Products</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">LTV (GHS)</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Bookings</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Activity</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Last Active</th>
                  <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((t) => {
                  const tierStyle = TIER_STYLES[t.membershipTier];
                  const statusStyle = STATUS_STYLES[t.currentStatus] || STATUS_STYLES.INACTIVE;
                  return (
                    <tr key={t.id} className="hover:bg-slate-25 group transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                            {t.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{t.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{t.email}</p>
                            {t.phone && <p className="text-[10px] text-slate-400">{t.phone}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${tierStyle.bg} ${tierStyle.text}`}>
                          {tierStyle.icon}
                          {t.membershipTier}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`size-2 rounded-full ${statusStyle.dot}`} />
                          <span className="text-[11px] font-medium text-slate-600">{statusStyle.label}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {t.activeProducts.slice(0, 4).map((p) => {
                            const pi = PRODUCT_ICONS[p];
                            return pi ? (
                              <span key={p} className={`inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded ${pi.color}`}>
                                {pi.icon}
                              </span>
                            ) : null;
                          })}
                          {t.activeProducts.length > 4 && (
                            <span className="text-[9px] font-semibold text-slate-400 px-1">+{t.activeProducts.length - 4}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-xs font-bold text-slate-800">₵{t.lifetimeSpendGhs.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">${t.lifetimeSpendUsd.toLocaleString()}</p>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-xs font-bold text-slate-700">{t.totalBookings}</span>
                      </td>
                      <td className="px-3 py-3 max-w-[200px]">
                        <p className="text-[11px] text-slate-600 truncate">{t.primaryRouteOrInterest}</p>
                        {t.hasOpenInquiry && t.inquirySummary && (
                          <p className="text-[10px] text-amber-600 truncate mt-0.5">⚡ {t.inquirySummary}</p>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-[11px] text-slate-400">{typeof t.lastActive === "string" ? t.lastActive : "—"}</span>
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          href={`/travelers/${t.id}`}
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Eye className="size-3.5" />
                          <ChevronRight className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <User className="size-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-400">No customers match your filters</p>
              <p className="text-xs text-slate-300 mt-1">Try adjusting the search or segment filters</p>
            </div>
          )}

          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-400">
              Showing <span className="font-bold text-slate-600">{filtered.length}</span> of{" "}
              <span className="font-bold text-slate-600">{travelers.length}</span> customers
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">
                {travelers.filter((t) => t.membershipTier === "ELITE").length} ELITE ·{" "}
                {travelers.filter((t) => t.membershipTier === "VOYAGER").length} VOYAGER ·{" "}
                {travelers.filter((t) => t.membershipTier === "EXPLORER").length} EXPLORER
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
