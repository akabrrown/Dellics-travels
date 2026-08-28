"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Headphones,
  RefreshCw,
  Clock,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import { adminApi } from "@/lib/api";

interface InquiryItem {
  id: string;
  kind: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  payload?: any;
  created_at: string;
}

interface InquiryStats {
  total: number;
  inquiries: number;
  contacts: number;
}

export default function SupportQueue() {
  const [kindFilter, setKindFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [stats, setStats] = useState<InquiryStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const [listRes, statsRes] = await Promise.allSettled([
        adminApi.get<{ data: InquiryItem[] }>("/inquiries"),
        adminApi.get<{ data: InquiryStats }>("/inquiries/stats"),
      ]);

      if (listRes.status === "fulfilled" && listRes.value?.data) {
        setInquiries(listRes.value.data);
      }
      if (statsRes.status === "fulfilled" && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filteredInquiries = inquiries.filter((item) => {
    const matchesKind = kindFilter === "ALL" || item.kind === kindFilter;
    const matchesSearch =
      !search.trim() ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.message.toLowerCase().includes(search.toLowerCase()) ||
      (item.phone && item.phone.includes(search));
    return matchesKind && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Support & Concierge Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live customer consultation requests, bespoke trip inquiries, and direct contact desk tickets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchInquiries}
            className="px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Inbox</span>
          </button>
        </div>
      </div>

      {/* KPI Triage Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Inquiries
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-slate-900">
              {stats?.total ?? inquiries.length}
            </p>
            <span className="text-[11px] text-slate-400 font-medium">All channels</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Custom Trip Inquiries
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-[#0A0060]">
              {stats?.inquiries ?? inquiries.filter((i) => i.kind === "INQUIRY").length}
            </p>
            <span className="text-[11px] font-bold text-emerald-600">Bespoke itineraries</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Direct Contact Messages
          </p>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="font-display text-2xl font-extrabold text-slate-700">
              {stats?.contacts ?? inquiries.filter((i) => i.kind === "CONTACT").length}
            </p>
            <span className="text-[11px] text-slate-400 font-medium">Office & Ticketing Desk</span>
          </div>
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
            placeholder="Search traveler name, email, or message keyword..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
          />
        </div>

        <select
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
        >
          <option value="ALL">All Categories</option>
          <option value="INQUIRY">Custom Inquiries</option>
          <option value="CONTACT">Contact Messages</option>
        </select>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Contact Information</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Message / Requirements</th>
                <th className="px-6 py-4 text-right">Received Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-400">
                    Loading customer inquiries from database...
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <MessageSquare className="size-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No inquiry submissions found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Submissions from /inquire and /contact will appear here in real time.</p>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-800 font-medium flex items-center gap-1.5">
                        <Mail className="size-3 text-slate-400" />
                        <span>{item.email}</span>
                      </p>
                      {item.phone && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Phone className="size-3 text-slate-400" />
                          <span>{item.phone}</span>
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          item.kind === "INQUIRY"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {item.kind}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-slate-700 font-normal line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 text-[11px]">
                      {new Date(item.created_at).toLocaleDateString()}
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
