import type { Metadata } from 'next';
import { TestimonialsSection, CtaBanner } from '../../components/home';

export const metadata: Metadata = { title: 'Success Stories | Dellics Education Consult' };

export default function SuccessStoriesPage() {
  return (
    <main className="min-h-screen font-sans pt-16">
      <TestimonialsSection />
      <CtaBanner title="Be Our Next Success Story" desc="Join the hundreds of students who have achieved their dreams with Dellics." />
    </main>
  );
}