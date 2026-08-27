# Admin Screens

Screen-by-screen specification for all 21 admin screens (A01–A21), in the same format as the mobile app's Screen & Navigation Specification so both documents can be read side by side. Desktop frames are designed at **1440×1024**.

## Authentication & Dashboard

### A01 — Admin Login
Admin-only sign-in; mandatory 2FA regardless of role.

| Element / Button | Action / Navigates To |
|---|---|
| Email + password fields | Validates credentials |
| 2FA code field | Verifies TOTP code → A02 Dashboard |
| Forgot password (text link) | Sends reset link to registered admin email (no self-serve for admin accounts — always emailed, never SMS) |

### A02 — Dashboard
Command-center home — leads with what needs action, not vanity metrics (Stripe pattern).

| Element / Button | Action / Navigates To |
|---|---|
| Bookings pipeline row (Held / Confirmed / Needs Attention / Completed / Cancelled counts) | Each count → A03 Bookings pre-filtered to that status |
| Refund queue widget (shows actual pending refunds, not just a count) | A12 Refund & Cancellation Queue |
| Supplier health strip (Duffel / RateHawk / Airalo / Stripe status dots) | A10 Supplier & Inventory Health |
| Support queue widget (open tickets by SLA) | A13 Support Ticket Queue |
| Revenue & booking trend chart | Informational → A18 Analytics & Reports for full detail |
| Global search bar (top) | Searches bookings, travelers, and tickets by ID/name/email/phone — jumps directly to the matching detail screen |

## Bookings

### A03 — Bookings (list)
All bookings across flights, hotels, packages, cars, activities, and eSIM orders.

| Element / Button | Action / Navigates To |
|---|---|
| Pipeline status filter chips | Refilters the list in place |
| Search / filter by traveler, route, date, booking type | — |
| Booking row (tap) | A04 Booking Detail |
| Export (Super Admin / Content Admin only) | Downloads filtered list as CSV |

### A04 — Booking Detail
Full detail for a single booking — the admin equivalent of the traveler's S29 Trip Detail.

| Element / Button | Action / Navigates To |
|---|---|
| Status timeline (held → confirmed → completed/cancelled) | Informational — mirrors the Booking entity's state machine |
| Traveler name (tap) | A06 Traveler Detail |
| Payment record | Links to the underlying Stripe PaymentIntent in A11 |
| Issue refund (within Support Agent policy limit, or above with approval) | Opens the Refund Approval Workflow → A12 Refund & Cancellation Queue |
| Resend confirmation email | Re-triggers the Resend email template |
| Add internal note | Visible to admin/support only, never to the traveler |

## Travelers

### A05 — Travelers (list)
All registered traveler accounts.

| Element / Button | Action / Navigates To |
|---|---|
| Search by name/email/phone | — |
| Filter by membership tier | — |
| Traveler row (tap) | A06 Traveler Detail |

### A06 — Traveler Detail
Full traveler profile for support and account management.

| Element / Button | Action / Navigates To |
|---|---|
| Booking history list | Each row → A04 Booking Detail |
| Membership tier (view; Content Admin+ can override) | Manual override writes to the Membership entity, logged in A20 Audit Log |
| Support notes thread | Shared with A14 Support Ticket Detail when a ticket references this traveler |
| Suspend account (Super Admin only) | Disables login; requires a reason, logged in A20 Audit Log |

## Content & Promotions

### A07 — Content: Destinations & Packages (list)
All destinations and curated packages.

| Element / Button | Action / Navigates To |
|---|---|
| New package | A08 Package/Deal Editor |
| Package row (tap) | A08 Package/Deal Editor |
| Publish/Unpublish toggle | Controls visibility on the traveler-facing Home (S08) deals carousel |

### A08 — Package/Deal Editor
Create/edit a curated package or destination page — calendar-first, Booking.com Extranet pattern.

| Element / Button | Action / Navigates To |
|---|---|
| Date-range calendar (deal validity window) | Sets when the package is live/expired |
| Flight/hotel/car/activity component pickers | Assembles the bundle shown in S23 Package Builder |
| Pricing & discount fields | Feeds the "you're saving GHS xxx" banner on S23 |
| Preview | Renders exactly what S20/S23 will show the traveler |
| Save as draft / Publish | Draft is admin-only visible; Publish makes it live on S08/S18/S23 |

### A09 — Promotions & Deals Manager
Manages promo codes and urgency-badge deals.

| Element / Button | Action / Navigates To |
|---|---|
| New promo code | Opens a code + discount rule form (used at S26 Promo Code Entry) |
| Deal countdown timer field | Drives the countdown shown on S08's deals carousel |
| Scarcity indicator override (e.g. force "Only 2 left") | Used only for genuinely limited-inventory promotions — never fabricated, per the real-availability rule |

## Suppliers & Finance

### A10 — Supplier & Inventory Health
Live connection health for every third-party dependency.

| Element / Button | Action / Navigates To |
|---|---|
| Status dot per supplier (Duffel / RateHawk / Airalo / Stripe) | Green/Amber/Red — pulls from the same circuit-breaker state each NestJS module tracks internally |
| Incident log entry (tap) | Shows timestamp, affected bookings, and which fallback path served travelers during the incident |

### A11 — Finance & Reconciliation
Payment and payout reconciliation.

| Element / Button | Action / Navigates To |
|---|---|
| Stripe PaymentIntent search | — |
| Reconciliation status per booking | Flags any booking where Dellics's Payment record and Stripe's ledger disagree |
| Payout schedule view | Informational — mirrors the Stripe Connect/payout dashboard |

### A12 — Refund & Cancellation Queue
Pending and completed refunds/cancellations — shows actual transactions, not just a count (Stripe pattern).

| Element / Button | Action / Navigates To |
|---|---|
| Refund request row (tap) | Expands traveler, booking, amount, and policy justification |
| Approve | Issues the refund via the Stripe Refunds API |
| Escalate (Support Agent only, above policy limit) | Routes to a Content/Ops Admin or Super Admin for approval |
| Deny | Requires a reason; notifies the traveler via S51 Live Chat Support |

## Support & Reviews

### A13 — Support Ticket Queue
SLA-sorted, claimable support ticket queue (Zendesk/Intercom pattern).

| Element / Button | Action / Navigates To |
|---|---|
| Sort by wait time / membership tier | — |
| Claim (button on a ticket row) | Assigns the ticket exclusively to the claiming agent → A14 Support Ticket Detail |

### A14 — Support Ticket Detail
Live chat with a traveler, booking context auto-attached (Airbnb Host Inbox pattern).

| Element / Button | Action / Navigates To |
|---|---|
| Chat thread (same underlying conversation as S51) | Real-time via the Notifications Module's WebSocket channel |
| Attached booking card | Tap → A04 Booking Detail |
| Quick actions (Issue refund / Resend confirmation) | Shortcuts into A12 / resend flow without leaving the chat |
| Resolve & close | A13 Support Ticket Queue |

### A15 — Reviews Moderation Queue
Moderation queue for traveler-submitted reviews.

| Element / Button | Action / Navigates To |
|---|---|
| Review row (tap) | Expands full review text/photos |
| Approve / Reject | Approved reviews appear on S20 Property Detail; rejected reviews never publish |

## Membership, eSIM, Analytics & Platform

### A16 — Membership & Rewards Config
Configuration for the three membership tiers.

| Element / Button | Action / Navigates To |
|---|---|
| Tier benefit fields (points multiplier, perks list, price) | Changes apply to new/renewing subscriptions only — never retroactively to an active billing cycle |
| Manual points adjustment (per traveler, via A06) | Writes an entry to the RewardsLedger entity, logged in A20 Audit Log |

### A17 — eSIM Orders Management
All eSIM orders and Airalo provisioning status.

| Element / Button | Action / Navigates To |
|---|---|
| Order row (tap) | Shows ESIMOrder status: pending → provisioned → active → expired |
| Retry provisioning (on a failed order) | Re-calls the Airalo Partner API SDK; auto-refunds after 3 failed attempts |

### A18 — Analytics & Reports
Revenue, booking, and conversion-funnel reporting.

| Element / Button | Action / Navigates To |
|---|---|
| Date range selector | — |
| Funnel view (Search → Detail → Checkout → Paid) | Mirrors the mobile navigation flows |
| Export report | Downloads as CSV/PDF |

### A19 — Roles & Team Management
Invite and manage admin accounts (Super Admin only).

| Element / Button | Action / Navigates To |
|---|---|
| Invite admin | Sends an email invite scoped to a specific role |
| Role dropdown per admin row | Changes a team member's role; logged in A20 Audit Log |
| Revoke access | Immediately invalidates that admin's active sessions |

### A20 — Audit Log
Immutable log of every sensitive admin action.

| Element / Button | Action / Navigates To |
|---|---|
| Filter by admin / action type / date | — |
| Log entry (tap) | Shows before/after values for the changed record |

### A21 — Settings
Platform-wide configuration.

| Element / Button | Action / Navigates To |
|---|---|
| Feature flags list | Toggles customer-facing features per the Reliability & Scale Playbook |
| FX rate override | Manual override of the hourly-cached FX rates |
| Notification template editor | Edits Resend email / FCM push copy |

---

**Next:** [Admin Operational Workflows](Admin-Operational-Workflows) · [Admin Roles & Permissions](Admin-Roles-and-Permissions)
