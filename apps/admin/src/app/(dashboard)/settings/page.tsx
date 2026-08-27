"use client";

import React, { useState } from "react";
import {
  Save,
  AlertTriangle,
} from "lucide-react";

export default function GlobalSettings() {
  const [activeTab, setActiveTab] = useState<"general" | "flags" | "fx" | "notifications">("general");
  const [saved, setSaved] = useState(false);

  const [flags, setFlags] = useState({
    esimSelfServe: true,
    hotelPriceFreeze: true,
    vipLoungeBooking: true,
    applePayEnabled: true,
    emergencyWhatsAppFallback: true,
    instantRefundsAutoApprove: false,
  });

  const [fxRates, setFxRates] = useState({
    USD_GHS: 15.65,
    EUR_GHS: 17.10,
    GBP_GHS: 19.95,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Platform Configuration & Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global feature flags, currency exchange overrides, API keys, and notification templates.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
        >
          <Save className="size-3.5" />
          <span>{saved ? "Settings Saved!" : "Save Changes"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation Tabs */}
        <div className="space-y-1.5">
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "general"
                ? "bg-[#0A0060] text-white shadow-xs"
                : "text-slate-600 hover:bg-white hover:text-slate-900"
            }`}
          >
            General & Company
          </button>
          <button
            onClick={() => setActiveTab("flags")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "flags"
                ? "bg-[#0A0060] text-white shadow-xs"
                : "text-slate-600 hover:bg-white hover:text-slate-900"
            }`}
          >
            Feature Flags
          </button>
          <button
            onClick={() => setActiveTab("fx")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "fx"
                ? "bg-[#0A0060] text-white shadow-xs"
                : "text-slate-600 hover:bg-white hover:text-slate-900"
            }`}
          >
            Hourly FX Overrides
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "notifications"
                ? "bg-[#0A0060] text-white shadow-xs"
                : "text-slate-600 hover:bg-white hover:text-slate-900"
            }`}
          >
            Notification Templates
          </button>
        </div>

        {/* Tab Content */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === "general" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h3 className="font-display text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                General Business Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Company Registered Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Dellics Travels & Tours Ltd."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Aviation Accreditation Status
                  </label>
                  <input
                    type="text"
                    defaultValue="IATA Certified Agency"
                    disabled
                    className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Headquarters Physical Address
                  </label>
                  <input
                    type="text"
                    defaultValue="Tema Community 25, Devtraco Estate, Greater Accra, Ghana"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Base Ledger Currency
                  </label>
                  <select className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0A0060]">
                    <option>Ghanaian Cedi (GHS)</option>
                    <option>US Dollar (USD)</option>
                    <option>Euro (EUR)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "flags" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display text-sm font-bold text-slate-900">
                  Customer-Facing Feature Flags
                </h3>
                <p className="text-[11px] text-slate-500">
                  Live toggles control feature visibility without requiring code deploys.
                </p>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-3 first:pt-0">
                  <div>
                    <p className="text-xs font-bold text-slate-900">eSIM Self-Serve Ordering</p>
                    <p className="text-[11px] text-slate-500">Allow travelers to buy Airalo eSIMs directly inside the app</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={flags.esimSelfServe}
                    onChange={(e) => setFlags({ ...flags, esimSelfServe: e.target.checked })}
                    className="size-4 accent-[#0A0060] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Hotel Price Freeze / Hold</p>
                    <p className="text-[11px] text-slate-500">Allow 24-hour rate locking with deposit</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={flags.hotelPriceFreeze}
                    onChange={(e) => setFlags({ ...flags, hotelPriceFreeze: e.target.checked })}
                    className="size-4 accent-[#0A0060] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Apple Pay & Google Pay</p>
                    <p className="text-[11px] text-slate-500">Enable one-tap digital wallet checkout via Paystack</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={flags.applePayEnabled}
                    onChange={(e) => setFlags({ ...flags, applePayEnabled: e.target.checked })}
                    className="size-4 accent-[#0A0060] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Instant Refunds Auto-Approval (≤ GHS 500)</p>
                    <p className="text-[11px] text-slate-500">Auto-trigger Paystack refund for cancellations within free window</p>

                  </div>
                  <input
                    type="checkbox"
                    checked={flags.instantRefundsAutoApprove}
                    onChange={(e) => setFlags({ ...flags, instantRefundsAutoApprove: e.target.checked })}
                    className="size-4 accent-[#0A0060] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "fx" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display text-sm font-bold text-slate-900">
                  Hourly FX Exchange Rate Overrides
                </h3>
                <p className="text-[11px] text-slate-500">
                  Bank of Ghana base rates with 1.5% spread buffer for card settlement protection.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    USD to GHS
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    value={fxRates.USD_GHS}
                    onChange={(e) => setFxRates({ ...fxRates, USD_GHS: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0A0060]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    EUR to GHS
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    value={fxRates.EUR_GHS}
                    onChange={(e) => setFxRates({ ...fxRates, EUR_GHS: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0A0060]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    GBP to GHS
                  </label>
                  <input
                    type="number"
                    step={0.01}
                    value={fxRates.GBP_GHS}
                    onChange={(e) => setFxRates({ ...fxRates, GBP_GHS: parseFloat(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0A0060]"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-700" />
                <p>
                  Manual overrides bypass hourly OpenExchangeRates API updates. Remember to clear overrides when market volatility subsides.
                </p>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display text-sm font-bold text-slate-900">
                  Notification Templates (Resend Email & FCM Push)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Manage traveler booking confirmation and schedule change alerts.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Template: Booking Confirmation Email
                  </label>
                  <textarea
                    rows={4}
                    defaultValue="Dear {{traveler_name}}, your booking #{{booking_id}} for {{trip_title}} has been confirmed. Your official electronic ticket and travel voucher are attached."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-[#0A0060]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                    Template: Flight Schedule Change Push Alert
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Flight Update: Your flight {{flight_number}} on {{flight_date}} has a revised departure time of {{departure_time}}. Tap to view updated boarding pass."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-[#0A0060]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
