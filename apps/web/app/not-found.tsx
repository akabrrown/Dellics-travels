import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] bg-navy-dark px-4 py-28 text-center text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-orange/15 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto space-y-6">
        <div className="size-20 rounded-3xl bg-white p-2 shadow-2xl border border-white/20 mx-auto flex items-center justify-center">
          <Image
            src="/Logo.png"
            alt="Dellics Travels"
            width={72}
            height={72}
            className="size-full object-contain"
            priority
          />
        </div>

        <div>
          <span className="rounded-full bg-brand-orange/20 border border-brand-orange/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange">
            Error 404
          </span>
          <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
            Destination Not Found
          </h1>
          <p className="mt-3 text-sm text-white/75 leading-relaxed">
            The flight path or itinerary you requested doesn't exist or has been rerouted. Let's get you back on track.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 shadow-lg">
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="size-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">
            <Link href="/tours" className="inline-flex items-center gap-2">
              <span>Explore Tours</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
