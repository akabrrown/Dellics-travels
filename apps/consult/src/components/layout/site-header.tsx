"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, GraduationCap, FileCheck2, Award, Plane, MonitorPlay, FileText, Globe, Building2, MapPin } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "University Admissions", href: "/services#admissions", icon: GraduationCap },
      { label: "Visa Assistance", href: "/services#visa", icon: FileCheck2 },
      { label: "Scholarship Guidance", href: "/services#scholarship", icon: Award },
      { label: "Travel & Tour", href: "/services#travel", icon: Plane },
      { label: "Online Counselling", href: "/services#online", icon: MonitorPlay },
      { label: "Test Preparation", href: "/services#test", icon: FileText },
    ],
  },
  {
    label: "Destinations",
    href: "/destinations",
    children: [
      { label: "Study in UK", href: "/destinations#uk", icon: Globe },
      { label: "Study in Canada", href: "/destinations#canada", icon: MapPin },
      { label: "Study in USA", href: "/destinations#usa", icon: Building2 },
      { label: "Study in Australia", href: "/destinations#australia", icon: Globe },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center group shrink-0">
          <div className="relative h-12 w-28 shrink-0">
            <Image
              src="/logo.jpg"
              alt="Dellics Education Consult"
              fill
              className="object-contain object-left"
              priority
              unoptimized
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 py-5 text-[13px] font-semibold transition-colors ${
                    pathname.startsWith(item.href)
                      ? "text-navy"
                      : "text-slate-600 hover:text-navy"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Link>
                <div className="invisible absolute left-0 top-[calc(100%-4px)] pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    {item.children.map((child) => {
                      const Icon = child.icon;
                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-orange transition-colors"
                        >
                          <Icon className="h-4 w-4 text-slate-400" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={`py-5 text-[13px] font-semibold transition-colors ${
                  pathname === item.href
                    ? "text-navy"
                    : "text-slate-600 hover:text-navy"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className="text-[13px] font-semibold text-slate-700 hover:text-navy transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-navy px-5 py-2.5 text-[13px] font-bold text-white hover:bg-navy-light transition-colors"
          >
            Apply Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl absolute w-full left-0">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                    pathname === item.href
                      ? "bg-slate-50 text-navy"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-100 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="py-2.5 text-center rounded-lg text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="py-2.5 text-center rounded-lg text-sm font-bold text-white bg-navy hover:bg-navy-light transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Apply Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
