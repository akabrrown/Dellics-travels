import type { Metadata } from 'next';
import { ServicesSection, DashboardShowcase, CtaBanner } from '../../components/home';

export const metadata: Metadata = { title: 'Our Services | Dellics Education Consult' };

export default function ServicesPage() {
  return (
    <main className="min-h-screen font-sans pt-16">
      <ServicesSection />
      <DashboardShowcase />
      <CtaBanner title="Ready to Get Started?" desc="Book your free consultation today and let us help you choose the right service for your needs." />
    </main>
  );
}