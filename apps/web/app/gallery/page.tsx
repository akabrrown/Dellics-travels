import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { GalleryGrid } from "@/components/gallery/lightbox";
import { CtaBanner } from "@/components/cta-banner";
import { GALLERY_ITEMS } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Travel Moments & Photo Gallery",
  description:
    "Explore authentic client photos from Dellics Travels guided tours, safaris, Ghana heritage pilgrimages, and luxury stays around the world.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="Travel Moments & Client Adventures"
        subtitle="Real memories from our travelers across Ghana, South Africa, Dubai, Kenya, Tanzania, Europe, and beyond."
        badge="Real Client Moments"
        image="/images/africa/cape-coast-castle.jpg"
        breadcrumbs={[{ label: "Gallery" }]}
      />
      <GalleryGrid items={GALLERY_ITEMS} />
      <CtaBanner
        title="Ready to Create Your Own Travel Memories?"
        copy="Let us plan your next safari, beach vacation, or heritage homecoming trip with complete peace of mind."
        label="Start Your Travel Plan"
        href="/inquire"
      />
    </>
  );
}
