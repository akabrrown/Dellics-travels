"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle, Activity, Globe, Database, CreditCard, Plane } from "lucide-react";
import { adminApi } from "@/lib/api";

interface SupplierService {
  id: string;
  name: string;
  category: "FLIGHTS" | "HOTELS" | "ESIM" | "PAYMENTS" | "DATABASE";
  provider: string;
  status: "ONLINE" | "DEGRADED" | "DOWN";
  latencyMs: number;
  endpoint: string;
  lastChecked: string;
  details: string;
  error?: string;
}

interface HealthResponse {
  status: "HEALTHY" | "DEGRADED" | "CRITICAL";
  timestamp: string;
  services: SupplierService[];
}

export default function SupplierHealth() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastPing, setLastPing] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.get<HealthResponse>("/health/suppliers");
      if (res && res.services) {
        setData(res);
        setLastPing(new Date().toLocaleTimeString());
      }
    } catch (err: any) {
      setError(err.message || "Failed to reach live suppliers health endpoint.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "FLIGHTS":
        return <Plane className="size-4 text-[#0A0060]" />;
      case "HOTELS":
        return <Globe className="size-4 text-emerald-600" />;
      case "ESIM":
        return <Activity className="size-4 text-purple-600" />;
      case "PAYMENTS":
        return <CreditCard className="size-4 text-[#F4740D]" />;
      case "DATABASE":
        return <Database className="size-4 text-blue-600" />;
      default:
        return <Activity className="size-4 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ONLINE":
        return (
          <span className="flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
            ONLINE
          </span>
        );
      case "DEGRADED":
        return (
          <span className="flex items-center text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse mr-1.5" />
            DEGRADED
          </span>
        );
      default:
        return (
          <span className="flex items-center text-[10px] font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200">
            <span className="size-2 rounded-full bg-rose-500 mr-1.5" />
            DOWN
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-[#0A0060]">
              Supplier & Inventory Health Monitoring
            </h1>
            {data && (
              <span
                className={`px-3 py-0.5 rounded-full text-[11px] font-bold ${
                  data.status === "HEALTHY"
                    ? "bg-emerald-100 text-emerald-800"
                    : data.status === "DEGRADED"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                CLUSTER {data.status}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time live response latencies, active credentials, and API gateway connectivity.
            {lastPing && <span className="ml-2 text-slate-400 font-mono">Last ping: {lastPing}</span>}
          </p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="px-4 py-2 rounded-full bg-[#0A0060] hover:bg-[#140882] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Pinging APIs..." : "Ping All APIs"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <XCircle className="size-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && !data && (
          <div className="col-span-full py-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="size-6 animate-spin text-[#0A0060]" />
            <span>Pinging live supplier gateways (FX-Port, RateHawk, Airalo, Paystack, Prisma)...</span>
          </div>
        )}

        {data?.services?.map((svc) => (
          <div
            key={svc.id}
            className={`bg-white p-5 rounded-3xl border shadow-xs flex flex-col justify-between space-y-4 transition-all ${
              svc.status === "ONLINE"
                ? "border-slate-200"
                : svc.status === "DEGRADED"
                ? "border-amber-300 bg-amber-50/10"
                : "border-rose-300 bg-rose-50/10"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100">{getCategoryIcon(svc.category)}</div>
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-900">{svc.name}</h3>
                  <p className="text-[11px] text-slate-500 font-mono">Provider: {svc.provider}</p>
                </div>
              </div>
              {getStatusBadge(svc.status)}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Latency</span>
                <span
                  className={`font-mono font-bold ${
                    svc.latencyMs > 1500
                      ? "text-amber-600"
                      : svc.latencyMs > 0
                      ? "text-slate-900"
                      : "text-rose-600"
                  }`}
                >
                  {svc.latencyMs > 0 ? `${svc.latencyMs} ms` : "Unreachable"}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Status Details</span>
                <span className="font-medium text-slate-700 text-right max-w-[180px] truncate">
                  {svc.details}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px] pt-1">
                <span>Endpoint</span>
                <span className="font-mono truncate max-w-[180px]" title={svc.endpoint}>
                  {svc.endpoint}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
