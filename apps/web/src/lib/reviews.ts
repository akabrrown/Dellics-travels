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
        id: "rev-01",
        name: "Dr. Kwabena Mensah",
        role: "Medical Director",
        location: "Accra, Ghana",
        destination: "Dubai 7-Day Luxury Tour",
        quote: "Dellics Travels handled our family vacation to Dubai flawlessly. From Emirates flight reservations to private desert safari and Marina yacht cruise, every detail was 5-star perfection.",
        rating: 4.5,
        avatar: "/images/services/photo-10-2026-07-22-15-35-17.jpg",
      },
      {
        id: "rev-02",
        name: "Afia Osei-Bonsu",
        role: "Fintech Executive",
        location: "London, UK (Diaspora)",
        destination: "Ghana Heritage & Cape Coast Tour",
        quote: "As someone visiting Ghana from the UK with friends, Dellics gave us the most authentic cultural immersion. The VIP airport protocol and Safari Valley trip made our Year of Return experience unforgettable.",
        rating: 4.5,
        avatar: "/images/services/photo-12-2026-07-22-15-35-17.jpg",
      },
      {
        id: "rev-03",
        name: "Emmanuel Tetteh",
        role: "Corporate Operations Lead",
        location: "Tema, Ghana",
        destination: "South Africa Cape Town Package",
        quote: "Our company annual executive retreat in Cape Town was planned from scratch by Dellics. Flawless flight connections, stunning Table Mountain views, and top-tier hospitality. Highly recommended!",
        rating: 4.0,
        avatar: "/images/services/photo-14-2026-07-22-15-35-17.jpg",
      },
    ];
  }
}
