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
    return [];
  }
}
