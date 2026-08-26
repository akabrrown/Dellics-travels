import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center" }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 font-display text-3xl font-bold text-navy">{title}</h2>
      {subtitle ? <p className="mt-3 text-slate-body">{subtitle}</p> : null}
    </div>
  );
}
