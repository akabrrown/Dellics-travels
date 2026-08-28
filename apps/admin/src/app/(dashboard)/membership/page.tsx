"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Crown,
  Award,
  CheckCircle2,
  Save,
} from "lucide-react";

export default function MembershipConfig() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Membership & Loyalty Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage the three traveler tiers (Standard, Plus, Elite), points multiplier rules, and manual perks.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
        >
          <Save className="size-3.5" />
          <span>{saved ? "Configuration Saved!" : "Save Tier Settings"}</span>
        </button>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: Standard */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
                <Award className="size-5" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Entry Tier
              </span>
            </div>

            <h3 className="font-display text-lg font-bold text-slate-900">
              Standard
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Default level for all registered travelers.
            </p>

            <div className="mt-6 space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Spend Threshold (Annual)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value="GHS 0 (Default)"
                    className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Points Multiplier
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={1.0}
                    step={0.1}
                    className="w-24 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0A0060]"
                  />
                  <span className="text-xs text-slate-500 font-semibold">x base points</span>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500 mb-2">
                  Included Perks:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Fast-track online flight ticketing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Standard support queue routing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Basic itinerary storage</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2: Plus */}
        <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-xs p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
            Popular
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <ShieldCheck className="size-5" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Silver Tier
              </span>
            </div>

            <h3 className="font-display text-lg font-bold text-slate-900">
              Plus Member
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Frequent leisure and business travelers.
            </p>

            <div className="mt-6 space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Spend Threshold (Annual)
                </label>
                <input
                  type="text"
                  defaultValue="GHS 10,000"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0A0060]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Points Multiplier
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={1.5}
                    step={0.1}
                    className="w-24 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0A0060]"
                  />
                  <span className="text-xs text-slate-500 font-semibold">x base points</span>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500 mb-2">
                  Included Perks:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Priority Support SLA (&lt;15 mins)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Free seat selection on select airlines</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Exclusive private hotel discounts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 3: Elite */}
        <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-sm p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-amber-50/30 to-white">
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
            VIP Tier
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Crown className="size-5" />
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Gold / VIP
              </span>
            </div>

            <h3 className="font-display text-lg font-bold text-slate-900">
              Elite Member
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              High-volume corporate & diaspora travelers.
            </p>

            <div className="mt-6 space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Spend Threshold (Annual)
                </label>
                <input
                  type="text"
                  defaultValue="GHS 35,000"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0A0060]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Points Multiplier
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={2.0}
                    step={0.1}
                    className="w-24 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0A0060]"
                  />
                  <span className="text-xs text-slate-500 font-semibold">x base points</span>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500 mb-2">
                  Included Perks:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Instant dedicated Human Concierge SLA (&lt;5 mins)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Complimentary Kotoka Airport Lounge Passes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    <span>Waived booking modification service fees</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Points Adjustment Strip */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="font-display text-sm font-bold text-slate-900">
              Manual Rewards Ledger Adjustment
            </h3>
            <p className="text-[11px] text-slate-500">
              Comp points or resolve dispute compensation. All adjustments are logged to Audit Log (A20).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Traveler ID or Email
            </label>
            <input
              type="text"
              placeholder="e.g. TRV-102 or kwame@..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Points Adjustment (+/-)
            </label>
            <input
              type="number"
              placeholder="e.g. 500"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Reason / Ticket Reference
            </label>
            <input
              type="text"
              placeholder="e.g. TKT-4410 airline delay apology"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
            />
          </div>
          <div>
            <button
              onClick={() => alert("Points adjusted and recorded in Immutable Audit Log.")}
              className="w-full py-2 bg-[#0A0060] hover:bg-[#140882] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Post Adjustment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
