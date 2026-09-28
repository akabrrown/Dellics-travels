const fs = require('fs');
const p = 'C:/Users/Dell/Desktop/Dellics Travels/apps/web/app/tours/page.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/const TOUR_PROMISES = \[[\s\S]*?\];/, `const TOUR_PROMISES = [
  {
    icon: Compass,
    title: "Carefully Curated Experiences",
    description: "Every tour is thoughtfully selected to combine must-see attractions with authentic experiences, culture, nature, adventure and local discovery.",
  },
  {
    icon: ShieldCheck,
    title: "Designed Around You",
    description: "Whether you’re travelling solo, as a couple, with family, friends or as a group, we offer experiences that can be tailored to your interests, pace and travel style.",
  },
  {
    icon: MapPin,
    title: "Authentic Local Experiences",
    description: "Go beyond the typical tourist itinerary and discover destinations through their culture, history, cuisine, people and unique stories.",
  },
  {
    icon: Plane,
    title: "Expertly Planned Itineraries",
    description: "From activities and sightseeing to transportation and timing, we take care of the important details so you can focus on enjoying your journey.",
  },
  {
    icon: Building2,
    title: "Trusted Local Partners",
    description: "We work with carefully selected guides, drivers, activity providers and hospitality",
  },
];`);

const diasporaSection = `
      {/* Diaspora Tours */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-navy p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden border border-navy-300/20">
          <div className="absolute inset-0 bg-brand-orange/5 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Why Book Curated Diaspora Tours with Dellics?
            </h2>
            <p className="text-brand-orange font-bold text-lg mb-6 tracking-wide">
              Reconnect. Rediscover. Remember.
            </p>
            <p className="text-slate-300 leading-relaxed sm:text-lg">
              Our Curated Diaspora Tours take you beyond traditional sightseeing into meaningful journeys of heritage, culture, history, and connection. From ancestral landmarks and cultural communities to local cuisine, traditions, and authentic encounters, every experience is thoughtfully designed to help you discover the destination—and your connection to it.
            </p>
          </div>
        </div>
      </section>
`;

c = c.replace('</section>\n\n      <CtaBanner', '</section>\n' + diasporaSection + '\n      <CtaBanner');
c = c.replace('</section>\r\n\r\n      <CtaBanner', '</section>\r\n' + diasporaSection + '\r\n      <CtaBanner');
// If grid cols needs to be adjusted
c = c.replace('grid gap-8 sm:grid-cols-2 lg:grid-cols-4', 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3');

fs.writeFileSync(p, c);
console.log('Success');
