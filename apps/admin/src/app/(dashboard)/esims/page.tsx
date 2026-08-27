"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
} from "lucide-react";

export default function ESIMOrders() {
  const [filter, setFilter] = useState("ALL");
  const [retrying, setRetrying] = useState<string | null>(null);

  const handleRetry = (id: string) => {
    setRetrying(id);
    setTimeout(() => {
      setRetrying(null);
      alert(`eSIM ${id} provisioning re-dispatched to Airalo Partner API.`);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            eSIM Orders & Provisioning
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage Airalo global digital SIM activations, profile QR delivery, and data usage.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Active eSIMs
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-slate-900">412</p>
            <span className="text-xs font-bold text-emerald-600">Across 38 Countries</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Live data sessions connected</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Issued Today
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-[#0A0060]">24</p>
            <span className="text-xs font-bold text-emerald-600">100% automated</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Instant QR generated on checkout</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs flex flex-col justify-between bg-amber-50/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Provisioning Failed
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-amber-700">1</p>
            <span className="text-[11px] font-bold text-amber-700">Action Required</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Airalo API timeout on callback</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ICCID, traveler, or country plan..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
        >
          <option value="ALL">Status: All Profiles</option>
          <option value="ACTIVE">Status: Active</option>
          <option value="FAILED">Status: Provisioning Failed</option>
        </select>
      </div>

      {/* eSIM Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">ICCID / Destination</th>
              <th className="px-6 py-4">Traveler & Booking</th>
              <th className="px-6 py-4">Data Usage</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Failed Row */}
            <tr className="hover:bg-slate-50/50 transition-colors bg-amber-50/10">
              <td className="px-6 py-4">
                <span className="font-mono font-bold text-slate-900 block">
                  89012607921892019
                </span>
                <span className="text-[10px] text-slate-500">United Arab Emirates (10GB / 30 Days)</span>
              </td>
              <td className="px-6 py-4">
                <p className="font-bold text-slate-900">David Asante</p>
                <Link href="/bookings/BK-8390" className="text-[10px] text-[#0A0060] hover:underline">
                  #BK-8390
                </Link>
              </td>
              <td className="px-6 py-4">
                <span className="font-mono text-slate-500">0.00 / 10.00 GB</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                  <AlertTriangle className="size-3" />
                  Provisioning Failed
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleRetry("89012607921892019")}
                  disabled={retrying === "89012607921892019"}
                  className="px-3.5 py-1.5 rounded-full bg-[#0A0060] hover:bg-[#140882] text-white font-bold text-[11px] transition-colors flex items-center gap-1 ml-auto"
                >
                  <RefreshCw className={`size-3 ${retrying === "89012607921892019" ? "animate-spin" : ""}`} />
                  <span>{retrying === "89012607921892019" ? "Retrying..." : "Retry Provisioning"}</span>
                </button>
              </td>
            </tr>

            {/* Active Row */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <span className="font-mono font-bold text-slate-900 block">
                  89012607441029482
                </span>
                <span className="text-[10px] text-slate-500">United Kingdom & Europe (20GB / 30 Days)</span>
              </td>
              <td className="px-6 py-4">
                <p className="font-bold text-slate-900">Kwame Mensah</p>
                <Link href="/bookings/BK-8392" className="text-[10px] text-[#0A0060] hover:underline">
                  #BK-8392
                </Link>
              </td>
              <td className="px-6 py-4">
                <span className="font-mono font-bold text-emerald-600">4.20 / 20.00 GB</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                  <CheckCircle2 className="size-3" />
                  Active
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => alert("eSIM QR Profile emailed to traveler.")}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#0A0060] hover:text-white font-bold text-[11px] transition-colors"
                >
                  Resend QR
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
