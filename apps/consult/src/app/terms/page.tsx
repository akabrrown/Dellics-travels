import type { Metadata } from "next";
import Link from "next/link";
import { Scale, ChevronRight, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Dellics Education Consult",
  description:
    "Official Terms of Service governing the use of Dellics Education Consult website and services.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Legal</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy font-semibold">Terms of Service</span>
        </nav>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4">
            <Scale className="w-4 h-4" /> Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy tracking-tight mb-4">
            TERMS OF SERVICE
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Welcome to Dellics Education Consult. These Terms of Service (“Terms”) govern your access to and use of the website, information, and services provided by <strong>Dellics Education Consult</strong> (“we,” “us,” or “our”).
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
            By accessing our website, submitting an enquiry, booking a consultation, or using our services, you agree to these Terms. If you do not agree, please discontinue use of our services.
          </p>
        </div>

        {/* Content Document */}
        <article className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 prose prose-slate max-w-none space-y-10 text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">1</span>
              Introduction
            </h2>
            <p>Welcome to Dellics Education Consult.</p>
            <p className="mt-2">
              These Terms of Service (“Terms”) govern your access to and use of the website, information, and services provided by <strong>Dellics Education Consult</strong> (“we,” “us,” or “our”).
            </p>
            <p className="mt-2">
              Dellics Education Consult provides guidance and support to individuals exploring international education opportunities, including university admissions, scholarship guidance, visa assistance, test preparation, online counselling, and related services.
            </p>
            <p className="mt-2">
              By accessing our website, submitting an enquiry, booking a consultation, or using our services, you agree to these Terms. If you do not agree, please discontinue use of our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">2</span>
              Our Services
            </h2>
            <p>Dellics Education Consult provides education consultancy and related support services, which may include:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>University Admissions:</strong> Guidance on researching universities, preparing applications, and understanding admission requirements.</li>
              <li><strong>Visa Assistance:</strong> General guidance on student visa application processes and supporting documentation.</li>
              <li><strong>Scholarship Guidance:</strong> Information about scholarship opportunities, eligibility requirements, and application procedures.</li>
              <li><strong>Online Counselling:</strong> Consultations to help students understand their education options and plan their next steps.</li>
              <li><strong>Test Preparation:</strong> Information and preparation support for relevant examinations, where offered.</li>
              <li><strong>Travel and Tour Services:</strong> Assistance with relevant travel arrangements or referrals through appropriate service providers, where available.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">The availability, scope, and fees of individual services will be communicated where applicable.</p>
          </section>

          {/* Section 3 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">3</span>
              Eligibility and User Responsibilities
            </h2>
            <p>By using our services, you confirm that:</p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2">
              <li>The information you provide to us is accurate, complete, and current to the best of your knowledge.</li>
              <li>You will update any information that becomes inaccurate or changes materially.</li>
              <li>You will use our website and services for lawful purposes.</li>
              <li>You will not misuse our website, interfere with its operation, or attempt to access systems or information without authorisation.</li>
              <li>You will provide genuine documents and information when requesting assistance with applications.</li>
            </ul>
            <p className="mt-3">
              If you are under 18, you should involve a parent, guardian, or other appropriate responsible adult where required for applications, payments, consent, or other formal processes.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              We reserve the right to suspend or refuse assistance where information appears fraudulent, misleading, unlawful, or inconsistent with our service requirements.
            </p>
          </section>

          {/* Section 4 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">4</span>
              University Admissions and Third-Party Institutions
            </h2>
            <p>Dellics Education Consult assists prospective students in understanding and navigating university admission processes.</p>
            <p className="mt-2 font-medium">However:</p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2">
              <li>Admission decisions are made solely by the relevant universities or educational institutions.</li>
              <li>Meeting published admission requirements does not guarantee acceptance.</li>
              <li>Application deadlines, entry requirements, tuition fees, and available programmes may change without notice from the relevant institution.</li>
              <li>Universities may request additional documents, assessments, interviews, or other requirements.</li>
              <li>We cannot guarantee admission to a particular university, programme, or academic year.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Students remain responsible for reviewing official university requirements and ensuring that their applications are submitted correctly and within the relevant deadlines.
            </p>
          </section>

          {/* Section 5 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">5</span>
              Scholarships and Funding
            </h2>
            <p>We may provide information and guidance concerning scholarships, bursaries, grants, and other funding opportunities.</p>
            <p className="mt-2">Scholarship decisions are made by the relevant funding organisations, universities, or authorities.</p>
            <p className="mt-2">
              We do not guarantee that any student will receive a scholarship, grant, or other financial award. Eligibility criteria, funding amounts, application deadlines, and award conditions are determined by the relevant providers.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Students should verify scholarship information with the official funding source before making financial or educational decisions.
            </p>
          </section>

          {/* Section 6 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">6</span>
              Visa and Immigration Assistance
            </h2>
            <p>Our visa assistance services provide guidance on student visa procedures, documentation, and relevant application requirements.</p>
            <p className="mt-2 font-medium">Unless expressly authorised by the relevant authorities, we do not act as a government immigration authority, embassy, consulate, or official visa decision-maker.</p>
            <p className="mt-2">Please understand that:</p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2">
              <li>Visa decisions are made exclusively by the relevant government authorities.</li>
              <li>We cannot guarantee visa approval, processing times, or entry into any country.</li>
              <li>Requirements may change, and additional documentation may be requested.</li>
              <li>You are responsible for providing truthful information and genuine supporting documents.</li>
              <li>You should verify current requirements through the relevant official government or embassy channels.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Our guidance does not replace official immigration instructions or the advice of a suitably authorised immigration professional where one is required.
            </p>
          </section>

          {/* Section 7 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">7</span>
              Accuracy of Information
            </h2>
            <p>
              We make reasonable efforts to provide useful and current information. However, education policies, admission requirements, scholarships, visa procedures, and institutional deadlines may change.
            </p>
            <p className="mt-2">
              Information on our website is provided for general guidance and should not be treated as a guarantee of eligibility, admission, funding, or visa approval.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              We encourage users to confirm important details directly with the relevant university, scholarship provider, examination body, or government authority.
            </p>
          </section>

          {/* Section 8 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">8</span>
              Fees and Payments
            </h2>
            <p>Fees, consultation charges, and other applicable costs will be communicated before a paid service is confirmed.</p>
            <p className="mt-2">Where payment is required:</p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2">
              <li>You agree to pay the applicable fees communicated to you.</li>
              <li>Third-party charges, including university application fees, examination fees, visa fees, tuition fees, and other institutional charges, may be separate from our consultancy fees.</li>
              <li>We will identify applicable charges and payment arrangements where reasonably possible.</li>
              <li>You should retain relevant receipts and payment confirmations.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              We will not represent third-party charges as our own fees. Any applicable taxes, additional charges, or payment conditions will be communicated where relevant.
            </p>
          </section>

          {/* Section 9 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">9</span>
              Cancellations, Refunds, and Rescheduling
            </h2>
            <p>
              The cancellation, refund, and rescheduling conditions applicable to a service will be communicated before payment or confirmation, where applicable.
            </p>
            <p className="mt-2">
              Refund eligibility may depend on the nature of the service, whether work has commenced, the terms agreed for that service, and applicable law.
            </p>
            <p className="mt-2">
              Fees paid directly to universities, examination bodies, embassies, government authorities, or other third parties are governed by the refund policies of those organisations.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Nothing in these Terms excludes any refund or other right that cannot lawfully be excluded. If you need to cancel or reschedule a consultation, please contact us as early as possible.
            </p>
          </section>

          {/* Section 10 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">10</span>
              Third-Party Websites and Services
            </h2>
            <p>
              Our website or services may refer you to third-party websites, universities, scholarship providers, examination bodies, travel providers, or government platforms.
            </p>
            <p className="mt-2">
              These third parties operate independently and may have their own terms, privacy policies, fees, and procedures. We are not responsible for the content, availability, decisions, or policies of independent third parties. Where we assist with a third-party process, the relevant provider's rules continue to apply.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Users should review the applicable terms before submitting information, making payments, or entering into agreements with third parties.
            </p>
          </section>

          {/* Section 11 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">11</span>
              Intellectual Property
            </h2>
            <p>
              Unless otherwise stated, the text, branding, graphics, website design, and other original materials published by Dellics Education Consult are owned by us or used with appropriate permission.
            </p>
            <p className="mt-2">
              You may access and use these materials for personal, non-commercial purposes related to exploring our services. You must not reproduce, distribute, modify, sell, or commercially exploit our materials without prior written permission, except where permitted by applicable law.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Third-party names, logos, trademarks, and materials remain the property of their respective owners.
            </p>
          </section>

          {/* Section 12 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">12</span>
              Privacy and Personal Information
            </h2>
            <p>
              We may collect and process personal information when you contact us, submit an enquiry, request a consultation, or use our services.
            </p>
            <p className="mt-2">
              Our handling of personal information is explained in our{" "}
              <Link href="/privacy" className="text-brand-orange font-bold hover:underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/cookies" className="text-brand-orange font-bold hover:underline">
                Cookie Policy
              </Link>.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              We will handle personal information in accordance with applicable data protection requirements and the relevant legal basis for processing.
            </p>
          </section>

          {/* Section 13 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">13</span>
              Website Availability and Security
            </h2>
            <p>
              We aim to keep our website available and functioning properly. However, we do not guarantee uninterrupted access or that the website will always be free from errors, technical interruptions, or security vulnerabilities.
            </p>
            <p className="mt-2">
              We may update, suspend, restrict, or discontinue any part of the website or our services where reasonably necessary for maintenance, security, operational requirements, or other legitimate reasons. You must not attempt to compromise the security or integrity of our website or systems.
            </p>
          </section>

          {/* Section 14 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">14</span>
              Limitation of Liability
            </h2>
            <p>To the extent permitted by applicable law, Dellics Education Consult will not be responsible for losses arising from:</p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2">
              <li>Admission, scholarship, or visa decisions made by independent institutions or authorities.</li>
              <li>Changes to third-party policies, requirements, fees, or deadlines.</li>
              <li>Inaccurate or incomplete information supplied by a user or an independent third party.</li>
              <li>Delays caused by universities, embassies, government authorities, examination bodies, or other service providers.</li>
              <li>Temporary website interruptions or events beyond our reasonable control.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Nothing in these Terms excludes or limits liability where such exclusion or limitation is prohibited by law, including liability that cannot lawfully be excluded.
            </p>
          </section>

          {/* Section 15 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">15</span>
              Indemnity
            </h2>
            <p>
              To the extent permitted by applicable law, you agree to be responsible for losses or claims arising directly from your unlawful use of our website, your deliberate submission of fraudulent information, or your infringement of another party's rights.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              This provision does not apply to the extent that a claim results from our own unlawful conduct or liability that cannot lawfully be transferred to you.
            </p>
          </section>

          {/* Section 16 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">16</span>
              Changes to These Terms
            </h2>
            <p>
              We may update these Terms to reflect changes to our services, operational practices, or applicable legal requirements.
            </p>
            <p className="mt-2">
              The revised version will be published on our website. Where appropriate or required by law, we may provide notice of significant changes. We encourage users to review these Terms periodically. Continued use of our services after revised Terms take effect will be subject to the updated Terms, to the extent permitted by applicable law.
            </p>
          </section>

          {/* Section 17 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">17</span>
              Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of the Republic of Ghana, subject to applicable legal requirements.
            </p>
            <p className="mt-2">
              Disputes arising in connection with these Terms will be handled by the competent courts or other appropriate dispute-resolution mechanisms with jurisdiction under applicable law.
            </p>
          </section>

          {/* Section 18 */}
          <section className="pt-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">18</span>
              Contact Us
            </h2>
            <p className="mb-6">
              If you have questions about these Terms or our services, please contact us:
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
              &copy; Dellics Education Consult. All Rights Reserved.
            </p>
          </section>

        </article>
      </div>
    </main>
  );
}
