"use client";

import React, { useState } from "react";
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

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: "Core",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Bookings", href: "/bookings", icon: CalendarCheck, badge: "8 need attention", badgeColor: "bg-amber-100 text-amber-800" },
      { label: "Travelers", href: "/travelers", icon: Users },
    ],
  },
  {
    group: "Content & Commerce",
    items: [
      { label: "Destinations & Packages", href: "/content", icon: Package },
      { label: "Promotions & Deals", href: "/promotions", icon: Tag },
      { label: "eSIM Orders", href: "/esims", icon: Smartphone },
    ],
  },
  {
    group: "Operations & Support",
    items: [
      { label: "Refund Queue", href: "/refunds", icon: RotateCcw, badge: "5 pending", badgeColor: "bg-rose-100 text-rose-800" },
      { label: "Support Tickets", href: "/support", icon: Headphones, badge: "3 open", badgeColor: "bg-blue-100 text-blue-800" },
      { label: "Reviews Moderation", href: "/reviews", icon: Star },
    ],
  },
  {
    group: "Finance & System",
    items: [
      { label: "Finance & Reconciliation", href: "/finance", icon: CreditCard },
      { label: "Supplier Health", href: "/health", icon: Activity, badge: "1 degraded", badgeColor: "bg-amber-100 text-amber-800" },
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0A0060] text-white flex flex-col shrink-0 select-none">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-[#F4740D] to-amber-400 flex items-center justify-center shadow-md">
              <span className="font-display font-extrabold text-white text-lg">D</span>
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-white block leading-tight">
                Dellics Travels
              </span>
              <span className="text-[11px] font-medium text-amber-300 block uppercase tracking-wider">
                Ops Control Center
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
          {NAV_GROUPS.map((group) => (
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
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-xs shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Global search: ID, PNR, email, phone..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-slate-300 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/80">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>GDS & APIs Connected</span>
            </div>

            <div className="h-5 w-px bg-slate-200" />

            <Link
              href="/support"
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Open Support Queue"
            >
              <Bell className="size-4" />
              <span className="absolute top-1 right-1 size-2 rounded-full bg-[#F4740D] ring-2 ring-white" />
            </Link>
          </div>
        </header>

        {/* Scrollable Workspace View */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/60">
          {children}
        </div>
      </main>
    </div>
  );
}
