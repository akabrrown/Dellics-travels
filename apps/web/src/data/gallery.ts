export interface GalleryItem {
  src: string; // path under public/images/
  alt: string;
}

// One entry per photo shown on the legacy gallery page, using the
// kebab-cased files copied in Task 2. Keep the legacy ordering.
export const GALLERY_ITEMS: GalleryItem[] = [
  { src: "/images/services/south-africa.jpg", alt: "South Africa safari adventure" },
  { src: "/images/services/dubai-fun.jpg", alt: "Dubai city adventure" },
  { src: "/images/services/kenya-cultural-fun.jpg", alt: "Kenya cultural experience" },
  { src: "/images/services/kenya-safari-adventure.jpg", alt: "Kenya Safari Adventure" },
  { src: "/images/services/dubai-camel-ride.jpg", alt: "Dubai desert experience" },
  { src: "/images/services/tanzania.jpg", alt: "Tanzania safari experience" },
  { src: "/images/services/zanzibar-beach-fun.jpg", alt: "Zanzibar beach paradise" },
  { src: "/images/services/dubai-tours.jpg", alt: "Dubai city tours" },
  {
    src: "/images/services/south-africa-cape-town-villa.jpg",
    alt: "South Africa luxury accommodation",
  },
  {
    src: "/images/africa/cape-coast-castle.jpg",
    alt: "Clients at Door of Return Cape Coast Castle Ghana",
  },
  {
    src: "/images/services/photo-10-2026-07-22-15-35-17.jpg",
    alt: "Ghana tour clients smiling",
  },
  {
    src: "/images/services/photo-12-2026-07-22-15-35-17.jpg",
    alt: "Ghana historical site visit",
  },
  {
    src: "/images/services/photo-14-2026-07-22-15-35-17.jpg",
    alt: "Ghana heritage site tour",
  },
  {
    src: "/images/services/photo-20-2026-07-22-15-35-17.jpg",
    alt: "Cape Coast Ghana tour group",
  },
  {
    src: "/images/africa/kakum-canopy-walkway.jpg",
    alt: "Kakum Canopy Walkway Ghana",
  },
  {
    src: "/images/services/photo-13-2026-07-22-15-35-17.jpg",
    alt: "Ghana cultural experience tour",
  },
];
