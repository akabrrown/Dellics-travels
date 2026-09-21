import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main>
      
  {/*  HERO  */}
  <section id="home" className="hero">
    <div className="hero-bg">
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>
      <div className="hero-orb hero-orb-3"></div>
      <div className="hero-globe">Global Education</div>
    </div>
    <div className="container hero-content">
      <div className="hero-text">
        <h1 className="hero-title"><span className="highlight">Transform</span> Your Future<br />Through Global Education</h1>
        <p className="hero-subtitle">Expert guidance for Ghanaian &amp; African students aspiring to study abroad. From university shortlisting and test coordination to visa approval and travel — manage your entire journey with confidence.</p>
        <div className="hero-tagline">“Guiding students from application to arrival.”</div>
        <div className="hero-actions">
          <Link href="/signup" className="btn btn-primary btn-lg">
            <span>Start Your Application</span>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link href="#how-it-works" className="btn btn-outline btn-lg">Explore Our Process</Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><span className="stat-num" data-count="500">0</span><span className="stat-plus">+</span><span className="stat-label">Students Advised</span></div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat"><span className="stat-num" data-count="20">0</span><span className="stat-plus">+</span><span className="stat-label">Study Destinations</span></div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat"><span className="stat-num" data-count="100">0</span><span className="stat-plus">%</span><span className="stat-label">Transparent Process</span></div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-card-wrap">
          <div className="hero-logo-card">
            <Image src="/logo.jpg" width={100} height={100}  alt="Dellics Education Consult" className="hero-logo" />
            <div className="hero-card-shine"></div>
          </div>
          <div className="float-card float-card-1"><span>Award</span><div><strong>Scholarship Found!</strong><small>&#163;25,000 Award</small></div></div>
          <div className="float-card float-card-2"><span>Approved</span><div><strong>Visa Approved</strong><small>UK Student Visa</small></div></div>
          <div className="float-card float-card-3"><span>Offer</span><div><strong>Offer Letter</strong><small>University of Toronto</small></div></div>
        </div>
      </div>
    </div>
  </section>


  {/*  TRUST STRIP  */}
  <section className="trust-strip">
    <div className="container">
      <p className="trust-label">Partnered with top universities worldwide</p>
      <div className="trust-logos-wrap">
        <div className="trust-logos">
          <div className="trust-logo-item">University of Oxford</div>
          <div className="trust-logo-item">University of Toronto</div>
          <div className="trust-logo-item">Harvard University</div>
          <div className="trust-logo-item">MIT</div>
          <div className="trust-logo-item">ANU Australia</div>
          <div className="trust-logo-item">University of Edinburgh</div>
          <div className="trust-logo-item">University College London</div>
          <div className="trust-logo-item">Stanford University</div>
          <div className="trust-logo-item">University of Oxford</div>
          <div className="trust-logo-item">University of Toronto</div>
        </div>
      </div>
    </div>
  </section>

  {/*  HOW IT WORKS: OUR 7-STEP PROCESS  */}
  <section id="how-it-works" className="how-section">
    <div className="container">
      <div className="section-header">
        <span className="section-tag">Transparent Roadmap</span>
        <h2 className="section-title">Our <span className="highlight">7-Step Journey</span></h2>
        <p className="section-subtitle">Consult → Assess → Select → Apply → Offer → Visa → Travel</p>
      </div>
      <div className="journey-steps-grid">
        <div className="journey-step-card">
          <div className="journey-step-num">01</div>
          <h3>Consult</h3>
          <p>Initial discovery session with our senior counsellors to evaluate your educational aspirations, academic background, and budget.</p>
        </div>
        <div className="journey-step-card">
          <div className="journey-step-num">02</div>
          <h3>Assess</h3>
          <p>Full assessment of WASSCE / Degree transcripts and standardized test requirements (IELTS, TOEFL, SAT, GRE).</p>
        </div>
        <div className="journey-step-card">
          <div className="journey-step-num">03</div>
          <h3>Select</h3>
          <p>Data-backed university shortlisting matching your budget, preferred intake, and long-term career goals.</p>
        </div>
        <div className="journey-step-card">
          <div className="journey-step-num">04</div>
          <h3>Apply</h3>
          <p>Dossier compilation, statement of purpose polishing, recommendation verification, and formal application submission.</p>
        </div>
        <div className="journey-step-card">
          <div className="journey-step-num">05</div>
          <h3>Offer</h3>
          <p>Securing conditional and unconditional offer letters, university scholarship negotiations, and deposit guidance.</p>
        </div>
        <div className="journey-step-card">
          <div className="journey-step-num">06</div>
          <h3>Visa</h3>
          <p>Meticulous financial document audit (e.g. UKVI 28-day rule), CAS/I-20 procurement, and intensive embassy interview coaching.</p>
        </div>
        <div className="journey-step-card">
          <div className="journey-step-num">07</div>
          <h3>Travel</h3>
          <p>Seamless transition powered by Dellics Travels: student airfare discounts, pre-booked dorms, airport pickups, and eSIMs.</p>
        </div>
      </div>
    </div>
  </section>

  {/*  SERVICES  */}
  <section id="services" className="services-section">
    <div className="container">
      <div className="section-header">
        <span className="section-tag">What We Offer</span>
        <h2 className="section-title">Comprehensive <span className="highlight">Services</span></h2>
        <p className="section-subtitle">End-to-end support for every stage of your international education journey</p>
      </div>
      <div className="services-grid">
        <article className="service-card" itemScope itemType="https://schema.org/Service">
          <div className="service-icon-wrap">
            <div className="service-icon">
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
          </div>
          <h3 itemProp="name">University Admissions</h3>
          <p itemProp="description">Expert guidance on choosing the right university and program. We review your profile, shortlist institutions, and manage your complete application dossier.</p>
          <ul className="service-list"><li>Profile evaluation &amp; university matching</li><li>Statement of purpose writing</li><li>Recommendation letter guidance</li><li>Application submission &amp; tracking</li></ul>
          <Link href="/signup" className="service-cta">Start Application &#8594;</Link>
        </article>
        <article className="service-card featured" itemScope itemType="https://schema.org/Service">
          <div className="service-badge">High Demand</div>
          <div className="service-icon-wrap">
            <div className="service-icon">
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
          </div>
          <h3 itemProp="name">Visa Guidance &amp; Compliance</h3>
          <p itemProp="description">Navigate complex visa requirements with confidence. Our visa specialists conduct rigorous financial audits, CAS/I-20 reviews, and one-on-one embassy interview coaching.</p>
          <ul className="service-list"><li>UK Tier 4 / Student Route Visa</li><li>Canada Study Permit &amp; PAL</li><li>USA F-1 Student Visa &amp; SEVIS</li><li>Schengen &amp; Australia Student Visa</li></ul>
          <Link href="/contact" className="service-cta">Get Visa Guidance &#8594;</Link>
        </article>
        <article className="service-card" itemScope itemType="https://schema.org/Service">
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
        <article className="service-card" itemScope itemType="https://schema.org/Service">
          <div className="service-icon-wrap">
            <div className="service-icon">
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
            </div>
          </div>
          <h3 itemProp="name">Dellics Travels Integration</h3>
          <p itemProp="description">Powered by Dellics Travels, we arrange student discounted airfares with extra baggage, verified accommodation, airport transfers, and pre-departure eSIM cards.</p>
          <ul className="service-list"><li>Student airfare booking (46kg baggage)</li><li>Vetted university dorms &amp; residences</li><li>Airport transfer pickups</li><li>Pre-activated international eSIMs</li></ul>
          <Link href="/portal" className="service-cta">View Travel Perks &#8594;</Link>
        </article>
        <article className="service-card" itemScope itemType="https://schema.org/Service">
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
        <article className="service-card" itemScope itemType="https://schema.org/Service">
          <div className="service-icon-wrap">
            <div className="service-icon">
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width={8} height={4} rx="1" ry="1"/><path d="m9 14 2 2 4-4"/></svg>
            </div>
          </div>
          <h3 itemProp="name">Tests &amp; Exam Coordination</h3>
          <p itemProp="description">Dellics acts as your coordination service with accredited institutions and British Council/ETS partners for comprehensive test preparation and registration.</p>
          <ul className="service-list"><li>English: IELTS, TOEFL, PTE, Duolingo</li><li>Admissions: SAT, ACT, GRE, GMAT</li><li>Accredited test center booking</li><li>Tutorial class scheduling in Ghana</li></ul>
          <Link href="/portal" className="service-cta">Coordinate Exam &#8594;</Link>
        </article>
      </div>
    </div>
  </section>

  {/*  STUDENT DASHBOARD SHOWCASE SECTION  */}
  <section id="dashboard" className="dashboard-showcase-section">
    <div className="container">
      <div className="section-header">
        <span className="section-tag">Student Service Platform</span>
        <h2 className="section-title">Your Personal <span className="highlight">Student Dashboard</span></h2>
        <p className="section-subtitle">Experience how Dellics tracks your study abroad application, test coordination, documents, and visa milestones in real time — zero guesswork, 100% transparency.</p>
      </div>

      {/*  Dashboard Interactive Card  */}
      <div className="dashboard-card-wrap">
        
        {/*  Top App Bar  */}
        <div className="dash-top-bar">
          <div className="dash-user-meta">
            <div className="dash-user-avatar">JM</div>
            <div>
              <div className="dash-user-name">John Mensah <span className="dash-live-chip"><span className="portal-badge-dot"></span> Active Student</span></div>
              <div className="dash-user-sub">DEC-2025-0842 · UK Undergraduate Route · Intake: Sept 2025</div>
            </div>
          </div>
          <div className="dash-top-stats">
            <div className="dash-stat-pill">
              <span className="dash-stat-label">Application Status:</span>
              <span className="dash-stat-val status-positive">Shortlisting &amp; Offers</span>
            </div>
            <div className="dash-progress-box">
              <div className="dash-progress-label">
                <span>Profile Health</span>
                <strong>75%</strong>
              </div>
              <div className="dash-progress-track">
                <div className="dash-progress-fill" style={{ width: "75%" }}></div>
              </div>
            </div>
            <Link href="/portal" className="btn btn-sm btn-primary dash-portal-cta">Launch Live Portal &rarr;</Link>
          </div>
        </div>

        {/*  8-Stage Progress Tracker Stepper  */}
        <div className="dash-stepper-wrap">
          <div className="dash-stepper-title">Application Milestone Tracker</div>
          <div className="dash-stepper-track">
            <div className="dash-step completed">
              <div className="dash-step-circle">&#10003;</div>
              <div className="dash-step-label">1. Consult</div>
            </div>
            <div className="dash-step-line completed"></div>
            <div className="dash-step completed">
              <div className="dash-step-circle">&#10003;</div>
              <div className="dash-step-label">2. Assess</div>
            </div>
            <div className="dash-step-line completed"></div>
            <div className="dash-step completed">
              <div className="dash-step-circle">&#10003;</div>
              <div className="dash-step-label">3. Shortlist</div>
            </div>
            <div className="dash-step-line active"></div>
            <div className="dash-step active">
              <div className="dash-step-circle">4</div>
              <div className="dash-step-label">4. Apply</div>
            </div>
            <div className="dash-step-line"></div>
            <div className="dash-step">
              <div className="dash-step-circle">5</div>
              <div className="dash-step-label">5. Offer</div>
            </div>
            <div className="dash-step-line"></div>
            <div className="dash-step">
              <div className="dash-step-circle">6</div>
              <div className="dash-step-label">6. Visa</div>
            </div>
            <div className="dash-step-line"></div>
            <div className="dash-step">
              <div className="dash-step-circle">7</div>
              <div className="dash-step-label">7. Interview</div>
            </div>
            <div className="dash-step-line"></div>
            <div className="dash-step">
              <div className="dash-step-circle">8</div>
              <div className="dash-step-label">8. Travel</div>
            </div>
          </div>
        </div>

        {/*  Interactive Tabs Bar  */}
        <div className="dash-tabs-bar" role="tablist">
          <button className="dash-tab active" data-dash-tab="tab-overview" role="tab" aria-selected="true" type="button">
            <span>📊</span> Dashboard Overview
          </button>
          <button className="dash-tab" data-dash-tab="tab-applications" role="tab" aria-selected="false" type="button">
            <span>🏛️</span> My Applications <span className="dash-tab-badge">3</span>
          </button>
          <button className="dash-tab" data-dash-tab="tab-tests" role="tab" aria-selected="false" type="button">
            <span>🎯</span> Tests &amp; Exams <span className="dash-tab-badge">IELTS 7.5</span>
          </button>
          <button className="dash-tab" data-dash-tab="tab-documents" role="tab" aria-selected="false" type="button">
            <span>📁</span> Document Locker <span className="dash-tab-badge">Verified</span>
          </button>
          <button className="dash-tab" data-dash-tab="tab-visa" role="tab" aria-selected="false" type="button">
            <span>🛂</span> Visa &amp; Dellics Travel
          </button>
        </div>

        {/*  Tab 1: Overview  */}
        <div className="dash-tab-pane active" id="tab-overview" role="tabpanel">
          <div className="dash-grid-cards">
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-icon">🏛️</span>
                <h4>Shortlisted Universities</h4>
              </div>
              <div className="dash-card-num">3 Selected</div>
              <p className="dash-card-desc">1 Unconditional Offer received · 2 awaiting admission decisions</p>
              <div className="dash-card-chip chip-green">1 Offer In Hand</div>
            </div>
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-icon">🎯</span>
                <h4>English Test (IELTS)</h4>
              </div>
              <div className="dash-card-num">Band 7.5</div>
              <p className="dash-card-desc">Listening: 8.0 · Reading: 7.5 · Writing: 7.0 · Speaking: 7.5</p>
              <div className="dash-card-chip chip-blue">British Council Verified</div>
            </div>
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-icon">📁</span>
                <h4>Document Locker</h4>
              </div>
              <div className="dash-card-num">6 Uploaded</div>
              <p className="dash-card-desc">WASSCE result, valid passport, SOP, 2 recommendations &amp; CV</p>
              <div className="dash-card-chip chip-green">100% Vetted</div>
            </div>
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-icon">👩‍💼</span>
                <h4>Assigned Advisor</h4>
              </div>
              <div className="dash-card-num" style={{ fontSize: "1.15rem" }}>Mrs. Linda Boateng</div>
              <p className="dash-card-desc">Senior Education Counsellor · Greater Accra Office</p>
              <div className="dash-card-chip chip-orange">Active &amp; Connected</div>
            </div>
          </div>

          {/*  Live Activity Feed in Dashboard  */}
          <div className="dash-feed-box">
            <h4 className="dash-feed-title">Recent Application Activity &amp; Next Steps</h4>
            <div className="dash-feed-item">
              <div className="dash-feed-dot dot-green"></div>
              <div className="dash-feed-content">
                <strong>Coventry University — Unconditional Offer Issued!</strong>
                <p>Offer includes £3,000 Early Bird International Scholarship for BSc Computing (Sept 2025).</p>
                <span className="dash-feed-time">2 hours ago</span>
              </div>
            </div>
            <div className="dash-feed-item">
              <div className="dash-feed-dot dot-orange"></div>
              <div className="dash-feed-content">
                <strong>Statement of Purpose (SOP) Polish Complete</strong>
                <p>Dellics senior academic editor finalized your SOP for University of Manchester.</p>
                <span className="dash-feed-time">Yesterday at 4:15 PM</span>
              </div>
            </div>
            <div className="dash-feed-item">
              <div className="dash-feed-dot dot-blue"></div>
              <div className="dash-feed-content">
                <strong>Mock Visa Interview Booked</strong>
                <p>One-on-one UKVI compliance coaching session with Dellics visa attorney scheduled for Thursday at 2:00 PM GMT.</p>
                <span className="dash-feed-time">2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/*  Tab 2: Applications  */}
        <div className="dash-tab-pane" id="tab-applications" role="tabpanel">
          <div className="dash-apps-grid">
            <div className="dash-app-card">
              <div className="dash-app-top">
                <span className="dash-app-flag">🇬🇧 UK</span>
                <span className="dash-badge badge-offer">Unconditional Offer</span>
              </div>
              <h3>Coventry University</h3>
              <p className="dash-app-degree">BSc (Hons) Computing &amp; Information Systems</p>
              <div className="dash-app-details">
                <div><span>Tuition:</span> <strong>£16,800/yr</strong></div>
                <div><span>Scholarship:</span> <strong style={{ color: "#10B981" }}>-£3,000 Awarded</strong></div>
                <div><span>Intake:</span> <strong>September 2025</strong></div>
              </div>
              <div className="dash-app-action">
                <Link href="/portal" className="btn btn-sm btn-primary">Accept Offer &amp; Request CAS</Link>
              </div>
            </div>

            <div className="dash-app-card">
              <div className="dash-app-top">
                <span className="dash-app-flag">🇬🇧 UK</span>
                <span className="dash-badge badge-conditional">Conditional Offer</span>
              </div>
              <h3>University of Manchester</h3>
              <p className="dash-app-degree">BSc Computer Science</p>
              <div className="dash-app-details">
                <div><span>Tuition:</span> <strong>£26,500/yr</strong></div>
                <div><span>Condition:</span> <strong>Final WAEC Chemistry B+</strong></div>
                <div><span>Intake:</span> <strong>September 2025</strong></div>
              </div>
              <div className="dash-app-action">
                <Link href="/portal" className="btn btn-sm btn-secondary">Upload Final Certificate</Link>
              </div>
            </div>

            <div className="dash-app-card">
              <div className="dash-app-top">
                <span className="dash-app-flag">🇬🇧 UK</span>
                <span className="dash-badge badge-review">Under Review</span>
              </div>
              <h3>University of Leeds</h3>
              <p className="dash-app-degree">BEng Software Engineering</p>
              <div className="dash-app-details">
                <div><span>Tuition:</span> <strong>£24,750/yr</strong></div>
                <div><span>Status:</span> <strong>Admissions Board Review</strong></div>
                <div><span>Expected:</span> <strong>Within 10 business days</strong></div>
              </div>
              <div className="dash-app-action">
                <Link href="/portal" className="btn btn-sm btn-secondary">Track Submission Dossier</Link>
              </div>
            </div>
          </div>
        </div>

        {/*  Tab 3: Tests & Exams  */}
        <div className="dash-tab-pane" id="tab-tests" role="tabpanel">
          <div className="dash-tests-grid">
            <div className="dash-test-card">
              <div className="dash-test-header">
                <div className="dash-test-title">
                  <h4>IELTS Academic</h4>
                  <span className="dash-test-provider">British Council Partner Exam</span>
                </div>
                <div className="dash-score-badge">7.5</div>
              </div>
              <p className="dash-test-summary">Official Test Report Form (TRF) verified and attached to all university dossiers.</p>
              <div className="dash-subscores">
                <div className="subscore-item"><span>Listening</span><strong>8.0</strong></div>
                <div className="subscore-item"><span>Reading</span><strong>7.5</strong></div>
                <div className="subscore-item"><span>Writing</span><strong>7.0</strong></div>
                <div className="subscore-item"><span>Speaking</span><strong>7.5</strong></div>
              </div>
              <div className="dash-test-footer">
                <span className="dash-check-badge">&#10003; Meets All UK University Standards</span>
              </div>
            </div>

            <div className="dash-test-card">
              <div className="dash-test-header">
                <div className="dash-test-title">
                  <h4>Digital SAT Preparation</h4>
                  <span className="dash-test-provider">US University Pathway</span>
                </div>
                <div className="dash-score-badge" style={{ background: "#0D1B5E" }}>1390</div>
              </div>
              <p className="dash-test-summary">Diagnostic mock exam completed. Official test date scheduled with Dellics accredited partner test center in Accra.</p>
              <div className="dash-subscores">
                <div className="subscore-item"><span>Math</span><strong>720</strong></div>
                <div className="subscore-item"><span>Reading</span><strong>670</strong></div>
                <div className="subscore-item"><span>Next Test</span><strong>Oct 18</strong></div>
                <div className="subscore-item"><span>Center</span><strong>Accra</strong></div>
              </div>
              <div className="dash-test-footer">
                <Link href="/portal" className="btn btn-sm btn-secondary">Schedule Diagnostic Mock Test &rarr;</Link>
              </div>
            </div>
          </div>
        </div>

        {/*  Tab 4: Documents  */}
        <div className="dash-tab-pane" id="tab-documents" role="tabpanel">
          <div className="dash-docs-table-wrap">
            <table className="dash-docs-table">
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Vetting Authority</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>International Passport Bio-Page</strong><br /><small>Valid through 2030</small></td>
                  <td>Identity</td>
                  <td><span className="doc-badge-verified">&#10003; Verified</span></td>
                  <td>Dellics Compliance Desk</td>
                  <td><Link href="/portal" className="doc-link">View File</Link></td>
                </tr>
                <tr>
                  <td><strong>WASSCE Result Slip &amp; Online Checker</strong><br /><small>7 A1s, 1 B2</small></td>
                  <td>Academic</td>
                  <td><span className="doc-badge-verified">&#10003; Verified</span></td>
                  <td>WAEC Ghana Scratch Card Verified</td>
                  <td><Link href="/portal" className="doc-link">View File</Link></td>
                </tr>
                <tr>
                  <td><strong>Statement of Purpose (SOP)</strong><br /><small>Version 3.2 (Final Approved)</small></td>
                  <td>Admissions</td>
                  <td><span className="doc-badge-verified">&#10003; Approved</span></td>
                  <td>Senior Academic Counselor</td>
                  <td><Link href="/portal" className="doc-link">View File</Link></td>
                </tr>
                <tr>
                  <td><strong>Academic Recommendation Letters (2)</strong><br /><small>Principal &amp; Head of Science</small></td>
                  <td>References</td>
                  <td><span className="doc-badge-verified">&#10003; Verified</span></td>
                  <td>School Direct Verification</td>
                  <td><Link href="/portal" className="doc-link">View File</Link></td>
                </tr>
                <tr>
                  <td><strong>Financial Audit &amp; Bank Statement</strong><br /><small>28-Day Holding Period Tracking</small></td>
                  <td>Visa Compliance</td>
                  <td><span className="doc-badge-pending">&#9679; Auditing (Day 21/28)</span></td>
                  <td>Dellics Financial Compliance</td>
                  <td><Link href="/portal" className="doc-link">Check Status</Link></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/*  Tab 5: Visa & Dellics Travels  */}
        <div className="dash-tab-pane" id="tab-visa" role="tabpanel">
          <div className="dash-travel-wrap">
            <div className="dash-travel-card">
              <h4>🛂 UK Student Route Visa Checklist</h4>
              <ul className="dash-checklist">
                <li className="checked"><span>&#10003;</span> CAS (Confirmation of Acceptance for Studies) from Coventry: Ready to issue</li>
                <li className="checked"><span>&#10003;</span> Tuberculosis (TB) Medical Test Booked at IOM Accra</li>
                <li className="checked"><span>&#10003;</span> Academic Qualifications &amp; IELTS TRF uploaded to UKVI portal</li>
                <li className="pending"><span>&#9679;</span> Bank Funds: Day 21 of required 28-day holding completed</li>
                <li><span>&#9675;</span> VFS Biometric Appointment Booking (Opens upon 28-day completion)</li>
              </ul>
            </div>
            <div className="dash-travel-card perk-card">
              <div className="perk-badge">✈️ Powered by Dellics Travels</div>
              <h4>Pre-Arrival Logistics &amp; Student Perks</h4>
              <p>Because you are registered on the Dellics platform, your student profile unlocks exclusive travel logistics:</p>
              <div className="perk-items">
                <div className="perk-item">
                  <span className="perk-icon">🎫</span>
                  <div><strong>10% Student Flight Discount</strong><br /><small>46kg (2 x 23kg) baggage allowance on British Airways, Emirates &amp; KLM</small></div>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">🏠</span>
                  <div><strong>Vetted Student Accommodation</strong><br /><small>3 verified student residences near Coventry University pre-reserved</small></div>
                </div>
                <div className="perk-item">
                  <span className="perk-icon">📱</span>
                  <div><strong>Free UK eSIM Card</strong><br /><small>Pre-activated with 20GB data ready upon landing at London Heathrow</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  Dashboard Action Banner Footer  */}
        <div className="dash-action-footer">
          <div className="dash-footer-text">
            <h3>Start managing your study-abroad journey like John</h3>
            <p>Create your free student account to unlock university shortlists, test bookings, and real-time application tracking.</p>
          </div>
          <div className="dash-footer-actions">
            <Link href="/signup" className="btn btn-primary btn-lg">Create Student Account</Link>
            <Link href="/portal" className="btn btn-outline-white btn-lg">Launch Live Portal Demo &rarr;</Link>
          </div>
        </div>

      </div>
    </div>
  </section>

  {/*  DESTINATIONS  */}
  <section id="destinations" className="destinations-section">
    <div className="container">
      <div className="section-header">
        <span className="section-tag">Study Destinations</span>
        <h2 className="section-title">Where Will You <span className="highlight">Go?</span></h2>
        <p className="section-subtitle">We place students in top universities across the globe</p>
      </div>
      <div className="destinations-grid">
        <article className="dest-card"><div className="dest-flag">UK</div><div className="dest-content"><h3>United Kingdom</h3><p>Home to Oxford, Cambridge, Imperial College, and 100+ world-class universities. Post-study work visa available.</p><div className="dest-tags"><span className="dest-tag">Top Rankings</span><span className="dest-tag">Scholarships</span><span className="dest-tag">Work Rights</span></div>        <Link href="/contact" className="dest-link">Explore UK &#8594;</Link></div></article>
        <article className="dest-card"><div className="dest-flag">CA</div><div className="dest-content"><h3>Canada</h3><p>Affordable tuition, multicultural environment, and a clear pathway to permanent residency. Work while you study!</p><div className="dest-tags"><span className="dest-tag">PR Pathway</span><span className="dest-tag">Affordable</span><span className="dest-tag">Safe</span></div>        <Link href="/contact" className="dest-link">Explore Canada &#8594;</Link></div></article>
        <article className="dest-card"><div className="dest-flag">US</div><div className="dest-content"><h3>United States</h3><p>The world&#39;s leading academic destination. Access to Ivy League schools, Silicon Valley connections, and OPT opportunities.</p><div className="dest-tags"><span className="dest-tag">Ivy League</span><span className="dest-tag">Research</span><span className="dest-tag">OPT</span></div>        <Link href="/contact" className="dest-link">Explore USA &#8594;</Link></div></article>
        <article className="dest-card"><div className="dest-flag">AU</div><div className="dest-content"><h3>Australia</h3><p>World-class education in a stunning environment. Post-study work rights, vibrant student community, and sunny lifestyle.</p><div className="dest-tags"><span className="dest-tag">Work Rights</span><span className="dest-tag">PR Pathway</span><span className="dest-tag">Quality Life</span></div>        <Link href="/contact" className="dest-link">Explore Australia &#8594;</Link></div></article>
        <article className="dest-card"><div className="dest-flag">EU</div><div className="dest-content"><h3>Europe</h3><p>Germany, Netherlands, France and more — many offering free or low-cost tuition. Rich culture and global career opportunities.</p><div className="dest-tags"><span className="dest-tag">Low Tuition</span><span className="dest-tag">Culture</span><span className="dest-tag">Erasmus+</span></div><div className="europe-schools"><h4>Popular European Schools:</h4><ul><li>University of Oxford (UK)</li><li>University of Cambridge (UK)</li><li>Technical University of Munich (Germany)</li><li>University of Amsterdam (Netherlands)</li><li>Sorbonne University (France)</li><li>ETH Zurich (Switzerland)</li></ul></div>        <Link href="/contact" className="dest-link">Explore Europe &#8594;</Link></div></article>
        <article className="dest-card"><div className="dest-flag">GH</div><div className="dest-content"><h3>Study in Ghana</h3><p>International students seeking quality education in Ghana. We guide you through admissions to top Ghanaian universities and colleges.</p><div className="dest-tags"><span className="dest-tag">Quality Education</span><span className="dest-tag">Affordable</span><span className="dest-tag">Welcoming</span></div>        <Link href="/contact" className="dest-link">Study in Ghana &#8594;</Link></div></article>
        <article className="dest-card"><div className="dest-flag">Global</div><div className="dest-content"><h3>And More…</h3><p>New Zealand, Ireland, Dubai, Singapore, and beyond. Wherever your dream destination is, we will get you there.</p><div className="dest-tags"><span className="dest-tag">New Zealand</span><span className="dest-tag">Ireland</span><span className="dest-tag">UAE</span></div>        <Link href="/contact" className="dest-link">Ask Us &#8594;</Link></div></article>
      </div>
    </div>
  </section>

  {/*  WHY CHOOSE US / ABOUT  */}
  <section id="about" className="why-section">
    <div className="container">
      <div className="why-inner">
        <div className="why-text">
          <span className="section-tag">Why Choose Dellics</span>
          <h2 className="section-title">Guiding Students from <span className="highlight">Application to Arrival</span></h2>
          <p className="why-desc">At Dellics Education Consult, we combine deep expertise in international education with genuine care for every student. We are not just consultants &#8212; we are your end-to-end partners with a dedicated digital platform to keep you informed at every milestone.</p>
          <div className="why-features">
            <div className="why-feat">
              <div className="why-icon">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div><h4>Dedicated Consultants</h4><p>Direct access to your assigned education advisor with transparent milestone updates.</p></div>
            </div>
            <div className="why-feat">
              <div className="why-icon">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>
              </div>
              <div><h4>Personalized Matching</h4><p>Every student is unique. We match you to universities that fit your exact grades, budget, and career goals.</p></div>
            </div>
            <div className="why-feat">
              <div className="why-icon">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div><h4>Meticulous Visa Compliance</h4><p>We rigorously review funds, holding periods, and documentation to protect your application.</p></div>
            </div>
            <div className="why-feat">
              <div className="why-icon">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width={18} height={11} rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div><h4>Secure Document Locker</h4><p>Upload your academic transcripts, WAEC slips, and passport once into a secure student portal.</p></div>
            </div>
            <div className="why-feat">
              <div className="why-icon">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>
              </div>
              <div><h4>Accredited Test Prep Coordination</h4><p>We arrange diagnostic preparation and official test bookings with accredited partner centers.</p></div>
            </div>
            <div className="why-feat">
              <div className="why-icon">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width={20} height={14} rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <div><h4>Dellics Travels Integration</h4><p>Enjoy discounted student flights, verified student accommodation, airport transfers, and eSIMs.</p></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
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
            <div className="why-stat"><span className="why-stat-num">500+</span><span className="why-stat-label">Students Placed</span></div>
            <div className="why-stat"><span className="why-stat-num">100%</span><span className="why-stat-label">Case Tracking</span></div>
            <div className="why-stat"><span className="why-stat-num">20+</span><span className="why-stat-label">Countries</span></div>
            <div className="why-stat"><span className="why-stat-num">5 Star</span><span className="why-stat-label">Rating</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/*  TESTIMONIALS  */}
  <section id="testimonials" className="testimonials-section">
    <div className="container">
      <div className="section-header">
        <span className="section-tag">Success Stories</span>
        <h2 className="section-title">What Our Students <span className="highlight">Say</span></h2>
        <p className="section-subtitle">Real stories from students we have helped achieve their international education dreams</p>
      </div>
      <div className="testimonials-slider" id="testimonials-slider">
        <div className="testimonials-track" id="testimonials-track">
          <article className="testimonial-card" itemScope itemType="https://schema.org/Review">
            <div className="testimonial-stars">5 Stars</div>
            <blockquote itemProp="reviewBody">“Dellics made my dream of studying in the UK a reality. They guided me through every step &#8212; from IELTS prep to my Tier 4 visa. I&#39;m now at the University of Manchester!”</blockquote>
            <div className="testimonial-author"><div className="testimonial-avatar">AK</div><div><strong itemProp="author">Ama Kyei</strong><span>University of Manchester, UK</span></div></div>
          </article>
          <article className="testimonial-card" itemScope itemType="https://schema.org/Review">
            <div className="testimonial-stars">5 Stars</div>
            <blockquote itemProp="reviewBody">“I had tried twice before with other agents and failed. Dellics Education Consult got my Canadian study permit approved in just 6 weeks! Professional and thorough.”</blockquote>
            <div className="testimonial-author"><div className="testimonial-avatar">KB</div><div><strong itemProp="author">Kwame Boateng</strong><span>University of Calgary, Canada</span></div></div>
          </article>
          <article className="testimonial-card" itemScope itemType="https://schema.org/Review">
            <div className="testimonial-stars">5 Stars</div>
            <blockquote itemProp="reviewBody">“The scholarship guidance from Dellics was phenomenal. They helped me secure a Chevening Scholarship worth &#163;25,000. I couldn&#39;t have done it without their expert help!”</blockquote>
            <div className="testimonial-author"><div className="testimonial-avatar">AF</div><div><strong itemProp="author">Abena Frimpong</strong><span>Chevening Scholar, LSE London</span></div></div>
          </article>
          <article className="testimonial-card" itemScope itemType="https://schema.org/Review">
            <div className="testimonial-stars">5 Stars</div>
            <blockquote itemProp="reviewBody">“Dellics handled everything &#8212; from my application to booking my flight and finding accommodation in Sydney. Truly an all-in-one service. I&#39;m forever grateful!”</blockquote>
            <div className="testimonial-author"><div className="testimonial-avatar">KA</div><div><strong itemProp="author">Kofi Asante</strong><span>University of Sydney, Australia</span></div></div>
          </article>
          <article className="testimonial-card" itemScope itemType="https://schema.org/Review">
            <div className="testimonial-stars">5 Stars</div>
            <blockquote itemProp="reviewBody">“Very professional team! Their online counselling sessions via Zoom were so convenient. My USA F-1 visa was approved on the first try. Highly recommend Dellics!”</blockquote>
            <div className="testimonial-author"><div className="testimonial-avatar">EA</div><div><strong itemProp="author">Efua Acheampong</strong><span>Boston University, USA</span></div></div>
          </article>
        </div>
      </div>
      <div className="slider-controls">
        <button className="slider-btn" id="slider-prev" aria-label="Previous">&#8592;</button>
        <div className="slider-dots" id="slider-dots"></div>
        <button className="slider-btn" id="slider-next" aria-label="Next">&#8594;</button>
      </div>
    </div>
  </section>

  {/*  INTERACTIVE FAQ SECTION  */}
  <section id="faqs" className="faq-section">
    <div className="container">
      <div className="section-header">
        <span className="section-tag">Got Questions?</span>
        <h2 className="section-title">Frequently Asked <span className="highlight">Questions</span></h2>
        <p className="section-subtitle">Everything you need to know about our admissions guidance, test coordination, and visa process</p>
      </div>
      <div className="faq-container">
        <div className="faq-item active">
          <button className="faq-question">
            <span>Do I need IELTS or TOEFL to study abroad?</span>
            <span className="faq-icon">+</span>
          </button>
          <div className="faq-answer">
            Not necessarily for all universities. Many universities in the UK, Canada, and the USA accept a grade of C6 or better in WASSCE English as proof of English proficiency. However, competitive programs, medical degrees, and specific universities require official scores from IELTS, TOEFL, PTE, or Duolingo. Dellics assesses your individual profile and coordinates test prep if required.
          </div>
        </div>

        <div className="faq-item">
          <button className="faq-question">
            <span>Does Dellics guarantee admission or a student visa?</span>
            <span className="faq-icon">+</span>
          </button>
          <div className="faq-answer">
            <strong>No ethical consultancy can legally guarantee admission or visa issuance</strong>, as these decisions rest solely with university academic boards and foreign immigration authorities (UKVI, IRCC, US Embassies). What Dellics guarantees is rigorous compliance, thorough vetting of your financial documents, personalized statement of purpose reviews, and tailored interview coaching to give your application the highest possible probability of success.
          </div>
        </div>

        <div className="faq-item">
          <button className="faq-question">
            <span>Which countries and study destinations do you support?</span>
            <span className="faq-icon">+</span>
          </button>
          <div className="faq-answer">
            We specialize in admissions across the United Kingdom, Canada, the United States, Australia, and European destinations including Germany, France, and the Netherlands. We also assist international students looking to study in accredited universities within Ghana.
          </div>
        </div>

        <div className="faq-item">
          <button className="faq-question">
            <span>How much does Dellics' consultancy service cost?</span>
            <span className="faq-icon">+</span>
          </button>
          <div className="faq-answer">
            Our initial consultation and profile evaluation are 100% free of charge. For our comprehensive service packages (university application management, SOP editing, visa compliance coaching, and pre-departure briefings), we charge transparent, agreed-upon service fees with zero hidden costs.
          </div>
        </div>

        <div className="faq-item">
          <button className="faq-question">
            <span>What documents do I need to start my application?</span>
            <span className="faq-icon">+</span>
          </button>
          <div className="faq-answer">
            To begin, you will need: your valid International Passport bio-page, your WASSCE certificate (or high school result slip + scratch card), academic transcripts from your school or university, and your CV. For postgraduate applicants, degree certificates and academic recommendation letters are also required. You can upload these directly to your Dellics Document Locker.
          </div>
        </div>

        <div className="faq-item">
          <button className="faq-question">
            <span>Can Dellics help me register and prepare for IELTS or SAT?</span>
            <span className="faq-icon">+</span>
          </button>
          <div className="faq-answer">
            Yes. Dellics acts as an official coordination consultancy. We partner with accredited tutorial centers and British Council / ETS test centers across Ghana to schedule your intensive classes, provide diagnostic mock materials, and secure your test dates without stress.
          </div>
        </div>

        <div className="faq-item">
          <button className="faq-question">
            <span>How does the integration with Dellics Travels help me?</span>
            <span className="faq-icon">+</span>
          </button>
          <div className="faq-answer">
            Because Dellics Education is part of Dellics Travels, our students enjoy seamless end-to-end travel logistics once their visa is approved. This includes student-discounted airfares with up to 46kg (2 x 23kg) baggage allowance, pre-arranged student dormitories and accommodation, safe airport pickup, and pre-activated international eSIM cards so your family can reach you the moment you land.
          </div>
        </div>

        <div className="faq-item">
          <button className="faq-question">
            <span>How does the Student Application Portal work?</span>
            <span className="faq-icon">+</span>
          </button>
          <div className="faq-answer">
            Our student portal replaces confusing WhatsApp back-and-forth communication. When you sign up, you get an interactive 8-step application wizard, a secure document locker, an 8-stage visual milestone tracker, direct messaging with your assigned advisor, and a standardized test coordination module. You will receive notifications the moment a milestone progresses.
          </div>
        </div>
      </div>
    </div>
  </section>


  {/*  CTA BANNER  */}
  <section className="cta-banner">
    <div className="container cta-banner-inner">
      <div className="cta-banner-text"><h2>Ready to Study Abroad?</h2><p>Book your free consultation today and take the first step toward your global future.</p></div>
      <div className="cta-banner-actions">
        <Link href="/contact" className="btn btn-white btn-lg">Book Free Consultation</Link>
        <a href="tel:+233552054174" className="btn btn-outline-white btn-lg"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> Call Us Now</a>
      </div>
    </div>
  </section>

  {/*  CONTACT  */}
  <section id="contact" className="contact-section">
    <div className="container">
      <div className="section-header">
        <span className="section-tag">Get In Touch</span>
        <h2 className="section-title">Book Your <span className="highlight">Free</span> Consultation</h2>
        <p className="section-subtitle">Fill out the form below and our expert counsellors will contact you within 24 hours</p>
      </div>
      <div className="contact-inner">
        <div className="contact-form-wrap">
          <form className="contact-form" id="contact-form" noValidate>
            <div className="form-row">
              <div className="form-group"><label htmlFor="firstName">First Name *</label><input type="text" id="firstName" name="firstName" placeholder="Your first name" required /><span className="form-error"></span></div>
              <div className="form-group"><label htmlFor="lastName">Last Name *</label><input type="text" id="lastName" name="lastName" placeholder="Your last name" required /><span className="form-error"></span></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label htmlFor="email">Email Address *</label><input type="email" id="email" name="email" placeholder="your@email.com" required /><span className="form-error"></span></div>
              <div className="form-group"><label htmlFor="phone">Phone Number *</label><input type="tel" id="phone" name="phone" placeholder="+233 XX XXX XXXX" required /><span className="form-error"></span></div>
            </div>
            <div className="form-group">
              <label htmlFor="destination">Preferred Study Destination</label>
              <select id="destination" name="destination"><option value="">Select a destination…</option><option value="uk">United Kingdom</option><option value="canada">Canada</option><option value="usa">United States</option><option value="australia">Australia</option><option value="europe">Europe</option><option value="newzealand">New Zealand</option><option value="other">Other</option></select>
            </div>
            <div className="form-group">
              <label htmlFor="service">Service Required</label>
              <select id="service" name="service"><option value="">Select a service…</option><option value="admissions">University Admissions</option><option value="visa">Visa Assistance</option><option value="scholarship">Scholarship Guidance</option><option value="travel">Travel &amp; Tour</option><option value="online">Online Counselling</option><option value="test">Test Prep (IELTS/TOEFL)</option><option value="all">All Services</option></select>
            </div>
            <div className="form-group"><label htmlFor="message">Tell Us About Your Goals</label><textarea id="message" name="message" rows={4} placeholder="Share your study abroad goals, current qualification level, and any specific questions…"></textarea></div>
            <button type="submit" className="btn btn-primary btn-full" id="form-submit-btn">
              <span className="btn-text">Submit &amp; Book Consultation</span>
              <span className="btn-loading" style={{ display: "none" }}>Sending…</span>
            </button>
            <div className="form-success" id="form-success" style={{ display: "none" }}>&#10003; Thank you! Your consultation request has been received. We will contact you within 24 hours.</div>
          </form>
        </div>
        <div className="contact-info">
          <div className="contact-info-card">
            <Image src="/logo.jpg" width={100} height={100}  alt="Dellics Education Consult" className="contact-logo" />
            <p className="contact-tagline">“Guiding Futures. Building Success.”</p>
          </div>
          <div className="contact-details">
            <div className="contact-item"><div className="contact-item-icon"><svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div><div><strong>Visit Our Office</strong><p>Tema Community 25, Devtraco Estate<br />Greater Accra, Ghana<br /><a href="https://maps.google.com/?q=Tema+Community+25+Devtraco+Estate+Ghana" target="_blank" rel="noopener noreferrer">View on Google Maps</a></p></div></div>
            <div className="contact-item"><div className="contact-item-icon"><svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div><div><strong>Call / WhatsApp</strong><p><a href="tel:+233552054174">+233 55 205 4174</a></p></div></div>
            <div className="contact-item"><div className="contact-item-icon"><svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div><div><strong>Email Us</strong><p><a href="mailto:info@dellicstravels.com">info@dellicstravels.com</a></p></div></div>
            <div className="contact-item"><div className="contact-item-icon"><svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div><div><strong>Office Hours</strong><p>Mon - Fri: 8:00 AM - 6:00 PM<br />Sat: 9:00 AM - 4:00 PM</p></div></div>
          </div>
          <a href="https://wa.me/233552054174?text=Hello%20Dellics!" className="whatsapp-cta" target="_blank" rel="noopener noreferrer">
            <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488 11.815 11.815 0 0012.05 0z"/></svg>
            Chat with Us on WhatsApp
          </a>
      </div>
    </div>
  </div>
  </section>

    </main>
  );
}
