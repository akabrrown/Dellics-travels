import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Hotels & Stays Worldwide",
  description:
    "Search over 3.3 million verified luxury hotels, boutique apartments & beach resorts worldwide with live wholesale rates from RateHawk.",
};

export default function HotelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
