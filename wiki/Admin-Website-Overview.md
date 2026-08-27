# Admin Website Overview

*From the Admin Website Documentation v1.0 — Design, Screens, Operational Workflows & Backend API Linkage (August 2026).*

## Purpose & scope

The Dellics Travels Admin Website is the **operational control center** for the platform — the tool Content/Ops Admins, Support Agents, and the Super Admin use to run the business the mobile app exposes to travelers.

It is a **separate application** from the traveler-facing mobile app and companion web app, but it shares the same NestJS backend and PostgreSQL database, viewed through an elevated, role-gated lens.

The documentation covers three things end to end:

1. **What the admin website looks like and why** — design benchmarks, roles, information architecture, screen specs
2. **How the people using it actually get work done day to day** — operational workflows
3. **Precisely how every admin action is wired to the same backend modules the mobile app calls** — so an action taken in the admin website (e.g. approving a refund) is reflected on the traveler's phone (e.g. Trip Planner status update) through a single, traceable path

> **One backend, two front doors.** There is no separate "admin API." What differs is the JWT scope: an admin token carries a role claim that unlocks additional endpoints and bypasses traveler-scoped Row-Level Security under audited conditions. See [Architecture & Backend Linkage](Architecture-and-Backend-Linkage).

## Design benchmarks

The admin website is designed by studying how the best operational dashboards in the industry are actually built — not by inventing admin-panel conventions from scratch.

### Stripe Dashboard — trust through clarity

- **Information hierarchy**: show what the admin needs to act on, not everything the database happens to contain — the Dellics Dashboard (A02) leads with what's stuck, not what's merely informational
- **Job-based navigation**: sidebar labels describe what an admin is doing ("Refunds," "Support Queue"), never internal table names ("BookingAdjustments")
- **Action-oriented widgets**: Stripe's Failed Payments widget shows the actual failed transactions, not just a count — applied to the Refund & Cancellation Queue (A12) and Supplier Health panel (A10)
- **Colour discipline**: colour reserved for status signals only (confirmed/pending/failed), never decoration
- **Specific microcopy**: every error answers "what happened" and "what do I do next," never a raw status code

### Shopify Admin — orders by fulfilment stage, not just revenue

- Show orders as a row of counts by stage rather than leading with revenue — revenue is a lagging number nobody can act on at 9am, while a stack of unprocessed orders is a task
- Applied to **A03 Bookings**: a pipeline row — *Held / Confirmed / Needs Attention / Completed / Cancelled* — each count clickable into a pre-filtered list
- **Refund rate** treated as a first-class metric on the Dashboard (A02), not buried in a report

### Booking.com Partner Extranet — inventory at scale

- Calendar-first inventory and rate management — availability and price by date, not a flat list of bookings
- Borrowed for the **Content module (A07–A08)**: a date-range view for time-boxed deals so an Ops Admin sees at a glance which promotions are live, upcoming, or expiring

### Airbnb Host Dashboard — messaging inside the workflow

- Guest messages stay attached directly to the reservation they concern
- Applied to **Support Ticket Detail (A14)**: every ticket has the traveler's active Booking record pulled in alongside the chat thread (matching the mobile-side pattern where chat auto-attaches booking context)

### Zendesk / Intercom — queue triage, not an inbox free-for-all

- Sort by SLA urgency; let an agent claim a ticket so two agents never work the same conversation
- Applied to **A13 Support Ticket Queue**: sorted by wait time and Membership tier (Elite travelers get SLA priority); claiming assigns the ticket exclusively

## Synthesis — what the Dellics admin adopts

| Pattern | Source | Dellics implementation |
|---|---|---|
| Action-first dashboard, not a report | Stripe | A02 leads with what's stuck (refund queue, failed eSIM provisioning), not vanity metrics |
| Pipeline counts over lagging revenue | Shopify | A03 pipeline row: Held / Confirmed / Needs Attention / Completed / Cancelled |
| Calendar-first content management | Booking.com Extranet | A08 Package/Deal editor and A09 Promotions use a date-range calendar view |
| Context-attached support conversations | Airbnb Host Inbox | A14 pulls in the traveler's active booking automatically |
| SLA-sorted, claimable ticket queue | Zendesk / Intercom | A13 sorts by wait time + membership tier, claim-to-assign locking |
| Job-based navigation & colour discipline | Stripe | Sidebar labelled by task; colour reserved for status only, matching brand tokens |

## Information architecture (21 screens)

Screen IDs use an **"A" prefix** to stay distinct from the mobile app's "S" IDs, while cross-referencing them wherever an admin action affects a traveler-visible screen.

| ID | Screen | ID | Screen |
|---|---|---|---|
| A01 | Admin Login | A12 | Refund & Cancellation Queue |
| A02 | Dashboard | A13 | Support Ticket Queue |
| A03 | Bookings (list) | A14 | Support Ticket Detail |
| A04 | Booking Detail | A15 | Reviews Moderation Queue |
| A05 | Travelers (list) | A16 | Membership & Rewards Config |
| A06 | Traveler Detail | A17 | eSIM Orders Management |
| A07 | Content: Destinations & Packages | A18 | Analytics & Reports |
| A08 | Package/Deal Editor | A19 | Roles & Team Management |
| A09 | Promotions & Deals Manager | A20 | Audit Log |
| A10 | Supplier & Inventory Health | A21 | Settings |
| A11 | Finance & Reconciliation | | |

Full specifications: **[Admin Screens](Admin-Screens)**

## Documentation sources

Design benchmarks are drawn from (current as of August 2026): 925 Studios' Stripe Dashboard design breakdown; AufaitUX's dashboard UX examples; Lazarev.agency dashboard best practices; AdminLTE.IO e-commerce admin templates (orders-by-fulfilment-stage); BootstrapDash Shopify admin analysis; Booking.com Partner Hub/Extranet and Airbnb Host public documentation; Zendesk and Intercom public documentation on triage and SLA management.

---

**Next:** [Admin Roles & Permissions](Admin-Roles-and-Permissions) · [Admin Screens](Admin-Screens)
