import type { Metadata } from 'next';
import { ContactSection, FaqSection } from '../../components/home';

export const metadata: Metadata = { title: 'Contact Us | Dellics Education Consult' };

export default function ContactPage() {
  return (
    <main className="min-h-screen font-sans pt-16">
      <ContactSection />
      <FaqSection />
    </main>
  );
}