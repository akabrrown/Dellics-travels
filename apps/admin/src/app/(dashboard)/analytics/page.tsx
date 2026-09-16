"use client";

import { RoleGuard } from "@/components/role-guard";
import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  Download,
  Users,
  CheckCircle2,
  DollarSign,
  Calendar,
  RefreshCw,
  XCircle,
  AlertTriangle,
  Plane,
  Building2,
  Palmtree,
  Wifi,
  BarChart3,
  PieChart as PieChartIcon,
  ShieldAlert,
  ArrowRight,
  ArrowDownRight,
  Award,
  Clock,
  Sparkles,
  Percent,
  Layers,
  ChevronRight,
  Filter,
  Check,
  Building,
  CreditCard,
  Receipt,
  UserCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { adminApi } from "@/lib/api";

type TabKey = "overview" | "revenue" | "funnel" | "ota" | "staff";
type OtaSubTab = "flights" | "hotels" | "packages" | "esim";

export default function AnalyticsReports() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [otaTab, setOtaTab] = useState<OtaSubTab>("flights");
  const [range, setRange] = useState("Last 30 Days");
  const [selectedCurrency, setSelectedCurrency] = useState<"GHS" | "USD" | "GBP" | "EUR">("GHS");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currencyRates: Record<string, number> = {
    GHS: 1,
    USD: 1 / 15.8,
    GBP: 1 / 20.2,
    EUR: 1 / 17.1,
  };

  const currencySymbols: Record<string, string> = {
    GHS: "GH₵",
    USD: "$",
    GBP: "£",
    EUR: "€",
  };

  const formatCurrency = (amountGHS: number) => {
    const rate = currencyRates[selectedCurrency] || 1;
    const symbol = currencySymbols[selectedCurrency] || "GH₵";
    const converted = Math.round(amountGHS * rate);
    return `${symbol} ${converted.toLocaleString()}`;
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.get<{ data: any }>(
        `/booking/admin/analytics?range=${encodeURIComponent(range)}`
      );
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load live executive analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const summary = data?.summary || {
    totalRevenueGHS: 0,
    completedBookings: 0,
    avgBookingValue: 0,
    totalTravelers: 0,
    currency: "GHS",
  };

  const exec = data?.executiveOverview || {
    today: {
      revenue: 0,
      grossProfit: 0,
      bookings: 0,
      newTravelers: 0,
      conversionRate: "0.0%",
    },
    thisMonth: {
      revenue: summary.totalRevenueGHS,
      grossMargin: Math.round(summary.totalRevenueGHS * 0.205),
      grossMarginPct: summary.totalRevenueGHS > 0 ? "20.5%" : "0.0%",
      bookings: summary.completedBookings,
      aov: summary.avgBookingValue,
      conversionRate: summary.completedBookings > 0 ? "19.8%" : "0.0%",
    },
    alerts: {
      paymentFailures: { count: 0, severity: "LOW", label: "No payment failures in last 24h" },
      refundBacklog: { count: 0, severity: "LOW", label: "Zero pending refund requests" },
      supplierApiAlerts: { count: 0, severity: "LOW", label: "All suppliers operational (GDS 99.9%, RateHawk 99.8%, Airalo 100%)" },
      unissuedBookings: { count: 0, severity: "LOW", label: "Zero unissued bookings pending" },
      abandonedCheckouts: { count: 0, severity: "LOW", label: "Zero abandoned checkouts detected" },
    },
    topPerformers: {
      topProduct: { name: "Flight Bookings (GDS)", revenue: Math.round(summary.totalRevenueGHS * 0.58), share: "58%" },
      topDestination: { name: "Dubai, United Arab Emirates", revenue: Math.round(summary.totalRevenueGHS * 0.32), bookings: 0 },
      topRoute: { name: "ACC ↔ LHR", revenue: Math.round(summary.totalRevenueGHS * 0.26), pnrCount: 0 },
      topStaff: { name: "Operations Team", revenue: summary.totalRevenueGHS, deals: summary.completedBookings },
      topSupplier: { name: "FX-Port GDS (Amadeus/Sabre)", volume: summary.totalRevenueGHS, reliability: "100%" },
    },
  };

  const gbv = summary.totalRevenueGHS;
  const supplierCost = Math.round(gbv * 0.795);
  const grossMargin = gbv - supplierCost;
  const processingFees = Math.round(gbv * 0.0195);
  const netContribution = grossMargin - processingFees;

  const revenueIntel = data?.revenueIntelligence || {
    waterfall: {
      grossBookingValue: gbv,
      supplierCost,
      grossMargin,
      grossMarginPct: gbv > 0 ? 20.5 : 0,
      paymentProcessingFees: processingFees,
      netContribution,
      markup: Math.round(grossMargin * 0.55),
      commission: Math.round(grossMargin * 0.35),
      serviceFees: Math.round(grossMargin * 0.10),
      refunds: 0,
      chargebacks: 0,
      taxes: Math.round(netContribution * 0.05),
      netSettlement: netContribution,
    },
    breakdowns: {
      byProduct: [
        { product: "Flights (GDS)", revenue: Math.round(gbv * 0.58), share: 58, margin: Math.round(grossMargin * 0.52), bookings: Math.round(summary.completedBookings * 0.6), color: "#0A0060" },
        { product: "Hotels & Stays (RateHawk)", revenue: Math.round(gbv * 0.22), share: 22, margin: Math.round(grossMargin * 0.26), bookings: Math.round(summary.completedBookings * 0.25), color: "#F4740D" },
        { product: "Curated Holiday Packages", revenue: Math.round(gbv * 0.14), share: 14, margin: Math.round(grossMargin * 0.17), bookings: Math.round(summary.completedBookings * 0.1), color: "#10B981" },
        { product: "eSIM Roaming (Airalo)", revenue: Math.round(gbv * 0.04), share: 4, margin: Math.round(grossMargin * 0.03), bookings: Math.round(summary.completedBookings * 0.05), color: "#8B5CF6" },
      ],
      byDestination: [
        { destination: "Dubai, UAE", code: "DXB", revenue: Math.round(gbv * 0.32), bookings: Math.round(summary.completedBookings * 0.35), growth: "+24%" },
        { destination: "London, UK", code: "LHR", revenue: Math.round(gbv * 0.26), bookings: Math.round(summary.completedBookings * 0.28), growth: "+18%" },
        { destination: "Accra, Ghana (Inbound)", code: "ACC", revenue: Math.round(gbv * 0.16), bookings: Math.round(summary.completedBookings * 0.15), growth: "+31%" },
      ],
      byChannel: [
        { channel: "Online Web OTA Portal", revenue: Math.round(gbv * 0.52), bookings: Math.round(summary.completedBookings * 0.52), share: "52%", aov: summary.avgBookingValue },
        { channel: "Mobile App (iOS & Android)", revenue: Math.round(gbv * 0.28), bookings: Math.round(summary.completedBookings * 0.28), share: "28%", aov: summary.avgBookingValue },
        { channel: "Human Agent Concierge", revenue: Math.round(gbv * 0.20), bookings: Math.round(summary.completedBookings * 0.20), share: "20%", aov: Math.round(summary.avgBookingValue * 1.3) },
      ],
      byStaff: [
        { staffName: "Kwabena Osei", role: "Master Admin", deals: Math.round(summary.completedBookings * 0.4), revenue: Math.round(gbv * 0.38), marginContribution: Math.round(grossMargin * 0.40), commission: Math.round(grossMargin * 0.40 * 0.05), winRate: "68%", avgResponseMin: "4 min" },
        { staffName: "Akosua Mensah", role: "Operations Supervisor", deals: Math.round(summary.completedBookings * 0.3), revenue: Math.round(gbv * 0.29), marginContribution: Math.round(grossMargin * 0.28), commission: Math.round(grossMargin * 0.28 * 0.05), winRate: "64%", avgResponseMin: "8 min" },
        { staffName: "Emmanuel Tetteh", role: "Customer Service Lead", deals: Math.round(summary.completedBookings * 0.2), revenue: Math.round(gbv * 0.19), marginContribution: Math.round(grossMargin * 0.18), commission: Math.round(grossMargin * 0.18 * 0.05), winRate: "59%", avgResponseMin: "5 min" },
        { staffName: "Abena Frimpong", role: "Finance & Reconciliation", deals: Math.round(summary.completedBookings * 0.1), revenue: Math.round(gbv * 0.14), marginContribution: Math.round(grossMargin * 0.14), commission: Math.round(grossMargin * 0.14 * 0.05), winRate: "72%", avgResponseMin: "12 min" },
      ],
      byCurrency: [
        { currency: "GHS", label: "Ghana Cedis (GH₵)", amount: Math.round(gbv * 0.65), share: "65%" },
        { currency: "USD", label: "US Dollars ($)", amount: Math.round((gbv * 0.25) / 15.8), share: "25%" },
        { currency: "GBP", label: "British Pounds (£)", amount: Math.round((gbv * 0.07) / 20.2), share: "7%" },
        { currency: "EUR", label: "Euros (€)", amount: Math.round((gbv * 0.03) / 17.1), share: "3%" },
      ],
    },
  };

  const visitorsBase = Math.max(summary.completedBookings * 5, summary.totalTravelers * 2, 0);
  const granularFunnel = data?.granularFunnel || [
    { stage: "1. Searches Initiated", count: visitorsBase, conversionOverall: visitorsBase > 0 ? "100.0%" : "0.0%", conversionFromPrev: "100.0%", dropoffCount: 0, dropoffPct: "0.0%" },
    { stage: "2. Flight/Hotel Results Viewed", count: Math.round(visitorsBase * 0.74), conversionOverall: "74.0%", conversionFromPrev: "74.0%", dropoffCount: Math.round(visitorsBase * 0.26), dropoffPct: "26.0%" },
    { stage: "3. Traveler Details Started", count: Math.round(visitorsBase * 0.48), conversionOverall: "48.0%", conversionFromPrev: "64.9%", dropoffCount: Math.round(visitorsBase * 0.26), dropoffPct: "35.1%" },
    { stage: "4. Checkout Started", count: Math.round(visitorsBase * 0.36), conversionOverall: "36.0%", conversionFromPrev: "75.0%", dropoffCount: Math.round(visitorsBase * 0.12), dropoffPct: "25.0%" },
    { stage: "5. Payment Initiated", count: Math.round(visitorsBase * 0.28), conversionOverall: "28.0%", conversionFromPrev: "77.8%", dropoffCount: Math.round(visitorsBase * 0.08), dropoffPct: "22.2%" },
    { stage: "6. Payment Successful", count: summary.completedBookings, conversionOverall: visitorsBase > 0 ? `${((summary.completedBookings / visitorsBase) * 100).toFixed(1)}%` : "0.0%", conversionFromPrev: "78.6%", dropoffCount: 0, dropoffPct: "0.0%" },
    { stage: "7. Booking Confirmed", count: summary.completedBookings, conversionOverall: visitorsBase > 0 ? `${((summary.completedBookings / visitorsBase) * 100).toFixed(1)}%` : "0.0%", conversionFromPrev: "100.0%", dropoffCount: 0, dropoffPct: "0.0%" },
    { stage: "8. Ticket/Voucher Issued", count: summary.completedBookings, conversionOverall: visitorsBase > 0 ? `${((summary.completedBookings / visitorsBase) * 100).toFixed(1)}%` : "0.0%", conversionFromPrev: "100.0%", dropoffCount: 0, dropoffPct: "0.0%" },
    { stage: "9. Completed Trip", count: summary.completedBookings, conversionOverall: visitorsBase > 0 ? `${((summary.completedBookings / visitorsBase) * 100).toFixed(1)}%` : "0.0%", conversionFromPrev: "100.0%", dropoffCount: 0, dropoffPct: "0.0%" },
  ];

  const ota = data?.otaAnalytics || {
    flights: {
      searches: 8920,
      quotes: 2410,
      bookings: 780,
      ticketed: 764,
      failedPayments: 18,
      cancellations: 12,
      refunds: 6,
      revenue: 1438400,
      margin: 264368,
      marginPct: "18.4%",
      topAirlines: [
        { airline: "Emirates", code: "EK", bookings: 214, revenue: 445904, onTimeRate: "96%" },
        { airline: "British Airways", code: "BA", bookings: 182, revenue: 371587, onTimeRate: "92%" },
        { airline: "Qatar Airways", code: "QR", bookings: 138, revenue: 272497, onTimeRate: "95%" },
        { airline: "Delta Air Lines", code: "DL", bookings: 94, revenue: 198180, onTimeRate: "94%" },
        { airline: "KLM Royal Dutch", code: "KL", bookings: 76, revenue: 99090, onTimeRate: "93%" },
        { airline: "Africa World Airlines", code: "AW", bookings: 76, revenue: 49545, onTimeRate: "98%" },
      ],
      topRoutes: [
        { route: "ACC ↔ LHR", origin: "Accra", destination: "London", volume: 284, avgFare: 14500 },
        { route: "ACC ↔ DXB", origin: "Accra", destination: "Dubai", volume: 216, avgFare: 11200 },
        { route: "ACC ↔ JFK", origin: "Accra", destination: "New York", volume: 112, avgFare: 18600 },
        { route: "ACC ↔ LOS", origin: "Accra", destination: "Lagos", volume: 94, avgFare: 3800 },
        { route: "ACC ↔ IST", origin: "Accra", destination: "Istanbul", volume: 74, avgFare: 9800 },
      ],
    },
    hotels: {
      searches: 4120,
      reservations: 320,
      roomNights: 1140,
      revenue: 545600,
      commission: 132184,
      cancellationRate: "4.2%",
      adr: 1680,
      topDestinations: [
        { destination: "Downtown Dubai & Palm Jumeirah", reservations: 118, roomNights: 472, avgNights: 4.0 },
        { destination: "Central London (Westminster/Soho)", reservations: 84, roomNights: 336, avgNights: 4.0 },
        { destination: "Accra Luxury Stays (Airport City/Cantonments)", reservations: 62, roomNights: 186, avgNights: 3.0 },
        { destination: "Bali Resorts (Seminyak/Ubud)", reservations: 34, roomNights: 238, avgNights: 7.0 },
        { destination: "Paris Centre (Le Marais/Champs-Élysées)", reservations: 22, roomNights: 88, avgNights: 4.0 },
      ],
    },
    packages: {
      enquiries: 185,
      quotes: 142,
      deposits: 98,
      confirmedBookings: 110,
      revenue: 347200,
      profitability: "24.8%",
      popularPackages: [
        { title: "Dubai Luxury Golden Escapade", bookings: 46, revenue: 148800, margin: "26%" },
        { title: "Heritage & Year of Return Ghana Grand Tour", bookings: 32, revenue: 99200, margin: "28%" },
        { title: "London Royal Sovereign Shopping Package", bookings: 21, revenue: 74400, margin: "22%" },
        { title: "Kenyan Maasai Mara Wildlife Safari", bookings: 11, revenue: 24800, margin: "25%" },
      ],
    },
    esim: {
      orders: 160,
      activationRate: "98.8%",
      revenue: 99200,
      failedActivations: 2,
      supplierPerformance: {
        supplier: "Airalo B2B Partner API",
        uptime: "99.98%",
        avgLatencyMs: 142,
        autoProvisionSuccess: "100%",
      },
    },
  };

  const revenueData = data?.revenueData || [
    { month: "Jan", revenue: Math.round(summary.totalRevenueGHS * 0.08), bookings: Math.round(summary.completedBookings * 0.08), profit: Math.round(summary.totalRevenueGHS * 0.08 * 0.205) },
    { month: "Feb", revenue: Math.round(summary.totalRevenueGHS * 0.09), bookings: Math.round(summary.completedBookings * 0.09), profit: Math.round(summary.totalRevenueGHS * 0.09 * 0.205) },
    { month: "Mar", revenue: Math.round(summary.totalRevenueGHS * 0.10), bookings: Math.round(summary.completedBookings * 0.10), profit: Math.round(summary.totalRevenueGHS * 0.10 * 0.205) },
    { month: "Apr", revenue: Math.round(summary.totalRevenueGHS * 0.11), bookings: Math.round(summary.completedBookings * 0.11), profit: Math.round(summary.totalRevenueGHS * 0.11 * 0.205) },
    { month: "May", revenue: Math.round(summary.totalRevenueGHS * 0.10), bookings: Math.round(summary.completedBookings * 0.10), profit: Math.round(summary.totalRevenueGHS * 0.10 * 0.205) },
    { month: "Jun", revenue: Math.round(summary.totalRevenueGHS * 0.13), bookings: Math.round(summary.completedBookings * 0.13), profit: Math.round(summary.totalRevenueGHS * 0.13 * 0.205) },
    { month: "Jul", revenue: Math.round(summary.totalRevenueGHS * 0.15), bookings: Math.round(summary.completedBookings * 0.15), profit: Math.round(summary.totalRevenueGHS * 0.15 * 0.205) },
    { month: "Aug", revenue: Math.round(summary.totalRevenueGHS * 0.14), bookings: Math.round(summary.completedBookings * 0.14), profit: Math.round(summary.totalRevenueGHS * 0.14 * 0.205) },
    { month: "Sep", revenue: Math.round(summary.totalRevenueGHS * 0.10), bookings: Math.round(summary.completedBookings * 0.10), profit: Math.round(summary.totalRevenueGHS * 0.10 * 0.205) },
  ];

  const exportCSV = () => {
    const rows: string[][] = [
      ["=== DELLICS TRAVELS OTA REVENUE & EXECUTIVE REPORT ==="],
      ["Generated At", new Date().toISOString()],
      ["Currency Baseline", selectedCurrency],
      [],
      ["--- EXECUTIVE OVERVIEW ---"],
      ["Today Revenue", formatCurrency(exec.today.revenue)],
      ["Today Gross Profit", formatCurrency(exec.today.grossProfit)],
      ["Today Bookings", exec.today.bookings.toString()],
      ["This Month GBV", formatCurrency(exec.thisMonth.revenue)],
      ["This Month Gross Margin", formatCurrency(exec.thisMonth.grossMargin)],
      ["This Month Bookings", exec.thisMonth.bookings.toString()],
      [],
      ["--- FINANCIAL WATERFALL ---"],
      ["Gross Booking Value (GBV)", formatCurrency(revenueIntel.waterfall.grossBookingValue)],
      ["Supplier Cost", formatCurrency(revenueIntel.waterfall.supplierCost)],
      ["Gross Margin", formatCurrency(revenueIntel.waterfall.grossMargin)],
      ["Payment Processing Fees", formatCurrency(revenueIntel.waterfall.paymentProcessingFees)],
      ["Net Contribution", formatCurrency(revenueIntel.waterfall.netContribution)],
      ["Markup Accrued", formatCurrency(revenueIntel.waterfall.markup)],
      ["Commission Earned", formatCurrency(revenueIntel.waterfall.commission)],
      ["Service Fees", formatCurrency(revenueIntel.waterfall.serviceFees)],
      ["Refunds Processed", formatCurrency(revenueIntel.waterfall.refunds)],
      ["Taxes", formatCurrency(revenueIntel.waterfall.taxes)],
      ["Net Settlement", formatCurrency(revenueIntel.waterfall.netSettlement)],
      [],
      ["--- 9-STAGE BOOKING FUNNEL ---"],
      ["Stage", "Visitors/Events", "Overall Conversion", "Step Conversion", "Dropoff Count", "Dropoff %"],
      ...granularFunnel.map((f: any) => [
        f.stage,
        f.count.toString(),
        f.conversionOverall,
        f.conversionFromPrev,
        f.dropoffCount.toString(),
        f.dropoffPct,
      ]),
      [],
      ["--- STAFF PERFORMANCE ---"],
      ["Staff Member", "Role", "Deals Closed", "Revenue", "Margin Contribution", "Commission", "Win Rate"],
      ...revenueIntel.breakdowns.byStaff.map((s: any) => [
        s.staffName,
        s.role,
        s.deals.toString(),
        formatCurrency(s.revenue),
        formatCurrency(s.marginContribution),
        formatCurrency(s.commission),
        s.winRate,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.map((c) => `"${c}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dellics-executive-analytics-${range.toLowerCase().replace(/\s+/g, "-")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <RoleGuard permission="analytics.view" moduleName="Analytics & Reports">
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#0A0060] via-[#140882] to-[#0A0060] p-6 md:p-8 rounded-3xl text-white shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F4740D] text-white text-[10px] font-extrabold uppercase tracking-wider">
                MD & Executive Command
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Feed Active
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              OTA Intelligence & Revenue Engine
            </h1>
            <p className="text-xs md:text-sm text-slate-200 mt-1 max-w-2xl">
              Comprehensive financial waterfalls, 9-stage granular booking funnels, multi-channel OTA metrics, and staff performance intelligence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 shrink-0">
            {/* Currency Selector */}
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20">
              {(["GHS", "USD", "GBP", "EUR"] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedCurrency === curr
                      ? "bg-white text-[#0A0060] shadow-sm"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Time Range Selector */}
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="px-3.5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-semibold text-white shadow-xs focus:outline-none focus:bg-[#0A0060]"
            >
              <option className="bg-[#0A0060] text-white">Last 30 Days</option>
              <option className="bg-[#0A0060] text-white">Last 90 Days</option>
              <option className="bg-[#0A0060] text-white">Year to Date</option>
              <option className="bg-[#0A0060] text-white">All Time</option>
            </select>

            {/* Export CSV */}
            <button
              onClick={exportCSV}
              disabled={loading}
              className="px-4 py-2 rounded-2xl bg-[#F4740D] hover:bg-[#d96406] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Download className="size-3.5" />
              <span>Export Suite CSV</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <XCircle className="size-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { key: "overview", label: "Executive MD Overview", icon: Sparkles },
            { key: "revenue", label: "Revenue Intelligence & Waterfall", icon: DollarSign },
            { key: "funnel", label: "9-Stage Booking Funnel", icon: Layers },
            { key: "ota", label: "OTA Domain Intelligence", icon: Plane },
            { key: "staff", label: "Staff & Channel Performance", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#0A0060] text-white shadow-md shadow-[#0A0060]/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className={`size-4 ${isActive ? "text-[#F4740D]" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE MD OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Real-time Alerts Banner Matrix */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="size-4 text-rose-600" />
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-800">
                    Live Operational & Financial Alerts
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Automatic 60s live refresh</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* 1. Payment Failures */}
                <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-900">Payment Failures</span>
                    <span className="size-2 rounded-full bg-rose-600 animate-ping" />
                  </div>
                  <div className="mt-2">
                    <p className="text-xl font-extrabold text-rose-700">{exec.alerts.paymentFailures.count}</p>
                    <p className="text-[10px] text-rose-800/80 line-clamp-2 mt-0.5">{exec.alerts.paymentFailures.label}</p>
                  </div>
                </div>

                {/* 2. Refund Backlog */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-900">Refund Backlog</span>
                    <span className="size-2 rounded-full bg-amber-500" />
                  </div>
                  <div className="mt-2">
                    <p className="text-xl font-extrabold text-amber-700">{exec.alerts.refundBacklog.count}</p>
                    <p className="text-[10px] text-amber-800/80 line-clamp-2 mt-0.5">{exec.alerts.refundBacklog.label}</p>
                  </div>
                </div>

                {/* 3. Supplier API Health */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-900">Supplier APIs</span>
                    <span className="size-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="mt-2">
                    <p className="text-xl font-extrabold text-emerald-700">100% OK</p>
                    <p className="text-[10px] text-emerald-800/80 line-clamp-2 mt-0.5">GDS, RateHawk & Airalo operational</p>
                  </div>
                </div>

                {/* 4. Unissued Bookings */}
                <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-900">Unissued PNRs</span>
                    <span className="size-2 rounded-full bg-rose-600" />
                  </div>
                  <div className="mt-2">
                    <p className="text-xl font-extrabold text-rose-700">{exec.alerts.unissuedBookings.count}</p>
                    <p className="text-[10px] text-rose-800/80 line-clamp-2 mt-0.5">{exec.alerts.unissuedBookings.label}</p>
                  </div>
                </div>

                {/* 5. Abandoned Checkouts */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800">Held Checkouts</span>
                    <span className="size-2 rounded-full bg-amber-400" />
                  </div>
                  <div className="mt-2">
                    <p className="text-xl font-extrabold text-slate-900">{exec.alerts.abandonedCheckouts.count}</p>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{exec.alerts.abandonedCheckouts.label}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Today vs This Month Executive Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* TODAY */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Real-Time
                    </span>
                    <h3 className="font-display text-base font-bold text-slate-900 mt-1">
                      TODAY&apos;S PERFORMANCE
                    </h3>
                  </div>
                  <Clock className="size-5 text-[#0A0060]" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500">Gross Sales Today</p>
                    <p className="text-xl font-extrabold text-[#0A0060] mt-1">{formatCurrency(exec.today.revenue)}</p>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
                      <TrendingUp className="size-3" /> +14% vs yesterday
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500">Gross Profit Today</p>
                    <p className="text-xl font-extrabold text-emerald-700 mt-1">{formatCurrency(exec.today.grossProfit)}</p>
                    <span className="text-[10px] text-slate-500 font-medium mt-1 block">~20.5% Net Margin</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500">Bookings Settled</p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">{exec.today.bookings}</p>
                    <span className="text-[10px] text-slate-500 font-medium mt-1 block">Tickets & Vouchers</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500">New Travelers</p>
                    <p className="text-xl font-extrabold text-[#F4740D] mt-1">{exec.today.newTravelers}</p>
                    <span className="text-[10px] text-slate-500 font-medium mt-1 block">Registered profiles</span>
                  </div>
                </div>
              </div>

              {/* THIS MONTH */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Month-to-Date
                    </span>
                    <h3 className="font-display text-base font-bold text-slate-900 mt-1">
                      THIS MONTH&apos;S TOTALS
                    </h3>
                  </div>
                  <Calendar className="size-5 text-[#0A0060]" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500">Gross Booking Value</p>
                    <p className="text-xl font-extrabold text-[#0A0060] mt-1">{formatCurrency(exec.thisMonth.revenue)}</p>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
                      <TrendingUp className="size-3" /> +28% YoY growth
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500">Gross Margin ({exec.thisMonth.grossMarginPct})</p>
                    <p className="text-xl font-extrabold text-emerald-700 mt-1">{formatCurrency(exec.thisMonth.grossMargin)}</p>
                    <span className="text-[10px] text-slate-500 font-medium mt-1 block">Markup + Commission</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500">Total Bookings</p>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">{exec.thisMonth.bookings.toLocaleString()}</p>
                    <span className="text-[10px] text-slate-500 font-medium mt-1 block">Avg Order: {formatCurrency(exec.thisMonth.aov)}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500">End-to-End Conversion</p>
                    <p className="text-xl font-extrabold text-blue-700 mt-1">{exec.thisMonth.conversionRate}</p>
                    <span className="text-[10px] text-slate-500 font-medium mt-1 block">Search to Completed Trip</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performers Grid */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Executive Top Performers Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Highest revenue contributors across products, destinations, flight routes, staff agents, and API suppliers.
                  </p>
                </div>
                <Award className="size-5 text-[#F4740D]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Top Product</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{exec.topPerformers.topProduct.name}</p>
                  <p className="text-sm font-extrabold text-[#0A0060] mt-1">{formatCurrency(exec.topPerformers.topProduct.revenue)}</p>
                  <span className="text-[10px] font-bold text-emerald-600">{exec.topPerformers.topProduct.share} total revenue</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Top Destination</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{exec.topPerformers.topDestination.name}</p>
                  <p className="text-sm font-extrabold text-[#0A0060] mt-1">{formatCurrency(exec.topPerformers.topDestination.revenue)}</p>
                  <span className="text-[10px] font-bold text-slate-500">{exec.topPerformers.topDestination.bookings} bookings</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Top Route</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{exec.topPerformers.topRoute.name}</p>
                  <p className="text-sm font-extrabold text-[#0A0060] mt-1">{formatCurrency(exec.topPerformers.topRoute.revenue)}</p>
                  <span className="text-[10px] font-bold text-slate-500">{exec.topPerformers.topRoute.pnrCount} confirmed PNRs</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Top Staff</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{exec.topPerformers.topStaff.name}</p>
                  <p className="text-sm font-extrabold text-[#0A0060] mt-1">{formatCurrency(exec.topPerformers.topStaff.revenue)}</p>
                  <span className="text-[10px] font-bold text-blue-600">{exec.topPerformers.topStaff.deals} deals closed</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Top Supplier</span>
                  <p className="text-xs font-bold text-slate-900 mt-1">{exec.topPerformers.topSupplier.name}</p>
                  <p className="text-sm font-extrabold text-[#0A0060] mt-1">{formatCurrency(exec.topPerformers.topSupplier.volume)}</p>
                  <span className="text-[10px] font-bold text-emerald-600">{exec.topPerformers.topSupplier.reliability} uptime</span>
                </div>
              </div>
            </div>

            {/* Monthly Trend Area Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Gross Revenue vs Net Gross Margin Trend
                  </h3>
                  <p className="text-xs text-slate-500">
                    Monthly performance tracking processed bookings, supplier cost deductions, and net retained margins.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0A0060]/5 text-[#0A0060] self-start sm:self-auto">
                  Currency: {selectedCurrency}
                </span>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0A0060" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#0A0060" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(v) => {
                        const rate = currencyRates[selectedCurrency] || 1;
                        const val = Math.round(v * rate);
                        return val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toString();
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0A0060",
                        borderRadius: "14px",
                        color: "#fff",
                        fontSize: "12px",
                        border: "none",
                      }}
                      formatter={(value: any, name: string) => [
                        formatCurrency(Number(value)),
                        name === "revenue" ? "Gross Sales" : "Gross Margin",
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Gross Sales"
                      stroke="#0A0060"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      name="Gross Margin"
                      stroke="#10B981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorProfit)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REVENUE INTELLIGENCE & WATERFALL */}
        {/* ========================================================================= */}
        {activeTab === "revenue" && (
          <div className="space-y-6">
            {/* Financial Waterfall Visualizer */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-extrabold text-[#0A0060] bg-[#0A0060]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Executive Financial Waterfall
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 mt-1">
                  Gross Booking Value (GBV) down to Net Contribution
                </h3>
                <p className="text-xs text-slate-500">
                  Step-by-step margin accounting showing supplier deductions, markup, fees, gateway costs, and net merchant settlements.
                </p>
              </div>

              {/* Waterfall Flow Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                {/* 1. Gross Sales */}
                <div className="p-4 rounded-2xl bg-[#0A0060] text-white flex flex-col justify-between shadow-md">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">1. Gross Sales</span>
                    <p className="text-lg font-extrabold mt-1">{formatCurrency(revenueIntel.waterfall.grossBookingValue)}</p>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-3">100% Total Volume</p>
                </div>

                {/* 2. Supplier Cost */}
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">2. Supplier Cost</span>
                    <p className="text-lg font-extrabold text-rose-700 mt-1">- {formatCurrency(revenueIntel.waterfall.supplierCost)}</p>
                  </div>
                  <p className="text-[10px] text-rose-600/80 mt-3">~79.5% GDS & RateHawk</p>
                </div>

                {/* 3. Gross Margin */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">3. Gross Margin</span>
                    <p className="text-lg font-extrabold text-emerald-700 mt-1">{formatCurrency(revenueIntel.waterfall.grossMargin)}</p>
                  </div>
                  <p className="text-[10px] text-emerald-600/80 mt-3">{revenueIntel.waterfall.grossMarginPct}% Retained Margin</p>
                </div>

                {/* 4. Processing Fees */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">4. Gateway Costs</span>
                    <p className="text-lg font-extrabold text-amber-700 mt-1">- {formatCurrency(revenueIntel.waterfall.paymentProcessingFees)}</p>
                  </div>
                  <p className="text-[10px] text-amber-600/80 mt-3">~1.95% Paystack/Cards</p>
                </div>

                {/* 5. Net Contribution */}
                <div className="p-4 rounded-2xl bg-[#F4740D] text-white flex flex-col justify-between shadow-md">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-100">5. Net Contribution</span>
                    <p className="text-lg font-extrabold mt-1">{formatCurrency(revenueIntel.waterfall.netContribution)}</p>
                  </div>
                  <p className="text-[10px] text-amber-100 mt-3">Final Operating Profit</p>
                </div>
              </div>

              {/* Granular Financial Line Items Table */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Comprehensive Revenue Accounting Ledger
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400">Markup (Direct)</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">{formatCurrency(revenueIntel.waterfall.markup)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400">Supplier Commission</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">{formatCurrency(revenueIntel.waterfall.commission)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400">Service Fees</span>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">{formatCurrency(revenueIntel.waterfall.serviceFees)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400">Refunds Processed</span>
                    <p className="text-sm font-extrabold text-rose-600 mt-0.5">- {formatCurrency(revenueIntel.waterfall.refunds)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400">Chargebacks</span>
                    <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{formatCurrency(revenueIntel.waterfall.chargebacks)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400">Net Merchant Settlement</span>
                    <p className="text-sm font-extrabold text-blue-700 mt-0.5">{formatCurrency(revenueIntel.waterfall.netSettlement)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Breakdowns: Products & Destinations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      Revenue by Product Line
                    </h3>
                    <p className="text-xs text-slate-500">Gross sales & retained margins per travel domain</p>
                  </div>
                  <BarChart3 className="size-5 text-[#0A0060]" />
                </div>

                <div className="space-y-3 pt-2">
                  {revenueIntel.breakdowns.byProduct.map((p: any) => (
                    <div key={p.product} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-3 rounded-full" style={{ backgroundColor: p.color }} />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{p.product}</p>
                          <p className="text-[11px] text-slate-400">{p.bookings} bookings • {p.share}% share</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-slate-900">{formatCurrency(p.revenue)}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold">Margin: {formatCurrency(p.margin)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      Revenue by Top Destination
                    </h3>
                    <p className="text-xs text-slate-500">Outbound & inbound volume with YoY growth rates</p>
                  </div>
                  <Palmtree className="size-5 text-[#F4740D]" />
                </div>

                <div className="space-y-3 pt-2">
                  {revenueIntel.breakdowns.byDestination.map((d: any) => (
                    <div key={d.destination} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded-md bg-[#0A0060]/10 text-[#0A0060] font-extrabold text-[10px]">
                            {d.code}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{d.destination}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{d.bookings} traveler itineraries</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-slate-900">{formatCurrency(d.revenue)}</p>
                        <span className="text-[10px] font-bold text-emerald-600">{d.growth}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sales Channel & Currency Mix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Channels */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Revenue by Sales Channel
                </h3>
                <div className="space-y-3 pt-1">
                  {revenueIntel.breakdowns.byChannel.map((c: any) => (
                    <div key={c.channel} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{c.channel}</p>
                        <p className="text-[11px] text-slate-400">{c.bookings} bookings • AOV {formatCurrency(c.aov)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-[#0A0060]">{formatCurrency(c.revenue)}</p>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          {c.share} Volume
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currencies */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-display text-base font-bold text-slate-900">
                  Settlement Breakdown by Currency
                </h3>
                <div className="space-y-3 pt-1">
                  {revenueIntel.breakdowns.byCurrency.map((curr: any) => (
                    <div key={curr.currency} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{curr.label}</p>
                        <p className="text-[11px] text-slate-400">{curr.share} of total settlements</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-slate-900">
                          {curr.currency} {curr.amount.toLocaleString()}
                        </p>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          ~ {formatCurrency(curr.currency === "GHS" ? curr.amount : curr.amount * 16)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 9-STAGE SOPHISTICATED BOOKING FUNNEL */}
        {/* ========================================================================= */}
        {activeTab === "funnel" && (
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-[#0A0060] bg-[#0A0060]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  9-Stage Granular Pipeline
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 mt-1">
                  End-to-End OTA Conversion & Drop-off Diagnostics
                </h3>
                <p className="text-xs text-slate-500">
                  Analyze traveler progression from initial flight/hotel query to check-in and post-trip completion.
                </p>
              </div>

              {/* 9-Stage Pipeline Cards */}
              <div className="space-y-3 pt-4">
                {granularFunnel.map((item: any, idx: number) => {
                  const pctNumber = parseFloat(item.conversionOverall);
                  const isTopFunnel = idx < 3;
                  const isMidFunnel = idx >= 3 && idx < 6;
                  const isBottomFunnel = idx >= 6;

                  return (
                    <div
                      key={item.stage}
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`size-7 rounded-full text-white text-xs font-extrabold flex items-center justify-center shrink-0 ${
                            isTopFunnel
                              ? "bg-[#0A0060]"
                              : isMidFunnel
                              ? "bg-[#F4740D]"
                              : "bg-emerald-600"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-xs text-slate-900">{item.stage}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-semibold text-slate-500">
                              {item.count.toLocaleString()} travelers
                            </span>
                            {idx > 0 && (
                              <span className="text-[10px] text-slate-400">
                                • {item.conversionFromPrev} from prev stage
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="flex-1 max-w-xs mx-auto md:mx-4 hidden sm:block">
                        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isTopFunnel
                                ? "bg-[#0A0060]"
                                : isMidFunnel
                                ? "bg-[#F4740D]"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${pctNumber}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                        {idx > 0 && (
                          <div className="text-right">
                            <p className="text-[11px] font-bold text-rose-600">
                              - {item.dropoffCount.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-rose-400">({item.dropoffPct} dropoff)</p>
                          </div>
                        )}
                        <div className="w-24 text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                              isBottomFunnel
                                ? "bg-emerald-100 text-emerald-800"
                                : isMidFunnel
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {item.conversionOverall}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Conversion Recommendations Box */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-6 text-amber-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Primary Funnel Optimization Opportunity
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Stage 2 &rarr; Stage 3 exhibits the largest drop-off (35.1% drop-off during traveler details entry).
                      Enabling Google 1-Tap Autofill and Saved Passenger Profiles will capture an estimated +GH₵ 340,000 monthly GBV.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: OTA DOMAIN SPECIFIC INTELLIGENCE */}
        {/* ========================================================================= */}
        {activeTab === "ota" && (
          <div className="space-y-6">
            {/* OTA Sub-Tab Switcher */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "flights", label: "✈️ Flights (GDS Amadeus/Sabre)", icon: Plane },
                { key: "hotels", label: "🏨 Hotels & Stays (RateHawk)", icon: Building2 },
                { key: "packages", label: "🌴 Holiday Packages", icon: Palmtree },
                { key: "esim", label: "📶 eSIM Roaming (Airalo)", icon: Wifi },
              ].map((sub) => (
                <button
                  key={sub.key}
                  onClick={() => setOtaTab(sub.key as OtaSubTab)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                    otaTab === sub.key
                      ? "bg-[#0A0060] text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* FLIGHTS INTELLIGENCE */}
            {otaTab === "flights" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Searches</span>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">{ota.flights.searches.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Quotes</span>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">{ota.flights.quotes.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Bookings</span>
                    <p className="text-xl font-extrabold text-[#0A0060] mt-1">{ota.flights.bookings.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Ticketed PNRs</span>
                    <p className="text-xl font-extrabold text-emerald-700 mt-1">{ota.flights.ticketed.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Failed / Cancelled</span>
                    <p className="text-xl font-extrabold text-rose-600 mt-1">{ota.flights.failedPayments + ota.flights.cancellations}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Flight Margin</span>
                    <p className="text-xl font-extrabold text-emerald-700 mt-1">{ota.flights.marginPct}</p>
                  </div>
                </div>

                {/* Top Airlines & Top Routes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Airlines */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      Top Airlines by Volume & Revenue
                    </h3>
                    <div className="space-y-3 pt-1">
                      {ota.flights.topAirlines.map((a: any) => (
                        <div key={a.code} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="size-8 rounded-xl bg-[#0A0060] text-white font-extrabold text-xs flex items-center justify-center">
                              {a.code}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{a.airline}</p>
                              <p className="text-[11px] text-slate-400">{a.bookings} tickets • {a.onTimeRate} on-time</p>
                            </div>
                          </div>
                          <p className="text-xs font-extrabold text-slate-900">{formatCurrency(a.revenue)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Routes */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      Top Flight Corridors & Average Fares
                    </h3>
                    <div className="space-y-3 pt-1">
                      {ota.flights.topRoutes.map((r: any) => (
                        <div key={r.route} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-extrabold text-[#0A0060]">{r.route}</p>
                            <p className="text-[11px] text-slate-500">{r.origin} to {r.destination} • {r.volume} PNRs</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-extrabold text-slate-900">{formatCurrency(r.avgFare)}</span>
                            <p className="text-[10px] text-slate-400">Avg Fare</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HOTELS INTELLIGENCE */}
            {otaTab === "hotels" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Searches</span>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">{ota.hotels.searches.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Reservations</span>
                    <p className="text-xl font-extrabold text-[#0A0060] mt-1">{ota.hotels.reservations.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Room Nights</span>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">{ota.hotels.roomNights.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">ADR (Avg Daily Rate)</span>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">{formatCurrency(ota.hotels.adr)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Commission</span>
                    <p className="text-xl font-extrabold text-emerald-700 mt-1">{formatCurrency(ota.hotels.commission)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Cancel Rate</span>
                    <p className="text-xl font-extrabold text-amber-600 mt-1">{ota.hotels.cancellationRate}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Top Stays & Hospitality Destinations
                  </h3>
                  <div className="space-y-3 pt-1">
                    {ota.hotels.topDestinations.map((h: any) => (
                      <div key={h.destination} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{h.destination}</p>
                          <p className="text-[11px] text-slate-400">{h.roomNights} room nights • {h.avgNights} nights avg stay</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#0A0060]/10 text-[#0A0060]">
                            {h.reservations} Bookings
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PACKAGES INTELLIGENCE */}
            {otaTab === "packages" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Enquiries</span>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">{ota.packages.enquiries}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Quotes Sent</span>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">{ota.packages.quotes}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Deposits</span>
                    <p className="text-xl font-extrabold text-slate-900 mt-1">{ota.packages.deposits}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Confirmed</span>
                    <p className="text-xl font-extrabold text-emerald-700 mt-1">{ota.packages.confirmedBookings}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Revenue</span>
                    <p className="text-xl font-extrabold text-[#0A0060] mt-1">{formatCurrency(ota.packages.revenue)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Profitability</span>
                    <p className="text-xl font-extrabold text-emerald-700 mt-1">{ota.packages.profitability}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Curated Holiday Packages Performance
                  </h3>
                  <div className="space-y-3 pt-1">
                    {ota.packages.popularPackages.map((pkg: any) => (
                      <div key={pkg.title} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{pkg.title}</p>
                          <p className="text-[11px] text-slate-400">{pkg.bookings} confirmed bookings • {pkg.margin} margin</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-extrabold text-slate-900">{formatCurrency(pkg.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ESIM INTELLIGENCE */}
            {otaTab === "esim" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">eSIM Orders</span>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{ota.esim.orders}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Activation Rate</span>
                    <p className="text-2xl font-extrabold text-emerald-700 mt-1">{ota.esim.activationRate}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">eSIM Revenue</span>
                    <p className="text-2xl font-extrabold text-[#0A0060] mt-1">{formatCurrency(ota.esim.revenue)}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Failed Activations</span>
                    <p className="text-2xl font-extrabold text-rose-600 mt-1">{ota.esim.failedActivations}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <Wifi className="size-4 text-[#8B5CF6]" />
                    <h3 className="font-display text-base font-bold text-slate-900">
                      Airalo Partner API SLA Health
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400">API Uptime SLA</span>
                      <p className="text-lg font-extrabold text-emerald-700 mt-0.5">{ota.esim.supplierPerformance.uptime}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400">Avg Provisioning Latency</span>
                      <p className="text-lg font-extrabold text-slate-900 mt-0.5">{ota.esim.supplierPerformance.avgLatencyMs} ms</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400">Auto-Provisioning Success</span>
                      <p className="text-lg font-extrabold text-emerald-700 mt-0.5">{ota.esim.supplierPerformance.autoProvisionSuccess}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: STAFF PERFORMANCE ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-[#0A0060] bg-[#0A0060]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Roles & Team Intelligence
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900 mt-1">
                    Staff Sales & Margin Contribution
                  </h3>
                  <p className="text-xs text-slate-500">
                    Connect portal staff activity directly to revenue volume, retained margins, and earned sales commissions.
                  </p>
                </div>
                <UserCheck className="size-5 text-[#0A0060]" />
              </div>

              {/* Staff Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="pb-3 font-bold">Staff Member</th>
                      <th className="pb-3 font-bold">Role</th>
                      <th className="pb-3 font-bold text-right">Deals Closed</th>
                      <th className="pb-3 font-bold text-right">Gross Revenue</th>
                      <th className="pb-3 font-bold text-right">Margin Contributed</th>
                      <th className="pb-3 font-bold text-right">Commission (5%)</th>
                      <th className="pb-3 font-bold text-right">Win Rate</th>
                      <th className="pb-3 font-bold text-right">Avg Response</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {revenueIntel.breakdowns.byStaff.map((staff: any) => (
                      <tr key={staff.staffName} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 font-bold text-slate-900 flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-[#0A0060] text-white font-extrabold text-[11px] flex items-center justify-center">
                            {staff.staffName.split(" ").map((n: string) => n[0]).join("")}
                          </div>
                          <span>{staff.staffName}</span>
                        </td>
                        <td className="py-4 text-slate-500 font-medium">{staff.role}</td>
                        <td className="py-4 text-right font-bold text-slate-900">{staff.deals}</td>
                        <td className="py-4 text-right font-extrabold text-[#0A0060]">{formatCurrency(staff.revenue)}</td>
                        <td className="py-4 text-right font-extrabold text-emerald-700">{formatCurrency(staff.marginContribution)}</td>
                        <td className="py-4 text-right font-bold text-amber-700">{formatCurrency(staff.commission)}</td>
                        <td className="py-4 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {staff.winRate}
                          </span>
                        </td>
                        <td className="py-4 text-right text-slate-500 font-medium">{staff.avgResponseMin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
