**DELLICS TRAVELS**  
_— See the World —_  
**Mobile App Screen & Navigation Specification**  
Every screen, every button, and how they link together  
Document Version 1.0 | Companion to the Product & Technical Documentation (v3.0)  
Prepared for Dellics Travels | August 2026  
**CONTACT INFORMATION**  
**Dellics Travels** · Tema Community 25, Devtraco Estate, Ghana  
**Phone:** +233 55 205 4174 **Email:** info@dellicstravels.com

**Table of Contents**
=====================

1\. How to Read This Document  
2\. Global Navigation Structure  
3\. Complete Screen Inventory (54 Screens)  
4\. A. Onboarding & Authentication  
5\. B. Home & Global Search  
6\. C. Flights  
7\. D. Hotels  
8\. E. Packages  
9\. F. Checkout & Payment  
10\. G. Trips  
11\. H. eSIM  
12\. I. Explore & Price Alerts  
13\. J. Membership & Rewards  
14\. K. Profile & Settings  
15\. L. Support & Notifications  
16\. End-to-End Navigation Flows

**1\. How to Read This Document**
=================================

This document is the companion navigation and UI-element specification to the Dellics Travels Product & Technical Documentation (v3.0). Where that document defines what the app does, this document defines exactly what appears on each screen and where every button, chip, and link takes the traveler.

*   Every screen has a unique ID (S01–S54) used consistently across this document and can be cross-referenced against the 12 visual mockups in Section 17 of the main documentation.
*   Each screen entry lists its purpose, then a two-column table: the left column is the on-screen element (button, chip, field, icon), the right column is exactly what happens when it's tapped — usually a navigation target written as “SXX — Screen Name.”
*   Modals and bottom sheets (e.g. filters, date pickers) are treated as screens with their own ID, since they have their own elements and navigation, even though they visually overlay the calling screen rather than replacing it.

<table><tbody><tr><td><strong>Reading a navigation target</strong><br>“S14 — Flight Search Results” means tapping that element takes the traveler to the screen registered under ID S14. Use Section 3's Complete Screen Inventory as a quick lookup table for any ID referenced elsewhere in this document.</td></tr></tbody></table>

**2\. Global Navigation Structure**
===================================

**2.1 Persistent Bottom Tab Bar**
---------------------------------

Shown on the five primary landing screens only — hidden on modals, checkout, property detail, and any screen with its own sticky bottom action bar (Reserve, Pay, Continue), consistent with the mockups in Section 17 of the main documentation.

| **Tab** | **Icon** | **Destination** |
| --- | --- | --- |
| Home | House | S08 — Home |
| Explore | Compass | S36 — Explore Map |
| Trips | Suitcase | S28 — My Trips (list) |
| eSIM | SIM card | S32 — eSIM Store |
| Profile | Person | S43 — Profile (main) |

**2.2 Standard Screen Chrome**
------------------------------

*   Back chevron (top-left): present on every non-landing screen; returns to the immediately preceding screen in the navigation stack (not necessarily a fixed screen — it follows however the traveler arrived).
*   Notification bell (top-right): present on Home and Profile; opens S52 — Notification Center.
*   Sticky bottom action bar: used on screens with one dominant next-step action (Reserve, Continue to checkout, Pay) — replaces the tab bar on that screen.

**2.3 Guest Mode Boundaries**
-----------------------------

A traveler who skips Sign Up (S03) can browse S08, S09, S14, S18, S20, S23, S36 freely. The first action requiring an account — Reserve, Continue to checkout, Save, Set a price alert, or opening Trips/eSIM/Profile tabs — redirects to S03 (Sign Up) with the in-progress action preserved and resumed automatically after account creation.

**3\. Complete Screen Inventory**
=================================

All 54 screens across the app, grouped by module, in the order a new user is most likely to encounter them.

### **A. Onboarding & Authentication**

| **ID** | **Screen Name** |
| --- | --- |
| S01 | Splash |
| S02 | Onboarding Carousel |
| S03 | Sign Up |
| S04 | Log In |
| S05 | Forgot Password |
| S06 | OTP Verification |
| S07 | Profile Setup |

### **B. Home & Global Search**

| **ID** | **Screen Name** |
| --- | --- |
| S08 | Home |
| S09 | Inspire Me Results |
| S10 | Date Picker (modal) |
| S11 | Traveler/Guest Picker (modal) |

### **C. Flights**

| **ID** | **Screen Name** |
| --- | --- |
| S14 | Flight Search Results |
| S12 | Flight Filters & Sort (sheet) |
| S15 | Flight Detail & Fare Rules |
| S17 | Seat Selection |
| S16 | Passenger Details Form |

### **D. Hotels**

| **ID** | **Screen Name** |
| --- | --- |
| S18 | Hotel Search Results |
| S13 | Hotel Filters & Sort (sheet) |
| S19 | Hotel Map View |
| S20 | Property Detail |
| S21 | Room Selection |
| S22 | Photo Gallery (full-screen) |

### **E. Packages**

| **ID** | **Screen Name** |
| --- | --- |
| S23 | Package Builder |
| S24 | Add-ons Sheet (Car/Activity/eSIM) |

### **F. Checkout & Payment**

| **ID** | **Screen Name** |
| --- | --- |
| S25 | Checkout |
| S26 | Promo Code Entry (modal) |
| S27 | Booking Confirmation |

### **G. Trips**

| **ID** | **Screen Name** |
| --- | --- |
| S28 | My Trips (list) |
| S29 | Trip Detail / Itinerary |
| S30 | Boarding Pass / E-Voucher Viewer |
| S31 | Share Trip (modal) |

### **H. eSIM**

| **ID** | **Screen Name** |
| --- | --- |
| S32 | eSIM Store |
| S33 | eSIM Plan Detail |
| S34 | eSIM Activation / QR |
| S35 | My eSIMs (list) |

### **I. Explore & Price Alerts**

| **ID** | **Screen Name** |
| --- | --- |
| S36 | Explore Map |
| S37 | Set Price Alert (modal) |
| S38 | My Price Alerts (list) |
| S39 | Saved List / Favorites |

### **J. Membership & Rewards**

| **ID** | **Screen Name** |
| --- | --- |
| S40 | Membership Benefits |
| S41 | Rewards & Points History |
| S42 | Referral Program |

### **K. Profile & Settings**

| **ID** | **Screen Name** |
| --- | --- |
| S43 | Profile (main) |
| S44 | Edit Profile |
| S45 | Payment Methods (list) |
| S46 | Add Payment Method |
| S47 | Passport & ID |
| S48 | Language & Currency |
| S49 | Notification Preferences |
| S54 | Log Out Confirmation |

### **L. Support & Notifications**

| **ID** | **Screen Name** |
| --- | --- |
| S50 | Help Center / FAQ |
| S51 | Live Chat Support |
| S52 | Notification Center |
| S53 | Write a Review |

**4\. A. Onboarding & Authentication**
======================================

**S01 — Splash**
----------------

First screen on cold app launch; shows the Dellics brand mark while the app checks for an existing session.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Auto-advance (no session found) | S02 — Onboarding Carousel |
| Auto-advance (valid session found) | S08 — Home |

**S02 — Onboarding Carousel**
-----------------------------

3-slide brand/value carousel shown only on first install.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Skip (top-right text link) | S08 — Home as Guest |
| Dot pagination (swipe) | Advances slide 1 → 2 → 3 |
| Get Started (primary button, final slide) | S03 — Sign Up |
| Log In (secondary text link, final slide) | S04 — Log In |

**S03 — Sign Up**
-----------------

Account creation — email/phone or social sign-in.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Continue with Google | Google OAuth → S07 — Profile Setup (first time) or S08 — Home |
| Continue with Apple | Apple OAuth → S07 — Profile Setup (first time) or S08 — Home |
| Email address field + Continue | S06 — OTP Verification (email OTP) |
| Phone number field + Continue | S06 — OTP Verification (SMS OTP) |
| Already have an account? Log In (text link) | S04 — Log In |
| Back (top-left chevron) | S02 — Onboarding Carousel |

**S04 — Log In**
----------------

Returning-user sign-in.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Email/phone field + password field | Validates and routes to S08 — Home |
| Continue with Google / Apple | OAuth → S08 — Home |
| Forgot password? (text link) | S05 — Forgot Password |
| Sign Up (text link) | S03 — Sign Up |
| Continue as Guest (text link) | S08 — Home (guest mode, browse-only) |

**S05 — Forgot Password**
-------------------------

Password reset request.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Email/phone field + Send Reset Link | S06 — OTP Verification (reset OTP) |
| Back to Log In (text link) | S04 — Log In |

**S06 — OTP Verification**
--------------------------

6-digit code confirmation, reused for sign-up, login recovery, and sensitive profile changes.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| 6-digit code input | Auto-submits on 6th digit |
| Resend code (text link, 30s cooldown timer) | Re-sends code, resets timer |
| Verify (primary button) | New account → S07 — Profile Setup; password reset → new-password form; existing login → S08 — Home |
| Back (top-left chevron) | Returns to the screen that triggered verification |

**S07 — Profile Setup**
-----------------------

One-time setup for a new account: name, phone, travel preferences.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Full name field | — |
| Phone number field | — |
| Home airport / city field | Pre-fills future search origin |
| Preferred currency selector | — |
| Notification opt-in toggle | — |
| Continue (primary button) | S08 — Home |
| Skip for now (text link) | S08 — Home with defaults |

**5\. B. Home & Global Search**
===============================

**S08 — Home**
--------------

Primary landing screen after login/splash; hosts the unified search bar, deals, and trending content. Anchors the persistent bottom tab bar.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Bottom tab: Home | Stays on S08 — Home |
| Bottom tab: Explore | S36 — Explore Map |
| Bottom tab: Trips | S28 — My Trips (list) |
| Bottom tab: eSIM | S32 — eSIM Store |
| Bottom tab: Profile | S43 — Profile (main) |
| Avatar (top-left) | S43 — Profile (main) |
| Notification bell (top-right) | S52 — Notification Center |
| Membership banner | S40 — Membership Benefits |
| Search type tabs (Flights/Hotels/Packages/Cars/Activities/eSIM) | Switches the search-card fields below; eSIM tab routes directly to S32 — eSIM Store |
| From / To fields | Opens destination picker (in-page); To field's “Anywhere” chip enables Inspire Me mode |
| Date field | S10 — Date Picker (modal) |
| Travelers field | S11 — Traveler/Guest Picker (modal) |
| Search flights/hotels/packages button (primary) | S14 — Flight Search Results / S18 — Hotel Search Results / S23 — Package Builder depending on active tab |
| Inspire Me chip | S09 — Inspire Me Results |
| Deals carousel card (tap) | S20 — Property Detail or S23 — Package Builder depending on deal type |
| See all (Deals) | Full deals list (filtered S18 — Hotel Search Results/S23 — Package Builder) |
| Trending destination card (tap) | S18 — Hotel Search Results pre-filtered to that destination |

**S09 — Inspire Me Results**
----------------------------

Results of an origin-only “Inspire Me” search — ranked destinations by price (Skyscanner Everywhere pattern).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Back (top-left chevron) | S08 — Home |
| Interest filter chips (Beach/City/Nature/Budget) | Refilters the ranked list |
| Destination card (tap) | S14 — Flight Search Results pre-filled to that destination |
| Explore on map (link) | S36 — Explore Map |

**S10 — Date Picker (modal)**
-----------------------------

Shared date-range picker modal used by every search flow.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Calendar grid (tap dates) | Sets start/end date, returns to caller screen |
| Whole month toggle | Shows the Date Grid heat-map (Sec. 6.16 pattern) |
| Done (primary button) | Returns to the search card with dates applied |

**S11 — Traveler/Guest Picker (modal)**
---------------------------------------

Shared traveler-count / room-count picker modal.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Adults / Children steppers | — |
| Rooms stepper (hotel context only) | — |
| Done (primary button) | Returns to caller screen with counts applied |

**6\. C. Flights**
==================

**S14 — Flight Search Results**
-------------------------------

Ranked/filterable flight results for a searched route.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Back (top-left chevron) | S08 — Home |
| Heart / Save icon (top-right) | Adds route to S39 — Saved List / Favorites |
| Price-trend banner | Informational — deep-links to S36 — Explore Map for full Price Graph |
| Sort chips (Cheapest/Fastest/Best/Nonstop/Free bags) | Reorders the list in place |
| Filter icon | S12 — Flight Filters & Sort (sheet) |
| Flight result card (tap) | S15 — Flight Detail & Fare Rules |

**S12 — Flight Filters & Sort (sheet)**
---------------------------------------

Bottom-sheet filter panel for flight results.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Stops / Airline / Duration / Cabin class controls | — |
| Clear all (text link) | Resets filters |
| Show N results (primary button) | Applies filters, returns to S14 — Flight Search Results |

**S15 — Flight Detail & Fare Rules**
------------------------------------

Full fare details for a selected flight: baggage, fare rules, seat map preview.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Back (top-left chevron) | S14 — Flight Search Results |
| Fare class selector (Economy/Premium/Business tabs) | Updates displayed price and rules |
| Select seats (optional, text link) | S17 — Seat Selection |
| Continue (primary sticky button) | S16 — Passenger Details Form |

**S17 — Seat Selection**
------------------------

Optional interactive seat map for the selected flight.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Seat grid (tap a seat) | Assigns seat, updates running total |
| Skip seat selection (text link) | S16 — Passenger Details Form with no seat assigned |
| Confirm seat (primary button) | S16 — Passenger Details Form |

**S16 — Passenger Details Form**
--------------------------------

Traveler details required for the booking (per passenger).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Full name / DOB / passport fields (repeats per traveler) | — |
| Use saved traveler (text link) | Autofills from saved profile |
| Add another traveler (text link) | Adds a repeat field block |
| Continue (primary sticky button) | S25 — Checkout (flight-only) or back into S23 — Package Builder if building a package |

**7\. D. Hotels**
=================

**S18 — Hotel Search Results**
------------------------------

Ranked/filterable property results for a searched destination and date range.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Back (top-left chevron) | S08 — Home |
| Map icon (top-right) | S19 — Hotel Map View |
| Sort/filter chips (Free cancellation/Price/Star rating/Breakfast/Pool) | Reorders/refilters list in place |
| Filter icon (more filters) | S13 — Hotel Filters & Sort (sheet) |
| Heart / Save icon on a card | Adds property to S39 — Saved List / Favorites |
| Property card (tap) | S20 — Property Detail |

**S13 — Hotel Filters & Sort (sheet)**
--------------------------------------

Bottom-sheet filter panel for hotel results.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Price range slider | — |
| Star rating checkboxes | — |
| Amenities checkboxes (WiFi/Pool/Breakfast/Parking…) | — |
| Clear all (text link) | Resets filters |
| Show N results (primary button) | Applies filters, returns to S18 — Hotel Search Results |

**S19 — Hotel Map View**
------------------------

Map view of hotel results with price-per-night pins, alternative to the list view.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Back (top-left chevron) | S18 — Hotel Search Results |
| List icon (toggle back to list) | S18 — Hotel Search Results |
| Price pin (tap) | Opens a mini property preview card |
| Mini preview card (tap) | S20 — Property Detail |

**S20 — Property Detail**
-------------------------

Full property page: gallery, guest-rating breakdown, amenities, room options.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Back (top-left chevron) | S18 — Hotel Search Results |
| Heart / Save icon | Adds property to S39 — Saved List / Favorites |
| Photo strip (tap) | S22 — Photo Gallery (full-screen) |
| Guest rating breakdown card | Informational (Sec. 6.21 sub-scores) |
| Amenities grid | Informational |
| Room type card (tap) | S21 — Room Selection |
| Reserve (primary sticky button) | S21 — Room Selection if no room chosen yet, else S25 — Checkout |

**S21 — Room Selection**
------------------------

Room-type comparison and selection for the chosen property.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Room card (tap to expand) | Shows per-night breakdown and cancellation policy |
| Select room (primary button per card) | S25 — Checkout (hotel-only) or back into S23 — Package Builder if building a package |

**S22 — Photo Gallery (full-screen)**
-------------------------------------

Full-screen swipeable photo gallery for a property.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Swipe / dot pagination | Advances photos |
| Close (X, top-right) | S20 — Property Detail |

**8\. E. Packages**
===================

**S23 — Package Builder**
-------------------------

Live flight + hotel (+ car/activity/eSIM) bundle summary with running savings total.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Back (top-left chevron) | S08 — Home |
| Flight line item (tap) | S15 — Flight Detail & Fare Rules to change flight |
| Hotel line item (tap) | S20 — Property Detail to change hotel |
| Add a car (chip) | S24 — Add-ons Sheet (Car/Activity/eSIM) |
| Add activities (chip) | S24 — Add-ons Sheet (Car/Activity/eSIM) |
| Add eSIM (chip) | S24 — Add-ons Sheet (Car/Activity/eSIM) |
| Continue to checkout (primary sticky button) | S25 — Checkout |

**S24 — Add-ons Sheet (Car/Activity/eSIM)**
-------------------------------------------

Bottom-sheet upsell for adding a car rental, activity, or eSIM plan to the package in progress.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Car rental option card | Adds to bundle, returns to S23 — Package Builder |
| Activity option card | Adds to bundle, returns to S23 — Package Builder |
| eSIM plan option card | Adds to bundle, returns to S23 — Package Builder |
| Not now (text link) | S23 — Package Builder unchanged |

**9\. F. Checkout & Payment**
=============================

**S25 — Checkout**
------------------

Single checkout for a flight, hotel, package, or eSIM order — Stripe PaymentSheet.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Back (top-left chevron) | Returns to the booking flow screen that led here |
| Traveler details fields | — |
| Pay / G Pay quick-pay buttons | Launches native Apple Pay / Google Pay sheet |
| Saved card row (tap to select) | Sets active payment method |
| Add new card (text link) | S46 — Add Payment Method |
| Have a promo code? (chip) | S26 — Promo Code Entry (modal) |
| Pay GHS \[total\] (primary sticky button) | Submits Stripe PaymentIntent → S27 — Booking Confirmation on success, inline error state on failure |

**S26 — Promo Code Entry (modal)**
----------------------------------

Promo/discount code entry modal.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Code input field | — |
| Apply (primary button) | Validates code, returns to S25 — Checkout with discount applied or an inline error |

**S27 — Booking Confirmation**
------------------------------

Post-payment confirmation screen.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| View itinerary (primary button) | S29 — Trip Detail / Itinerary |
| Add eSIM for this trip (chip, shown if not already purchased) | S32 — eSIM Store |
| Back to Home (text link) | S08 — Home |

**10\. G. Trips**
=================

**S28 — My Trips (list)**
-------------------------

List of all trips (upcoming, ongoing, past); the “Trips” bottom-tab landing screen.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Bottom tab bar | Same as Home (Sec. B) |
| Trip card (tap) | S29 — Trip Detail / Itinerary |
| Empty state: Start exploring (primary button, shown with 0 trips) | S08 — Home |

**S29 — Trip Detail / Itinerary**
---------------------------------

Chronological itinerary timeline for one trip, grouping every booking type.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Back (top-left chevron) | S28 — My Trips (list) |
| Share icon (top-right) | S31 — Share Trip (modal) |
| Boarding pass ready banner (tap) | S30 — Boarding Pass / E-Voucher Viewer |
| Timeline entry card — flight (tap) | S30 — Boarding Pass / E-Voucher Viewer |
| Timeline entry card — hotel (tap) | Shows check-in details / hotel contact |
| Timeline entry card — activity (tap) | S30 — Boarding Pass / E-Voucher Viewer (e-ticket) |
| Cancel/Change (on an entry's overflow menu) | Cancellation flow per Section 16.8, confirms in-place |

**S30 — Boarding Pass / E-Voucher Viewer**
------------------------------------------

Full-screen boarding pass / hotel voucher / activity e-ticket with QR code, cached for offline access.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Close (X, top-right) | S29 — Trip Detail / Itinerary |
| Add to Apple Wallet / Google Wallet (button) | Exports the pass to the device wallet app |

**S31 — Share Trip (modal)**
----------------------------

Modal to generate and send a read-only trip link to a companion.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Generate link (primary button) | Creates shareable read-only link |
| Share via… (native share sheet) | Opens device share sheet |
| Done (text link) | S29 — Trip Detail / Itinerary |

**11\. H. eSIM**
================

**S32 — eSIM Store**
--------------------

eSIM plan storefront powered by the Airalo Partner API SDK; also the “eSIM” bottom-tab landing screen.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Bottom tab bar | Same as Home (Sec. B) |
| Search icon (top-right) | In-page country search filter |
| Country / Regional / Global pill tabs | Switches plan catalog scope |
| “Your next trip” plan card (tap) | S33 — eSIM Plan Detail |
| Popular destination flag tile (tap) | S32 — eSIM Store filtered to that country's plans |
| Plan card (tap) | S33 — eSIM Plan Detail |

**S33 — eSIM Plan Detail**
--------------------------

Plan details before purchase — data, validity, coverage.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Back (top-left chevron) | S32 — eSIM Store |
| Data/validity variant selector | Updates price |
| How eSIM works (info strip, 3 steps) | Informational |
| Buy this plan (primary sticky button) | S25 — Checkout |

**S34 — eSIM Activation / QR**
------------------------------

Post-purchase QR/LPA activation screen for a provisioned eSIM order.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Back (top-left chevron) | S35 — My eSIMs (list) |
| QR code panel | Scanned by the traveler's device camera/settings — not an in-app tap target |
| Copy manual activation code (button) | Copies LPA string to clipboard |
| Manage this eSIM (secondary sticky button) | S35 — My eSIMs (list) |

**S35 — My eSIMs (list)**
-------------------------

List of all eSIM orders (pending, active, expired) for the account.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| eSIM order card (tap) | S34 — eSIM Activation / QR |
| Buy another eSIM (primary button) | S32 — eSIM Store |

**12\. I. Explore & Price Alerts**
==================================

**S36 — Explore Map**
---------------------

Explore Map + Date Grid + Price Graph; the “Explore” bottom-tab landing screen.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Bottom tab bar | Same as Home (Sec. B) |
| Filter icon (top-right) | Interest/trip-length filter sheet |
| Destination price pin (tap) | S14 — Flight Search Results pre-filled to that destination |
| Date-grid day chip (tap) | Updates the Price Graph card below for that date |
| Set a price alert for this route (primary button) | S37 — Set Price Alert (modal) |

**S37 — Set Price Alert (modal)**
---------------------------------

Modal to create a price alert for a route or destination.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Target price field (optional) | — |
| Notify me toggle | — |
| Create alert (primary button) | Saves alert, returns to S36 — Explore Map with confirmation toast |

**S38 — My Price Alerts (list)**
--------------------------------

List of all active price alerts, reachable from Profile.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Alert row (tap) | S14 — Flight Search Results pre-filled to that route |
| Delete (swipe action) | Removes the alert |

**S39 — Saved List / Favorites**
--------------------------------

Saved/favorited flights and properties, grouped into named collections.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Collection tab (e.g. “Dubai trip”) | Filters the saved list |
| Saved item card (tap) | S15 — Flight Detail & Fare Rules or S20 — Property Detail depending on item type |
| Remove (heart icon toggle) | Removes from saved list |

**13\. J. Membership & Rewards**
================================

**S40 — Membership Benefits**
-----------------------------

Side-by-side comparison of Explorer / Voyager / Elite membership packages (Section 7).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Back (top-left chevron) | S43 — Profile (main) or S08 — Home depending on entry point |
| Tier card — Upgrade (primary button per paid tier) | S25 — Checkout (Stripe subscription checkout) |
| Manage subscription (text link, shown if already subscribed) | Opens Stripe customer portal |

**S41 — Rewards & Points History**
----------------------------------

Points balance and full earn/redeem history.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Back (top-left chevron) | S43 — Profile (main) |
| Redeem points (primary button) | Applies available points as trip credit at next S25 — Checkout |
| History row | Informational (read-only ledger entry) |

**S42 — Referral Program**
--------------------------

Referral program — invite link and reward status.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Copy invite link (button) | Copies referral link to clipboard |
| Share via… (native share sheet) | Opens device share sheet |
| Referral status row | Informational |

**14\. K. Profile & Settings**
==============================

**S43 — Profile (main)**
------------------------

Account hub; the “Profile” bottom-tab landing screen.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Bottom tab bar | Same as Home (Sec. B) |
| Notification bell (top-right) | S52 — Notification Center |
| Membership banner — View membership benefits | S40 — Membership Benefits |
| Menu row — Saved trips | S39 — Saved List / Favorites |
| Menu row — Payment methods | S45 — Payment Methods (list) |
| Menu row — My eSIMs | S35 — My eSIMs (list) |
| Menu row — Price alerts | S38 — My Price Alerts (list) |
| Menu row — Passport & ID | S47 — Passport & ID |
| Menu row — Language & currency | S48 — Language & Currency |
| Menu row — Notification preferences | S49 — Notification Preferences |
| Menu row — Help Center | S50 — Help Center / FAQ |
| Menu row — Rewards & points | S41 — Rewards & Points History |
| Menu row — Invite friends | S42 — Referral Program |
| Avatar / name (tap) | S44 — Edit Profile |
| Log out (text link) | S54 — Log Out Confirmation |

**S44 — Edit Profile**
----------------------

Edit personal profile details.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Name / email / phone fields | — |
| Change photo (button) | Opens device photo picker |
| Save changes (primary sticky button) | S43 — Profile (main) with confirmation toast |

**S45 — Payment Methods (list)**
--------------------------------

Saved Stripe payment methods.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Card row (tap) | Sets as default payment method |
| Remove (swipe action) | Deletes the saved card via Stripe |
| Add payment method (primary button) | S46 — Add Payment Method |

**S46 — Add Payment Method**
----------------------------

Add a new card via Stripe SetupIntent for future one-tap checkout.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Card number / expiry / CVC fields (Stripe Elements) | — |
| Save card (primary sticky button) | S45 — Payment Methods (list) with new card listed |

**S47 — Passport & ID**
-----------------------

Passport/ID details stored (encrypted) for faster checkout and group bookings.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Traveler profile row (tap) | Edit that traveler's saved ID details |
| Add traveler (primary button) | Opens a new blank ID form |
| Save (primary sticky button) | S43 — Profile (main) |

**S48 — Language & Currency**
-----------------------------

Display language and currency preference.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Language option row | Sets app language (Phase 2 languages shown as “Coming soon”) |
| Currency option row (GHS/USD/EUR/GBP/NGN) | Sets display currency across the app |

**S49 — Notification Preferences**
----------------------------------

Per-category push/email notification toggles.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Toggle — Price alerts | — |
| Toggle — Booking updates | — |
| Toggle — Flight status | — |
| Toggle — Promotions & deals | — |

**S54 — Log Out Confirmation**
------------------------------

Confirmation step before signing out of the account.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Cancel (secondary button) | S43 — Profile (main) |
| Log out (primary destructive button) | Clears session → S04 — Log In |

**15\. L. Support & Notifications**
===================================

**S50 — Help Center / FAQ**
---------------------------

Searchable FAQ and self-serve help hub.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Search bar | Filters FAQ articles |
| FAQ category card (tap) | Expands article list for that category |
| Contact support (primary button) | S51 — Live Chat Support |

**S51 — Live Chat Support**
---------------------------

In-app live chat with a Support Agent, auto-attached to the traveler's active booking context.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Message input + Send | Sends message to the support queue |
| Attach booking (chip, pre-filled if opened from a trip) | Links the relevant Booking record for the agent |
| Back (top-left chevron) | Returns to the screen that opened chat |

**S52 — Notification Center**
-----------------------------

Chronological in-app notification inbox (price alerts, booking updates, promos).

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Notification row (tap) | Deep-links to the relevant screen (e.g. a price-drop alert opens S14 — Flight Search Results) |
| Mark all as read (text link) | Clears unread state |

**S53 — Write a Review**
------------------------

Post-stay review composer for a completed hotel or activity booking.

| **Element / Button** | **Action / Navigates To** |
| --- | --- |
| Star rating input + category sub-scores | — |
| Photo upload (button) | Opens device photo picker |
| Review text field | — |
| Submit review (primary sticky button) | S29 — Trip Detail / Itinerary with confirmation toast |

**16\. End-to-End Navigation Flows**
====================================

Full screen-to-screen paths for the journeys that matter most, written as chains of screen IDs. These trace directly through the per-screen tables in Sections 4–15.

### **New Traveler: First Booking (Flight)**

**S01 (Splash) → S02 (Onboarding Carousel) → S03 (Sign Up) → S06 (OTP Verification) → S07 (Profile Setup) → S08 (Home) → S14 (Flight Search Results) → S15 (Flight Detail & Fare Rules) → S16 (Passenger Details Form) → S25 (Checkout) → S27 (Booking Confirmation) → S29 (Trip Detail / Itinerary)**

### **New Traveler: First Booking (Hotel)**

**S08 (Home) → S18 (Hotel Search Results) → S20 (Property Detail) → S21 (Room Selection) → S25 (Checkout) → S27 (Booking Confirmation) → S29 (Trip Detail / Itinerary)**

### **Package (Flight + Hotel) Booking**

**S08 (Home) → S14 (Flight Search Results) → S15 (Flight Detail & Fare Rules) → S16 (Passenger Details Form) → S23 (Package Builder) → S24 (Add-ons Sheet (Car/Activity/eSIM)) → S23 (Package Builder) → S25 (Checkout) → S27 (Booking Confirmation) → S29 (Trip Detail / Itinerary)**

### **eSIM Purchase & Activation**

**S32 (eSIM Store) → S33 (eSIM Plan Detail) → S25 (Checkout) → S27 (Booking Confirmation) → S34 (eSIM Activation / QR) → S35 (My eSIMs (list))**

### **Cross-Sell eSIM from Booking Confirmation**

**S27 (Booking Confirmation) → S32 (eSIM Store) → S33 (eSIM Plan Detail) → S25 (Checkout) → S34 (eSIM Activation / QR)**

### **Undecided Traveler: Everywhere Search**

**S08 (Home) → S09 (Inspire Me Results) → S14 (Flight Search Results) → S15 (Flight Detail & Fare Rules) → S16 (Passenger Details Form) → S25 (Checkout) → S27 (Booking Confirmation)**

### **Setting and Acting on a Price Alert**

**S36 (Explore Map) → S37 (Set Price Alert (modal)) → S52 (Notification Center) → S14 (Flight Search Results) → S25 (Checkout)**

### **Membership Upgrade**

**S43 (Profile (main)) → S40 (Membership Benefits) → S25 (Checkout) → S43 (Profile (main))**

### **Guest Browsing → Forced Sign-Up at Checkout**

**S04 (Continue as Guest) → S08 (Home) → S18 (Hotel Search Results) → S20 (Property Detail) → S21 (Room Selection) → S03 (Sign Up) → S06 (OTP Verification) → S25 (Checkout)**

### **Cancellation & Refund**

**S28 (My Trips (list)) → S29 (Trip Detail / Itinerary) → S51 (Live Chat Support) → S29 (Trip Detail / Itinerary)**

### **Password Recovery**

**S04 (Log In) → S05 (Forgot Password) → S06 (OTP Verification) → S04 (Log In)**

<table><tbody><tr><td><strong>Coverage note</strong><br>Every Ready-to-Production feature module in Section 6 of the main Product &amp; Technical Documentation maps to at least one screen in this specification. Phase 2/3 features (car rentals, activities marketplace, peer-to-peer car sharing, cross-platform price comparison) reuse the same screen patterns (S14/S18-style result lists, S15/S20-style detail pages) and are intentionally not given separate screen IDs until they move into active development.</td></tr></tbody></table>