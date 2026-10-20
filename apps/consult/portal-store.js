/**
 * DELLICS EDUCATION CONSULT - PLATFORM REACTIVE STORE
 * Single Source of Truth for Student Portal & Consultant Admin Backoffice
 * Supports offline-first LocalStorage persistence with cross-tab live syncing.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'dellics_platform_state_v1';
  const AUTH_KEY = 'dellics_active_session_v1';

  // Seed Universities Catalog
  const DEFAULT_UNIVERSITIES = [
    {
      id: 'uni-1',
      name: 'University of Birmingham',
      country: 'UK',
      flag: '🇬🇧',
      city: 'Birmingham, England',
      ranking: 'QS World #84 | Russell Group',
      popularCourses: ['Computer Science', 'Artificial Intelligence', 'Business Management', 'Civil Engineering'],
      tuition: '£19,500 - £26,000 / year',
      intakes: ['September 2025', 'January 2026'],
      entryRequirement: 'WASSCE: Grade B2 or better in relevant subjects / A-Levels: AAB',
      englishRequirement: 'IELTS 6.5 (min 6.0 in each band) or WASSCE English C6+',
      scholarships: 'Up to £3,000 Global Masters & Undergraduate Excellence Award',
      logoText: 'UoB',
      accentColor: '#1A2D7A'
    },
    {
      id: 'uni-2',
      name: 'University of Manchester',
      country: 'UK',
      flag: '🇬🇧',
      city: 'Manchester, England',
      ranking: 'QS World #34 | Russell Group',
      popularCourses: ['BSc Computer Science', 'MSc Data Science', 'Biomedical Sciences', 'Law'],
      tuition: '£22,000 - £31,000 / year',
      intakes: ['September 2025'],
      entryRequirement: 'WASSCE + International Foundation Year / A-Levels: AAA',
      englishRequirement: 'IELTS 7.0 (min 6.5 in all bands)',
      scholarships: 'Manchester Global Future Scholarship (up to £5,000)',
      logoText: 'UoM',
      accentColor: '#6B21A8'
    },
    {
      id: 'uni-3',
      name: 'Coventry University',
      country: 'UK',
      flag: '🇬🇧',
      city: 'Coventry & London, England',
      ranking: 'Top 30 UK University (Guardian)',
      popularCourses: ['Software Engineering', 'Automotive Engineering', 'MBA International Business', 'Nursing'],
      tuition: '£16,800 - £20,500 / year',
      intakes: ['September 2025', 'January 2026', 'May 2026'],
      entryRequirement: 'WASSCE with min 5 credits (A1 - C6)',
      englishRequirement: 'WASSCE English C6 or higher accepted; or IELTS 6.0',
      scholarships: 'International Pathways Scholarship (£2,000)',
      logoText: 'CU',
      accentColor: '#0284C7'
    },
    {
      id: 'uni-4',
      name: 'University of Toronto',
      country: 'Canada',
      flag: '🇨🇦',
      city: 'Toronto, Ontario',
      ranking: 'QS World #21 | #1 in Canada',
      popularCourses: ['Computer Engineering', 'Economics', 'Life Sciences', 'Rotman Commerce'],
      tuition: 'CAD $42,000 - $60,000 / year',
      intakes: ['September 2025'],
      entryRequirement: 'WASSCE with Grade A1/B2 in Maths/Science or Higher Secondary Certificate',
      englishRequirement: 'IELTS 6.5 (no band < 6.0) or TOEFL iBT 100',
      scholarships: 'Lester B. Pearson International Scholarship (Full Ride)',
      logoText: 'UofT',
      accentColor: '#002A5C'
    },
    {
      id: 'uni-5',
      name: 'York University',
      country: 'Canada',
      flag: '🇨🇦',
      city: 'Toronto, Ontario',
      ranking: 'Top 350 Global | Top 15 in Canada',
      popularCourses: ['Information Technology', 'Lassonde Engineering', 'Schulich BBA', 'Public Policy'],
      tuition: 'CAD $31,000 - $38,000 / year',
      intakes: ['September 2025', 'January 2026'],
      entryRequirement: 'WASSCE average grade of B3/C4 across key subjects',
      englishRequirement: 'Duolingo 115+ or IELTS 6.5 or WASSCE B3 in English',
      scholarships: 'President’s International Scholarship of Excellence (CAD $180,000 total)',
      logoText: 'YU',
      accentColor: '#E11D48'
    },
    {
      id: 'uni-6',
      name: 'Arizona State University',
      country: 'USA',
      flag: '🇺🇸',
      city: 'Phoenix / Tempe, Arizona',
      ranking: '#1 in US for Innovation (U.S. News)',
      popularCourses: ['Computer Science', 'Cybersecurity', 'Aviation Flight Management', 'Supply Chain'],
      tuition: '$32,000 - $36,000 / year',
      intakes: ['Fall (August 2025)', 'Spring (January 2026)'],
      entryRequirement: 'GPA 3.0+ / WASSCE Grade B3 equivalent. SAT optional for admission',
      englishRequirement: 'Duolingo 105+ or IELTS 6.0 or TOEFL 80',
      scholarships: 'New American University Scholarship (Up to $14,500/year)',
      logoText: 'ASU',
      accentColor: '#8C1D40'
    },
    {
      id: 'uni-7',
      name: 'University of New South Wales (UNSW)',
      country: 'Australia',
      flag: '🇦🇺',
      city: 'Sydney, New South Wales',
      ranking: 'QS World #19 | Group of Eight',
      popularCourses: ['Master of IT', 'Civil Engineering', 'Mining Engineering', 'Biotechnology'],
      tuition: 'AUD $41,000 - $49,000 / year',
      intakes: ['Term 1 (Feb 2026)', 'Term 3 (Sept 2025)'],
      entryRequirement: 'Recognised Bachelor degree with 65%+ or A-Levels / WASSCE Foundation',
      englishRequirement: 'IELTS 6.5 overall (min 6.0 in each subtest) or PTE Academic 64',
      scholarships: 'International Scientia Coursework Scholarship (Full tuition fee waiver)',
      logoText: 'UNSW',
      accentColor: '#D97706'
    },
    {
      id: 'uni-8',
      name: 'Technical University of Munich (TUM)',
      country: 'Germany',
      flag: '🇩🇪',
      city: 'Munich, Bavaria',
      ranking: 'QS World #28 | #1 in Germany',
      popularCourses: ['MSc Informatics', 'Automotive Software', 'Mechanical Engineering', 'Bioinformatics'],
      tuition: '€4,000 - €6,000 / semester (Very low tuition)',
      intakes: ['Winter (October 2025)', 'Summer (April 2026)'],
      entryRequirement: 'Bachelor’s degree in related field + GRE recommended',
      englishRequirement: 'IELTS 6.5 or TOEFL iBT 88 (Courses in English)',
      scholarships: 'DAAD Scholarship / Deutschlandstipendium',
      logoText: 'TUM',
      accentColor: '#0065BD'
    }
  ];

  // Seed Students
  const DEFAULT_STUDENTS = [
    {
      id: 'std-101',
      name: 'John Mensah',
      email: 'john.doe@example.com',
      phone: '+233 24 412 3456',
      city: 'Accra, Ghana',
      role: 'student',
      avatar: 'JM',
      assignedConsultant: 'Kwame Asante (Senior Consultant)',
      consultantPhone: '+233 55 205 4174',
      joinedDate: '2025-01-15',
      activeApplication: {
        id: 'app-901',
        destination: 'United Kingdom',
        level: 'Undergraduate',
        course: 'BSc Computer Science',
        intake: 'September 2025',
        budget: '£15,000 - £20,000 / year',
        qualification: 'WASSCE (Completed 2024)',
        school: 'Presbyterian Boys’ Secondary School (PRESEC)',
        grades: '6 A1s, 2 B2s (Core Maths A1, Elective Maths A1, Physics A1, Chemistry B2, English B2)',
        currentStageIndex: 4, // 0-based: 4 = Offer Letter
        stages: [
          { name: 'Profile Review', status: 'completed', date: '2025-01-18' },
          { name: 'Documents Verification', status: 'completed', date: '2025-01-25' },
          { name: 'University Selection', status: 'completed', date: '2025-02-02' },
          { name: 'Application Submitted', status: 'completed', date: '2025-02-12' },
          { name: 'Offer Letter', status: 'in-progress', date: 'Awaiting Decision' },
          { name: 'Acceptance & Deposit', status: 'pending', date: 'Upcoming' },
          { name: 'Visa Application', status: 'pending', date: 'Upcoming' },
          { name: 'Travel & Departure', status: 'pending', date: 'Upcoming' }
        ]
      },
      documents: [
        {
          id: 'doc-1',
          name: 'International Passport',
          type: 'passport',
          fileName: 'John_Mensah_Passport_Bio.pdf',
          status: 'approved',
          uploadedAt: '2025-01-20',
          size: '1.8 MB',
          note: 'Bio-data page validated. Valid through 2030.'
        },
        {
          id: 'doc-2',
          name: 'WASSCE Certificate & Result Checker Slip',
          type: 'wassce',
          fileName: 'John_Mensah_WASSCE_2024.pdf',
          status: 'approved',
          uploadedAt: '2025-01-20',
          size: '2.4 MB',
          note: 'Verified online via WAEC portal: 6 A1s confirmed.'
        },
        {
          id: 'doc-3',
          name: 'High School Transcripts',
          type: 'transcript',
          fileName: 'PRESEC_Form1_to_Form3_Transcript.pdf',
          status: 'approved',
          uploadedAt: '2025-01-22',
          size: '3.1 MB',
          note: 'Officially stamped by academic registrar.'
        },
        {
          id: 'doc-4',
          name: 'Academic Recommendation Letter',
          type: 'recommendation',
          fileName: 'Recommendation_Maths_HOD.pdf',
          status: 'action_required',
          uploadedAt: '2025-01-24',
          size: '850 KB',
          note: 'Please provide a copy on official school letterhead with the referee’s institutional email and contact phone.'
        },
        {
          id: 'doc-5',
          name: 'Statement of Purpose (SOP)',
          type: 'sop',
          fileName: 'John_Mensah_Personal_Statement_CS.pdf',
          status: 'approved',
          uploadedAt: '2025-02-01',
          size: '420 KB',
          note: 'Polished and aligned with UK Russell Group standards.'
        },
        {
          id: 'doc-6',
          name: 'Proof of Funds / Bank Statement',
          type: 'financial',
          fileName: 'Sponsor_Bank_Statement_Ecobank.pdf',
          status: 'pending',
          uploadedAt: '2025-02-14',
          size: '4.2 MB',
          note: 'Under compliance check for UKVI 28-day funds holding rule.'
        }
      ],
      tests: {
        ielts: {
          requested: true,
          testType: 'IELTS Academic',
          targetScore: '6.5+ Overall (min 6.0 in each sub-band)',
          status: 'Arranging test/preparation',
          currentStage: 2, // 0 to 4
          stages: [
            { name: 'Requirement Identified', status: 'completed', date: '2025-01-22' },
            { name: 'Preparation Arranged', status: 'completed', date: '2025-02-03' },
            { name: 'Test Centre Coordination', status: 'in-progress', date: 'In Progress' },
            { name: 'Test Date Scheduled', status: 'pending', date: 'Est. April 2025' },
            { name: 'Official Score Result', status: 'pending', date: 'Pending' }
          ],
          partnerCenter: 'British Council Accra Training Partner Hub',
          notes: 'Enrolled in 6-week intensive IELTS masterclass. Test date booking coordination with British Council in progress.',
          nextStep: 'Consultant Kwame will confirm available Saturday test dates in Accra.'
        },
        sat: {
          requested: false,
          testType: 'SAT Digital',
          targetScore: '1350+',
          status: 'Not Started',
          currentStage: 0,
          stages: [
            { name: 'Requirement Identified', status: 'pending', date: '-' },
            { name: 'Preparation', status: 'pending', date: '-' },
            { name: 'Registration Assistance', status: 'pending', date: '-' },
            { name: 'Test Date', status: 'pending', date: '-' },
            { name: 'Score', status: 'pending', date: '-' }
          ],
          partnerCenter: 'Dellics SAT Tutoring Partner Network',
          notes: 'Not required for UK options; student may request if exploring USA backup options.',
          nextStep: 'Request assistance if adding USA applications.'
        }
      },
      visa: {
        destination: 'UK Student Visa (Route formerly Tier 4)',
        status: 'Awaiting Unconditional Offer & CAS',
        currentStage: 2, // 0 to 5
        stages: [
          { name: 'Visa Requirement Review', status: 'completed', date: '2025-01-25' },
          { name: 'Personal & Academic Documents', status: 'completed', date: '2025-02-10' },
          { name: 'Financial Assessment (28-day rule)', status: 'in-progress', date: 'Ongoing' },
          { name: 'CAS Issuance & Review', status: 'pending', date: 'Awaiting Offer' },
          { name: 'Online Application & IHS Payment', status: 'pending', date: 'Upcoming' },
          { name: 'Biometrics & Visa Decision', status: 'pending', date: 'Upcoming' }
        ],
        advisoryNotes: 'UKVI requires 28 consecutive days of living expenses (£9,207 outside London) + tuition in the sponsor account.'
      },
      shortlistedUniversities: ['uni-1', 'uni-2', 'uni-3'],
      savedUniversities: ['uni-1', 'uni-2', 'uni-3', 'uni-4'],
      travelBookings: {
        status: 'Eligible for Student Perks',
        flightRequested: false,
        dormRequested: false,
        esimRequested: false,
        notes: 'Unlock 10% Dellics Travels student flight discount upon Visa Approval.'
      },
      internalNotes: [
        { date: '2025-01-18', author: 'Kwame Asante', text: 'Initial intake consultation completed. Student has exceptional WASSCE grades (6 A1s). Highly eligible for Russell Group universities.' },
        { date: '2025-02-05', author: 'Kwame Asante', text: 'Submitted UCAS application for University of Birmingham and Manchester. Sent recommendation revision reminder.' }
      ],
      messages: [
        { id: 'msg-1', sender: 'consultant', author: 'Kwame Asante', time: 'Feb 10, 2025 10:30 AM', text: 'Hello John! We have successfully submitted your application to University of Birmingham and University of Manchester.' },
        { id: 'msg-2', sender: 'student', author: 'John Mensah', time: 'Feb 10, 2025 11:15 AM', text: 'Thank you so much Mr. Kwame! What should I do next regarding the recommendation letter?' },
        { id: 'msg-3', sender: 'consultant', author: 'Kwame Asante', time: 'Feb 10, 2025 11:45 AM', text: 'Please have PRESEC issue it with their official stamp and the head of department’s direct contact number. Once uploaded, I will verify it immediately.' }
      ],
      notifications: [
        { id: 'notif-1', title: 'Application Submitted', text: 'Your university dossier for Birmingham & Manchester has been lodged.', time: '3 days ago', read: false, type: 'application' },
        { id: 'notif-2', title: 'Document Attention', text: 'Recommendation letter needs official school letterhead & stamp.', time: '2 days ago', read: false, type: 'document' },
        { id: 'notif-3', title: 'IELTS Preparation Plan', text: 'Your 6-week masterclass materials have been prepared.', time: '1 day ago', read: false, type: 'test' },
        { id: 'notif-4', title: 'Dellics Travels Synergy', text: 'Explore student discounted flight rates and UK accommodation options.', time: '5 hours ago', read: true, type: 'travel' }
      ]
    },
    {
      id: 'std-102',
      name: 'Ama Osei',
      email: 'ama.osei@example.com',
      phone: '+233 20 555 8899',
      city: 'Kumasi, Ghana',
      role: 'student',
      avatar: 'AO',
      assignedConsultant: 'Grace Mensah (Admissions Lead)',
      consultantPhone: '+233 55 205 4174',
      joinedDate: '2025-02-01',
      activeApplication: {
        id: 'app-902',
        destination: 'Canada',
        level: 'Postgraduate',
        course: 'Master of Public Health (MPH)',
        intake: 'January 2026',
        budget: 'CAD $25,000 - $35,000 / year',
        qualification: 'BSc Nursing, KNUST (Second Class Upper, CWA 71.4)',
        school: 'Kwame Nkrumah University of Science & Technology',
        grades: 'Upper Second Class Honors',
        currentStageIndex: 2,
        stages: [
          { name: 'Profile Review', status: 'completed', date: '2025-02-03' },
          { name: 'Documents Verification', status: 'completed', date: '2025-02-08' },
          { name: 'University Selection', status: 'in-progress', date: 'Shortlisting' },
          { name: 'Application Submitted', status: 'pending', date: 'Upcoming' },
          { name: 'Offer Letter', status: 'pending', date: 'Upcoming' },
          { name: 'Acceptance & Deposit', status: 'pending', date: 'Upcoming' },
          { name: 'Visa Application', status: 'pending', date: 'Upcoming' },
          { name: 'Travel & Departure', status: 'pending', date: 'Upcoming' }
        ]
      },
      documents: [
        { id: 'doc-201', name: 'International Passport', type: 'passport', fileName: 'Ama_Osei_Passport.pdf', status: 'approved', uploadedAt: '2025-02-02', size: '2.1 MB', note: 'Valid' },
        { id: 'doc-202', name: 'KNUST Degree Certificate', type: 'transcript', fileName: 'KNUST_Certificate.pdf', status: 'approved', uploadedAt: '2025-02-02', size: '1.9 MB', note: 'Certified copy' },
        { id: 'doc-203', name: 'Academic Transcripts', type: 'transcript', fileName: 'KNUST_Transcripts_AllSemesters.pdf', status: 'approved', uploadedAt: '2025-02-04', size: '4.5 MB', note: 'Complete' }
      ],
      tests: {
        ielts: {
          requested: true,
          testType: 'IELTS Academic',
          targetScore: '7.0 Overall',
          status: 'Preparation Arranged',
          currentStage: 1,
          stages: [
            { name: 'Requirement Identified', status: 'completed', date: '2025-02-05' },
            { name: 'Preparation Arranged', status: 'completed', date: '2025-02-12' },
            { name: 'Test Centre Coordination', status: 'in-progress', date: 'Pending' },
            { name: 'Test Date Scheduled', status: 'pending', date: '-' },
            { name: 'Score', status: 'pending', date: '-' }
          ],
          partnerCenter: 'Dellics IELTS Virtual Academy',
          notes: 'Student attending weekend online sessions.',
          nextStep: 'Complete mock assessment test on March 1st.'
        }
      },
      visa: {
        destination: 'Canada Study Permit',
        status: 'Pre-Assessment Stage',
        currentStage: 0,
        stages: [
          { name: 'Visa Requirement Review', status: 'in-progress', date: 'Ongoing' },
          { name: 'Personal & Academic Documents', status: 'pending', date: '-' },
          { name: 'Financial Assessment (CAD $20,635+)', status: 'pending', date: '-' },
          { name: 'PAL / Attestation Letter', status: 'pending', date: '-' },
          { name: 'IRCC Online Portal Lodgement', status: 'pending', date: '-' },
          { name: 'Biometrics & Passport Submission', status: 'pending', date: '-' }
        ],
        advisoryNotes: 'Requires Provincial Attestation Letter (PAL) from Canadian province.'
      },
      shortlistedUniversities: ['uni-4', 'uni-5'],
      savedUniversities: ['uni-4', 'uni-5'],
      internalNotes: [
        { date: '2025-02-03', author: 'Grace Mensah', text: 'Strong applicant with 3 years clinical nursing experience in Ghana. Excellent candidate for Ontario or Alberta MPH programs.' }
      ],
      messages: [],
      notifications: []
    },
    {
      id: 'std-103',
      name: 'Kwabena Boateng',
      email: 'kwabena.b@example.com',
      phone: '+233 26 123 9988',
      city: 'Takoradi, Ghana',
      role: 'student',
      avatar: 'KB',
      assignedConsultant: 'Kwame Asante (Senior Consultant)',
      consultantPhone: '+233 55 205 4174',
      joinedDate: '2025-01-10',
      activeApplication: {
        id: 'app-903',
        destination: 'United States',
        level: 'Undergraduate',
        course: 'BSc Mechanical Engineering',
        intake: 'Fall (August 2025)',
        budget: '$25,000 - $35,000 / year',
        qualification: 'WASSCE (Completed 2023)',
        school: 'Mfantsipim School',
        grades: '7 A1s, 1 B2',
        currentStageIndex: 6, // 6 = Visa
        stages: [
          { name: 'Profile Review', status: 'completed', date: '2025-01-12' },
          { name: 'Documents Verification', status: 'completed', date: '2025-01-15' },
          { name: 'University Selection', status: 'completed', date: '2025-01-20' },
          { name: 'Application Submitted', status: 'completed', date: '2025-01-28' },
          { name: 'Offer Letter', status: 'completed', date: '2025-02-05' },
          { name: 'Acceptance & Deposit', status: 'completed', date: '2025-02-10' },
          { name: 'Visa Application', status: 'in-progress', date: 'DS-160 Prep' },
          { name: 'Travel & Departure', status: 'pending', date: 'Upcoming' }
        ]
      },
      documents: [
        { id: 'doc-301', name: 'International Passport', type: 'passport', fileName: 'Kwabena_Passport.pdf', status: 'approved', uploadedAt: '2025-01-12', size: '2.5 MB', note: 'Valid' },
        { id: 'doc-302', name: 'I-20 Form from Arizona State University', type: 'offer', fileName: 'ASU_I20_Official.pdf', status: 'approved', uploadedAt: '2025-02-08', size: '1.2 MB', note: 'SEVIS fee paid' }
      ],
      tests: {
        sat: {
          requested: true,
          testType: 'SAT Digital',
          targetScore: '1400+',
          status: 'Score Received: 1420',
          currentStage: 4,
          stages: [
            { name: 'Requirement Identified', status: 'completed', date: '2024-10-01' },
            { name: 'Preparation', status: 'completed', date: '2024-11-15' },
            { name: 'Registration Assistance', status: 'completed', date: '2024-11-20' },
            { name: 'Test Date', status: 'completed', date: '2024-12-07' },
            { name: 'Score', status: 'completed', date: 'Score: 1420 (Math 760, Reading 660)' }
          ],
          partnerCenter: 'Dellics Partner Testing Centre',
          notes: 'Secured $14,500/year merit scholarship with this score.'
        }
      },
      visa: {
        destination: 'USA F-1 Student Visa',
        status: 'DS-160 Form in Progress',
        currentStage: 3,
        stages: [
          { name: 'Visa Requirement Review', status: 'completed', date: '2025-02-10' },
          { name: 'Personal & Financial Docs', status: 'completed', date: '2025-02-14' },
          { name: 'SEVIS I-901 Payment', status: 'completed', date: '2025-02-16' },
          { name: 'DS-160 Lodgement & Mock Interview', status: 'in-progress', date: 'Scheduled Feb 25' },
          { name: 'US Embassy Interview (Accra)', status: 'pending', date: 'Slot booked April 14' },
          { name: 'Visa Decision', status: 'pending', date: '-' }
        ],
        advisoryNotes: 'Mock interview session booked with Consultant Kwame.'
      },
      shortlistedUniversities: ['uni-6'],
      savedUniversities: ['uni-6'],
      internalNotes: [],
      messages: [],
      notifications: []
    }
  ];

  // Store Initialization
  function loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read Dellics state from localStorage:', e);
    }
    // Default initial seed
    const initialState = {
      students: DEFAULT_STUDENTS,
      universities: DEFAULT_UNIVERSITIES,
      stats: {
        totalStudents: 248,
        activeApplications: 137,
        testsPending: 42,
        universityApplications: 89,
        visaProcessing: 31,
        appointmentsToday: 7
      }
    };
    saveState(initialState);
    return initialState;
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      notifySubscribers(state);
    } catch (e) {
      console.error('Failed to write Dellics state to localStorage:', e);
    }
  }

  let state = loadState();
  const listeners = [];

  function subscribe(fn) {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }

  function notifySubscribers(updatedState) {
    listeners.forEach(fn => {
      try { fn(updatedState); } catch (e) { console.error('Error in store listener:', e); }
    });
  }

  // Cross-tab sync via window storage event
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) {
      state = loadState();
      notifySubscribers(state);
    }
  });

  // Session Management
  function getActiveSession() {
    try {
      const session = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
      if (session) return JSON.parse(session);
    } catch (e) {}
    // Default to student demo session for instant viewing
    return {
      userId: 'std-101',
      role: 'student',
      name: 'John Mensah',
      email: 'john.doe@example.com'
    };
  }

  function setActiveSession(user, remember = true) {
    const payload = JSON.stringify(user);
    sessionStorage.setItem(AUTH_KEY, payload);
    if (remember) {
      localStorage.setItem(AUTH_KEY, payload);
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }

  function clearActiveSession() {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
  }

  // STORE API
  window.DellicsStore = {
    // State Access
    getState() {
      return state;
    },
    subscribe,

    // Authentication
    getCurrentSession() {
      return getActiveSession();
    },

    getCurrentStudent() {
      const session = getActiveSession();
      if (!session) return state.students[0];
      const match = state.students.find(s => s.id === session.userId || s.email.toLowerCase() === (session.email || '').toLowerCase());
      return match || state.students[0];
    },

    login(email, password) {
      const trimmedEmail = (email || '').trim().toLowerCase();
      // Admin check
      if (trimmedEmail === 'admin@dellicseducation.com' || trimmedEmail === 'admin') {
        if (password === 'Dellics@2026' || password === 'admin' || password === '3d83f72a') {
          const adminUser = {
            userId: 'admin-01',
            role: 'admin',
            name: 'Dellics Education Consultant / Admin',
            email: 'admin@dellicseducation.com'
          };
          setActiveSession(adminUser, true);
          return { success: true, user: adminUser };
        }
        return { success: false, error: 'Incorrect admin password. (Hint: Dellics@2026)' };
      }

      // Student check
      const student = state.students.find(s => s.email.toLowerCase() === trimmedEmail);
      if (student) {
        const studentUser = {
          userId: student.id,
          role: 'student',
          name: student.name,
          email: student.email
        };
        setActiveSession(studentUser, true);
        return { success: true, user: studentUser };
      }

      return { success: false, error: 'Account not found. Please register or use the demo login.' };
    },

    demoLogin(role = 'student') {
      if (role === 'admin') {
        const adminUser = {
          userId: 'admin-01',
          role: 'admin',
          name: 'Kwame Asante (Admin)',
          email: 'admin@dellicseducation.com'
        };
        setActiveSession(adminUser, true);
        return adminUser;
      }
      const student = state.students[0];
      const studentUser = {
        userId: student.id,
        role: 'student',
        name: student.name,
        email: student.email
      };
      setActiveSession(studentUser, true);
      return studentUser;
    },

    logout() {
      clearActiveSession();
    },

    registerStudent(formData) {
      const newId = 'std-' + Date.now().toString().slice(-4);
      const newStudent = {
        id: newId,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city || 'Accra, Ghana',
        role: 'student',
        avatar: ((formData.firstName[0] || 'S') + (formData.lastName[0] || 'D')).toUpperCase(),
        assignedConsultant: 'Kwame Asante (Senior Consultant)',
        consultantPhone: '+233 55 205 4174',
        joinedDate: new Date().toISOString().split('T')[0],
        profileCompletion: 25, // Initial 25% on sign-up per specification
        personalInfo: {
          dob: '',
          nationality: 'Ghanaian',
          residence: 'Ghana',
          phone: formData.phone.trim()
        },
        academicBackground: {
          qualification: '',
          school: '',
          course: '',
          gradYear: '',
          grades: ''
        },
        studyPreferences: {
          destination: 'United Kingdom',
          course: '',
          level: 'Undergraduate',
          intake: 'September 2025',
          budget: '£15,000 - £20,000 / year'
        },
        testsNeeded: [],
        activeApplication: {
          id: 'app-' + Math.floor(100 + Math.random() * 900),
          destination: formData.destination || 'United Kingdom',
          level: formData.level || 'Undergraduate',
          course: formData.course || 'General Admission',
          intake: formData.intake || 'September 2025',
          budget: formData.budget || '£15,000 - £20,000 / year',
          qualification: formData.qualification || 'High School / WASSCE',
          school: formData.school || 'Not specified',
          grades: formData.grades || 'Pending Submission',
          currentStageIndex: 0,
          stages: [
            { name: 'Profile Review', status: 'in-progress', date: 'In Progress' },
            { name: 'Documents Verification', status: 'pending', date: 'Upcoming' },
            { name: 'University Selection', status: 'pending', date: 'Upcoming' },
            { name: 'Application Submitted', status: 'pending', date: 'Upcoming' },
            { name: 'Offer Letter', status: 'pending', date: 'Upcoming' },
            { name: 'Acceptance & Deposit', status: 'pending', date: 'Upcoming' },
            { name: 'Visa Application', status: 'pending', date: 'Upcoming' },
            { name: 'Travel & Departure', status: 'pending', date: 'Upcoming' }
          ]
        },
        documents: [],
        tests: {},
        visa: {
          destination: formData.destination || 'United Kingdom',
          status: 'Not Started',
          currentStage: 0,
          stages: [
            { name: 'Visa Requirement Review', status: 'pending', date: '-' },
            { name: 'Documents', status: 'pending', date: '-' },
            { name: 'Financial Assessment', status: 'pending', date: '-' },
            { name: 'Preparation', status: 'pending', date: '-' },
            { name: 'Submission', status: 'pending', date: '-' },
            { name: 'Decision', status: 'pending', date: '-' }
          ]
        },
        shortlistedUniversities: [],
        savedUniversities: [],
        travelBookings: { status: 'New Student' },
        internalNotes: [
          { date: new Date().toISOString().split('T')[0], author: 'System', text: 'New student account registered. Profile completion: 25%.' }
        ],
        messages: [
          {
            id: 'msg-' + Date.now(),
            sender: 'consultant',
            author: 'Kwame Asante',
            time: 'Just now',
            text: `Welcome to Dellics, ${formData.firstName}! Let's get your profile ready so we can match you with the best universities and scholarships.`
          }
        ],
        notifications: [
          {
            id: 'notif-' + Date.now(),
            title: 'Welcome to Dellics!',
            text: 'Your account is active. Complete your profile to unlock university shortlisting and test coordination.',
            time: 'Just now',
            read: false,
            type: 'application'
          }
        ]
      };

      state.students.unshift(newStudent);
      state.stats.totalStudents += 1;
      saveState(state);

      const sessionUser = {
        userId: newStudent.id,
        role: 'student',
        name: newStudent.name,
        email: newStudent.email
      };
      setActiveSession(sessionUser, true);
      return { success: true, user: sessionUser, student: newStudent };
    },

    updateStudentProfile(studentId, profileData) {
      const student = state.students.find(s => s.id === studentId);
      if (!student) return { success: false, error: 'Student not found' };

      if (profileData.personalInfo) {
        student.personalInfo = { ...(student.personalInfo || {}), ...profileData.personalInfo };
        if (profileData.personalInfo.phone) student.phone = profileData.personalInfo.phone;
        if (profileData.personalInfo.residence) student.city = profileData.personalInfo.residence;
      }

      if (profileData.academicBackground) {
        student.academicBackground = { ...(student.academicBackground || {}), ...profileData.academicBackground };
        if (student.activeApplication) {
          if (profileData.academicBackground.qualification) student.activeApplication.qualification = profileData.academicBackground.qualification;
          if (profileData.academicBackground.school) student.activeApplication.school = profileData.academicBackground.school;
          if (profileData.academicBackground.grades) student.activeApplication.grades = profileData.academicBackground.grades;
        }
      }

      if (profileData.studyPreferences) {
        student.studyPreferences = { ...(student.studyPreferences || {}), ...profileData.studyPreferences };
        if (student.activeApplication) {
          if (profileData.studyPreferences.destination) student.activeApplication.destination = profileData.studyPreferences.destination;
          if (profileData.studyPreferences.course) student.activeApplication.course = profileData.studyPreferences.course;
          if (profileData.studyPreferences.level) student.activeApplication.level = profileData.studyPreferences.level;
          if (profileData.studyPreferences.intake) student.activeApplication.intake = profileData.studyPreferences.intake;
          if (profileData.studyPreferences.budget) student.activeApplication.budget = profileData.studyPreferences.budget;
        }
        if (student.visa && profileData.studyPreferences.destination) {
          student.visa.destination = profileData.studyPreferences.destination;
        }
      }

      if (profileData.testsNeeded && Array.isArray(profileData.testsNeeded)) {
        student.testsNeeded = profileData.testsNeeded;
        student.tests = student.tests || {};
        profileData.testsNeeded.forEach(testName => {
          const key = testName.toLowerCase().replace(/[^a-z]/g, '');
          if (key && key !== 'imnotsure') {
            student.tests[key] = {
              requested: true,
              testType: testName,
              targetScore: 'Required for admission',
              status: 'Arranging test/preparation',
              currentStage: 1,
              stages: [
                { name: 'Requirement Identified', status: 'completed', date: new Date().toISOString().split('T')[0] },
                { name: 'Preparation Arranged', status: 'in-progress', date: 'In Progress' },
                { name: 'Test Centre Coordination', status: 'pending', date: '-' },
                { name: 'Test Date Scheduled', status: 'pending', date: '-' },
                { name: 'Result / Score Verified', status: 'pending', date: '-' }
              ]
            };
          }
        });
      }

      // Calculate progress percentage
      let completion = 25; // Base registration
      if (student.personalInfo?.dob && student.personalInfo?.nationality) completion += 25;
      if (student.academicBackground?.qualification && student.academicBackground?.school) completion += 25;
      if (student.studyPreferences?.destination && student.studyPreferences?.course) completion += 25;
      student.profileCompletion = Math.min(completion, 100);

      // If reached 75%+, update profile review status
      if (student.profileCompletion >= 75 && student.activeApplication) {
        student.activeApplication.currentStageIndex = Math.max(student.activeApplication.currentStageIndex, 1);
        if (student.activeApplication.stages[0]) {
          student.activeApplication.stages[0].status = 'completed';
        }
        if (student.activeApplication.stages[1] && student.activeApplication.stages[1].status === 'pending') {
          student.activeApplication.stages[1].status = 'in-progress';
        }
      }

      saveState(state);
      return { success: true, student };
    },

    // Student Operations
    submitFullApplication(studentId, appData) {
      const student = state.students.find(s => s.id === studentId);
      if (!student) return false;

      student.activeApplication = {
        id: student.activeApplication?.id || 'app-' + Math.floor(100 + Math.random() * 900),
        destination: appData.destination,
        level: appData.level,
        course: appData.course,
        intake: appData.intake,
        budget: appData.budget,
        qualification: appData.qualification,
        school: appData.school,
        grades: appData.grades,
        passportNumber: appData.passportNumber || '',
        currentStageIndex: 1, // Advance to Document stage
        stages: [
          { name: 'Profile Review', status: 'completed', date: new Date().toISOString().split('T')[0] },
          { name: 'Documents Verification', status: 'in-progress', date: 'In Progress' },
          { name: 'University Selection', status: 'pending', date: 'Upcoming' },
          { name: 'Application Submitted', status: 'pending', date: 'Upcoming' },
          { name: 'Offer Letter', status: 'pending', date: 'Upcoming' },
          { name: 'Acceptance & Deposit', status: 'pending', date: 'Upcoming' },
          { name: 'Visa Application', status: 'pending', date: 'Upcoming' },
          { name: 'Travel & Departure', status: 'pending', date: 'Upcoming' }
        ]
      };

      // If test assistance was selected in the wizard
      if (appData.testRequired && appData.testRequired !== 'none') {
        this.requestTestAssistance(studentId, appData.testRequired, {
          targetScore: appData.targetScore || 'Required for admission',
          prepNeeded: true
        });
      }

      student.notifications.unshift({
        id: 'notif-' + Date.now(),
        title: 'Application Created Successfully',
        text: `Your study abroad file for ${appData.destination} (${appData.course}) has been created. A consultant has been assigned.`,
        time: 'Just now',
        read: false,
        type: 'application'
      });

      student.internalNotes.unshift({
        date: new Date().toISOString().split('T')[0],
        author: 'System',
        text: `Completed 8-step application wizard for ${appData.destination} - ${appData.course} (${appData.intake}).`
      });

      state.stats.activeApplications += 1;
      saveState(state);
      return true;
    },

    // Test & Exam Coordination
    requestTestAssistance(studentId, testCode, details = {}) {
      const student = state.students.find(s => s.id === studentId);
      if (!student) return false;

      const code = (testCode || 'ielts').toLowerCase();
      const testName = code === 'ielts' ? 'IELTS Academic' :
                       code === 'toefl' ? 'TOEFL iBT' :
                       code === 'pte' ? 'PTE Academic' :
                       code === 'duolingo' ? 'Duolingo English Test' :
                       code === 'sat' ? 'SAT Digital' :
                       code === 'gre' ? 'GRE General' :
                       code === 'gmat' ? 'GMAT Focus Edition' : testCode.toUpperCase();

      student.tests[code] = {
        requested: true,
        testType: testName,
        targetScore: details.targetScore || 'Admission Standard',
        status: 'Arranging test/preparation',
        currentStage: 1, // 0: Identified, 1: Prep Arranged, 2: Test Centre Coord, 3: Date, 4: Score
        stages: [
          { name: 'Requirement Identified', status: 'completed', date: new Date().toISOString().split('T')[0] },
          { name: 'Preparation Arranged', status: 'in-progress', date: 'Arranging' },
          { name: 'Test Centre Coordination', status: 'pending', date: 'Upcoming' },
          { name: 'Test Date Scheduled', status: 'pending', date: 'Pending' },
          { name: 'Official Score Result', status: 'pending', date: 'Pending' }
        ],
        partnerCenter: 'Dellics Accredited Test Prep Network (Ghana)',
        notes: `Requirement received. Dellics is coordinating preparation materials and accredited test centre scheduling.`,
        nextStep: 'Your consultant will contact you regarding study materials and schedule.'
      };

      student.notifications.unshift({
        id: 'notif-' + Date.now(),
        title: `${testName} Request Received`,
        text: `Dellics is assisting you with your ${testName} requirement. Status: Arranging test/preparation.`,
        time: 'Just now',
        read: false,
        type: 'test'
      });

      state.stats.testsPending += 1;
      saveState(state);
      return true;
    },

    updateTestCoordination(studentId, testCode, stageIndex, notes, score = '') {
      const student = state.students.find(s => s.id === studentId);
      if (!student || !student.tests[testCode]) return false;

      const test = student.tests[testCode];
      test.currentStage = stageIndex;
      test.stages.forEach((stg, idx) => {
        if (idx < stageIndex) stg.status = 'completed';
        else if (idx === stageIndex) stg.status = 'in-progress';
        else stg.status = 'pending';
      });

      if (notes) test.notes = notes;
      if (score) {
        test.status = `Completed: Score ${score}`;
        test.stages[4].status = 'completed';
        test.stages[4].date = `Score: ${score}`;
      } else if (stageIndex === 3) {
        test.status = 'Test Date Scheduled';
      } else if (stageIndex === 2) {
        test.status = 'Test Centre Coordination';
      } else if (stageIndex === 1) {
        test.status = 'Preparation Arranged';
      }

      student.notifications.unshift({
        id: 'notif-' + Date.now(),
        title: `${test.testType} Status Updated`,
        text: `Your ${test.testType} status is now: ${test.stages[stageIndex]?.name || 'Updated'}. ${notes ? `Note: ${notes}` : ''}`,
        time: 'Just now',
        read: false,
        type: 'test'
      });

      saveState(state);
      return true;
    },

    // Document Management
    uploadDocument(studentId, docType, fileInfo) {
      const student = state.students.find(s => s.id === studentId);
      if (!student) return false;

      const docNameMap = {
        passport: 'International Passport',
        wassce: 'WASSCE Certificate / Results Checker',
        transcript: 'Official Academic Transcript',
        recommendation: 'Academic Recommendation Letter',
        sop: 'Statement of Purpose / CV',
        financial: 'Proof of Funds / Bank Statement',
        other: 'Supplementary Document'
      };

      const existingIndex = student.documents.findIndex(d => d.type === docType);
      const newDoc = {
        id: 'doc-' + Date.now(),
        name: docNameMap[docType] || 'Academic Document',
        type: docType,
        fileName: fileInfo.fileName || `${docType}_document.pdf`,
        status: 'pending',
        uploadedAt: new Date().toISOString().split('T')[0],
        size: fileInfo.size || '1.5 MB',
        note: 'Uploaded by student. Awaiting consultant compliance review.'
      };

      if (existingIndex >= 0) {
        student.documents[existingIndex] = newDoc;
      } else {
        student.documents.push(newDoc);
      }

      student.notifications.unshift({
        id: 'notif-' + Date.now(),
        title: 'Document Uploaded',
        text: `Your ${newDoc.name} has been received for verification.`,
        time: 'Just now',
        read: false,
        type: 'document'
      });

      saveState(state);
      return true;
    },

    updateDocumentStatus(studentId, docId, status, note = '') {
      const student = state.students.find(s => s.id === studentId);
      if (!student) return false;

      const doc = student.documents.find(d => d.id === docId);
      if (!doc) return false;

      doc.status = status; // 'approved' | 'action_required' | 'pending' | 'rejected'
      if (note) doc.note = note;

      const statusLabels = {
        approved: 'Approved ✓',
        action_required: 'Action Required ⚠',
        pending: 'Under Review ⏳',
        rejected: 'Declined'
      };

      student.notifications.unshift({
        id: 'notif-' + Date.now(),
        title: `Document ${statusLabels[status] || status}`,
        text: `${doc.name}: ${note || `Status updated to ${status}`}`,
        time: 'Just now',
        read: false,
        type: 'document'
      });

      saveState(state);
      return true;
    },

    // Application Stage Advancement
    updateApplicationStage(studentId, stageIndex) {
      const student = state.students.find(s => s.id === studentId);
      if (!student || !student.activeApplication) return false;

      student.activeApplication.currentStageIndex = stageIndex;
      const today = new Date().toISOString().split('T')[0];

      student.activeApplication.stages.forEach((stg, idx) => {
        if (idx < stageIndex) {
          stg.status = 'completed';
        } else if (idx === stageIndex) {
          stg.status = 'in-progress';
          stg.date = today;
        } else {
          stg.status = 'pending';
          stg.date = 'Upcoming';
        }
      });

      const currentStageName = student.activeApplication.stages[stageIndex]?.name || 'Stage updated';

      student.notifications.unshift({
        id: 'notif-' + Date.now(),
        title: `Application Progress: ${currentStageName}`,
        text: `Your application has advanced to: ${currentStageName}.`,
        time: 'Just now',
        read: false,
        type: 'application'
      });

      saveState(state);
      return true;
    },

    // University Management
    saveUniversity(studentId, uniId) {
      const student = state.students.find(s => s.id === studentId);
      if (!student) return false;
      if (!student.savedUniversities) student.savedUniversities = [];
      if (!student.savedUniversities.includes(uniId)) {
        student.savedUniversities.push(uniId);
        saveState(state);
      }
      return true;
    },

    removeSavedUniversity(studentId, uniId) {
      const student = state.students.find(s => s.id === studentId);
      if (!student || !student.savedUniversities) return false;
      student.savedUniversities = student.savedUniversities.filter(id => id !== uniId);
      saveState(state);
      return true;
    },

    requestUniversityApplication(studentId, uniId) {
      const student = state.students.find(s => s.id === studentId);
      const uni = state.universities.find(u => u.id === uniId);
      if (!student || !uni) return false;

      if (!student.shortlistedUniversities) student.shortlistedUniversities = [];
      if (!student.shortlistedUniversities.includes(uniId)) {
        student.shortlistedUniversities.push(uniId);
      }

      student.notifications.unshift({
        id: 'notif-' + Date.now(),
        title: 'Application Requested',
        text: `You requested an official application to ${uni.name}. Your consultant will verify entry criteria and prepare the dossier.`,
        time: 'Just now',
        read: false,
        type: 'application'
      });

      student.internalNotes.unshift({
        date: new Date().toISOString().split('T')[0],
        author: 'System',
        text: `Student requested formal application to ${uni.name} (${uni.country}).`
      });

      state.stats.universityApplications += 1;
      saveState(state);
      return true;
    },

    // Messaging & Notes
    sendMessage(studentId, text, sender = 'student') {
      const student = state.students.find(s => s.id === studentId);
      if (!student) return false;

      const newMsg = {
        id: 'msg-' + Date.now(),
        sender: sender,
        author: sender === 'student' ? student.name : (student.assignedConsultant || 'Dellics Consultant'),
        time: 'Just now',
        text: text
      };

      student.messages.push(newMsg);

      if (sender === 'consultant') {
        student.notifications.unshift({
          id: 'notif-' + Date.now(),
          title: 'New Message from Consultant',
          text: text.slice(0, 80) + (text.length > 80 ? '...' : ''),
          time: 'Just now',
          read: false,
          type: 'message'
        });
      }

      saveState(state);
      return true;
    },

    addInternalNote(studentId, noteText, author = 'Consultant') {
      const student = state.students.find(s => s.id === studentId);
      if (!student) return false;

      student.internalNotes.unshift({
        date: new Date().toISOString().split('T')[0],
        author: author,
        text: noteText
      });

      saveState(state);
      return true;
    },

    // Dellics Travels Integration
    requestTravelService(studentId, serviceType, details = '') {
      const student = state.students.find(s => s.id === studentId);
      if (!student) return false;

      if (!student.travelBookings) student.travelBookings = {};
      student.travelBookings[serviceType] = true;
      student.travelBookings.lastRequestDate = new Date().toISOString().split('T')[0];

      const serviceTitles = {
        flight: 'Student Discount Flight',
        dorm: 'Verified University Accommodation',
        transfer: 'Airport Transfer',
        esim: 'International Pre-Activated eSIM'
      };

      student.notifications.unshift({
        id: 'notif-' + Date.now(),
        title: 'Dellics Travels Request Received',
        text: `Your inquiry for ${serviceTitles[serviceType] || serviceType} has been passed to our Dellics Travels ticketing team.`,
        time: 'Just now',
        read: false,
        type: 'travel'
      });

      student.internalNotes.unshift({
        date: new Date().toISOString().split('T')[0],
        author: 'System',
        text: `Dellics Travels cross-ecosystem request: ${serviceTitles[serviceType] || serviceType}. Details: ${details || 'None'}`
      });

      saveState(state);
      return true;
    },

    // Reset to defaults
    resetToDemoData() {
      localStorage.removeItem(STORAGE_KEY);
      state = loadState();
      saveState(state);
      return state;
    }
  };

  console.log('🎓 DellicsPlatformStore initialized.');
})();
