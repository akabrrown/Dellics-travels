"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Download,
  Users,
  CheckCircle2,
  DollarSign,
  Calendar,
  RefreshCw,
  XCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { adminApi } from "@/lib/api";

interface AnalyticsData {
  summary: {
    totalRevenueGHS: number;
    completedBookings: number;
    avgBookingValue: number;
    totalTravelers: number;
    currency: string;
  };
  revenueData: Array<{ month: string; revenue: number; bookings: number }>;
  funnelData: Array<{ stage: string; visitors: number; conversion: string }>;
}

export default function AnalyticsReports() {
  const [range, setRange] = useState("Last 30 Days");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.get<{ data: AnalyticsData }>(
        `/booking/admin/analytics?range=${encodeURIComponent(range)}`
      );
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load live analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const exportCSV = () => {
    if (!data) return;
    const rows = [
      ["Month", "Revenue (GHS)", "Bookings Count"],
      ...data.revenueData.map((r) => [r.month, r.revenue.toString(), r.bookings.toString()]),
      [],
      ["Funnel Stage", "Visitors", "Conversion Rate"],
      ...data.funnelData.map((f) => [f.stage, f.visitors.toString(), f.conversion]),
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dellics-analytics-${range.toLowerCase().replace(/\s+/g, "-")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const revenueData = data?.revenueData || [];
  const funnelData = data?.funnelData || [];
  const summary = data?.summary || {
    totalRevenueGHS: 0,
    completedBookings: 0,
    avgBookingValue: 0,
    totalTravelers: 0,
    currency: "GHS",
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Analytics & Conversion Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time live revenue tracking, booking funnel conversion, and traveler acquisition metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:border-[#0A0060]"
          >
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Year to Date</option>
            <option>All Time</option>
          </select>
          <button
            onClick={exportCSV}
            disabled={!data || loading}
            className="px-4 py-2 rounded-full bg-[#0A0060] hover:bg-[#140882] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="size-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <XCircle className="size-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !data && (
        <div className="py-20 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="size-6 animate-spin text-[#0A0060]" />
          <span>Aggregating live transaction and booking funnel metrics...</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Revenue
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-[#0A0060]">
              {summary.currency} {summary.totalRevenueGHS.toLocaleString()}
            </p>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="size-3" />
              Live
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Settled Paystack & offline</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Completed Bookings
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-slate-900">
              {summary.completedBookings.toLocaleString()}
            </p>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <CheckCircle2 className="size-3" />
              Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Confirmed tickets & vouchers</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Average Order Value
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-slate-900">
              {summary.currency} {summary.avgBookingValue.toLocaleString()}
            </p>
            <span className="text-xs font-bold text-slate-500 flex items-center gap-0.5">
              <DollarSign className="size-3" />
              Per Order
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across flights, stays & packages</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Registered Travelers
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-[#F4740D]">
              {summary.totalTravelers.toLocaleString()}
            </p>
            <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5">
              <Users className="size-3" />
              CRM
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Traveler accounts created</p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">
              Monthly Revenue Performance
            </h2>
            <p className="text-xs text-slate-500">
              Live settlement amounts processed through Paystack Cards, MoMo, and Direct Cash
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0A0060]/5 text-[#0A0060] self-start sm:self-auto">
            Currency: {summary.currency}
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A0060" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0A0060" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(value) => `${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0A0060",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(value: any) => [`${summary.currency} ${Number(value).toLocaleString()}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0A0060"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Funnel */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">
            Booking Pipeline & Conversion Funnel
          </h2>
          <p className="text-xs text-slate-500">
            Conversion efficiency from initial flight & hotel search down to confirmed issuance
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {funnelData.map((item, index) => (
            <div
              key={item.stage}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="size-6 rounded-full bg-[#0A0060] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <span className="font-bold text-xs text-slate-900">{item.stage}</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-display font-extrabold text-xs text-slate-900">
                    {item.visitors.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400">Events / Records</p>
                </div>
                <div className="w-20 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                    {item.conversion}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
