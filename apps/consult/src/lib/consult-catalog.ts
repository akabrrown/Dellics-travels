export interface CatalogSchool {
  id: string;
  name: string;
  level: "Undergraduate" | "Postgraduate" | "Undergraduate & Postgraduate";
  programmes: string[];
  location: string;
  city: string;
  tuition: string;
  applicationFee: string;
  intake?: string;
  ranking?: string;
  scholarshipCoverage?: string;
  badges: {
    highJobDemand: boolean;
    noVisaCap: boolean;
    loans: boolean;
    prime: boolean;
    top: boolean;
    popular: boolean;
    fastAcceptance: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_CATALOG_SCHOOLS: CatalogSchool[] = [
  {
    id: "oxford-01",
    name: "University of Oxford",
    level: "Undergraduate & Postgraduate",
    programmes: ["Law (LLB)", "Medicine (MBChB)", "Philosophy, Politics & Economics (PPE)", "MSc Computer Science"],
    location: "United Kingdom",
    city: "Oxford, England",
    tuition: "£29,000 - £44,000 / year",
    applicationFee: "£75",
    intake: "Oct 2026",
    ranking: "Top 3 Worldwide",
    scholarshipCoverage: "Full Clarendon Fund & Rhodes Scholarship",
    badges: {
      highJobDemand: true,
      noVisaCap: true,
      loans: true,
      prime: true,
      top: true,
      popular: true,
      fastAcceptance: false,
    },
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-10-22T00:00:00Z",
  },
  {
    id: "manchester-02",
    name: "University of Manchester",
    level: "Undergraduate & Postgraduate",
    programmes: ["MSc Advanced Computer Science & AI", "BSc Biomedical Science", "MBA International Business", "MSc Data Science"],
    location: "United Kingdom",
    city: "Manchester, England",
    tuition: "£28,000 / year",
    applicationFee: "£60 (Fee Waiver Available)",
    intake: "Sep 2026",
    ranking: "Russell Group - Top 30 Worldwide",
    scholarshipCoverage: "50% Tuition Waiver - Vice-Chancellor's Award",
    badges: {
      highJobDemand: true,
      noVisaCap: true,
      loans: true,
      prime: false,
      top: true,
      popular: true,
      fastAcceptance: true,
    },
    createdAt: "2026-02-10T00:00:00Z",
    updatedAt: "2026-10-22T00:00:00Z",
  },
  {
    id: "toronto-03",
    name: "University of Toronto",
    level: "Undergraduate & Postgraduate",
    programmes: ["BSc Computer Science (Co-op)", "Rotman Commerce (BCom)", "Master of Engineering (MEng)", "MSc Public Health"],
    location: "Canada",
    city: "Toronto, Ontario",
    tuition: "CAD $42,000 / year",
    applicationFee: "CAD $125",
    intake: "Sep 2026 / Jan 2027",
    ranking: "No. 1 in Canada - Top 20 Worldwide",
    scholarshipCoverage: "Full Tuition + Living Costs (Lester B. Pearson)",
    badges: {
      highJobDemand: true,
      noVisaCap: true,
      loans: true,
      prime: true,
      top: true,
      popular: true,
      fastAcceptance: true,
    },
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-10-22T00:00:00Z",
  },
  {
    id: "harvard-04",
    name: "Harvard University",
    level: "Undergraduate & Postgraduate",
    programmes: ["Master of Business Administration (MBA)", "BA Economics", "MSc Computational Science & Engineering", "LLM Law"],
    location: "United States",
    city: "Cambridge, Massachusetts",
    tuition: "USD $55,000 / year",
    applicationFee: "$85",
    intake: "Aug 2026",
    ranking: "Ivy League - Global Tier 1",
    scholarshipCoverage: "100% Need-Blind Financial Aid for International Students",
    badges: {
      highJobDemand: true,
      noVisaCap: true,
      loans: true,
      prime: true,
      top: true,
      popular: true,
      fastAcceptance: false,
    },
    createdAt: "2026-01-20T00:00:00Z",
    updatedAt: "2026-10-22T00:00:00Z",
  },
  {
    id: "melbourne-05",
    name: "University of Melbourne",
    level: "Undergraduate & Postgraduate",
    programmes: ["Master of Information Technology", "Bachelor of Biomedicine", "Master of Finance", "Master of Architecture"],
    location: "Australia",
    city: "Melbourne, Victoria",
    tuition: "AUD $44,000 / year",
    applicationFee: "AUD $100",
    intake: "Feb 2027 / Jul 2027",
    ranking: "No. 1 in Australia - Top 15 Worldwide",
    scholarshipCoverage: "100% or 50% Tuition Fee Remission",
    badges: {
      highJobDemand: true,
      noVisaCap: true,
      loans: true,
      prime: false,
      top: true,
      popular: true,
      fastAcceptance: true,
    },
    createdAt: "2026-04-12T00:00:00Z",
    updatedAt: "2026-10-22T00:00:00Z",
  },
  {
    id: "ashesi-06",
    name: "Ashesi University",
    level: "Undergraduate",
    programmes: ["BSc Computer Science", "BSc Business Administration", "BSc Management Information Systems", "BSc Mechanical Engineering"],
    location: "Ghana",
    city: "Berekuso, Eastern Region",
    tuition: "$8,500 / year",
    applicationFee: "$50 (Free for early bird)",
    intake: "Aug 2026",
    ranking: "Top Private University in West Africa",
    scholarshipCoverage: "Full MasterCard Foundation Comprehensive Scholarship",
    badges: {
      highJobDemand: true,
      noVisaCap: true,
      loans: false,
      prime: true,
      top: true,
      popular: true,
      fastAcceptance: true,
    },
    createdAt: "2026-05-18T00:00:00Z",
    updatedAt: "2026-10-22T00:00:00Z",
  },
];

export const CATALOG_STORAGE_KEY = "dellics_consult_catalog_schools";
export const CATALOG_EVENT_KEY = "dellics:catalog_updated";

export function getLocalCatalogSchools(): CatalogSchool[] {
  if (typeof window === "undefined") {
    return DEFAULT_CATALOG_SCHOOLS;
  }
  try {
    const raw = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(DEFAULT_CATALOG_SCHOOLS));
      return DEFAULT_CATALOG_SCHOOLS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CATALOG_SCHOOLS;
  } catch (err) {
    return DEFAULT_CATALOG_SCHOOLS;
  }
}

export function saveLocalCatalogSchools(schools: CatalogSchool[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(schools));
    window.dispatchEvent(new CustomEvent(CATALOG_EVENT_KEY, { detail: schools }));
  } catch (err) {}
}

export function notifyCatalogUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CATALOG_EVENT_KEY));
  }
}
