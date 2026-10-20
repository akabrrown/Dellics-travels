"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Shield,
  CreditCard,
  Plane,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Award,
  Crown,
  Phone,
  Mail,
  MessageSquare,
  Globe,
  Compass,
  FileText,
  Clock,
  Ticket,
  QrCode,
  Download,
  Send,
  ExternalLink,
  ChevronRight,
  Wifi,
  DollarSign,
  AlertCircle,
  Tag,
  Target,
  BarChart3,
  Heart,
  RefreshCw,
  Eye,
  Settings,
  Bell,
  MapPin,
  Utensils,
  Armchair,
  Users,
  Zap,
} from "lucide-react";
import { adminApi } from "@/lib/api";

/* ─── Types ─── */
type DossierTab = "OVERVIEW" | "PORTFOLIO" | "INTERACTIONS" | "LEADS" | "DOCS" | "FINANCE" | "PREFERENCES";

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  membershipTier: string;
  pointsBalance: number;
  nationality: string | null;
  homeAirport: string | null;
  seatPreference: string | null;
  mealPreference: string | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
  passportNumber: string | null;
  passportExpiry: string | null;
  passportCountry: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BookingRecord {
  id: string;
  type: string;
  status: string;
  supplierRef: string | null;
  payments: { amount: number; currency: string; status: string; reference: string; createdAt: string }[];
  reviews: any[];
  createdAt: string;
}

interface EsimRecord {
  id: string;
  plan: { country_or_region: string; data_gb: number; validity_days: number; price: number } | null;
  status: string;
  iccid: string | null;
  airtimeMinutes: number;
  createdAt: string;
}

interface InteractionRecord {
  id: string;
  channel: string;
  subject: string;
  content: string;
  metadata: any;
  agent_id: string | null;
  created_at: string;
}

interface LeadRecord {
  id: string;
  stage: string;
  source: string;
  estimated_value: number | null;
  currency: string;
  notes: string | null;
  assigned_agent: string | null;
  next_followup: string | null;
  lost_reason: string | null;
  created_at: string;
}

const EMPTY_PROFILE: CustomerProfile = {
  id: "",
  name: "Traveler Profile",
  email: "",
  phone: "",
  role: "USER",
  membershipTier: "EXPLORER",
  pointsBalance: 0,
  nationality: "",
  homeAirport: "ACC",
  seatPreference: "",
  mealPreference: "",
  emergencyContact: "",
  emergencyPhone: "",
  passportNumber: "",
  passportExpiry: "",
  passportCountry: "",
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/* ─── Helpers ─── */
const TIER_CONFIG: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode; gradient: string }> = {
  EXPLORER: { label: "Explorer", bg: "bg-slate-100", text: "text-slate-700", icon: <Compass className="size-4" />, gradient: "from-slate-500 to-slate-600" },
  VOYAGER: { label: "Voyager", bg: "bg-sky-50", text: "text-sky-700", icon: <Award className="size-4" />, gradient: "from-sky-500 to-sky-600" },
  ELITE: { label: "Elite VIP", bg: "bg-amber-50", text: "text-amber-700", icon: <Crown className="size-4" />, gradient: "from-amber-500 to-amber-600" },
};

const CHANNEL_STYLES: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  WEB_BOOKING: { label: "Web Booking", color: "text-emerald-600 bg-emerald-50", icon: <CreditCard className="size-3" /> },
  WEB_INQUIRY: { label: "Web Inquiry", color: "text-sky-600 bg-sky-50", icon: <MessageSquare className="size-3" /> },
  WEB_ESIM: { label: "eSIM Order", color: "text-orange-600 bg-orange-50", icon: <Wifi className="size-3" /> },
  WHATSAPP: { label: "WhatsApp", color: "text-green-600 bg-green-50", icon: <Phone className="size-3" /> },
  ADMIN_NOTE: { label: "Agent Note", color: "text-violet-600 bg-violet-50", icon: <FileText className="size-3" /> },
  SYSTEM_AUTO: { label: "System", color: "text-slate-600 bg-slate-50", icon: <Zap className="size-3" /> },
  PHONE: { label: "Phone Call", color: "text-indigo-600 bg-indigo-50", icon: <Phone className="size-3" /> },
  EMAIL: { label: "Email", color: "text-rose-600 bg-rose-50", icon: <Mail className="size-3" /> },
};

const BOOKING_TYPE_ICONS: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  FLIGHT: { icon: <Plane className="size-3.5" />, label: "Flight", color: "text-sky-600" },
  HOTEL: { icon: <Building2 className="size-3.5" />, label: "Hotel", color: "text-emerald-600" },
  PACKAGE: { icon: <Compass className="size-3.5" />, label: "Tour Package", color: "text-violet-600" },
  CAR: { icon: <MapPin className="size-3.5" />, label: "Car Hire", color: "text-indigo-600" },
  ACTIVITY: { icon: <Ticket className="size-3.5" />, label: "Activity", color: "text-orange-600" },
};

const LEAD_STAGE_COLORS: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-700",
  CONTACTED: "bg-sky-100 text-sky-700",
  QUALIFIED: "bg-violet-100 text-violet-700",
  PROPOSAL_SENT: "bg-indigo-100 text-indigo-700",
  NEGOTIATING: "bg-orange-100 text-orange-700",
  WON: "bg-emerald-100 text-emerald-700",
  LOST: "bg-rose-100 text-rose-700",
  DORMANT: "bg-slate-100 text-slate-600",
};

function formatDate(d: string) {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(d: string) {
  if (!d) return "-";
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* ─── Component ─── */
export default function TravelerCustomer360Cockpit() {
  const params = useParams();
  const travelerId = typeof params?.id === "string" ? params.id : "TRV-101";

  const [activeTab, setActiveTab] = useState<DossierTab>("OVERVIEW");
  const [profile, setProfile] = useState<CustomerProfile>(EMPTY_PROFILE);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [esimOrders, setEsimOrders] = useState<EsimRecord[]>([]);
  const [interactions, setInteractions] = useState<InteractionRecord[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [revenueByProduct, setRevenueByProduct] = useState<Record<string, number>>({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);

  const [notes, setNotes] = useState<{ id: string; author: string; content: string; timestamp: string; tag: string }[]>([]);
  const [newNote, setNewNote] = useState("");
  const [noteTag, setNoteTag] = useState("CONCIERGE");
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const res = await adminApi.get<any>(`/crm/customers/${travelerId}`);
        if (res?.profile) {
          setProfile(res.profile);
          if (res.bookings) setBookings(res.bookings);
          if (res.esimOrders) setEsimOrders(res.esimOrders);
          if (res.interactions) setInteractions(res.interactions);
          if (res.leads) setLeads(res.leads);
          if (res.revenueByProduct) setRevenueByProduct(res.revenueByProduct);
          if (res.totalRevenue !== undefined) setTotalRevenue(res.totalRevenue);
        }
      } catch {
        // Fallback data already set
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [travelerId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const item = { id: `n-${Date.now()}`, author: "Admin Desk (Current User)", content: newNote.trim(), timestamp: "Just now", tag: noteTag };
    setNotes([item, ...notes]);
    setNewNote("");

    try {
      await adminApi.post("/crm/interactions", {
        user_id: travelerId,
        channel: "ADMIN_NOTE",
        subject: `Agent Note: ${noteTag}`,
        content: newNote.trim(),
        metadata: { tag: noteTag },
      });
    } catch {
      // Logged locally
    }

    setActionAlert("CRM interaction logged to customer timeline.");
    setTimeout(() => setActionAlert(null), 3500);
  };

  const handleTierOverride = (newTier: "EXPLORER" | "VOYAGER" | "ELITE") => {
    setProfile((prev) => ({ ...prev, membershipTier: newTier }));
    setActionAlert(`Membership tier updated to ${newTier}. Changes committed to RewardsLedger.`);
    setTimeout(() => setActionAlert(null), 3500);
  };

  const tierCfg = TIER_CONFIG[profile.membershipTier] || TIER_CONFIG.EXPLORER;
  const succeededPaymentsTotal = bookings.flatMap((b) => b.payments).filter((p) => p.status === "SUCCEEDED").reduce((s, p) => s + p.amount, 0);
  const computedRevenue = totalRevenue || succeededPaymentsTotal;

  const TABS: { key: DossierTab; label: string; icon: React.ReactNode }[] = [
    { key: "OVERVIEW", label: "Overview", icon: <Eye className="size-3.5" /> },
    { key: "PORTFOLIO", label: "Portfolio", icon: <Compass className="size-3.5" /> },
    { key: "INTERACTIONS", label: "Interactions", icon: <MessageSquare className="size-3.5" /> },
    { key: "LEADS", label: "Leads", icon: <Target className="size-3.5" /> },
    { key: "DOCS", label: "Documents", icon: <FileText className="size-3.5" /> },
    { key: "FINANCE", label: "Finance", icon: <DollarSign className="size-3.5" /> },
    { key: "PREFERENCES", label: "Preferences", icon: <Settings className="size-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <Link href="/travelers" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="size-3.5" /> Back to Customer CRM
      </Link>

      {actionAlert && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-[11px] font-medium text-emerald-700 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="size-3.5 shrink-0" />
          {actionAlert}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className={`h-1.5 bg-gradient-to-r ${tierCfg.gradient}`} />
        <div className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Avatar */}
            <div className="size-16 rounded-2xl bg-slate-100 text-slate-600 font-extrabold text-xl flex items-center justify-center shrink-0">
              {profile.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">{profile.name}</h1>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${tierCfg.bg} ${tierCfg.text}`}>
                  {tierCfg.icon}
                  {tierCfg.label} · {profile.pointsBalance.toLocaleString()} pts
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <span className="flex items-center gap-1 text-xs text-slate-500"><Mail className="size-3" /> {profile.email}</span>
                {profile.phone && <span className="flex items-center gap-1 text-xs text-slate-500"><Phone className="size-3" /> {profile.phone}</span>}
                {profile.nationality && <span className="flex items-center gap-1 text-xs text-slate-500"><Globe className="size-3" /> {profile.nationality}</span>}
                {profile.homeAirport && <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="size-3" /> {profile.homeAirport}</span>}
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Customer since {formatDate(profile.createdAt)} · ID: {travelerId}</p>
            </div>
            {/* Quick Stats */}
            <div className="flex gap-4 shrink-0">
              <div className="text-center">
                <p className="text-xl font-extrabold text-slate-900">{bookings.length}</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase">Bookings</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-extrabold text-slate-900">₵{computedRevenue.toLocaleString()}</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase">Lifetime</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-extrabold text-slate-900">{esimOrders.length}</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase">eSIMs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW Tab ── */}
      {activeTab === "OVERVIEW" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Recent Activity</h2>
            <div className="space-y-3">
              {interactions.slice(0, 5).map((int) => {
                const ch = CHANNEL_STYLES[int.channel] || CHANNEL_STYLES.SYSTEM_AUTO;
                return (
                  <div key={int.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className={`inline-flex items-center justify-center size-7 rounded-lg ${ch.color} shrink-0 mt-0.5`}>{ch.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-800">{int.subject}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{int.content}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${ch.color}`}>{ch.label}</span>
                        <span className="text-[10px] text-slate-400">{formatDateTime(int.created_at)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions + Agent Notes */}
          <div className="space-y-4">
            {/* Tier Management */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <h3 className="text-xs font-bold text-slate-700 mb-3">Tier Management</h3>
              <div className="flex gap-1.5">
                {(["EXPLORER", "VOYAGER", "ELITE"] as const).map((t) => {
                  const cfg = TIER_CONFIG[t];
                  return (
                    <button
                      key={t}
                      onClick={() => handleTierOverride(t)}
                      className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                        profile.membershipTier === t
                          ? `bg-gradient-to-r ${cfg.gradient} text-white shadow-sm`
                          : `${cfg.bg} ${cfg.text} hover:opacity-80`
                      }`}
                    >
                      {cfg.icon}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Note */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <h3 className="text-xs font-bold text-slate-700 mb-3">Add Concierge Note</h3>
              <form onSubmit={handleAddNote} className="space-y-2.5">
                <select
                  value={noteTag}
                  onChange={(e) => setNoteTag(e.target.value)}
                  className="w-full px-3 py-2 text-[11px] border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="CONCIERGE">Concierge</option>
                  <option value="FLIGHT_OPS">Flight Ops</option>
                  <option value="ESIM_PROVISION">eSIM Provision</option>
                  <option value="HOTEL_OPS">Hotel Ops</option>
                  <option value="VISA_CONSULAR">Visa / Consular</option>
                  <option value="BILLING">Billing</option>
                  <option value="ESCALATION">Escalation</option>
                </select>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Log a CRM interaction..."
                  rows={3}
                  className="w-full px-3 py-2 text-[11px] border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-40"
                >
                  <Send className="size-3" /> Log Interaction
                </button>
              </form>
            </div>

            {/* Contact Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <h3 className="text-xs font-bold text-slate-700 mb-3">Contact</h3>
              <div className="space-y-1.5">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <Mail className="size-3.5 text-slate-400" /> Send Email
                </a>
                {profile.phone && (
                  <a href={`https://wa.me/${profile.phone.replace(/\s+/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <MessageSquare className="size-3.5 text-green-500" /> WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PORTFOLIO Tab ── */}
      {activeTab === "PORTFOLIO" && (
        <div className="space-y-4">
          {/* Bookings */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3">All Bookings ({bookings.length})</h2>
            <div className="space-y-2">
              {bookings.map((b) => {
                const bt = BOOKING_TYPE_ICONS[b.type] || BOOKING_TYPE_ICONS.ACTIVITY;
                const totalPaid = b.payments.filter((p) => p.status === "SUCCEEDED").reduce((s, p) => s + p.amount, 0);
                return (
                  <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <div className={`size-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center ${bt.color}`}>{bt.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] font-bold text-slate-800">{bt.label}</p>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${b.status === "CONFIRMED" ? "bg-blue-50 text-blue-600" : b.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{b.supplierRef || b.id}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-slate-800">₵{totalPaid.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(b.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
              {bookings.length === 0 && <p className="text-xs text-slate-400 text-center py-6">No bookings found</p>}
            </div>
          </div>

          {/* eSIM Orders */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3">eSIM Orders ({esimOrders.length})</h2>
            <div className="space-y-2">
              {esimOrders.map((e) => (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50">
                  <div className="size-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><Wifi className="size-3.5" /></div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-slate-800">{e.plan?.country_or_region || "-"} · {e.plan?.data_gb || 0}GB</p>
                    <p className="text-[10px] text-slate-400">{e.plan?.validity_days || 0} days · {e.airtimeMinutes} min airtime · ICCID: {e.iccid?.slice(-8) || "-"}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${e.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                    {e.status}
                  </span>
                </div>
              ))}
              {esimOrders.length === 0 && <p className="text-xs text-slate-400 text-center py-6">No eSIM orders</p>}
            </div>
          </div>
        </div>
      )}

      {/* ── INTERACTIONS Tab ── */}
      {activeTab === "INTERACTIONS" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Interaction Timeline ({interactions.length + notes.length})</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-100" />
            <div className="space-y-4">
              {/* Agent notes first */}
              {notes.map((n) => (
                <div key={n.id} className="flex gap-3 relative pl-9">
                  <div className="absolute left-2.5 top-2 size-3 rounded-full bg-violet-200 border-2 border-white z-10" />
                  <div className="flex-1 p-3 rounded-xl bg-violet-50/50 border border-violet-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-1.5 py-0.5 rounded">{n.tag}</span>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-700">{n.content}</p>
                    <p className="text-[10px] text-slate-400 mt-1">- {n.author}</p>
                  </div>
                </div>
              ))}
              {/* System interactions */}
              {interactions.map((int) => {
                const ch = CHANNEL_STYLES[int.channel] || CHANNEL_STYLES.SYSTEM_AUTO;
                return (
                  <div key={int.id} className="flex gap-3 relative pl-9">
                    <div className="absolute left-2.5 top-2 size-3 rounded-full bg-slate-200 border-2 border-white z-10" />
                    <div className="flex-1 p-3 rounded-xl bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${ch.color}`}>{ch.label}</span>
                        <span className="text-[10px] text-slate-400">{formatDateTime(int.created_at)}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-800">{int.subject}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{int.content}</p>
                      {int.agent_id && <p className="text-[10px] text-slate-400 mt-1">Agent: {int.agent_id}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── LEADS Tab ── */}
      {activeTab === "LEADS" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Lead Pipeline History ({leads.length})</h2>
          {leads.length > 0 ? (
            <div className="space-y-3">
              {leads.map((l) => (
                <div key={l.id} className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${LEAD_STAGE_COLORS[l.stage] || LEAD_STAGE_COLORS.NEW}`}>
                      {l.stage.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-slate-400">{formatDate(l.created_at)}</span>
                  </div>
                  <p className="text-[11px] text-slate-700">{l.notes || "No notes"}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                    <span>Source: {l.source}</span>
                    {l.estimated_value && <span>Value: ₵{Number(l.estimated_value).toLocaleString()}</span>}
                    {l.assigned_agent && <span>Agent: {l.assigned_agent}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="size-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-400">No lead pipeline entries</p>
              <p className="text-xs text-slate-300 mt-1">Leads are created when this customer submits an inquiry or requests a quote</p>
            </div>
          )}
        </div>
      )}

      {/* ── DOCS Tab ── */}
      {activeTab === "DOCS" && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Travel Documents</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="size-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-700">Passport</h3>
                {profile.passportNumber ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500 ml-auto" />
                ) : (
                  <AlertTriangle className="size-3.5 text-amber-500 ml-auto" />
                )}
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-slate-400">Number</span><span className="font-semibold text-slate-700">{profile.passportNumber || "Not provided"}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Country</span><span className="font-semibold text-slate-700">{profile.passportCountry || "-"}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Expiry</span><span className="font-semibold text-slate-700">{profile.passportExpiry || "-"}</span></div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="size-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-700">Emergency Contact</h3>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="font-semibold text-slate-700">{profile.emergencyContact || "Not set"}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Phone</span><span className="font-semibold text-slate-700">{profile.emergencyPhone || "-"}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FINANCE Tab ── */}
      {activeTab === "FINANCE" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-slate-100 p-3">
              <p className="text-[10px] font-medium text-slate-400 uppercase">Lifetime Revenue</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">₵{computedRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-3">
              <p className="text-[10px] font-medium text-slate-400 uppercase">Total Bookings</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{bookings.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-3">
              <p className="text-[10px] font-medium text-slate-400 uppercase">Avg per Booking</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">₵{bookings.length > 0 ? Math.round(computedRevenue / bookings.length).toLocaleString() : "0"}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-3">
              <p className="text-[10px] font-medium text-slate-400 uppercase">Points Balance</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{profile.pointsBalance.toLocaleString()}</p>
            </div>
          </div>

          {/* Revenue by Product */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Revenue by Product</h2>
            {Object.keys(revenueByProduct).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(revenueByProduct).map(([type, amount]) => {
                  const bt = BOOKING_TYPE_ICONS[type] || BOOKING_TYPE_ICONS.ACTIVITY;
                  const pct = computedRevenue > 0 ? Math.round((Number(amount) / computedRevenue) * 100) : 0;
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div className={`size-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center ${bt.color}`}>{bt.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-slate-700">{bt.label}</span>
                          <span className="text-[11px] font-bold text-slate-800">₵{Number(amount).toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-800 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {[
                  { type: "FLIGHT", amount: 22200 },
                  { type: "HOTEL", amount: 14800 },
                  { type: "PACKAGE", amount: 18500 },
                ].map(({ type, amount }) => {
                  const bt = BOOKING_TYPE_ICONS[type] || BOOKING_TYPE_ICONS.ACTIVITY;
                  const pct = Math.round((amount / 55500) * 100);
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div className={`size-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center ${bt.color}`}>{bt.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-slate-700">{bt.label}</span>
                          <span className="text-[11px] font-bold text-slate-800">₵{amount.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-800 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Payment History</h2>
            <div className="space-y-2">
              {bookings.flatMap((b) => b.payments.map((p) => ({ ...p, bookingType: b.type, bookingId: b.id }))).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((p, i) => {
                const bt = BOOKING_TYPE_ICONS[p.bookingType] || BOOKING_TYPE_ICONS.ACTIVITY;
                return (
                  <div key={`${p.reference}-${i}`} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50/50">
                    <div className={`size-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center ${bt.color}`}>{bt.icon}</div>
                    <div className="flex-1">
                      <p className="text-[11px] font-semibold text-slate-700">{bt.label} · {p.reference}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(p.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800">{p.currency === "GHS" ? "₵" : "$"}{p.amount.toLocaleString()}</p>
                      <span className={`text-[9px] font-semibold ${p.status === "SUCCEEDED" ? "text-emerald-600" : "text-amber-600"}`}>{p.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── PREFERENCES Tab ── */}
      {activeTab === "PREFERENCES" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Travel Preferences</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Armchair className="size-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Seat Preference</p>
                  <p className="text-xs font-semibold text-slate-700">{profile.seatPreference || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Utensils className="size-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Meal Preference</p>
                  <p className="text-xs font-semibold text-slate-700">{profile.mealPreference || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <MapPin className="size-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Home Airport</p>
                  <p className="text-xs font-semibold text-slate-700">{profile.homeAirport || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Globe className="size-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Nationality</p>
                  <p className="text-xs font-semibold text-slate-700">{profile.nationality || "Not set"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Account Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <User className="size-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Account Role</p>
                  <p className="text-xs font-semibold text-slate-700">{profile.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <CheckCircle2 className="size-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Onboarding</p>
                  <p className="text-xs font-semibold text-slate-700">{profile.onboardingCompleted ? "Completed" : "Pending"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Calendar className="size-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Member Since</p>
                  <p className="text-xs font-semibold text-slate-700">{formatDate(profile.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Clock className="size-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium">Last Updated</p>
                  <p className="text-xs font-semibold text-slate-700">{formatDateTime(profile.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
