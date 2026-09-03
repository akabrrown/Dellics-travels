/**
 * Dellics Travels Admin Portal - Offline Demo & Fallback Catalog
 * Provides realistic, comprehensive operational datasets when apps/api is offline
 * or undergoing deployment/maintenance.
 */

export interface DemoBooking {
  id: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone?: string;
  type: string;
  tripTitle: string;
  supplierRef?: string;
  amount: number;
  currency: string;
  status: "HELD" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  paymentStatus: string;
  paymentReference?: string;
  createdAt: string;
}

export const DEMO_BOOKINGS: DemoBooking[] = [
  {
    id: "BK-782194",
    travelerName: "Kwame Mensah",
    travelerEmail: "kwame.mensah@ghacem.com",
    travelerPhone: "+233 24 412 8901",
    type: "FLIGHT",
    tripTitle: "Accra (ACC) → London Heathrow (LHR)",
    supplierRef: "BA-ACC-98214",
    amount: 14250.0,
    currency: "GHS",
    status: "CONFIRMED",
    paymentStatus: "SETTLED",
    paymentReference: "PAYSTACK-TRX-829104",
    createdAt: "2026-09-02T14:22:00.000Z",
  },
  {
    id: "BK-691024",
    travelerName: "Abena Osei-Tutu",
    travelerEmail: "abena.osei@asanka.org",
    travelerPhone: "+233 20 892 4110",
    type: "HOTEL",
    tripTitle: "Labadi Beach Hotel - Executive Ocean Suite (4 Nights)",
    supplierRef: "RH-LBH-4491",
    amount: 8600.0,
    currency: "GHS",
    status: "CONFIRMED",
    paymentStatus: "SETTLED",
    paymentReference: "MOMO-MTN-918231",
    createdAt: "2026-09-02T11:15:00.000Z",
  },
  {
    id: "BK-552910",
    travelerName: "Kofi Boateng",
    travelerEmail: "kofi.boateng@stanbic.com.gh",
    travelerPhone: "+233 27 719 3302",
    type: "FLIGHT",
    tripTitle: "Accra (ACC) → Dubai (DXB) Roundtrip",
    supplierRef: "EK-788-ACC",
    amount: 18900.0,
    currency: "GHS",
    status: "HELD",
    paymentStatus: "PENDING",
    paymentReference: "HELD-INV-55291",
    createdAt: "2026-09-03T09:40:00.000Z",
  },
  {
    id: "BK-441829",
    travelerName: "Ama Serwaa",
    travelerEmail: "ama.serwaa@gmail.com",
    travelerPhone: "+233 55 201 8490",
    type: "PACKAGE",
    tripTitle: "Cape Coast Heritage & Kakum Canopy Walk (Weekend)",
    supplierRef: "DLX-TOURS-CC01",
    amount: 2900.0,
    currency: "GHS",
    status: "CONFIRMED",
    paymentStatus: "SETTLED",
    paymentReference: "PAYSTACK-TRX-194820",
    createdAt: "2026-09-01T16:30:00.000Z",
  },
  {
    id: "BK-382910",
    travelerName: "Dr. Yaw Darko",
    travelerEmail: "yaw.darko@kbs.edu.gh",
    travelerPhone: "+233 24 330 9182",
    type: "ESIM",
    tripTitle: "Global Roaming 10GB Data Package (30 Days)",
    supplierRef: "AIR-GLB-10G-881",
    amount: 450.0,
    currency: "GHS",
    status: "COMPLETED",
    paymentStatus: "SETTLED",
    paymentReference: "PAYSTACK-TRX-091823",
    createdAt: "2026-08-30T10:05:00.000Z",
  },
  {
    id: "BK-291840",
    travelerName: "Evelyn Addo",
    travelerEmail: "evelyn.addo@ecobank.com",
    travelerPhone: "+233 50 119 2840",
    type: "HOTEL",
    tripTitle: "Kempinski Gold Coast City - Deluxe Suite (2 Nights)",
    supplierRef: "RH-KMP-9921",
    amount: 6200.0,
    currency: "GHS",
    status: "CANCELLED",
    paymentStatus: "REFUNDED",
    paymentReference: "REF-29184-ECO",
    createdAt: "2026-08-28T08:12:00.000Z",
  },
  {
    id: "BK-194820",
    travelerName: "Samuel K. Quaye",
    travelerEmail: "samuel.quaye@tullowoil.com",
    travelerPhone: "+233 24 550 9912",
    type: "FLIGHT",
    tripTitle: "Accra (ACC) → Johannesburg (JNB)",
    supplierRef: "SA-056-ACC",
    amount: 11800.0,
    currency: "GHS",
    status: "COMPLETED",
    paymentStatus: "SETTLED",
    paymentReference: "PAYSTACK-TRX-771920",
    createdAt: "2026-08-25T13:45:00.000Z",
  },
  {
    id: "BK-109284",
    travelerName: "Nana Akua Frimpong",
    travelerEmail: "nana.akua@vodafone.com.gh",
    travelerPhone: "+233 20 334 8192",
    type: "PACKAGE",
    tripTitle: "Safari Valley Luxury Eco-Retreat (3D/2N)",
    supplierRef: "DLX-TOURS-SV02",
    amount: 9600.0,
    currency: "GHS",
    status: "HELD",
    paymentStatus: "PENDING",
    paymentReference: "HELD-INV-10928",
    createdAt: "2026-09-03T18:20:00.000Z",
  },
];

export const DEMO_OVERVIEW = {
  pipeline: [
    { label: "Held Bookings", count: 2, sub: "Awaiting Traveler Settlement", status: "HELD" },
    { label: "Confirmed & Ticketed", count: 5, sub: "GDS Live & Active", status: "CONFIRMED" },
    { label: "Completed Journeys", count: 38, sub: "Travelled & Reconciled", status: "COMPLETED" },
    { label: "Cancelled / Voided", count: 1, sub: "Processed or Voided", status: "CANCELLED" },
  ],
  counts: {
    total: 46,
    held: 2,
    confirmed: 5,
    completed: 38,
    cancelled: 1,
  },
  totalRevenueGHS: 184500.0,
  recentBookings: DEMO_BOOKINGS.slice(0, 5),
};

export const DEMO_FINANCE = {
  transactions: [
    {
      id: "TX-90182",
      reference: "PAYSTACK-TRX-829104",
      amount: 14250.0,
      currency: "GHS",
      status: "SUCCESS",
      createdAt: "2026-09-02T14:22:00.000Z",
      bookingId: "BK-782194",
      bookingType: "FLIGHT",
      bookingStatus: "CONFIRMED",
      travelerName: "Kwame Mensah",
      travelerEmail: "kwame.mensah@ghacem.com",
      tripTitle: "Accra (ACC) → London Heathrow (LHR)",
    },
    {
      id: "TX-90181",
      reference: "MOMO-MTN-918231",
      amount: 8600.0,
      currency: "GHS",
      status: "SUCCESS",
      createdAt: "2026-09-02T11:15:00.000Z",
      bookingId: "BK-691024",
      bookingType: "HOTEL",
      bookingStatus: "CONFIRMED",
      travelerName: "Abena Osei-Tutu",
      travelerEmail: "abena.osei@asanka.org",
      tripTitle: "Labadi Beach Hotel - Executive Ocean Suite",
    },
    {
      id: "TX-90180",
      reference: "HELD-INV-55291",
      amount: 18900.0,
      currency: "GHS",
      status: "PENDING",
      createdAt: "2026-09-03T09:40:00.000Z",
      bookingId: "BK-552910",
      bookingType: "FLIGHT",
      bookingStatus: "HELD",
      travelerName: "Kofi Boateng",
      travelerEmail: "kofi.boateng@stanbic.com.gh",
      tripTitle: "Accra (ACC) → Dubai (DXB) Roundtrip",
    },
    {
      id: "TX-90179",
      reference: "REF-29184-ECO",
      amount: 6200.0,
      currency: "GHS",
      status: "REFUNDED",
      createdAt: "2026-08-28T08:12:00.000Z",
      bookingId: "BK-291840",
      bookingType: "HOTEL",
      bookingStatus: "CANCELLED",
      travelerName: "Evelyn Addo",
      travelerEmail: "evelyn.addo@ecobank.com",
      tripTitle: "Kempinski Gold Coast City - Deluxe Suite",
    },
  ],
  stats: {
    grossVolumeGHS: 184500.0,
    successfulCount: 42,
    pendingCount: 2,
    refundedCount: 1,
    totalCount: 45,
  },
};

export const DEMO_TRAVELERS = [
  {
    id: "TRV-001",
    name: "Kwame Mensah",
    email: "kwame.mensah@ghacem.com",
    phone: "+233 24 412 8901",
    membershipTier: "ELITE",
    pointsBalance: 12500,
    totalTrips: 8,
    totalBookings: 12,
    createdAt: "2025-11-10T10:00:00.000Z",
  },
  {
    id: "TRV-002",
    name: "Abena Osei-Tutu",
    email: "abena.osei@asanka.org",
    phone: "+233 20 892 4110",
    membershipTier: "GOLD",
    pointsBalance: 6400,
    totalTrips: 4,
    totalBookings: 6,
    createdAt: "2026-01-15T12:30:00.000Z",
  },
  {
    id: "TRV-003",
    name: "Kofi Boateng",
    email: "kofi.boateng@stanbic.com.gh",
    phone: "+233 27 719 3302",
    membershipTier: "ELITE",
    pointsBalance: 18200,
    totalTrips: 11,
    totalBookings: 15,
    createdAt: "2025-08-20T09:15:00.000Z",
  },
  {
    id: "TRV-004",
    name: "Ama Serwaa",
    email: "ama.serwaa@gmail.com",
    phone: "+233 55 201 8490",
    membershipTier: "EXPLORER",
    pointsBalance: 1200,
    totalTrips: 2,
    totalBookings: 2,
    createdAt: "2026-03-05T14:40:00.000Z",
  },
  {
    id: "TRV-005",
    name: "Dr. Yaw Darko",
    email: "yaw.darko@kbs.edu.gh",
    phone: "+233 24 330 9182",
    membershipTier: "GOLD",
    pointsBalance: 4800,
    totalTrips: 3,
    totalBookings: 4,
    createdAt: "2026-02-18T16:00:00.000Z",
  },
  {
    id: "TRV-006",
    name: "Nana Akua Frimpong",
    email: "nana.akua@vodafone.com.gh",
    phone: "+233 20 334 8192",
    membershipTier: "EXPLORER",
    pointsBalance: 950,
    totalTrips: 1,
    totalBookings: 1,
    createdAt: "2026-04-12T11:20:00.000Z",
  },
];

export const DEMO_INQUIRIES = {
  items: [
    {
      id: "INQ-4401",
      kind: "BOOKING_MODIFICATION",
      name: "Kwame Mensah",
      email: "kwame.mensah@ghacem.com",
      phone: "+233 24 412 8901",
      message:
        "Requesting flight date shift for British Airways ACC-LHR flight to Sep 18th due to board meeting rescheduling.",
      created_at: "2026-09-03T17:10:00.000Z",
    },
    {
      id: "INQ-4402",
      kind: "CORPORATE_TRAVEL",
      name: "Abena Osei-Tutu",
      email: "abena.osei@asanka.org",
      phone: "+233 20 892 4110",
      message:
        "Need group rate quote for 14 delegates attending the West Africa Sustainable Energy Summit in Nairobi.",
      created_at: "2026-09-03T15:25:00.000Z",
    },
    {
      id: "INQ-4403",
      kind: "ESIM_SUPPORT",
      name: "Dr. Yaw Darko",
      email: "yaw.darko@kbs.edu.gh",
      phone: "+233 24 330 9182",
      message:
        "Please resend QR activation code for Global 10GB package to my alternate email address.",
      created_at: "2026-09-02T19:40:00.000Z",
    },
  ],
  stats: {
    total: 3,
    inquiries: 2,
    contacts: 1,
  },
};

export const DEMO_REFUNDS = [
  {
    id: "REF-001",
    reference: "REF-29184-ECO",
    amount: 6200.0,
    currency: "GHS",
    status: "REFUNDED",
    createdAt: "2026-08-28T08:12:00.000Z",
    bookingId: "BK-291840",
    travelerName: "Evelyn Addo",
    travelerEmail: "evelyn.addo@ecobank.com",
    tripTitle: "Kempinski Gold Coast City - Deluxe Suite (2 Nights)",
  },
  {
    id: "REF-002",
    reference: "REF-PENDING-4401",
    amount: 1450.0,
    currency: "GHS",
    status: "PENDING_AUDIT",
    createdAt: "2026-09-02T09:30:00.000Z",
    bookingId: "BK-192830",
    travelerName: "Kofi Owusu",
    travelerEmail: "kofi.owusu@gmail.com",
    tripTitle: "Safari Valley Eco Day Pass",
  },
];

export const DEMO_ESIMS = [
  {
    id: "ESIM-1001",
    travelerName: "Dr. Yaw Darko",
    travelerEmail: "yaw.darko@kbs.edu.gh",
    region: "Global (130+ Countries)",
    dataAmount: "10 GB",
    validityDays: 30,
    priceGHS: 450.0,
    status: "ACTIVE",
    iccid: "8988210928310928419",
    createdAt: "2026-08-30T10:05:00.000Z",
  },
  {
    id: "ESIM-1002",
    travelerName: "Kwame Mensah",
    travelerEmail: "kwame.mensah@ghacem.com",
    region: "Europe Regional (38 Countries)",
    dataAmount: "5 GB",
    validityDays: 14,
    priceGHS: 280.0,
    status: "ACTIVE",
    iccid: "8988210928310928420",
    createdAt: "2026-09-02T14:30:00.000Z",
  },
  {
    id: "ESIM-1003",
    travelerName: "Kofi Boateng",
    travelerEmail: "kofi.boateng@stanbic.com.gh",
    region: "UAE & Middle East",
    dataAmount: "3 GB",
    validityDays: 7,
    priceGHS: 195.0,
    status: "PENDING_INSTALL",
    iccid: "8988210928310928421",
    createdAt: "2026-09-03T09:45:00.000Z",
  },
];

/**
 * Resolves offline fallback responses based on endpoint path and query parameters
 */
export function getOfflineFallback(path: string): any {
  const [cleanPath, queryString] = path.split("?");
  const params = new URLSearchParams(queryString || "");

  if (cleanPath === "/booking/admin/all") {
    let list = [...DEMO_BOOKINGS];
    const status = params.get("status");
    const type = params.get("type");
    const search = params.get("search");

    if (status && status !== "ALL") {
      list = list.filter((b) => b.status === status);
    }
    if (type && type !== "ALL") {
      list = list.filter((b) => b.type === type);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.travelerName.toLowerCase().includes(q) ||
          b.travelerEmail.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q) ||
          (b.supplierRef && b.supplierRef.toLowerCase().includes(q)) ||
          b.tripTitle.toLowerCase().includes(q)
      );
    }
    return { status: "success", count: list.length, data: list };
  }

  if (cleanPath === "/booking/admin/overview") {
    return { status: "success", data: DEMO_OVERVIEW };
  }

  if (cleanPath === "/booking/admin/refunds") {
    return { status: "success", count: DEMO_REFUNDS.length, data: DEMO_REFUNDS };
  }

  if (cleanPath === "/payments/admin/transactions") {
    return {
      status: "success",
      count: DEMO_FINANCE.transactions.length,
      data: DEMO_FINANCE.transactions,
    };
  }

  if (cleanPath === "/payments/stats") {
    return { status: "success", data: DEMO_FINANCE.stats };
  }

  if (cleanPath === "/auth/admin/users") {
    return { status: "success", count: DEMO_TRAVELERS.length, data: DEMO_TRAVELERS };
  }

  if (cleanPath === "/inquiries") {
    return { status: "success", count: DEMO_INQUIRIES.items.length, data: DEMO_INQUIRIES.items };
  }

  if (cleanPath === "/inquiries/stats") {
    return { status: "success", data: DEMO_INQUIRIES.stats };
  }

  if (cleanPath === "/esim/admin/orders") {
    return { status: "success", count: DEMO_ESIMS.length, data: DEMO_ESIMS };
  }

  return undefined;
}
