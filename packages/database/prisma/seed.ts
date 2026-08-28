import { PrismaClient, Role, MembershipTier, InquiryKind } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Supabase Database Seed (Catalog & Infrastructure)...");

  // 1. Seed Tour Packages
  const packages = [

    {
      slug: "cape-coast-elmina-heritage-tour",
      title: "Cape Coast & Elmina Castle Heritage Immersion",
      destination: "Central Region, Ghana",
      price: 450.0,
      currency: "USD",
      duration: "3 Days / 2 Nights",
      badge: "Year of Return Favorite",
      image_url: "/images/packages/cape-coast-tour.jpg",
      overview: "Walk the sacred corridors of Cape Coast and Elmina Castles, traverse the Kakum National Park canopy walkway, and engage with traditional paramount chiefs.",
      includes: [
        "Executive AC Van with Private Chauffeur",
        "Beachfront Resort Stay at Coconut Grove",
        "Official Certified Historian Guides",
        "All Castle & Park Entry Tolls",
        "Daily Breakfast & Authentic Coastal Dinners",
      ],
      highlights: [
        "Door of No Return Memorial Ceremony",
        "Kakum Rainforest 40m Canopy Walk",
        "Fante Cultural Drumming & Cuisine",
      ],
      is_featured: true,
    },
    {
      slug: "safari-valley-luxury-escape",
      title: "Safari Valley Luxury Eco-Resort & Wildlife Retreat",
      destination: "Eastern Region, Ghana",
      price: 850.0,
      currency: "USD",
      duration: "2 Days / 1 Night",
      badge: "VIP Luxury",
      image_url: "/images/packages/safari-valley.jpg",
      overview: "Experience West Africa's premier luxury eco-park. Encounter gazelles, zebras, and peacocks while staying in 5-star handcrafted chalets with infinity pools.",
      includes: [
        "Private Luxury 4x4 Transportation",
        "Exclusive Cabin Suite with Plunge Pool",
        "Guided Wildlife Game Safari & Horseback Riding",
        "All Gourmet Meals & Premium Refreshments",
        "Spa & Wellness Session",
      ],
      highlights: [
        "Sunset Safari with Exotic Fauna",
        "Farm-to-Table Gourmet Dining",
        "Canopy Biking & Golf Course Access",
      ],
      is_featured: true,
    },
    {
      slug: "dubai-luxury-marina-desert-escape",
      title: "Dubai 5-Night Luxury Marina & Desert Dunes Safari",
      destination: "Dubai, United Arab Emirates",
      price: 1450.0,
      currency: "USD",
      duration: "6 Days / 5 Nights",
      badge: "Best Seller",
      image_url: "/images/packages/dubai-luxury.jpg",
      overview: "A comprehensive international luxury escape: 5-star Marina hotel stay, Red Dune 4x4 safari with VIP BBQ, private yacht cruise, and Burj Khalifa At The Top access.",
      includes: [
        "5-Star Marina Hotel Stay with Breakfast",
        "Return Airport VIP Executive Transfer",
        "Red Dune Desert Safari with VIP Camp & BBQ",
        "2-Hour Private Luxury Yacht Cruise",
        "Burj Khalifa 124th/125th Floor Fast-Track Tickets",
        "Dubai Mall & Fountain Show Protocol",
      ],
      highlights: [
        "Sunset Yacht Cruise along Palm Jumeirah",
        "Desert Stargazing & Falconry",
        "Global Village & Miracle Garden Excursion",
      ],
      is_featured: true,
    },
    {
      slug: "zanzibar-serena-island-escape",
      title: "Zanzibar Island Spice & White Sands Getaway",
      destination: "Zanzibar, Tanzania",
      price: 1200.0,
      currency: "USD",
      duration: "5 Days / 4 Nights",
      badge: "Island Romance",
      image_url: "/images/packages/zanzibar-beach.jpg",
      overview: "Pristine Indian Ocean beaches, historic Stone Town alleys, fragrant organic spice plantations, and private dhow sunset sailing.",
      includes: [
        "Luxury Oceanfront Beach Villa",
        "Daily Gourmet Seafood Dinners",
        "Stone Town UNESCO Heritage Walking Tour",
        "Spice Farm Tasting & Demonstration",
        "Prison Island Giant Tortoise Sanctuary Tour",
      ],
      highlights: [
        "Sunset Traditional Dhow Cruise",
        "Snorkeling at Mnemba Atoll",
        "Stone Town Night Food Market",
      ],
      is_featured: true,
    },
  ];

  for (const pkg of packages) {
    const created = await prisma.tourPackage.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
    console.log(`✅ Upserted Tour Package: ${created.title}`);
  }

  // 3. Seed eSIM Plans
  const esimPlans = [
    {
      country_or_region: "Ghana",
      data_gb: 5.0,
      validity_days: 30,
      price: 18.0,
      airalo_package_id: "ghana-5gb-30d",
    },
    {
      country_or_region: "United Arab Emirates",
      data_gb: 10.0,
      validity_days: 30,
      price: 28.0,
      airalo_package_id: "uae-10gb-30d",
    },
    {
      country_or_region: "United Kingdom",
      data_gb: 10.0,
      validity_days: 30,
      price: 22.0,
      airalo_package_id: "uk-10gb-30d",
    },
    {
      country_or_region: "United States",
      data_gb: 10.0,
      validity_days: 30,
      price: 26.0,
      airalo_package_id: "usa-10gb-30d",
    },
    {
      country_or_region: "Global (130+ Countries)",
      data_gb: 20.0,
      validity_days: 365,
      price: 65.0,
      airalo_package_id: "global-20gb-365d",
    },
  ];

  for (const plan of esimPlans) {
    const createdPlan = await prisma.eSIMPlan.upsert({
      where: { airalo_package_id: plan.airalo_package_id },
      update: plan,
      create: plan,
    });
    console.log(`✅ Upserted eSIM Plan: ${createdPlan.country_or_region} ${createdPlan.data_gb}GB`);
  }

  console.log("✨ Supabase Database Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
