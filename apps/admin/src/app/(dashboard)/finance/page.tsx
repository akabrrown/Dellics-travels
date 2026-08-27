"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Search,
  TrendingUp,
  Download,
} from "lucide-react";

export default function FinanceReconciliation() {
  const [filter, setFilter] = useState("ALL");

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Finance & Paystack Reconciliation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated 3-way reconciliation: Dellics Ledger ↔ Duffel/RateHawk Costs ↔ Paystack Payouts.
          </p>
        </div>
        <button className="px-4 py-2 rounded-full bg-[#0A0060] hover:bg-[#140882] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs">
          <Download className="size-3.5" />
          <span>Export Ledger (CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Processed (Today)
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-slate-900">
              GHS 24,590.00
            </p>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="size-3" />
              +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">18 successful settlements</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs flex flex-col justify-between bg-amber-50/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Reconciliation Discrepancies
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-amber-700">1</p>
            <span className="text-[11px] font-bold text-amber-700">Requires review</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Paystack fee rounding variance</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Next Paystack Payout
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-[#0A0060]">
              GHS 112,400.00
            </p>
            <span className="text-xs font-bold text-slate-500">Expected Oct 15</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Standard next-day merchant payout</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Paystack Reference or Booking Reference..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
        >
          <option value="ALL">Status: All Records</option>
          <option value="RECONCILED">Status: Reconciled (Matched)</option>
          <option value="DISCREPANCY">Status: Discrepancy Flagged</option>
        </select>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Paystack Ref</th>
              <th className="px-6 py-4">Booking Ref</th>
              <th className="px-6 py-4 text-right">Internal Ledger</th>
              <th className="px-6 py-4 text-right">Paystack Record</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Discrepancy Row */}
            <tr className="hover:bg-slate-50/50 transition-colors bg-amber-50/10">
              <td className="px-6 py-4">
                <span className="font-mono font-bold text-slate-900 block">
                  pstk_3Mtw28491209
                </span>
                <span className="text-[10px] text-slate-400">MTN Mobile Money</span>
              </td>

              <td className="px-6 py-4">
                <Link
                  href="/bookings/BK-8392"
                  className="font-mono font-bold text-[#0A0060] hover:underline block"
                >
                  BK-8392
                </Link>
                <span className="text-[10px] text-slate-500">Kwame Mensah</span>
              </td>
              <td className="px-6 py-4 text-right font-display font-extrabold text-slate-900">
                GHS 2,150.00
              </td>
              <td className="px-6 py-4 text-right font-display font-bold text-amber-700">
                GHS 2,148.50
              </td>
              <td className="px-6 py-4 text-center">
                <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 flex items-center gap-1 w-fit mx-auto">
                  <AlertTriangle className="size-3" />
                  GHS 1.50 Variance
                </span>
              </td>
            </tr>

            {/* Reconciled Row */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <span className="font-mono font-bold text-slate-900 block">
                  pi_3Mtw11894012
                </span>
                <span className="text-[10px] text-slate-400">Card ending 1004</span>
              </td>
              <td className="px-6 py-4">
                <Link
                  href="/bookings/BK-8391"
                  className="font-mono font-bold text-[#0A0060] hover:underline block"
                >
                  BK-8391
                </Link>
                <span className="text-[10px] text-slate-500">Ama Osei</span>
              </td>
              <td className="px-6 py-4 text-right font-display font-extrabold text-slate-900">
                GHS 4,200.00
              </td>
              <td className="px-6 py-4 text-right font-display font-extrabold text-slate-900">
                GHS 4,200.00
              </td>
              <td className="px-6 py-4 text-center">
                <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit mx-auto">
                  <CheckCircle2 className="size-3" />
                  Reconciled
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
