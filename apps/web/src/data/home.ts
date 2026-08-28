export interface HeroSlide {
  type: "image" | "video";
  src: string;
  badge: string;
  caption: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    type: "image",
    src: "/images/services/hotel-and-airbnb.jpg",
    badge: "Verified Global Stays",
    caption: "Luxury Hotels and Private Stays Across 190+ Countries",
    subtitle: "From 5-star Dubai suites to beachfront apartments in Cape Town. Itemized room taxes with confirmed booking vouchers.",
    ctaText: "Browse Stays",
    ctaHref: "/hotels",
  },
  {
    type: "image",
    src: "/images/africa/serengeti-national-park.jpg",
    badge: "Curated International Tours",
    caption: "Guided Safari Expeditions and Multi-Country Routes",
    subtitle: "Custom private itineraries across Serengeti, Maasai Mara, and South Africa led by licensed local guides.",
    ctaText: "View Itineraries",
    ctaHref: "/tours",
  },
  {
    type: "image",
    src: "/images/services/corporate-travel-management.jpg",
    badge: "IATA Certified Agency",
    caption: "Direct Airline Ticketing and Group Corporate Fares",
    subtitle: "Direct issuance on Emirates, Qatar Airways, Delta, and British Airways with zero third-party broker markups.",
    ctaText: "Request Flight Quote",
    ctaHref: "/flights",
  },
  {
    type: "image",
    src: "/images/services/airport-transfer-services.jpg",
    badge: "VIP Chauffeur Fleet",
    caption: "Flight-Tracked Airport Transfers in Accra and Beyond",
    subtitle: "Reliable Kotoka International (ACC) meet-and-greet with vetted air-conditioned executive sedans and SUVs.",
    ctaText: "Book Chauffeur",
    ctaHref: "/transfers",
  },
];

export const HOME_STATS = [
  { value: "5,000+", label: "Delighted Travelers", description: "" },
  { value: "40+", label: "Global Destinations", description: "Over 5 Continents" },
  { value: "99.4%", label: "Visa Approval Rate", description: "Expert Document Prep" },
  { value: "24/7", label: "VIP Travel Concierge", description: "Dedicated Client Support" },
];

export interface Testimonial {
  name: string;
  role: string;
  location: string;
  destination: string;
  quote: string;
  rating: number;
  avatar: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dr. Kwabena Mensah",
    role: "Medical Director",
    location: "Accra, Ghana",
    destination: "Dubai 7-Day Luxury Tour",
    quote: "Dellics Travels handled our family vacation to Dubai flawlessly. From Emirates flight reservations to private desert safari and Marina yacht cruise, every detail was 5-star perfection.",
    rating: 5,
    avatar: "/images/services/photo-10-2026-07-22-15-35-17.jpg",
  },
  {
    name: "Afia Osei-Bonsu",
    role: "Fintech Executive",
    location: "London, UK (Diaspora)",
    destination: "Ghana Heritage & Cape Coast Tour",
    quote: "As someone visiting Ghana from the UK with friends, Dellics gave us the most authentic cultural immersion. The VIP airport protocol and Safari Valley trip made our Year of Return experience unforgettable.",
    rating: 5,
    avatar: "/images/services/photo-12-2026-07-22-15-35-17.jpg",
  },
  {
    name: "Emmanuel Tetteh",
    role: "Corporate Operations Lead",
    location: "Tema, Ghana",
    destination: "South Africa Cape Town Package",
    quote: "Our company annual executive retreat in Cape Town was planned from scratch by Dellics. Flawless flight connections, stunning Table Mountain views, and top-tier hospitality. Highly recommended!",
    rating: 5,
    avatar: "/images/services/photo-14-2026-07-22-15-35-17.jpg",
  },
];

export const WHY_CHOOSE_US = [
  {
    title: "IATA Certified Agency",
    description: "Official IATA Certified travel management agency. Your bookings and financial transactions are 100% safeguarded.",
    icon: "shield",
  },
  {
    title: "Direct Wholesale Rates",
    description: "Direct partnerships with RateHawk, Amadeus, and top global airlines ensure you never pay inflated middleman fees.",
    icon: "sparkles",
  },
  {
    title: "Dedicated 24/7 Human Concierge",
    description: "No automated bots or unanswered emails. Reach certified travel specialists on WhatsApp within minutes around the clock.",
    icon: "headset",
  },
  {
    title: "End-to-End Travel Logistics",
    description: "We handle flights, stays, airport transfers, visa document advisory, travel insurance, and curated sightseeing under one roof.",
    icon: "globe",
  },
];
