# Design System

The Dellics Travels design system — the visual DNA shared by the mobile app, web app, and admin website. Sourced from the Master Brand & Anti-AI Design Brief in the Figma Design Prompts library.

**Platform baseline:** iOS/Android mobile app, **390×844 frame** (iPhone 14/15 base), 8pt spacing grid, auto-layout throughout — so Figma maps directly onto a React Native + NativeWind implementation. The admin website uses desktop **1440×1024** frames.

## Brand colors

Use only these — no rainbow of accent colors.

| Token | Hex | Usage |
|---|---|---|
| **Dellics Navy** | `#0A0060` | Primary — app bars, headers, nav |
| **Ink Navy** | `#030067` | Deepest shade — hero/splash backgrounds |
| **Dellics Orange** | `#F4740D` | The **only** accent color: CTAs, prices, active states, badges |
| **Sunrise Tint** | `#FBD9BE` | Soft accent background for chips/highlights — never a primary surface |
| **Cloud White** | `#FFFFFF` | Cards, backgrounds |
| **Slate** | `#3A3A3A` | Body text on light backgrounds |
| **Confirm Green** | `#1E7A34` (tint `#E7F5EA`) | Success, free cancellation, confirmed states only |
| **Alert Amber** | `#B5540B` (tint `#FDEEE2`) | Urgency, price drops, warnings only |

Color discipline rule (carried from the admin benchmarks): **colour is reserved for status signals only** (confirmed/pending/failed), never for decoration.

## Typography

| Role | Font | Weights |
|---|---|---|
| Headings, prices, display numbers | **Poppins** | Bold, 600–800 |
| Body text, labels, form fields | **Inter** | Regular/Medium |

- Use **tabular (lining) figures** for all prices and dates so numbers align in lists
- Build a real type scale with at least **6 distinct sizes/weights** — not just "big bold title + one body size"

## Logo / brand mark

A **circular navy badge** containing a stylized **orange paper-airplane silhouette**.

- Used only for splash screens, app icon, and empty-state illustrations
- Never resized under **32px**
- Never recolored

## Design principles — what to do

1. **Design for REAL information density.** This is a booking app, not a marketing site — Booking.com and Skyscanner pack prices, ratings, dates, and badges tightly and legibly. Sparse, breezy spacing reads as an unfinished prototype, not a real product.
2. **Give every screen an editorial point of view** — an intentional focal point, asymmetric weight, a clear "first thing your eye lands on" — not a perfectly centered, perfectly symmetrical grid.
3. **Design real states for every screen**: default, loading (skeleton, not a spinner), empty, and error. A human product designer never ships only the happy path.
4. **Use layered, purposeful elevation** (a search bar floating over a hero image; a sticky bottom action bar with a subtle top shadow) instead of the same drop-shadow value on every card.
5. **Icons**: one consistent hand-drawn-feeling line icon set, 1.5–2px stroke, rounded joins matching the logo's rounded aircraft silhouette. Never mix icon styles or use emoji as functional icons.
6. **Write real microcopy**: actual airport codes (ACC, DXB, LOS), real GHS prices, real dates, real Ghanaian/West African destination names (Accra, Cape Coast, Kumasi, Zanzibar, Lagos, Dubai). Never Lorem Ipsum or generic placeholder content.
7. **Urgency and scarcity indicators** ("only 2 rooms left", "booked 12x today") must look like real inventory data pulled from a system — a small, confident, slightly plain badge, not a shouty, oversized sticker.

## What to avoid (these read as "AI-generated" instantly)

- Purple-to-blue or purple-to-pink gradient backgrounds
- A centered hero with giant bold headline + subtext + button + three identical icon-in-a-circle feature cards below it
- Uniform 8–12px border radius applied identically to every element with no hierarchy of shapes
- The exact same soft drop-shadow on every card, button, and icon
- Generic flat illustrations of people high-fiving, giving thumbs up, or standing next to giant phones
- Glassmorphism or neumorphism used as a decorative crutch rather than a deliberate, sparing choice
- Perfectly even, perfectly symmetrical spacing with no visual tension or hierarchy — real interfaces have rhythm, not just repetition
- Placeholder/lorem content, fake avatar initials with no real names, "$99.99"-style prices that ignore the actual GHS/USD currency context

## Reference quality bar

| Benchmark | What we take from it |
|---|---|
| **Booking.com** | Property cards, urgency badges, category sub-score breakdowns |
| **Skyscanner** | Flight result density and filter chips |
| **Hopper** | Price-trend UI, mobile-first checkout |
| **Stripe Checkout** | Payment form trust and clarity |
| **Airbnb** | Photo-forward property detail pages |

Match their level of polish and real-world density — not a generic SaaS template.

## Shape & spacing hierarchy (from the Humanizing Pass)

Corner radii should follow a real hierarchy, e.g.:

- **20px** — cards
- **14px** — inputs
- **100px** — pills/chips

---

**Next:** [Figma Design Workflow](Figma-Design-Workflow) — how to apply this system screen by screen.
