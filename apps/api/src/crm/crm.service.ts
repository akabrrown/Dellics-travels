import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomers(params: {
    search?: string;
    segment?: string;
    tier?: string;
    source?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, segment, tier, source, page = 1, limit = 50 } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tier && tier !== 'ALL') {
      where.membership_tier = tier;
    }

    if (segment === 'VIP') {
      where.membership_tier = 'ELITE';
    } else if (segment === 'LEADS') {
      where.leads = {
        some: {
          stage: {
            in: [
              'NEW',
              'CONTACTED',
              'QUALIFIED',
              'PROPOSAL_SENT',
              'NEGOTIATING',
            ],
          },
        },
      };
    } else if (segment === 'ESIM') {
      where.esim_orders = { some: {} };
    } else if (segment === 'AT_RISK') {
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      where.updated_at = { lt: sixtyDaysAgo };
      where.trips = { some: {} };
    } else if (segment === 'DORMANT') {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      where.updated_at = { lt: ninetyDaysAgo };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updated_at: 'desc' },
        include: {
          trips: {
            include: {
              bookings: {
                include: { payments: true },
              },
            },
          },
          esim_orders: true,
          leads: true,
          interactions: {
            orderBy: { created_at: 'desc' },
            take: 1,
          },
          rewards: {
            orderBy: { created_at: 'desc' },
            take: 5,
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const customers = users.map((u) => {
      const allBookings = u.trips.flatMap((t) => t.bookings);
      const allPayments = allBookings.flatMap((b) => b.payments);
      const succeededPayments = allPayments.filter(
        (p) => p.status === 'SUCCEEDED',
      );

      const lifetimeGhs = succeededPayments
        .filter((p) => p.currency === 'GHS')
        .reduce((sum, p) => sum + Number(p.amount), 0);
      const lifetimeUsd = succeededPayments
        .filter((p) => p.currency === 'USD')
        .reduce((sum, p) => sum + Number(p.amount), 0);

      const activeProducts: string[] = [];
      const bookingTypes = new Set(allBookings.map((b) => b.type));
      if (bookingTypes.has('FLIGHT')) activeProducts.push('FLIGHTS');
      if (bookingTypes.has('HOTEL')) activeProducts.push('HOTELS');
      if (bookingTypes.has('PACKAGE')) activeProducts.push('TOURS');
      if (bookingTypes.has('ACTIVITY')) activeProducts.push('TOURS');
      if (u.esim_orders.length > 0) activeProducts.push('ESIM');
      if (u.leads.some((l) => l.source === 'VISA_REQUEST'))
        activeProducts.push('VISA');
      if (u.leads.some((l) => l.source === 'DIASPORA_PACKAGE'))
        activeProducts.push('DIASPORA');

      const openLeads = u.leads.filter((l) =>
        [
          'NEW',
          'CONTACTED',
          'QUALIFIED',
          'PROPOSAL_SENT',
          'NEGOTIATING',
        ].includes(l.stage),
      );

      let currentStatus = 'INACTIVE';
      const confirmedBookings = allBookings.filter(
        (b) => b.status === 'CONFIRMED',
      );
      const completedBookings = allBookings.filter(
        (b) => b.status === 'COMPLETED',
      );
      if (confirmedBookings.length > 0) currentStatus = 'CONFIRMED';
      if (completedBookings.length > 0 && confirmedBookings.length === 0)
        currentStatus = 'COMPLETED';
      if (openLeads.length > 0 && allBookings.length === 0)
        currentStatus = 'LEAD';

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || '',
        country: u.passport_country || u.nationality || 'Ghana',
        countryCode: (u.nationality || 'GH').substring(0, 2).toUpperCase(),
        membershipTier: u.membership_tier,
        pointsBalance: u.points_balance,
        totalTrips: u.trips.length,
        totalBookings: allBookings.length,
        lifetimeSpendGhs: Math.round(lifetimeGhs),
        lifetimeSpendUsd: Math.round(lifetimeUsd),
        activeProducts,
        currentStatus,
        primaryRouteOrInterest:
          u.interactions[0]?.subject || openLeads[0]?.notes || '-',
        lastActive: u.interactions[0]?.created_at || u.updated_at,
        passportVerified: !!u.passport_number,
        passportExpiry: u.passport_expiry || '',
        hasOpenInquiry: openLeads.length > 0,
        inquirySummary: openLeads[0]?.notes || undefined,
        eSimActive: u.esim_orders.some((o) => o.status === 'ACTIVE'),
        leadSource: u.leads[0]?.source || null,
        churnRiskDays: Math.floor(
          (Date.now() -
            new Date(u.interactions[0]?.created_at || u.updated_at).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      };
    });

    return { data: customers, total, page, limit };
  }

  async getCustomerById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        trips: {
          include: {
            bookings: {
              include: { payments: true, reviews: true },
            },
          },
        },
        memberships: true,
        rewards: { orderBy: { created_at: 'desc' } },
        esim_orders: { include: { esim_plan: true } },
        interactions: { orderBy: { created_at: 'desc' } },
        leads: { orderBy: { created_at: 'desc' } },
        price_alerts: true,
        fare_freezes: true,
      },
    });

    if (!user) return null;

    const allBookings = user.trips.flatMap((t) => t.bookings);
    const allPayments = allBookings.flatMap((b) => b.payments);
    const succeededPayments = allPayments.filter(
      (p) => p.status === 'SUCCEEDED',
    );

    const revenueByProduct: Record<string, number> = {};
    for (const booking of allBookings) {
      const bookingPayments = booking.payments.filter(
        (p) => p.status === 'SUCCEEDED',
      );
      const revenue = bookingPayments.reduce((s, p) => s + Number(p.amount), 0);
      const key = booking.type;
      revenueByProduct[key] = (revenueByProduct[key] || 0) + revenue;
    }

    return {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        membershipTier: user.membership_tier,
        pointsBalance: user.points_balance,
        nationality: user.nationality,
        homeAirport: user.home_airport,
        seatPreference: user.seat_preference,
        mealPreference: user.meal_preference,
        emergencyContact: user.emergency_contact,
        emergencyPhone: user.emergency_phone,
        passportNumber: user.passport_number
          ? `***${user.passport_number.slice(-4)}`
          : null,
        passportExpiry: user.passport_expiry,
        passportCountry: user.passport_country,
        onboardingCompleted: user.onboarding_completed,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
      bookings: allBookings.map((b) => ({
        id: b.id,
        type: b.type,
        status: b.status,
        supplierRef: b.supplier_ref,
        payments: b.payments.map((p) => ({
          amount: Number(p.amount),
          currency: p.currency,
          status: p.status,
          reference: p.paystack_reference,
          createdAt: p.created_at,
        })),
        reviews: b.reviews,
        createdAt: b.created_at,
      })),
      esimOrders: user.esim_orders.map((o) => ({
        id: o.id,
        plan: o.esim_plan,
        status: o.status,
        iccid: o.iccid,
        airtimeMinutes: o.airtime_minutes,
        createdAt: o.created_at,
      })),
      interactions: user.interactions,
      leads: user.leads,
      revenueByProduct,
      totalRevenue: succeededPayments.reduce((s, p) => s + Number(p.amount), 0),
      rewards: user.rewards,
      memberships: user.memberships,
      priceAlerts: user.price_alerts,
    };
  }

  async getCustomerInteractions(userId: string, limit = 50) {
    return this.prisma.customerInteraction.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  async getInteractionsByInquiry(inquiryId: string) {
    return this.prisma.customerInteraction.findMany({
      where: { inquiry_id: inquiryId },
      orderBy: { created_at: 'asc' },
    });
  }

  async getCustomerRevenue(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        trips: {
          include: {
            bookings: {
              include: { payments: { where: { status: 'SUCCEEDED' } } },
            },
          },
        },
        esim_orders: { include: { esim_plan: true } },
      },
    });

    if (!user) return null;

    const allBookings = user.trips.flatMap((t) => t.bookings);
    const byType: Record<
      string,
      { count: number; totalGhs: number; totalUsd: number }
    > = {};

    for (const booking of allBookings) {
      if (!byType[booking.type]) {
        byType[booking.type] = { count: 0, totalGhs: 0, totalUsd: 0 };
      }
      byType[booking.type].count++;
      for (const p of booking.payments) {
        if (p.currency === 'GHS')
          byType[booking.type].totalGhs += Number(p.amount);
        else if (p.currency === 'USD')
          byType[booking.type].totalUsd += Number(p.amount);
      }
    }

    return { userId, revenueByProduct: byType };
  }

  async getPipeline(params: {
    source?: string;
    agent?: string;
    stage?: string;
  }) {
    const where: Record<string, any> = {};
    if (params.source && params.source !== 'ALL') where.source = params.source;
    if (params.agent) where.assigned_agent = params.agent;
    if (params.stage && params.stage !== 'ALL') where.stage = params.stage;

    const leads = await this.prisma.leadPipeline.findMany({
      where,
      orderBy: { updated_at: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            membership_tier: true,
          },
        },
        inquiry: true,
      },
    });

    const stages = [
      'NEW',
      'CONTACTED',
      'QUALIFIED',
      'PROPOSAL_SENT',
      'NEGOTIATING',
      'WON',
      'LOST',
      'DORMANT',
    ];
    const pipeline: Record<string, typeof leads> = {};
    for (const stage of stages) {
      pipeline[stage] = leads.filter((l) => l.stage === stage);
    }

    const stageValues: Record<string, number> = {};
    for (const stage of stages) {
      stageValues[stage] = pipeline[stage].reduce(
        (sum, l) => sum + Number(l.estimated_value || 0),
        0,
      );
    }

    return { pipeline, stageValues, total: leads.length };
  }

  async updateLeadStage(
    leadId: string,
    data: {
      stage: string;
      assigned_agent?: string;
      notes?: string;
      lost_reason?: string;
    },
  ) {
    return this.prisma.leadPipeline.update({
      where: { id: leadId },
      data: {
        stage: data.stage as any,
        ...(data.assigned_agent !== undefined
          ? { assigned_agent: data.assigned_agent }
          : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(data.lost_reason !== undefined
          ? { lost_reason: data.lost_reason }
          : {}),
      },
    });
  }

  async logInteraction(data: {
    user_id?: string;
    channel: string;
    subject: string;
    content: string;
    metadata?: Record<string, any>;
    agent_id?: string;
    inquiry_id?: string;
    booking_id?: string;
  }) {
    return this.prisma.customerInteraction.create({
      data: {
        user_id: data.user_id || null,
        channel: data.channel as any,
        subject: data.subject,
        content: data.content,
        metadata: data.metadata || undefined,
        agent_id: data.agent_id || null,
        inquiry_id: data.inquiry_id || null,
        booking_id: data.booking_id || null,
      },
    });
  }

  async getStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalCustomers,
      activeThisMonth,
      newLeads7d,
      wonLeads,
      totalLeads,
      activeEsims,
      openInquiriesCount,
      atRiskCount,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.customerInteraction
        .groupBy({
          by: ['user_id'],
          where: { created_at: { gte: thirtyDaysAgo }, user_id: { not: null } },
        })
        .then((r) => r.length),
      this.prisma.leadPipeline.count({
        where: { stage: 'NEW', created_at: { gte: sevenDaysAgo } },
      }),
      this.prisma.leadPipeline.count({ where: { stage: 'WON' } }),
      this.prisma.leadPipeline.count({
        where: { stage: { notIn: ['WON', 'LOST', 'DORMANT'] } },
      }),
      this.prisma.eSIMOrder.count({ where: { status: 'ACTIVE' } }),
      this.prisma.leadPipeline.count({
        where: {
          stage: {
            in: [
              'NEW',
              'CONTACTED',
              'QUALIFIED',
              'PROPOSAL_SENT',
              'NEGOTIATING',
            ],
          },
        },
      }),
      this.prisma.user.count({
        where: {
          role: 'USER',
          updated_at: { lt: sixtyDaysAgo },
          trips: { some: {} },
        },
      }),
    ]);

    const conversionRate =
      totalLeads > 0
        ? Math.round((wonLeads / (wonLeads + totalLeads)) * 100)
        : 0;

    return {
      totalCustomers,
      activeThisMonth,
      newLeads7d,
      conversionRate,
      activeEsims,
      openInquiries: openInquiriesCount,
      atRiskCount,
      wonLeads,
    };
  }
}
