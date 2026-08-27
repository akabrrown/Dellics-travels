"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
} from "lucide-react";

export default function TravelersList() {
  const [tierFilter, setTierFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Traveler Directory & Profiles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered customer accounts, membership tier balances, and lifetime booking value.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Traveler Name, Email, or Phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
          >
            <option value="ALL">All Tiers</option>
            <option value="STANDARD">Standard</option>
            <option value="PLUS">Plus Member</option>
            <option value="ELITE">Elite Member</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
          >
            <option value="ALL">All Account Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Travelers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Traveler</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Membership Tier</th>
              <th className="px-6 py-4">Lifetime Spend</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Row 1 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-[#0A0060] text-white font-bold flex items-center justify-center text-xs shrink-0">
                    KM
                  </div>
                  <div>
                    <Link
                      href="/travelers/TRV-102"
                      className="font-bold text-slate-900 hover:text-[#0A0060] hover:underline"
                    >
                      Kwame Mensah
                    </Link>
                    <p className="text-[11px] text-slate-400">ID: TRV-102</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-slate-800 font-medium">kwame.m@example.com</p>
                <p className="text-[11px] text-slate-400">+233 24 123 4567</p>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800 border border-amber-300">
                  Elite Member (VIP)
                </span>
              </td>
              <td className="px-6 py-4">
                <p className="font-display font-extrabold text-slate-900">GHS 42,800.00</p>
                <p className="text-[10px] text-slate-400">8 completed trips</p>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href="/travelers/TRV-102"
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#0A0060] hover:text-white font-bold text-[11px] transition-colors"
                >
                  View Profile
                </Link>
              </td>
            </tr>

            {/* Row 2 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-xs shrink-0">
                    AO
                  </div>
                  <div>
                    <Link
                      href="/travelers/TRV-103"
                      className="font-bold text-slate-900 hover:text-[#0A0060] hover:underline"
                    >
                      Ama Osei
                    </Link>
                    <p className="text-[11px] text-slate-400">ID: TRV-103</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-slate-800 font-medium">ama.o@example.com</p>
                <p className="text-[11px] text-slate-400">+233 20 987 6543</p>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
                  Plus Member
                </span>
              </td>
              <td className="px-6 py-4">
                <p className="font-display font-extrabold text-slate-900">GHS 14,200.00</p>
                <p className="text-[10px] text-slate-400">3 completed trips</p>
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href="/travelers/TRV-103"
                  className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#0A0060] hover:text-white font-bold text-[11px] transition-colors"
                >
                  View Profile
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
