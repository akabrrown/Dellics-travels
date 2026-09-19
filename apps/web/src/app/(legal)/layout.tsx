import { ReactNode } from 'react';
import Link from 'next/link';

const links = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/us-privacy', label: 'US Privacy Policy' },
  { href: '/cookies', label: 'Cookie Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 shrink-0 border-r border-gray-100 pr-8">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Legal Documents
            </h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <main className="flex-1 prose prose-blue max-w-4xl prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-a:text-blue-600">
          {children}
        </main>
      </div>
    </div>
  );
}