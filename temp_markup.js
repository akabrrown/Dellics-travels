const fs = require('fs');
const path = 'C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/hotels/hotels.service.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace imports
content = content.replace(
  "import { ConfigService } from '@nestjs/config';",
  "import { ConfigService } from '@nestjs/config';\nimport { PrismaService } from '../prisma/prisma.service';"
);

// Remove hardcoded markup
content = content.replace(
  "// Dellics Markup Configuration\nconst DELLICS_MARKUP_PERCENTAGE = 0.12; // 12% markup",
  ""
);

// Add PrismaService to constructor
content = content.replace(
  "private readonly rateHawkProvider: RateHawkProvider,",
  "private readonly rateHawkProvider: RateHawkProvider,\n    private readonly prisma: PrismaService,"
);

// Update search method signature / calls
content = content.replace(
  "const finalOffers = this.applyMarkup(ranked);",
  "const markupValue = await this.getMarkupPercentage();\n    const finalOffers = this.applyMarkup(ranked, markupValue);"
);

// Update applyMarkup to accept percentage
content = content.replace(
  "private applyMarkup(offers: HotelResult[]): HotelResult[] {",
  "private applyMarkup(offers: HotelResult[], markupPercentage: number): HotelResult[] {"
);
content = content.replace(
  /DELLICS_MARKUP_PERCENTAGE/g,
  "markupPercentage"
);

// Add getMarkupPercentage helper
const helperCode = `
  private async getMarkupPercentage(): Promise<number> {
    const cacheKey = 'markup:hotels:global';
    const cached = this.cache.get<number>(cacheKey);
    if (cached !== undefined) return cached;

    try {
      // Find the active global or hotel specific markup rule
      const rule = await this.prisma.markupRule.findFirst({
        where: {
          isActive: true,
          // You could add providerType: 'HOTEL' if you added that enum value, 
          // but assuming a global default for now or finding by name.
        },
        orderBy: { created_at: 'desc' }
      });
      
      // Default to 12% if no rule is found
      const markup = rule ? Number(rule.value) / 100 : 0.12;
      this.cache.set(cacheKey, markup, 5 * 60 * 1000); // 5 mins cache
      return markup;
    } catch (e) {
      this.logger.error('Failed to fetch markup from DB, using fallback', e);
      return 0.12;
    }
  }

  private assertDates(input: HotelSearchInput): void {`;

content = content.replace("private assertDates(input: HotelSearchInput): void {", helperCode);

fs.writeFileSync(path, content);
console.log('Successfully updated hotels.service.ts for DB markup');
