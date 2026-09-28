const fs = require('fs');
const path = 'C:/Users/Dell/Desktop/Dellics Travels/apps/api/src/hotels/hotels.service.ts';
let content = fs.readFileSync(path, 'utf8');

const finalizeLogic = `
  async finalizeOTABooking(bookingId: string) {
    this.logger.log(\`Finalizing OTA Booking \${bookingId}\`);
    const booking = await this.prisma.oTABooking.findUnique({
      where: { id: bookingId },
      include: { items: true }
    });

    if (!booking) throw new BadRequestException('Booking not found');
    if (booking.status === 'CONFIRMED') return booking; // Already confirmed
    
    // Update to payment success first
    await this.prisma.oTABooking.update({
      where: { id: bookingId },
      data: { status: 'PAYMENT_SUCCESS' }
    });

    // We only have one item for hotels currently
    const item = booking.items[0];
    const details = item.item_details as any;

    const provider = this.providers.find(p => p.name.toLowerCase() === item.provider_name.toLowerCase());
    if (!provider) {
      this.logger.error(\`Provider \${item.provider_name} not found for booking \${bookingId}\`);
      await this.prisma.oTABooking.update({ where: { id: bookingId }, data: { status: 'FAILED' }});
      return;
    }

    try {
      const response = await provider.book({
        rateId: details.rateId,
        guests: details.guests,
        contactDetails: details.contactDetails,
      });

      if (response.success) {
        await this.prisma.oTABooking.update({
          where: { id: bookingId },
          data: { status: 'CONFIRMED' }
        });
        
        await this.prisma.oTABookingItem.update({
          where: { id: item.id },
          data: { supplier_reference: response.bookingId, supplier_status: response.status }
        });
        
        this.logger.log(\`Successfully confirmed booking \${bookingId} with provider \${provider.name}\`);
      } else {
        throw new Error(response.error || 'Provider booking failed');
      }
    } catch (e) {
      this.logger.error(\`Provider booking failed for \${bookingId}\`, e);
      await this.prisma.oTABooking.update({ where: { id: bookingId }, data: { status: 'FAILED' }});
      // In a real system, we'd trigger a manual refund or retry queue here.
    }
  }

  private async getMarkupPercentage(): Promise<number> {`;

content = content.replace("private async getMarkupPercentage(): Promise<number> {", finalizeLogic);
fs.writeFileSync(path, content);
console.log('Successfully added finalizeOTABooking');
