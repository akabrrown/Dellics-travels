"use client";

import React, { useState } from "react";
import {
  Plus,
  X,
  Sparkles,
  Tag,
  Clock,
  CheckCircle2,
  Trash2,
  Percent,
  DollarSign,
  ShieldCheck,
} from "lucide-react";

interface PromoCodeItem {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  currency: string;
  minSpend: number;
  category: string;
  membershipTier: string;
  redemptions: number;
  maxRedemptions: number;
  validityStart: string;
  validityEnd: string;
  status: "ACTIVE" | "EXPIRED" | "PAUSED";
}

const INITIAL_PROMOS: PromoCodeItem[] = [
  {
    id: "PR-1",
    code: "WELCOME20",
    discountType: "PERCENTAGE",
    discountValue: 20,
    currency: "GHS",
    minSpend: 1000,
    category: "ALL",
    membershipTier: "ALL",
    redemptions: 1402,
    maxRedemptions: 5000,
    validityStart: "2026-01-01",
    validityEnd: "2026-12-31",
    status: "ACTIVE",
  },
  {
    id: "PR-2",
    code: "SUMMER500",
    discountType: "FIXED",
    discountValue: 500,
    currency: "GHS",
    minSpend: 2500,
    category: "HOTEL",
    membershipTier: "VOYAGER",
    redemptions: 50,
    maxRedemptions: 50,
    validityStart: "2026-06-01",
    validityEnd: "2026-08-31",
    status: "EXPIRED",
  },
  {
    id: "PR-3",
    code: "ELITEVIP15",
    discountType: "PERCENTAGE",
    discountValue: 15,
    currency: "USD",
    minSpend: 1500,
    category: "PACKAGE",
    membershipTier: "ELITE",
    redemptions: 18,
    maxRedemptions: 100,
    validityStart: "2026-08-01",
    validityEnd: "2026-12-31",
    status: "ACTIVE",
  },
];

export default function PromotionsManager() {
  const [promos, setPromos] = useState<PromoCodeItem[]>(INITIAL_PROMOS);
  const [promoModal, setPromoModal] = useState(false);

  // New Promo Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("10");
  const [currency, setCurrency] = useState("GHS");
  const [minSpend, setMinSpend] = useState("1000");
  const [category, setCategory] = useState("ALL");
  const [tierGate, setTierGate] = useState("ALL");
  const [maxRedemptions, setMaxRedemptions] = useState("500");
  const [validityStart, setValidityStart] = useState("2026-09-01");
  const [validityEnd, setValidityEnd] = useState("2026-12-31");

  // Urgency Controls State
  const [urgencyRoute, setUrgencyRoute] = useState("Accra to Dubai (ACC → DXB) · Emirates Special");
  const [urgencyText, setUrgencyText] = useState("Only 3 Seats Remaining at this Fare");
  const [urgencyTimer, setUrgencyTimer] = useState("2026-10-31T23:59");
  const [urgencySuccess, setUrgencySuccess] = useState(false);

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newPromo: PromoCodeItem = {
      id: `PR-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue) || 10,
      currency,
      minSpend: Number(minSpend) || 0,
      category,
      membershipTier: tierGate,
      redemptions: 0,
      maxRedemptions: Number(maxRedemptions) || 100,
      validityStart,
      validityEnd,
      status: "ACTIVE",
    };

    setPromos([newPromo, ...promos]);
    setPromoModal(false);
    setCode("");
  };

  const handleToggleStatus = (id: string) => {
    setPromos(
      promos.map((p) =>
        p.id === id ? { ...p, status: p.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : p
      )
    );
  };

  const handleDeletePromo = (id: string) => {
    setPromos(promos.filter((p) => p.id !== id));
  };

  const handlePublishUrgency = () => {
    setUrgencySuccess(true);
    setTimeout(() => setUrgencySuccess(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Promotions & Deal Urgency Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Section 5.4 A09: Coupon code rules, tier-gated vouchers, and real-inventory countdown badges.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Promos List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                Configured Coupon Codes & Vouchers
              </h3>
              <p className="text-[11px] text-slate-500">
                Redeemable at S26 Promo Code Entry during checkout
              </p>
            </div>
            <span className="text-xs font-bold text-[#0A0060]">
              {promos.filter((p) => p.status === "ACTIVE").length} Active
            </span>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {promos.map((p) => (
              <div key={p.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-mono font-bold tracking-wider rounded-xl border border-emerald-300 text-xs">
                      {p.code}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : p.status === "PAUSED"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(p.id)}
                      className="px-3 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-semibold"
                    >
                      {p.status === "ACTIVE" ? "Pause" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDeletePromo(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-800 font-semibold">
                  {p.discountType === "PERCENTAGE" ? `${p.discountValue}% Discount` : `${p.currency} ${p.discountValue} Flat Off`}{" "}
                  <span className="text-slate-400 font-normal">
                    (Min spend: {p.currency} {p.minSpend.toLocaleString()})
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-slate-500">
                  <span>Scope: <b className="text-slate-700">{p.category}</b></span>
                  <span>·</span>
                  <span>Tier: <b className="text-slate-700">{p.membershipTier}</b></span>
                  <span>·</span>
                  <span>Used: <b className="text-slate-700">{p.redemptions} / {p.maxRedemptions}</b></span>
                  <span>·</span>
                  <span>Expires: <b className="text-slate-700">{p.validityEnd}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Badge Controls (1 col) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-[#F4740D]" />
              <h3 className="font-display text-sm font-bold text-slate-900">
                Deal Urgency Overrides
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Drives real-time countdown timers and scarcity badges on S08 Home & S20 Detail.
            </p>
          </div>

          {urgencySuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Urgency banner synced live!</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Flight / Holiday Package
              </label>
              <select
                value={urgencyRoute}
                onChange={(e) => setUrgencyRoute(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
              >
                <option>Accra to Dubai (ACC → DXB) · Emirates Special</option>
                <option>Cape Coast Heritage & Kakum Canopy Walk</option>
                <option>Safari Valley Luxury Eco-Retreat</option>
                <option>London Heathrow Direct (ACC → LHR) · British Airways</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Urgency Badge Text
              </label>
              <input
                type="text"
                value={urgencyText}
                onChange={(e) => setUrgencyText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Countdown Expiration (UTC)
              </label>
              <input
                type="datetime-local"
                value={urgencyTimer}
                onChange={(e) => setUrgencyTimer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
              />
            </div>

            <button
              onClick={handlePublishUrgency}
              className="w-full py-2.5 bg-[#0A0060] hover:bg-[#140882] text-white text-xs font-bold rounded-full transition-colors shadow-xs"
            >
              Publish Urgency Banner
            </button>
          </div>
        </div>
      </div>

      {/* New Promo Code Modal with Complete CMS Fields */}
      {promoModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreatePromo}
            className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-50 text-[#F4740D]">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Create Promo Coupon Rule
                  </h3>
                  <p className="text-[11px] text-slate-500">Configure discount value, usage ceilings, and tier gates.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPromoModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Coupon Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIASPORA2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase text-slate-900 focus:outline-none focus:border-[#0A0060]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 cursor-pointer"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Cash Value</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Value {discountType === "PERCENTAGE" ? "(%)" : `(${currency})`}
                  </label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                    placeholder="15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 cursor-pointer"
                  >
                    <option value="GHS">GHS</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Spend Required</label>
                  <input
                    type="number"
                    value={minSpend}
                    onChange={(e) => setMinSpend(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                    placeholder="1000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Applicable Service</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 cursor-pointer"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="FLIGHT">Flights Only</option>
                    <option value="HOTEL">Hotels Only</option>
                    <option value="PACKAGE">Tour Packages Only</option>
                    <option value="ESIM">eSIM Roaming Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Membership Tier Gate</label>
                  <select
                    value={tierGate}
                    onChange={(e) => setTierGate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 cursor-pointer"
                  >
                    <option value="ALL">All Members (Explorer+)</option>
                    <option value="VOYAGER">Voyager & Elite Only</option>
                    <option value="ELITE">Elite VIP Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={validityStart}
                    onChange={(e) => setValidityStart(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expires On</label>
                  <input
                    type="date"
                    value={validityEnd}
                    onChange={(e) => setValidityEnd(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Max Redemptions</label>
                <input
                  type="number"
                  value={maxRedemptions}
                  onChange={(e) => setMaxRedemptions(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                  placeholder="500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPromoModal(false)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-bold shadow-xs"
              >
                Create Promo Code
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
