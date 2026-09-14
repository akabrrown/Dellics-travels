export interface HeroSlide {
  type: "image" | "video";
  src: string;
  poster?: string;
  caption?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    type: "video",
    src: "/videos/Dellics_Travels_to43m0.mp4",
    poster: "/images/services/hotel-and-airbnb.jpg",
    caption: "Dellics Travels — IATA Certified Global Luxury Travel Management",
    subtitle: "Worldwide flight ticketing, bespoke holiday packages, corporate travel, visa advisory, and VIP concierge.",
    ctaText: "Explore Services",
    ctaHref: "#services",
  },
  {
    type: "image",
    src: "/images/services/hotel-and-airbnb.jpg",
    caption: "Luxury Hotels and Private Stays Across 190+ Countries",
    subtitle: "From 5-star Dubai suites to beachfront apartments in Cape Town. Itemized room taxes with confirmed booking vouchers.",
    ctaText: "Browse Stays",
    ctaHref: "/hotels",
  },
  {
    type: "image",
    src: "/images/africa/serengeti-national-park.jpg",
    caption: "Guided Safari Expeditions and Multi-Country Routes",
    subtitle: "Custom private itineraries across Serengeti, Maasai Mara, and South Africa led by licensed local guides.",
    ctaText: "View Itineraries",
    ctaHref: "/tours",
  },
  {
    type: "image",
    src: "/images/services/corporate-travel-management.jpg",
    caption: "Direct Airline Ticketing and Group Corporate Fares",
    subtitle: "Direct issuance on Emirates, Qatar Airways, Delta, and British Airways with zero third-party broker markups.",
    ctaText: "Request Flight Quote",
    ctaHref: "/flights",
  },
  {
    type: "image",
    src: "/images/services/airport-transfer-services.jpg",
    caption: "Flight-Tracked Airport Transfers in Accra and Beyond",
    subtitle: "Reliable Kotoka International (ACC) meet-and-greet with vetted air-conditioned executive sedans and SUVs.",
    ctaText: "Book Airport Transfer",
    ctaHref: "/transfers",
  },
];

export const FLIGHT_HERO_SLIDES: HeroSlide[] = [
  {
    type: "video",
    src: "/videos/Affordable_Flight_Booking_om36kr.mp4",
    poster: "/images/services/plane.jpg",
    caption: "Affordable Global Airline Tickets & Direct Fares",
    subtitle: "IATA Certified airline ticketing across 500+ global carriers with zero hidden fees and instant PNR issuance.",
    ctaText: "Search Flights",
    ctaHref: "#search",
  },
  {
    type: "image",
    src: "/images/services/plane.jpg",
    caption: "Direct Airline Ticketing and Group Corporate Fares",
    subtitle: "Direct issuance on Emirates, Qatar Airways, Delta, and British Airways with zero broker markups.",
    ctaText: "Explore Routes",
    ctaHref: "#routes",
  },
  {
    type: "image",
    src: "/images/middle-east/burj-khalifa.jpg",
    caption: "Premier Long-Haul & Regional Flight Routes",
    subtitle: "Exclusive contracted fares to Dubai, London, New York, Johannesburg, and Amsterdam.",
    ctaText: "View Popular Routes",
    ctaHref: "#routes",
  },
  {
    type: "image",
    src: "/images/europe/paris-and-eiffel-tower.jpg",
    caption: "Seamless European & Transatlantic Connections",
    subtitle: "Round-trip executive and economy fares with verified baggage allowances.",
    ctaText: "Book Flights",
    ctaHref: "#search",
  },
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
    rating: 4.5,
    avatar: "/images/services/photo-10-2026-07-22-15-35-17.jpg",
  },
  {
    name: "Afia Osei-Bonsu",
    role: "Fintech Executive",
    location: "London, UK (Diaspora)",
    destination: "Ghana Heritage & Cape Coast Tour",
    quote: "As someone visiting Ghana from the UK with friends, Dellics gave us the most authentic cultural immersion. The VIP airport protocol and Safari Valley trip made our Year of Return experience unforgettable.",
    rating: 4.5,
    avatar: "/images/services/photo-12-2026-07-22-15-35-17.jpg",
  },
  {
    name: "Emmanuel Tetteh",
    role: "Corporate Operations Lead",
    location: "Tema, Ghana",
    destination: "South Africa Cape Town Package",
    quote: "Our company annual executive retreat in Cape Town was planned from scratch by Dellics. Flawless flight connections, stunning Table Mountain views, and top-tier hospitality. Highly recommended!",
    rating: 4.0,
    avatar: "/images/services/photo-14-2026-07-22-15-35-17.jpg",
  },
];

