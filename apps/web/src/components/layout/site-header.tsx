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
  Plane,
  Building2,
  Compass,
  Car,
  FileCheck2,
  Briefcase,
  HeartHandshake,
  User,
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

const NAV_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/flights": Plane,
  "/hotels": Building2,
  "/tours": Compass,
  "/transfers": Car,
  "/visa": FileCheck2,
  "/corporate": Briefcase,
  "/diaspora": HeartHandshake,
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

  if (pathname === "/signin" || pathname === "/signup" || pathname === "/forgot-password") {
    return null;
  }

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
          <div className="relative h-14 w-20 overflow-hidden rounded-2xl bg-white p-1.5 shadow-md border border-white/20 shrink-0 transition-transform group-hover:scale-105">
            <Image
              src="/Logo.png"
              alt={`${SITE.name} logo`}
              fill
              className="object-contain p-0.5"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation (Home, Flights, Hotels, Tours, Services) */}
        <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <Popover key={item.label}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "group flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 data-[state=open]:bg-white/15 data-[state=open]:text-white transition-all outline-none",
                      pathname.startsWith(item.href) && "text-brand-orange bg-white/10 font-semibold",
                    )}
                  >
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
                          <div
                            className={cn(
                              "flex size-8 items-center justify-center rounded-lg transition-colors",
                              isActive
                                ? "bg-brand-orange text-white"
                                : "bg-navy/5 text-navy group-hover:bg-[#0A0060] group-hover:text-white",
                            )}
                          >
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
                  "rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all",
                  pathname === item.href && "text-brand-orange bg-white/10 font-semibold",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        {/* Action Group: Separated Login & Inquire CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/signin"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all border border-white/15",
              pathname === "/signin" && "text-brand-orange bg-white/10 font-semibold border-brand-orange/40",
            )}
          >
            <User className="size-4 text-brand-orange" />
            <span>Login</span>
          </Link>

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
                  <div className="relative h-12 w-16 overflow-hidden rounded-xl bg-white p-1 shadow-sm shrink-0">
                    <Image
                      src="/Logo.png"
                      alt={SITE.name}
                      fill
                      className="object-contain"
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

              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile Navigation">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label} className="border-b border-white/5 py-1">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-base font-semibold text-white/90 hover:bg-white/10 hover:text-brand-orange transition-colors",
                        pathname === item.href && "text-brand-orange bg-white/10",
                      )}
                    >
                      {item.label}
                    </Link>

                    {item.children && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "block rounded-lg px-2 py-1.5 text-xs text-white/75 hover:bg-white/5 hover:text-white transition-colors",
                              pathname === child.href && "text-brand-orange font-semibold",
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-8 space-y-3 pt-4 border-t border-white/10">
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
