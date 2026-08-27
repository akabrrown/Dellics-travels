# Project Overview

## What is Dellics Travels?

Dellics Travels is a travel booking platform built for the **Ghanaian and West African market**. It offers flights, hotels, curated packages, cars, activities, and eSIM data plans through:

1. A **traveler-facing mobile app** (iOS/Android, Expo + React Native + NativeWind)
2. A **companion web app** (Next.js)
3. An **admin website** — the operational control center used by Content/Ops Admins, Support Agents, and the Super Admin to run the business the mobile app exposes to travelers

The product competes directly with Booking.com, Trip.com, Skyscanner, Hopper, and Airalo — and its design and operational patterns are deliberately benchmarked against those platforms rather than invented from scratch.

**Tagline:** *See the World*

## Market context

- Home airport: **Accra (ACC)**; real regional context throughout — Cape Coast, Kumasi, Lagos, Zanzibar, Dubai
- Currency: **GHS** (Ghana Cedi) as the primary display currency, with FX rates cached hourly and an admin override in Settings
- Membership: three tiers with points, perks, and SLA-priority support for Elite travelers

## The documentation set

This wiki consolidates the project's documentation set. The source documents reference each other by section number:

| Document | Role in the set |
|---|---|
| **Product & Technical Documentation (v3.0)** | Backend modules, data model, feature specs (the "main documentation") |
| **Screen & Navigation Specification** | Mobile app screens with **S-IDs** (S01–S52), navigation flows |
| **Admin Website Documentation (v1.0)** | Admin screens with **A-IDs** (A01–A21), roles, workflows, API linkage — August 2026 |
| **Figma Design Prompts** | Copy-paste prompt library for generating human-quality UI in Figma from the brand system |
| **Reliability & Scale Playbook** | Circuit-breaker, fallback, and observability patterns (referenced by the admin docs) |

Screen ID conventions:
- **S-prefixed IDs** (e.g. S08 Home, S14 Flight Results, S25 Checkout, S51 Live Chat) → traveler mobile app screens
- **A-prefixed IDs** (e.g. A02 Dashboard, A12 Refund Queue) → admin website screens

Whenever an admin action affects a traveler-visible screen, the documentation cross-references both IDs — e.g. publishing a package in **A08** makes it live on **S08**'s deals carousel.

## Core product principles (carried across every document)

1. **Benchmark, don't invent** — adopt proven patterns from Stripe (trust-through-clarity dashboards), Shopify (pipeline counts over lagging revenue), Booking.com (inventory density, urgency badges), Skyscanner (filter-chip density), Hopper (price trends), Airbnb (photo-forward detail, context-attached messaging), and Airalo (eSIM install flow).
2. **One backend, multiple front doors** — there is no separate admin API; see [Architecture & Backend Linkage](Architecture-and-Backend-Linkage).
3. **Real data in design** — real airport codes, real GHS prices, real destinations; never Lorem Ipsum or fabricated scarcity.
4. **Every screen has real states** — default, loading (skeleton, not spinner), empty, and error.
5. **Observability and audit by default** — circuit breakers, supplier health, and an append-only audit log on every elevated admin action.

## Contact

```
Dellics Travels
Tema Community 25, Devtraco Estate, Ghana
Phone: +233 55 205 4174
Email: info@dellicstravels.com
```

---

**Next:** [Repository Structure](Repository-Structure) · [Design System](Design-System)
