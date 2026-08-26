import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="bg-ink px-4 py-32 text-center text-white">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">404</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Page not found</h1>
      <p className="mt-4 text-white/70">The page you are looking for does not exist or has moved.</p>
      <Button asChild className="mt-8 rounded-pill bg-brand-orange hover:bg-brand-orange/90">
        <Link href="/">Back to home</Link>
      </Button>
    </section>
  );
}
