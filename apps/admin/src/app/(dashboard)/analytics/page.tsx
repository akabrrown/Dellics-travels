"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Download,
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

const REVENUE_DATA = [
  { month: "Jan", revenue: 420000, bookings: 780 },
  { month: "Feb", revenue: 490000, bookings: 890 },
  { month: "Mar", revenue: 560000, bookings: 1020 },
  { month: "Apr", revenue: 610000, bookings: 1140 },
  { month: "May", revenue: 580000, bookings: 1080 },
  { month: "Jun", revenue: 690000, bookings: 1290 },
  { month: "Jul", revenue: 780000, bookings: 1450 },
  { month: "Aug", revenue: 842000, bookings: 1610 },
];

const FUNNEL_DATA = [
  { stage: "1. Search / Discovery", visitors: 48200, conversion: "100%" },
  { stage: "2. Trip & Room Detail", visitors: 21400, conversion: "44.4%" },
  { stage: "3. Checkout / Passenger Form", visitors: 6850, conversion: "32.0%" },
  { stage: "4. Paid & Confirmed", visitors: 4210, conversion: "61.5%" },
];

export default function AnalyticsReports() {
  const [range, setRange] = useState("Last 30 Days");

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Analytics & Conversion Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Revenue tracking, booking funnel conversion, and traveler acquisition metrics.
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
          <button className="px-4 py-2 rounded-full bg-[#0A0060] hover:bg-[#140882] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs">
            <Download className="size-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Revenue
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-[#0A0060]">
              GHS 842,000
            </p>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="size-3" />
              +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">vs preceding 30 days</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Completed Bookings
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-slate-900">
              1,610
            </p>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="size-3" />
              +8.6%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tickets & hotel vouchers</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Average Order Value
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-slate-900">
              GHS 522.98
            </p>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="size-3" />
              +3.1%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all product lines</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Active Travelers
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-slate-900">
              8,492
            </p>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="size-3" />
              +24%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Registered mobile & web</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Revenue Growth Curve */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                Monthly Revenue & Ticket Volume
              </h3>
              <p className="text-[11px] text-slate-500">
                Gross sales volume in GHS across 2026
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="size-2.5 rounded-full bg-[#0A0060]" />
                <span>Gross Revenue (GHS)</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A0060" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0A0060" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(val) => `GHS ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [
                    `GHS ${Number(value ?? 0).toLocaleString()}`,
                    "Revenue",
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    fontSize: 12,
                    borderColor: "#e2e8f0",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0A0060"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Conversion Funnel (Search -> Detail -> Checkout -> Paid) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display text-sm font-bold text-slate-900">
              Booking Conversion Funnel
            </h3>
            <p className="text-[11px] text-slate-500">
              Mirroring mobile app S08 → S20 → S26 → S27 steps
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {FUNNEL_DATA.map((step, idx) => (
              <div key={step.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>{step.stage}</span>
                  <span className="font-mono text-slate-500">
                    {step.visitors.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-[#0A0060] to-[#F4740D] rounded-full transition-all duration-500"
                    style={{
                      width: `${(step.visitors / FUNNEL_DATA[0].visitors) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Step Retention: {step.conversion}</span>
                  {idx > 0 && (
                    <span className="text-amber-600 font-medium">
                      {(
                        (step.visitors / FUNNEL_DATA[idx - 1].visitors) *
                        100
                      ).toFixed(1)}
                      % pass-through
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
            <p className="font-bold text-slate-800">End-to-End Conversion Rate</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              8.73% of search sessions convert to completed payments (benchmark: 6.2%).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
