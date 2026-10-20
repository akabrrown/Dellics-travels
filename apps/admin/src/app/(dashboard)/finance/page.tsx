"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Search,
  TrendingUp,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import { RoleGuard } from "@/components/role-guard";

interface PaymentTransaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  bookingId: string;
  bookingType?: string;
  bookingStatus?: string;
  travelerName: string;
  travelerEmail: string;
  tripTitle?: string;
}

interface PaymentStats {
  grossVolumeGHS: number;
  successfulCount: number;
  pendingCount: number;
  refundedCount: number;
  totalCount: number;
}

export default function FinanceReconciliation() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const [txRes, statsRes] = await Promise.allSettled([
        adminApi.get<{ data: PaymentTransaction[] }>("/payments/admin/transactions"),
        adminApi.get<{ data: PaymentStats }>("/payments/stats"),
      ]);

      if (txRes.status === "fulfilled" && txRes.value?.data) {
        setTransactions(txRes.value.data);
      }
      if (statsRes.status === "fulfilled" && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
    } catch (err) {
      console.warn("[Finance] Live sync unavailable, using cached records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();

    const handleDataRefresh = () => {
      fetchFinanceData();
    };
    window.addEventListener("dellics:refresh-data", handleDataRefresh);
    return () => {
      window.removeEventListener("dellics:refresh-data", handleDataRefresh);
    };
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filter === "ALL" || tx.status === filter;
    const matchesSearch =
      !search.trim() ||
      tx.reference.toLowerCase().includes(search.toLowerCase()) ||
      tx.travelerName.toLowerCase().includes(search.toLowerCase()) ||
      tx.travelerEmail.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <RoleGuard permission="finance.view" moduleName="Finance & Reconciliation">
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Finance & Paystack Reconciliation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live payment verification, gross settlement volume, and automated transaction ledger.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchFinanceData}
            className="px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Ledger</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Settled Volume
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-[#0A0060]">
              GHS {(stats?.grossVolumeGHS ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="size-3" />
              Paystack Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{stats?.successfulCount ?? 0} successful settlements</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pending Verifications
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-amber-700">
              {stats?.pendingCount ?? 0}
            </p>
            <span className="text-[11px] font-bold text-amber-700">Awaiting webhook</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Automatic verification in progress</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Refunds Processed
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-slate-900">
              {stats?.refundedCount ?? 0}
            </p>
            <span className="text-xs font-bold text-slate-500">Completed</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Reconciled via Paystack reverse charges</p>
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
            placeholder="Search by Paystack Reference, Traveler, or Email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
        >
          <option value="ALL">Status: All Records</option>
          <option value="SUCCEEDED">Status: Succeeded</option>
          <option value="PENDING">Status: Pending</option>
          <option value="REFUNDED">Status: Refunded</option>
        </select>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Transaction Reference</th>
                <th className="px-6 py-4">Traveler Details</th>
                <th className="px-6 py-4">Settlement Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-400">
                    Loading live financial ledger...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <CreditCard className="size-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No payment transactions found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Paystack customer transactions will be logged here.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-[#0A0060] block">
                        {tx.reference}
                      </span>
                      <span className="text-[10px] text-slate-400">ID: {tx.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{tx.travelerName}</p>
                      <span className="text-[10px] text-slate-500">{tx.travelerEmail}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-display font-extrabold text-slate-900">
                        {tx.currency} {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          tx.status === "SUCCEEDED"
                            ? "bg-emerald-100 text-emerald-800"
                            : tx.status === "REFUNDED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </RoleGuard>
  );
}
