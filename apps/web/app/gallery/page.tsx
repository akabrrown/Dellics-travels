import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { GalleryGrid } from "@/components/gallery/lightbox";
import { GALLERY_ITEMS } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from Dellics Travels tours, trips and partner hotels around the world.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero title="Gallery" subtitle="Moments from journeys we've planned." />
      <GalleryGrid items={GALLERY_ITEMS} />
    </>
  );
}
