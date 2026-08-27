"use client";

import React, { useState } from "react";
import {
  Plus,
  X,
  Sparkles,
} from "lucide-react";

export default function PromotionsManager() {
  const [promoModal, setPromoModal] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("10% OFF");
  const [newMinSpend, setNewMinSpend] = useState("GHS 1,000");

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Promotions & Deal Urgency Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create coupon discount codes and manage live countdown urgency banners on mobile and web.
          </p>
        </div>
        <button
          onClick={() => setPromoModal(true)}
          className="px-5 py-2.5 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 w-fit"
        >
          <Plus className="size-3.5" />
          <span>New Promo Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Promos List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-display text-sm font-bold text-slate-900">
              Active Promo Codes
            </h3>
            <span className="text-xs text-slate-500 font-medium">1 active · 1 expired</span>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {/* Promo 1 */}
            <div className="p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-mono font-bold tracking-widest rounded-xl border border-emerald-300 text-xs">
                    WELCOME20
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">
                20% off first flight or hotel reservation
              </p>
              <div className="flex justify-between items-center mt-3 text-[11px] text-slate-400">
                <span>Redemptions: 1,402 / Unlimited</span>
                <span>Expires: Dec 31, 2026</span>
              </div>
            </div>

            {/* Promo 2 */}
            <div className="p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 font-mono font-bold tracking-widest rounded-xl border border-slate-300 text-xs">
                    SUMMERFLASH
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  Expired
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">
                GHS 500 flat discount on stays above GHS 2,000
              </p>
              <div className="flex justify-between items-center mt-3 text-[11px] text-slate-400">
                <span>Redemptions: 50 / 50</span>
                <span>Expired: Aug 15, 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Urgency Badge Controls */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display text-sm font-bold text-slate-900">
              Deal Urgency Overrides
            </h3>
            <p className="text-[11px] text-slate-500">
              Displays badge & countdown timers on homepage deals (Section 5.3 A09).
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Target Deal / Flight Route
              </label>
              <select className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060]">
                <option>Accra to Dubai (ACC → DXB) · Emirates Special</option>
                <option>Cape Town 4-Night Radisson Getaway</option>
                <option>London Heathrow Direct (ACC → LHR) · British Airways</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Urgency Badge Text
              </label>
              <input
                type="text"
                defaultValue="Only 3 Seats Remaining at this Price"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Countdown Expiration (UTC)
              </label>
              <input
                type="datetime-local"
                defaultValue="2026-10-31T23:59"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
              />
            </div>

            <button
              onClick={() => alert("Urgency banner published across mobile and web platforms.")}
              className="w-full py-2.5 bg-[#0A0060] hover:bg-[#140882] text-white text-xs font-bold rounded-full transition-colors shadow-xs"
            >
              Publish Urgency Badge
            </button>
          </div>
        </div>
      </div>

      {/* New Promo Code Modal */}
      {promoModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-50 text-[#F4740D]">
                  <Sparkles className="size-4" />
                </div>
                <h3 className="font-display text-base font-bold text-slate-900">New Promo Code</h3>
              </div>
              <button
                onClick={() => setPromoModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Promo Code</label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER26"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase text-slate-900 focus:outline-none focus:border-[#0A0060]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Discount Value</label>
                <input
                  type="text"
                  placeholder="e.g. 15% OFF or GHS 200"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Minimum Spend</label>
                <input
                  type="text"
                  placeholder="e.g. GHS 1,500"
                  value={newMinSpend}
                  onChange={(e) => setNewMinSpend(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPromoModal(false)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Promo code ${newCode || "DELLICS"} created successfully!`);
                  setPromoModal(false);
                }}
                className="px-5 py-2 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-bold shadow-xs"
              >
                Create Promo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
