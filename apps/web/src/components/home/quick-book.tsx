"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const TABS = [
  { value: "flights", label: "Flights", href: "/flights", copy: "Compare and book domestic and international flights with IATA-accredited experts." },
  { value: "tours", label: "Tours", href: "/tours", copy: "Curated tour packages across Africa, Asia, Europe, the Middle East and the Americas." },
  { value: "hotels", label: "Hotels", href: "/hotels", copy: "Live hotel availability worldwide via our RateHawk partnership." },
  { value: "transfers", label: "Transfers", href: "/transfers", copy: "Reliable airport pickups and city transfers, meet-and-greet included." },
];

export function QuickBook() {
  return (
    <div className="mx-auto w-full max-w-4xl rounded-card bg-white p-6 shadow-xl">
      <Tabs defaultValue="flights">
        <TabsList className="h-auto flex-wrap justify-start rounded-field">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="rounded-pill data-[state=active]:bg-brand-orange data-[state=active]:text-white">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-body">{tab.copy}</p>
            <Button asChild className="shrink-0 rounded-pill bg-brand-orange hover:bg-brand-orange/90">
              <Link href={tab.href}>Book {tab.label}</Link>
            </Button>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
