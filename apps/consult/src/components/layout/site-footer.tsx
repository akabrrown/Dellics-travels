import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="footer bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="footer-brand space-y-4">
              <Image src="/logo.jpg" alt="Dellics Education Consult" width={140} height={140} className="rounded-xl shadow-sm mb-4" />
              <p className="text-sm text-slate-600 font-medium">
                Ghana's trusted partner for international education and travel. We turn study abroad dreams into reality.
              </p>
              <p className="text-xs font-bold text-brand-orange">“Guiding Futures. Building Success.”</p>
              
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-blue hover:text-white transition-colors" aria-label="Facebook">
                  f
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-blue hover:text-white transition-colors" aria-label="Instagram">
                  in
                </a>
                <a href="https://wa.me/233552054174" className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-brand-orange hover:text-white transition-colors" aria-label="WhatsApp">
                  wa
                </a>
              </div>
            </div>

            <div className="footer-links-group">
              <h4 className="text-sm font-bold text-brand-blue mb-4 uppercase tracking-wider">Our Services</h4>
              <ul className="space-y-2">
                <li><Link href="/services#admissions" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">University Admissions</Link></li>
                <li><Link href="/services#visa" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">Visa Assistance</Link></li>
                <li><Link href="/services#scholarship" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">Scholarship Guidance</Link></li>
                <li><Link href="/services#travel" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">Travel & Tour</Link></li>
                <li><Link href="/services#online" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">Online Counselling</Link></li>
                <li><Link href="/services#test" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">Test Preparation</Link></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4 className="text-sm font-bold text-brand-blue mb-4 uppercase tracking-wider">Destinations</h4>
              <ul className="space-y-2">
                <li><Link href="/destinations#uk" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">Study in UK</Link></li>
                <li><Link href="/destinations#canada" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">Study in Canada</Link></li>
                <li><Link href="/destinations#usa" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">Study in USA</Link></li>
                <li><Link href="/destinations#australia" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">Study in Australia</Link></li>
                <li><Link href="/destinations#europe" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">Study in Europe</Link></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4 className="text-sm font-bold text-brand-blue mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">Home</Link></li>
                <li><Link href="/about" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">About Us</Link></li>
                <li><Link href="/success-stories" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">Success Stories</Link></li>
                <li><Link href="/contact" className="text-sm text-slate-600 hover:text-brand-orange transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-12 pt-8">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 font-medium text-center md:text-left">
              &copy; {currentYear} Dellics Education Consult. All Rights Reserved. | Guiding Futures. Building Success.
            </p>
            <p className="text-xs text-slate-500 font-medium text-center md:text-right">
              Designed with ❤️ for Ghanaian Students
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/233552054174?text=Hello%20Dellics!" 
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-xl hover:-translate-y-1 transition-all group flex items-center justify-center"
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Chat on WhatsApp"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488 11.815 11.815 0 0012.05 0z"/>
        </svg>
      </a>
    </>
  );
}
