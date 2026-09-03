"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Package,
  Tag,
  Smartphone,
  RotateCcw,
  Headphones,
  Star,
  CreditCard,
  Activity,
  BarChart3,
  ShieldCheck,
  FileText,
  Sliders,
  Search,
  Bell,
  LogOut,
} from "lucide-react";
import { adminApi } from "@/lib/api";

interface SidebarCounts {
  heldBookings: number;
  pendingRefunds: number;
  openInquiries: number;
  activeEsims: number;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [counts, setCounts] = useState<SidebarCounts>({
    heldBookings: 0,
    pendingRefunds: 0,
    openInquiries: 0,
    activeEsims: 0,
  });

  useEffect(() => {
    const fetchSidebarMetrics = async () => {
      try {
        const [overviewRes, refundsRes, inquiriesRes, esimRes] = await Promise.allSettled([
          adminApi.get<{ data: { counts: { held: number } } }>("/booking/admin/overview"),
          adminApi.get<{ data: any[] }>("/booking/admin/refunds"),
          adminApi.get<{ data: { total: number } }>("/inquiries/stats"),
          adminApi.get<{ data: any[] }>("/esim/admin/orders"),
        ]);

        const held = overviewRes.status === "fulfilled" && overviewRes.value?.data?.counts?.held ? overviewRes.value.data.counts.held : 0;
        const refunds = refundsRes.status === "fulfilled" && Array.isArray(refundsRes.value?.data) ? refundsRes.value.data.length : 0;
        const inquiries = inquiriesRes.status === "fulfilled" && inquiriesRes.value?.data?.total ? inquiriesRes.value.data.total : 0;
        const esims = esimRes.status === "fulfilled" && Array.isArray(esimRes.value?.data) ? esimRes.value.data.length : 0;

        setCounts({
          heldBookings: held,
          pendingRefunds: refunds,
          openInquiries: inquiries,
          activeEsims: esims,
        });
      } catch (err) {
        // Silently preserve clean states
      }
    };

    fetchSidebarMetrics();
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navGroups = [
    {
      group: "Core",
      items: [
        { label: "Dashboard", href: "/", icon: LayoutDashboard },
        {
          label: "Bookings",
          href: "/bookings",
          icon: CalendarCheck,
          badge: counts.heldBookings > 0 ? `${counts.heldBookings} held` : undefined,
          badgeColor: "bg-amber-100 text-amber-800",
        },
        { label: "Travelers", href: "/travelers", icon: Users },
      ],
    },
    {
      group: "Content & Commerce",
      items: [
        { label: "Destinations & Packages", href: "/content", icon: Package },
        { label: "Promotions & Deals", href: "/promotions", icon: Tag },
        {
          label: "eSIM Orders",
          href: "/esims",
          icon: Smartphone,
          badge: counts.activeEsims > 0 ? `${counts.activeEsims}` : undefined,
          badgeColor: "bg-blue-100 text-blue-800",
        },
      ],
    },
    {
      group: "Operations & Support",
      items: [
        {
          label: "Refund Queue",
          href: "/refunds",
          icon: RotateCcw,
          badge: counts.pendingRefunds > 0 ? `${counts.pendingRefunds} pending` : undefined,
          badgeColor: "bg-rose-100 text-rose-800",
        },
        {
          label: "Support Tickets",
          href: "/support",
          icon: Headphones,
          badge: counts.openInquiries > 0 ? `${counts.openInquiries} open` : undefined,
          badgeColor: "bg-blue-100 text-blue-800",
        },
        { label: "Reviews Moderation", href: "/reviews", icon: Star },
      ],
    },
    {
      group: "Finance & System",
      items: [
        { label: "Finance & Reconciliation", href: "/finance", icon: CreditCard },
        {
          label: "Supplier Health",
          href: "/health",
          icon: Activity,
          badge: "All Online",
          badgeColor: "bg-emerald-100 text-emerald-800",
        },
        { label: "Analytics & Reports", href: "/analytics", icon: BarChart3 },
      ],
    },
    {
      group: "Administration",
      items: [
        { label: "Membership & Rewards", href: "/membership", icon: ShieldCheck },
        { label: "Roles & Team", href: "/team", icon: Users },
        { label: "Audit Log", href: "/audit", icon: FileText },
        { label: "Settings", href: "/settings", icon: Sliders },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0A0060] text-white flex flex-col shrink-0 select-none">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-12 flex items-center justify-center shrink-0">
              <Image
                src="/logo.jpeg"
                alt="Dellics Travels"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-white block leading-tight group-hover:text-brand-orange transition-colors">
                Dellics <span className="text-brand-orange">Travels</span>
              </span>
              <span className="text-[10px] font-semibold text-brand-orange block uppercase tracking-widest">
                Ops Control Center
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
          {navGroups.map((group) => (
            <div key={group.group}>
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {group.group}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          active
                            ? "bg-white/15 text-white shadow-sm border border-white/10"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`size-4 shrink-0 ${
                              active ? "text-[#F4740D]" : "text-slate-400"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Admin Role Identity Strip */}
        <div className="p-3.5 border-t border-white/10 bg-black/15 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-full bg-[#F4740D] flex items-center justify-center font-bold text-xs text-white shadow-sm ring-2 ring-white/20 shrink-0">
              OA
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Ops Admin</p>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 truncate">
                <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
                Super Admin Scope
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Log Out"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
          {/* Universal Search Bar */}
          <div className="relative w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PNR, Booking ID, Traveler, Email, ICCID (Cmd+K)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 focus:outline-none focus:border-[#0A0060] focus:ring-2 focus:ring-[#0A0060]/10 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Quick Actions & Live Gateway Status */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gateways Operational</span>
            </div>

            <Link
              href="/support"
              className="p-2 rounded-full text-slate-500 hover:text-[#0A0060] hover:bg-slate-100 transition-colors relative"
            >
              <Bell className="size-4" />
              {counts.openInquiries > 0 && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#F4740D]" />
              )}
            </Link>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-900">Tema Head Office</p>
                <p className="text-[10px] text-slate-400 font-mono">Devtraco Comm 25</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page View Body */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
