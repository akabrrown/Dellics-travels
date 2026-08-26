import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CtaBannerProps {
  title: string;
  copy?: string;
  label?: string;
  href?: string;
}

export function CtaBanner({ title, copy, label = "Start an inquiry", href = "/inquire" }: CtaBannerProps) {
  return (
    <section className="bg-navy px-4 py-16 text-center text-white">
      <h2 className="font-display text-3xl font-bold">{title}</h2>
      {copy ? <p className="mx-auto mt-3 max-w-xl text-white/75">{copy}</p> : null}
      <Button asChild size="lg" className="mt-8 rounded-pill bg-brand-orange hover:bg-brand-orange/90">
        <Link href={href}>{label}</Link>
      </Button>
    </section>
  );
}
