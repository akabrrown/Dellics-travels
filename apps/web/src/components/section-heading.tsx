import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <div className="mb-3 inline-flex items-center gap-2 rounded-pill bg-brand-orange/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange">
          <span className="size-1.5 rounded-full bg-brand-orange" />
          {eyebrow}
        </div>
      ) : null}
      <h2
        className={cn(
          "font-display text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-4.5xl",
          dark ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-3.5 text-base sm:text-lg leading-relaxed",
            dark ? "text-white/75 font-light" : "text-slate-600",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
