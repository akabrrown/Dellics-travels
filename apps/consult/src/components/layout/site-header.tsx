"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  Menu, 
  X, 
  ChevronDown, 
  GraduationCap, 
  FileCheck2, 
  Award, 
  Plane, 
  MonitorPlay, 
  FileText, 
  Globe, 
  Building2, 
  MapPin, 
  User, 
  LogOut, 
  Compass, 
  CheckCircle2,
  BookOpen
} from "lucide-react";
import { useAuth } from "../auth/auth-context";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "University Admissions", href: "/services/admissions", icon: GraduationCap },
      { label: "Visa Assistance", href: "/services/visa", icon: FileCheck2 },
      { label: "Scholarship Guidance", href: "/services/scholarship", icon: Award },
      { label: "Travel & Tour", href: "/services/travel", icon: Plane },
      { label: "Online Counselling", href: "/services/online", icon: MonitorPlay },
      { label: "Test Preparation", href: "/services/test", icon: FileText },
    ],
  },
  {
    label: "Destinations",
    href: "/destinations",
    children: [
      { label: "Study in UK", href: "/destinations/uk", icon: Globe },
      { label: "Study in Canada", href: "/destinations/canada", icon: MapPin },
      { label: "Study in USA", href: "/destinations/usa", icon: Building2 },
      { label: "Study in Australia", href: "/destinations/australia", icon: Globe },
    ],
  },
  { label: "Consultation", href: "/consultation" },
  { label: "About Us", href: "/about" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  if (pathname === "/login" || pathname === "/signup") return null;

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

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

        {/* Desktop CTA & Auth Status */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/portal"
                className={`text-[13px] font-bold px-4 py-2 rounded-lg transition-colors ${
                  pathname.startsWith("/portal")
                    ? "bg-navy text-white"
                    : "text-navy hover:bg-slate-100"
                }`}
              >
                Student Hub
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  onBlur={() => setTimeout(() => setProfileOpen(false), 200)}
                  className="flex items-center gap-2.5 py-1.5 px-3 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-xs">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[13px] font-semibold text-slate-800">
                    Hi, {user.firstName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                    <div className="px-3 py-2.5 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/portal"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-orange transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Compass className="w-4 h-4 text-slate-400" />
                        Student Portal
                      </Link>
                      <Link
                        href="/portal/profile"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-orange transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Account Settings & Profile
                      </Link>
                      <Link
                        href="/portal/sat"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-orange transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        My SAT Hub
                      </Link>
                      <Link
                        href="/portal/bigfuture"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-orange transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        BigFuture Dashboard
                      </Link>
                      <Link
                        href="/portal/onboarding"
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-orange transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                        {user.profileCompleted ? "Edit Registration Form" : "Complete Registration"}
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-semibold text-slate-700 hover:text-navy transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/consultation"
                className="text-[13px] font-semibold text-brand-orange hover:text-brand-orange-light transition-colors hidden xl:inline-block"
              >
                Book Consultation
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-navy px-5 py-2.5 text-[13px] font-bold text-white hover:bg-navy-light transition-colors"
              >
                Apply Now
              </Link>
            </>
          )}
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
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl absolute w-full left-0 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain pb-10">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {user && (
              <div className="p-3 mb-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Hi, {user.firstName}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 text-center">
                  <Link
                    href="/portal"
                    className="py-1.5 px-3 rounded-lg bg-navy text-white text-xs font-bold"
                    onClick={() => setMobileOpen(false)}
                  >
                    Portal
                  </Link>
                  <Link
                    href="/portal/profile"
                    className="py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    Profile
                  </Link>
                </div>
              </div>
            )}

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

            <div className="pt-4 mt-4 border-t border-slate-100">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 text-center rounded-lg text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
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
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
