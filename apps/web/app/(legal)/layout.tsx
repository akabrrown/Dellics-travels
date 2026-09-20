import { ReactNode } from 'react';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';

const links = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/us-privacy', label: 'US Privacy Policy' },
  { href: '/cookies', label: 'Cookie Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageHero
        title="Legal & Policies"
        subtitle="Review our terms, privacy policies, and guidelines."
        image="/images/destinations/hero-dubai.jpg"
      />
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-5">
                Documents
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-600 hover:text-brand-orange font-medium text-sm transition-colors flex items-center gap-2"
                    >
                      <div className="size-1.5 rounded-full bg-slate-300 group-hover:bg-brand-orange transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          
          <main className="flex-1 bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/60">
            <div className="prose prose-slate prose-headings:font-display prose-headings:text-navy prose-a:text-brand-orange hover:prose-a:text-brand-orange-hover prose-p:leading-relaxed prose-p:text-slate-600 prose-strong:text-slate-900 prose-strong:font-semibold max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
