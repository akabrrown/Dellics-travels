**DELLICS TRAVELS**  
_— See the World —_  
**Admin Website Documentation**  
Design, Screens, Operational Workflows & Backend API Linkage  
Document Version 1.0 | Companion to the Product & Technical Documentation (v3.0)  
Prepared for Dellics Travels | August 2026  
**CONTACT INFORMATION**  
**Dellics Travels** · Tema Community 25, Devtraco Estate, Ghana  
**Phone:** +233 55 205 4174 **Email:** info@dellicstravels.com

**Table of Contents**
=====================

1\. Purpose & Scope  
2\. Design Benchmarks — Top Platform Implementation Ideas  
3\. Admin Roles & Permission Matrix  
4\. Admin Information Architecture (21 Screens)  
5\. Screen-by-Screen Specification  
6\. Operational Workflows  
7\. Backend API ↔ Admin ↔ Mobile App Linkage  
8\. Admin Tech Stack  
9\. Security & Audit  
10\. Sources

**1\. Purpose & Scope**
=======================

The Dellics Travels Admin Website is the operational control center for the platform — the tool Content/Ops Admins, Support Agents, and the Super Admin use to run the business the mobile app exposes to travelers. It is a separate application from the traveler-facing mobile app and companion web app (per Section 4.2 of the Product & Technical Documentation), but it shares the same NestJS backend and PostgreSQL database, viewed through an elevated, role-gated lens.  
This document covers three things end to end: what the admin website looks like and why (Section 2–5), how the people using it actually get work done day to day (Section 6), and precisely how every admin action is wired to the same backend modules the mobile app calls (Section 7) — so an action taken in the admin website (e.g. approving a refund) is reflected on the traveler's phone (e.g. Trip Planner status update) through a single, traceable path rather than two systems that happen to share a database.

<table><tbody><tr><td><strong>One backend, two front doors</strong><br>There is no separate “admin API.” The admin website and the mobile app call the same NestJS modules defined in Section 9–12 of the Product &amp; Technical Documentation. What differs is the JWT scope: an admin token carries a role claim (Support Agent / Content Admin / Super Admin) that unlocks additional endpoints and bypasses traveler-scoped Row-Level Security under audited conditions (Section 9 of this document).</td></tr></tbody></table>

**2\. Design Benchmarks — Top Platform Implementation Ideas**
=============================================================

The admin website is designed against the same discipline as the mobile app (Section 2 of the Product & Technical Documentation) — not by inventing admin-panel conventions from scratch, but by studying how the best operational dashboards in the industry are actually built.

**2.1 Stripe Dashboard — Trust Through Clarity**
------------------------------------------------

*   Information hierarchy: show what the admin needs to act on, not everything the database happens to contain — the Dellics Dashboard (A02) leads with what's stuck, not what's merely informational.
*   Job-based navigation: sidebar labels describe what an admin is doing (“Refunds,” “Support Queue”), never internal table names (“BookingAdjustments”).
*   Action-oriented widgets: Stripe's Failed Payments widget shows the actual failed transactions, not just a count — Dellics applies the same rule to the Refund & Cancellation Queue (A12) and Supplier Health panel (A10).
*   Colour discipline: colour is reserved for status signals only (confirmed/pending/failed), never for decoration — carried over directly from the Section 3 brand palette's semantic colours (Confirm Green, Alert Amber).
*   Specific microcopy: every error or warning state answers “what happened” and “what do I do next,” never a raw status code — the same principle already applied to traveler-facing errors in the Reliability & Scale Playbook, Section 6.4.

**2.2 Shopify Admin — Orders by Fulfilment Stage, Not Just Revenue**
--------------------------------------------------------------------

*   Shopify's most-copied pattern: show orders as a row of counts by stage (pending/processing/shipped/delivered) rather than leading with revenue — revenue is a lagging number nobody can act on at 9am, while a stack of unprocessed orders is a task.
*   Dellics applies this directly to A03 (Bookings): a pipeline row of counts — Held, Confirmed, Needs Attention, Completed, Cancelled — sits at the top of the screen, each count clickable straight into a pre-filtered list.
*   Refund rate is treated as a first-class metric on the Dashboard (A02), not buried in a report — Shopify's lesson that refund rate is “the metric most often omitted” despite being one of the three numbers that actually change daily admin behaviour.

**2.3 Booking.com Partner Extranet — Inventory at Scale**
---------------------------------------------------------

*   Booking.com's property-partner portal is built around calendar-first inventory and rate management — a property manager sees availability and price by date, not as a flat list of individual bookings.
*   Dellics's Content module (A07–A08) borrows this for package and destination content specifically: a calendar/date-range view for time-boxed deals (Section 6.20 of the Product & Technical Documentation) so an Ops Admin can see at a glance which promotions are live, upcoming, or expiring.

**2.4 Airbnb Host Dashboard — Messaging Inside the Workflow**
-------------------------------------------------------------

*   Airbnb's host inbox keeps guest messages attached directly to the reservation they concern, rather than as a separate, disconnected messaging app.
*   Dellics's Support Ticket Detail (A14) applies the same rule: every ticket has the traveler's active Booking record pulled in alongside the chat thread, matching the mobile-side pattern already specified in Section 6.14 of the Product & Technical Documentation (chat auto-attaches booking context).

**2.5 Zendesk / Intercom — Queue Triage, Not an Inbox Free-for-All**
--------------------------------------------------------------------

*   Modern support platforms sort by SLA urgency and let an agent claim a ticket, preventing two agents from working the same conversation.
*   A13 (Support Ticket Queue) uses this pattern directly: tickets are sorted by wait time and Membership tier (Elite travelers per Section 7 of the main documentation get SLA priority), and claiming a ticket assigns it exclusively to that agent.

**2.6 Synthesis — What the Dellics Admin Website Adopts**
---------------------------------------------------------

| **Pattern** | **Source** | **Dellics Implementation** |
| --- | --- | --- |
| Action-first dashboard, not a report | Stripe | A02 Dashboard leads with what's stuck (refund queue, failed eSIM provisioning), not vanity metrics |
| Pipeline counts over lagging revenue | Shopify | A03 Bookings pipeline row: Held / Confirmed / Needs Attention / Completed / Cancelled |
| Calendar-first content management | Booking.com Extranet | A08 Package/Deal editor and A09 Promotions use a date-range calendar view |
| Context-attached support conversations | Airbnb Host Inbox | A14 Support Ticket Detail pulls in the traveler's active booking automatically |
| SLA-sorted, claimable ticket queue | Zendesk / Intercom | A13 Support Queue sorts by wait time + membership tier, claim-to-assign locking |
| Job-based navigation & colour discipline | Stripe | Sidebar labelled by task; colour reserved for status only, matching Section 3 brand tokens |

**3\. Admin Roles & Permission Matrix**
=======================================

Extends the role definitions in Section 5 of the Product & Technical Documentation into a full screen-level permission matrix. ✓ = full access, ● = view-only, blank = no access.

| **Screen / Area** | **Support Agent** | **Content/Ops Admin** | **Super Admin** |
| --- | --- | --- | --- |
| Dashboard (A02) | ● | ✓ | ✓ |
| Bookings & Booking Detail (A03–A04) | ● (view + support notes) | ✓ | ✓ |
| Travelers (A05–A06) | ● (view + support notes) | ✓ | ✓ |
| Content: Destinations/Packages (A07–A08) |  | ✓ | ✓ |
| Promotions & Deals (A09) |  | ✓ | ✓ |
| Supplier & Inventory Health (A10) | ● | ✓ | ✓ |
| Finance & Reconciliation (A11) |  | ● | ✓ |
| Refund & Cancellation Queue (A12) | ✓ (within policy limits) | ✓ | ✓ |
| Support Ticket Queue & Detail (A13–A14) | ✓ | ● | ✓ |
| Reviews Moderation (A15) |  | ✓ | ✓ |
| Membership & Rewards Config (A16) |  | ● | ✓ |
| eSIM Orders Management (A17) | ● | ✓ | ✓ |
| Analytics & Reports (A18) |  | ✓ | ✓ |
| Roles & Team Management (A19) |  |  | ✓ |
| Audit Log (A20) |  | ● | ✓ |
| Settings (A21) |  | ● | ✓ |

<table><tbody><tr><td><strong>Refund limits for Support Agents</strong><br>Support Agents can approve refunds up to a configurable threshold (default GHS 500) without escalation, matching how a traveler's own self-serve cancellation is capped in Section 16.8 of the Product &amp; Technical Documentation. Anything above that threshold routes to a Content/Ops Admin or Super Admin approval step — detailed in the Refund Approval Workflow, Section 6.1.</td></tr></tbody></table>

**4\. Admin Information Architecture (21 Screens)**
===================================================

Screen IDs use an “A” prefix to stay distinct from the mobile app's “S” IDs in the Screen & Navigation Specification, while cross-referencing them directly wherever an admin action affects a traveler-visible screen.

| **ID** | **Screen Name** |
| --- | --- |
| A01 | Admin Login |
| A02 | Dashboard |
| A03 | Bookings (list) |
| A04 | Booking Detail |
| A05 | Travelers (list) |
| A06 | Traveler Detail |
| A07 | Content: Destinations & Packages (list) |
| A08 | Package/Deal Editor |
| A09 | Promotions & Deals Manager |
| A10 | Supplier & Inventory Health |
| A11 | Finance & Reconciliation |
| A12 | Refund & Cancellation Queue |
| A13 | Support Ticket Queue |
| A14 | Support Ticket Detail |
| A15 | Reviews Moderation Queue |
| A16 | Membership & Rewards Config |
| A17 | eSIM Orders Management |
| A18 | Analytics & Reports |
| A19 | Roles & Team Management |
| A20 | Audit Log |
| A21 | Settings |

**5\. Screen-by-Screen Specification**
======================================

Every admin screen's purpose, key elements, and where they lead — in the same format as the mobile app's Screen & Navigation Specification, so both documents can be read side by side.

### **5.1 Authentication & Dashboard**

**A01 — Admin Login**
---------------------

Admin-only sign-in; mandatory 2FA regardless of role (Section 9).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Email + password fields | Validates credentials |
| 2FA code field | Verifies TOTP code → A02 — Dashboard |
| Forgot password (text link) | Sends reset link to registered admin email (no self-serve for admin accounts — always emailed, never SMS) |

**A02 — Dashboard**
-------------------

Command-center home — leads with what needs action, not vanity metrics (Stripe pattern, Section 2.1).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Bookings pipeline row (Held/Confirmed/Needs Attention/Completed/Cancelled counts) | Each count → A03 — Bookings (list) pre-filtered to that status |
| Refund queue widget (shows actual pending refunds, not just a count) | A12 — Refund & Cancellation Queue |
| Supplier health strip (Duffel/RateHawk/Airalo/Stripe status dots) | A10 — Supplier & Inventory Health |
| Support queue widget (open tickets by SLA) | A13 — Support Ticket Queue |
| Revenue & booking trend chart | Informational → A18 — Analytics & Reports for full detail |
| Global search bar (top) | Searches bookings, travelers, and tickets by ID/name/email/phone — jumps directly to the matching detail screen |

### **5.2 Bookings**

**A03 — Bookings (list)**
-------------------------

All bookings across flights, hotels, packages, cars, activities, and eSIM orders.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Pipeline status filter chips | Refilters the list in place |
| Search / filter by traveler, route, date, booking type | — |
| Booking row (tap) | A04 — Booking Detail |
| Export (button, Super Admin/Content Admin only) | Downloads filtered list as CSV |

**A04 — Booking Detail**
------------------------

Full detail for a single booking — the admin equivalent of the traveler's S29 Trip Detail.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Status timeline (held → confirmed → completed/cancelled) | Informational, mirrors the Booking entity's state machine (Section 11 of the main documentation) |
| Traveler name (tap) | A06 — Traveler Detail |
| Payment record | Links to the underlying Stripe PaymentIntent in A11 — Finance & Reconciliation |
| Issue refund (button, within Support Agent policy limit or above with approval) | Opens the Refund Approval Workflow (Section 6.1) → A12 — Refund & Cancellation Queue |
| Resend confirmation email (button) | Re-triggers the Resend email template |
| Add internal note (field) | Visible to admin/support only, never to the traveler |

### **5.3 Travelers**

**A05 — Travelers (list)**
--------------------------

All registered traveler accounts.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Search by name/email/phone | — |
| Filter by membership tier | — |
| Traveler row (tap) | A06 — Traveler Detail |

**A06 — Traveler Detail**
-------------------------

Full traveler profile for support and account management.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Booking history list | Each row → A04 — Booking Detail |
| Membership tier (view, Content Admin+ can override) | Manual override writes to the Membership entity, logged in A20 — Audit Log |
| Support notes thread | Shared with A14 — Support Ticket Detail when a ticket references this traveler |
| Suspend account (button, Super Admin only) | Disables login; requires a reason, logged in A20 — Audit Log |

### **5.4 Content & Promotions**

**A07 — Content: Destinations & Packages (list)**
-------------------------------------------------

All destinations and curated packages (Section 6.4 of the main documentation).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| New package (button) | A08 — Package/Deal Editor |
| Package row (tap) | A08 — Package/Deal Editor |
| Publish/Unpublish toggle | Controls visibility on the traveler-facing Home (S08) deals carousel |

**A08 — Package/Deal Editor**
-----------------------------

Create/edit a curated package or destination page — calendar-first, Booking.com Extranet pattern (Section 2.3).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Date-range calendar (deal validity window) | Sets when the package is live/expired |
| Flight/hotel/car/activity component pickers | Assembles the bundle shown in S23 Package Builder |
| Pricing & discount fields | Feeds the “you're saving GHSxxx” banner on S23 |
| Preview (button) | Renders exactly what S20/S23 will show the traveler |
| Save as draft / Publish (buttons) | Draft is admin-only visible; Publish makes it live on S08/S18/S23 |

**A09 — Promotions & Deals Manager**
------------------------------------

Manages promo codes and urgency-badge deals (Section 6.20 of the main documentation).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| New promo code (button) | Opens a code + discount rule form (used at S26 Promo Code Entry) |
| Deal countdown timer field | Drives the countdown shown on S08's deals carousel |
| Scarcity indicator override (e.g. force “Only 2 left”) | Used only for genuinely limited-inventory promotions — never fabricated, per Section 6.20's real-availability rule |

### **5.5 Suppliers & Finance**

**A10 — Supplier & Inventory Health**
-------------------------------------

Live connection health for every third-party dependency (Reliability & Scale Playbook, Section 5.1).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Status dot per supplier (Duffel/RateHawk/Airalo/Stripe) | Green/Amber/Red — pulls from the same circuit-breaker state each NestJS module tracks internally |
| Incident log entry (tap) | Shows timestamp, affected bookings, and which fallback path served travelers during the incident |

**A11 — Finance & Reconciliation**
----------------------------------

Payment and payout reconciliation.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Stripe PaymentIntent search | — |
| Reconciliation status per booking | Flags any booking where Dellics's Payment record and Stripe's ledger disagree |
| Payout schedule view | Informational, mirrors the Stripe Connect/payout dashboard |

**A12 — Refund & Cancellation Queue**
-------------------------------------

Pending and completed refunds/cancellations — shows actual transactions, not just a count (Stripe pattern, Section 2.1).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Refund request row (tap) | Expands traveler, booking, amount, and policy justification |
| Approve (button) | Issues the refund via the Stripe Refunds API (Section 12.4 of the main documentation) |
| Escalate (button, Support Agent only, above policy limit) | Routes to a Content/Ops Admin or Super Admin for approval |
| Deny (button) | Requires a reason; notifies the traveler via S51 Live Chat Support |

### **5.6 Support & Reviews**

**A13 — Support Ticket Queue**
------------------------------

SLA-sorted, claimable support ticket queue (Zendesk/Intercom pattern, Section 2.5).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Sort by wait time / membership tier | — |
| Claim (button on a ticket row) | Assigns the ticket exclusively to the claiming agent → A14 — Support Ticket Detail |

**A14 — Support Ticket Detail**
-------------------------------

Live chat with a traveler, booking context auto-attached (Airbnb Host Inbox pattern, Section 2.4).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Chat thread (same underlying conversation as S51) | Real-time via the Notifications Module's WebSocket channel |
| Attached booking card | Tap → A04 — Booking Detail |
| Quick actions (Issue refund / Resend confirmation) | Shortcuts into A12 — Refund & Cancellation Queue / resend flow without leaving the chat |
| Resolve & close (button) | A13 — Support Ticket Queue |

**A15 — Reviews Moderation Queue**
----------------------------------

Moderation queue for traveler-submitted reviews (Section 6.12/6.21 of the main documentation).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Review row (tap) | Expands full review text/photos |
| Approve / Reject (buttons) | Approved reviews appear on S20 Property Detail; rejected reviews never publish |

### **5.7 Membership, eSIM, Analytics & Platform**

**A16 — Membership & Rewards Config**
-------------------------------------

Configuration for the three membership tiers (Section 7 of the main documentation).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Tier benefit fields (points multiplier, perks list, price) | Changes apply to new/renewing subscriptions only — never retroactively to an active billing cycle |
| Manual points adjustment (per traveler, via A06 — Traveler Detail) | Writes an entry to the RewardsLedger entity, logged in A20 — Audit Log |

**A17 — eSIM Orders Management**
--------------------------------

All eSIM orders and Airalo provisioning status (Section 6.23 of the main documentation).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Order row (tap) | Shows ESIMOrder status: pending → provisioned → active → expired |
| Retry provisioning (button, on a failed order) | Re-calls the Airalo Partner API SDK; auto-refunds after 3 failed attempts per Section 12.3 |

**A18 — Analytics & Reports**
-----------------------------

Revenue, booking, and conversion-funnel reporting.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Date range selector | — |
| Funnel view (Search → Detail → Checkout → Paid) | Mirrors the mobile navigation flows in the Screen & Navigation Specification, Section 16 |
| Export report (button) | Downloads as CSV/PDF |

**A19 — Roles & Team Management**
---------------------------------

Invite and manage admin accounts (Super Admin only).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Invite admin (button) | Sends an email invite scoped to a specific role |
| Role dropdown per admin row | Changes a team member's role; logged in A20 — Audit Log |
| Revoke access (button) | Immediately invalidates that admin's active sessions |

**A20 — Audit Log**
-------------------

Immutable log of every sensitive admin action.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Filter by admin / action type / date | — |
| Log entry (tap) | Shows before/after values for the changed record |

**A21 — Settings**
------------------

Platform-wide configuration.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Feature flags list | Toggles customer-facing features per the Reliability & Scale Playbook, Section 5.5 |
| FX rate override | Manual override of the hourly-cached FX rates (Section 6.13 of the main documentation) |
| Notification template editor | Edits Resend email / FCM push copy |

**6\. Operational Workflows**
=============================

How the admin screens in Section 5 actually get used day to day — each workflow names the roles involved and the screens it moves through.

**6.1 Refund & Cancellation Approval**
--------------------------------------

1.  Traveler requests cancellation from S28/S29 (Trip Planner) or a Support Agent initiates it from A04 — Booking Detail.
2.  System checks the fare/rate cancellation policy and the traveler's Membership perks automatically (Section 16.8 of the main documentation).
3.  If within the Support Agent's policy limit (default GHS 500), the agent approves directly in A12 — Refund & Cancellation Queue.
4.  If above the limit, the request escalates to a Content/Ops Admin or Super Admin, who reviews the same A12 — Refund & Cancellation Queue record and approves or denies.
5.  On approval, the Stripe Refunds API is called; the traveler's S29 Trip Detail and A04 — Booking Detail both update from the same charge.refunded webhook (Section 7 of this document).

**6.2 Content & Deal Publishing**
---------------------------------

1.  Content/Ops Admin drafts a new package or destination in A08 — Package/Deal Editor, using the calendar view to set the live/expiry window.
2.  Preview renders exactly what S20/S23 will show travelers before anything goes live.
3.  Save as Draft keeps it admin-only visible for review by a second admin if desired.
4.  Publish makes it immediately visible on S08's deals carousel, S18 hotel results, and S23 package builder — no deploy or app update required, since content is served from the database, not bundled into the app binary.
5.  Scheduled expiry (from the calendar window) automatically unpublishes the deal at the set time via a BullMQ job, matching the FareFreeze-style scheduled-expiry pattern already used elsewhere in the backend.

**6.3 Supplier Incident Response**
----------------------------------

1.  Supplier Health (A10 — Supplier & Inventory Health) shows a status dot turn Amber/Red for Duffel, RateHawk, Airalo, or Stripe, reflecting the same circuit-breaker state defined in the Reliability & Scale Playbook, Section 5.1.
2.  An automatic Sentry/on-call alert notifies the Super Admin and any on-duty Content/Ops Admin.
3.  Admins can confirm travelers are seeing the correct fallback (cached search results, “processing” eSIM state) by checking the Incident Log entry on A10 — Supplier & Inventory Health, which records which fallback path served traffic during the incident.
4.  Once the supplier's health check passes again, the circuit closes automatically — no manual admin action is required to restore service, only to confirm it.

**6.4 Support Ticket Lifecycle**
--------------------------------

1.  Traveler opens S51 (Live Chat Support), optionally with booking context pre-attached.
2.  Ticket lands in A13 — Support Ticket Queue, sorted by wait time and the traveler's membership tier (Elite gets SLA priority per Section 7 of the main documentation).
3.  An available Support Agent claims the ticket, locking it to them and opening A14 — Support Ticket Detail.
4.  The agent can issue a refund, resend a confirmation, or escalate directly from A14 — Support Ticket Detail without switching screens.
5.  Agent resolves and closes the ticket; the traveler's chat thread on S51 reflects the resolution in real time via the same WebSocket channel.

**6.5 Fraud & Risk Review**
---------------------------

1.  Arcjet (Section 9.3/13 of the main documentation) flags anomalous booking or login patterns automatically — e.g. many bookings from one card in a short window.
2.  Flagged bookings surface in A04 — Booking Detail with a risk banner rather than being silently blocked, so a Content/Ops Admin can review context before acting.
3.  Admin can confirm the booking, hold it for manual verification, or cancel and refund — each action is written to A20 — Audit Log with the reviewing admin's identity.

**6.6 Admin Onboarding & Access**
---------------------------------

1.  Super Admin invites a new team member from A19 — Roles & Team Management, selecting their role (Support Agent / Content Admin / Super Admin).
2.  Invitee receives an email invite, sets a password, and is required to enroll 2FA before first login (Section 9 of this document) — there is no admin account without 2FA.
3.  Role assignment immediately determines which of the 21 screens in Section 4 are visible, per the permission matrix in Section 3.
4.  Any later role change or access revocation is itself logged in A20 — Audit Log.

**7\. Backend API ↔ Admin ↔ Mobile App Linkage**
================================================

Every backend module from Section 9–12 of the Product & Technical Documentation, and exactly which mobile screens (S-IDs) and admin screens (A-IDs) call into it. This is the single map that proves the admin website and mobile app are two views onto one backend, not two systems kept in sync by hand.

| **Backend Module (NestJS)** | **Mobile App Screens** | **Admin Screens** | **Sync Mechanism** |
| --- | --- | --- | --- |
| Auth Module (Supabase JWT + RLS) | S03–S07 (Sign up/Login) | A01 (2FA-gated admin JWT with role claim) | Same JWT issuer; admin tokens carry an elevated role claim checked by a NestJS guard on every admin-only route |
| Search Module (Typesense + Redis cache) | S09, S14, S18, S36 | A10 (health only — admins don't search inventory directly) | Admin has no write path here; it only observes the circuit-breaker/cache health this module reports |
| Booking Module (Duffel/RateHawk + soft/hard hold) | S15–S16, S20–S21, S23, S27, S29 | A03–A04, A12 | Both read/write the same Booking table; an admin refund/cancel transitions the same state machine a traveler's own cancellation would |
| Payments Module (Stripe) | S25–S27, S46 | A11–A12 | Stripe webhooks (payment\_intent.succeeded, charge.refunded) update the Payment record once — both S29 and A04 read that same updated record |
| Rewards Module (points ledger) | S40–S42 | A16, A06 | Admin manual adjustments write to the same append-only RewardsLedger the traveler's own bookings write to |
| eSIM Module (Airalo Partner API SDK) | S32–S35 | A17 | Airalo status webhook updates ESIMOrder once; S35 and A17 both read it — admin “Retry provisioning” calls the identical EsimService method the original purchase used |
| Notifications Module (FCM + Resend + WebSocket) | S52, in-app chat on S51 | A13–A14 (agent side of the same WebSocket channel) | One real-time channel; a message sent from A14 arrives on S51 and vice versa, no polling |
| Content/CMS Module (new — Section 7.1) | S08, S18, S20, S23 (read-only) | A07–A09 | Admin writes go straight to the Package/Promotion tables; mobile screens read them on the next cache refresh (Section 5.2 of the Reliability & Scale Playbook), typically under a minute |
| Supplier Health Module (new — Section 7.1) | None (traveler never sees raw supplier status, only the fallback UI it triggers) | A10 | Wraps the same circuit-breaker state each RetryableClient tracks internally (Reliability & Scale Playbook, Section 5.1) and exposes it as a read API for A10 |
| Support/Ticketing Module (new — Section 7.1) | S50–S51 | A13–A14 | Ticket and message records are shared — a traveler's chat message and an agent's reply are rows in the same table, rendered on two different screens |
| Analytics Module (new — Section 7.1) | None (write-only telemetry from app events) | A02, A18 | Mobile app emits anonymized funnel events (search → detail → checkout → paid); Analytics Module aggregates them for A18, never exposes raw traveler-level events back to the app |
| Audit Module (new — Section 7.1) | None (admin-only by design) | A20, and a hidden log-write hook on every sensitive action across A04, A06, A12, A16, A19 | Every write from an elevated JWT is logged with before/after values — travelers never read or write this module |

**7.1 New Modules This Document Adds**
--------------------------------------

Four backend modules exist only to power the admin website and were not required for the traveler-facing MVP in the Product & Technical Documentation. They follow the same NestJS module conventions (Section 9 of that document) and the same RetryableClient wrapper pattern (Reliability & Scale Playbook, Section 5.1) as every existing module.

| **Module** | **Purpose** | **Key Entities** |
| --- | --- | --- |
| Content/CMS Module | Publishing pipeline for packages, destinations, and promotions (Section 6.2 of this document) | Package, Promotion (extends the existing Booking-adjacent schema in Section 11 of the main documentation) |
| Supplier Health Module | Aggregates circuit-breaker/health state from every external client into one queryable status | SupplierHealthCheck (timestamp, supplier, status, active incident reference) |
| Support/Ticketing Module | Ticket queue, claim-locking, and the shared chat thread between traveler and agent | Ticket, Message (shared by S51 and A14) |
| Analytics Module | Aggregates anonymized funnel events for reporting; never stores raw PII alongside events | FunnelEvent (session-scoped, no direct traveler foreign key) |

**8\. Admin Tech Stack**
========================

Deliberately reuses the same technology choices as the rest of the platform (Section 9 of the Product & Technical Documentation) rather than introducing a second stack to maintain.

| **Layer** | **Technology** | **Why** |
| --- | --- | --- |
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui | Same stack as the companion traveler web app — one design system, one team's worth of expertise |
| Data tables & charts | TanStack Table + Recharts | Handles the dense, sortable/filterable tables every admin screen in Section 5 needs (Bookings, Travelers, Audit Log) |
| Real-time chat | WebSocket via the existing Notifications Module | A14's live chat and S51 share one connection type, not two separate implementations |
| Auth | Supabase Auth + mandatory TOTP 2FA (e.g. via a library such as otplib) | Same identity provider as the mobile app; 2FA enforced only on the admin JWT issuance path |
| Backend | The same NestJS API as the mobile app (Section 9.2 of the main documentation) | No separate admin API — see Section 7 of this document |
| Hosting | Vercel (admin frontend), same Render backend as the mobile API | No new infrastructure to operate |
| Audit logging | Append-only AuditLog table + a NestJS interceptor on elevated-role routes | Interceptor pattern means no individual admin screen has to remember to log — it happens by default, matching Skyscanner's “observability by default” principle (Reliability & Scale Playbook, Section 5.4) |

**9\. Security & Audit**
========================

*   Mandatory TOTP 2FA on every admin account, regardless of role — no exceptions, since even a Support Agent account can view traveler PII and issue refunds.
*   Role-based route guards at the NestJS layer (not just hidden UI) — a Support Agent's JWT is rejected by the backend itself if it attempts to call a Content Admin–only endpoint, so a UI bug can never become a privilege escalation.
*   Every write from an elevated JWT (refund, content publish, role change, membership override) is captured by the Audit Module (Section 7.1) with before/after values, the acting admin's identity, and a timestamp — immutable and visible in A20.
*   Session timeout on admin accounts is shorter than traveler sessions (default 30 minutes idle) given the sensitivity of what an admin session can do.
*   Refund and role-change actions require the elevated approval step defined in Sections 3 and 6.1 — no single Support Agent can independently move money above the policy limit, mirroring the segregation-of-duties principle common to Stripe's own dashboard permissioning.
*   IP allowlisting for the Super Admin role is a Phase 2 hardening step once the team has fixed office/VPN egress IPs to allowlist — not required for MVP given the team currently works from varied locations.

**10\. Sources**
================

Design benchmarks in Section 2 are drawn from and paraphrased against the following, current as of August 2026:

*   925 Studios — “Stripe Dashboard Design Breakdown: Trust Through Clarity”
*   AufaitUX — “12 Real-World Dashboard Design Examples & UI Best Practices”
*   Lazarev.agency — “Dashboard UX design: best practices & real-world examples”
*   AdminLTE.IO — “24 Best E-Commerce Admin Dashboard Templates 2026” (orders-by-fulfilment-stage pattern)
*   BootstrapDash — “The Role of UI/UX in Admin Dashboard Templates: Do's & Don'ts” (Shopify admin panel analysis)
*   Booking.com Partner Hub / Extranet public documentation; Airbnb Host public help center documentation
*   Zendesk and Intercom public product documentation on ticket triage and SLA management

<table><tbody><tr><td><strong>How this document fits with the rest of the set</strong><br>Read this alongside the Product &amp; Technical Documentation (backend modules, data model), the Screen &amp; Navigation Specification (mobile S-IDs referenced throughout Section 5–7), and the Reliability &amp; Scale Playbook (the circuit-breaker and observability patterns Section 7's new modules build on).</td></tr></tbody></table>