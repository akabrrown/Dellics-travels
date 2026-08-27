"use client";

/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import {
  Star,
  Search,
} from "lucide-react";

export default function ReviewsModeration() {
  const [filter, setFilter] = useState("ALL");

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Verified Reviews & Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Community ratings and traveler feedback moderation for flights, hotels, and holiday packages.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reviews by property, traveler, or booking ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
        >
          <option value="ALL">Status: All Reviews</option>
          <option value="PENDING">Status: Pending Moderation</option>
          <option value="APPROVED">Status: Approved & Live</option>
          <option value="FLAGGED">Status: Flagged / Rejected</option>
        </select>
      </div>

      {/* Reviews Cards */}
      <div className="space-y-4">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#0A0060] text-white font-bold flex items-center justify-center text-xs shrink-0">
                KM
              </div>
              <div>
                <p className="font-bold text-slate-900">Kwame Mensah</p>
                <p className="text-[11px] text-slate-500">
                  Booking #BK-7211 · Verified Stay · Oct 12, 2026
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#0A0060] text-white flex items-center gap-1">
                <Star className="size-3 fill-[#F4740D] text-[#F4740D]" />
                <span>9.0 / 10</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Pending Moderation
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="font-bold text-xs text-slate-900 mb-1">
              Target: Marina Bay Grand, Dubai
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              "Amazing experience! The property was exactly as described on Dellics. The staff were very accommodating when we arrived early. The room view overlooking the marina was spectacular."
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button className="px-4 py-2 rounded-full border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors">
              Reject / Flag
            </button>
            <button className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors">
              Approve & Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
