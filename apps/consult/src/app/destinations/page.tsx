import type { Metadata } from 'next';
import { DestinationsSection, CtaBanner } from '../../components/home';

export const metadata: Metadata = { title: 'Study Destinations | Dellics Education Consult' };

export default function DestinationsPage() {
  return (
    <main className="min-h-screen font-sans pt-16">
      <DestinationsSection />
      <CtaBanner title="Where will you go?" desc="Book a consultation to discuss your preferred destination and university choices." />
    </main>
  );
}