import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main>
      
  {/*  PAGE HEADER  */}
  <section className="page-header">
    <div className="container">
      <h1 className="page-title">About <span className="highlight">Dellics</span></h1>
      <p className="page-subtitle">Guiding students from application to arrival — Building success through global education</p>
    </div>
  </section>

  {/*  WHY CHOOSE US / ABOUT  */}
  <section id="about" className="why-section">
    <div className="container">
      <div className="why-inner">
        <div className="why-text">
          <span className="section-tag">Why Choose Dellics</span>
          <h2 className="section-title">Your Success is Our <span className="highlight">Mission</span></h2>
          <p className="why-desc">At Dellics Education Consult, we combine deep expertise in international education with genuine care for every student. We are not just consultants &#8212; we are your partners in building a better future.</p>
          <div className="why-features">
            <div className="why-feat">
              <div className="why-icon">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div><h4>Proven Track Record</h4><p>Over 500+ students successfully placed in universities across 20+ countries.</p></div>
            </div>
            <div className="why-feat">
              <div className="why-icon">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
              </div>
              <div><h4>Personalized Approach</h4><p>Every student is unique. We create customized roadmaps aligned with your specific goals.</p></div>
            </div>
            <div className="why-feat">
              <div className="why-icon">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div><h4>Meticulous Visa Compliance</h4><p>Rigorous financial auditing, CAS/I-20 reviews, and interview coaching for maximum approval chances.</p></div>
            </div>
            <div className="why-feat">
              <div className="why-icon">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width={18} height={11} rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div><h4>End-to-End Support</h4><p>From your first consultation to landing at your destination &#8212; we are with you every step.</p></div>
            </div>
            <div className="why-feat">
              <div className="why-icon">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>
              </div>
              <div><h4>Free Initial Consultation</h4><p>Start your journey with zero cost. Expert advice at absolutely no charge.</p></div>
            </div>
            <div className="why-feat">
              <div className="why-icon">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width={20} height={14} rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <div><h4>Travel Agency Integration</h4><p>We handle flights, accommodation and logistics for a seamless experience.</p></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/signup" className="btn btn-primary">Start Your Application</Link>
            <Link href="/contact" className="btn btn-outline">Book Free Consultation</Link>
          </div>
        </div>
        <div className="why-visual">
          <div className="why-logo-container">
            <Image src="/logo.jpg" width={100} height={100}  alt="Dellics Education Consult" className="why-logo" />
            <div className="why-ring why-ring-1"></div>
            <div className="why-ring why-ring-2"></div>
            <div className="why-ring why-ring-3"></div>
          </div>
          <div className="why-stats-grid">
            <div className="why-stat"><span className="why-stat-num">500+</span><span className="why-stat-label">Students</span></div>
            <div className="why-stat"><span className="why-stat-num">100%</span><span className="why-stat-label">Case Tracking</span></div>
            <div className="why-stat"><span className="why-stat-num">20+</span><span className="why-stat-label">Countries</span></div>
            <div className="why-stat"><span className="why-stat-num">5 Star</span><span className="why-stat-label">Rating</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/*  CTA BANNER  */}
  <section className="cta-banner">
    <div className="container cta-banner-inner">
      <div className="cta-banner-text"><h2>Ready to Start Your Journey?</h2><p>Book your free consultation today and let us help you achieve your study abroad dreams.</p></div>
      <div className="cta-banner-actions">
        <Link href="/contact" className="btn btn-white btn-lg">Book Free Consultation</Link>
        <Link href="/index" className="btn btn-outline-white btn-lg">Back to Home</Link>
      </div>
    </div>
  </section>

    </main>
  );
}
