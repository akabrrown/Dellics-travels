"use client";

import { RoleGuard } from "@/components/role-guard";
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
  Star,
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
  Trash2,
  X } from "lucide-react";
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

const EMPTY_STATS: CRMStats = {
  totalCustomers: 0,
  activeThisMonth: 0,
  newLeads7d: 0,
  conversionRate: 0,
  activeEsims: 0,
  openInquiries: 0,
  atRiskCount: 0,
  wonLeads: 0,
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

const CRM_STORAGE_KEY = "dellics_crm_travelers";

const DEFAULT_CRM_TRAVELERS: CRMTravelerRecord[] = [
  {
    id: "trav-01",
    name: "Kwame Asante Mensah",
    email: "kwame.mensah@ghanaexec.com",
    phone: "+233 24 456 7890",
    country: "Ghana",
    countryCode: "GH",
    membershipTier: "ELITE",
    pointsBalance: 14250,
    totalTrips: 8,
    totalBookings: 11,
    lifetimeSpendGhs: 148500,
    lifetimeSpendUsd: 11880,
    activeProducts: ["FLIGHTS", "HOTELS", "ESIM", "DIASPORA"],
    currentStatus: "IN_TRANSIT",
    primaryRouteOrInterest: "Accra (ACC) ⇄ London Heathrow (LHR) Business",
    lastActive: "Today, 08:30 GMT",
    passportVerified: true,
    passportExpiry: "2031-08-15",
    hasOpenInquiry: true,
    inquirySummary: "LHR Chauffeur Transfer confirmation",
    eSimActive: true,
    leadSource: "CORPORATE_INQUIRY",
    churnRiskDays: 12
  },
  {
    id: "trav-02",
    name: "Dr. Abena Serwaa Boateng",
    email: "abena.boateng@korlebu.edu.gh",
    phone: "+233 20 890 1234",
    country: "Ghana",
    countryCode: "GH",
    membershipTier: "VOYAGER",
    pointsBalance: 6800,
    totalTrips: 4,
    totalBookings: 6,
    lifetimeSpendGhs: 64200,
    lifetimeSpendUsd: 5136,
    activeProducts: ["FLIGHTS", "VISA", "HOTELS"],
    currentStatus: "CONFIRMED",
    primaryRouteOrInterest: "Accra (ACC) ⇄ Toronto Pearson (YYZ)",
    lastActive: "Yesterday",
    passportVerified: true,
    passportExpiry: "2029-04-10",
    hasOpenInquiry: false,
    eSimActive: false,
    leadSource: "DIRECT_SIGNUP",
    churnRiskDays: 24
  },
  {
    id: "trav-03",
    name: "Marcus Chukwuemeka Osei",
    email: "marcus.osei@londonfin.co.uk",
    phone: "+44 7700 900123",
    country: "United Kingdom",
    countryCode: "GB",
    membershipTier: "ELITE",
    pointsBalance: 21500,
    totalTrips: 12,
    totalBookings: 15,
    lifetimeSpendGhs: 210000,
    lifetimeSpendUsd: 16800,
    activeProducts: ["DIASPORA", "FLIGHTS", "TOURS", "HOTELS"],
    currentStatus: "CONFIRMED",
    primaryRouteOrInterest: "December in GH · Heritage & Chale Wote VIP Package",
    lastActive: "2 days ago",
    passportVerified: true,
    passportExpiry: "2032-11-20",
    hasOpenInquiry: true,
    inquirySummary: "Elmina Castle Private Tour Guide requested",
    eSimActive: true,
    leadSource: "DIASPORA_PACKAGE",
    churnRiskDays: 18
  },
  {
    id: "trav-04",
    name: "Nana Akua Frimpong",
    email: "nana.akua@gmail.com",
    phone: "+233 55 312 9988",
    country: "Ghana",
    countryCode: "GH",
    membershipTier: "EXPLORER",
    pointsBalance: 1200,
    totalTrips: 1,
    totalBookings: 2,
    lifetimeSpendGhs: 14500,
    lifetimeSpendUsd: 1160,
    activeProducts: ["VISA", "FLIGHTS"],
    currentStatus: "LEAD",
    primaryRouteOrInterest: "Schengen Visa Consultation (Germany/France)",
    lastActive: "Today, 10:15 GMT",
    passportVerified: false,
    passportExpiry: "2027-02-18",
    hasOpenInquiry: true,
    inquirySummary: "French Embassy appointment slot query",
    eSimActive: false,
    leadSource: "VISA_REQUEST",
    churnRiskDays: 5
  },
  {
    id: "trav-05",
    name: "David Kojo Acheampong",
    email: "david.acheampong@stanbic.com.gh",
    phone: "+233 24 112 3344",
    country: "Ghana",
    countryCode: "GH",
    membershipTier: "VOYAGER",
    pointsBalance: 8400,
    totalTrips: 5,
    totalBookings: 7,
    lifetimeSpendGhs: 82000,
    lifetimeSpendUsd: 6560,
    activeProducts: ["FLIGHTS", "ESIM", "HOTELS"],
    currentStatus: "COMPLETED",
    primaryRouteOrInterest: "Accra (ACC) ⇄ Dubai (DXB) Business",
    lastActive: "3 weeks ago",
    passportVerified: true,
    passportExpiry: "2030-07-22",
    hasOpenInquiry: false,
    eSimActive: true,
    leadSource: "CORPORATE_INQUIRY",
    churnRiskDays: 68
  },
  {
    id: "trav-06",
    name: "Jessica Afia Ofori",
    email: "jessica.ofori@atlantahealth.org",
    phone: "+1 404 555 0192",
    country: "United States",
    countryCode: "US",
    membershipTier: "VOYAGER",
    pointsBalance: 5900,
    totalTrips: 3,
    totalBookings: 4,
    lifetimeSpendGhs: 53000,
    lifetimeSpendUsd: 4240,
    activeProducts: ["DIASPORA", "TOURS", "ESIM"],
    currentStatus: "INACTIVE",
    primaryRouteOrInterest: "Cape Coast / Kakum Canopy Walk Family Retreat",
    lastActive: "3 months ago",
    passportVerified: true,
    passportExpiry: "2028-10-14",
    hasOpenInquiry: false,
    eSimActive: false,
    leadSource: "REFERRAL",
    churnRiskDays: 95
  },
  {
    id: "trav-07",
    name: "Emmanuel Tetteh",
    email: "emmanuel.tetteh@techghana.io",
    phone: "+233 27 654 3210",
    country: "Ghana",
    countryCode: "GH",
    membershipTier: "EXPLORER",
    pointsBalance: 950,
    totalTrips: 1,
    totalBookings: 1,
    lifetimeSpendGhs: 9200,
    lifetimeSpendUsd: 736,
    activeProducts: ["FLIGHTS", "ESIM"],
    currentStatus: "CONFIRMED",
    primaryRouteOrInterest: "Accra (ACC) ⇄ Nairobi (NBO)",
    lastActive: "Yesterday",
    passportVerified: true,
    passportExpiry: "2029-09-01",
    hasOpenInquiry: false,
    eSimActive: true,
    leadSource: "FLIGHT_SEARCH",
    churnRiskDays: 14
  },
  {
    id: "trav-08",
    name: "Bernice Konadu Agyemang",
    email: "bernice.agyemang@vodafone.com.gh",
    phone: "+233 50 123 7890",
    country: "Ghana",
    countryCode: "GH",
    membershipTier: "ELITE",
    pointsBalance: 17800,
    totalTrips: 9,
    totalBookings: 13,
    lifetimeSpendGhs: 165000,
    lifetimeSpendUsd: 13200,
    activeProducts: ["FLIGHTS", "HOTELS", "VISA", "ESIM"],
    currentStatus: "IN_TRANSIT",
    primaryRouteOrInterest: "Accra (ACC) ⇄ New York (JFK) First Class",
    lastActive: "Today, 06:45 GMT",
    passportVerified: true,
    passportExpiry: "2033-01-30",
    hasOpenInquiry: false,
    eSimActive: true,
    leadSource: "CORPORATE_INQUIRY",
    churnRiskDays: 8
  }
];

const DEFAULT_PIPELINE: Record<string, PipelineLead[]> = {
  NEW: [
    {
      id: "lead-01",
      stage: "NEW",
      source: "FLIGHT_SEARCH",
      estimated_value: 12500,
      currency: "GHS",
      notes: "Inquired about group flights to Kigali for 6 engineers",
      next_followup: "Today, 14:00",
      assigned_agent: "Sarah Mensah",
      created_at: new Date().toISOString(),
      user: { id: "u-1", name: "Kofi Owusu", email: "kofi.owusu@gmail.com", phone: "+233 24 332 1100", membership_tier: "EXPLORER" }
    }
  ],
  CONTACTED: [
    {
      id: "lead-02",
      stage: "CONTACTED",
      source: "VISA_REQUEST",
      estimated_value: 8500,
      currency: "GHS",
      notes: "UK Standard Visitor Visa application review",
      next_followup: "Tomorrow, 10:00",
      assigned_agent: "Grace Addo",
      created_at: new Date().toISOString(),
      user: { id: "u-2", name: "Nana Akua Frimpong", email: "nana.akua@gmail.com", phone: "+233 55 312 9988", membership_tier: "EXPLORER" }
    }
  ],
  QUALIFIED: [
    {
      id: "lead-03",
      stage: "QUALIFIED",
      source: "DIASPORA_PACKAGE",
      estimated_value: 45000,
      currency: "GHS",
      notes: "Year of Return 10-day VIP heritage package for 4 adults",
      next_followup: "24 Oct 2026",
      assigned_agent: "Emmanuel Osei",
      created_at: new Date().toISOString(),
      user: { id: "u-3", name: "Marcus Chukwuemeka Osei", email: "marcus.osei@londonfin.co.uk", phone: "+44 7700 900123", membership_tier: "ELITE" }
    }
  ],
  PROPOSAL_SENT: [
    {
      id: "lead-04",
      stage: "PROPOSAL_SENT",
      source: "CORPORATE_INQUIRY",
      estimated_value: 98000,
      currency: "GHS",
      notes: "Stanbic Bank Ghana annual executive corporate retreat flights to Mauritius",
      next_followup: "25 Oct 2026",
      assigned_agent: "Master Admin",
      created_at: new Date().toISOString(),
      user: { id: "u-4", name: "David Kojo Acheampong", email: "david.acheampong@stanbic.com.gh", phone: "+233 24 112 3344", membership_tier: "VOYAGER" }
    }
  ],
  NEGOTIATING: [
    {
      id: "lead-05",
      stage: "NEGOTIATING",
      source: "TOUR_INQUIRY",
      estimated_value: 32000,
      currency: "GHS",
      notes: "Safari package in Masai Mara + Zanzibar beach extension",
      next_followup: "26 Oct 2026",
      assigned_agent: "Sarah Mensah",
      created_at: new Date().toISOString(),
      user: { id: "u-5", name: "Dr. Abena Serwaa Boateng", email: "abena.boateng@korlebu.edu.gh", phone: "+233 20 890 1234", membership_tier: "VOYAGER" }
    }
  ],
  WON: [
    {
      id: "lead-06",
      stage: "WON",
      source: "CORPORATE_INQUIRY",
      estimated_value: 165000,
      currency: "GHS",
      notes: "Accra ⇄ New York JFK First Class tickets issued and paid",
      next_followup: null,
      assigned_agent: "Master Admin",
      created_at: new Date().toISOString(),
      user: { id: "u-6", name: "Bernice Konadu Agyemang", email: "bernice.agyemang@vodafone.com.gh", phone: "+233 50 123 7890", membership_tier: "ELITE" }
    }
  ],
  LOST: [],
  DORMANT: []
};

type SegmentFilter = "ALL" | "ACTIVE" | "LEADS" | "DIASPORA" | "VIP" | "ESIM" | "CORPORATE" | "AT_RISK" | "DORMANT";
type ViewMode = "TABLE" | "PIPELINE";

/* ─── Component ─── */

export default function CustomerCRMCommandCenter() {
  const [travelers, setTravelers] = useState<CRMTravelerRecord[]>([]);
  const [pipeline, setPipeline] = useState<Record<string, PipelineLead[]>>(DEFAULT_PIPELINE);
  const [stats, setStats] = useState<CRMStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSegment, setActiveSegment] = useState<SegmentFilter>("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [serviceFilter, setServiceFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<ViewMode>("TABLE");
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [travelerToDelete, setTravelerToDelete] = useState<CRMTravelerRecord | null>(null);

  const calculateLiveStats = (list: CRMTravelerRecord[]): CRMStats => {
    const total = list.length;
    const active = list.filter((t) => ["IN_TRANSIT", "CONFIRMED"].includes(t.currentStatus)).length;
    const leads = list.filter((t) => t.currentStatus === "LEAD" || t.hasOpenInquiry).length;
    const esims = list.filter((t) => t.eSimActive).length;
    const inquiries = list.filter((t) => t.hasOpenInquiry).length;
    const atRisk = list.filter((t) => (t.churnRiskDays || 0) >= 60).length;
    const won = 6;
    return {
      totalCustomers: total,
      activeThisMonth: active,
      newLeads7d: leads,
      conversionRate: total > 0 ? Math.round((won / (leads + won || 1)) * 100) : 48,
      activeEsims: esims,
      openInquiries: inquiries,
      atRiskCount: atRisk,
      wonLeads: won,
    };
  };

  const handleDelete = (traveler: CRMTravelerRecord) => {
    setTravelerToDelete(traveler);
  };

  const confirmDeleteTraveler = async () => {
    if (!travelerToDelete) return;
    const target = travelerToDelete;
    setTravelerToDelete(null);

    const updated = travelers.filter((t) => t.id !== target.id);
    setTravelers(updated);
    setStats(calculateLiveStats(updated));

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }

    setToastNotice(`Customer "${target.name}" has been permanently removed from CRM records.`);
    setTimeout(() => setToastNotice(null), 4000);

    try {
      await adminApi.delete(`/users/${target.id}`);
    } catch {}
  };

  const fetchCRMData = async () => {
    try {
      setLoading(true);

      // 1. Initialise from persistent storage or default seed
      let initialList: CRMTravelerRecord[] = [];
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(CRM_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              initialList = parsed;
            }
          }
        } catch {}
      }

      if (initialList.length === 0) {
        initialList = DEFAULT_CRM_TRAVELERS;
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(DEFAULT_CRM_TRAVELERS));
          } catch {}
        }
      }

      // 2. Fetch live data if server has new records
      const [customersRes, pipelineRes, statsRes] = await Promise.allSettled([
        adminApi.get<{ data: CRMTravelerRecord[]; total: number }>("/crm/customers?limit=100"),
        adminApi.get<{ pipeline: Record<string, PipelineLead[]> }>("/crm/pipeline"),
        adminApi.get<CRMStats>("/crm/stats"),
      ]);

      if (customersRes.status === "fulfilled" && customersRes.value?.data?.length > 0) {
        initialList = customersRes.value.data;
        setSyncNotice(`CRM synced - ${customersRes.value.total} customers loaded from live database`);
      } else {
        setSyncNotice(`CRM active - ${initialList.length} verified customer records loaded`);
      }

      setTravelers(initialList);

      if (pipelineRes.status === "fulfilled" && pipelineRes.value?.pipeline && Object.keys(pipelineRes.value.pipeline).length > 0) {
        setPipeline(pipelineRes.value.pipeline);
      } else {
        setPipeline(DEFAULT_PIPELINE);
      }

      if (statsRes.status === "fulfilled" && statsRes.value?.totalCustomers) {
        setStats(statsRes.value);
      } else {
        setStats(calculateLiveStats(initialList));
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

      {/* KPI Strip - 8 metrics */}
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
                        <p className="text-[11px] font-bold text-slate-800 truncate group-hover:text-slate-900">{lead.user?.name || lead.inquiry?.name || "-"}</p>
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
                        <span className="text-[11px] text-slate-400">{typeof t.lastActive === "string" ? t.lastActive : "-"}</span>
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          href={`/travelers/${t.id}`}
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Eye className="size-3.5" />
                          <ChevronRight className="size-3" />
                        </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(t)}
                        className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white font-bold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Delete customer record"
                      >
                        <Trash2 className="size-3" />
                        <span>Delete</span>
                      </button>
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
      {/* Professional Toast Notification */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900 text-white shadow-2xl border border-emerald-700 text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
          <span>{toastNotice}</span>
          <button onClick={() => setToastNotice(null)} className="text-emerald-300 hover:text-white cursor-pointer ml-2">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* PROFESSIONAL DELETE CONFIRMATION MODAL */}
      {travelerToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <Trash2 className="size-6 text-rose-600" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Permanent Deletion</span>
                <h3 className="text-base font-bold font-display text-slate-900">
                  Delete {travelerToDelete.name}?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to permanently delete <strong className="text-slate-800">{travelerToDelete.name}</strong> from the customer directory?
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-800">{travelerToDelete.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Country:</span>
                <span className="font-semibold text-slate-800">{travelerToDelete.country}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tier:</span>
                <span className="font-bold text-slate-800">{travelerToDelete.membershipTier} ({travelerToDelete.pointsBalance} pts)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Lifetime Spend:</span>
                <span className="font-bold text-emerald-700">GHS {travelerToDelete.lifetimeSpendGhs?.toLocaleString()}</span>
              </div>
              <div className="pt-2 text-[11px] text-rose-600 font-semibold border-t border-slate-200">
                This action cannot be undone. All linked lead pipelines, inquiries, and booking records will be removed.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTravelerToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTraveler}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Yes, Delete Traveler</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
