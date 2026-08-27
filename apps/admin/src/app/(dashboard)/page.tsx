"use client";

import React from "react";
import Link from "next/link";
import {
  CalendarCheck,
  RotateCcw,
  Headphones,
  Activity,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const PIPELINE = [
    { label: "Held", count: 12, sub: "Expires in <30m", href: "/bookings?status=HELD", color: "border-slate-200" },
    { label: "Confirmed", count: 1402, sub: "Active & ticketed", href: "/bookings?status=CONFIRMED", color: "border-slate-200" },
    { label: "Needs Attention", count: 8, sub: "Schedule/PNR mismatch", href: "/bookings?status=ATTENTION", color: "border-amber-400 bg-amber-50/40 text-amber-900" },
    { label: "Completed", count: 8293, sub: "Past trips", href: "/bookings?status=COMPLETED", color: "border-slate-200" },
    { label: "Cancelled", count: 144, sub: "Refunded/Void", href: "/bookings?status=CANCELLED", color: "border-slate-200" },
  ];

  const PENDING_REFUNDS = [
    {
      id: "REF-9021",
      bookingId: "BK-8392",
      type: "Flight · Emirates",
      route: "ACC → DXB",
      traveler: "Kwame Mensah",
      amount: "GHS 2,150.00",
      reason: "Traveler cancellation within 24hr free window (Full refund eligible)",
      tier: "Elite Member",
      time: "14 mins ago",
    },
    {
      id: "REF-9020",
      bookingId: "BK-8344",
      type: "Hotel · Cape Town",
      route: "Radisson Blu 4 Nights",
      traveler: "Afia Osei",
      amount: "GHS 4,890.00",
      reason: "Flight cancelled by airline · Rebooked alternate carrier",
      tier: "Plus Member",
      time: "42 mins ago",
    },
    {
      id: "REF-9019",
      bookingId: "BK-8290",
      type: "eSIM · Global 10GB",
      route: "Airalo Data Pack",
      traveler: "David Asante",
      amount: "GHS 380.00",
      reason: "Airalo profile provisioning failed after 3 auto-retries",
      tier: "Standard",
      time: "1 hour ago",
    },
  ];

  const SUPPORT_SLA = [
    {
      id: "TKT-4412",
      traveler: "Dr. Mensah",
      tier: "Elite Member",
      subject: "Seat assignment request for Emirates business leg",
      wait: "4 mins wait",
      slaUrgent: true,
    },
    {
      id: "TKT-4411",
      traveler: "Sarah Addo",
      tier: "Plus Member",
      subject: "Cape Coast heritage tour pickup timing confirmation",
      wait: "18 mins wait",
      slaUrgent: false,
    },
    {
      id: "TKT-4410",
      traveler: "Michael Ocloo",
      tier: "Standard",
      subject: "Inquiry on UK transit visa requirements",
      wait: "25 mins wait",
      slaUrgent: false,
    },
  ];

  const SUPPLIERS = [
    { name: "Duffel Flights GDS", status: "Operational", ping: "284ms", err: "0.00%", ok: true },
    { name: "RateHawk Hotels", status: "Degraded", ping: "1,420ms", err: "3.2%", ok: false, fallback: "Amadeus BedBank active" },
    { name: "Airalo eSIM API", status: "Operational", ping: "310ms", err: "0.01%", ok: true },
    { name: "Paystack Gateway", status: "Operational", ping: "195ms", err: "0.00%", ok: true },
  ];


  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Operational Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pipeline overview, pending queues, and supplier health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/bookings"
            className="px-4 py-2 rounded-full bg-[#0A0060] text-white text-xs font-semibold hover:bg-[#140882] transition-colors shadow-xs flex items-center gap-1.5"
          >
            <CalendarCheck className="size-3.5" />
            <span>Manage All Bookings</span>
          </Link>
        </div>
      </div>

      {/* 1. Bookings Pipeline Row (Shopify Pattern) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Bookings Pipeline
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">
            Live counts across all 6 service categories
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {PIPELINE.map((stage) => (
            <Link
              key={stage.label}
              href={stage.href}
              className={`p-4 rounded-2xl bg-white border shadow-xs hover:shadow-md transition-all group ${stage.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 group-hover:text-[#0A0060]">
                  {stage.label}
                </span>
                <ChevronRight className="size-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="font-display text-2xl font-extrabold text-slate-900 mt-2">
                {stage.count.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{stage.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Main Operational Workflows (Stripe & Zendesk Triage Patterns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Refund & Cancellation Queue */}
        <section className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <RotateCcw className="size-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    Refund & Cancellation Queue
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live requests pending agent / admin review
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
                  5 pending
                </span>
                <Link
                  href="/refunds"
                  className="text-xs font-bold text-[#F4740D] hover:underline ml-2"
                >
                  View Queue →
                </Link>
              </div>
            </div>

            <div className="p-5 divide-y divide-slate-100">
              {PENDING_REFUNDS.map((ref) => (
                <div key={ref.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-slate-900">
                          {ref.amount}
                        </span>
                        <span className="text-xs font-medium text-slate-400">·</span>
                        <span className="text-xs font-semibold text-[#0A0060]">
                          {ref.bookingId}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          {ref.tier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {ref.traveler} · {ref.type} ({ref.route})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-400">{ref.time}</span>
                      <Link
                        href={`/refunds?id=${ref.id}`}
                        className="px-3 py-1.5 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-semibold transition-colors"
                      >
                        Review
                      </Link>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Reason: </span>
                    {ref.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue & Transaction Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Today&apos;s Gross Volume
                </p>
                <p className="font-display text-2xl font-extrabold text-[#0A0060] mt-1">
                  GHS 84,320.00
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  +14.2% vs yesterday
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <CreditCard className="size-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Today&apos;s Refund Rate
                </p>
                <p className="font-display text-2xl font-extrabold text-slate-900 mt-1">
                  0.38%
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Well under 1.5% target ceiling
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 text-slate-600">
                <ShieldCheck className="size-6" />
              </div>
            </div>
          </div>
        </section>

        {/* Right Col: Supplier Health + Support Queue */}
        <section className="space-y-6">
          {/* Supplier Health Strip */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-[#0A0060]" />
                <h3 className="font-display text-sm font-bold text-slate-900">
                  Supplier & API Health
                </h3>
              </div>
              <Link
                href="/health"
                className="text-xs font-bold text-[#F4740D] hover:underline"
              >
                Inspect →
              </Link>
            </div>

            <ul className="space-y-3">
              {SUPPLIERS.map((sup) => (
                <li
                  key={sup.name}
                  className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div>
                    <p className="font-bold text-slate-800">{sup.name}</p>
                    <p className="text-[11px] text-slate-500">
                      p95 {sup.ping} · err {sup.err}
                    </p>
                    {sup.fallback && (
                      <p className="text-[10px] text-amber-700 font-medium mt-0.5">
                        ↳ {sup.fallback}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full ${
                      sup.ok
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        sup.ok ? "bg-emerald-600" : "bg-amber-600 animate-pulse"
                      }`}
                    />
                    {sup.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Ticket Queue by SLA */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Headphones className="size-4 text-[#0A0060]" />
                <h3 className="font-display text-sm font-bold text-slate-900">
                  Support Queue (SLA)
                </h3>
              </div>
              <Link
                href="/support"
                className="text-xs font-bold text-[#F4740D] hover:underline"
              >
                Claim →
              </Link>
            </div>

            <ul className="space-y-2.5">
              {SUPPORT_SLA.map((ticket) => (
                <li
                  key={ticket.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0A0060]">
                      {ticket.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ticket.slaUrgent
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {ticket.wait}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {ticket.subject}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                    <span>{ticket.traveler}</span>
                    <span className="font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
                      {ticket.tier}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
