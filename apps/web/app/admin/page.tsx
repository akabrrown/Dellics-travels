import type { Metadata } from "next/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "The Dellics Travels admin portal is a separate application.",
  robots: { index: false },
};

export default function AdminPage() {
  return (
    <section className="bg-ink px-4 py-32 text-center text-white">
      <h1 className="font-display text-4xl font-bold">Admin portal</h1>
      <p className="mx-auto mt-4 max-w-md text-white/70">
        The Dellics Travels admin portal is a separate application and is not
        hosted on this website.
      </p>
      <Button asChild className="mt-8 rounded-pill bg-brand-orange hover:bg-brand-orange/90">
        <Link href="/">Back to home</Link>
      </Button>
    </section>
  );
}
