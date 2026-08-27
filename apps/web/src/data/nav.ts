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
  { label: "Hotels", href: "/hotels" },
  { label: "Tours", href: "/tours" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "All Services Overview", href: "/services" },
      { label: "Airport Transfers", href: "/transfers" },
      { label: "Visa Assistance", href: "/visa" },
      { label: "Corporate Travel", href: "/corporate" },
      { label: "Diaspora Travel", href: "/diaspora" },
    ],
  },
  { label: "Login", href: "/signin" },
];
