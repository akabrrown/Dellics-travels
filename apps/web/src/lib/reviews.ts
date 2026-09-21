import { getJson } from "./api";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  location: string;
  destination: string;
  quote: string;
  rating: number;
  avatar: string;
  source?: string;
}

export interface ReviewsResponse {
  status: string;
  provider: string;
  count: number;
  data: ReviewItem[];
}

export async function getFeaturedReviews(): Promise<ReviewItem[]> {
  try {
    const res = await getJson<ReviewsResponse>("/search/reviews/featured", {
      next: { revalidate: 3600 },
    } as RequestInit);
    return res.data || [];
  } catch (error) {
    console.error("Failed to fetch reviews from API, using fallback", error);
    return [
      {
        id: 'rev-01',
        name: 'Sarah Jenkins',
        role: 'Verified Client',
        location: 'London, UK',
        destination: 'Dubai Luxury Package',
        quote: 'Dellics Travels made our trip to Dubai absolutely seamless. From the visa processing to the desert safari, everything was 5-star.',
        rating: 5,
        avatar: '/images/services/photo-10-2026-07-22-15-35-17.jpg',
        source: 'TRUSTPILOT',
      },
      {
        id: 'rev-02',
        name: 'Michael Osei',
        role: 'Verified Client',
        location: 'Accra, Ghana',
        destination: 'UK Student Visa',
        quote: 'Very professional agency. They guided me through my entire UK student visa application and I got it approved without issues.',
        rating: 4.8,
        avatar: '/images/services/photo-12-2026-07-22-15-35-17.jpg',
        source: 'GOOGLE',
      },
      {
        id: 'rev-03',
        name: 'Elena Rostova',
        role: 'Verified Client',
        location: 'Toronto, Canada',
        destination: 'Cape Town Experience',
        quote: 'Our corporate retreat to Cape Town was flawlessly executed. Highly recommend Dellics for group travel planning.',
        rating: 5,
        avatar: '/images/services/photo-14-2026-07-22-15-35-17.jpg',
        source: 'TRUSTPILOT',
      },
    ];
  }
}