# Admin Operational Workflows

How the admin screens actually get used day to day — each workflow names the roles involved and the screens it moves through.

## 1. Refund & Cancellation Approval

1. Traveler requests cancellation from **S28/S29** (Trip Planner), or a Support Agent initiates it from **A04** Booking Detail.
2. The system checks the fare/rate cancellation policy and the traveler's Membership perks automatically.
3. If within the Support Agent's policy limit (default **GHS 500**), the agent approves directly in **A12** Refund & Cancellation Queue.
4. If above the limit, the request escalates to a Content/Ops Admin or Super Admin, who reviews the same A12 record and approves or denies.
5. On approval, the **Stripe Refunds API** is called; the traveler's **S29** Trip Detail and **A04** Booking Detail both update from the same `charge.refunded` webhook.

## 2. Content & Deal Publishing

1. Content/Ops Admin drafts a new package or destination in **A08** Package/Deal Editor, using the calendar view to set the live/expiry window.
2. **Preview** renders exactly what S20/S23 will show travelers before anything goes live.
3. **Save as Draft** keeps it admin-only visible for review by a second admin if desired.
4. **Publish** makes it immediately visible on S08's deals carousel, S18 hotel results, and S23 package builder — no deploy or app update required, since content is served from the database, not bundled into the app binary.
5. Scheduled expiry (from the calendar window) automatically unpublishes the deal at the set time via a **BullMQ job**, matching the FareFreeze-style scheduled-expiry pattern used elsewhere in the backend.

## 3. Supplier Incident Response

1. **Supplier Health (A10)** shows a status dot turn Amber/Red for Duffel, RateHawk, Airalo, or Stripe — reflecting the same circuit-breaker state defined in the Reliability & Scale Playbook.
2. An automatic **Sentry/on-call alert** notifies the Super Admin and any on-duty Content/Ops Admin.
3. Admins confirm travelers are seeing the correct fallback (cached search results, "processing" eSIM state) by checking the **Incident Log** entry on A10, which records which fallback path served traffic during the incident.
4. Once the supplier's health check passes again, the circuit **closes automatically** — no manual admin action is required to restore service, only to confirm it.

## 4. Support Ticket Lifecycle

1. Traveler opens **S51** (Live Chat Support), optionally with booking context pre-attached.
2. Ticket lands in **A13** Support Ticket Queue, sorted by wait time and the traveler's membership tier (Elite gets SLA priority).
3. An available Support Agent **claims** the ticket, locking it to them, and opens **A14** Support Ticket Detail.
4. The agent can issue a refund, resend a confirmation, or escalate directly from A14 without switching screens.
5. Agent resolves and closes the ticket; the traveler's chat thread on S51 reflects the resolution in real time via the same WebSocket channel.

## 5. Fraud & Risk Review

1. **Arcjet** flags anomalous booking or login patterns automatically — e.g. many bookings from one card in a short window.
2. Flagged bookings surface in **A04** Booking Detail with a **risk banner** rather than being silently blocked, so a Content/Ops Admin can review context before acting.
3. The admin can **confirm** the booking, **hold** it for manual verification, or **cancel and refund** — each action is written to **A20** Audit Log with the reviewing admin's identity.

## 6. Admin Onboarding & Access

1. Super Admin invites a new team member from **A19** Roles & Team Management, selecting their role (Support Agent / Content Admin / Super Admin).
2. Invitee receives an email invite, sets a password, and is **required to enroll 2FA before first login** — there is no admin account without 2FA.
3. Role assignment immediately determines which of the 21 screens are visible, per the [permission matrix](Admin-Roles-and-Permissions).
4. Any later role change or access revocation is itself logged in **A20** Audit Log.

---

**Next:** [Admin Tech Stack & Security](Admin-Tech-Stack-and-Security) · [Architecture & Backend Linkage](Architecture-and-Backend-Linkage)
