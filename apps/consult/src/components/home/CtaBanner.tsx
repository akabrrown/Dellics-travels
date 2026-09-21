import Link from "next/link";
export function CtaBanner({ title = "Ready to Start Your Journey?", desc = "Book your free consultation today and let us help you achieve your study abroad dreams." }: { title?: string, desc?: string }) {
  return (
    <section className="py-24 bg-brand-blue text-white text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange via-yellow-500 to-brand-orange"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">{title}</h2>
        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">{desc}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/contact" className="px-8 py-3 rounded-full bg-brand-orange text-white font-bold hover:bg-brand-orange-light transition-colors shadow-lg shadow-brand-orange/20">Book Free Consultation</Link>
          <Link href="/" className="px-8 py-3 rounded-full bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-colors">Back to Home</Link>
        </div>
      </div>
    </section>
  );
}