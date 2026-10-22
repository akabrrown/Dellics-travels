import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ChevronRight, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Dellics Education Consult",
  description:
    "Official Privacy Policy of Dellics Education Consult explaining how we collect, use, and protect personal information under Ghana Data Protection Act and international standards.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Legal</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy font-semibold">Privacy Policy</span>
        </nav>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" /> Data Protection Commitment
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-navy tracking-tight mb-4">
            PRIVACY POLICY
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Dellics Education Consult (“we,” “us,” or “our”) respects your privacy and is committed to handling personal information responsibly.
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-3">
            This Privacy Policy explains how we collect, use, disclose, store, and protect personal information when you visit our website, contact our team, request a consultation, or use our education consultancy services.
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
            <p>
              Dellics Education Consult (“we,” “us,” or “our”) respects your privacy and is committed to handling personal information responsibly.
            </p>
            <p className="mt-2">
              This Privacy Policy explains how we collect, use, disclose, store, and protect personal information when you visit our website, contact our team, request a consultation, or use our education consultancy services.
            </p>
            <p className="mt-2">
              Our services include guidance relating to university admissions, scholarships, visa assistance, study destinations, online counselling, test preparation, and related educational opportunities.
            </p>
            <p className="mt-2">
              We aim to handle personal information in accordance with applicable data protection laws, including the Data Protection Act, 2012 (Act 843) of Ghana, where applicable. Where consent is the appropriate legal basis for processing, we will seek consent as required by law.
            </p>
          </section>

          {/* Section 2 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">2</span>
              Personal Information We Collect
            </h2>
            <p className="mb-4">
              The information we collect depends on how you interact with us and which services you request.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <h3 className="font-bold text-navy text-sm mb-1.5">A. Contact Information</h3>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>Full name;</li>
                  <li>Email address;</li>
                  <li>Telephone number;</li>
                  <li>Country of residence;</li>
                  <li>Preferred contact method;</li>
                  <li>Other contact details you voluntarily provide.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <h3 className="font-bold text-navy text-sm mb-1.5">B. Educational Information</h3>
                <p className="text-xs text-slate-600 mb-1.5">When you request education guidance or assistance, we may collect relevant information such as:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>Current or previous educational qualifications;</li>
                  <li>Academic history and results;</li>
                  <li>Intended study destination;</li>
                  <li>Preferred university or programme;</li>
                  <li>Intended intake or commencement date;</li>
                  <li>English language proficiency or examination results;</li>
                  <li>Educational goals and areas of interest.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <h3 className="font-bold text-navy text-sm mb-1.5">C. Application and Supporting Documents</h3>
                <p className="text-xs text-slate-600 mb-1.5">Where required for a requested service, you may provide documents or information such as:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>Academic transcripts and certificates;</li>
                  <li>Curriculum vitae or résumé;</li>
                  <li>Personal statements or application essays;</li>
                  <li>Letters of recommendation;</li>
                  <li>Passport or other identity information;</li>
                  <li>English language test results;</li>
                  <li>Other supporting documents required by a university or relevant authority.</li>
                </ul>
                <p className="text-xs text-slate-500 mt-2 italic">
                  Please provide only the information and documents reasonably necessary for the service you request. Avoid sending sensitive documents through unsecured channels unless an appropriate process has been provided.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <h3 className="font-bold text-navy text-sm mb-1.5">D. Enquiries and Communications</h3>
                <p className="text-xs text-slate-600">
                  We may retain information contained in communications you send to us, including emails, contact forms, consultation requests, and other enquiries. This information helps us respond to your questions, understand your requirements, and maintain relevant service records.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <h3 className="font-bold text-navy text-sm mb-1.5">E. Technical and Website Information</h3>
                <p className="text-xs text-slate-600 mb-1.5">When you visit our website, certain technical information may be collected automatically, depending on the technologies implemented:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li>IP address;</li>
                  <li>Browser type and version;</li>
                  <li>Device and operating system information;</li>
                  <li>Pages visited and interactions with the website;</li>
                  <li>Referral sources;</li>
                  <li>Date and time of visits;</li>
                  <li>Technical error and performance information.</li>
                </ul>
                <p className="text-xs text-slate-500 mt-2">
                  We may use cookies and similar technologies for these purposes. Further information is available in our{" "}
                  <Link href="/cookies" className="text-brand-orange font-bold hover:underline">
                    Cookie Policy
                  </Link>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">3</span>
              How We Collect Personal Information
            </h2>
            <p>We may collect personal information:</p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2">
              <li>Directly from you when you submit an enquiry or contact us;</li>
              <li>When you request or participate in a consultation;</li>
              <li>When you voluntarily provide educational information or supporting documents;</li>
              <li>Through our website forms and digital services;</li>
              <li>From a parent, guardian, or authorised representative acting on your behalf, where appropriate;</li>
              <li>From universities, scholarship providers, or other organisations where you have authorised the disclosure or another lawful basis applies;</li>
              <li>Through website analytics and similar technologies, where implemented and permitted.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              We do not intentionally collect more personal information than is reasonably necessary for the relevant purpose.
            </p>
          </section>

          {/* Section 4 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">4</span>
              How We Use Your Personal Information
            </h2>
            <p className="mb-3">We may use personal information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Providing Education Consultancy Services:</strong> To understand your educational goals, discuss study options, assist with applications, and provide relevant guidance.</li>
              <li><strong>Responding to Enquiries:</strong> To answer questions, arrange consultations, provide requested information, and communicate with you about our services.</li>
              <li><strong>Supporting University Applications:</strong> Where requested and authorised, to help organise application information, prepare submissions, communicate with relevant institutions, and track application-related activities.</li>
              <li><strong>Scholarship Guidance:</strong> To identify potentially relevant funding opportunities and help you understand eligibility criteria and application requirements.</li>
              <li><strong>Visa Assistance:</strong> To provide guidance on relevant procedures and documentation and, where authorised and appropriate, help organise information needed for a visa application.</li>
              <li><strong>Service Administration:</strong> To maintain records, manage appointments, provide customer support, and administer our business operations.</li>
              <li><strong>Payments and Financial Records:</strong> Where applicable, to process or verify payments, maintain transaction records, and meet accounting or legal obligations.</li>
              <li><strong>Website Improvement and Security:</strong> To understand website performance, identify technical problems, prevent misuse, and protect our website and services.</li>
              <li><strong>Marketing and Updates:</strong> Where permitted by law, we may send information about our services, educational opportunities, events, or updates that may interest you. You can opt out at any time.</li>
              <li><strong>Legal and Regulatory Compliance:</strong> To comply with applicable laws, respond to lawful requests, protect our rights, and address suspected fraud or misuse.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">5</span>
              Legal Basis for Processing
            </h2>
            <p>We process personal information only where an appropriate legal basis applies. Depending on the circumstances, this may include:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Consent:</strong> Where you have freely given consent for a specified purpose and consent is the appropriate legal basis.</li>
              <li><strong>Requested services or contractual arrangements:</strong> Where processing is necessary to provide a service you have requested or take steps at your request.</li>
              <li><strong>Legal obligations:</strong> Where we need to comply with applicable laws or lawful requirements.</li>
              <li><strong>Legitimate interests:</strong> Where permitted by law, for purposes such as service administration, website security, and operational improvement, provided the relevant interests do not override your rights.</li>
              <li><strong>Other lawful grounds:</strong> Where recognised by applicable data protection law.</li>
            </ul>
            <p className="mt-3 text-sm text-slate-600">
              Where we rely on consent, you may withdraw it subject to applicable law. Withdrawal does not affect the lawfulness of processing carried out before withdrawal.
            </p>
          </section>

          {/* Section 6 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">6</span>
              How We Share Personal Information
            </h2>
            <p className="font-semibold text-navy">We do not sell personal information as a commercial product.</p>
            <p className="mt-2">We may disclose relevant information to the following categories of recipients where necessary and lawful:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Universities and Educational Institutions:</strong> Where you request application assistance and authorise the relevant process, we may share necessary information with universities, colleges, admissions teams, and educational institutions.</li>
              <li><strong>Scholarship Providers:</strong> Where required for an application or when you have authorised disclosure.</li>
              <li><strong>Visa and Government Authorities:</strong> Where appropriate and authorised in connection with a visa or formal process.</li>
              <li><strong>Service Providers:</strong> Third-party providers supporting website hosting, email communications, appointment management, document handling, analytics, and technical support under suitable safeguards.</li>
              <li><strong>Professional Advisers:</strong> Legal, accounting, or audit professionals where lawful.</li>
              <li><strong>Legal and Regulatory Authorities:</strong> When required by law or to protect rights and safety.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">7</span>
              International Transfers of Personal Information
            </h2>
            <p>
              Because our services relate to international education, some personal information may need to be transferred to universities, service providers, or other recipients outside Ghana.
            </p>
            <p className="mt-2">
              The destination may depend on your chosen study country, the institution involved, and the services you request. Where international transfers occur, we will take appropriate steps to comply with applicable data protection requirements and implement relevant safeguards.
            </p>
          </section>

          {/* Section 8 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">8</span>
              How We Protect Your Information
            </h2>
            <p>
              We take reasonable technical and organisational measures to protect personal information against unauthorised access, loss, alteration, disclosure, or misuse.
            </p>
            <p className="mt-2">
              However, no method of electronic transmission or storage is completely secure. We cannot guarantee absolute security, but we work to reduce risks and respond appropriately to suspected security incidents. If a personal data breach occurs, we will take the steps required by applicable law.
            </p>
          </section>

          {/* Section 9 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">9</span>
              How Long We Retain Personal Information
            </h2>
            <p>
              We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, subject to applicable legal and regulatory requirements. When personal information is no longer required, we will take appropriate steps to delete, anonymise, or securely dispose of it.
            </p>
          </section>

          {/* Section 10 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">10</span>
              Your Privacy Rights
            </h2>
            <p>Subject to applicable law, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1.5 mt-2">
              <li>Request access to personal information we hold about you;</li>
              <li>Request correction of inaccurate or incomplete information;</li>
              <li>Request deletion of personal information where legally permitted;</li>
              <li>Object to or request restriction of certain processing activities;</li>
              <li>Withdraw consent where processing is based on consent;</li>
              <li>Request information about how your personal information is used or disclosed;</li>
              <li>Raise a concern or complaint about our handling of your information.</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">11</span>
              Children's Privacy
            </h2>
            <p>
              Our services may be relevant to students who are under 18 years of age. Where we collect personal information from minors, we will take appropriate steps to handle it in accordance with applicable law and the circumstances of the service. We encourage minors to involve a parent, guardian, or another appropriate responsible adult when seeking formal admissions, application, or visa assistance.
            </p>
          </section>

          {/* Section 12 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">12</span>
              Cookies and Similar Technologies
            </h2>
            <p>
              We may use cookies and similar technologies to support website functionality, remember preferences, understand website usage, and improve our digital services. For more information, please review our{" "}
              <Link href="/cookies" className="text-brand-orange font-bold hover:underline">
                Cookie Policy
              </Link>.
            </p>
          </section>

          {/* Section 13 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">13</span>
              Third-Party Websites and Services
            </h2>
            <p>
              Our website may contain links to universities, scholarship providers, government websites, partner services, or other external platforms. These websites operate independently and have their own privacy policies. We encourage you to review their policies.
            </p>
          </section>

          {/* Section 14 */}
          <section className="border-b border-slate-100 pb-8">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">14</span>
              Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy to reflect changes in our services, information-handling practices, technology, or legal requirements. The revised version will be published on our website.
            </p>
          </section>

          {/* Section 15 */}
          <section className="pt-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-navy mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-navy/5 text-navy text-sm flex items-center justify-center font-mono">15</span>
              Contact Us
            </h2>
            <p className="mb-6">
              If you have questions about this Privacy Policy, wish to exercise your privacy rights, or have a concern about how your personal information is handled, please contact us.
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
