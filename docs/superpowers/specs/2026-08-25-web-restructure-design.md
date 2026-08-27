# Dellics Travels Web Restructure — Design Spec

**Date:** 2026-08-25
**Status:** Approved
**Approach:** A — Full App Router rebuild in `apps/web`, backend logic in `apps/api`

## Problem

The current public website is a legacy static site at `apps/Dellics Travels/Dellics Travels/`: ~22 hand-maintained HTML pages, 85KB of bespoke CSS, 30KB of DOM-manipulation JS, and three parallel copies of the same passenger-selector code. It does not use the project's actual stack (Turborepo, Next.js, NestJS, Supabase), and it has two production defects:

1. **Leaked credentials** — `ratehawk-config.js` ships a real Ratehawk sandbox API key to every browser (`window.RATEHAWK_API_KEY`), and `ratehawk-api.js` sends it in request bodies and headers client-side.
2. **Dead forms** — the contact form fakes success with a toast and submits nothing.

## Decisions (user-confirmed)

| Decision | Choice |
|---|---|
| Scope | Public site only. No admin-panel build; `/admin` is a stub route. |
| Design | Rebuilt in the documented brand design system (navy/orange, Poppins/Inter, shadcn/ui), not a pixel-faithful port. |
| Behavior | WhatsApp handoff kept for flights; hotel search moved server-side; contact/inquire get real validated, persisted endpoints. |
| Target app | Built inside the existing `apps/web` Next.js app. |
| Legacy folder | Deleted after verification. Leaked Ratehawk key rotated with Ratehawk (user action, outside code). |

## 1. Architecture

- **`apps/web`** — Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui. Server Components render all content pages (prerendered for SEO). Client components only for interactive widgets.
- **`apps/api`** — gains two NestJS modules: **Hotels** (Ratehawk proxy, server-side credentials) and **Inquiries** (form submissions). Follows existing module conventions (controller/module/service layout like `booking/`, `esim/`).
- **Database** — one new `Inquiry` table via a new Supabase migration in `supabase/migrations/`.
- One backend, two front doors: `apps/web` calls the same NestJS API the mobile app uses; no Next.js route handlers duplicate backend logic.

## 2. Route map

| Legacy page | New route | Rendering |
|---|---|---|
| `index.html` | `/` | Server + client widgets |
| `flights.html` | `/flights` | Server + FlightSearchWidget |
| `hotels.html` | `/hotels` | Server + HotelSearch |
| `tours.html` | `/tours` | Server |
| `transfers.html` | `/transfers` | Server |
| `visa.html` | `/visa` | Server |
| `destinations.html` | `/destinations` | Server (region index) |
| `destinations-{region}.html` ×5 | `/destinations/[region]` | One template; region as typed data (africa, asia, europe, middle-east, north-america); invalid region → `notFound()` |
| `corporate.html` | `/corporate` | Server |
| `diaspora.html` | `/diaspora` | Server |
| `services.html` | `/services` | Server |
| `credentials.html` | `/credentials` | Server |
| `gallery.html` | `/gallery` | Server + GalleryLightbox |
| `about.html` | `/about` | Server |
| `contact.html` | `/contact` | Server + ContactForm |
| `inquire.html` | `/inquire` | Server + InquireForm |
| `privacy.html` | `/privacy` | Server |
| `terms.html` | `/terms` | Server |
| `admin.html` | `/admin` | Stub: brand-styled page stating the admin portal is a separate application |

All routes get per-page `metadata` (title/description/OpenGraph) carried over from the legacy `<head>`.

## 3. Frontend

### Design tokens (Tailwind)

| Token | Value | Use |
|---|---|---|
| navy | `#0A0060` | Primary, header, footer |
| ink | `#030067` | Hero/deepest surfaces |
| orange | `#F4740D` | Sole accent: CTAs, prices, active states |
| sunrise | `#FBD9BE` | Chip/highlight tint, never a primary surface |
| slate | `#3A3A3A` | Body text on light |
| confirm | `#1E7A34` / tint `#E7F5EA` | Success states |
| alert | `#B5540B` / tint `#FDEEE2` | Urgency/warnings |

Fonts via `next/font`: Poppins 600–800 (headings, prices), Inter 400–600 (body). Radius hierarchy: 20px cards / 14px inputs / 100px pills.

### Layout

Shared root layout: announcement bar, sticky header (scroll state) with desktop dropdown nav and mobile sheet nav, footer with contact details, accreditation logos (IATA, Amadeus, RateHawk, etc. from `licensedaccredited/`), and legal links. Active nav state derived from the route.

### Client widgets

| Widget | Behavior |
|---|---|
| `HeroSlider` | Image + muted autoplay video slides, 5s timer, dots, video-`ended` advances slide |
| `QuickBook` | Flights/tours/hotels/transfers tabs with per-tab field placeholders |
| `FlightSearchWidget` | Roundtrip / oneway / multi-city (2–7 legs, add/remove), class select, shared `PassengerSelector`; on submit composes the trip summary and opens the WhatsApp deep-link `https://wa.me/233552054174?text=...` — same-tab, same as legacy |
| `PassengerSelector` | One shared implementation (adults 1–9, children 0–8, infants 0–4) replacing the three legacy copies |
| `HotelSearchForm` + results | Destination/check-in/check-out/guests → `POST /hotels/search` on the API. States: skeleton cards while loading, empty message when zero results, specific error card on failure (no silent mock fallback) |
| `GalleryLightbox` | Click-to-open, Esc/backdrop close, focus-managed |
| `ContactForm` / `InquireForm` | zod validation client-side; submit to `POST /inquiries`; success/error toasts; disabled + pending state while in flight |

Every interactive surface implements loading, empty, error, and success states.

## 4. Backend (apps/api)

### Hotels module (`src/hotels/`)

- `POST /hotels/search`
- Body validation (DTO + class-validator): destination non-empty string, dates `YYYY-MM-DD`, check-in ≥ today, check-out > check-in, guests 1–16, rooms 1–8
- Calls Ratehawk sandbox (`RATEHAWK_BASE_URL`, default `https://api-sandbox.ratehawk.com`) with credentials from server env only; timeouts on the outbound call
- Normalizes the response to a stable shape: `id, name, rating, address, city, country, price, currency, images[], amenities[], description`
- On upstream failure returns a structured error (`{ message, code }`) — the frontend shows it; mock data never masquerades as live results
- Env: `RATEHAWK_API_ID`, `RATEHAWK_API_KEY`, `RATEHAWK_BASE_URL` in `apps/api/.env` (gitignored) + `.env.example`

### Inquiries module (`src/inquiries/`)

- `POST /inquiries`
- DTO: `kind` (`contact` | `inquiry`), name, email, phone (optional), message, plus inquiry extras (destination/service, dates, travelers)
- Server-side validation identical in strictness to the client's; rate limiting on the endpoint
- Persists to the `Inquiry` table; sends a notification email via Resend when `RESEND_API_KEY` is configured (degrades gracefully: persisted even if email fails, flagged in logs)
- Returns `201` with a generic acknowledgement (no data echo)

### Database

New migration `create_inquiry_table` in `supabase/migrations/`:

```
Inquiry(id uuid pk default gen_random_uuid(),
        kind text check in ('contact','inquiry'),
        name text, email text, phone text nullable,
        message text, payload jsonb nullable,
        created_at timestamptz default now())
```

Plus the matching model in the shared Prisma schema (`packages/database`).

## 5. Media & SEO

- Images from `images/` (including `Africa/`, `Asia/`, `Europe/`, `Middle_East/`, `North_America/`) → `apps/web/public/images/…`, served through `next/image` with width/height; the 3.7MB `Tanzania.jpg` gets a compressed replacement
- Videos (`airport transportation.mp4`, `hotel.mp4`) → `apps/web/public/videos/`
- Accreditation logos → `apps/web/public/badges/`
- `sitemap.xml` and `robots.txt` regenerated for the new route set; `company logo.png` → favicon + header logo

## 6. Security

- Ratehawk key exists only in `apps/api/.env`; nothing secret in any client bundle; `ratehawk-config.js` pattern eliminated
- All form/search input validated client AND server
- Inquiries endpoint rate-limited; no PII rendered anywhere without an admin context (none exists in this scope)
- `.env.example` documents keys without values; `.gitignore` verified to exclude all `.env` files
- User action (outside code): rotate the leaked Ratehawk sandbox key

## 7. Verification & cutover

1. `pnpm check-types`, `pnpm lint`, `pnpm build` pass across the monorepo
2. Run `apps/api` + `apps/web` locally; browser-verify all 19 routes render, nav/mobile nav works, hero slider plays
3. Hotel search: valid query returns results or a real error state; invalid input rejected server-side
4. Contact + inquire forms: submissions persist to the DB (verified by query), invalid input rejected
5. Flight search produces the correct WhatsApp deep-link
6. Only after 1–5 pass: delete `apps/Dellics Travels/`

## 8. Out of scope

- Admin website build (A01–A21) — future project per the documentation set
- Real booking/payment engine — WhatsApp remains the conversion channel
- Mobile app changes
