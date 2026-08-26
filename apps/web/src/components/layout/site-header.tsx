"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
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

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-navy text-white transition-shadow",
        scrolled && "shadow-lg",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label={`${SITE.name} home`}>
          <Image src="/logo.png" alt={`${SITE.name} logo`} width={140} height={40} className="h-9 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <Popover key={item.label}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-1 rounded-pill px-3 py-2 text-sm font-medium hover:bg-white/10",
                      pathname.startsWith(item.href) && "text-brand-orange",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="size-4" aria-hidden />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-56 p-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-md px-3 py-2 text-sm text-slate-body hover:bg-sunrise/50"
                    >
                      {child.label}
                    </Link>
                  ))}
                </PopoverContent>
              </Popover>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-pill px-3 py-2 text-sm font-medium hover:bg-white/10",
                  pathname === item.href && "text-brand-orange",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden lg:block">
          <Button asChild className="rounded-pill bg-brand-orange hover:bg-brand-orange/90">
            <Link href="/inquire">Inquire Now</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white lg:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto bg-navy text-white">
            <SheetHeader>
              <SheetTitle className="text-left text-white">{SITE.name}</SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <Link href={item.href} className="block rounded-md px-3 py-2 font-medium hover:bg-white/10">
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-md px-6 py-2 text-sm text-white/70 hover:bg-white/10"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <Button asChild className="mt-4 rounded-pill bg-brand-orange hover:bg-brand-orange/90">
                <Link href="/inquire">Inquire Now</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
