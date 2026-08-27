# Dellics Travels — Figma Design Prompts

A copy-paste prompt library for generating human-quality UI in Figma (Figma Make / Figma AI "First Draft," or as a creative brief for a freelance designer). Built from the existing brand system, feature specs, and screen inventory already documented for Dellics Travels.

---

## How to use this

1. **Paste the Master Brief (Section 1) first**, in its own generation or as the opening context of your file. This sets the visual DNA so every screen after it feels like it came from the same designer.
2. **For each screen**, use the Reusable Template (Section 2), filling in the bracketed parts from the Screen Checklist (Section 4).
3. **Reference earlier screens** in later prompts ("match the card style, button shape, and spacing already established on the Home screen") — this is the single biggest thing that stops a multi-screen AI-generated file from looking like 40 different designers worked on it.
4. **Always run the Humanizing Pass (Section 5)** after generation. No prompt alone gets you to expert-human quality — the pass is what closes that gap.

This works whether you're using Figma's built-in AI, a plugin, or handing it to a human designer as a creative brief.

---

## 1. Master Brand & Anti-AI Design Brief

*Paste this once, first, to establish the visual system.*

```
Design DNA for "Dellics Travels" — a mobile-first flight, hotel, package,
and eSIM booking app for the Ghanaian and West African market, competing
with Booking.com, Trip.com, Skyscanner, Hopper, and Airalo.

BRAND COLORS (use only these — no rainbow of accent colors):
- Dellics Navy #0A0060 — primary, app bars, headers, nav
- Ink Navy #030067 — deepest shade, hero/splash backgrounds
- Dellics Orange #F4740D — the ONLY accent color: CTAs, prices, active states, badges
- Sunrise Tint #FBD9BE — soft accent background for chips/highlights, never a primary surface
- Cloud White #FFFFFF — cards, backgrounds
- Slate #3A3A3A — body text on light backgrounds
- Confirm Green #1E7A34 / tint #E7F5EA — success, free cancellation, confirmed states only
- Alert Amber #B5540B / tint #FDEEE2 — urgency, price drops, warnings only

TYPOGRAPHY:
- Headings, prices, and display numbers: Poppins, bold weights (600–800)
- Body text, labels, form fields: Inter, regular/medium
- Use tabular (lining) figures for all prices and dates so numbers align in lists
- Build a real type scale with at least 6 distinct sizes/weights — not just
  "big bold title + one body size" like a landing-page template

LOGO / BRAND MARK: a circular navy badge containing a stylized orange
paper-airplane silhouette, used only for splash screens, app icon, and
empty-state illustrations — never resized under 32px, never recolored.

DESIGN PRINCIPLES — WHAT TO DO:
- Design for REAL information density. This is a booking app, not a
  marketing site — Booking.com and Skyscanner pack prices, ratings, dates,
  and badges tightly and legibly. Sparse, breezy spacing reads as an
  unfinished prototype, not a real product.
- Give every screen an editorial point of view: an intentional focal
  point, asymmetric weight, a clear "first thing your eye lands on" —
  not a perfectly centered, perfectly symmetrical grid.
- Design real states for every screen: default, loading (skeleton, not
  a spinner), empty, and error — a human product designer never ships
  only the happy path.
- Use layered, purposeful elevation (a search bar floating over a hero
  image; a sticky bottom action bar with a subtle top shadow) instead of
  the same drop-shadow value on every single card.
- Icons: one consistent hand-drawn-feeling line icon set, 1.5–2px stroke,
  rounded joins matching the logo's rounded aircraft silhouette — never
  mix icon styles or use emoji as functional icons.
- Write real microcopy: actual airport codes (ACC, DXB, LOS), real GHS
  prices, real dates, real Ghanaian/West African destination names
  (Accra, Cape Coast, Kumasi, Zanzibar, Lagos, Dubai) — never Lorem
  Ipsum or generic "Product Name" placeholder content.
- Urgency and scarcity indicators (only 2 rooms left, booked 12x today)
  must look like real inventory data pulled from a system, styled as
  a small, confident, slightly plain badge — not a shouty, oversized
  sticker.

WHAT TO AVOID (these read as "AI-generated" instantly):
- Purple-to-blue or purple-to-pink gradient backgrounds
- A centered hero with giant bold headline + subtext + button + three
  identical icon-in-a-circle feature cards below it
- Uniform 8–12px border radius applied identically to every single
  element with no hierarchy of shapes
- The exact same soft drop-shadow on every card, button, and icon
- Generic flat illustrations of people high-fiving, giving thumbs up,
  or standing next to giant phones
- Glassmorphism or neumorphism used as a decorative crutch rather than
  a deliberate, sparing choice
- Perfectly even, perfectly symmetrical spacing with no visual tension
  or hierarchy — real interfaces have rhythm, not just repetition
- Placeholder/lorem content, fake avatar initials with no real names,
  "$99.99" style prices that ignore the actual GHS/USD currency context

REFERENCE QUALITY BAR: Booking.com (property cards, urgency badges),
Skyscanner (flight result density and filter chips), Hopper (price-trend
UI, mobile-first checkout), Stripe Checkout (payment form trust and
clarity), Airbnb (photo-forward property detail pages). Match their
level of polish and real-world density, not a generic SaaS template.

PLATFORM: iOS/Android mobile app, 390×844 frame (iPhone 14/15 base),
built with 8pt spacing grid and auto-layout throughout so it maps
directly onto a React Native + NativeWind implementation.
```

---

## 2. Reusable Per-Screen Prompt Template

*Fill in the bracketed sections for each screen. Keep the brand system lines every time — repetition here is what keeps the file consistent.*

```
Using the established Dellics Travels design system (navy #0A0060,
orange #F4740D, Poppins headings / Inter body, 390×844 mobile frame),
design the [SCREEN NAME] screen.

PURPOSE: [one sentence — what this screen is for]

MUST INCLUDE:
- [element 1, e.g. "status bar + app bar with back chevron"]
- [element 2, e.g. "sticky bottom action bar with price + Reserve button"]
- [element 3 — list every real button/field, not just a vague description]
- [continue listing all elements from the screen spec]

CONTENT: use real example content — [give 2-3 concrete real examples,
e.g. "Accra (ACC) to Dubai (DXB), Sep 18–25, GHS 2,180, Dellics Air,
Nonstop, 5h 45m"]

STATE TO SHOW: [default / loading skeleton / empty / error — pick one
per generation, then generate the others as separate frames]

CONSISTENCY: match the button shape, card corner radius, spacing
rhythm, and icon style already established on [previous screen name],
so this looks like the same designer's file.

REFERENCE PATTERN: this screen borrows its interaction pattern from
[Booking.com / Skyscanner / Hopper / Stripe / Airbnb — whichever is
relevant], adapted into the Dellics navy/orange system.
```

---

## 3. Fully-Worked Examples

*Five ready-to-use prompts covering the highest-value screens. Use these as-is, or as models for the rest of the checklist in Section 4.*

### Home (S08)
```
Using the established Dellics Travels design system (navy #0A0060,
orange #F4740D, Poppins headings / Inter body, 390×844 mobile frame),
design the Home screen.

PURPOSE: primary landing screen — unified search entry point plus
deals and trending content, anchored by a 5-tab bottom nav.

MUST INCLUDE:
- Status bar, avatar + "Good morning, [Name]" greeting, notification bell
- A navy membership banner showing tier name, points balance, and a
  progress bar toward the next tier
- A search card with pill tabs (Flights/Hotels/Packages/Cars/Activities/
  eSIM), From/To fields with a swap icon, date field, traveler-count
  field, and a solid orange "Search flights" button
- An "Inspire Me — I don't know where yet" chip
- A horizontally-scrolling "Deals ending soon" card carousel — each
  card has a photo, an urgency badge with a real countdown, and a
  real GHS price
- A "Trending destinations" horizontal scroll section
- 5-tab bottom nav: Home (active), Explore, Trips, eSIM, Profile

CONTENT: real destinations — Cape Coast Weekend GHS 890, Dubai 5-Night
Escape GHS 6,240, home airport Accra (ACC)

STATE TO SHOW: default, fully loaded

REFERENCE PATTERN: unified search entry inspired by Booking.com and
Trip.com; urgency badges inspired by Booking.com/Agoda.
```

### Flight Search Results (S14)
```
Using the established Dellics Travels design system, design the
Flight Search Results screen.

PURPOSE: ranked, filterable flight results for a searched route.

MUST INCLUDE:
- App bar: back chevron, route title "Accra → Dubai", save/heart icon
- A price-trend banner ("Prices trending down 12% — booking within
  3 days recommended") in the Confirm Green tint
- A horizontal row of sort chips: Cheapest / Fastest / Best (selected) /
  Nonstop / Free bags
- 3 flight result cards, each with: airline logo mark, airline name,
  stops, departure/arrival times, duration with a dotted flight-path
  line, a real GHS price in bold, and a "Best value" badge on one card
- 5-tab bottom nav

CONTENT: Dellics Air 08:20–14:05 nonstop GHS 2,180; Sunrise Wings
13:10–21:40 1 stop ABJ GHS 1,640; Coastal Air 23:55–07:30+1 GHS 1,795

STATE TO SHOW: default, loaded — then generate a second frame showing
the same layout with skeleton-loading placeholder cards

REFERENCE PATTERN: Skyscanner's filter-chip density and Hopper's
price-trend banner.
```

### Property Detail (S20)
```
Using the established Dellics Travels design system, design the
Property Detail screen.

PURPOSE: full property page for a selected hotel — gallery, rating
breakdown, amenities, room selection.

MUST INCLUDE:
- Full-bleed photo header with photo-count indicator ("1 / 24 photos"),
  overlaid back and heart icons, and a photo-strip continuation below
- Property name, star rating, location line, and a navy score badge
  ("9.2 EXCELLENT")
- A "Travelers' Choice — Top 10% in Dubai" badge
- A guest-rating-breakdown card with 6 category sub-scores (Cleanliness,
  Location, Value, Staff, Comfort, Facilities) each with a mini progress
  bar and numeric score
- A 4-icon amenities grid (WiFi, Pool, Breakfast, Parking)
- A dashed-border room card with room name, guest count, cancellation
  policy, and price
- Sticky bottom bar: total price + "Reserve" button

CONTENT: Marina Bay Grand, Dubai Marina, 9.2 Excellent, GHS 1,540/night,
GHS 10,780 total for 7 nights

STATE TO SHOW: default, fully loaded

REFERENCE PATTERN: Booking.com's category sub-score breakdown;
TripAdvisor-style Travelers' Choice badge.
```

### Checkout (S25)
```
Using the established Dellics Travels design system, design the
Checkout screen.

PURPOSE: single checkout flow for a flight, hotel, package, or eSIM
order, using Stripe as the payment processor.

MUST INCLUDE:
- App bar with back chevron, "Checkout" title
- Traveler details card: name and email fields, pre-filled
- Payment method card: Apple Pay and Google Pay quick-pay buttons side
  by side, a saved-card row with card icon, masked number, expiry, and
  a selected-state radio indicator, plus "🔒 Payments secured by
  Stripe" trust line
- A dashed promo-code entry row with an "Apply" link
- An itemized price summary: subtotal, bundle discount in green,
  taxes & fees
- Sticky bottom bar: "Total due today" + amount, and a solid orange
  "Pay GHS [amount]" button with a shield icon

CONTENT: GHS 12,960 subtotal, − GHS 340 bundle discount, GHS 610 taxes,
GHS 13,230 total

STATE TO SHOW: default — then generate a second frame showing an
inline card-declined error state directly under the payment method
card, with a clear retry action

REFERENCE PATTERN: Stripe's own checkout — trust-first, minimal
friction, clear one visible next action.
```

### eSIM Activation (S34)
```
Using the established Dellics Travels design system, design the eSIM
Activation screen.

PURPOSE: post-purchase QR/LPA activation screen for a provisioned
Airalo-powered eSIM order.

MUST INCLUDE:
- App bar with back chevron
- A navy summary card: country flag + name, data/validity/network
  ("5GB · 30 days · 4G/5G"), an "Active" status badge, and a data-used
  progress bar ("1.2 GB / 5 GB")
- A white card containing a real-looking QR code, "Or install manually
  with the code below," and a monospace-styled activation code string
- A numbered 3-step "How it works" list (Buy your plan / Scan the QR
  code / Land & connect), each with a small icon and one-line
  description
- Sticky bottom bar: "Manage this eSIM" secondary button

CONTENT: United Arab Emirates 🇦🇪, 5GB, 30 days, LPA activation code

STATE TO SHOW: default, active plan

REFERENCE PATTERN: Airalo's own install flow, restyled entirely in
Dellics navy/orange — this should not look like a generic QR-code
utility screen, it should feel like part of the same app as Home.
```

---

## 4. Full Screen Checklist (organize your Figma pages by these groups)

Use the screen names and IDs from the Screen & Navigation Specification and Admin Website Documentation — generate in this order so later prompts can reference earlier, already-consistent screens.

**A. Onboarding & Auth** — Splash · Onboarding Carousel · Sign Up · Log In · Forgot Password · OTP Verification · Profile Setup

**B. Home & Search** — Home · Inspire Me Results · Date Picker · Traveler Picker · Filters (Flights) · Filters (Hotels)

**C. Flights** — Search Results · Flight Detail & Fare Rules · Seat Selection · Passenger Details

**D. Hotels** — Search Results · Map View · Property Detail · Room Selection · Photo Gallery

**E. Packages** — Package Builder · Add-ons Sheet

**F. Checkout** — Checkout · Promo Code · Booking Confirmation

**G. Trips** — My Trips · Trip Detail/Itinerary · Boarding Pass Viewer · Share Trip

**H. eSIM** — eSIM Store · Plan Detail · Activation/QR · My eSIMs

**I. Explore & Alerts** — Explore Map · Set Price Alert · My Price Alerts · Saved List

**J. Membership** — Membership Benefits · Rewards History · Referral Program

**K. Profile & Settings** — Profile · Edit Profile · Payment Methods · Add Payment Method · Passport & ID · Language & Currency · Notification Preferences · Log Out

**L. Support** — Help Center/FAQ · Live Chat · Notification Center · Write a Review

**M. Admin Website** (desktop frame, 1440×1024) — Login · Dashboard · Bookings + Detail · Travelers + Detail · Content/Package Editor · Promotions · Supplier Health · Finance & Reconciliation · Refund Queue · Support Queue + Detail · Reviews Moderation · Membership Config · eSIM Orders · Analytics · Roles & Team · Audit Log · Settings

---

## 5. The Humanizing Pass (do this after every batch of AI generation)

No prompt gets you all the way to expert-human quality on its own — this is the checklist a real product designer runs before calling a file done:

- [ ] **Alignment audit**: select everything, check nothing is off-grid by a few stray pixels — AI output frequently has near-misses
- [ ] **Radius consistency**: confirm corner radii follow a real hierarchy (e.g. 20px cards, 14px inputs, 100px pills) instead of one value everywhere
- [ ] **Icon consistency**: swap any mismatched or generic icons so the whole set reads as one hand
- [ ] **Real content pass**: replace any leftover placeholder text, fake data, or inconsistent currency formatting
- [ ] **Contrast check**: verify text-on-navy and text-on-orange combinations meet accessible contrast, not just "looks fine"
- [ ] **Spacing rhythm**: tighten anywhere spacing feels evenly-spaced-for-its-own-sake rather than grouped by relationship
- [ ] **State completeness**: confirm loading, empty, and error states actually exist for every screen that needs them, not just the happy path
- [ ] **Componentize**: convert repeated elements (buttons, cards, chips, badges) into real Figma components with variants, and wire up Figma Variables for the color tokens in Section 1 — this is what makes the file usable for actual handoff, not just a picture of an app

---

## 6. Figma Workflow Tips (developer-minded setup)

- **Set up Figma Variables first**: create color variables for every hex in Section 1 before generating any screens, so a later brand tweak is a one-place change, not a hunt-and-replace across 75 frames.
- **Build the component library before the screens**: Button (primary/outline/ghost variants), Card, Chip, Badge (urgent/good/orange/navy variants), Bottom Nav, App Bar — generate these first, then reference them by name in every subsequent screen prompt.
- **Name layers and frames to match the Screen IDs** (S08, S14, A02, etc.) from the existing documentation set — this makes Figma Dev Mode handoff traceable straight back to the feature specs and API linkage doc.
- **Use auto-layout on everything** — it's both what makes the file resizable/responsive and what makes a Figma-to-React-Native (NativeWind) handoff realistic instead of a flat picture a developer has to rebuild from scratch.
