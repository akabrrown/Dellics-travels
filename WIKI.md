# Dellics Travels — Official Monorepo Wiki & Architecture Blueprint

> **"See the World"** — A multi-platform flight, hotel, curated tour package, and global eSIM digital booking platform tailored for the Ghanaian, West African, and international diaspora markets.
> Benchmarked against **Booking.com, Trip.com, Skyscanner, Hopper, Airalo, and Stripe**.

---

## 1. Monorepo Architecture Overview

Dellics Travels is structured as a high-performance **Turborepo + pnpm monorepo** with unified shared TypeScript packages, a central NestJS backend API, and specialized frontend clients:

```
Dellics Travels (Monorepo)
├── apps/
│   ├── api/          # NestJS Core Backend (Port 3000) — Auth, Booking, Payments, Inquiries, eSIM, Health
│   ├── web/          # Next.js 16 Customer Web Portal (Port 3001) — Flights, Hotels, Tours, eSIM, Inquiries
│   ├── admin/        # Next.js 16 Operational Command Center (Port 3002) — Pipeline, Ledger, Support, CMS
│   └── mobile/       # Expo / React Native Cross-Platform App (iOS & Android)
├── packages/
│   ├── api-client/   # Typed isomorphic HTTP client for Web, Mobile, and Admin
│   ├── shared-types/ # Universal Prisma & Domain DTO models across all apps
│   ├── config/       # Shared ESLint, Tailwind, and TypeScript configs
│   └── ui/           # Design System & Token Primitives (Navy #0A0060, Orange #F4740D)
├── wiki/             # Modular Markdown Knowledge Base & Figma Specs
└── docs/             # Technical specifications, API reference, and operational guides
```

---

## 2. Universal API Endpoints Catalogue

All client frontends (Web, Admin, Mobile) communicate through the single central NestJS API (`http://localhost:3000` or production Render instance).

### Core Search & Inventory
| Method | Endpoint | Description | Supplier / Service |
|---|---|---|---|
| `GET` | `/search/flights` | Search flight offers with multi-tier cabin options | Duffel GDS |
| `GET` | `/search/hotels` | Search hotel inventory, rooms, and rate rules | RateHawk API |
| `GET` | `/search/packages` | Retrieve curated local and international tour packages | Database CMS |
| `GET` | `/search/esim` | Query global eSIM data roaming packages | Airalo Partner API |
| `GET` | `/search/airports` | Live IATA airport and city autocomplete | Travelpayouts / Duffel |
| `GET` | `/search/rates` | Live real-time currency exchange rates | Open Exchange Rates API |

### Bookings & Reservations
| Method | Endpoint | Description | Auth Scope |
|---|---|---|---|
| `POST` | `/booking/create` | Create reservation with idempotency key | User / Client JWT |
| `POST` | `/booking/payment-intent`| Initialize payment intent for booking | User / Client JWT |
| `POST` | `/booking/webhook/paystack` | Webhook receiver for Paystack charge notifications | Paystack Signature |
| `GET` | `/booking/admin/overview` | Dashboard pipeline metrics & revenue sums | Admin JWT |
| `GET` | `/booking/admin/all` | Filtered & paginated bookings ledger | Admin JWT |
| `GET` | `/booking/admin/refunds` | Pending & settled customer refund ledger | Admin JWT |

### Payments & Financial Ledger
| Method | Endpoint | Description | Auth Scope |
|---|---|---|---|
| `POST` | `/payments/initialize` | Initialize Paystack checkout transaction | Public / User |
| `GET` | `/payments/verify/:ref` | Verify transaction status by Paystack reference | Public / User |
| `POST` | `/payments/webhook` | Universal Paystack webhook handler | Paystack Signature |
| `GET` | `/payments/admin/transactions` | Filtered list of all payment transactions | Admin JWT |
| `GET` | `/payments/stats` | Gross volume, successful count, and refund metrics | Admin JWT |

### eSIM Data Roaming
| Method | Endpoint | Description | Auth Scope |
|---|---|---|---|
| `GET` | `/esim/packages` | Query available regional & global eSIM plans | Public |
| `POST` | `/esim/order` | Place eSIM order and provision via Airalo API | User JWT |
| `GET` | `/esim/orders` | Get user's active eSIM profiles and QR codes | User JWT |
| `GET` | `/esim/admin/orders` | Admin overview of all provisioned eSIMs | Admin JWT |

### Customer Inquiries & Support Desk
| Method | Endpoint | Description | Auth Scope |
|---|---|---|---|
| `POST` | `/inquiries` | Submit custom holiday inquiry or contact message | Public |
| `GET` | `/inquiries` | Retrieve list of all client inquiries | Admin JWT |
| `GET` | `/inquiries/stats` | Overview counts of custom inquiries vs contact notes | Admin JWT |

### Traveler Identity & Accounts
| Method | Endpoint | Description | Auth Scope |
|---|---|---|---|
| `POST` | `/auth/sync` | Sync Supabase Auth profile to Prisma database | System / User |
| `GET` | `/auth/admin/users` | List registered travelers, tiers, and bookings | Admin JWT |

---

## 3. Brand Tokens & Design System

- **Primary Brand Navy:** `#0A0060` (Deep Ghanaian Navy — Trust, Authority, Distinction)
- **Primary Brand Orange:** `#F4740D` (Warm Gold/Orange — Action, Warmth, Ghanaian Sunset)
- **Supporting Accents:** Emerald `#059669` (Confirmed / Safe), Amber `#D97706` (Hold / Action), Rose `#E11D48` (Alert / Void)
- **Typography:** Display: `Plus Jakarta Sans`, Body: `Inter`, Code: `JetBrains Mono`

---

## 4. Local Development & Running the Monorepo

```bash
# 1. Install all monorepo dependencies
pnpm install

# 2. Start all services concurrently (API: 3000, Web: 3001, Admin: 3002)
pnpm run dev

# 3. Individual package scripts:
pnpm --filter api run start:dev     # Start NestJS backend
pnpm --filter web run dev           # Start Next.js web application
pnpm --filter admin run dev         # Start Next.js admin dashboard
pnpm --filter mobile run start      # Start Expo mobile app

# 4. Build verification
pnpm --filter api exec nest build   # Compile NestJS
pnpm --filter web exec next build   # Compile Web
pnpm --filter admin exec next build # Compile Admin
```

---

## 5. Security & Multi-Role Permissions

- **Row Level Security (RLS):** Supabase Postgres isolates user trips, documents, and booking records.
- **Admin Elevation:** Role claims (`SUPPORT_AGENT`, `CONTENT_ADMIN`, `SUPER_ADMIN`) are enforced in NestJS guards and checked per record ID (IDOR mitigation).
- **Idempotency Keys:** Every booking mutation requires an `Idempotency-Key` header to prevent duplicate charges or multi-clicks.

---

*Dellics Travels · Tema Community 25, Devtraco Estate, Ghana · +233 55 205 4174 · info@dellicstravels.com*
