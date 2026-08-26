DELLICS TRAVELS
===============

_— See the World —_  
**Mobile Travel Booking Platform**  
**Complete Product & Technical Documentation**  
**Document Version 2.0 | Status: Production-Ready Specification**  
**Prepared for Dellics Travels | August 2026**

Contact Information
-------------------

**Dellics Travels** Tema Community 25, Devtraco Estate, Ghana  
**Phone:** +233 55 205 4174  
**Email:** info@dellicstravels.com  
**Business Hours:** Monday to Saturday, 8:00 AM to 6:00 PM GMT

Table of Contents
-----------------

1.  Executive Summary
2.  Competitive Research — Booking.com, Expedia, Trip.com, Skyscanner & Others
3.  Brand & Visual Identity
4.  Product Overview
5.  User Roles & Permissions
6.  Feature Architecture
7.  Dellics Membership Packages
8.  Phased Delivery Roadmap
9.  Complete Technology Stack
10.  System Architecture
11.  Core Data Model
12.  Payment Integration — Stripe
13.  Security & Compliance
14.  Non-Functional Requirements
15.  Risk Register (Summary)
16.  Workflow — End-to-End Operational Flows

1\. Executive Summary
---------------------

Dellics Travels is a mobile-first travel booking platform that lets travelers search, compare, and book flights, hotels, car rentals, activities, and bundled vacation packages from a single app. The product draws on proven patterns from **Booking.com** — the world’s largest travel platform with over 500 million annual bookings — as its primary benchmark for conversion optimization, inventory breadth, urgency merchandising, and loyalty engineering. Secondary insights from Expedia, Trip.com, Skyscanner, Hopper, and others add advanced capabilities like dynamic packaging, price prediction, and multi-modal transport search.  
This document is the single source of truth for building Dellics Travels to a production-ready standard. It defines the competitive research behind the feature set, the visual identity derived from the Dellics Travels logo, the complete feature architecture split into MVP (ready-to-production) and later phases, the membership package structure, the full technology stack, system architecture, data model, Stripe-based payment integration, security posture, and the end-to-end operational workflows that tie every feature together.  
**Scope of this release**  
The MVP defined in Section 6 is scoped to ship as a real, working production app: account creation, flight/hotel/package search and booking, Stripe checkout, trip management, price alerts, and a tiered membership system. Advanced supplier integrations (GDS/NDC direct airline contracts, white-label car rental APIs) are flagged as Phase 2/3 and are designed around third-party aggregator APIs (e.g. Duffel, Amadeus, RateHawk) so the MVP can launch without in-house airline contracts.

2\. Competitive Research
------------------------

Booking.com is the world’s largest accommodation and travel booking platform, processing **over 500 million bookings annually** across hotels, homes, flights, car rentals, and attractions. Its scale, conversion-optimized UX, and Genius loyalty engine make it the single most important benchmark for Dellics Travels. Every other competitor in this section is evaluated as a secondary or tertiary reference that adds specific capabilities Booking.com does not own exclusively.

### 2.1 Booking.com (Primary Benchmark)

*   **Scale & Trust:** 500M+ annual bookings, 28M+ total reported listings (hotels, homes, apartments, resorts), and operations in 200+ countries. The benchmark for search performance, inventory breadth, and checkout reliability at massive scale.
*   **Genius Loyalty Program:** Three-tier program (Genius Level 1–3) unlocking instant discounts, free breakfast, and room upgrades. Rewards are applied at checkout, not earned over time—reducing friction and increasing conversion.
*   **Urgency & Scarcity Merchandising:** Heavy use of real availability signals (“Only 2 rooms left at this price,” “Booked 12 times in the last 24 hours,” “In high demand”) and countdown timers on time-limited deals. Proven to drive immediate purchase decisions.
*   **All-in-One Inventory:** Hotels, vacation rentals, flights, car rentals, airport taxis, and attractions in a single platform. The “Homes” tab sits alongside hotels, giving apartments and villas first-class status.
*   **Flexible Search Patterns:** “I don’t know my dates yet” and “I’m traveling for work” toggles built into the search bar from the first screen. Reduces drop-off for undecided travelers.
*   **Free Cancellation as Default:** Properties with free cancellation are heavily badged and filtered; cancellation policy is surfaced before the user reaches checkout, reducing booking hesitation.
*   **Verified Reviews:** Only guests who completed a stay can leave a review. Properties display category sub-scores (cleanliness, staff, location, value for money, comfort, facilities) alongside the overall score.
*   **Property-First Mobile UX:** Mobile app is optimized for thumb-scrolling through image galleries, map pins with price-per-night overlays, and one-tap saved-list creation.
*   **Deals & Secret Offers:** Member-only “Secret Deals” and mobile-only discounts that require login, incentivizing account creation before browsing.

### 2.2 Expedia

*   **One Key Rewards:** Unified points program spanning flights, hotels, cars, and activities with points redeemable across the entire trip.
*   **Bundle & Save Dynamic Packaging:** Automatic repricing when flight + hotel (+car) combinations change; bundled bookings receive an extra discount.
*   **Member-Only Prices:** Signed-in users see exclusive rates on hotels and flights, reinforcing the value of account creation.
*   **Trip Boards:** Collaborative planning tools where travelers invite companions to view or contribute to an itinerary.

### 2.3 Trip.com

*   **All-in-One Booking:** Flights, hotels, trains, car rentals, and attraction tickets in a single app, removing the need to switch platforms.
*   **Trip Planner:** Bookings auto-organized into a timeline/itinerary view across the whole trip.
*   **Real-Time Flight Alerts:** Push notifications for delays, gate changes, and cancellations.
*   **Trip Coins Loyalty:** Six-tier membership ladder (Silver → Black Diamond) unlocking lounge access, priority support, and travel credits.
*   **Bundle & Save:** Dynamically discounted flight + hotel packages shown alongside standalone results.
*   **Multi-Currency & Multi-Language:** Strong global localization, especially across Asia-Pacific markets.

### 2.4 Skyscanner

*   **“Everywhere” Search:** Enter only an origin and browse ranked destinations by price when the traveler has no fixed destination.
*   **Whole Month / Flexible-Date Calendar:** Surfaces the cheapest days to fly within a chosen month.
*   **Price Alerts:** Track a specific route/date and notify on any fare change; app-exclusive “Drops” feed for 20%+ price drops.
*   **Saved Collections:** Group saved flights/hotels into trip-based collections for side-by-side comparison.
*   **Metasearch Filtering:** By stops, airline, duration, and cabin class.

### 2.5 Priceline

*   **Express Deals / Opaque Rates:** Unbranded hotel and flight deals at lower prices, with details revealed after booking.
*   **VIP Loyalty Program:** Cash-back-style rewards on every booking.
*   **Bundle Savings:** Automatic extra discount when flight and hotel are booked together in one checkout.
*   **Free Cancellation Badges:** Surfaced directly in search results to reduce hesitation.

### 2.6 Hopper

*   **AI Price Prediction:** “Buy now vs. wait” guidance for flights and hotels, based on historical fare-trend modeling.
*   **Price Freeze:** Pay a small fee to lock today’s fare for up to 14 days.
*   **Price Watch:** Passive fare/rate monitoring with push notifications, independent of an active search session.
*   **Fintech Protections:** Cancel For Any Reason, Disruption Rebooking, and Price Drop Guarantee.
*   **Mobile-Only Design:** Every flow, including payment, built for a phone screen first.

### 2.7 Google Flights

*   **Explore Map:** World map of live fares from the traveler’s home airport, filterable by interest (beach, outdoors, city) and trip length.
*   **Date Grid:** Calendar matrix of departure × return dates, color-coded cheapest (green) to most expensive (red).
*   **Price Graph:** Multi-week/month fare-trend chart for a fixed route, with low/typical/high price indicators.
*   **Multi-Airport Search:** Up to 7 origin/destination airports at once, plus nearby-airport price comparison.

### 2.8 Airbnb & Vrbo

*   **Vacation Rentals / Homestays:** Entire homes, private rooms, and unique stays as a first-class inventory type alongside hotels.
*   **Host-Provided Details:** Photo galleries, house rules, and amenity checklists shown before booking.
*   **Instant Book vs. Request-to-Book:** Distinction with response-time badges for hosts.
*   **Guest-to-Host Messaging:** In-app messaging thread scoped to a single reservation.

### 2.9 Agoda

*   **Aggressive Urgency Merchandising:** “Only 1 room left,” live countdown timers on deal prices.
*   **PointsMax:** Loyalty currency redeemable across flights and hotels, stackable with member discounts.
*   **Cash-Back Instant Discounts:** Applied directly at checkout rather than earned over time.

### 2.10 TripAdvisor

*   **Aggregated Reviews:** Cross-platform reviews with 1–5 bubble ratings, traveler photos, “Travelers’ Choice” badges, and category sub-scores.
*   **Destination Forums:** Q&A threads where travelers answer other travelers’ questions before booking.
*   **Price Comparison Panel:** Same hotel’s rate across multiple OTAs shown side by side.

### 2.11 GetYourGuide & Klook

*   **Instant-Confirmation Activities:** Mobile e-ticket/QR voucher—no printing required.
*   **Merchandising Badges:** “Skip the line” and “Free cancellation up to 24 hours before” shown directly on activity cards.
*   **Curated Destination Guides:** Bundle top attractions, tours, and transport passes into a single “things to do” feed.

### 2.12 Rome2Rio

*   **Multi-Modal Journey Search:** Single query returns flight, train, bus, ferry, and drive options side by side with total door-to-door time and cost.
*   **Route Visualization:** Each leg of a multi-modal journey on one map.

### 2.13 Turo

*   **Peer-to-Peer Car Sharing:** Host-owned vehicle listings as an alternative to traditional rental-car counters, with delivery-to-airport options and per-trip insurance add-ons.

### 2.14 Kayak

*   **Fare-Trend Graphs:** “Buy now vs. wait” signals and a dedicated price-tracking hub kept separate from live search results.
*   **Multi-Product Search:** Flights, hotels, cars, and packages in one query.

### 2.15 Feature Synthesis — What Dellics Travels Adopts

| **Pattern** | **Primary Source** | **Dellics Implementation** |
| --- | --- | --- |
| **All-in-one booking** | Booking.com / Trip.com / Expedia | Flights, hotels, cars, activities, and packages in one app |
| **Genius-style instant loyalty** | Booking.com | Dellics Rewards points + tiered Membership Packages with instant perks (Sec. 7) |
| **Urgency & scarcity merchandising** | Booking.com / Agoda | Live availability counts, countdown timers, demand indicators on every result card (Sec. 6.20) |
| **Free cancellation as default** | Booking.com / Priceline | Cancellation-policy chip shown on every result and filterable before search |
| **Homes & vacation rentals** | Booking.com / Airbnb / Vrbo | Homestay inventory type alongside hotels (Sec. 6.17) |
| **Verified reviews with sub-scores** | Booking.com / TripAdvisor | Category sub-scores, verified-stay badge, Travelers’ Choice badges (Sec. 6.21) |
| **Member-only / Secret Deals** | Booking.com / Expedia | Signed-in discount banner on flight & hotel results |
| **Everywhere / flexible search** | Skyscanner | “Inspire Me” destination search + Whole-Month calendar |
| **Explore map + Date Grid + Price Graph** | Google Flights | Interactive fare map, date-grid calendar, and fare-trend chart (Sec. 6.16) |
| **Price Alerts & Drops** | Skyscanner | Per-route fare tracking with push notifications |
| **Price Prediction & Price Freeze** | Hopper / Kayak | Book-now-vs-wait guidance + paid fare lock (Sec. 6.16) |
| **Dynamic packaging** | Expedia / Priceline / Trip.com | Flight+Hotel(+Car) bundles auto-discounted at checkout |
| **Multi-modal transport search** | Rome2Rio | Train/bus/ferry options alongside flights on select routes (Sec. 6.18) |
| **Peer-to-peer car sharing** | Turo | Host-listed vehicles as an alternative to counter rentals (Sec. 6.19) |
| **Instant-confirmation activities** | GetYourGuide / Klook | Mobile e-ticket, skip-the-line and free-cancellation badges (Sec. 6.22) |
| **Trip timeline / planner** | Trip.com / Expedia trip boards | Unified itinerary hub per trip, shareable with companions |
| **AI itinerary suggestions** | Booking.com / Hopper | Curated packages and “things to do” carousels per destination |

3\. Brand & Visual Identity
---------------------------

Colors were extracted directly from the Dellics Travels logo (deep navy circle badge, orange aircraft mark, and clean white wordmark) and form the design token set for the app UI.

### 3.1 Color Palette

| **Token** | **Hex** | **Usage** |
| --- | --- | --- |
| Primary — Dellics Navy | #0A0060 | App bars, primary buttons, headers, nav background |
| Primary Dark — Ink Navy | #030067 | Splash screen, hero backgrounds, footers |
| Accent — Dellics Orange | #F4740D | CTAs, price highlights, badges, active states |
| Accent Tint — Sunrise | #FBD9BE | Chips, selected filter backgrounds, subtle highlights |
| Neutral — Cloud White | #FFFFFF | Cards, backgrounds, wordmark on navy |
| Neutral — Slate Text | #3A3A3A | Body copy on light backgrounds |
| Semantic — Confirm Green | #1E7A34 | Booking confirmed, free cancellation, success states |
| Semantic — Alert Amber | #B5540B | Price drop alerts, limited-availability warnings |

### 3.2 Typography & Iconography

*   **Primary typeface:** Poppins (headings, bold weights for pricing) with Inter for body text — both open-source, mobile-legible at small sizes.
*   **Iconography** follows a rounded, 2px-stroke line style echoing the rounded aircraft silhouette in the logo.
*   **The circular badge mark** (sun, mountains, aircraft) is reserved for splash screen, app icon, and empty-state illustrations — never resized below 32px.

### 3.3 Tone of Voice

*   **Confident and light** — “See the World” tagline carries through in empty states and confirmation screens (“Packed and ready — see the world.”)
*   **Ghanaian-friendly defaults:** GHS shown first for Ghana-based accounts, with instant toggle to USD/EUR/GBP.

4\. Product Overview
--------------------

### 4.1 Vision

Give travelers — starting with Ghana and expanding across West Africa — one trusted app to discover, compare, and book every part of a trip, with transparent pricing, real-time trip management, and a rewards system that pays back loyalty.

### 4.2 Platforms

*   **iOS and Android mobile apps (React Native)** — primary product surface.
*   **Companion responsive web app (Next.js)** for search/browse and account management, sharing the same backend.
*   **Admin/Ops web console** for content, supplier, and support management.

### 4.3 Target Users

*   **Leisure travelers** booking flights, hotel stays, and vacation packages.
*   **Business travelers** needing fast rebooking, price tracking, and itinerary management.
*   **Budget/flexible travelers** using Everywhere search and price alerts to decide where and when to go.

5\. User Roles & Permissions
----------------------------

Roles are kept lean and permission boundaries explicit, consistent with the role-based architecture used across Dellics’s other products.

| **Role** | **Access** | **Cannot Do** |
| --- | --- | --- |
| Traveler (Guest) | Search flights/hotels/packages, view prices, browse Inspire Me | Book, save trips, view member pricing |
| Traveler (Registered) | Full booking, Stripe checkout, trip management, price alerts, rewards | Access admin/ops tooling |
| Support Agent | View bookings, issue refunds within policy, respond to in-app chat | Edit content, change pricing, access supplier contracts |
| Content/Ops Admin | Manage destinations, packages, promotions, supplier catalog | Directly modify a customer’s payment method |
| Super Admin | Full system access: roles, financial reconciliation, supplier API keys | N/A |

6\. Feature Architecture
------------------------

Each module below is tagged Ready-to-Production (ships in MVP), Phase 2, or Phase 3. “Ready-to-Production” means the feature is scoped with a concrete data model, API, and UI flow in this document and can be built directly against the stack in Section 9.

### 6.1 Search & Discovery

**\[ READY-TO-PRODUCTION \]**

*   Unified search bar for Flights, Hotels, Packages, Cars, and Activities with tabbed results.
*   **“Inspire Me” Everywhere search:** enter only origin + budget, browse ranked destinations by price (Skyscanner pattern).
*   **Whole-Month flexible calendar** showing the cheapest days to fly/stay within a chosen month.
*   **Smart filters:** stops, airline, cabin class, star rating, amenities, cancellation policy, price range.
*   **Map view** for hotels and activities with cluster pins and price-per-night overlay.
*   **Booking.com pattern — Flexible Search Toggles:** “I don’t know my dates yet” and “I’m traveling for work” options surfaced directly on the home screen search bar to reduce drop-off.

### 6.2 Flights

**\[ READY-TO-PRODUCTION \]**

*   One-way, round-trip, and multi-city search via aggregator API (Duffel/Amadeus self-service in Phase 1).
*   Seat class comparison, baggage allowance display, and fare rules shown before checkout.
*   Real-time flight status: delay, gate change, and cancellation push notifications.
*   Fare hold: reserve a fare for 30 minutes during checkout (soft reservation) before payment capture.

### 6.3 Hotels

**\[ READY-TO-PRODUCTION \]**

*   Hotel search with photos, amenities, guest reviews, and cancellation-policy chip on every card.
*   Room-type comparison with per-night and total-stay pricing breakdown.
*   Two-stage inventory: soft hold on selection, hard confirmation on successful payment (prevents double-booking).
*   **“Members-only price” banner** for signed-in users (Booking.com / Expedia pattern).
*   **Verified review display** with category sub-scores (cleanliness, location, service, value) — Booking.com pattern.

### 6.4 Packages (Flight + Hotel Bundles)

**\[ READY-TO-PRODUCTION \]**

*   Dynamic packaging engine: selecting a flight and hotel for the same dates auto-applies a bundle discount at checkout.
*   Pre-built curated packages (e.g. “Cape Coast Weekend”, “Dubai 5-Night Escape”) merchandised on the home screen.
*   Package builder: add Car Rental or Activities to an existing Flight+Hotel bundle before final checkout.
*   Single checkout and single confirmation/itinerary for the whole package, even though suppliers differ.

### 6.5 Car Rentals

**\[ PHASE 2 \]**

*   Aggregator-sourced car rental search (pickup/drop-off location, dates, vehicle class).
*   Add-on to an existing flight or package booking from the trip itinerary screen.

### 6.6 Activities & Tours

**\[ PHASE 2 \]**

*   Bookable local experiences and attraction tickets, addable to any trip itinerary.
*   Curated “Things to do” carousel per destination, sourced from a partner activities API.
*   Instant-confirmation booking with a mobile e-ticket/QR voucher — no printing required (GetYourGuide/Klook pattern).
*   “Skip the line” and “Free cancellation up to 24h before” badges shown directly on activity cards.

### 6.7 Trip Planner / Itinerary Hub

**\[ READY-TO-PRODUCTION \]**

*   All confirmed bookings for a trip (flight, hotel, package) auto-organized into a single chronological timeline.
*   Offline-accessible itinerary (cached) with QR boarding-pass and e-voucher storage.
*   Trip sharing: invite a companion to view (read-only) a trip itinerary via link.

### 6.8 Price Alerts & Fare Tracking

**\[ READY-TO-PRODUCTION \]**

*   Track a specific route/date or a whole destination; push notification on any fare change.
*   “Drops” feed: daily digest of 20%+ price drops from the user’s home airport.
*   Saved list: bookmark flights/hotels into named trip collections for side-by-side comparison.

### 6.9 Dellics Rewards & Membership Packages

**\[ READY-TO-PRODUCTION \]**

*   Points earned on every completed booking, redeemable as trip credit.
*   Tiered membership packages (Section 7) unlocking lounge partners, priority support, and bonus points.
*   Referral program: both parties earn credit when a referred friend completes their first booking.
*   **Instant perks at checkout** (Booking.com Genius pattern) — not points-earned-over-time, but immediate discounts and benefits.

### 6.10 Payments & Checkout

**\[ READY-TO-PRODUCTION \]**

*   Stripe-powered checkout: cards, Apple Pay, Google Pay, and (Phase 2) mobile money via Stripe-supported local rails.
*   Single checkout for multi-supplier packages using one PaymentIntent with itemized receipt.
*   Saved payment methods (Stripe Customer + SetupIntent) for one-tap repeat booking.
*   Automatic refunds routed through Stripe Refunds API according to each supplier’s cancellation policy.

### 6.11 Notifications

**\[ READY-TO-PRODUCTION \]**

*   Push (FCM): booking confirmations, price alerts, flight status, check-in reminders.
*   Email (transactional): itinerary, receipts, cancellation/refund confirmations.
*   In-app notification center with read/unread state.

### 6.12 Reviews & Ratings

**\[ PHASE 2 \]**

*   Post-stay review prompts for hotels and activities, with photo upload.
*   **Verified-stay badge** shown only for travelers who booked through Dellics — Booking.com pattern.
*   Category sub-scores: cleanliness, location, service, value, comfort, facilities.

### 6.13 Multi-Language & Multi-Currency

**\[ READY-TO-PRODUCTION \]**

*   English at launch; i18n-ready architecture (i18next) for French and further West African markets in Phase 2.
*   Multi-currency display (GHS, USD, EUR, GBP, NGN) with live FX rates cached hourly; charge currency matches Stripe settlement currency.

### 6.14 Customer Support

**\[ READY-TO-PRODUCTION \]**

*   In-app live chat routed to Support Agents, with booking context auto-attached.
*   Help Center with searchable FAQs and self-serve cancellation/refund flow.
*   24/7 support badge with defined SLA tiers by membership package (Section 7).

### 6.15 Account & Profile

**\[ READY-TO-PRODUCTION \]**

*   Email/phone + social sign-in (Google, Apple) via Supabase Auth.
*   Traveler profile: passport/ID info for faster checkout (encrypted at rest), saved travelers for group bookings.
*   Preference center: seat, meal, hotel amenity, and notification preferences.

### 6.16 Price Prediction, Price Graph & Price Freeze

**\[ READY-TO-PRODUCTION (HEURISTIC) / PHASE 2 (ML) \]**

*   **Explore Map:** interactive world map of live fares from the traveler’s home airport, filterable by trip length and interest (beach, city, nature) — Google Flights pattern.
*   **Date Grid:** calendar matrix of departure × return date combinations, color-coded cheapest to most expensive.
*   **Price Graph:** fare-trend chart for a fixed route over the surrounding weeks/months, with a low / typical / high indicator versus recent history.
*   **Book-now-vs-wait guidance:** at MVP, a rule-based heuristic compares the current fare to its own 90-day cached price history; a full ML prediction model (Hopper pattern) is a Phase 2 upgrade on the same data.
*   **Price Freeze (Phase 2):** pay a small fee to lock a fare for up to 14 days, implemented as a separate Stripe PaymentIntent tied to a FareFreeze record with an expiry.

### 6.17 Vacation Rentals & Homestays

**\[ PHASE 2 \]**

*   Homestay/vacation-rental inventory (entire homes, private rooms) alongside hotels in the same Hotels search tab, sourced from a vacation-rental aggregator API.
*   Host-provided photo gallery, amenity checklist, and house rules shown before booking (Airbnb/Vrbo/Booking.com pattern).
*   Instant Book vs Request-to-Book distinction, with a host response-time badge.
*   Guest–host in-app messaging thread scoped to a single reservation.

### 6.18 Multi-Modal & Ground Transport Search

**\[ PHASE 2 \]**

*   On applicable routes, search results show train, bus, and ferry options alongside flights with total door-to-door time and price (Rome2Rio pattern).
*   Single map view visualizing each leg of a multi-modal journey.

### 6.19 Peer-to-Peer Car Sharing

**\[ PHASE 3 \]**

*   Host-listed vehicle marketplace as an alternative to counter car rentals (Turo pattern), with airport delivery options and per-trip insurance add-ons.

### 6.20 Deals, Urgency & Merchandising

**\[ READY-TO-PRODUCTION \]**

*   **Live scarcity indicators** on result cards — “only 2 rooms left”, “booked 12 times today” — driven directly from real supplier availability counts, never fabricated (Booking.com/Agoda pattern).
*   **Countdown timers** on time-boxed promotional fares/rates.
*   **Home-screen deals carousel** merchandising curated packages and last-minute price drops.
*   **“In high demand”** and **“Last chance”** badges for properties with high view-to-booking ratios — Booking.com pattern.

### 6.21 Community Reviews & Travel Q&A

**\[ PHASE 2 \]**

*   Category sub-scores (location, service, value, cleanliness) alongside the overall rating, not just a single star average (Booking.com/TripAdvisor pattern).
*   “Travelers’ Choice” style badges awarded algorithmically to top-rated properties/activities per destination.
*   Destination Q&A threads where travelers can answer other travelers’ questions ahead of booking.
*   Builds on the core Reviews & Ratings module in Section 6.12.

### 6.22 Cross-Platform Price Comparison

**\[ PHASE 3 \]**

*   For hotel results, an optional panel showing the same property’s rate across partner OTAs side by side, reinforcing Dellics as the trustworthy starting point for research even before booking (TripAdvisor pattern).

7\. Dellics Membership Packages
-------------------------------

Inspired by Booking.com’s Genius program and Expedia One Key, Dellics packages combine a free points program with two paid subscription tiers that bundle travel perks — distinct from trip packages (Section 6.4), which bundle flight+hotel for a single trip.

| **Package** | **Price** | **Key Benefits** |
| --- | --- | --- |
| **Dellics Explorer** (Free) | GHS 0 | Earn 1 point/GHS 1 spent · Standard support · Price alerts · Saved trips |
| **Dellics Voyager** | GHS 60/mo or GHS 600/yr | 1.5x points · Free cancellation on select fares · Priority support queue · 2 free seat-selection credits/mo · Member-only discounts at checkout |
| **Dellics Elite** | GHS 150/mo or GHS 1,500/yr | 2.5x points · Airport lounge access (2 visits/yr via partner network) · 24/7 VIP support line · Free date-change on flights · Annual travel credit (GHS 200) · Secret Deals access |

**Implementation note**  
Membership packages are recurring Stripe Subscriptions (Stripe Billing) on the Traveler’s Stripe Customer object, independent from one-off trip-package PaymentIntents used for bookings. Tier is stored on the user record and checked server-side (never client-side) before applying perks such as fee waivers or bonus points.

8\. Phased Delivery Roadmap
---------------------------

| **Phase** | **Timeline** | **Delivers** |
| --- | --- | --- |
| **MVP (Ready-to-Production)** | Launch | Search & Discovery, Flights, Hotels, Packages, Trip Planner, Price Alerts, Explore Map/Date Grid/Price Graph, heuristic Price Prediction, Deals & Urgency merchandising, Rewards + Membership, Stripe Payments, Notifications, i18n foundation, Support |
| **Phase 2** | Post-launch +3–6 months | Car Rentals, Activities & Tours, Vacation Rentals/Homestays, Multi-Modal Transport Search, ML-based Price Prediction + Price Freeze, Reviews & Ratings with Community Q&A, Mobile Money via Stripe local rails, French localization |
| **Phase 3** | +6–12 months | Trip boards (collaborative planning), Peer-to-Peer Car Sharing, Cross-Platform Price Comparison, AI itinerary suggestions, direct airline NDC contracts, loyalty partner network expansion |

9\. Complete Technology Stack
-----------------------------

Selected from the organization’s reference architecture library for a mobile-first, production-ready travel platform. Choices favor React/TypeScript continuity with Dellics’s other products, managed/serverless services for fast time-to-market, and free/low-tier eligibility with clear upgrade triggers.

### 9.1 Mobile & Web Frontend

| **Layer** | **Technology** | **Why** |
| --- | --- | --- |
| Mobile app | React Native + Expo | Single codebase for iOS/Android; native camera/GPS/push access for boarding passes & location search |
| State management | Zustand + TanStack Query | Lightweight client state; TanStack Query handles server-state caching for search results |
| Companion web app | Next.js 15 (App Router) + TypeScript | SEO-friendly marketing/search pages; shares API and design tokens with mobile |
| Styling | Tailwind CSS + shadcn/ui (web), NativeWind (mobile) | Consistent design tokens across web and native from one Tailwind config |
| Forms & validation | React Hook Form + Zod | Shared validation schemas between mobile checkout forms and backend API |
| Maps | Mapbox GL / React Native Mapbox | Branded, styleable maps for hotel/activity discovery |

### 9.2 Backend

| **Layer** | **Technology** | **Why** |
| --- | --- | --- |
| API framework | NestJS (Node.js, TypeScript) | Modular, enterprise-grade structure for booking, payments, rewards, and admin domains |
| Database | PostgreSQL 16 via Supabase | ACID guarantees for bookings/payments; Row-Level Security for traveler data isolation |
| ORM | Prisma | Type-safe queries and versioned migrations shared across services |
| Cache / rate limiting | Upstash Redis | Search-result caching, price-alert de-duplication, API rate limiting |
| Background jobs | BullMQ (Redis-based) | Price-alert polling, itinerary email generation, fare-cache refresh |
| Scheduled tasks | Upstash QStash | Cron-style jobs: nightly FX rate refresh, membership renewal checks |
| Search | Typesense | Typo-tolerant destination/hotel/activity search-as-you-type |
| Travel content aggregation | Duffel API (flights), RateHawk / Amadeus (hotels) | Production-ready supplier aggregation without direct airline/hotel contracts at launch |
| Vacation rentals (Phase 2) | RateHawk homestay inventory / dedicated vacation-rental API | Adds Airbnb/Vrbo-style listings into the same Hotels search tab |
| Price intelligence | Rule-based heuristic on cached fare history (MVP) → Python FastAPI + scikit-learn microservice (Phase 2) | Powers Explore Map, Price Graph, and book-now-vs-wait guidance without ML infra at launch |

### 9.3 Payments, Media, Auth & Notifications

| **Layer** | **Technology** | **Why** |
| --- | --- | --- |
| Payments | Stripe (Payment Intents, Billing, Connect-ready) | Cards, Apple/Google Pay, subscriptions for membership packages, strong webhook reconciliation |
| Auth | Supabase Auth (email/phone + Google/Apple OAuth) | Row-Level Security ties directly to auth.uid(); consistent with Dellics’s other products |
| Media storage | Cloudinary | Hotel/activity images, user-uploaded review photos, on-the-fly resizing for mobile |
| Transactional email | Resend | Itinerary, receipt, and refund emails with React Email templates |
| Push notifications | Firebase Cloud Messaging | Cross-platform push for price alerts and flight status |
| Bot & abuse protection | Arcjet | Protects search and auth endpoints from scraping/credential stuffing |

### 9.4 Infrastructure, DevOps & Monitoring

| **Layer** | **Technology** | **Why** |
| --- | --- | --- |
| Frontend hosting | Vercel | Zero-config CI/CD and preview deployments for the Next.js web app |
| Backend hosting | Render | Managed NestJS API hosting with autoscaling and free-tier eligibility at launch |
| CI/CD | GitHub Actions | Automated test, lint, and deploy pipelines on every pull request |
| Error tracking | Sentry | Crash reporting for mobile app and backend with release-health tracking |
| Uptime monitoring | Uptime Kuma / Better Stack | Public status page and downtime alerting for booking-critical endpoints |
| Secrets | Doppler | Synced environment variables across dev, staging, and production |

10\. System Architecture
------------------------

High-level component view (textual diagram):  
React Native App (iOS/Android) + Next.js Web App  
  
↓ HTTPS / REST+GraphQL-lite (NestJS)  
  
API Gateway (NestJS) --- Auth guard (Supabase JWT) → Domain Modules:  
  
• Search Module → Typesense + cached supplier results (Redis)  
  
• Booking Module → Duffel (flights) / RateHawk (hotels) → PostgreSQL (order ledger)  
  
• Payments Module → Stripe (PaymentIntents, Billing, Webhooks)  
  
• Rewards Module → PostgreSQL (points ledger) + BullMQ (accrual jobs)  
  
• Notifications Module → FCM (push) + Resend (email)  
  
↓  
  
PostgreSQL (Supabase, RLS-enforced) + Upstash Redis (cache/queues) + Cloudinary (media)

*   **Two-stage reservation pattern** for both flights and hotels: SOFT hold on selection (SERIALIZABLE transaction, short TTL) → HARD confirmation only after a Stripe PaymentIntent succeeds, preventing double-booking under concurrent demand.
*   All supplier calls (Duffel/RateHawk) are wrapped with idempotency keys and retried via BullMQ on transient failure; webhook reconciliation confirms final booking state independent of client connectivity.

11\. Core Data Model
--------------------

| **Entity** | **Key Fields** | **Notes** |
| --- | --- | --- |
| User | id, name, email, phone, role, membership\_tier | RLS: a user can only read/write their own row unless role = admin |
| Trip | id, user\_id, title, start\_date, end\_date | Container for all bookings in one itinerary |
| Booking | id, trip\_id, type (flight/hotel/package/car/activity), status, supplier\_ref | status: held → confirmed → completed / cancelled |
| Payment | id, booking\_id, stripe\_payment\_intent\_id, amount, currency, status | 1:1 with a Stripe PaymentIntent; webhook-driven status updates |
| Membership | id, user\_id, tier, stripe\_subscription\_id, renews\_at | Drives perk checks server-side |
| RewardsLedger | id, user\_id, points\_delta, reason, booking\_id | Append-only ledger; balance is a derived sum |
| PriceAlert | id, user\_id, origin, destination, target\_price, status | Polled by scheduled job; triggers push on match |
| FareHistory | id, route\_or\_property, price, captured\_at | Rolling 90-day cache powering Price Graph and prediction heuristic |
| FareFreeze | id, user\_id, fare\_ref, frozen\_price, stripe\_payment\_intent\_id, expires\_at | Phase 2; separate PaymentIntent from the eventual booking payment |
| Review | id, user\_id, booking\_id, rating, sub\_scores, text, photos | Verified-stay badge requires a completed Booking reference |

12\. Payment Integration — Stripe
---------------------------------

Stripe is the sole payment processor for Dellics Travels, handling both one-off trip bookings and recurring membership subscriptions.

### 12.1 Checkout Flow

1.  Traveler selects flight/hotel/package → backend creates a SOFT hold and a Stripe PaymentIntent scoped to the itemized total (in the traveler’s selected currency).
2.  Mobile app renders Stripe’s PaymentSheet (cards, Apple Pay, Google Pay) — card data never touches Dellics servers (PCI SAQ-A scope).
3.  On PaymentIntent success (client confirmation + server-side webhook confirmation, both required), the booking transitions from held to confirmed and supplier booking is finalized.
4.  On failure or 30-minute hold expiry, the soft hold is released back to inventory automatically via a scheduled job.

### 12.2 Membership Subscriptions

*   Voyager/Elite tiers use Stripe Billing subscriptions tied to the traveler’s Stripe Customer object.
*   Tier changes (upgrade/downgrade/cancel) are driven by Stripe webhooks (customer.subscription.updated/deleted) — never by client-side state — to keep perk eligibility authoritative.

### 12.3 Refunds & Cancellations

*   Refunds are issued via the Stripe Refunds API, amount computed from each supplier’s cancellation policy (full, partial, or non-refundable fare).
*   Elite-tier “free date-change” and Voyager “free cancellation on select fares” perks are enforced server-side against the Membership entity before a refund/change is permitted.

### 12.4 Webhooks Handled

| **Event** | **Action** |
| --- | --- |
| payment\_intent.succeeded | Confirm booking, finalize supplier reservation, send receipt email |
| payment\_intent.payment\_failed | Release soft hold, notify traveler, log failure reason |
| charge.refunded | Update Payment + Booking status, send refund confirmation email |
| customer.subscription.updated | Sync Membership.tier and renews\_at |
| customer.subscription.deleted | Downgrade Membership to Explorer (free tier) |
| invoice.payment\_failed | Trigger dunning email, flag membership as past\_due |

13\. Security & Compliance
--------------------------

*   **PCI DSS scope minimized to SAQ-A:** all card entry happens inside Stripe-hosted PaymentSheet/Elements; Dellics servers never receive raw card data.
*   **Row-Level Security (Supabase)** enforced on every traveler-owned table (Booking, Payment, Trip, RewardsLedger, PriceAlert).
*   **JWT re-verification** on every API request; short-lived access tokens with refresh rotation.
*   **Zod schema validation** on all API boundaries; Helmet + Arcjet on public endpoints (search, auth) to block scraping and credential stuffing.
*   **Passport/ID fields** (Section 6.15) encrypted at rest (application-layer AES-256), decrypted only for supplier submission at booking time.
*   **Stripe webhook signatures** verified on every event; idempotency keys on all supplier and payment API calls to prevent duplicate charges/bookings.

14\. Non-Functional Requirements
--------------------------------

| **Category** | **Requirement** |
| --- | --- |
| Performance | Search results render in under 2.5s on 4G; cached fare data served from Redis where possible |
| Availability | 99.5% uptime target for booking-critical endpoints (search, checkout, payments) |
| Scalability | Stateless NestJS API instances behind Render autoscaling; Postgres connection pooling via Prisma |
| Concurrency safety | SERIALIZABLE isolation on inventory holds to prevent double-booking under simultaneous demand |
| Offline support | Confirmed itineraries cached on-device for offline viewing (boarding passes, e-vouchers) |
| Accessibility | WCAG 2.1 AA target for the companion web app; native accessibility labels on mobile |
| Localization | i18next-ready string architecture from day one, even though only English ships at MVP |

15\. Risk Register (Summary)
----------------------------

| **Risk** | **Impact** | **Mitigation** |
| --- | --- | --- |
| Double-booking under concurrent demand | High | Two-stage soft/hard reservation + SERIALIZABLE transactions (Sec. 10) |
| Payment succeeds but supplier booking fails | High | Webhook-driven reconciliation job auto-refunds and alerts Support if supplier confirmation doesn’t land within SLA |
| Stripe webhook downtime/delay | Medium | Booking remains ‘held’ with polling fallback via Stripe API until webhook catches up |
| Fare/rate change between search and checkout | Medium | Re-price confirmation step shown before final payment if supplier price has moved |
| Membership perk abuse (shared accounts) | Low | Perk redemption logged per Booking; anomaly flags reviewed by Ops |
| Currency/FX mismatch at settlement | Medium | Charge currency locked to Stripe settlement currency at PaymentIntent creation, not display currency |

16\. Workflow — End-to-End Operational Flows
--------------------------------------------

These are the step-by-step operational flows that connect every module in Section 6 into a working product.

### 16.1 Onboarding & Authentication

1.  Traveler opens app → browses as Guest (search only, no member pricing).
2.  Traveler taps Sign Up → chooses email/phone or Google/Apple OAuth (Supabase Auth).
3.  On first sign-in, a User row and a free Dellics Explorer Membership row are created automatically.
4.  Traveler completes profile (name, phone, optional passport/ID for faster checkout).
5.  Session issued as a short-lived JWT + refresh token; RLS policies now scope all reads/writes to this user.

### 16.2 Flight Search & Booking

1.  Traveler enters origin/destination/dates (or taps Inspire Me for Everywhere search).
2.  Search Module queries Duffel aggregator API; results cached in Redis for repeat queries within the search session.
3.  Traveler filters/sorts, selects a fare → Booking Module creates a SOFT hold (30-min TTL) and a Stripe PaymentIntent.
4.  Traveler completes Stripe PaymentSheet (card/Apple Pay/Google Pay).
5.  On payment\_intent.succeeded webhook: Booking Module finalizes the reservation with Duffel, Booking status → confirmed.
6.  Confirmation push + email sent; booking appears in the traveler’s Trip Planner timeline.
7.  If payment fails or the 30-min hold expires first, the hold auto-releases and inventory returns to the pool.

### 16.3 Package (Flight + Hotel Bundle) Booking

1.  Traveler selects a flight, then is prompted ‘Add a hotel and save’ for matching dates/destination.
2.  Packaging engine reprices the combination, applying the bundle discount to a single order total.
3.  Optionally the traveler adds a Car Rental (Phase 2) or Activity (Phase 2) to the same package before checkout.
4.  A single Stripe PaymentIntent covers the full itemized package; on success, the Booking Module confirms each supplier leg (flight via Duffel, hotel via RateHawk) with independent idempotency keys.
5.  If one supplier leg fails after payment succeeds, the reconciliation job automatically refunds the failed leg’s portion and notifies the traveler and Support Agent — the succeeded leg(s) remain booked.
6.  A single confirmation and itinerary entry is generated for the whole package.

### 16.4 Membership Package Upgrade

1.  Traveler opens Dellics Rewards → compares Explorer / Voyager / Elite → selects a paid tier.
2.  Backend creates/updates a Stripe Subscription on the traveler’s Stripe Customer object.
3.  On customer.subscription.updated webhook, the Membership row’s tier and renews\_at are updated.
4.  Perks (bonus points multiplier, free cancellation, lounge access) become active immediately and are checked server-side on every relevant booking/refund action.
5.  On renewal failure (invoice.payment\_failed), traveler is notified and given a grace period before automatic downgrade to Explorer.

### 16.5 Price Alert & Fare Tracking

1.  Traveler sets a Price Alert on a route/date or saves a search to a named trip collection.
2.  A scheduled BullMQ job polls the aggregator API for tracked routes on an interval.
3.  When the fare drops (or crosses the traveler’s target price), a push notification and in-app alert are triggered.
4.  Tapping the alert deep-links directly into a pre-filled search/checkout flow for that fare.

### 16.6 Explore, Price Prediction & Price Freeze

1.  Traveler opens Explore Map → enters home airport only → map renders live fares to ranked destinations.
2.  Selecting a destination shows the Date Grid (cheapest date combinations) and Price Graph (fare trend for the route).
3.  The Price Intelligence service compares the current fare to its 90-day FareHistory cache and returns a Buy Now / Wait signal.
4.  If the traveler isn’t ready to book, they may (Phase 2) pay a small fee to Price Freeze the fare — a FareFreeze record and its own Stripe PaymentIntent are created with a 14-day expiry.
5.  Booking within the freeze window honors the frozen price; on expiry, the FareFreeze simply lapses with no further charge.

### 16.7 Cancellation & Refund

1.  Traveler opens a booking in Trip Planner → taps Cancel/Change.
2.  System checks the fare’s cancellation policy and the traveler’s Membership perks (e.g. Voyager free cancellation on select fares).
3.  If eligible, the refund amount is computed and issued via the Stripe Refunds API; Booking status → cancelled.
4.  If not eligible for self-serve cancellation, the request routes to a Support Agent queue with full booking context attached.
5.  Refund confirmation email and push notification sent on charge.refunded webhook.

### 16.8 Post-Booking Trip Management

1.  All confirmed bookings for overlapping dates/destination auto-group into a single Trip in the itinerary timeline.
2.  Flight status updates (delay/gate change) push in real time via the airline aggregator’s status webhook.
3.  Boarding passes and hotel vouchers are cached on-device for offline access.
4.  Traveler can share a read-only trip link with a companion, or invite them (Phase 3 Trip Boards) to collaborate.
5.  After trip completion, a review prompt (Phase 2) and Rewards points accrual are triggered automatically.

**Document status**  
This specification is ready to drive MVP development directly: every Ready-to-Production feature in Section 6 has a corresponding data model entity (Section 11), API/webhook contract (Section 12), and operational workflow (Section 16).  
**Dellics Travels** _See the World_  
Tema Community 25, Devtraco Estate, Ghana  
+233 55 205 4174 | info@dellicstravels.com  
Monday – Saturday: 8:00 AM – 6:00 PM GMT  
_Document Version 2.0 | August 2026_