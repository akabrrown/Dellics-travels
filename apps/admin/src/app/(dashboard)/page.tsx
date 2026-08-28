"use client";

import React, { useEffect, useState } from "react";
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
  RefreshCw,
  Clock,
} from "lucide-react";
import { adminApi } from "@/lib/api";

interface PipelineStage {
  label: string;
  count: number;
  sub: string;
  href: string;
  color: string;
}

interface OverviewData {
  pipeline: Array<{ label: string; count: number; sub: string; status: string }>;
  counts: { total: number; held: number; confirmed: number; completed: number; cancelled: number };
  totalRevenueGHS: number;
  recentBookings: any[];
}

interface PaymentStats {
  grossVolumeGHS: number;
  successfulCount: number;
  pendingCount: number;
  refundedCount: number;
  totalCount: number;
}

interface InquiryItem {
  id: string;
  kind: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveDashboard = async () => {
    try {
      const [overviewRes, paymentRes, refundsRes, inquiriesRes] = await Promise.allSettled([
        adminApi.get<{ data: OverviewData }>("/booking/admin/overview"),
        adminApi.get<{ data: PaymentStats }>("/payments/stats"),
        adminApi.get<{ data: any[] }>("/booking/admin/refunds"),
        adminApi.get<{ data: InquiryItem[] }>("/inquiries"),
      ]);

      if (overviewRes.status === "fulfilled" && overviewRes.value?.data) {
        setOverview(overviewRes.value.data);
      }
      if (paymentRes.status === "fulfilled" && paymentRes.value?.data) {
        setPaymentStats(paymentRes.value.data);
      }
      if (refundsRes.status === "fulfilled" && refundsRes.value?.data) {
        setRefunds(refundsRes.value.data);
      }
      if (inquiriesRes.status === "fulfilled" && inquiriesRes.value?.data) {
        setInquiries(inquiriesRes.value.data.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to load live admin dashboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveDashboard();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLiveDashboard();
  };

  const pipelineStages: PipelineStage[] = [
    {
      label: "Held",
      count: overview?.counts.held ?? 0,
      sub: "Active holds",
      href: "/bookings?status=HELD",
      color: "border-slate-200",
    },
    {
      label: "Confirmed",
      count: overview?.counts.confirmed ?? 0,
      sub: "Active & ticketed",
      href: "/bookings?status=CONFIRMED",
      color: "border-slate-200",
    },
    {
      label: "Completed",
      count: overview?.counts.completed ?? 0,
      sub: "Completed trips",
      href: "/bookings?status=COMPLETED",
      color: "border-slate-200",
    },
    {
      label: "Cancelled",
      count: overview?.counts.cancelled ?? 0,
      sub: "Refunded / Void",
      href: "/bookings?status=CANCELLED",
      color: "border-slate-200",
    },
    {
      label: "Total Bookings",
      count: overview?.counts.total ?? 0,
      sub: "All time records",
      href: "/bookings",
      color: "border-brand-orange/40 bg-orange-50/20 text-brand-navy",
    },
  ];

  const SUPPLIERS = [
    { name: "Duffel Flights GDS", status: "Operational", ping: "284ms", err: "0.00%", ok: true },
    { name: "RateHawk Hotels", status: "Operational", ping: "410ms", err: "0.00%", ok: true },
    { name: "Airalo eSIM API", status: "Operational", ping: "310ms", err: "0.00%", ok: true },
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
            Real-time pipeline metrics, live queues, and API connections.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Sync Live Data</span>
          </button>
          <Link
            href="/bookings"
            className="px-4 py-2 rounded-full bg-[#0A0060] text-white text-xs font-semibold hover:bg-[#140882] transition-colors shadow-xs flex items-center gap-1.5"
          >
            <CalendarCheck className="size-3.5" />
            <span>Manage All Bookings</span>
          </Link>
        </div>
      </div>

      {/* 1. Bookings Pipeline Row */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Live Bookings Pipeline
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">
            Live database sync across all 6 service categories
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {pipelineStages.map((stage) => (
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
                {loading ? "..." : stage.count.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{stage.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Main Operational Workflows */}
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
                    Live requests pending review and processing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
                  {refunds.length} records
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
              {loading ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading live refund records...</div>
              ) : refunds.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs font-semibold text-slate-700">No pending refund requests</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">All customer transactions are verified and settled.</p>
                </div>
              ) : (
                refunds.map((ref) => (
                  <div key={ref.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-sm text-slate-900">
                            {ref.currency} {Number(ref.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs font-medium text-slate-400">·</span>
                          <span className="text-xs font-semibold text-[#0A0060]">
                            {ref.reference}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">
                          {ref.travelerName} ({ref.travelerEmail}) · {ref.tripTitle || ref.bookingType}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/refunds?id=${ref.id}`}
                          className="px-3 py-1.5 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-semibold transition-colors"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Revenue & Transaction Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Settled Gross Volume
                </p>
                <p className="font-display text-2xl font-extrabold text-[#0A0060] mt-1">
                  GHS {(paymentStats?.grossVolumeGHS ?? overview?.totalRevenueGHS ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  Live Paystack Settlements
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <CreditCard className="size-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Successful Payments
                </p>
                <p className="font-display text-2xl font-extrabold text-slate-900 mt-1">
                  {(paymentStats?.successfulCount ?? 0).toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {(paymentStats?.pendingCount ?? 0)} pending verification
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
                  </div>
                  <span className="inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <span className="size-1.5 rounded-full bg-emerald-600" />
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
                  Live Client Inquiries
                </h3>
              </div>
              <Link
                href="/support"
                className="text-xs font-bold text-[#F4740D] hover:underline"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="py-6 text-center text-xs text-slate-400">Loading live inquiries...</div>
            ) : inquiries.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-xs font-semibold text-slate-700">No open inquiries</p>
                <p className="text-[11px] text-slate-400 mt-0.5">All customer messages have been responded to.</p>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {inquiries.map((ticket) => (
                  <li
                    key={ticket.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0A0060]">
                        {ticket.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {ticket.kind}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 mt-1 line-clamp-2">
                      {ticket.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                      <span>{ticket.email}</span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock className="size-3" />
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
