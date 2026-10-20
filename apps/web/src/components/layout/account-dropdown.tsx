"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Compass,
  Crown,
  FileText,
  Headphones,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AccountDropdownProps {
  variant?: "announcement" | "header" | "mobile";
  className?: string;
}

export function AccountDropdown({ variant = "announcement", className }: AccountDropdownProps) {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    toast.success("Signed out successfully", {
      description: "You have been logged out of your account.",
    });
  };

  const userInitial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : "T";
  const userFirstName = user?.fullName ? user.fullName.split(" ")[0] : "Traveler";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "group inline-flex items-center gap-1.5 font-medium transition-colors outline-none cursor-pointer select-none",
            variant === "announcement"
              ? "text-[11px] sm:text-xs text-white/90 hover:text-brand-orange"
              : variant === "header"
                ? "text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full border border-white/15"
                : "text-sm text-slate-700 hover:text-navy justify-between w-full p-2 rounded-lg bg-slate-50",
            className,
          )}
          aria-label="My Account Menu"
        >
          {user ? (
            <div className="size-4.5 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center">
              {userInitial}
            </div>
          ) : (
            <User className="size-3.5 text-white/80 group-hover:text-brand-orange transition-colors" />
          )}
          <span className="font-bold tracking-tight uppercase">
            {user ? userFirstName : "MY ACCOUNT"}
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200 opacity-80 group-hover:opacity-100",
              open && "rotate-180 text-brand-orange",
            )}
            aria-hidden
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-72 p-0 bg-white rounded-xl shadow-2xl border border-slate-200/80 ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 duration-150 z-50 overflow-hidden"
      >
        {user ? (
          /* Signed In View */
          <div className="p-3">
            <div className="p-3 bg-slate-50 rounded-xl mb-2 border border-slate-100 flex items-center gap-3">
              <div className="size-10 rounded-full bg-brand-orange text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                {userInitial}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-navy truncate">{user.fullName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-brand-orange">
                  <Crown className="size-3" />
                  <span>{user.membershipTier} · {user.pointsBalance} pts</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy rounded-lg transition-colors"
              >
                <User className="size-4 text-slate-400" />
                <span>My Profile & Preferences</span>
              </Link>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy rounded-lg transition-colors"
              >
                <Compass className="size-4 text-slate-400" />
                <span>My Bookings & Trips</span>
              </Link>
              <Link
                href="/inquire"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy rounded-lg transition-colors"
              >
                <Headphones className="size-4 text-slate-400" />
                <span>Custom Concierge Request</span>
              </Link>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          /* Guest / Logged Out View */
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                Welcome to Dellics Travels
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sign in to manage bookings, track loyalty points & unlock VIP member fares.
              </p>
            </div>

            <div className="grid gap-2 pt-1">
              <Button
                asChild
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold py-2 h-9 rounded-lg shadow-sm"
              >
                <Link href="/signin" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-navy text-xs font-semibold py-2 h-9 rounded-lg"
              >
                <Link href="/signup" onClick={() => setOpen(false)}>
                  Create Free Account
                </Link>
              </Button>
            </div>

            <div className="h-px bg-slate-100 my-2" />

            <div className="space-y-1">
              <Link
                href="/credentials"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-medium text-slate-600 hover:text-navy rounded-md transition-colors"
              >
                <ShieldCheck className="size-3.5 text-brand-orange" />
                <span>Verify Agency Credentials</span>
              </Link>
              <Link
                href="/inquire"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-2 py-1.5 text-[11px] font-medium text-slate-600 hover:text-navy rounded-md transition-colors"
              >
                <FileText className="size-3.5 text-slate-400" />
                <span>Submit Booking Inquiry</span>
              </Link>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
