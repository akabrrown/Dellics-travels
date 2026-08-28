"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, MapPin, Eye } from "lucide-react";

interface TourPackageItem {
  id: string;
  title: string;
  destination: string;
  duration: string;
  price: string;
  status: "PUBLISHED" | "DRAFT";
  category: string;
  image: string;
}

const LIVE_PACKAGES: TourPackageItem[] = [
  {
    id: "PKG-001",
    title: "Cape Coast Heritage & Kakum Canopy Walk",
    destination: "Cape Coast, Ghana",
    duration: "2 Days / 1 Night",
    price: "GHS 1,450",
    status: "PUBLISHED",
    category: "Heritage & Wildlife",
    image: "/images/packages/cape-coast-tour.jpg",
  },
  {
    id: "PKG-002",
    title: "Safari Valley Luxury Eco-Retreat",
    destination: "Okere District, Ghana",
    duration: "3 Days / 2 Nights",
    price: "GHS 4,800",
    status: "PUBLISHED",
    category: "Luxury & Nature",
    image: "/images/packages/safari-valley.jpg",
  },
  {
    id: "PKG-003",
    title: "Dubai Skyline & Desert Safari Escape",
    destination: "Dubai, United Arab Emirates",
    duration: "5 Days / 4 Nights",
    price: "USD $1,850",
    status: "PUBLISHED",
    category: "International Luxury",
    image: "/images/packages/dubai-luxury.jpg",
  },
  {
    id: "PKG-004",
    title: "Zanzibar Spice Island Beach Retreat",
    destination: "Zanzibar, Tanzania",
    duration: "6 Days / 5 Nights",
    price: "USD $2,100",
    status: "PUBLISHED",
    category: "Island & Coastal",
    image: "/images/packages/zanzibar-beach.jpg",
  },
];

export default function ContentList() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredPackages = LIVE_PACKAGES.filter((p) => {
    const matchesFilter = filter === "ALL" || p.status === filter;
    const matchesSearch =
      !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.destination.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0A0060]">
            Content, Packages & Destination CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Curated multi-component holiday packages, booking window dates, and destination landing pages.
          </p>
        </div>
        <Link
          href="/content/new"
          className="px-5 py-2.5 rounded-full bg-[#F4740D] hover:bg-[#d6660b] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 w-fit"
        >
          <Plus className="size-3.5" />
          <span>New Holiday Package</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search package name, destination, or tags..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] transition-all"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0A0060] cursor-pointer"
        >
          <option value="ALL">Visibility: All Status</option>
          <option value="PUBLISHED">Published & Live</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      {/* Packages Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Package Title & Details</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Duration & Category</th>
                <th className="px-6 py-4">Base Fare</th>
                <th className="px-6 py-4">Publication State</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{pkg.title}</p>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {pkg.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <MapPin className="size-3.5 text-rose-500" />
                      <span>{pkg.destination}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{pkg.duration}</p>
                    <span className="text-[10px] text-slate-500">{pkg.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-display font-extrabold text-slate-900">{pkg.price}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/content/${pkg.id}`}
                      className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#0A0060] hover:text-white font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <span>Edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
