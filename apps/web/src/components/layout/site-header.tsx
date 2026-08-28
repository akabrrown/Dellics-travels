"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  PhoneCall,
  ArrowRight,
  ChevronDown,
  Home,
  Plane,
  Building2,
  Compass,
  Car,
  FileCheck2,
  Briefcase,
  HeartHandshake,
  User,
  Crown,
  LogOut,
  Sparkles,
  ShieldCheck,
  MessageSquareQuote,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NAV_ITEMS } from "@/data/nav";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/": Home,
  "/flights": Plane,
  "/hotels": Building2,
  "/tours": Compass,
  "/services": Briefcase,
  "/transfers": Car,
  "/visa": FileCheck2,
  "/corporate": Briefcase,
  "/diaspora": HeartHandshake,
};

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUserDropdownOpen(false);
    setMobileOpen(false);
    toast.success("Signed out successfully", {
      description: "You have been logged out of your account.",
    });
  };

  if (
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/forgot-password"
  ) {
    return null;
  }

  const userInitial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : "T";
  const userFirstName = user?.fullName ? user.fullName.split(" ")[0] : "Traveler";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-navy/95 backdrop-blur-md shadow-lg border-b border-white/10 py-1"
          : "bg-navy py-2",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center group shrink-0"
          aria-label={`${SITE.name} home`}
        >
          <div className="relative h-14 w-24 shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/Logo.png"
              alt={`${SITE.name} logo`}
              fill
              className="object-contain"
              priority
              unoptimized
            />

          </div>
        </Link>

        {/* Desktop Navigation with Icons */}
        <nav
          className="hidden items-center gap-1.5 lg:flex"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.href] || Home;
            return item.children ? (
              <Popover key={item.label}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "group flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 data-[state=open]:bg-white/15 data-[state=open]:text-white transition-all outline-none",
                      pathname.startsWith(item.href) &&
                        "text-brand-orange bg-white/10 font-semibold",
                    )}
                  >
                    <Icon className="size-4 text-brand-orange/90 group-hover:text-brand-orange transition-colors" />
                    <span>{item.label}</span>
                    <ChevronDown
                      className="size-3.5 opacity-75 transition-transform duration-200 group-data-[state=open]:rotate-180"
                      aria-hidden
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-72 p-2 bg-white rounded-2xl shadow-2xl border border-slate-100 ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 duration-200"
                >
                  <div className="grid gap-1">
                    {item.children.map((child) => {
                      const ChildIcon = NAV_ICONS[child.href] || Compass;
                      const isActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                            isActive
                              ? "bg-orange-50 text-brand-orange font-semibold"
                              : "text-slate-700 hover:bg-slate-50 hover:text-navy",
                          )}
                        >
                          <div
                            className={cn(
                              "flex size-8 items-center justify-center rounded-lg transition-colors",
                              isActive
                                ? "bg-brand-orange text-white"
                                : "bg-navy/5 text-navy group-hover:bg-[#0A0060] group-hover:text-white",
                            )}
                          >
                            <ChildIcon className="size-4" />
                          </div>
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all group",
                  pathname === item.href &&
                    "text-brand-orange bg-white/10 font-semibold",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 transition-colors",
                    pathname === item.href
                      ? "text-brand-orange"
                      : "text-brand-orange/80 group-hover:text-brand-orange",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Group: Dynamic Login / User Profile & Inquire CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            /* Logged In User Popover */
            <Popover open={userDropdownOpen} onOpenChange={setUserDropdownOpen}>
              <PopoverTrigger asChild>
                <button
                  className="flex items-center gap-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 px-3.5 py-1.5 text-sm font-semibold text-white transition-all outline-none"
                  aria-label="User Account Menu"
                >
                  <div className="size-7 rounded-full bg-brand-orange flex items-center justify-center text-white text-xs font-bold shadow-xs">
                    {userInitial}
                  </div>
                  <span className="max-w-[120px] truncate">{userFirstName}</span>
                  <ChevronDown className="size-3.5 text-white/70" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={8}
                className="w-64 p-2 bg-white rounded-2xl shadow-2xl border border-slate-100 ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 duration-200"
              >
                {/* User Header */}
                <div className="p-3 bg-slate-50 rounded-xl mb-2 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-full bg-brand-orange text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {userInitial}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-navy truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 w-fit">
                    <ShieldCheck className="size-3" />
                    <span>Verified Account</span>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-orange rounded-lg transition-colors"
                  >
                    <User className="size-4 text-brand-orange" />
                    <span>My Profile & Account</span>
                  </Link>

                  <Link
                    href="/profile?tab=trips"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-orange rounded-lg transition-colors"
                  >
                    <Plane className="size-4 text-brand-orange" />
                    <span>My Trips & Itineraries</span>
                  </Link>

                  <Link
                    href="/profile?tab=membership"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-amber-600 rounded-lg transition-colors"
                  >
                    <Crown className="size-4 text-amber-500" />
                    <span>Voyager Club Rewards</span>
                  </Link>

                  <Link
                    href="/inquire"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-orange rounded-lg transition-colors"
                  >
                    <MessageSquareQuote className="size-4 text-brand-orange" />
                    <span>Submit Travel Inquiry</span>
                  </Link>

                  <a
                    href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(`Hello Dellics Travels, I am logged in as ${user.fullName} (${user.email}) and need concierge support.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-lg transition-colors"
                  >
                    <PhoneCall className="size-4 text-emerald-600" />
                    <span>WhatsApp Concierge</span>
                  </a>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-t border-slate-100 mt-1"
                  >
                    <LogOut className="size-4" />
                    <span>Sign Out</span>
                  </button>
                </div>

              </PopoverContent>
            </Popover>
          ) : (
            /* Logged Out Login Link */
            <Link
              href="/signin"
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all border border-white/15",
                pathname === "/signin" &&
                  "text-brand-orange bg-white/10 font-semibold border-brand-orange/40",
              )}
            >
              <User className="size-4 text-brand-orange" />
              <span>Login</span>
            </Link>
          )}

          <Button
            asChild
            className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white shadow-md hover:shadow-lg font-semibold px-6"
          >
            <Link href="/inquire">Inquire Now</Link>
          </Button>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent("Hello Dellics Travels, I would like to inquire about your travel services.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            aria-label="WhatsApp Concierge"
          >
            <PhoneCall className="size-4" />
          </a>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                aria-label="Open navigation menu"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] max-w-sm overflow-y-auto bg-navy text-white p-6 border-l border-white/10"
            >
              <SheetHeader className="border-b border-white/10 pb-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-20 shrink-0">
                    <Image
                      src="/Logo.png"
                      alt={SITE.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />

                  </div>
                  <div>
                    <SheetTitle className="text-left text-white font-display text-base font-bold">
                      Dellics Travels
                    </SheetTitle>
                    <p className="text-[11px] text-white/70">IATA Certified Agency</p>
                  </div>
                </div>
              </SheetHeader>

              {/* Mobile User Status Card if Logged In */}
              {user && (
                <div className="mt-4 space-y-2">
                  <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15 flex items-center justify-between">
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 overflow-hidden"
                    >

                      <div className="size-9 rounded-full bg-brand-orange text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                        {userInitial}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">
                          {user.fullName}
                        </p>
                        <p className="text-[10px] text-white/70 truncate">
                          {user.email}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors shrink-0"
                      title="Sign Out"
                      aria-label="Sign out"
                    >
                      <LogOut className="size-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-center border border-white/10 transition-colors"
                    >
                      <User className="size-4 text-brand-orange mx-auto" />
                      <span className="text-[10px] font-bold text-white block mt-1">Profile</span>
                    </Link>
                    <Link
                      href="/profile?tab=trips"
                      onClick={() => setMobileOpen(false)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-center border border-white/10 transition-colors"
                    >
                      <Plane className="size-4 text-brand-orange mx-auto" />
                      <span className="text-[10px] font-bold text-white block mt-1">Trips</span>
                    </Link>
                    <Link
                      href="/profile?tab=membership"
                      onClick={() => setMobileOpen(false)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-center border border-white/10 transition-colors"
                    >
                      <Crown className="size-4 text-amber-400 mx-auto" />
                      <span className="text-[10px] font-bold text-white block mt-1">Rewards</span>
                    </Link>
                  </div>

                </div>
              )}


              <nav
                className="mt-6 flex flex-col gap-1.5"
                aria-label="Mobile Navigation"
              >
                {NAV_ITEMS.map((item) => {
                  const Icon = NAV_ICONS[item.href] || Home;
                  return (
                    <div
                      key={item.label}
                      className="border-b border-white/5 pb-1.5"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-base font-semibold text-white/90 hover:bg-white/10 hover:text-brand-orange transition-colors",
                          pathname === item.href &&
                            "text-brand-orange bg-white/10",
                        )}
                      >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-brand-orange shrink-0">
                          <Icon className="size-4" />
                        </div>
                        <span>{item.label}</span>
                      </Link>

                      {item.children && (
                        <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-3">
                          {item.children.map((child) => {
                            const ChildIcon = NAV_ICONS[child.href] || Compass;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs text-white/75 hover:bg-white/5 hover:text-white transition-colors",
                                  pathname === child.href &&
                                    "text-brand-orange font-semibold",
                                )}
                              >
                                <ChildIcon className="size-3.5 text-brand-orange/80" />
                                <span>{child.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="mt-8 space-y-3 pt-4 border-t border-white/10">
                {user ? (
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full rounded-full border-rose-400/40 text-rose-300 hover:bg-rose-500/20 font-semibold py-3 justify-center gap-2"
                  >
                    <LogOut className="size-4" />
                    <span>Sign Out</span>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-full border-white/20 text-white hover:bg-white/10 font-semibold py-3 justify-center gap-2"
                  >
                    <Link href="/signin" onClick={() => setMobileOpen(false)}>
                      <User className="size-4 text-brand-orange" />
                      <span>Client Login</span>
                    </Link>
                  </Button>
                )}

                <Button
                  asChild
                  className="w-full rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold py-3 justify-center gap-2"
                >
                  <Link href="/inquire" onClick={() => setMobileOpen(false)}>
                    <span>Start Travel Inquiry</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
