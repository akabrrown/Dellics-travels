const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../apps/api/src/booking/booking.service.ts');
let content = fs.readFileSync(file, 'utf8');

const overviewStart = content.indexOf('  async getAdminOverview() {');
const overviewEnd = content.indexOf('  async getAdminBookings(params: {');

if (overviewStart === -1 || overviewEnd === -1) {
  console.log("Could not find overview/bookings functions");
  process.exit(1);
}

const newOverview = `  async getAdminOverview() {
    try {
      const [
        bookings,
        tours,
        esims,
        payments,
      ] = await Promise.all([
        this.prisma.booking.findMany({ include: { trip: { include: { user: true } }, payments: true } }),
        this.prisma.tourBooking.findMany({ include: { user: true, tour_package: true } }),
        this.prisma.eSIMOrder.findMany({ include: { user: true, esim_plan: true } }),
        this.prisma.payment.findMany({ where: { status: 'SUCCEEDED' }, select: { amount: true, currency: true } })
      ]);

      const allItems = [
        ...bookings.map(b => ({
          id: b.id,
          type: b.type,
          status: b.status,
          supplierRef: b.supplier_ref,
          travelerName: b.trip?.user?.name || 'Client',
          travelerEmail: b.trip?.user?.email || '',
          membershipTier: b.trip?.user?.membership_tier || 'EXPLORER',
          tripTitle: b.trip?.title || 'Trip',
          createdAt: b.created_at,
          amount: b.payments?.[0]?.amount ? Number(b.payments[0].amount) : 0,
          currency: b.payments?.[0]?.currency || 'USD',
        })),
        ...tours.map(t => ({
          id: t.id,
          type: 'PACKAGE',
          status: t.status,
          supplierRef: t.paystack_reference,
          travelerName: t.user?.name || t.lead_pax_name || 'Client',
          travelerEmail: t.user?.email || t.lead_pax_email || '',
          membershipTier: t.user?.membership_tier || 'EXPLORER',
          tripTitle: t.tour_package?.title || 'Tour',
          createdAt: t.created_at,
          amount: Number(t.amount) || 0,
          currency: t.currency || 'USD',
        })),
        ...esims.map(e => ({
          id: e.id,
          type: 'ESIM',
          status: e.status === 'COMPLETED' ? 'CONFIRMED' : e.status, // Normalize status
          supplierRef: e.paystack_reference,
          travelerName: e.user?.name || 'Client',
          travelerEmail: e.user?.email || '',
          membershipTier: e.user?.membership_tier || 'EXPLORER',
          tripTitle: \`eSIM: \${e.esim_plan?.country_or_region || 'Global'}\`,
          createdAt: e.created_at,
          amount: e.esim_plan?.price ? Number(e.esim_plan.price) : 0,
          currency: 'USD',
        }))
      ];

      const sortedRecent = allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const total = allItems.length;
      const held = allItems.filter(b => b.status === 'HELD' || b.status === 'PENDING').length;
      const confirmed = allItems.filter(b => b.status === 'CONFIRMED' || b.status === 'ACTIVE').length;
      const completed = allItems.filter(b => b.status === 'COMPLETED').length;
      const cancelled = allItems.filter(b => b.status === 'CANCELLED').length;

      const totalRevenueGHS = payments.reduce((acc, p) => acc + Number(p.amount), 0);

      return {
        status: 'success',
        data: {
          pipeline: [
            { label: 'Pending/Held', count: held, sub: 'Active holds', status: 'HELD' },
            { label: 'Confirmed', count: confirmed, sub: 'Ticketed & active', status: 'CONFIRMED' },
            { label: 'Completed', count: completed, sub: 'Completed trips', status: 'COMPLETED' },
            { label: 'Cancelled', count: cancelled, sub: 'Voided', status: 'CANCELLED' },
          ],
          counts: { total, held, confirmed, completed, cancelled },
          totalRevenueGHS,
          recentBookings: sortedRecent.slice(0, 10),
        },
      };
    } catch (err: any) {
      this.logger.error(\`getAdminOverview failed: \${err.message}\`);
      return { status: 'error', data: { pipeline: [], counts: { total: 0, held: 0, confirmed: 0, completed: 0, cancelled: 0 }, totalRevenueGHS: 0, recentBookings: [] } };
    }
  }

`;

const bookingsStart = overviewEnd;
const refundsStart = content.indexOf('  async getAdminRefunds() {');

if (refundsStart === -1) {
  console.log("Could not find refunds function");
  process.exit(1);
}

const newBookings = `  async getAdminBookings(params: {
    status?: string;
    type?: string;
    search?: string;
    limit?: number;
  }) {
    try {
      // We will fetch all and filter in memory for simplicity, or use multiple queries
      const [bookings, tours, esims] = await Promise.all([
        this.prisma.booking.findMany({ include: { trip: { include: { user: true } }, payments: true } }),
        this.prisma.tourBooking.findMany({ include: { user: true, tour_package: true } }),
        this.prisma.eSIMOrder.findMany({ include: { user: true, esim_plan: true } })
      ]);

      let allItems = [
        ...bookings.map(b => ({
          id: b.id,
          type: b.type,
          status: b.status,
          supplierRef: b.supplier_ref,
          travelerName: b.trip?.user?.name || 'Client',
          travelerEmail: b.trip?.user?.email || '',
          travelerPhone: b.trip?.user?.phone || '',
          membershipTier: b.trip?.user?.membership_tier || 'EXPLORER',
          tripTitle: b.trip?.title || 'Trip',
          startDate: b.trip?.start_date,
          endDate: b.trip?.end_date,
          createdAt: b.created_at,
          paymentStatus: b.payments?.[0]?.status || 'PENDING',
          paymentReference: b.payments?.[0]?.paystack_reference || null,
          amount: b.payments?.[0]?.amount ? Number(b.payments[0].amount) : 0,
          currency: b.payments?.[0]?.currency || 'USD',
        })),
        ...tours.map(t => ({
          id: t.id,
          type: 'PACKAGE',
          status: t.status,
          supplierRef: t.paystack_reference,
          travelerName: t.user?.name || t.lead_pax_name || 'Client',
          travelerEmail: t.user?.email || t.lead_pax_email || '',
          travelerPhone: t.user?.phone || t.lead_pax_phone || '',
          membershipTier: t.user?.membership_tier || 'EXPLORER',
          tripTitle: t.tour_package?.title || 'Tour',
          startDate: t.departure_date,
          endDate: null,
          createdAt: t.created_at,
          paymentStatus: 'SUCCEEDED', // Assuming paid if it exists or use status
          paymentReference: t.paystack_reference,
          amount: Number(t.amount) || 0,
          currency: t.currency || 'USD',
        })),
        ...esims.map(e => ({
          id: e.id,
          type: 'ESIM',
          status: e.status === 'COMPLETED' ? 'CONFIRMED' : e.status,
          supplierRef: e.paystack_reference,
          travelerName: e.user?.name || 'Client',
          travelerEmail: e.user?.email || '',
          travelerPhone: e.user?.phone || '',
          membershipTier: e.user?.membership_tier || 'EXPLORER',
          tripTitle: \`eSIM: \${e.esim_plan?.country_or_region || 'Global'}\`,
          startDate: null,
          endDate: null,
          createdAt: e.created_at,
          paymentStatus: 'SUCCEEDED',
          paymentReference: e.paystack_reference,
          amount: e.esim_plan?.price ? Number(e.esim_plan.price) : 0,
          currency: 'USD',
        }))
      ];

      // Apply Filters
      if (params.status && params.status !== 'ALL') {
        allItems = allItems.filter(i => i.status === params.status);
      }
      if (params.type && params.type !== 'ALL') {
        allItems = allItems.filter(i => i.type === params.type);
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        allItems = allItems.filter(i => 
          i.id.toLowerCase().includes(s) || 
          (i.supplierRef && i.supplierRef.toLowerCase().includes(s)) ||
          (i.tripTitle && i.tripTitle.toLowerCase().includes(s)) ||
          (i.travelerName && i.travelerName.toLowerCase().includes(s)) ||
          (i.travelerEmail && i.travelerEmail.toLowerCase().includes(s))
        );
      }

      allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      const limit = params.limit || 50;
      const paginated = allItems.slice(0, limit);

      return {
        status: 'success',
        count: allItems.length,
        data: paginated,
      };
    } catch (err: any) {
      this.logger.error(\`getAdminBookings failed: \${err.message}\`);
      return { status: 'error', count: 0, data: [] };
    }
  }

  /**
`;

let finalContent = content.slice(0, overviewStart) + newOverview + newBookings + content.slice(refundsStart);

fs.writeFileSync(file, finalContent);
console.log("Updated bookings service successfully!");
