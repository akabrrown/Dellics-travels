"use client";
import Link from "next/link";
import { GraduationCap, LogOut } from "lucide-react";

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-brand-orange" />
            <h1 className="text-xl font-display font-bold text-navy">Consult Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://dellicstravels.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-600 hover:text-navy">
              Dellics Travels
            </a>
            <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700">
              <LogOut className="w-4 h-4" /> Sign Out
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto mt-12">
          <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-8 h-8 text-brand-orange" />
          </div>
          <h2 className="text-2xl font-display font-bold text-navy mb-4">Welcome to Your Dashboard</h2>
          <p className="text-slate-600 mb-8">
            Your study abroad application profile is currently being set up. Please check back later or contact your assigned consultant for updates on your university applications and visa processing.
          </p>
          <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-navy text-white font-semibold hover:bg-navy-light transition-colors">
            Contact Support
          </Link>
        </div>
      </main>
    </div>
  );
}