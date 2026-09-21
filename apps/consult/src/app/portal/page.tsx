import Link from "next/link";
import Image from "next/image";

export default function PortalPage() {
  return (
    <main>
      

    {/*  TOPBAR  */}
    <header className="portal-topbar">
      <div className="portal-topbar-title">
        <button className="portal-mobile-toggle" id="sidebar-open-btn" aria-label="Open navigation">&#9776;</button>
        <h1 className="portal-page-heading" id="portal-page-title">Dashboard Overview</h1>
      </div>

      <div className="portal-topbar-actions">
        {/*  Direct Travel Ecosystem Switcher  */}
        <a href="https://dellicstravels.com" target="_blank" rel="noopener noreferrer" className="portal-ecosystem-btn" title="Explore Dellics Travels Flights, Hotels, Tours & eSIM">
          <span>✈️ Dellics Travels</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
        </a>

        {/*  Admin Backoffice Switcher for Pair Testing  */}
        <a href="/admin" className="portal-btn portal-btn-outline portal-btn-sm" style={{ fontSize: "0.78rem" }}>
          Consultant View ➔
        </a>

        {/*  Notifications Bell  */}
        <button className="portal-notif-btn" id="notif-toggle-btn" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span className="portal-notif-badge" id="notif-badge-count">3</span>
        </button>
      </div>
    </header>

    {/*  CONTENT BODY  */}
    <div className="portal-content">

      {/*  ==============================================================  */}
      {/*  TAB 1: DASHBOARD OVERVIEW  */}
      {/*  ==============================================================  */}
      <section id="tab-overview" className="portal-tab-content">
        {/*  Welcome Hero Banner  */}
        <div className="portal-hero-banner">
          <div>
            <h2 className="portal-hero-greeting" id="hero-greeting">Welcome, John 👋</h2>
            <div className="portal-hero-subtitle">
              <span>Application: <strong id="hero-app-target">UK Undergraduate (BSc Computer Science)</strong></span>
              <span className="portal-pill-badge active-status" id="hero-app-status">● Status: Offer Letter Stage</span>
              <span className="portal-pill-badge">Intake: Sept 2025</span>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
              <button className="portal-btn portal-btn-primary portal-btn-sm" onclick="switchTab('application')">Review Application Dossier</button>
              <button className="portal-btn portal-btn-secondary portal-btn-sm" onclick="switchTab('tests')">Manage Test Requirements</button>
            </div>
          </div>
          <div style={{ textAlign: "right", zIndex: "2" }} className="hide-mobile">
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>Assigned Consultant:</div>
            <div style={{ fontWeight: "700", fontSize: "1.05rem" }} id="hero-consultant-name">Kwame Asante</div>
            <div style={{ fontSize: "0.8rem", color: "var(--portal-orange)", fontWeight: "600" }}>Senior Admissions Specialist</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>📞 +233 55 205 4174</div>
          </div>
        </div>

        {/*  COMPLETE YOUR PROFILE ONBOARDING WIDGET  */}
        <div className="portal-card onboarding-card" id="onboarding-profile-card">
          <div className="onboarding-card-header">
            <div>
              <div className="onboarding-badge">Account Setup</div>
              <h3 className="portal-card-title" style={{ fontSize: "1.35rem", marginTop: "4px" }}>
                Complete Your Profile
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "var(--portal-text-muted)" }}>
                Welcome to Dellics, <strong id="onboarding-name-display">Glenn</strong> 👋 Let's get your profile ready.
              </p>
            </div>
            <div className="onboarding-progress-wrap">
              <div className="onboarding-progress-label">
                <span>Profile completion</span>
                <strong id="onboarding-percent-text">25%</strong>
              </div>
              <div className="onboarding-progress-bar-bg">
                <div className="onboarding-progress-bar-fill" id="onboarding-progress-fill" style={{ width: "25%" }}></div>
              </div>
            </div>
          </div>

          {/*  Step Tabs  */}
          <div className="onboarding-step-tabs" id="onboarding-tabs-bar">
            <button type="button" className="onboarding-tab-btn active" data-step="1" onclick="goToOnboardingStep(1)">
              <span>1</span> Personal Information
            </button>
            <button type="button" className="onboarding-tab-btn" data-step="2" onclick="goToOnboardingStep(2)">
              <span>2</span> Academic Background
            </button>
            <button type="button" className="onboarding-tab-btn" data-step="3" onclick="goToOnboardingStep(3)">
              <span>3</span> Study Preferences
            </button>
            <button type="button" className="onboarding-tab-btn" data-step="4" onclick="goToOnboardingStep(4)">
              <span>4</span> Tests
            </button>
            <button type="button" className="onboarding-tab-btn" data-step="5" onclick="goToOnboardingStep(5)">
              <span>5</span> Documents
            </button>
          </div>

          {/*  Multi-Step Form Containers  */}
          <form id="onboarding-form" onsubmit="return false;" noValidate>
            {/*  STEP 1: Personal Information  */}
            <div className="onboarding-step-content active" id="onboarding-step-1">
              <div className="portal-form-grid">
                <div className="wizard-form-group">
                  <label>Date of Birth *</label>
                  <input type="date" id="ob-dob" />
                </div>
                <div className="wizard-form-group">
                  <label>Nationality *</label>
                  <input type="text" id="ob-nationality" placeholder="e.g. Ghanaian" value="Ghanaian" />
                </div>
                <div className="wizard-form-group">
                  <label>Country of Residence *</label>
                  <input type="text" id="ob-residence" placeholder="e.g. Ghana" value="Ghana" />
                </div>
                <div className="wizard-form-group">
                  <label>Phone Number *</label>
                  <input type="tel" id="ob-phone" placeholder="+233 ..." />
                </div>
              </div>
              <div className="onboarding-actions">
                <div></div>
                <button type="button" className="portal-btn portal-btn-primary" onclick="goToOnboardingStep(2)">
                  Save &amp; Continue: Academic Background ➔
                </button>
              </div>
            </div>

            {/*  STEP 2: Academic Background  */}
            <div className="onboarding-step-content" id="onboarding-step-2">
              <div className="portal-form-grid">
                <div className="wizard-form-group">
                  <label>Highest Qualification *</label>
                  <select id="ob-qualification">
                    <option value="">Select qualification</option>
                    <option value="WASSCE">WASSCE / Senior High School</option>
                    <option value="Bachelor's Degree">Bachelor's Degree (Undergraduate)</option>
                    <option value="HND / Higher National Diploma">HND / Higher National Diploma</option>
                    <option value="Master's Degree">Master's Degree (Postgraduate)</option>
                    <option value="A-Levels / Cambridge / IB">A-Levels / Cambridge / IB</option>
                    <option value="Other">Other Certificate</option>
                  </select>
                </div>
                <div className="wizard-form-group">
                  <label>School / Institution Attended *</label>
                  <input type="text" id="ob-school" placeholder="e.g. PRESEC, Achimota, University of Ghana, KNUST" />
                </div>
                <div className="wizard-form-group">
                  <label>Course / Subject Studied *</label>
                  <input type="text" id="ob-course" placeholder="e.g. General Science, General Arts, Business, CS" />
                </div>
                <div className="wizard-form-group">
                  <label>Graduation Year *</label>
                  <input type="number" id="ob-grad-year" placeholder="e.g. 2024" min="1990" max="2030" />
                </div>
                <div className="wizard-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label>Grades / Results Summary *</label>
                  <input type="text" id="ob-grades" placeholder="e.g. 6 A1s, 2 B2s in WASSCE / 3.5 GPA Second Class Upper" />
                </div>
              </div>
              <div className="onboarding-actions">
                <button type="button" className="portal-btn portal-btn-outline" onclick="goToOnboardingStep(1)">
                  ← Previous
                </button>
                <button type="button" className="portal-btn portal-btn-primary" onclick="goToOnboardingStep(3)">
                  Save &amp; Continue: Study Preferences ➔
                </button>
              </div>
            </div>

            {/*  STEP 3: Study Preferences  */}
            <div className="onboarding-step-content" id="onboarding-step-3">
              <div className="portal-form-grid">
                <div className="wizard-form-group">
                  <label>Country You Want to Study In *</label>
                  <select id="ob-dest-country">
                    <option value="United Kingdom">United Kingdom (UK)</option>
                    <option value="Canada">Canada</option>
                    <option value="United States">United States (USA)</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany / Europe</option>
                    <option value="Ghana">Study in Ghana</option>
                    <option value="Other">Other Global Destination</option>
                  </select>
                </div>
                <div className="wizard-form-group">
                  <label>Course You're Interested In *</label>
                  <input type="text" id="ob-pref-course" placeholder="e.g. BSc Computer Science, MSc Data Science, MBA" />
                </div>
                <div className="wizard-form-group">
                  <label>Degree Level *</label>
                  <select id="ob-pref-level">
                    <option value="Undergraduate">Undergraduate (Bachelor's Degree)</option>
                    <option value="Postgraduate">Postgraduate (Master's / PGD)</option>
                    <option value="Doctorate">Doctorate (PhD)</option>
                    <option value="Foundation">Foundation / Pathway</option>
                  </select>
                </div>
                <div className="wizard-form-group">
                  <label>Preferred Intake *</label>
                  <select id="ob-pref-intake">
                    <option value="September 2025">September 2025 (Major Fall)</option>
                    <option value="January 2026">January 2026 (Winter / Spring)</option>
                    <option value="May 2026">May 2026 (Summer)</option>
                  </select>
                </div>
                <div className="wizard-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label>Approximate Budget (Tuition + Living) *</label>
                  <select id="ob-pref-budget">
                    <option value="Under £15,000 / year">Under £15,000 / $20,000 per year</option>
                    <option value="£15,000 - £25,000 / year">£15,000 - £25,000 / $20,000 - $32,000 per year</option>
                    <option value="£25,000+ / year">£25,000+ / $35,000+ per year</option>
                    <option value="Full Scholarship Dependent">Full Scholarship Dependent</option>
                  </select>
                </div>
              </div>
              <div className="onboarding-actions">
                <button type="button" className="portal-btn portal-btn-outline" onclick="goToOnboardingStep(2)">
                  ← Previous
                </button>
                <button type="button" className="portal-btn portal-btn-primary" onclick="goToOnboardingStep(4)">
                  Save &amp; Continue: Tests Needed ➔
                </button>
              </div>
            </div>

            {/*  STEP 4: Tests  */}
            <div className="onboarding-step-content" id="onboarding-step-4">
              <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--portal-navy)", marginBottom: "8px" }}>
                Which tests do you need help with?
              </p>
              <p style={{ fontSize: "0.84rem", color: "var(--portal-text-muted)", marginBottom: "16px" }}>
                Select any exam you plan to take or need diagnostic prep / center registration for:
              </p>
              <div className="onboarding-tests-grid">
                <label className="onboarding-test-label">
                  <input type="checkbox" name="ob-test" value="IELTS" />
                  <span>IELTS</span>
                </label>
                <label className="onboarding-test-label">
                  <input type="checkbox" name="ob-test" value="TOEFL" />
                  <span>TOEFL</span>
                </label>
                <label className="onboarding-test-label">
                  <input type="checkbox" name="ob-test" value="PTE" />
                  <span>PTE</span>
                </label>
                <label className="onboarding-test-label">
                  <input type="checkbox" name="ob-test" value="SAT" />
                  <span>SAT</span>
                </label>
                <label className="onboarding-test-label">
                  <input type="checkbox" name="ob-test" value="GRE" />
                  <span>GRE</span>
                </label>
                <label className="onboarding-test-label">
                  <input type="checkbox" name="ob-test" value="GMAT" />
                  <span>GMAT</span>
                </label>
                <label className="onboarding-test-label">
                  <input type="checkbox" name="ob-test" value="ACT" />
                  <span>ACT</span>
                </label>
                <label className="onboarding-test-label">
                  <input type="checkbox" name="ob-test" value="I'm not sure" />
                  <span>I'm not sure</span>
                </label>
              </div>
              <div className="test-coord-note">
                🎯 <strong>Test-Centre Coordination System:</strong> Dellics partners with accredited testing centers to assist Ghanaian and African students with diagnostic practice, registration dates, and test preparation.
              </div>
              <div className="onboarding-actions">
                <button type="button" className="portal-btn portal-btn-outline" onclick="goToOnboardingStep(3)">
                  ← Previous
                </button>
                <button type="button" className="portal-btn portal-btn-primary" onclick="goToOnboardingStep(5)">
                  Save &amp; Continue: Documents ➔
                </button>
              </div>
            </div>

            {/*  STEP 5: Documents  */}
            <div className="onboarding-step-content" id="onboarding-step-5">
              <p style={{ fontSize: "0.95rem", color: "var(--portal-text-primary)", marginBottom: "8px" }}>
                Upload your primary documents now, or upload them later via the <strong>My Documents</strong> locker:
              </p>
              <div className="doc-upload-preview-grid">
                <div className="doc-quick-drop">
                  <div style={{ fontSize: "2rem", marginBottom: "6px" }}>🛂</div>
                  <strong>International Passport Bio-data</strong>
                  <p style={{ fontSize: "0.75rem", color: "var(--portal-text-muted)" }}>PDF or JPEG format</p>
                  <input type="file" id="ob-doc-passport" style={{ marginTop: "10px", fontSize: "0.8rem" }} />
                </div>
                <div className="doc-quick-drop">
                  <div style={{ fontSize: "2rem", marginBottom: "6px" }}>📜</div>
                  <strong>WASSCE Slip / Degree Transcript</strong>
                  <p style={{ fontSize: "0.75rem", color: "var(--portal-text-muted)" }}>Official statement of results</p>
                  <input type="file" id="ob-doc-transcript" style={{ marginTop: "10px", fontSize: "0.8rem" }} />
                </div>
              </div>
              <div className="onboarding-actions">
                <button type="button" className="portal-btn portal-btn-outline" onclick="goToOnboardingStep(4)">
                  ← Previous
                </button>
                <button type="button" className="portal-btn portal-btn-primary" id="btn-finish-onboarding">
                  Complete Profile (100%) &amp; Unlock Portal ✓
                </button>
              </div>
            </div>
          </form>
        </div>

        {/*  8-Step Application Tracker  */}
        <div className="portal-tracker-card">
          <div className="portal-tracker-header">
            <div>
              <h3 className="portal-tracker-title">Application Milestone Tracker</h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "var(--portal-text-muted)" }}>Real-time status of your university admissions journey</p>
            </div>
            <button className="portal-btn portal-btn-outline portal-btn-sm" onclick="switchTab('application')">Full Details ➔</button>
          </div>
          <div className="portal-timeline-steps" id="overview-timeline-steps">
            {/*  Dynamically populated from DellicsStore  */}
          </div>
        </div>

        {/*  Quick Stats  */}
        <div className="portal-stats-grid">
          <div className="portal-stat-card" onclick="switchTab('documents')">
            <div className="portal-stat-icon green">📁</div>
            <div>
              <div className="portal-stat-value" id="stat-docs-val">5 / 6</div>
              <div className="portal-stat-label">Verified Documents</div>
            </div>
          </div>
          <div className="portal-stat-card" onclick="switchTab('tests')">
            <div className="portal-stat-icon orange">🎯</div>
            <div>
              <div className="portal-stat-value" id="stat-tests-val">IELTS</div>
              <div className="portal-stat-label">Test Coordination: Active</div>
            </div>
          </div>
          <div className="portal-stat-card" onclick="switchTab('universities')">
            <div className="portal-stat-icon blue">🏛️</div>
            <div>
              <div className="portal-stat-value" id="stat-unis-val">3</div>
              <div className="portal-stat-label">Universities Applied</div>
            </div>
          </div>
          <div className="portal-stat-card" onclick="switchTab('visa')">
            <div className="portal-stat-icon yellow">🛂</div>
            <div>
              <div className="portal-stat-value" id="stat-visa-val">Stage 2</div>
              <div className="portal-stat-label">Financial Compliance Review</div>
            </div>
          </div>
        </div>

        {/*  2-Column Split: Active Tests & Travel Bridge  */}
        <div className="portal-grid-2col">
          {/*  Active Test Coordination Box  */}
          <div className="portal-card">
            <div className="portal-card-header">
              <h3 className="portal-card-title">
                <span>🎯</span> Active Test Status
              </h3>
              <button className="portal-btn portal-btn-outline portal-btn-sm" onclick="switchTab('tests')">Request New Test</button>
            </div>
            <div id="overview-test-summary">
              {/*  Dynamically populated  */}
            </div>
          </div>

          {/*  Dellics Travels Integration Spotlight  */}
          <div className="portal-travel-box">
            <div className="portal-travel-header">
              <div className="portal-travel-icon">✈️</div>
              <div>
                <h3 className="portal-travel-title">Ready for Your Journey?</h3>
                <div style={{ fontSize: "0.8rem", color: "var(--portal-text-muted)" }}>Exclusive Perks by Dellics Travels</div>
              </div>
            </div>
            <p style={{ fontSize: "0.84rem", color: "var(--portal-text-secondary)", margin: "0 0 12px" }}>
              Once your offer is confirmed, unlock discounted student flight baggage allowances, vetted student housing, and free UK/US pre-departure eSIM cards.
            </p>
            <div className="portal-perk-card" style={{ marginBottom: "12px" }}>
              <div className="portal-perk-title">Student Flight Fares (46kg Baggage)</div>
              <div className="portal-perk-desc">Save up to 10% on British Airways, Emirates, and Qatar Airways via Dellics Travels.</div>
            </div>
            <button className="portal-btn portal-btn-primary portal-btn-sm" style={{ width: "100%" }} onclick="switchTab('travel')">Explore Student Travel Packages</button>
          </div>
        </div>
      </section>

      {/*  ==============================================================  */}
      {/*  TAB 2: MY APPLICATION & 8-STEP WIZARD  */}
      {/*  ==============================================================  */}
      <section id="tab-application" className="portal-tab-content" style={{ display: "none" }}>
        <div className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Study Abroad Application Dossier</h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "var(--portal-text-muted)" }}>
                Complete all 8 sections to ensure your application meets international admission standards.
              </p>
            </div>
            <span className="portal-pill-badge active-status" id="wizard-status-pill">Application Created</span>
          </div>

          {/*  Wizard Navigation Bar  */}
          <div className="wizard-stepper-nav" id="wizard-stepper-nav">
            <div className="wizard-nav-step active" data-step="1">1. Personal Info</div>
            <div className="wizard-nav-step" data-step="2">2. Academic Background</div>
            <div className="wizard-nav-step" data-step="3">3. Destination</div>
            <div className="wizard-nav-step" data-step="4">4. Intended Course</div>
            <div className="wizard-nav-step" data-step="5">5. Budget</div>
            <div className="wizard-nav-step" data-step="6">6. Preferred Intake</div>
            <div className="wizard-nav-step" data-step="7">7. Test Requirements</div>
            <div className="wizard-nav-step" data-step="8">8. Review &amp; Submit</div>
          </div>

          {/*  Step 1: Personal Info  */}
          <div className="wizard-form-panel active" id="step-panel-1">
            <h4 style={{ fontFamily: "'Outfit'", color: "var(--portal-navy)", marginBottom: "16px" }}>1. Personal Information</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="wizard-form-group">
                <label>First Name *</label>
                <input type="text" id="wiz-first-name" value="John" />
              </div>
              <div className="wizard-form-group">
                <label>Last Name *</label>
                <input type="text" id="wiz-last-name" value="Mensah" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="wizard-form-group">
                <label>Email Address *</label>
                <input type="email" id="wiz-email" value="john.doe@example.com" />
              </div>
              <div className="wizard-form-group">
                <label>Phone Number (WhatsApp) *</label>
                <input type="tel" id="wiz-phone" value="+233 24 412 3456" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="wizard-form-group">
                <label>City &amp; Country of Residence *</label>
                <input type="text" id="wiz-city" value="Accra, Ghana" />
              </div>
              <div className="wizard-form-group">
                <label>International Passport Number</label>
                <input type="text" id="wiz-passport" value="G1928374" placeholder="e.g. G1234567" />
              </div>
            </div>
            <div className="wizard-actions">
              <div></div>
              <button className="portal-btn portal-btn-primary" onclick="goToStep(2)">Continue to Academic Background ➔</button>
            </div>
          </div>

          {/*  Step 2: Academic Background  */}
          <div className="wizard-form-panel" id="step-panel-2">
            <h4 style={{ fontFamily: "'Outfit'", color: "var(--portal-navy)", marginBottom: "16px" }}>2. Academic Background</h4>
            <div className="wizard-form-group">
              <label>Highest Qualification Completed *</label>
              <select id="wiz-qualification">
                <option value="WASSCE" selected>WASSCE / Senior High School</option>
                <option value="Bachelor">Bachelor's Degree</option>
                <option value="HND">Higher National Diploma (HND)</option>
                <option value="A-Levels">GCE A-Levels / Cambridge</option>
                <option value="Master">Master's Degree</option>
              </select>
            </div>
            <div className="wizard-form-group">
              <label>School / Institution Attended *</label>
              <input type="text" id="wiz-school" value="Presbyterian Boys’ Secondary School (PRESEC)" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="wizard-form-group">
                <label>Year of Completion *</label>
                <input type="number" id="wiz-year" value="2024" />
              </div>
              <div className="wizard-form-group">
                <label>Grades / GPA / Classification *</label>
                <input type="text" id="wiz-grades" value="6 A1s, 2 B2s (Core Maths A1, Elective Maths A1)" />
              </div>
            </div>
            <div className="wizard-actions">
              <button className="portal-btn portal-btn-outline" onclick="goToStep(1)">← Back</button>
              <button className="portal-btn portal-btn-primary" onclick="goToStep(3)">Continue to Destination ➔</button>
            </div>
          </div>

          {/*  Step 3: Destination  */}
          <div className="wizard-form-panel" id="step-panel-3">
            <h4 style={{ fontFamily: "'Outfit'", color: "var(--portal-navy)", marginBottom: "16px" }}>3. Preferred Study Destination</h4>
            <div className="wizard-form-group">
              <label>Primary Destination Country *</label>
              <select id="wiz-destination">
                <option value="United Kingdom" selected>🇬🇧 United Kingdom</option>
                <option value="Canada">🇨🇦 Canada</option>
                <option value="United States">🇺🇸 United States</option>
                <option value="Australia">🇦🇺 Australia</option>
                <option value="Germany">🇩🇪 Germany / Europe</option>
                <option value="Ghana">🇬🇭 Ghana (Local Admissions)</option>
              </select>
            </div>
            <div className="wizard-form-group">
              <label>Degree Level Sought *</label>
              <select id="wiz-level">
                <option value="Undergraduate" selected>Undergraduate (Bachelor's Degree - 3-4 Years)</option>
                <option value="Postgraduate">Postgraduate (Master's / MBA - 1-2 Years)</option>
                <option value="Foundation">International Foundation / Pathway Program</option>
                <option value="PhD">Doctorate / PhD</option>
              </select>
            </div>
            <div className="wizard-actions">
              <button className="portal-btn portal-btn-outline" onclick="goToStep(2)">← Back</button>
              <button className="portal-btn portal-btn-primary" onclick="goToStep(4)">Continue to Intended Course ➔</button>
            </div>
          </div>

          {/*  Step 4: Intended Course  */}
          <div className="wizard-form-panel" id="step-panel-4">
            <h4 style={{ fontFamily: "'Outfit'", color: "var(--portal-navy)", marginBottom: "16px" }}>4. Intended Course / Field of Study</h4>
            <div className="wizard-form-group">
              <label>Program Name / Major *</label>
              <input type="text" id="wiz-course" value="BSc Computer Science" placeholder="e.g. BSc Computer Science, MBA, MSc Public Health" />
            </div>
            <div className="wizard-form-group">
              <label>Specialization or Career Goal</label>
              <textarea id="wiz-career-goal" rows="3" placeholder="Tell us why you chose this course and your post-study career goals...">Specializing in Artificial Intelligence and Software Architecture.</textarea>
            </div>
            <div className="wizard-actions">
              <button className="portal-btn portal-btn-outline" onclick="goToStep(3)">← Back</button>
              <button className="portal-btn portal-btn-primary" onclick="goToStep(5)">Continue to Budget ➔</button>
            </div>
          </div>

          {/*  Step 5: Budget  */}
          <div className="wizard-form-panel" id="step-panel-5">
            <h4 style={{ fontFamily: "'Outfit'", color: "var(--portal-navy)", marginBottom: "16px" }}>5. Annual Tuition &amp; Living Budget</h4>
            <div className="wizard-form-group">
              <label>Estimated Annual Budget (Tuition + Living Expenses) *</label>
              <select id="wiz-budget">
                <option value="Under £12,000 / CAD $20,000">Affordable / Scholarship Required (Under £12,000 / CAD $20,000)</option>
                <option value="£15,000 - £20,000 / year" selected>Moderate (£15,000 - £20,000 / CAD $25,000 - $35,000)</option>
                <option value="£20,000 - £30,000 / year">Upper Mid (£20,000 - £30,000 / CAD $35,000 - $50,000)</option>
                <option value="Above £30,000 / year">Premium (£30,000+ / US $45,000+)</option>
              </select>
            </div>
            <div className="wizard-form-group">
              <label>Primary Source of Funding *</label>
              <select id="wiz-funding">
                <option value="Self / Family Sponsor" selected>Family / Parent Sponsorship</option>
                <option value="Government Scholarship (Ghana Scholarship Secretariat / GETFund)">Government Scholarship (Ghana Scholarship Secretariat / GETFund)</option>
                <option value="Employer / Corporate Sponsor">Employer / Corporate Sponsorship</option>
                <option value="Partial Scholarship Needed">Self-funded + Partial University Scholarship</option>
              </select>
            </div>
            <div className="wizard-actions">
              <button className="portal-btn portal-btn-outline" onclick="goToStep(4)">← Back</button>
              <button className="portal-btn portal-btn-primary" onclick="goToStep(6)">Continue to Preferred Intake ➔</button>
            </div>
          </div>

          {/*  Step 6: Preferred Intake  */}
          <div className="wizard-form-panel" id="step-panel-6">
            <h4 style={{ fontFamily: "'Outfit'", color: "var(--portal-navy)", marginBottom: "16px" }}>6. Preferred Intake</h4>
            <div className="wizard-form-group">
              <label>Target Academic Intake *</label>
              <select id="wiz-intake">
                <option value="September 2025" selected>September / Fall 2025 (Main Intake)</option>
                <option value="January 2026">January / Spring 2026 (Winter Intake)</option>
                <option value="May 2026">May / Summer 2026</option>
                <option value="September 2026">September 2026</option>
              </select>
            </div>
            <div className="wizard-actions">
              <button className="portal-btn portal-btn-outline" onclick="goToStep(5)">← Back</button>
              <button className="portal-btn portal-btn-primary" onclick="goToStep(7)">Continue to Test Requirements ➔</button>
            </div>
          </div>

          {/*  Step 7: Test Requirements  */}
          <div className="wizard-form-panel" id="step-panel-7">
            <h4 style={{ fontFamily: "'Outfit'", color: "var(--portal-navy)", marginBottom: "16px" }}>7. Standardized Test Requirements</h4>
            <p style={{ fontSize: "0.84rem", color: "var(--portal-text-muted)", marginBottom: "16px" }}>
              Dellics assists you in identifying if your target university requires standardized test scores, and coordinates preparation and test centre bookings with accredited partners.
            </p>
            <div className="wizard-form-group">
              <label>Select tests you require or need assistance with:</label>
              <select id="wiz-test-required">
                <option value="ielts" selected>IELTS Academic (English Language Testing)</option>
                <option value="sat">SAT (Undergraduate Admissions)</option>
                <option value="toefl">TOEFL iBT (English Language Testing)</option>
                <option value="pte">PTE Academic</option>
                <option value="duolingo">Duolingo English Test</option>
                <option value="gre">GRE (Postgraduate Admissions)</option>
                <option value="gmat">GMAT (Business / MBA Admissions)</option>
                <option value="none">None / WAEC English Waiver</option>
              </select>
            </div>
            <div className="wizard-form-group">
              <label>Target Score Needed (Optional)</label>
              <input type="text" id="wiz-test-target" value="6.5+ Overall" placeholder="e.g. IELTS 6.5 or SAT 1350" />
            </div>
            <div className="wizard-actions">
              <button className="portal-btn portal-btn-outline" onclick="goToStep(6)">← Back</button>
              <button className="portal-btn portal-btn-primary" onclick="goToStep(8)">Review &amp; Update Application ➔</button>
            </div>
          </div>

          {/*  Step 8: Review & Submit  */}
          <div className="wizard-form-panel" id="step-panel-8">
            <h4 style={{ fontFamily: "'Outfit'", color: "var(--portal-navy)", marginBottom: "16px" }}>8. Summary &amp; Consultant Review</h4>
            <div style={{ background: "var(--portal-bg)", borderRadius: "var(--portal-radius)", padding: "20px", marginBottom: "20px" }}>
              <p style={{ margin: "0 0 8px" }}><strong>Student:</strong> <span id="rev-name">John Mensah</span></p>
              <p style={{ margin: "0 0 8px" }}><strong>Target:</strong> <span id="rev-dest">UK - BSc Computer Science</span> (<span id="rev-intake">September 2025</span>)</p>
              <p style={{ margin: "0 0 8px" }}><strong>Academic Profile:</strong> <span id="rev-acad">PRESEC (6 A1s, 2 B2s)</span></p>
              <p style={{ margin: "0 0 8px" }}><strong>Annual Budget:</strong> <span id="rev-budget">£15,000 - £20,000 / year</span></p>
              <p style={{ margin: "0" }}><strong>Test Requirement:</strong> <span id="rev-test">IELTS Academic (Assistance requested)</span></p>
            </div>
            <p style={{ fontSize: "0.84rem", color: "var(--portal-text-muted)" }}>
              Clicking save will update your active dossier in real-time. Your assigned consultant will immediately be notified.
            </p>
            <div className="wizard-actions">
              <button className="portal-btn portal-btn-outline" onclick="goToStep(7)">← Back</button>
              <button className="portal-btn portal-btn-primary" id="wizard-save-btn" onclick="saveFullApplication()">Save &amp; Submit Application Dossier ✓</button>
            </div>
          </div>
        </div>
      </section>

      {/*  ==============================================================  */}
      {/*  TAB 3: TESTS & EXAMS COORDINATION  */}
      {/*  ==============================================================  */}
      <section id="tab-tests" className="portal-tab-content" style={{ display: "none" }}>
        <div className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Tests &amp; Examinations Coordination Hub</h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "var(--portal-text-muted)" }}>
                Dellics coordinates your preparation with accredited test centers and tutors across Ghana.
              </p>
            </div>
            <button className="portal-btn portal-btn-primary portal-btn-sm" onclick="openTestRequestModal()">
              + Request Test Assistance
            </button>
          </div>

          {/*  Notice on Ethical Positioning  */}
          <div style={{ background: "#EFF6FF", borderLeft: "4px solid var(--portal-info)", padding: "12px 16px", borderRadius: "6px", fontSize: "0.82rem", color: "#1E40AF", marginBottom: "20px" }}>
            <strong>Advisory Note:</strong> Dellics Education Consult acts as an independent coordination and preparatory guidance service. We work closely with British Council, ETS, and accredited tutorial centers in Accra, Kumasi, and Takoradi to arrange your study materials, prep classes, and official test center dates.
          </div>

          {/*  Tests Grid  */}
          <div className="portal-tests-grid" id="tests-grid-container">
            {/*  Dynamically populated from DellicsStore  */}
          </div>
        </div>
      </section>

      {/*  ==============================================================  */}
      {/*  TAB 4: UNIVERSITY MATCHER  */}
      {/*  ==============================================================  */}
      <section id="tab-universities" className="portal-tab-content" style={{ display: "none" }}>
        <div className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">University Matching Engine</h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "var(--portal-text-muted)" }}>
                Explore top universities in the UK, Canada, USA, Australia, and Europe that match your qualifications.
              </p>
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--portal-text-muted)" }}>
              Saved Universities: <strong id="saved-unis-count">0</strong>
            </div>
          </div>

          {/*  Filters Bar  */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px", background: "var(--portal-bg)", padding: "16px", borderRadius: "var(--portal-radius)" }}>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--portal-text-muted)", display: "block", marginBottom: "4px" }}>Filter by Country</label>
              <select id="filter-uni-country" onchange="renderUniversityCatalog()" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--portal-border)", fontSize: "0.85rem" }}>
                <option value="all">All Countries</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="Canada">🇨🇦 Canada</option>
                <option value="USA">🇺🇸 United States</option>
                <option value="Australia">🇦🇺 Australia</option>
                <option value="Germany">🇩🇪 Germany</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--portal-text-muted)", display: "block", marginBottom: "4px" }}>Search Course / Major</label>
              <input type="text" id="filter-uni-search" oninput="renderUniversityCatalog()" placeholder="e.g. Computer Science, MBA..." style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--portal-border)", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>
          </div>

          {/*  University Cards Grid  */}
          <div className="portal-uni-grid" id="university-catalog-grid">
            {/*  Dynamically populated from DellicsStore  */}
          </div>
        </div>
      </section>

      {/*  ==============================================================  */}
      {/*  TAB 5: SECURE DOCUMENT LOCKER  */}
      {/*  ==============================================================  */}
      <section id="tab-documents" className="portal-tab-content" style={{ display: "none" }}>
        <div className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Secure Document Management Locker</h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "var(--portal-text-muted)" }}>
                Upload your certified documents once. Our compliance team verifies every item before submission to foreign admissions boards.
              </p>
            </div>
            <button className="portal-btn portal-btn-primary portal-btn-sm" onclick="openDocUploadModal()">
              + Upload New Document
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="portal-doc-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Status</th>
                  <th>Uploaded Date</th>
                  <th>Consultant Compliance Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="document-table-body">
                {/*  Dynamically populated from DellicsStore  */}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/*  ==============================================================  */}
      {/*  TAB 6: VISA GUIDANCE  */}
      {/*  ==============================================================  */}
      <section id="tab-visa" className="portal-tab-content" style={{ display: "none" }}>
        <div className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Visa Guidance &amp; Compliance Center</h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "var(--portal-text-muted)" }}>
                Navigating UKVI, IRCC, and US Embassy student visa requirements with meticulous document rigor.
              </p>
            </div>
            <span className="portal-pill-badge active-status" id="visa-status-pill">Active Guidance</span>
          </div>

          {/*  6-Stage Visa Tracker  */}
          <div style={{ background: "var(--portal-bg)", borderRadius: "var(--portal-radius)", padding: "24px", marginBottom: "24px" }}>
            <h4 style={{ fontFamily: "'Outfit'", color: "var(--portal-navy)", marginTop: "0", marginBottom: "16px" }}>
              Visa Stage Progression: <span id="visa-dest-title">UK Student Visa</span>
            </h4>
            <div id="visa-stages-container">
              {/*  Dynamically populated  */}
            </div>
          </div>

          {/*  Country Guidelines Card  */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <div style={{ border: "1px solid var(--portal-border)", borderRadius: "var(--portal-radius)", padding: "20px" }}>
              <h4 style={{ color: "var(--portal-navy)", margin: "0 0 8px" }}>🇬🇧 UKVI Financial Checklist</h4>
              <ul style={{ fontSize: "0.84rem", color: "var(--portal-text-secondary)", paddingLeft: "18px", lineHeight: "1.6" }}>
                <li>28-day holding period for total tuition balance + £9,207 living costs.</li>
                <li>Letter of sponsorship from parents with official birth certificate.</li>
                <li>TB Screening certificate from IOM Accra clinic.</li>
              </ul>
            </div>
            <div style={{ border: "1px solid var(--portal-border)", borderRadius: "var(--portal-radius)", padding: "20px" }}>
              <h4 style={{ color: "var(--portal-navy)", margin: "0 0 8px" }}>🇨🇦 Canada Study Permit Checklist</h4>
              <ul style={{ fontSize: "0.84rem", color: "var(--portal-text-secondary)", paddingLeft: "18px", lineHeight: "1.6" }}>
                <li>Provincial Attestation Letter (PAL) from university province.</li>
                <li>Guaranteed proof of CAD $20,635+ living allowance.</li>
                <li>Upfront medical exam with approved panel physician in Ghana.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/*  ==============================================================  */}
      {/*  TAB 7: DELLICS TRAVELS PERKS & ECOSYSTEM  */}
      {/*  ==============================================================  */}
      <section id="tab-travel" className="portal-tab-content" style={{ display: "none" }}>
        <div className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Dellics Travels Integrated Student Hub</h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "var(--portal-text-muted)" }}>
                Since Dellics Education is powered by Dellics Travels, our students enjoy privileged airfares, housing booking, and pre-departure perks.
              </p>
            </div>
            <span className="portal-pill-badge" style={{ background: "#10B981", color: "#fff" }}>Unified Account Active</span>
          </div>

          <div className="portal-travel-perks-grid">
            <div className="portal-perk-card">
              <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>✈️</div>
              <div className="portal-perk-title">Student Discount Flights</div>
              <div className="portal-perk-desc">Special discounted fares to London, Toronto, New York, Sydney with extra 23kg luggage allowance included.</div>
              <button className="portal-btn portal-btn-outline portal-btn-sm" style={{ marginTop: "auto" }} onclick="requestTravelService('flight')">Request Flight Quote</button>
            </div>

            <div className="portal-perk-card">
              <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>🏠</div>
              <div className="portal-perk-title">Verified Student Housing</div>
              <div className="portal-perk-desc">Direct partnerships with university halls of residence and private student accommodation (PBSAs) in UK &amp; Canada.</div>
              <button className="portal-btn portal-btn-outline portal-btn-sm" style={{ marginTop: "auto" }} onclick="requestTravelService('dorm')">Request Housing Options</button>
            </div>

            <div className="portal-perk-card">
              <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>🚐</div>
              <div className="portal-perk-title">Airport Pickup &amp; Transfer</div>
              <div className="portal-perk-desc">Safe pickup upon landing at Heathrow, Pearson Toronto, or JFK directly to your university residence.</div>
              <button className="portal-btn portal-btn-outline portal-btn-sm" style={{ marginTop: "auto" }} onclick="requestTravelService('transfer')">Book Airport Transfer</button>
            </div>

            <div className="portal-perk-card">
              <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>📶</div>
              <div className="portal-perk-title">International eSIM Cards</div>
              <div className="portal-perk-desc">Stay connected immediately upon landing with pre-activated UK, US, or European mobile data plans.</div>
              <button className="portal-btn portal-btn-outline portal-btn-sm" style={{ marginTop: "auto" }} onclick="requestTravelService('esim')">Request Free Student eSIM</button>
            </div>
          </div>
        </div>
      </section>

      {/*  ==============================================================  */}
      {/*  TAB 8: MESSAGES & CONSULTANT CHAT  */}
      {/*  ==============================================================  */}
      <section id="tab-messages" className="portal-tab-content" style={{ display: "none" }}>
        <div className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Consultant Advisory Channel</h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "var(--portal-text-muted)" }}>
                Direct communication with your assigned education specialist. No chasing on WhatsApp required.
              </p>
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--portal-success)", fontWeight: "600" }}>● Advisor Online</div>
          </div>

          {/*  Chat Conversation Container  */}
          <div id="chat-messages-container" style={{ maxHeight: "400px", overflowY: "auto", padding: "16px", background: "var(--portal-bg)", borderRadius: "var(--portal-radius)", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {/*  Messages dynamically populated  */}
          </div>

          {/*  Message Composer  */}
          <form id="chat-form" onsubmit="handleSendMessage(event)" style={{ display: "flex", gap: "10px" }}>
            <input type="text" id="chat-input" placeholder="Type a message or question for your consultant..." style={{ flex: "1", padding: "12px 16px", borderRadius: "var(--portal-radius-sm)", border: "1px solid var(--portal-border)", fontSize: "0.92rem" }} required />
            <button type="submit" className="portal-btn portal-btn-primary">Send Message</button>
          </form>
        </div>
      </section>

    </div>
  
    </main>
  );
}
