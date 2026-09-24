const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, search, replace) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (typeof search === 'string') {
    if (content.includes(search)) {
      content = content.replace(search, replace);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${path.basename(filePath)} - replaced "${search.substring(0, 40)}..."`);
      return true;
    }
  } else {
    if (search.test(content)) {
      content = content.replace(search, replace);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${path.basename(filePath)} - regex replace`);
      return true;
    }
  }
  return false;
}

const base = 'C:\\Users\\Dell\\Desktop\\PROjects\\Dellics Travels\\apps\\consult\\src';

// 1. Fix "Seamless" slop in WhyChooseUsSection
replaceInFile(
  path.join(base, 'components', 'home', 'WhyChooseUsSection.tsx'),
  '>Seamless<',
  '>Integrated<'
);

// 2. Fix hero section to use navy instead of slate-900
replaceInFile(
  path.join(base, 'components', 'home', 'HeroSection.tsx'),
  'bg-slate-900',
  'bg-navy-dark'
);
replaceInFile(
  path.join(base, 'components', 'home', 'HeroSection.tsx'),
  'from-slate-900 via-slate-900/60',
  'from-navy-dark via-navy-dark/60'
);
replaceInFile(
  path.join(base, 'components', 'home', 'HeroSection.tsx'),
  'from-slate-900/90 via-slate-900/50',
  'from-navy-dark/90 via-navy-dark/50'
);

// 3. Fix DashboardShowcase to use navy tokens
replaceInFile(
  path.join(base, 'components', 'home', 'DashboardShowcase.tsx'),
  'bg-brand-blue',
  'bg-navy'
);

// 4. Fix FaqSection CTA to use navy
replaceInFile(
  path.join(base, 'components', 'home', 'FaqSection.tsx'),
  'bg-brand-blue rounded-3xl',
  'luxury-gradient rounded-3xl'
);

// 5. Fix CtaBanner to use luxury-gradient
replaceInFile(
  path.join(base, 'components', 'home', 'CtaBanner.tsx'),
  'bg-brand-blue text-white',
  'luxury-gradient text-white'
);

// 6. Fix ContactSection info card
replaceInFile(
  path.join(base, 'components', 'home', 'ContactSection.tsx'),
  'bg-brand-blue text-white rounded-2xl',
  'luxury-gradient text-white rounded-2xl'
);

// 7. Fix ContactSection submit button
replaceInFile(
  path.join(base, 'components', 'home', 'ContactSection.tsx'),
  'bg-brand-blue text-white font-bold hover:bg-brand-blue-light',
  'bg-navy text-white font-bold hover:bg-navy-light'
);

// 8. Fix ServicesSection featured card
replaceInFile(
  path.join(base, 'components', 'home', 'ServicesSection.tsx'),
  "'bg-brand-blue border-brand-blue text-white shadow-xl shadow-brand-blue/20",
  "'luxury-gradient border-navy text-white shadow-lg shadow-navy/20"
);

// 9. Fix HowItWorksSection badge
replaceInFile(
  path.join(base, 'components', 'home', 'HowItWorksSection.tsx'),
  'bg-brand-blue/5 text-brand-blue',
  'bg-navy/5 text-navy'
);

// 10. Fix ServicesSection icon color
replaceInFile(
  path.join(base, 'components', 'home', 'ServicesSection.tsx'),
  "'text-brand-blue'",
  "'text-navy'"
);

// 11. Fix WhyChooseUsSection badge
replaceInFile(
  path.join(base, 'components', 'home', 'WhyChooseUsSection.tsx'),
  'bg-brand-blue/5 text-brand-blue',
  'bg-navy/5 text-navy'
);

// 12. Fix FaqSection badge
replaceInFile(
  path.join(base, 'components', 'home', 'FaqSection.tsx'),
  'bg-brand-blue/5 text-brand-blue',
  'bg-navy/5 text-navy'
);

// 13. Fix DestinationsSection link color
replaceInFile(
  path.join(base, 'components', 'home', 'DestinationsSection.tsx'),
  'text-brand-blue group-hover:text-brand-orange',
  'text-navy group-hover:text-brand-orange'
);

// 14. Fix ServicesSection CTA link
replaceInFile(
  path.join(base, 'components', 'home', 'ServicesSection.tsx'),
  "'text-brand-blue group-hover:text-brand-orange'",
  "'text-navy group-hover:text-brand-orange'"
);

// 15. Fix WhyChooseUsSection CTA button  
replaceInFile(
  path.join(base, 'components', 'home', 'WhyChooseUsSection.tsx'),
  'text-brand-blue font-bold border-2 border-slate-200 hover:border-brand-blue/30',
  'text-navy font-bold border-2 border-slate-200 hover:border-navy/30'
);

// 16. Fix hero search "Guide me" button
replaceInFile(
  path.join(base, 'components', 'home', 'HeroSection.tsx'),
  'bg-brand-blue hover:bg-brand-blue-light',
  'bg-navy hover:bg-navy-light'
);

console.log('\nAll component token fixes applied.');
