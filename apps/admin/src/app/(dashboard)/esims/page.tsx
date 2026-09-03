"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Smartphone,
  QrCode,
} from "lucide-react";
import { adminApi } from "@/lib/api";

interface ESIMOrderItem {
  id: string;
  reference: string;
  status: string;
  iccid?: string | null;
  qrCodeUrl?: string | null;
  region: string;
  dataGb: number;
  validityDays: number;
  price: number;
  travelerName: string;
  travelerEmail: string;
  createdAt: string;
}

export default function ESIMOrders() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<ESIMOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get<{ data: ESIMOrderItem[] }>("/esim/admin/orders");
      if (res && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.warn("[eSIM] Live sync unavailable, using cached records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleDataRefresh = () => {
      fetchOrders();
    };
    window.addEventListener("dellics:refresh-data", handleDataRefresh);
    return () => {
      window.removeEventListener("dellics:refresh-data", handleDataRefresh);
    };
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === "ALL" || o.status === filter;
    const matchesSearch =
      !search.trim() ||
      o.travelerName.toLowerCase().includes(search.toLowerCase()) ||
      o.travelerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.region.toLowerCase().includes(search.toLowerCase()) ||
      (o.iccid && o.iccid.includes(search));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            eSIM Orders & Provisioning
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live Airalo digital SIM activations, QR code delivery status, and roaming data ledger.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchOrders}
            className="px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Orders</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total eSIM Orders
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-slate-900">{orders.length}</p>
            <span className="text-xs font-bold text-emerald-600">Airalo API</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Live partner provisioning sync</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Active / Provisioned
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-[#0A0060]">
              {orders.filter((o) => o.status === "PROVISIONED" || o.status === "ACTIVE").length}
            </p>
            <span className="text-xs font-bold text-emerald-600">QR Issued</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ready for device installation</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pending Orders
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-slate-700">
              {orders.filter((o) => o.status === "PENDING").length}
            </p>
            <span className="text-[11px] font-bold text-slate-500">Processing</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Automated background worker queue</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Traveler, Email, Region, or ICCID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
        >
          <option value="ALL">Status: All Profiles</option>
          <option value="PROVISIONED">Status: Provisioned</option>
          <option value="ACTIVE">Status: Active</option>
          <option value="PENDING">Status: Pending</option>
        </select>
      </div>

      {/* eSIM Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID & Reference</th>
                <th className="px-6 py-4">Traveler</th>
                <th className="px-6 py-4">eSIM Plan & Region</th>
                <th className="px-6 py-4">ICCID / Activation</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400">
                    Loading live eSIM orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Smartphone className="size-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No eSIM orders found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Airalo roaming package orders will appear here automatically.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-[#0A0060] block">
                        {order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400">{order.reference}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{order.travelerName}</p>
                      <span className="text-[10px] text-slate-500">{order.travelerEmail}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{order.region}</p>
                      <span className="text-[11px] text-slate-500">{order.dataGb} GB · {order.validityDays} Days</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-[11px] text-slate-700">
                        {order.iccid || "Generating ICCID..."}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          order.status === "PROVISIONED" || order.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
