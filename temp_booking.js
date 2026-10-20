const fs = require('fs');
const path = 'C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/hotels/hotels.service.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add PaymentsService import
content = content.replace(
  "import { PrismaService } from '../prisma/prisma.service';",
  "import { PrismaService } from '../prisma/prisma.service';\nimport { PaymentsService } from '../payments/payments.service';\nimport { BookHotelDto } from './dto/book-hotel.dto';"
);

// 2. Inject PaymentsService
content = content.replace(
  "private readonly prisma: PrismaService,",
  "private readonly prisma: PrismaService,\n    private readonly paymentsService: PaymentsService,"
);

// 3. Add booking logic
const bookingLogic = `
  /**
   * Hotel Booking Initialization
   */
  async createBooking(dto: BookHotelDto) {
    const provider = this.providers.find(p => p.name.toLowerCase() === dto.provider.toLowerCase());
    if (!provider) {
      throw new BadRequestException(\`Provider \${dto.provider} not found\`);
    }

    // 1. Verify Rate hasn't changed (OTA pre-book)
    const isRateValid = await provider.verifyRate(dto.rateId).catch(() => false);
    if (!isRateValid) {
       throw new BadRequestException('The selected rate is no longer available. Please search again.');
    }

    // 2. Create OTABooking Record (PENDING)
    const booking = await this.prisma.oTABooking.create({
      data: {
        provider: dto.provider,
        providerBookingId: null, // Will be set after successful payment and provider.book()
        customerName: \`\${dto.guests[0].firstName} \${dto.guests[0].lastName}\`,
        customerEmail: dto.contactDetails.email,
        customerPhone: dto.contactDetails.phone,
        totalAmount: dto.amount,
        currency: dto.currency || 'USD',
        status: 'PENDING_PAYMENT',
        items: {
          create: {
            itemType: 'HOTEL',
            referenceId: dto.hotelId,
            details: JSON.parse(JSON.stringify(dto)), // Store full details
            price: dto.amount,
            currency: dto.currency || 'USD',
            status: 'PENDING',
          }
        }
      }
    });

    // 3. Initialize Paystack Transaction
    const payment = await this.paymentsService.initializePaystack({
      email: dto.contactDetails.email,
      amount: dto.amount,
      currency: dto.currency || 'USD',
      reference: \`HTL_\${booking.id}\`,
      metadata: {
        bookingId: booking.id,
        type: 'HOTEL',
      }
    });

    return {
      success: true,
      bookingId: booking.id,
      paymentUrl: payment.authorization_url,
      reference: payment.reference,
    };
  }
`;

content = content.replace("private async getMarkupPercentage(): Promise<number> {", bookingLogic + "\n  private async getMarkupPercentage(): Promise<number> {");

fs.writeFileSync(path, content);
console.log('Successfully updated hotels.service.ts with booking logic');
