"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  Plane,
  Building2,
  Smartphone,
} from "lucide-react";

const PIPELINE_STATUSES = [
  { key: "ALL", label: "All Bookings", count: 184 },
  { key: "HELD", label: "Held (24hr)", count: 12 },
  { key: "CONFIRMED", label: "Confirmed", count: 142 },
  { key: "ATTENTION", label: "Needs Attention", count: 8, badge: "bg-rose-100 text-rose-800" },
  { key: "COMPLETED", label: "Completed", count: 19 },
  { key: "CANCELLED", label: "Cancelled", count: 3 },
];

export default function BookingsList() {
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Bookings Pipeline & Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-supplier reservations (Duffel flights, RateHawk hotels, Airalo eSIMs).
          </p>
        </div>
        <Link
          href="/content"
          className="px-5 py-2.5 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 w-fit"
        >
          <span>Create Offline Booking</span>
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      {/* Filter Pipeline Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {PIPELINE_STATUSES.map((status) => (
          <button
            key={status.key}
            onClick={() => setActiveStatus(status.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeStatus === status.key
                ? "bg-[#0A0060] text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{status.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeStatus === status.key
                  ? "bg-white/20 text-white"
                  : status.badge || "bg-slate-100 text-slate-700"
              }`}
            >
              {status.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Dropdown Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Traveler Name, Booking ID, PNR, or Email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 transition-all cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="FLIGHT">Flights (Duffel)</option>
            <option value="HOTEL">Hotels (RateHawk)</option>
            <option value="PACKAGE">Tour Packages</option>
            <option value="ESIM">eSIMs (Airalo)</option>
          </select>

          <input
            type="date"
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 transition-all cursor-pointer"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Booking Reference</th>
              <th className="px-6 py-4">Traveler & Tier</th>
              <th className="px-6 py-4">Product Category</th>
              <th className="px-6 py-4">Gross Ledger</th>
              <th className="px-6 py-4">Pipeline Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Row 1 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <Link
                  href="/bookings/BK-8392"
                  className="font-mono font-bold text-[#0A0060] hover:underline block"
                >
                  BK-8392
                </Link>
                <span className="text-[10px] text-slate-400">PNR: 7F9K2A · Oct 18</span>
              </td>
              <td className="px-6 py-4">
                <p className="font-bold text-slate-900">Kwame Mensah</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 inline-block mt-0.5">
                  Elite Member
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Plane className="size-3.5 text-[#0A0060]" />
                  <span>Emirates (ACC → DXB)</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="font-display font-extrabold text-slate-900">GHS 2,150.00</p>
                <span className="text-[10px] text-slate-400 font-mono">pi_3Mtw2...</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-rose-100 text-rose-800">
                  Needs Attention (Schedule Rev)
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href="/bookings/BK-8392"
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#0A0060] hover:text-white font-bold text-[11px] transition-colors"
                >
                  View Details
                </Link>
              </td>
            </tr>

            {/* Row 2 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <Link
                  href="/bookings/BK-8391"
                  className="font-mono font-bold text-[#0A0060] hover:underline block"
                >
                  BK-8391
                </Link>
                <span className="text-[10px] text-slate-400">RateHawk #99281</span>
              </td>
              <td className="px-6 py-4">
                <p className="font-bold text-slate-900">Ama Osei</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/60 inline-block mt-0.5">
                  Plus Member
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Building2 className="size-3.5 text-blue-600" />
                  <span>Marina Bay Grand, Dubai (3 Nights)</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="font-display font-extrabold text-slate-900">GHS 4,200.00</p>
                <span className="text-[10px] text-emerald-600 font-medium">Stripe Settled</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                  Confirmed
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href="/bookings/BK-8391"
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#0A0060] hover:text-white font-bold text-[11px] transition-colors"
                >
                  View Details
                </Link>
              </td>
            </tr>

            {/* Row 3 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <Link
                  href="/bookings/BK-8390"
                  className="font-mono font-bold text-[#0A0060] hover:underline block"
                >
                  BK-8390
                </Link>
                <span className="text-[10px] text-slate-400">Airalo ICCID: 8901...</span>
              </td>
              <td className="px-6 py-4">
                <p className="font-bold text-slate-900">David Asante</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 inline-block mt-0.5">
                  Standard
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Smartphone className="size-3.5 text-[#F4740D]" />
                  <span>Airalo 10GB Global eSIM</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="font-display font-extrabold text-slate-900">GHS 380.00</p>
                <span className="text-[10px] text-emerald-600 font-medium">Stripe Settled</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                  Confirmed
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href="/bookings/BK-8390"
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#0A0060] hover:text-white font-bold text-[11px] transition-colors"
                >
                  View Details
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
