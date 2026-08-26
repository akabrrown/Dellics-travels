import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHero({ title, subtitle, className }: PageHeroProps) {
  return (
    <section className={cn("bg-ink px-4 py-20 text-center text-white", className)}>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">{title}</h1>
      {subtitle ? (
        <p className="mx-auto mt-4 max-w-2xl text-white/75">{subtitle}</p>
      ) : null}
    </section>
  );
}
