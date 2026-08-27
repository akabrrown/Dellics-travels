# Dellics Travels — Repository Wiki

> **See the World** — a mobile-first flight, hotel, package, and eSIM booking platform for the Ghanaian and West African market, competing with Booking.com, Trip.com, Skyscanner, Hopper, and Airalo.

This wiki is the single reference for the Dellics Travels codebase, its design system, and its operational tooling. It is built from the official documentation set — the **Admin Website Documentation (v1.0)** and the **Figma Design Prompts** library — and grounded in the actual monorepo layout.

---

## What's in this wiki

### Getting Started
| Page | What it covers |
|---|---|
| [Project Overview](Project-Overview) | Product positioning, market, the documentation set, and contacts |
| [Repository Structure](Repository-Structure) | Monorepo layout, apps, packages, and how to run everything |

### Architecture
| Page | What it covers |
|---|---|
| [Architecture & Backend Linkage](Architecture-and-Backend-Linkage) | "One backend, two front doors" — how the mobile app, web app, and admin website all call the same NestJS API, module by module |

### Design
| Page | What it covers |
|---|---|
| [Design System](Design-System) | Brand colors, typography, logo rules, design principles, and the anti-AI-slop rules |
| [Figma Design Workflow](Figma-Design-Workflow) | The prompt library: master brief, per-screen template, worked examples, screen checklist, and the Humanizing Pass |

### Admin Website
| Page | What it covers |
|---|---|
| [Admin Website Overview](Admin-Website-Overview) | Purpose, scope, and the design benchmarks (Stripe, Shopify, Booking.com, Airbnb, Zendesk) |
| [Admin Roles & Permissions](Admin-Roles-and-Permissions) | The three admin roles and the full screen-level permission matrix |
| [Admin Screens](Admin-Screens) | Screen-by-screen specification for all 21 admin screens (A01–A21) |
| [Admin Operational Workflows](Admin-Operational-Workflows) | Day-to-day workflows: refunds, content publishing, incidents, support, fraud, onboarding |
| [Admin Tech Stack & Security](Admin-Tech-Stack-and-Security) | Technology choices, 2FA, RBAC guards, and the audit model |

---

## The one-paragraph summary

Dellics Travels is a **Turborepo + pnpm monorepo** containing an Expo/React Native traveler app (`apps/mobile`), a Next.js companion web app (`apps/web`), and a NestJS API (`apps/api`) backed by PostgreSQL/Supabase. There is **no separate admin API** — the admin website is a second front door onto the same backend, distinguished only by an elevated, role-claiming JWT. Every design decision, from the navy/orange brand system to the admin dashboard's action-first widgets, is benchmarked against the best operators in the industry (Booking.com, Stripe, Skyscanner, Shopify, Airbnb, Hopper, Airalo) rather than invented from scratch.

## Quick links

- Traveler mobile screen IDs use the **S** prefix (see the Screen & Navigation Specification)
- Admin screen IDs use the **A** prefix (A01–A21, see [Admin Screens](Admin-Screens))
- Brand tokens live in the [Design System](Design-System) page — navy `#0A0060`, orange `#F4740D`

---

*Dellics Travels · Tema Community 25, Devtraco Estate, Ghana · +233 55 205 4174 · info@dellicstravels.com*
