export interface CatalogSchool {
  id: string;
  name: string;
  country: string;
  flag: string;
  programs_count: number;
  tuition: string;
  popular_programs: string[];
}

export const DEFAULT_CATALOG_SCHOOLS: CatalogSchool[] = [
  {
    id: 'oxford-01',
    name: 'University of Oxford',
    country: 'United Kingdom',
    flag: '🇬🇧',
    programs_count: 140,
    tuition: '£29,000 - £44,000 / year',
    popular_programs: ['Law (LLB)', 'Medicine (MBChB)', 'Philosophy, Politics & Economics (PPE)', 'MSc Computer Science'],
  },
  {
    id: 'manchester-02',
    name: 'University of Manchester',
    country: 'United Kingdom',
    flag: '🇬🇧',
    programs_count: 125,
    tuition: '£28,000 / year',
    popular_programs: ['MSc Advanced Computer Science & AI', 'BSc Biomedical Science', 'MBA International Business', 'MSc Data Science'],
  },
  {
    id: 'toronto-03',
    name: 'University of Toronto',
    country: 'Canada',
    flag: '🇨🇦',
    programs_count: 180,
    tuition: 'CAD $38,000 - $60,000 / year',
    popular_programs: ['BSc Computer Science (Co-op)', 'Rotman Commerce (BCom)', 'Master of Engineering (MEng)', 'MSc Public Health'],
  },
  {
    id: 'ubc-04',
    name: 'University of British Columbia (UBC)',
    country: 'Canada',
    flag: '🇨🇦',
    programs_count: 155,
    tuition: 'CAD $35,000 / year',
    popular_programs: ['BSc Applied Biology', 'Master of Data Science', 'Bachelor of International Economics', 'BSc Forestry'],
  },
  {
    id: 'harvard-05',
    name: 'Harvard University',
    country: 'United States',
    flag: '🇺🇸',
    programs_count: 190,
    tuition: '$54,000 / year (Need-Blind Aid)',
    popular_programs: ['AB Computer Science', 'Harvard Law (JD)', 'MBA Harvard Business School', 'Harvard Kennedy School (MPA)'],
  },
  {
    id: 'mit-06',
    name: 'Massachusetts Institute of Technology (MIT)',
    country: 'United States',
    flag: '🇺🇸',
    programs_count: 110,
    tuition: '$57,590 / year',
    popular_programs: ['BSc Electrical Engineering & CS (EECS)', 'MSc Technology and Policy', 'MIT Sloan MBA', 'BSc Physics'],
  },
  {
    id: 'melbourne-07',
    name: 'University of Melbourne',
    country: 'Australia',
    flag: '🇦🇺',
    programs_count: 135,
    tuition: 'AUD $42,000 / year',
    popular_programs: ['Bachelor of Biomedicine', 'Master of Information Technology', 'Melbourne JD', 'Master of International Relations'],
  },
  {
    id: 'sydney-08',
    name: 'University of Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    programs_count: 145,
    tuition: 'AUD $45,000 / year',
    popular_programs: ['Bachelor of Nursing (Advanced)', 'Master of Cybersecurity', 'Bachelor of Commerce', 'Master of Project Management'],
  },
];

