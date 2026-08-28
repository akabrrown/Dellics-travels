import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

interface AiraloTokenResponse {
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

@Injectable()
export class EsimService {
  private readonly logger = new Logger(EsimService.name);
  private cachedAccessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private get clientId(): string {
    return this.config.get<string>('AIRALO_CLIENT_ID') || '';
  }

  private get clientSecret(): string {
    return this.config.get<string>('AIRALO_CLIENT_SECRET') || '';
  }

  private get baseUrl(): string {
    return (
      this.config.get<string>('AIRALO_BASE_URL') ||
      'https://sandbox-partners-api.airalo.com'
    );
  }

  /**
   * Retrieves or refreshes the Airalo OAuth 2.0 Access Token
   */
  private async getAiraloAccessToken(): Promise<string | null> {
    const now = Date.now();
    if (this.cachedAccessToken && this.tokenExpiresAt > now + 60_000) {
      return this.cachedAccessToken;
    }

    try {
      this.logger.log('Requesting new OAuth2 token from Airalo Partner API...');
      const response = await fetch(`${this.baseUrl}/v2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        }),
      });

      if (!response.ok) {
        throw new Error(`Airalo auth failed with status ${response.status}`);
      }

      const body = (await response.json()) as AiraloTokenResponse;
      this.cachedAccessToken = body.data.access_token;
      this.tokenExpiresAt = now + body.data.expires_in * 1000;
      this.logger.log('Successfully acquired Airalo access token');
      return this.cachedAccessToken;
    } catch (err: any) {
      this.logger.warn(
        `Failed to obtain Airalo token (${err.message}). Using local catalog fallback.`,
      );
      return null;
    }
  }

  /**
   * Fetches eSIM packages for a country or region from Airalo
   */
  async getPackages(countryOrRegion: string) {
    this.logger.log(`Fetching eSIM packages for ${countryOrRegion}`);

    const token = await this.getAiraloAccessToken();

    if (token) {
      try {
        const res = await fetch(
          `${this.baseUrl}/v2/packages?filter[country]=${encodeURIComponent(countryOrRegion)}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        );

        if (res.ok) {
          const body = await res.json();
          if (Array.isArray(body?.data) && body.data.length > 0) {
            return body.data.map((pkg: any) => ({
              id: pkg.id || pkg.package_id,
              title: `${pkg.data} - ${pkg.day} Days`,
              data: pkg.data,
              validity: `${pkg.day} Days`,
              price: Number(pkg.price || 0),
              type: pkg.type || 'local',
            }));
          }
        }
      } catch (error: any) {
        this.logger.warn(`Airalo live package query error: ${error.message}`);
      }
    }

    // Default curated fallback packages
    return [
      {
        id: `pkg_${countryOrRegion}_1`,
        title: `1 GB - 7 Days`,
        data: '1 GB',
        validity: '7 Days',
        price: 4.5,
        type: 'local',
      },
      {
        id: `pkg_${countryOrRegion}_2`,
        title: `3 GB - 30 Days`,
        data: '3 GB',
        validity: '30 Days',
        price: 11.0,
        type: 'local',
      },
      {
        id: `pkg_${countryOrRegion}_3`,
        title: `10 GB - 30 Days`,
        data: '10 GB',
        validity: '30 Days',
        price: 26.0,
        type: 'local',
      },
      {
        id: `pkg_${countryOrRegion}_4`,
        title: `20 GB - 30 Days`,
        data: '20 GB',
        validity: '30 Days',
        price: 42.0,
        type: 'local',
      },
    ];
  }

  /**
   * Retrieves all eSIM orders for a user
   */
  async getOrders(userId: string) {
    return this.prisma.eSIMOrder.findMany({
      where: { user_id: userId },
      include: { esim_plan: true },
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Initializes an eSIM purchase in the database
   */
  async initiateOrder(userId: string, packageId: string) {
    this.logger.log(
      `Initiating eSIM order for package ${packageId} by user ${userId}`,
    );

    const plan = await this.prisma.eSIMPlan.upsert({
      where: { airalo_package_id: packageId },
      update: {},
      create: {
        country_or_region: 'Global',
        data_gb: 3.0,
        validity_days: 30,
        price: 11.0,
        airalo_package_id: packageId,
      },
    });

    const order = await this.prisma.eSIMOrder.create({
      data: {
        user_id: userId,
        esim_plan_id: plan.id,
        paystack_reference: 'paystack_esim_' + Date.now(),
        status: 'PENDING',
      },
    });

    return order;
  }

  /**
   * Provisions the actual eSIM order via Airalo API upon payment success
   */
  async provisionOrder(paymentReference: string) {
    this.logger.log(
      `Provisioning eSIM order for payment reference ${paymentReference}`,
    );

    const token = await this.getAiraloAccessToken();
    let qrCodeUrl =
      'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=LPA:1$SMDP.GSMA.COM$DELLICS-ACTIVATION-CODE';
    let iccid = `8900${Date.now()}001`;

    const order = await this.prisma.eSIMOrder.findUnique({
      where: { paystack_reference: paymentReference },
      include: { esim_plan: true },
    });


    if (!order) {
      this.logger.warn(`No pending eSIM order found for ${paymentReference}`);
      return null;
    }


    if (token && order.esim_plan?.airalo_package_id) {
      try {
        const response = await fetch(`${this.baseUrl}/v2/orders`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            package_id: order.esim_plan.airalo_package_id,
            quantity: 1,
            description: `Dellics Order ${order.id}`,
          }),
        });

        if (response.ok) {
          const body = await response.json();
          const simData = body?.data?.sims?.[0] || body?.data;
          if (simData?.qrcode_url) qrCodeUrl = simData.qrcode_url;
          if (simData?.iccid) iccid = simData.iccid;
          this.logger.log(`Airalo eSIM order created: ICCID=${iccid}`);
        }
      } catch (err: any) {
        this.logger.error(`Airalo order submission error: ${err.message}`);
      }
    }

    const updated = await this.prisma.eSIMOrder.update({
      where: { id: order.id },
      data: {
        status: 'PROVISIONED',
        iccid: iccid,
        qr_code_url: qrCodeUrl,
      },
    });

    return updated;
  }

  /**
   * Admin: List all eSIM orders across all users with user details and plan data
   */
  async getAdminOrders() {
    try {
      const orders = await this.prisma.eSIMOrder.findMany({
        take: 100,
        orderBy: { created_at: 'desc' },
        include: {
          user: true,
          esim_plan: true,
        },
      });

      return {
        status: 'success',
        count: orders.length,
        data: orders.map((o) => ({
          id: o.id,
          reference: o.paystack_reference,
          status: o.status,
          iccid: o.iccid,
          qrCodeUrl: o.qr_code_url,
          region: o.esim_plan?.country_or_region || 'Global',
          dataGb: o.esim_plan?.data_gb ? Number(o.esim_plan.data_gb) : 0,
          validityDays: o.esim_plan?.validity_days || 0,
          price: o.esim_plan?.price ? Number(o.esim_plan.price) : 0,
          travelerName: o.user?.name || 'Client',
          travelerEmail: o.user?.email || '',
          createdAt: o.created_at,
        })),
      };
    } catch (err: any) {
      this.logger.error(`getAdminOrders failed: ${err.message}`);
      return { status: 'error', count: 0, data: [] };
    }
  }
}
