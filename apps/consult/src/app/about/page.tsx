import type { Metadata } from 'next';
import { WhyChooseUsSection, CtaBanner } from '../../components/home';

export const metadata: Metadata = { title: 'About Us | Dellics Education Consult' };

export default function AboutPage() {
  return (
    <main className="min-h-screen font-sans pt-16">
      <WhyChooseUsSection />
      <CtaBanner />
    </main>
  );
}