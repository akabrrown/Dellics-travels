"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Menu,
  PhoneCall,
  Compass,
  Plane,
  Building2,
  Car,
  FileCheck2,
  Briefcase,
  Users2,
  Globe2,
  LayoutGrid,
  User,
} from "lucide-react";
import Image from "next/image";
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

// Map icons to navigation routes for luxury mega-dropdown
const NAV_ICONS: Record<string, typeof Compass> = {
  "/flights": Plane,
  "/hotels": Building2,
  "/tours": Compass,
  "/transfers": Car,
  "/visa": FileCheck2,
  "/corporate": Briefcase,
  "/diaspora": Globe2,
  "/services": LayoutGrid,
  "/about": Users2,
};

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-navy/95 backdrop-blur-md shadow-xl border-b border-white/10 py-1"
          : "bg-navy py-2",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label={`${SITE.name} home`}>
          <div className="relative h-11 w-36 sm:w-44 transition-transform group-hover:scale-102">
            <Image
              src="/logo.png"
              alt={`${SITE.name} logo`}
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <Popover key={item.label}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "group flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 data-[state=open]:bg-white/15 data-[state=open]:text-white transition-all outline-none",
                      pathname.startsWith(item.href) && "text-brand-orange bg-white/10 font-semibold",
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="size-3.5 opacity-75 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-72 p-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100/90 ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 duration-200"
                >
                  <div className="grid gap-1">
                    {item.children.map((child) => {
                      const Icon = NAV_ICONS[child.href] || Compass;
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
                          <div className={cn(
                            "flex size-8 items-center justify-center rounded-lg transition-colors",
                            isActive
                              ? "bg-brand-orange text-white"
                              : "bg-navy/5 text-navy group-hover:bg-[#0A0060] group-hover:text-white"
                          )}>
                            <Icon className="size-4" />
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
                  "rounded-pill px-3.5 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all",
                  pathname === item.href && "text-brand-orange bg-white/10 font-semibold",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent("Hello Dellics Travels, I would like to inquire about your travel services.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-pill px-4 py-2 text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xl:inline">WhatsApp Us</span>
            <PhoneCall className="size-3.5 xl:hidden" />
          </a>

          <Link
            href="/signin"
            className="flex items-center gap-1.5 rounded-pill px-4 py-2 text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/20 transition-colors"
          >
            <User className="size-3.5" />
            <span>Sign In</span>
          </Link>

          <Button
            asChild
            className="rounded-pill bg-brand-orange hover:bg-brand-orange-hover text-white shadow-md hover:shadow-lg font-semibold px-5"
          >
            <Link href="/inquire">Inquire Now</Link>
          </Button>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={`https://wa.me/${SITE.whatsappNumber}`}
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
            <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto bg-navy text-white p-6 border-l border-white/10">
              <SheetHeader className="border-b border-white/10 pb-4 text-left">
                <SheetTitle className="text-left text-white font-display text-xl">
                  {SITE.name}
                </SheetTitle>
                <p className="text-xs text-white/60">IATA Certified Luxury Agency</p>
              </SheetHeader>

              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile Navigation">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label} className="border-b border-white/5 py-1">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-base font-semibold text-white/90 hover:bg-white/10 hover:text-brand-orange transition-colors",
                        pathname === item.href && "text-brand-orange font-bold",
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block rounded-lg px-6 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors",
                          pathname === child.href && "text-brand-orange font-semibold",
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ))}

                <div className="mt-8 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-pill border-white/20 text-white hover:bg-white/10 text-xs font-semibold py-2.5"
                    >
                      <Link href="/signin" onClick={() => setMobileOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="rounded-pill bg-white text-[#0A0060] hover:bg-white/90 text-xs font-bold py-2.5 shadow-sm"
                    >
                      <Link href="/signup" onClick={() => setMobileOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>

                  <Button
                    asChild
                    className="w-full rounded-pill bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold py-3 shadow-lg"
                  >
                    <Link href="/inquire" onClick={() => setMobileOpen(false)}>
                      Start an Inquiry
                    </Link>
                  </Button>

                  <a
                    href={`https://wa.me/${SITE.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-pill bg-emerald-600 hover:bg-emerald-700 py-3 text-sm font-semibold text-white transition-colors"
                  >
                    <PhoneCall className="size-4" />
                    Chat on WhatsApp (24/7)
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
