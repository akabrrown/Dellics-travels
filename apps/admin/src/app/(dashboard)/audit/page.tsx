"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
} from "lucide-react";

export default function AuditLog() {
  const [actorFilter, setActorFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            System Audit Trail & Immutable Log
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident record of all administrative operations, membership overrides, and refund approvals.
          </p>
        </div>
        <button className="px-4 py-2 rounded-full bg-[#0A0060] hover:bg-[#140882] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs">
          <Download className="size-3.5" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search event, actor email, or entity ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
          >
            <option value="ALL">Actor: All Users</option>
            <option value="kwabena.o">Kwabena Osei (Super Admin)</option>
            <option value="akosua.m">Akosua Mensah (Ops)</option>
            <option value="emmanuel.t">Emmanuel Tetteh (Support)</option>
          </select>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
          >
            <option value="ALL">Action: All Events</option>
            <option value="REFUND_ISSUED">REFUND_ISSUED</option>
            <option value="MEMBERSHIP_OVERRIDE">MEMBERSHIP_OVERRIDE</option>
            <option value="PACKAGE_PUBLISHED">PACKAGE_PUBLISHED</option>
            <option value="SETTINGS_CHANGED">SETTINGS_CHANGED</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Timestamp (UTC)</th>
              <th className="px-6 py-4">Actor</th>
              <th className="px-6 py-4">Action Type</th>
              <th className="px-6 py-4">Target Entity</th>
              <th className="px-6 py-4">Metadata Payload & Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {/* Event 1 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 text-slate-500 whitespace-nowrap">2026-10-18T14:32:01Z</td>
              <td className="px-6 py-4 font-sans font-bold text-[#0A0060]">kwabena.o</td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                  MEMBERSHIP_OVERRIDE
                </span>
              </td>
              <td className="px-6 py-4 font-bold text-slate-900">TRV-102</td>
              <td className="px-6 py-4 text-slate-600 font-mono">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-[10px] overflow-x-auto max-w-sm">
                  {`{"from": "VOYAGER", "to": "ELITE", "reason": "Comped VIP tier for airline delay"}`}
                </div>
              </td>
            </tr>

            {/* Event 2 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 text-slate-500 whitespace-nowrap">2026-10-18T12:05:44Z</td>
              <td className="px-6 py-4 font-sans font-bold text-[#0A0060]">akosua.m</td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                  REFUND_ISSUED
                </span>
              </td>
              <td className="px-6 py-4 font-bold text-slate-900">BK-8392</td>
              <td className="px-6 py-4 text-slate-600 font-mono">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-[10px] overflow-x-auto max-w-sm">
                  {`{"amount_ghs": 2150.0, "provider": "PAYSTACK", "policy": "24hr_cooling_off"}`}

                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
