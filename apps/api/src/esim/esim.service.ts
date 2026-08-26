import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EsimService {
  private readonly logger = new Logger(EsimService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Mock implementation of fetching Airalo eSIM packages.
   * In a real implementation, this would use the Airalo Partner API.
   */
  async getPackages(countryOrRegion: string) {
    this.logger.log(`Fetching eSIM packages for ${countryOrRegion}`);
    
    // Return mock data that matches our frontend needs
    return [
      {
        id: `pkg_${countryOrRegion}_1`,
        title: `1 GB - 7 Days`,
        data: '1 GB',
        validity: '7 Days',
        price: 4.5,
        type: 'local'
      },
      {
        id: `pkg_${countryOrRegion}_2`,
        title: `3 GB - 30 Days`,
        data: '3 GB',
        validity: '30 Days',
        price: 11.0,
        type: 'local'
      },
      {
        id: `pkg_${countryOrRegion}_3`,
        title: `10 GB - 30 Days`,
        data: '10 GB',
        validity: '30 Days',
        price: 26.0,
        type: 'local'
      }
    ];
  }

  /**
   * Initialize an eSIM purchase in our database.
   * Does NOT call Airalo yet, wait for Stripe webhook.
   */
  async initiateOrder(userId: string, packageId: string) {
    this.logger.log(`Initiating eSIM order for package ${packageId} by user ${userId}`);
    
    // We mock finding or creating the plan in our DB
    const plan = await this.prisma.eSIMPlan.upsert({
      where: { airalo_package_id: packageId },
      update: {},
      create: {
        country_or_region: 'Mock Region',
        data_gb: 3.0,
        validity_days: 30,
        price: 11.0,
        airalo_package_id: packageId,
      }
    });

    const order = await this.prisma.eSIMOrder.create({
      data: {
        user_id: userId,
        esim_plan_id: plan.id,
        stripe_payment_intent_id: 'pending_' + Date.now(), // Will be updated by Checkout flow
        status: 'PENDING'
      }
    });

    return order;
  }

  /**
   * Called by the Stripe webhook when the payment succeeds.
   * Provisions the actual eSIM via Airalo.
   */
  async provisionOrder(paymentIntentId: string) {
    this.logger.log(`Provisioning eSIM order for payment intent ${paymentIntentId}`);
    
    // Mock Airalo Partner API provision call
    const mockQrCode = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=LPA:1$SMDP.GSMA.COM$MOCK-ACTIVATION-CODE';
    const mockIccid = '8900000000000000000';

    const order = await this.prisma.eSIMOrder.findUnique({
       where: { stripe_payment_intent_id: paymentIntentId }
    });

    if (order) {
      await this.prisma.eSIMOrder.update({
        where: { id: order.id },
        data: {
           status: 'PROVISIONED',
           qr_code_url: mockQrCode,
           iccid: mockIccid
        }
      });
      this.logger.log(`Order ${order.id} provisioned with ICCID ${mockIccid}`);
    }
  }

  /**
   * Fetch all eSIM orders for a specific user
   */
  async getOrders(userId: string) {
    return this.prisma.eSIMOrder.findMany({
      where: { user_id: userId },
      include: {
        esim_plan: true
      },
      orderBy: { created_at: 'desc' }
    });
  }
}
