# Figma Design Workflow

How the Dellics Travels screens are produced in Figma — a copy-paste prompt library for generating human-quality UI (Figma Make / Figma AI "First Draft," or as a creative brief for a freelance designer), built from the brand system, feature specs, and screen inventory.

## How to use the prompt library

1. **Paste the Master Brief first**, in its own generation or as the opening context of your file. This sets the visual DNA so every screen after it feels like it came from the same designer. *(The full brief is on the [Design System](Design-System) page.)*
2. **For each screen**, use the Reusable Template below, filling in the bracketed parts from the Screen Checklist.
3. **Reference earlier screens** in later prompts ("match the card style, button shape, and spacing already established on the Home screen") — this is the single biggest thing that stops a multi-screen AI-generated file from looking like 40 different designers worked on it.
4. **Always run the Humanizing Pass** after generation. No prompt alone gets you to expert-human quality — the pass is what closes that gap.

Works with Figma's built-in AI, a plugin, or as a brief handed to a human designer.

## Reusable per-screen prompt template

Fill in the bracketed sections for each screen. Keep the brand system lines every time — repetition here is what keeps the file consistent.

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

## Fully-worked example prompts

Five ready-to-use prompts covering the highest-value screens. Full text lives in `Dellics_Travels_Figma_Design_Prompts.md` at the repo root.

| Screen | Key elements | Reference pattern |
|---|---|---|
| **Home (S08)** | Greeting + bell, navy membership banner, unified search card with pill tabs (Flights/Hotels/Packages/Cars/Activities/eSIM), "Inspire Me" chip, "Deals ending soon" carousel with countdown badges, trending destinations, 5-tab nav | Booking.com / Trip.com unified search; Booking.com/Agoda urgency badges |
| **Flight Search Results (S14)** | Route app bar, price-trend banner in Confirm Green tint, sort chips (Cheapest/Fastest/Best/Nonstop/Free bags), dense result cards with dotted flight-path, "Best value" badge | Skyscanner filter-chip density; Hopper price-trend banner |
| **Property Detail (S20)** | Full-bleed photo header, navy score badge ("9.2 EXCELLENT"), Travelers' Choice badge, 6-category sub-score breakdown, amenities grid, dashed-border room card, sticky Reserve bar | Booking.com sub-score breakdown; TripAdvisor badge |
| **Checkout (S25)** | Traveler details card, Apple Pay/Google Pay quick-pay, saved-card row, "Payments secured by Stripe" trust line, dashed promo row, itemized summary, sticky "Pay GHS [amount]" button | Stripe's own checkout — trust-first, one visible next action |
| **eSIM Activation (S34)** | Navy summary card (flag, 5GB · 30 days · 4G/5G, Active badge, data-used progress), QR card with monospace LPA code, 3-step "How it works" | Airalo's install flow, restyled entirely in Dellics navy/orange |

## Full screen checklist (generation order)

Generate in this order so later prompts can reference earlier, already-consistent screens. Organize Figma pages by these groups:

| Group | Screens |
|---|---|
| **A. Onboarding & Auth** | Splash · Onboarding Carousel · Sign Up · Log In · Forgot Password · OTP Verification · Profile Setup |
| **B. Home & Search** | Home · Inspire Me Results · Date Picker · Traveler Picker · Filters (Flights) · Filters (Hotels) |
| **C. Flights** | Search Results · Flight Detail & Fare Rules · Seat Selection · Passenger Details |
| **D. Hotels** | Search Results · Map View · Property Detail · Room Selection · Photo Gallery |
| **E. Packages** | Package Builder · Add-ons Sheet |
| **F. Checkout** | Checkout · Promo Code · Booking Confirmation |
| **G. Trips** | My Trips · Trip Detail/Itinerary · Boarding Pass Viewer · Share Trip |
| **H. eSIM** | eSIM Store · Plan Detail · Activation/QR · My eSIMs |
| **I. Explore & Alerts** | Explore Map · Set Price Alert · My Price Alerts · Saved List |
| **J. Membership** | Membership Benefits · Rewards History · Referral Program |
| **K. Profile & Settings** | Profile · Edit Profile · Payment Methods · Add Payment Method · Passport & ID · Language & Currency · Notification Preferences · Log Out |
| **L. Support** | Help Center/FAQ · Live Chat · Notification Center · Write a Review |
| **M. Admin Website** *(desktop frame, 1440×1024)* | Login · Dashboard · Bookings + Detail · Travelers + Detail · Content/Package Editor · Promotions · Supplier Health · Finance & Reconciliation · Refund Queue · Support Queue + Detail · Reviews Moderation · Membership Config · eSIM Orders · Analytics · Roles & Team · Audit Log · Settings — full specs on [Admin Screens](Admin-Screens) |

## The Humanizing Pass (after every batch of AI generation)

No prompt gets you all the way to expert-human quality on its own — this is the checklist a real product designer runs before calling a file done:

- [ ] **Alignment audit**: select everything, check nothing is off-grid by a few stray pixels — AI output frequently has near-misses
- [ ] **Radius consistency**: confirm corner radii follow a real hierarchy (e.g. 20px cards, 14px inputs, 100px pills) instead of one value everywhere
- [ ] **Icon consistency**: swap any mismatched or generic icons so the whole set reads as one hand
- [ ] **Real content pass**: replace any leftover placeholder text, fake data, or inconsistent currency formatting
- [ ] **Contrast check**: verify text-on-navy and text-on-orange combinations meet accessible contrast, not just "looks fine"
- [ ] **Spacing rhythm**: tighten anywhere spacing feels evenly-spaced-for-its-own-sake rather than grouped by relationship
- [ ] **State completeness**: confirm loading, empty, and error states actually exist for every screen that needs them, not just the happy path
- [ ] **Componentize**: convert repeated elements (buttons, cards, chips, badges) into real Figma components with variants, and wire up Figma Variables for the color tokens — this is what makes the file usable for actual handoff, not just a picture of an app

## Figma workflow tips (developer-minded setup)

1. **Set up Figma Variables first**: create color variables for every hex in the [Design System](Design-System) before generating any screens, so a later brand tweak is a one-place change, not a hunt-and-replace across 75 frames.
2. **Build the component library before the screens**: Button (primary/outline/ghost variants), Card, Chip, Badge (urgent/good/orange/navy variants), Bottom Nav, App Bar — generate these first, then reference them by name in every subsequent screen prompt.
3. **Name layers and frames to match the Screen IDs** (S08, S14, A02, etc.) — this makes Figma Dev Mode handoff traceable straight back to the feature specs and API linkage doc.
4. **Use auto-layout on everything** — it's both what makes the file resizable/responsive and what makes a Figma-to-React-Native (NativeWind) handoff realistic instead of a flat picture a developer has to rebuild from scratch.

---

**Next:** [Admin Website Overview](Admin-Website-Overview)
