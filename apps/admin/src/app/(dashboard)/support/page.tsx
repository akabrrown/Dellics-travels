"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
} from "lucide-react";

export default function SupportQueue() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Support & Concierge SLA Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Zendesk-style ticket triage prioritized by traveler membership tier SLA.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Chat Gateway Online
          </span>
        </div>
      </div>

      {/* KPI Triage Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs flex flex-col justify-between bg-rose-50/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-700">
            SLA Warning / Breached
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-rose-700">3</p>
            <span className="text-[11px] font-bold text-rose-600">&gt; 15m (Elite Target)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Unassigned Queue
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-slate-900">14</p>
            <span className="text-[11px] text-slate-400 font-medium">Awaiting claim</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            My Open Tickets
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-[#0A0060]">5</p>
            <span className="text-[11px] text-slate-400 font-medium">Active conversations</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs flex flex-col justify-between bg-emerald-50/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Active Live Sessions
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-emerald-700">2</p>
            <span className="text-[11px] font-bold text-emerald-600">Real-time socket</span>
          </div>
        </div>
      </div>

      {/* Filter Dropdown Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search traveler, ticket ID, or message subject..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
          >
            <option value="ALL">Status: All</option>
            <option value="OPEN">Status: Open</option>
            <option value="PENDING">Status: Pending Customer</option>
            <option value="RESOLVED">Status: Resolved</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
          >
            <option value="ALL">Assignee: All Agents</option>
            <option value="ME">Assignee: Me (Michael K.)</option>
            <option value="UNASSIGNED">Assignee: Unassigned</option>
          </select>
        </div>
      </div>

      {/* Support Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Ticket & Traveler</th>
              <th className="px-6 py-4">Tier & Priority</th>
              <th className="px-6 py-4">Subject & Context</th>
              <th className="px-6 py-4">Wait Time</th>
              <th className="px-6 py-4">Assigned Agent</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Ticket 1 */}
            <tr className="hover:bg-slate-50/50 transition-colors bg-amber-50/20">
              <td className="px-6 py-4">
                <Link
                  href="/support/TKT-4410"
                  className="font-mono font-bold text-[#0A0060] hover:underline block"
                >
                  #TKT-4410
                </Link>
                <span className="font-bold text-slate-900">Kwame Mensah</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-300">
                  Elite Member (5m SLA)
                </span>
              </td>
              <td className="px-6 py-4 max-w-xs">
                <p className="font-semibold text-slate-800 truncate">
                  Emirates Schedule Revision Inquiry
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  Booking #BK-8392 flight departure pushed back by 2 hours
                </p>
              </td>
              <td className="px-6 py-4">
                <span className="font-bold text-rose-600 font-mono">14m (Warning)</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                  Unassigned
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href="/support/TKT-4410"
                  className="px-3.5 py-1.5 rounded-full bg-[#0A0060] hover:bg-[#140882] text-white font-bold text-[11px] transition-colors inline-block"
                >
                  Claim & Reply
                </Link>
              </td>
            </tr>

            {/* Ticket 2 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <Link
                  href="/support/TKT-4409"
                  className="font-mono font-bold text-[#0A0060] hover:underline block"
                >
                  #TKT-4409
                </Link>
                <span className="font-bold text-slate-900">Afia Osei</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
                  Plus Member (15m SLA)
                </span>
              </td>
              <td className="px-6 py-4 max-w-xs">
                <p className="font-semibold text-slate-800 truncate">
                  Hotel Early Check-In Request
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  Marina Bay Grand Dubai reservation #BK-8391
                </p>
              </td>
              <td className="px-6 py-4 text-slate-500 font-mono">6m</td>
              <td className="px-6 py-4">
                <span className="text-slate-700 font-medium">Jane Doe</span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href="/support/TKT-4409"
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#0A0060] hover:text-white font-bold text-[11px] transition-colors inline-block"
                >
                  Open Chat
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
