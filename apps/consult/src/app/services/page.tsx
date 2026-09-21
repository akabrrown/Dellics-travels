import Link from "next/link";
import Image from "next/image";

export default function ServicesPage() {
  return (
    <main>
      
  {/*  PAGE HEADER  */}
  <section className="page-header">
    <div className="container">
      <h1 className="page-title">Our <span className="highlight">Services</span></h1>
      <p className="page-subtitle">End-to-end guidance from admissions and test coordination to visa compliance and departure</p>
    </div>
  </section>

  {/*  SERVICES  */}
  <section id="services" className="services-section">
    <div className="container">
      <div className="services-grid">
        <article className="service-card" itemScope itemType="https://schema.org/Service" id="admissions">
          <div className="service-icon-wrap">
            <div className="service-icon">
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
          </div>
          <h3 itemProp="name">University Admissions</h3>
          <p itemProp="description">Expert guidance on choosing the right university and program. We review your profile, shortlist institutions, and manage your complete application dossier.</p>
          <ul className="service-list"><li>Profile evaluation &amp; university matching</li><li>Statement of purpose writing</li><li>Recommendation letter guidance</li><li>Application submission &amp; tracking</li></ul>
          <Link href="/signup" className="service-cta">Start in Portal &#8594;</Link>
        </article>
        <article className="service-card featured" itemScope itemType="https://schema.org/Service" id="visa">
          <div className="service-badge">High Demand</div>
          <div className="service-icon-wrap">
            <div className="service-icon">
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
          </div>
          <h3 itemProp="name">Visa Guidance &amp; Compliance</h3>
          <p itemProp="description">Navigate complex visa requirements with confidence. Our visa specialists conduct thorough financial audits, CAS/I-20 reviews, and one-on-one embassy interview coaching.</p>
          <ul className="service-list"><li>UK Tier 4 / Student Route Visa</li><li>Canada Study Permit &amp; PAL</li><li>USA F-1 Student Visa &amp; SEVIS</li><li>Schengen &amp; Australia Student Visa</li></ul>
          <Link href="/contact" className="service-cta">Get Started &#8594;</Link>
        </article>
        <article className="service-card" itemScope itemType="https://schema.org/Service" id="scholarship">
          <div className="service-icon-wrap">
            <div className="service-icon">
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </div>
          </div>
          <h3 itemProp="name">Scholarship Guidance</h3>
          <p itemProp="description">Discover and secure scholarships worth thousands of dollars. We identify opportunities you qualify for and craft compelling scholarship applications.</p>
          <ul className="service-list"><li>Chevening, Commonwealth &amp; more</li><li>University-specific merit awards</li><li>Essay &amp; application review</li><li>Interview preparation</li></ul>
          <Link href="/contact" className="service-cta">Explore Grants &#8594;</Link>
        </article>
        <article className="service-card" itemScope itemType="https://schema.org/Service" id="travel">
          <div className="service-icon-wrap">
            <div className="service-icon">
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
            </div>
          </div>
          <h3 itemProp="name">Travel &amp; Tour Integration</h3>
          <p itemProp="description">Powered by Dellics Travels, we arrange student-discounted airfares with extra baggage allowance, accommodation, airport transfers, and travel insurance.</p>
          <ul className="service-list"><li>Flight booking &amp; student ticketing (46kg baggage)</li><li>Airport transfers &amp; lodging</li><li>Travel insurance &amp; health cover</li><li>Student accommodation search</li></ul>
          <Link href="/portal" className="service-cta">Explore Travel Perks &#8594;</Link>
        </article>
        <article className="service-card" itemScope itemType="https://schema.org/Service" id="online">
          <div className="service-icon-wrap">
            <div className="service-icon">
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width={15} height={14} rx="2" ry="2"/></svg>
            </div>
          </div>
          <h3 itemProp="name">Online Counselling</h3>
          <p itemProp="description">Connect with our qualified counsellors via video call from anywhere in Ghana or Africa for personalized guidance at your convenience.</p>
          <ul className="service-list"><li>1-on-1 video consultations</li><li>Flexible scheduling</li><li>Document review via portal</li><li>Direct advisor messaging</li></ul>
          <Link href="/contact" className="service-cta">Book Session &#8594;</Link>
        </article>
        <article className="service-card" itemScope itemType="https://schema.org/Service" id="tests">
          <div className="service-icon-wrap">
            <div className="service-icon">
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width={8} height={4} rx="1" ry="1"/><path d="m9 14 2 2 4-4"/></svg>
            </div>
          </div>
          <h3 itemProp="name">Tests &amp; Exams Coordination</h3>
          <p itemProp="description">Dellics acts as your expert coordination partner with accredited tutorial institutions and official test centers across Ghana for comprehensive test preparation.</p>
          <div style={{ margin: "12px 0", fontSize: "0.82rem", background: "var(--off-white)", padding: "10px 14px", borderRadius: "8px", borderLeft: "3px solid var(--orange)" }}>
            <strong>English Language Tests:</strong> IELTS, TOEFL, PTE, Duolingo<br />
            <strong>Admissions Tests:</strong> SAT, ACT, GRE, GMAT
          </div>
          <ul className="service-list"><li>Accredited test center booking &amp; scheduling</li><li>Diagnostic tests &amp; preparation materials</li><li>In-person classes in Accra &amp; Kumasi or virtual tutoring</li><li>Status tracking in your student portal</li></ul>
          <Link href="/portal" className="service-cta">Coordinate Your Exam &#8594;</Link>
        </article>
      </div>
    </div>
  </section>


  {/*  CTA BANNER  */}
  <section className="cta-banner">
    <div className="container cta-banner-inner">
      <div className="cta-banner-text"><h2>Ready to Get Started?</h2><p>Book your free consultation today and let us help you choose the right service for your needs.</p></div>
      <div className="cta-banner-actions">
        <Link href="/contact" className="btn btn-white btn-lg">Book Free Consultation</Link>
        <Link href="/index" className="btn btn-outline-white btn-lg">Back to Home</Link>
      </div>
    </div>
  </section>

    </main>
  );
}
