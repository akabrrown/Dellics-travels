# Admin Tech Stack & Security

## Tech stack

Deliberately reuses the same technology choices as the rest of the platform rather than introducing a second stack to maintain.

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui | Same stack as the companion traveler web app — one design system, one team's worth of expertise |
| **Data tables & charts** | TanStack Table + Recharts | Handles the dense, sortable/filterable tables every admin screen needs (Bookings, Travelers, Audit Log) |
| **Real-time chat** | WebSocket via the existing Notifications Module | A14's live chat and S51 share one connection type, not two separate implementations |
| **Auth** | Supabase Auth + mandatory TOTP 2FA (e.g. via a library such as `otplib`) | Same identity provider as the mobile app; 2FA enforced only on the admin JWT issuance path |
| **Backend** | The same NestJS API as the mobile app | No separate admin API — see [Architecture & Backend Linkage](Architecture-and-Backend-Linkage) |
| **Hosting** | Vercel (admin frontend), same Render backend as the mobile API | No new infrastructure to operate |
| **Audit logging** | Append-only `AuditLog` table + a NestJS interceptor on elevated-role routes | Interceptor pattern means no individual admin screen has to remember to log — it happens by default ("observability by default") |

## Security & audit rules

1. **Mandatory TOTP 2FA on every admin account, regardless of role** — no exceptions, since even a Support Agent account can view traveler PII and issue refunds.
2. **Role-based route guards at the NestJS layer** (not just hidden UI) — a Support Agent's JWT is rejected by the backend itself if it attempts to call a Content Admin–only endpoint, so a UI bug can never become a privilege escalation.
3. **Every write from an elevated JWT** (refund, content publish, role change, membership override) is captured by the Audit Module with before/after values, the acting admin's identity, and a timestamp — **immutable** and visible in A20.
4. **Session timeout** on admin accounts is shorter than traveler sessions (default **30 minutes idle**) given the sensitivity of what an admin session can do.
5. **Segregation of duties** — refund and role-change actions require the elevated approval step defined in the [permission matrix](Admin-Roles-and-Permissions) and the [refund workflow](Admin-Operational-Workflows#1-refund--cancellation-approval): no single Support Agent can independently move money above the policy limit, mirroring Stripe's own dashboard permissioning.
6. **IP allowlisting for the Super Admin role** is a Phase 2 hardening step once the team has fixed office/VPN egress IPs — not required for MVP given the team currently works from varied locations.

## How this document fits with the rest of the set

Read this wiki alongside:

- The **Product & Technical Documentation** (backend modules, data model)
- The **Screen & Navigation Specification** (mobile S-IDs referenced throughout)
- The **Reliability & Scale Playbook** (the circuit-breaker and observability patterns the new admin modules build on)
- The **Figma Design Prompts** library (design generation workflow — [Figma Design Workflow](Figma-Design-Workflow))

---

[← Back to Home](Home)
