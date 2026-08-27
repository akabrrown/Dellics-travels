"use client";

import React from "react";
import {
  RefreshCw,
} from "lucide-react";

export default function SupplierHealth() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Supplier & Inventory Health Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time p95 response latencies, supplier error rates, and automated fallback triggers.
          </p>
        </div>
        <button
          onClick={() => alert("Health metrics ping refreshed across all supplier clusters.")}
          className="px-4 py-2 rounded-full bg-[#0A0060] hover:bg-[#140882] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <RefreshCw className="size-3.5" />
          <span>Ping All APIs</span>
        </button>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Duffel */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">Duffel Flights</h3>
              <p className="text-[11px] text-slate-500">IATA Direct NDC API</p>
            </div>
            <span className="flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
              ONLINE
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Latency (p95)</span>
              <span className="font-mono font-bold text-slate-900">312 ms</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Error Rate</span>
              <span className="font-mono font-bold text-emerald-600">0.01%</span>
            </div>
          </div>
        </div>

        {/* RateHawk */}
        <div className="bg-white p-5 rounded-3xl border border-amber-300 shadow-xs flex flex-col justify-between space-y-4 bg-amber-50/10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">RateHawk Hotels</h3>
              <p className="text-[11px] text-slate-500">Global Hotel Inventory API</p>
            </div>
            <span className="flex items-center text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
              <span className="size-2 rounded-full bg-amber-500 animate-pulse mr-1.5" />
              DEGRADED
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Latency (p95)</span>
              <span className="font-mono font-bold text-amber-700">1,842 ms</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Error Rate</span>
              <span className="font-mono font-bold text-amber-700">4.20%</span>
            </div>
          </div>
        </div>

        {/* Airalo */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">Airalo eSIMs</h3>
              <p className="text-[11px] text-slate-500">Profile Provisioning API</p>
            </div>
            <span className="flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <span className="size-2 rounded-full bg-emerald-500 mr-1.5" />
              ONLINE
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Latency (p95)</span>
              <span className="font-mono font-bold text-slate-900">420 ms</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Error Rate</span>
              <span className="font-mono font-bold text-emerald-600">0.00%</span>
            </div>
          </div>
        </div>

        {/* Stripe / Paystack */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">Stripe / Paystack</h3>
              <p className="text-[11px] text-slate-500">Card & MoMo Webhooks</p>
            </div>
            <span className="flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <span className="size-2 rounded-full bg-emerald-500 mr-1.5" />
              ONLINE
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Latency (p95)</span>
              <span className="font-mono font-bold text-slate-900">188 ms</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Error Rate</span>
              <span className="font-mono font-bold text-emerald-600">0.00%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
