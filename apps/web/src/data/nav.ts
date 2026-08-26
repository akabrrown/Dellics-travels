export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Flights", href: "/flights" },
  {
    label: "Hotels & Stays",
    href: "/hotels",
    children: [
      { label: "Hotels & Airbnb", href: "/hotels" },
      { label: "Tours & Packages", href: "/tours" },
    ],
  },
  {
    label: "Destinations",
    href: "/destinations",
    children: [
      { label: "Africa", href: "/destinations/africa" },
      { label: "Asia", href: "/destinations/asia" },
      { label: "Europe", href: "/destinations/europe" },
      { label: "Middle East", href: "/destinations/middle-east" },
      { label: "North America", href: "/destinations/north-america" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Airport Transfers", href: "/transfers" },
      { label: "Visa Assistance", href: "/visa" },
      { label: "Corporate Travel", href: "/corporate" },
      { label: "Diaspora Travel", href: "/diaspora" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];
