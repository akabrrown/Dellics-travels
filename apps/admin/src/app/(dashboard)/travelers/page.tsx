"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  User,
  Shield,
  Award,
  Crown,
  ChevronRight,
  Eye,
  Mail,
  Phone,
} from "lucide-react";
import { adminApi } from "@/lib/api";

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membershipTier: string;
  pointsBalance: number;
  totalTrips: number;
  totalBookings: number;
  createdAt: string;
}

export default function TravelersDirectory() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get<{ data: AdminUserRecord[] }>("/auth/admin/users");
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Failed to load travelers directory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesTier = tierFilter === "ALL" || u.membershipTier === tierFilter;
    const matchesSearch =
      !search.trim() ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));
    return matchesTier && matchesSearch;
  });

  const getTierBadge = (tier: string) => {
    switch (tier?.toUpperCase()) {
      case "ELITE":
        return "bg-amber-100 text-amber-900 border-amber-300 font-extrabold";
      case "VOYAGER":
        return "bg-blue-100 text-blue-900 border-blue-300 font-bold";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 font-semibold";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Traveler Directory & CRM
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Section 5.3 A05: Registered customer accounts, loyalty points balances, and verified passport records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchUsers}
            className="px-3.5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Directory</span>
          </button>
        </div>
      </div>

      {/* KPI Tier Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Explorer (Standard)</p>
            <p className="font-display text-2xl font-extrabold text-slate-900 mt-1">
              {users.filter((u) => u.membershipTier === "EXPLORER").length}
            </p>
          </div>
          <div className="size-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
            <User className="size-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-blue-600">Voyager (Plus)</p>
            <p className="font-display text-2xl font-extrabold text-blue-950 mt-1">
              {users.filter((u) => u.membershipTier === "VOYAGER").length}
            </p>
          </div>
          <div className="size-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700">
            <Shield className="size-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-amber-600">Elite VIP</p>
            <p className="font-display text-2xl font-extrabold text-amber-950 mt-1">
              {users.filter((u) => u.membershipTier === "ELITE").length}
            </p>
          </div>
          <div className="size-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
            <Crown className="size-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search traveler by Name, Email, or Phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 transition-all"
          />
        </div>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 transition-all cursor-pointer"
        >
          <option value="ALL">All Membership Tiers</option>
          <option value="EXPLORER">Explorer Tier</option>
          <option value="VOYAGER">Voyager Tier</option>
          <option value="ELITE">Elite VIP Tier</option>
        </select>
      </div>

      {/* Travelers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Traveler Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Membership Tier</th>
                <th className="px-6 py-4">Points & Trips</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400">
                    Loading travelers from database...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <UserCheck className="size-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No traveler accounts found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">New signups on Web or Mobile will appear here.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-[#0A0060] text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {user.name ? user.name.slice(0, 2).toUpperCase() : "TR"}
                        </div>
                        <div>
                          <Link
                            href={`/travelers/${user.id}`}
                            className="font-bold text-slate-900 hover:text-[#0A0060] hover:underline block"
                          >
                            {user.name || "Anonymous Traveler"}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {user.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-800 font-medium">{user.email}</p>
                      <p className="text-[11px] text-slate-400">{user.phone || "No phone linked"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getTierBadge(user.membershipTier)}`}>
                        {user.membershipTier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{user.pointsBalance.toLocaleString()} pts</p>
                      <span className="text-[11px] text-slate-500">{user.totalTrips} trips · {user.totalBookings} bookings</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/travelers/${user.id}`}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#0A0060] hover:text-white font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="size-3" />
                        <span>Profile</span>
                      </Link>
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
