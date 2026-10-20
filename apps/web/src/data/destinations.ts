export interface DestinationHighlight {
  name: string;
  image: string; // path under public/images/<region>/
  caption?: string;
}

export interface Region {
  slug: "africa" | "asia" | "europe" | "middle-east" | "north-america";
  name: string;
  tagline: string;
  intro: string[];
  highlights: DestinationHighlight[];
}

export const REGIONS: Region[] = [
  {
    slug: "africa",
    name: "Africa",
    tagline:
      "From ancient heritage sites to breathtaking natural wonders - discover the soul of the continent with expert local guides",
    intro: [
      "Experience rich history, vibrant culture, and warm hospitality in the heart of West Africa",
      "Witness the Great Migration and experience world-class wildlife encounters",
      "From Africa's highest peak to the world's largest crater",
      "Crystal clear waters, pristine beaches, and rich Swahili culture",
      "Diverse landscapes, rich history, and vibrant modern culture",
    ],
    highlights: [
      {
        name: "Cape Coast Castle",
        image: "/images/africa/cape-coast-castle.jpg",
        caption:
          "UNESCO World Heritage Site. Walk through the Door of Return and connect deeply with history. This historic fortress stands as a powerful reminder of the transatlantic slave trade and the resilience of the human spirit.",
      },
      {
        name: "Kakum Canopy Walkway",
        image: "/images/africa/kakum-canopy-walkway.jpg",
        caption:
          "Walk 40 meters above the rainforest floor on Africa's famous canopy walkway. Breathtaking views and incredible biodiversity await in this pristine national park.",
      },
      {
        name: "Accra City Experience",
        image: "/images/africa/accra-city-experience.jpg",
        caption:
          "Explore the vibrant capital city with bustling markets, beautiful beaches, and rich cultural sites including Independence Square and the Kwame Nkrumah Mausoleum.",
      },
      {
        name: "Masai Mara National Reserve",
        image: "/images/africa/serengeti-national-park.jpg",
        caption:
          "Home to the Great Migration and the Big Five. Experience world-class game drives with expert Maasai guides in this iconic savanna landscape.",
      },
      {
        name: "Amboseli National Park",
        image: "/images/africa/amboseli-national-park.jpg",
        caption:
          "Famous for large elephant herds with spectacular views of Mount Kilimanjaro. Perfect for wildlife photography and cultural encounters with Maasai communities.",
      },
      {
        name: "Lake Nakuru National Park",
        image: "/images/africa/lake-nakuru-national-park.jpg",
        caption:
          "Famous for its millions of pink flamingos and rhino sanctuary. A birdwatcher's paradise with diverse wildlife and beautiful alkaline lake landscapes.",
      },
      {
        name: "Serengeti National Park",
        image: "/images/africa/serengeti-national-park.jpg",
        caption:
          "Endless plains teeming with wildlife. Witness the annual Great Migration where millions of wildebeest and zebras traverse the landscape in search of greener pastures.",
      },
      {
        name: "Ngorongoro Crater",
        image: "/images/africa/ngorongoro-crater.jpg",
        caption:
          "World's largest unfilled volcanic caldera and UNESCO World Heritage Site. A natural enclosure hosting dense wildlife populations including the rare black rhino.",
      },
      {
        name: "Mount Kilimanjaro",
        image: "/images/africa/mount-kilimanjaro.jpg",
        caption:
          "Africa's highest peak and one of the Seven Summits. Challenge yourself with various climbing routes through diverse ecological zones to the snow-capped summit.",
      },
      {
        name: "Stone Town",
        image: "/images/africa/stone-town.jpg",
        caption:
          "UNESCO World Heritage Site with winding alleys, historic buildings, and rich Swahili-Arab culture. Explore slave markets, spice markets, and beautiful architecture.",
      },
      {
        name: "Nungwi Beach",
        image: "/images/africa/nungwi-beach.jpg",
        caption:
          "Pristine white sand beaches with crystal clear turquoise waters. Perfect for swimming, snorkeling, and watching breathtaking sunsets over the Indian Ocean.",
      },
      {
        name: "Spice Tours",
        image: "/images/africa/spice-tours.jpg",
        caption:
          "Discover why Zanzibar is called the Spice Island. Tour aromatic plantations with cloves, cinnamon, cardamom, and learn about the island's spice trade history.",
      },
      {
        name: "Cape Town & Table Mountain",
        image: "/images/africa/cape-town-and-table-mountain.jpg",
        caption:
          "One of the world's most beautiful cities with iconic Table Mountain, stunning beaches, and vibrant neighborhoods. Take the cable car for panoramic views of the city and ocean.",
      },
      {
        name: "Kruger National Park",
        image: "/images/africa/kruger-national-park.jpg",
        caption:
          "One of Africa's largest game reserves with incredible diversity of wildlife including the Big Five. Self-drive or guided safari options available in this pristine wilderness.",
      },
      {
        name: "Garden Route",
        image: "/images/africa/garden-route.jpg",
        caption:
          "Stunning coastal drive with beautiful beaches, ancient forests, and charming towns. Perfect for road trips with whale watching, hiking, and outdoor adventures.",
      },
    ],
  },
  {
    slug: "asia",
    name: "Asia",
    tagline:
      "From futuristic city-states to tropical paradise islands - discover the diversity and beauty of Southeast Asia",
    intro: [
      "Experience the perfect blend of modern innovation, multicultural heritage, and green urban living",
      "Discover cultural diversity, modern cities, and pristine natural wonders",
      "Experience tropical paradise, ancient temples, and rich cultural heritage",
    ],
    highlights: [
      {
        name: "Marina Bay Sands",
        image: "/images/asia/marina-bay-sands.jpg",
        caption:
          "Architectural marvel with the famous infinity pool overlooking the city skyline. Visit the SkyPark observation deck, explore the luxury mall, and enjoy spectacular light shows at Gardens by the Bay.",
      },
      {
        name: "Gardens by the Bay",
        image: "/images/asia/gardens-by-the-bay.jpg",
        caption:
          "Futuristic nature park with iconic Supertrees, Cloud Forest conservatory, and Flower Dome. Walk the OCBC Skyway and experience the magical Garden Rhapsody light and sound show.",
      },
      {
        name: "Chinatown Heritage",
        image: "/images/asia/chinatown-heritage.jpg",
        caption:
          "Explore traditional shophouses, visit the Buddha Tooth Relic Temple, and discover the rich Chinese heritage. Experience authentic cuisine, markets, and cultural performances in this historic district.",
      },
      {
        name: "Sentosa Island",
        image: "/images/asia/sentosa-island.jpg",
        caption:
          "Singapore's playground with Universal Studios theme park, beautiful beaches, golf courses, and luxury resorts. Perfect for family fun, adventure activities, and beach relaxation.",
      },
      {
        name: "Kuala Lumpur & Petronas Towers",
        image: "/images/asia/kuala-lumpur-and-petronas-towers.jpg",
        caption:
          "Malaysia's vibrant capital with the iconic Petronas Twin Towers. Explore the city's modern architecture, diverse neighborhoods, shopping districts, and incredible street food scene.",
      },
      {
        name: "Penang & George Town",
        image: "/images/asia/penang-and-george-town.jpg",
        caption:
          "UNESCO World Heritage Site with well-preserved colonial architecture, vibrant street art, and incredible food culture. Experience the unique blend of Chinese, Malay, and Indian influences.",
      },
      {
        name: "Borneo Rainforest",
        image: "/images/asia/borneo-rainforest.jpg",
        caption:
          "Explore one of the world's oldest rainforests with incredible biodiversity. Visit orangutan sanctuaries, climb Mount Kinabalu, and discover unique wildlife in this pristine natural environment.",
      },
      {
        name: "Langkawi Archipelago",
        image: "/images/asia/langkawi-archipelago.jpg",
        caption:
          "Tropical island paradise with pristine beaches, clear waters, and lush rainforests. Enjoy duty-free shopping, cable car rides with panoramic views, and island-hopping adventures.",
      },
      {
        name: "Bali Beach Resorts",
        image: "/images/asia/bali-beach-resorts.jpg",
        caption:
          "Famous for stunning beaches like Kuta, Seminyak, and Nusa Dua. Perfect for surfing, sunbathing, and enjoying vibrant beach clubs with spectacular Indian Ocean sunsets.",
      },
      {
        name: "Ubud Cultural Center",
        image: "/images/asia/ubud-cultural-center.jpg",
        caption:
          "Bali's cultural heart with ancient temples, traditional dance performances, art galleries, and the famous Tegallalang rice terraces. Experience yoga retreats and spiritual wellness centers.",
      },
      {
        name: "Ancient Temples",
        image: "/images/asia/ancient-temples.jpg",
        caption:
          "Visit iconic temples like Tanah Lot (sea temple), Uluwatu (cliff temple), and Besakih (mother temple). Experience spiritual ceremonies and stunning architecture set against dramatic natural backdrops.",
      },
      {
        name: "Komodo National Park",
        image: "/images/asia/komodo-national-park.jpg",
        caption:
          "Home to the legendary Komodo dragons, the world's largest lizards. Explore pristine islands, incredible diving spots, and unique wildlife in this UNESCO World Heritage Site.",
      },
    ],
  },
  {
    slug: "europe",
    name: "Europe",
    tagline:
      "From romantic cities to historic castles - discover the rich heritage and diverse cultures of the European continent",
    intro: [
      "Experience romance, art, gastronomy, and rich history in one of the world's most beloved destinations",
      "From ancient Rome to romantic Venice - art, history, and la dolce vita",
      "From fairy-tale castles to modern cities - discover German culture and history",
    ],
    highlights: [
      {
        name: "Paris & Eiffel Tower",
        image: "/images/europe/paris-and-eiffel-tower.jpg",
        caption:
          "The City of Lights awaits with iconic landmarks like the Eiffel Tower, Louvre Museum, and Notre-Dame. Stroll along the Seine, explore charming neighborhoods, and savor world-class cuisine.",
      },
      {
        name: "French Riviera",
        image: "/images/europe/french-riviera.jpg",
        caption:
          "Glamorous Mediterranean coastline with beautiful beaches, luxury resorts, and charming towns like Nice, Cannes, and Monaco. Perfect for yachting, beach relaxation, and celebrity spotting.",
      },
      {
        name: "Loire Valley Castles",
        image: "/images/europe/loire-valley-castles.jpg",
        caption:
          "Explore magnificent Renaissance chateaux including Chambord, Chenonceau, and Amboise. Discover the garden of France with beautiful vineyards, historic towns, and royal heritage.",
      },
      {
        name: "Provence Countryside",
        image: "/images/europe/provence-countryside.jpg",
        caption:
          "Picturesque landscapes with lavender fields, olive groves, and medieval hilltop villages. Experience authentic French rural life, excellent wines, and colorful markets.",
      },
      {
        name: "Rome & Ancient History",
        image: "/images/europe/rome-and-ancient-history.jpg",
        caption:
          "The Eternal City with iconic landmarks like the Colosseum, Roman Forum, and Vatican City. Explore ancient ruins, Renaissance art, and vibrant Italian culture in every corner.",
      },
      {
        name: "Venice Canals",
        image: "/images/europe/venice-canals.jpg",
        caption:
          "Floating city built on 118 islands with iconic canals, gondolas, and beautiful architecture. Visit St. Mark's Square, Doge's Palace, and experience the magic of this unique city.",
      },
      {
        name: "Florence Renaissance",
        image: "/images/europe/florence-renaissance.jpg",
        caption:
          "Birthplace of the Renaissance with incredible art collections, including Michelangelo's David at the Uffizi Gallery. Explore beautiful piazzas, Tuscan cuisine, and rolling wine country.",
      },
      {
        name: "Amalfi Coast",
        image: "/images/europe/amalfi-coast.jpg",
        caption:
          "Dramatic coastline with colorful cliffside towns, beautiful beaches, and incredible Mediterranean views. Visit Positano, Amalfi, and Ravello for authentic Italian coastal charm.",
      },
      {
        name: "Neuschwanstein Castle",
        image: "/images/europe/neuschwanstein-castle.jpg",
        caption:
          "The iconic fairy-tale castle that inspired Disney's Sleeping Beauty. Explore this stunning 19th-century palace nestled in the Bavarian Alps with spectacular mountain views.",
      },
      {
        name: "Berlin History & Culture",
        image: "/images/europe/berlin-history-and-culture.jpg",
        caption:
          "Germany's dynamic capital with rich history, from the Berlin Wall to the Brandenburg Gate. Explore world-class museums, vibrant nightlife, and contemporary art and culture scenes.",
      },
      {
        name: "Romantic Road",
        image: "/images/europe/romantic-road.jpg",
        caption:
          "Scenic driving route through medieval towns, castles, and beautiful countryside. Experience traditional German culture, half-timbered houses, and excellent local cuisine along the way.",
      },
      {
        name: "Black Forest Region",
        image: "/images/europe/black-forest-region.jpg",
        caption:
          "Beautiful dense forest region with charming villages, traditional cuckoo clocks, and excellent hiking. Discover the source of the Danube River and enjoy Black Forest cake and spa towns.",
      },
    ],
  },
  {
    slug: "middle-east",
    name: "Middle East",
    tagline:
      "From futuristic skylines to ancient traditions - discover the magic of Dubai and the Arabian Peninsula",
    intro: [
      "Experience luxury, innovation, and Arabian hospitality in one of the world's most dynamic cities",
    ],
    highlights: [
      {
        name: "Burj Khalifa",
        image: "/images/middle-east/burj-khalifa.jpg",
        caption:
          "The world's tallest building standing at 828 meters. Visit the observation deck for breathtaking views of the city and desert. Experience the spectacular fountain shows at its base.",
      },
      {
        name: "Desert Safari Experience",
        image: "/images/middle-east/desert-safari-experience.jpg",
        caption:
          "Thrilling dune bashing, camel riding, and traditional Bedouin camp experiences under the stars. Enjoy Arabic entertainment, henna painting, and authentic cuisine in the desert.",
      },
      {
        name: "Palm Jumeirah",
        image: "/images/middle-east/palm-jumeirah.jpg",
        caption:
          "Man-made island paradise shaped like a palm tree. Home to luxury resorts, pristine beaches, and the famous Atlantis hotel. Perfect for relaxation and water activities.",
      },
      {
        name: "Dubai Mall",
        image: "/images/middle-east/dubai-mall.jpg",
        caption:
          "World's largest shopping and entertainment destination. Features over 1,200 stores, an aquarium, ice rink, cinema complex, and countless dining options from around the world.",
      },
      {
        name: "Old Dubai & Souks",
        image: "/images/middle-east/old-dubai-and-souks.jpg",
        caption:
          "Explore the historic districts of Deira and Bur Dubai. Wander through traditional gold, spice, and textile souks. Visit the Dubai Museum in Al Fahidi Fort for cultural insights.",
      },
      {
        name: "Dubai Marina",
        image: "/images/middle-east/dubai-marina.jpg",
        caption:
          "Stunning waterfront promenade lined with luxury towers and yachts. Enjoy dining, walking, and boat tours. Experience the vibrant nightlife and beautiful marina views.",
      },
    ],
  },
  {
    slug: "north-america",
    name: "North America",
    tagline:
      "From iconic cities to natural wonders - discover the diversity and grandeur of the American continent",
    intro: [
      "Experience iconic cities, diverse cultures, and breathtaking natural landscapes",
      "Discover natural beauty, multicultural cities, and friendly hospitality",
    ],
    highlights: [
      {
        name: "New York City",
        image: "/images/north-america/new-york-city.jpg",
        caption:
          "The city that never sleeps with iconic landmarks like Times Square, Statue of Liberty, Central Park, and Empire State Building. Experience world-class dining, Broadway shows, and diverse neighborhoods.",
      },
      {
        name: "Los Angeles & Hollywood",
        image: "/images/north-america/los-angeles-and-hollywood.jpg",
        caption:
          "Entertainment capital of the world with Hollywood Walk of Fame, Universal Studios, and beautiful beaches like Santa Monica and Malibu. Experience celebrity culture and California dreamin lifestyle.",
      },
      {
        name: "Grand Canyon National Park",
        image: "/images/north-america/grand-canyon-national-park.jpg",
        caption:
          "One of the world's most spectacular natural wonders with breathtaking canyon views carved by the Colorado River. Hiking, helicopter tours, and sunset experiences create unforgettable memories.",
      },
      {
        name: "Miami Beaches",
        image: "/images/north-america/miami-beaches.jpg",
        caption:
          "Vibrant coastal city with beautiful beaches, Art Deco architecture in South Beach, and rich Latin culture. Experience exciting nightlife, Cuban cuisine, and water sports in this tropical paradise.",
      },
      {
        name: "Las Vegas Strip",
        image: "/images/north-america/las-vegas-strip.jpg",
        caption:
          "Entertainment capital with world-famous casinos, spectacular shows, luxury resorts, and vibrant nightlife. Experience the electric energy of the Strip and nearby natural wonders like Red Rock Canyon.",
      },
      {
        name: "San Francisco Bay Area",
        image: "/images/north-america/san-francisco-bay-area.jpg",
        caption:
          "Iconic city with the Golden Gate Bridge, Alcatraz Island, and charming neighborhoods. Experience diverse cultures, excellent cuisine, and nearby wine country in Napa and Sonoma valleys.",
      },
      {
        name: "Toronto & Niagara Falls",
        image: "/images/north-america/toronto-and-niagara-falls.jpg",
        caption:
          "Canada's largest city with the iconic CN Tower, diverse neighborhoods, and world-class dining. Visit nearby Niagara Falls for spectacular natural wonder and unforgettable boat experiences.",
      },
      {
        name: "Vancouver & Whistler",
        image: "/images/north-america/vancouver-and-whistler.jpg",
        caption:
          "Beautiful coastal city surrounded by mountains and ocean. Enjoy outdoor activities, vibrant neighborhoods, and world-class skiing at nearby Whistler Blackcomb resort.",
      },
      {
        name: "Banff National Park",
        image: "/images/north-america/banff-national-park.jpg",
        caption:
          "Stunning Rocky Mountain wilderness with turquoise lakes, glaciers, and abundant wildlife. Explore Lake Louise, Moraine Lake, and enjoy world-class hiking and skiing in pristine nature.",
      },
      {
        name: "Quebec City & Montreal",
        image: "/images/north-america/quebec-city-and-montreal.jpg",
        caption:
          "Experience French Canadian culture in historic Quebec City with its charming Old Town and European feel. Visit Montreal for vibrant arts, cuisine, and the famous Jazz Festival.",
      },
    ],
  },
];

export function getRegion(slug: string): Region | undefined {
  return REGIONS.find((region) => region.slug === slug);
}
