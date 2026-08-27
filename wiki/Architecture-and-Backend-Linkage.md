# Architecture & Backend Linkage

## One backend, two front doors

The Dellics Travels Admin Website is a **separate application** from the traveler-facing mobile app and companion web app, but it shares the **same NestJS backend and PostgreSQL database**, viewed through an elevated, role-gated lens.

> **There is no separate "admin API."** The admin website and the mobile app call the same NestJS modules. What differs is the **JWT scope**: an admin token carries a role claim (Support Agent / Content Admin / Super Admin) that unlocks additional endpoints and bypasses traveler-scoped Row-Level Security under audited conditions.

Consequences of this design:

- An action taken in the admin website (e.g. approving a refund) is reflected on the traveler's phone (e.g. Trip Detail status update) through a **single, traceable path** — not two systems kept in sync by hand.
- Admin "Retry provisioning" for a failed eSIM calls the **identical** `EsimService` method the original purchase used.
- A traveler's chat message and an agent's reply are rows in the **same table**, rendered on two different screens.

## Module ↔ Screen linkage map

Every backend module, and exactly which mobile screens (**S**-IDs) and admin screens (**A**-IDs) call into it. This map proves the admin website and mobile app are two views onto one backend.

| Backend Module (NestJS) | Mobile App Screens | Admin Screens | Sync Mechanism |
|---|---|---|---|
| **Auth** (Supabase JWT + RLS) | S03–S07 (Sign up / Login) | A01 (2FA-gated admin JWT with role claim) | Same JWT issuer; admin tokens carry an elevated role claim checked by a NestJS guard on every admin-only route |
| **Search** (Typesense + Redis cache) | S09, S14, S18, S36 | A10 (health only — admins don't search inventory directly) | Admin has no write path here; it only observes the circuit-breaker/cache health this module reports |
| **Booking** (Duffel/RateHawk + soft/hard hold) | S15–S16, S20–S21, S23, S27, S29 | A03–A04, A12 | Both read/write the same Booking table; an admin refund/cancel transitions the same state machine a traveler's own cancellation would |
| **Payments** (Stripe) | S25–S27, S46 | A11–A12 | Stripe webhooks (`payment_intent.succeeded`, `charge.refunded`) update the Payment record once — both S29 and A04 read that same updated record |
| **Rewards** (points ledger) | S40–S42 | A16, A06 | Admin manual adjustments write to the same append-only `RewardsLedger` the traveler's own bookings write to |
| **eSIM** (Airalo Partner API SDK) | S32–S35 | A17 | Airalo status webhook updates `ESIMOrder` once; S35 and A17 both read it — admin retry calls the identical service method the purchase used |
| **Notifications** (FCM + Resend + WebSocket) | S52, in-app chat on S51 | A13–A14 (agent side of the same WebSocket channel) | One real-time channel; a message sent from A14 arrives on S51 and vice versa, no polling |
| **Content/CMS** *(new)* | S08, S18, S20, S23 (read-only) | A07–A09 | Admin writes go straight to the Package/Promotion tables; mobile screens read them on the next cache refresh, typically under a minute |
| **Supplier Health** *(new)* | None (traveler only sees the fallback UI it triggers) | A10 | Wraps the same circuit-breaker state each `RetryableClient` tracks internally and exposes it as a read API for A10 |
| **Support/Ticketing** *(new)* | S50–S51 | A13–A14 | Ticket and message records are shared between traveler and agent |
| **Analytics** *(new)* | None (write-only telemetry from app events) | A02, A18 | Mobile app emits anonymized funnel events (search → detail → checkout → paid); never exposes raw traveler-level events back to the app |
| **Audit** *(new)* | None (admin-only by design) | A20, plus a hidden log-write hook on every sensitive action across A04, A06, A12, A16, A19 | Every write from an elevated JWT is logged with before/after values — travelers never read or write this module |

## New modules the admin website adds

Four backend modules exist only to power the admin website and were not required for the traveler-facing MVP. They follow the same NestJS module conventions and the same `RetryableClient` wrapper pattern as every existing module.

| Module | Purpose | Key Entities |
|---|---|---|
| **Content/CMS Module** | Publishing pipeline for packages, destinations, and promotions | `Package`, `Promotion` (extends the existing Booking-adjacent schema) |
| **Supplier Health Module** | Aggregates circuit-breaker/health state from every external client into one queryable status | `SupplierHealthCheck` (timestamp, supplier, status, active incident reference) |
| **Support/Ticketing Module** | Ticket queue, claim-locking, and the shared chat thread between traveler and agent | `Ticket`, `Message` (shared by S51 and A14) |
| **Analytics Module** | Aggregates anonymized funnel events for reporting; never stores raw PII alongside events | `FunnelEvent` (session-scoped, no direct traveler foreign key) |

The **Audit Module** (append-only `AuditLog` table + NestJS interceptor on elevated-role routes) completes the set — the interceptor pattern means no individual admin screen has to remember to log; it happens by default.

## External suppliers & integrations

| Supplier | Used for | Failure behavior |
|---|---|---|
| **Duffel** | Flight inventory & booking | Circuit breaker → cached search results fallback; status visible on A10 |
| **RateHawk** | Hotel inventory | Circuit breaker → cached results fallback |
| **Airalo** (Partner API SDK) | eSIM provisioning | Retry + auto-refund after 3 failed attempts; A17 retry button |
| **Stripe** | Payments, refunds, payouts | Webhook-driven Payment record; reconciliation on A11 |
| **Supabase** | Auth (JWT issuer) + PostgreSQL + RLS | — |
| **Resend** | Transactional email | Templates editable in A21 |
| **FCM** | Push notifications | Templates editable in A21 |
| **Arcjet** | Fraud/risk detection | Flags surface as a risk banner on A04, never silently blocked |
| **Typesense + Redis** | Search index + cache | Health observed on A10 |

## Where things are hosted

- **Admin frontend** → Vercel
- **Backend API** → Render (same instance serves mobile and admin)
- **Database** → Supabase (PostgreSQL)

No new infrastructure to operate for the admin website.

---

**Next:** [Admin Tech Stack & Security](Admin-Tech-Stack-and-Security) · [Admin Screens](Admin-Screens)
