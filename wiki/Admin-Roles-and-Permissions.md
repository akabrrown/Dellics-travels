# Admin Roles & Permissions

Three admin roles operate the website. The permission matrix below extends the role definitions from the Product & Technical Documentation into a full screen-level matrix.

**Legend:** ✓ = full access · ● = view-only · *(blank)* = no access

## Permission matrix

| Screen / Area | Support Agent | Content/Ops Admin | Super Admin |
|---|:---:|:---:|:---:|
| Dashboard (A02) | ● | ✓ | ✓ |
| Bookings & Booking Detail (A03–A04) | ● *(view + support notes)* | ✓ | ✓ |
| Travelers (A05–A06) | ● *(view + support notes)* | ✓ | ✓ |
| Content: Destinations/Packages (A07–A08) | | ✓ | ✓ |
| Promotions & Deals (A09) | | ✓ | ✓ |
| Supplier & Inventory Health (A10) | ● | ✓ | ✓ |
| Finance & Reconciliation (A11) | | ● | ✓ |
| Refund & Cancellation Queue (A12) | ✓ *(within policy limits)* | ✓ | ✓ |
| Support Ticket Queue & Detail (A13–A14) | ✓ | ● | ✓ |
| Reviews Moderation (A15) | | ✓ | ✓ |
| Membership & Rewards Config (A16) | | ● | ✓ |
| eSIM Orders Management (A17) | ● | ✓ | ✓ |
| Analytics & Reports (A18) | | ✓ | ✓ |
| Roles & Team Management (A19) | | | ✓ |
| Audit Log (A20) | | ● | ✓ |
| Settings (A21) | | ● | ✓ |

## Refund limits for Support Agents

Support Agents can approve refunds **up to a configurable threshold (default GHS 500)** without escalation — matching how a traveler's own self-serve cancellation is capped. Anything above that threshold routes to a Content/Ops Admin or Super Admin approval step.

Full flow: [Admin Operational Workflows → Refund & Cancellation Approval](Admin-Operational-Workflows#1-refund--cancellation-approval)

## How permissions are enforced

- **Role claim in the JWT** — the admin token carries the role; a NestJS guard checks it on every admin-only route, so a UI bug can never become a privilege escalation (see [Admin Tech Stack & Security](Admin-Tech-Stack-and-Security))
- **Role assignment is immediate** — when the Super Admin invites or changes a team member in A19, the permission matrix determines which of the 21 screens are visible from that moment
- **Every role change is audited** — logged in A20 Audit Log

---

**Next:** [Admin Screens](Admin-Screens) · [Admin Operational Workflows](Admin-Operational-Workflows)
