const fs = require('fs');
const path = 'C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/hotels/hotels.service.spec.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { RateHawkProvider } from '../providers/hotels/ratehawk/ratehawk.provider';",
  "import { RateHawkProvider } from '../providers/hotels/ratehawk/ratehawk.provider';\nimport { HotelbedsProvider } from '../providers/hotels/hotelbeds/hotelbeds.provider';\nimport { ExpediaProvider } from '../providers/hotels/expedia/expedia.provider';"
);

content = content.replace(
  "const rateHawk = new RateHawkProvider(config);",
  "const rateHawk = new RateHawkProvider(config);\n  const hotelbeds = new HotelbedsProvider(config);\n  const expedia = new ExpediaProvider(config);"
);

content = content.replace(
  "return new HotelsService(config, rateHawk, prisma, payments);",
  "return new HotelsService(config, rateHawk, hotelbeds, expedia, prisma, payments);"
);

fs.writeFileSync(path, content);
console.log('Fixed spec file');
