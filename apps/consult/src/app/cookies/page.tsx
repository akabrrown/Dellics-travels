import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, ShieldCheck, Mail, Phone, MapPin, ChevronRight, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy | Dellics Education Consult",
  description:
    "Dellics Education Consult Cookie Policy explaining our use of cookies and tracking technologies.",
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Legal</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy font-semibold">Cookie Policy</span>
        </nav>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4">
            <Cookie className="w-4 h-4" /> Official Legal Notice
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy tracking-tight mb-4">
            COOKIE POLICY
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Dellics Education Consult uses cookies and similar technologies for purposes such as maintaining website functionality, improving user experience, understanding website usage, and supporting our services, as described in this Cookie Policy (“Policy”).
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
            We are committed to using these technologies responsibly and transparently. We aim to ensure that information presented to prospective students is accurate and that our digital services are used fairly and responsibly.
          </p>
        </div>

        {/* Content Document */}
        <article className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 prose prose-slate max-w-none space-y-10 text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">1</span>
              About This Policy
            </h2>
            <p>
              This Cookie Policy explains how <strong>Dellics Education Consult</strong> uses cookies and similar technologies across our website, online enquiry forms, student portals, and other digital services, where applicable.
            </p>
            <p className="mt-3">This Policy should be read together with our:</p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2 text-sm sm:text-base">
              <li>
                <Link href="/privacy" className="text-brand-orange hover:underline font-semibold">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-brand-orange hover:underline font-semibold">
                  Terms and Conditions
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-sm text-slate-600">
              These documents are available through the Dellics Education Consult website.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              We may update this Policy from time to time to reflect changes in technology, our services, or applicable legal requirements. Where significant changes are made, we may provide notice through our website, email, or other appropriate communication channels.
            </p>
          </section>

          {/* Section 2 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">2</span>
              What Are Cookies and Similar Technologies?
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit a website.
            </p>
            <p className="mt-3">Similar technologies may include:</p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2 text-sm sm:text-base">
              <li>Pixels and tags</li>
              <li>Web beacons</li>
              <li>Local and session storage</li>
              <li>Software development kits (SDKs)</li>
              <li>Device identifiers</li>
              <li>Other comparable tracking technologies</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              These technologies help websites function properly, remember user preferences, improve performance, analyse website usage, and support marketing activities where permitted.
            </p>
          </section>

          {/* Section 3 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">3</span>
              How Do We Use Cookies and Similar Technologies?
            </h2>
            <p>
              Dellics Education Consult may use cookies and similar technologies when you access or interact with our services, including:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2 text-sm sm:text-base">
              <li>Our official website;</li>
              <li>Student enquiry and application forms, where available;</li>
              <li>Online counselling and appointment services;</li>
              <li>Student portals and account areas, where available;</li>
              <li>Communication and marketing tools;</li>
              <li>Other digital platforms operated by Dellics Education Consult.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              These technologies may be managed by Dellics Education Consult, service providers acting on our behalf, or third parties whose services are integrated into our website.
            </p>
          </section>

          {/* Section 4 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">4</span>
              Types of Cookies We Use
            </h2>
            
            <div className="space-y-6 mt-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <h3 className="text-base font-bold text-navy mb-2">Strictly Necessary Cookies</h3>
                <p className="text-sm text-slate-600 mb-2">
                  These cookies are essential for the secure and proper operation of our website and services.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>Maintain website security;</li>
                  <li>Support login and authentication functions;</li>
                  <li>Protect forms against misuse;</li>
                  <li>Maintain user sessions;</li>
                  <li>Enable essential website features.</li>
                </ul>
                <p className="text-xs text-slate-500 mt-2 italic">
                  Some website functions may not work correctly if these cookies are disabled.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <h3 className="text-base font-bold text-navy mb-2">Performance and Analytics Cookies</h3>
                <p className="text-sm text-slate-600 mb-2">
                  These cookies help us understand how visitors interact with our website and identify opportunities to improve our services.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>Pages visited;</li>
                  <li>Time spent on individual pages;</li>
                  <li>Browser and device information;</li>
                  <li>Website navigation patterns;</li>
                  <li>Technical errors and performance information;</li>
                  <li>General website usage statistics.</li>
                </ul>
                <p className="text-xs text-slate-500 mt-2">
                  We may use analytics and website performance tools, where implemented, to understand visitor behaviour and improve the quality of our digital services.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <h3 className="text-base font-bold text-navy mb-2">Functional Cookies</h3>
                <p className="text-sm text-slate-600 mb-2">
                  These cookies may remember preferences and choices to provide a more convenient experience.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>Language preferences;</li>
                  <li>Previously selected settings;</li>
                  <li>Account preferences;</li>
                  <li>Form preferences, where supported;</li>
                  <li>Other website customisation choices.</li>
                </ul>
                <p className="text-xs text-slate-500 mt-2">
                  The availability of these features depends on the technologies implemented on our website.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <h3 className="text-base font-bold text-navy mb-2">Advertising and Marketing Cookies</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Where implemented and permitted by applicable law, these cookies may help us:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>Measure the effectiveness of marketing campaigns;</li>
                  <li>Understand interactions with our advertisements;</li>
                  <li>Present relevant information about our education consultancy services;</li>
                  <li>Limit repeated advertisements;</li>
                  <li>Evaluate engagement with promotional content.</li>
                </ul>
                <p className="text-xs text-slate-500 mt-2">
                  Where consent is required, we will seek the appropriate consent before using non-essential advertising and marketing cookies.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <h3 className="text-base font-bold text-navy mb-2">Third-Party Cookies</h3>
                <p className="text-sm text-slate-600">
                  Our website may integrate services provided by third parties, such as analytics providers, embedded content providers, communication platforms, or other service providers.
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  These services may use their own cookies or similar technologies in accordance with their respective privacy and cookie policies. Dellics Education Consult does not control cookies independently managed by third parties. Users should review the relevant third-party policies for further information.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">5</span>
              How Can You Manage or Withdraw Consent?
            </h2>
            <p>
              Where required by applicable law, visitors may be presented with a cookie notice or consent mechanism when accessing our website.
            </p>
            <p className="mt-3">Depending on the available settings, you may be able to:</p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2 text-sm sm:text-base">
              <li>Accept all cookies;</li>
              <li>Reject non-essential cookies;</li>
              <li>Select specific categories of cookies;</li>
              <li>Change or withdraw your consent at a later time.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              You may also manage cookies through your browser settings. Please note that disabling certain cookies may affect some website features and functionality.
            </p>
          </section>

          {/* Section 6 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">6</span>
              Browser Controls
            </h2>
            <p>
              Most web browsers allow users to view, delete, block, or restrict cookies through their settings.
            </p>
            <p className="mt-2">
              The available controls and instructions vary depending on the browser and device being used. For further information, please consult the support resources provided by your browser manufacturer.
            </p>
          </section>

          {/* Section 7 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">7</span>
              How Long Do Cookies Remain on Your Device?
            </h2>
            <p>
              Cookies may remain on your device for different periods, depending on their purpose and configuration.
            </p>
            <p className="mt-2">
              <strong>Session cookies</strong> are generally deleted when you close your browser.
            </p>
            <p className="mt-2">
              <strong>Persistent cookies</strong> remain on your device for a specified period or until they are deleted.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              The duration of individual cookies depends on the technology used and the settings applied by Dellics Education Consult or the relevant third-party provider.
            </p>
          </section>

          {/* Section 8 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">8</span>
              International Data Transfers
            </h2>
            <p>
              Information collected through cookies and similar technologies may be processed or stored in countries outside your country of residence, depending on the service providers and technologies used.
            </p>
            <p className="mt-2">
              Where such transfers occur, Dellics Education Consult will take appropriate steps to comply with applicable data protection requirements and implement necessary safeguards.
            </p>
          </section>

          {/* Section 9 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">9</span>
              Changes to This Cookie Policy
            </h2>
            <p>
              We may revise this Cookie Policy from time to time to reflect changes in our website, technology, services, or legal obligations.
            </p>
            <p className="mt-2">
              When changes are made, we will update the Effective Date displayed on this page. Where required, we may provide additional notice of significant changes.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              We encourage visitors to review this Policy periodically to remain informed about how cookies and similar technologies are used.
            </p>
          </section>

          {/* Section 10 */}
          <section className="pt-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">10</span>
              Contact Us
            </h2>
            <p className="mb-6">
              If you have questions about this Cookie Policy or how cookies and similar technologies are used on our website, please contact us using the details below.
            </p>
            
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-6 space-y-4">
              <div className="font-bold text-navy text-base">Dellics Education Consult</div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="mailto:info@dellics.com" className="text-brand-orange hover:underline">
                  info@dellics.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <a href="tel:+233552054174" className="text-slate-800 hover:text-brand-orange">
                  +233 55 205 4174
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span>
                  Tema Community 25, Devtraco Estate<br />
                  Greater Accra, Ghana
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 pt-6">
              &copy; 2026 Dellics Education Consult. All Rights Reserved.
            </p>
          </section>

        </article>
      </div>
    </main>
  );
}
