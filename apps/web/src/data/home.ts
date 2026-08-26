export interface HeroSlide {
  type: "image" | "video";
  src: string;
  caption: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  { type: "video", src: "/videos/hotels.mp4", caption: "Hotels & Airbnb worldwide" },
  { type: "image", src: "/images/services/tanzania.jpg", caption: "Curated tours across 5 continents" },
  { type: "video", src: "/videos/airport-transfers.mp4", caption: "Seamless airport transfers" },
];

export const HOME_STATS = [
  { value: "3,000+", label: "Happy travelers" },
  { value: "40+", label: "Destinations served" },
  { value: "4.9", label: "Client rating" },
  { value: "24/7", label: "Support" },
];
