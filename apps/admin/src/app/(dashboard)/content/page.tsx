"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
} from "lucide-react";

export default function ContentList() {
  const [activeTab, setActiveTab] = useState("PACKAGES");
  const [filter, setFilter] = useState("ALL");

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Content, Packages & Destination CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Curated multi-component holiday packages, booking window dates, and destination landing pages.
          </p>
        </div>
        <Link
          href="/content/new"
          className="px-5 py-2.5 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 w-fit"
        >
          <Plus className="size-3.5" />
          <span>New Holiday Package</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <button
          onClick={() => setActiveTab("PACKAGES")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
            activeTab === "PACKAGES"
              ? "bg-[#0A0060] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Curated Packages (8)
        </button>
        <button
          onClick={() => setActiveTab("DESTINATIONS")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
            activeTab === "DESTINATIONS"
              ? "bg-[#0A0060] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Destination Guides (12)
        </button>
        <button
          onClick={() => setActiveTab("DRAFTS")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
            activeTab === "DRAFTS"
              ? "bg-[#0A0060] text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Unpublished Drafts (2)
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search package name, destination, or tags..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
        >
          <option value="ALL">Visibility: All Status</option>
          <option value="PUBLISHED">Published & Live</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      {/* Packages Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Package Title & Components</th>
              <th className="px-6 py-4">Destination</th>
              <th className="px-6 py-4">Base Fare</th>
              <th className="px-6 py-4">Publication State</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Package 1 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <p className="font-bold text-slate-900">Cape Coast Heritage & Canopy Walk</p>
                <p className="text-[11px] text-slate-500">Includes: 2 Nights Hotel + Private Transfer + Guide</p>
              </td>
              <td className="px-6 py-4">
                <span className="font-semibold text-slate-700">Central Region, Ghana</span>
              </td>
              <td className="px-6 py-4">
                <p className="font-display font-extrabold text-slate-900">GHS 890.00</p>
                <span className="text-[10px] text-slate-400">per traveler</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                  Published & Live
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <Link
                  href="/content/PKG-101"
                  className="text-[#0A0060] font-bold hover:underline"
                >
                  Edit
                </Link>
                <span className="text-slate-300">·</span>
                <button className="text-rose-600 font-semibold hover:underline">
                  Unpublish
                </button>
              </td>
            </tr>

            {/* Package 2 */}
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <p className="font-bold text-slate-900">Dubai 5-Night Luxury Marina Getaway</p>
                <p className="text-[11px] text-slate-500">Includes: Emirates Flight + 5-Star Hotel + Desert Safari</p>
              </td>
              <td className="px-6 py-4">
                <span className="font-semibold text-slate-700">Dubai, United Arab Emirates</span>
              </td>
              <td className="px-6 py-4">
                <p className="font-display font-extrabold text-slate-900">GHS 6,240.00</p>
                <span className="text-[10px] text-slate-400">per traveler</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                  Published & Live
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <Link
                  href="/content/PKG-102"
                  className="text-[#0A0060] font-bold hover:underline"
                >
                  Edit
                </Link>
                <span className="text-slate-300">·</span>
                <button className="text-rose-600 font-semibold hover:underline">
                  Unpublish
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
