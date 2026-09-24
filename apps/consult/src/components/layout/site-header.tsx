"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <>
      <div className="top-bar bg-brand-blue-light text-white text-[13px] font-medium py-2.5 px-4 text-center">
        <p>New intake open for 2025/2026 | Student Service Platform Live | Powered by Dellics Travels Ecosystem</p>
      </div>

      <header className={`header fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"}`} style={{ marginTop: scrolled ? 0 : "40px" }}>
        <nav className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="nav-logo flex items-center gap-3">
            <Image src="/logo.jpg" alt="Dellics Education Consult Logo" width={54} height={54} className="rounded-xl shadow-sm" />
            <div className="nav-logo-text flex flex-col">
              <span className="text-xl font-black text-brand-blue leading-tight tracking-tight">DELLICS</span>
              <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">Education Consult</span>
            </div>
          </Link>

          <ul className={`nav-list fixed lg:static top-0 right-0 h-screen lg:h-auto w-[280px] lg:w-auto bg-white lg:bg-transparent shadow-sm lg:shadow-none flex flex-col lg:flex-row items-start lg:items-center p-8 lg:p-0 gap-6 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
            <li>
              <Link href="/" className={`nav-link font-semibold transition-colors hover:text-brand-orange ${pathname === "/" ? "text-brand-orange" : "text-slate-700"}`} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            </li>
            
            <li className="nav-dropdown relative group w-full lg:w-auto">
              <div className="flex items-center justify-between lg:justify-start w-full cursor-pointer" onClick={() => toggleDropdown('services')}>
                <Link href="/services" className={`nav-link font-semibold transition-colors hover:text-brand-orange ${pathname.startsWith("/services") ? "text-brand-orange" : "text-slate-700"}`}>Services</Link>
                <button type="button" className="lg:hidden p-2 text-slate-500">
                  <svg width={10} height={6} viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <ul className={`lg:absolute top-full left-0 mt-2 w-full lg:w-56 bg-white lg:shadow-xl rounded-xl py-2 flex-col gap-1 ${activeDropdown === 'services' ? 'flex' : 'hidden lg:group-hover:flex'}`}>
                <li><Link href="/services#admissions" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-orange hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>University Admissions</Link></li>
                <li><Link href="/services#visa" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-orange hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Visa Assistance</Link></li>
                <li><Link href="/services#scholarship" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-orange hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Scholarship Guidance</Link></li>
                <li><Link href="/services#travel" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-orange hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Travel & Tour</Link></li>
              </ul>
            </li>

            <li className="nav-dropdown relative group w-full lg:w-auto">
              <div className="flex items-center justify-between lg:justify-start w-full cursor-pointer" onClick={() => toggleDropdown('destinations')}>
                <Link href="/destinations" className={`nav-link font-semibold transition-colors hover:text-brand-orange ${pathname.startsWith("/destinations") ? "text-brand-orange" : "text-slate-700"}`}>Destinations</Link>
                <button type="button" className="lg:hidden p-2 text-slate-500">
                  <svg width={10} height={6} viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <ul className={`lg:absolute top-full left-0 mt-2 w-full lg:w-56 bg-white lg:shadow-xl rounded-xl py-2 flex-col gap-1 ${activeDropdown === 'destinations' ? 'flex' : 'hidden lg:group-hover:flex'}`}>
                <li><Link href="/destinations#uk" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-orange hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Study in UK</Link></li>
                <li><Link href="/destinations#canada" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-orange hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Study in Canada</Link></li>
                <li><Link href="/destinations#usa" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-orange hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Study in USA</Link></li>
                <li><Link href="/destinations#australia" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-orange hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Study in Australia</Link></li>
              </ul>
            </li>

            <li><Link href="/about" className={`nav-link font-semibold transition-colors hover:text-brand-orange ${pathname === "/about" ? "text-brand-orange" : "text-slate-700"}`} onClick={() => setMobileMenuOpen(false)}>About Us</Link></li>
            <li><Link href="/contact" className={`nav-link font-semibold transition-colors hover:text-brand-orange ${pathname === "/contact" ? "text-brand-orange" : "text-slate-700"}`} onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
            
            <li className="mt-auto lg:hidden w-full pt-6 border-t border-slate-100">
              <Link href="/portal" className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-brand-blue font-bold rounded-xl mb-3" onClick={() => setMobileMenuOpen(false)}>
                <span>📊</span> Launch Student Dashboard
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" className="py-2.5 text-center font-bold text-slate-700 border border-slate-200 rounded-full" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link href="/signup" className="py-2.5 text-center font-bold text-white bg-brand-orange rounded-full shadow-md" onClick={() => setMobileMenuOpen(false)}>Start</Link>
              </div>
            </li>
          </ul>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="font-bold text-sm text-slate-700 hover:text-brand-orange transition-colors">🎓 Login</Link>
            <Link href="/signup" className="font-bold text-sm text-white bg-gradient-to-r from-brand-orange to-brand-orange-hover px-6 py-2.5 rounded-full shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all">Start Application</Link>
          </div>

          <button 
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
          >
            <span className={`block w-6 h-0.5 bg-brand-blue transition-transform duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-brand-blue transition-opacity duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-brand-blue transition-transform duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </nav>
      </header>
    </>
  );
}
