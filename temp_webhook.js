const fs = require('fs');
const path = 'C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/webhooks/webhooks.service.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Imports
content = content.replace(
  "import { PrismaService } from '../prisma/prisma.service';",
  "import { PrismaService } from '../prisma/prisma.service';\nimport { HotelsService } from '../hotels/hotels.service';\nimport { forwardRef, Inject } from '@nestjs/common';"
);

// 2. Inject HotelsService
content = content.replace(
  "constructor(private prisma: PrismaService) {}",
  "constructor(\n    private prisma: PrismaService,\n    @Inject(forwardRef(() => HotelsService))\n    private hotelsService: HotelsService\n  ) {}"
);

// 3. Update Paystack Webhook Handler logic
const otaLogic = `
      if (payment) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCEEDED' },
        });

        await this.prisma.booking.update({
          where: { id: payment.booking_id },
          data: { status: 'CONFIRMED' },
        });

        this.logger.log(
          \`Booking \${payment.booking_id} confirmed via Paystack webhook.\`,
        );
      } else if (bookingId && bookingId !== 'unknown') {
        // Check if it's an OTA Hotel Booking (metadata type HOTEL)
        if (tx.metadata?.type === 'HOTEL') {
           this.logger.log(\`Finalizing OTA Hotel Booking via Webhook: \${bookingId}\`);
           await this.hotelsService.finalizeOTABooking(bookingId).catch(e => {
             this.logger.error(\`Failed to finalize OTA Hotel Booking \${bookingId}\`, e);
           });
        } else {
           await this.prisma.booking
            .update({
              where: { id: bookingId },
              data: { status: 'CONFIRMED' },
            })
            .catch(() => null);
        }
      }
`;

content = content.replace(/if \(payment\) \{[\s\S]*?\}\n\s+\}\n\s+return \{ received: true \};/, otaLogic + "    }\n\n    return { received: true };");

fs.writeFileSync(path, content);
console.log('Successfully updated webhooks.service.ts for OTA booking');
