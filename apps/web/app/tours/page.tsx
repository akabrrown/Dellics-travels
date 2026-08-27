import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next/types";
import {
  CheckCircle2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Plane,
  Building2,
  Car,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { CtaBanner } from "@/components/cta-banner";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "International Tour Packages & Safari Holidays",
  description:
    "Book luxury guided international tours with Dellics Travels. South Africa Cape Town, Dubai, Kenya, Zanzibar, Safari Valley Ghana and more.",
};

const TOURS = [
  {
    name: "5 Nights in Cape Town Luxury Experience",
    destination: "Cape Town, South Africa",
    price: "$1,899",
    duration: "6 Days / 5 Nights",
    badge: "Most Popular",
    image: "/images/africa/cape-town-and-table-mountain.jpg",
    copy: "Discover the Mother City where adventure meets luxury! From Table Mountain cableway and Cape Point penguin encounters to world-class shopping at V&A Waterfront.",
    includes: [
      "Table Mountain Cableway Ticket",
      "Cape Point & Boulders Beach",
      "Penguin Colony Sanctuary",
      "V&A Waterfront Shopping Tour",
      "4-Star Luxury Accommodation",
      "Daily Gourmet Breakfast",
      "Return Airport Transfers",
    ],
  },
  {
    name: "Safari Valley Eco Resort Full Day Escape",
    destination: "Okere Hills, Ghana",
    price: "$150",
    duration: "Full Day Tour",
    badge: "Ghana Luxury",
    image: "/images/services/day-tip-to-safari-valley.jpg",
    copy: "Ghana's premier luxury eco-retreat escape. Experience pure nature, exotic wildlife encounters, kayaking, and outdoor dining in the tranquil Okere Hills.",
    includes: [
      "Resort Entrance & Conservation Fee",
      "Buffet Gourmet Lunch",
      "Swimming Pool & Kayaking Access",
      "Guided Wildlife Encounter",
      "Professional Tour Host",
      "Round-trip AC Transport from Accra",
    ],
  },
  {
    name: "Winter in Dubai Luxury Holiday",
    destination: "Dubai, United Arab Emirates",
    price: "$1,890",
    duration: "7 Days / 6 Nights",
    badge: "Bestseller",
    image: "/images/services/winter-dubai.jpg",
    copy: "Experience the ultimate Arabian luxury escape! Includes Emirates flights, Dubai Mall shopping, desert dune bashing safari with BBQ dinner, and Marina yacht cruise.",
    includes: [
      "Return Emirates Flights from Accra",
      "Guided Luxury Shopping Tours",
      "Desert Dune Safari with BBQ Dinner",
      "4-Star Hotel Accommodation",
      "Airport Transfers in Executive AC Van",
      "Dubai Tourist Visa & Tourism Tax",
    ],
  },
  {
    name: "Feel South Africa & Kruger Safari",
    destination: "Johannesburg & Kruger, South Africa",
    price: "$1,450",
    duration: "5 Days / 4 Nights",
    badge: "Wildlife Adventure",
    image: "/images/services/south-africa.jpg",
    copy: "Explore the soul of South Africa! From the vibrant heartbeat of Johannesburg and Soweto heritage to thrilling Big 5 game drives in Kruger National Park.",
    includes: [
      "Return Flights to Johannesburg",
      "Guided Daily Breakfast",
      "Return Airport Transfers",
      "4-Star Hotel Stay in Sandton",
      "Full Day Big 5 Safari Game Drive",
      "24/7 On-ground Travel Host",
    ],
  },
  {
    name: "Dubai & Nairobi Dual-City Mix",
    destination: "Dubai (UAE) & Nairobi (Kenya)",
    price: "$1,750",
    duration: "10 Days / 9 Nights",
    badge: "Dual City",
    image: "/images/services/kenya-fun.jpg",
    copy: "The ultimate dual-city vacation! Experience the futuristic glamor of Dubai skyscrapers followed by the wild beauty of Nairobi's national park and giraffe sanctuary.",
    includes: [
      "Multi-destination Flights (ACC-DXB-NBO-ACC)",
      "All Airport & Intercity Transfers",
      "Top-rated 4-Star Stays in Both Cities",
      "Daily Breakfast Buffets",
      "Nairobi Giraffe Centre & Safari Drive",
      "Dubai City Tour & Desert Safari",
    ],
  },
  {
    name: "Summer in Dubai Family Special",
    destination: "Dubai, United Arab Emirates",
    price: "$1,790",
    duration: "6 Days / 5 Nights",
    badge: "Family Special",
    image: "/images/services/dubai-fun.jpg",
    copy: "Create lifelong memories with the whole family in Dubai! Waterparks, underwater aquariums, luxury desert camps, and tax-free shopping malls.",
    includes: [
      "Emirates Return Flights",
      "Atlantis Aquaventure Waterpark",
      "Dubai Miracle Garden & Global Village",
      "Executive Hotel Accommodation",
      "Private Family Airport Transfers",
      "Desert Safari & Falcon Show",
    ],
  },
  {
    name: "Zanzibar Island & Stone Town Tropical Tour",
    destination: "Zanzibar & Tanzania",
    price: "$1,850",
    duration: "5 Days / 4 Nights",
    badge: "Tropical Paradise",
    image: "/images/services/zanzibar-beach-fun.jpg",
    copy: "Sink your toes into the powdery white sands of Nungwi Beach. Explore ancient Stone Town alleyways, fragrant spice farms, and crystal clear coral snorkeling reefs.",
    includes: [
      "Beachfront Luxury Resort Stay",
      "Prison Island & Giant Tortoises Tour",
      "Spice Farm Guided Expedition",
      "Stone Town UNESCO Heritage Walk",
      "Return Airport Transfers",
      "Daily Breakfast & Seafood Dinner",
    ],
  },
  {
    name: "Kenya Wildlife & Amboseli Kilimanjaro Safari",
    destination: "Kenya & Maasai Mara",
    price: "$1,950",
    duration: "6 Days / 5 Nights",
    badge: "Big 5 Safari",
    image: "/images/services/kenya-safari-adventure.jpg",
    copy: "Witness majestic elephant herds against the snow-capped backdrop of Mount Kilimanjaro in Amboseli and the legendary predators of the Maasai Mara.",
    includes: [
      "Custom 4x4 Safari Land Cruiser with Pop-up Roof",
      "Park Entry & Conservation Fees",
      "Luxury Safari Tented Camp Stays",
      "Full Board Gourmet Meals on Safari",
      "Experienced Professional Naturalist Guide",
      "Return Domestic Transfers",
    ],
  },
];

const TOUR_PROMISES = [
  {
    icon: ShieldCheck,
    title: "100% Guaranteed Departures",
    description: "Once your booking is confirmed, your tour is guaranteed to operate without sudden minimum-group cancellations.",
  },
  {
    icon: Plane,
    title: "All-Inclusive Flight & Visa Options",
    description: "Unlike standard tour companies, we handle your return flights, transit logistics, and visa processing directly under one booking.",
  },
  {
    icon: Building2,
    title: "Hand-Picked 4 & 5-Star Accommodations",
    description: "Every hotel and safari lodge in our packages is vetted for cleanliness, security, scenic location, and world-class hospitality.",
  },
  {
    icon: Car,
    title: "Private Airport & Tour Transport",
    description: "Travel comfortably in modern air-conditioned private vehicles with dedicated drivers and English-speaking tour guides.",
  },
];

export default function ToursPage() {
  return (
    <>
      <PageHero
        title="International Tour Packages & Safaris"
        subtitle="Carefully crafted holiday experiences by local experts across Africa, Europe, the Middle East, and Asia with transparent pricing."
        badge="Curated Travel Packages"
        image="/images/africa/serengeti-national-park.jpg"
        breadcrumbs={[{ label: "Tours & Packages" }]}
      />

      {/* Tour Packages Catalog */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Curated Experiences"
          title="Explore Our Signature Tour Packages"
          subtitle="Every tour is designed to give you an authentic, meaningful and hassle-free vacation with all logistics handled."
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {TOURS.map((tour) => (
            <article
              key={tour.name}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-brand-orange px-3.5 py-1 text-xs font-bold text-white shadow-md">
                  {tour.badge}
                </span>
                <span className="absolute right-4 top-4 rounded-full bg-navy-dark/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {tour.duration}
                </span>
                <div className="absolute left-4 bottom-3 flex items-center gap-1 text-xs text-white/90 font-medium">
                  <MapPin className="size-3.5 text-brand-orange" />
                  <span>{tour.destination}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold text-navy">
                  {tour.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {tour.copy}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy mb-2.5">
                    Package Inclusions:
                  </p>
                  <ul className="grid gap-1.5 sm:grid-cols-2 text-xs text-slate-700">
                    {tour.includes.map((include) => (
                      <li key={include} className="flex items-center gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{include}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                  <div>
                    <span className="block text-[11px] text-slate-500 uppercase tracking-wider">Starting From</span>
                    <span className="font-display text-2xl font-extrabold text-brand-orange">{tour.price}</span>
                    <span className="text-xs text-slate-500 font-normal"> / person</span>
                  </div>

                  <Link
                    href={`/inquire?service=tours&tour=${encodeURIComponent(tour.name)}&destination=${encodeURIComponent(tour.destination)}&price=${encodeURIComponent(tour.price)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-6 py-2.5 text-sm shadow-md transition-all"
                  >
                    <span>Inquire Package</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Why Book Tour Packages with Dellics */}
      <section className="bg-slate-50 py-24 border-y border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Dellics Guarantee"
            title="What Makes Our Tours Exceptional"
            subtitle="Every detail from your first airport welcome to your return departure is managed with care."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TOUR_PROMISES.map((promise) => {
              const Icon = promise.icon;
              return (
                <div
                  key={promise.title}
                  className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange mb-4">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-display text-base font-bold text-navy mb-2">
                    {promise.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {promise.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Need a Fully Customized Tour Package?"
        copy="We build personalized private itineraries tailored to your exact dates, group size, budget and interests. Tell us your dream destination and we will handle the rest."
        label="Design My Custom Tour"
        href="/inquire"
      />
    </>
  );
}
