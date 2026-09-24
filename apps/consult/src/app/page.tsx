import type { Metadata } from 'next';
import { HeroSection, TrustStrip, HowItWorksSection, ServicesSection, DashboardShowcase, DestinationsSection, WhyChooseUsSection, TestimonialsSection, FaqSection, ContactSection, UniversityPartners, RecommendedServices } from '../components/home';

export const metadata: Metadata = {
  title: 'Dellics Education Consult | Study Abroad in UK, Canada, USA & Australia',
  description: 'Expert guidance for Ghanaian and international students. We manage university admissions, scholarships, IELTS prep, and visa compliance for top global destinations.',
};

export default function ConsultHome() {
  return (
    <main className="min-h-screen font-sans">
      <HeroSection />
<UniversityPartners />
      <TrustStrip />
      <HowItWorksSection />
      <ServicesSection />
<RecommendedServices />
      <DashboardShowcase />
      <DestinationsSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
    </main>
  );
}