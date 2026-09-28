const fs = require('fs');
const path = 'C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/hotels/hotels.service.ts';
let content = fs.readFileSync(path, 'utf8');

const oldBookingLogic = `    // 2. Create OTABooking Record (PENDING)
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
    };`;

const newBookingLogic = `    // 2. Create OTABooking Record (PENDING)
    const dellics_reference = \`HTL-\${Date.now()}\`;
    const booking = await this.prisma.oTABooking.create({
      data: {
        dellics_reference,
        customer_name: \`\${dto.guests[0].firstName} \${dto.guests[0].lastName}\`,
        customer_email: dto.contactDetails.email,
        customer_phone: dto.contactDetails.phone || '',
        total_amount: dto.amount,
        currency: dto.currency || 'USD',
        status: 'PAYMENT_PENDING',
        items: {
          create: {
            provider_name: dto.provider,
            provider_type: 'HOTEL',
            item_details: JSON.parse(JSON.stringify(dto)),
            base_price: dto.amount, // Needs precise calculation if we separate base/markup at this stage
            markup_applied: 0, 
            final_price: dto.amount,
            currency: dto.currency || 'USD',
          }
        }
      }
    });

    // 3. Initialize Paystack Transaction
    const payment = await this.paymentsService.initializePaystack({
      email: dto.contactDetails.email,
      amount: dto.amount,
      currency: dto.currency || 'USD',
      reference: \`PAY_\${booking.id}\`,
      metadata: {
        bookingId: booking.id,
        type: 'HOTEL',
      }
    });

    // Update with Paystack reference
    await this.prisma.oTABooking.update({
      where: { id: booking.id },
      data: { paystack_reference: payment.reference }
    });

    return {
      success: true,
      bookingId: booking.id,
      paymentUrl: payment.authorizationUrl,
      reference: payment.reference,
    };`;

content = content.replace(oldBookingLogic, newBookingLogic);

fs.writeFileSync(path, content);
console.log('Successfully patched hotels.service.ts for DB schema alignment');
