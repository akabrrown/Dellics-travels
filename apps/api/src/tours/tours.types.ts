export class TourPackageDto {
  id?: string;
  title: string;
  slug?: string;
  tagline?: string;
  destination: string;
  country?: string;
  region?: string;
  duration: string;
  category?: string;
  price: number | string;
  currency?: string;
  departureCity?: string;
  seasonality?: string;
  badge?: string;
  image?: string;
  overview: string;
  includes?: string[];
  highlights?: string[];
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
    meals?: string;
  }>;
  components?: Array<{
    id: string;
    type: string;
    title: string;
    details: string;
    costGHS?: number;
  }>;
  isFeatured?: boolean;
  status?: 'PUBLISHED' | 'DRAFT';
}

export interface TourPackageResult {
  id: string;
  name: string;
  slug: string;
  destination: string;
  price: string;
  rawPrice: number;
  currency: string;
  duration: string;
  badge: string;
  image: string;
  copy: string;
  includes: string[];
  highlights: string[];
  isFeatured: boolean;
  isDellicsSignature: boolean;
  viatorUrl: string;
  itinerary?: any[];
  components?: any[];
  status?: string;
}
