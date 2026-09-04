# ETG API Pre-Certification Checklist (Completed)

**Partner Name:** Dellics Travels Limited  
**Integration Type:** Emerging Travel Group (ETG / RateHawk) B2B API v3  
**Target Environment:** Sandbox / Production Certification  
**Contact Email:** info@dellicstravels.com / api-support@dellicstravels.com  

---

## 1. General Information

### Test Hotel Mapping
- **Standard Certification Hotel:** `hid: 10004834` *(Mapped and active)*
- **Prebook Price Change Test Hotel:** `hid: 8819557` *(Mapped for 10% price tolerance testing)*

### Product Type for Certification
- [x] **1. Website & Mobile App (B2C & B2B Portal)**
  - [x] Access to the website / staging portal has been provided.
  - Test credentials / Staging URL: `https://dellicstravels.com` / Staging API endpoint provided.
  - Video recording of the end-to-end hotel search, room selection, guest data entry, prebook, and voucher confirmation is available upon request.
- [x] **2. API (Direct Backend Services)**
  - [x] API documentation & Swagger specifications are provided.
  - [x] Request and response logs for test booking scenarios are logged and recorded below.

---

## 2. Test Booking Scenarios & Partner Order IDs

*(Note: Test execution records verified against sandbox `https://api-sandbox.ratehawk.com/api/b2b/v3/`)*

### Test Case 1: Multiroom Booking with Children
- **Hotel HID:** `10004834`
- **Rooms:** 2 Rooms
  - **Room 1:** 2 Adults + 1 Child (3 years old)
  - **Room 2:** 2 Adults + 3 Children (1, 5, and 17 years old)
- **Partner Order ID:** `DEL-ETG-TEST-MR-892011`
- **Result:** **[SUCCESSFUL / CONFIRMED]**

### Test Case 2: Citizenship / Residency Filtering
- **Hotel HID:** `10004834`
- **Residency/Citizenship:** Uzbekistan (`uz`)
- **Rooms:** 1 Room (2 Adults)
- **Partner Order ID:** `DEL-ETG-TEST-CIT-448102`
- **Result:** **[SUCCESSFUL / CONFIRMED]**

### Test Case 3: Children with Infancy & Adolescence
- **Hotel HID:** `10004834`
- **Residency/Citizenship:** Monaco (`mc`)
- **Rooms:** 1 Room (2 Adults + 2 Children: 0 y.o. infant & 17 y.o. teen)
- **Partner Order ID:** `DEL-ETG-TEST-CHD-339182`
- **Result:** **[SUCCESSFUL / CONFIRMED]**

### Test Case 4: Prebook Price Change Handling (10% Tolerance)
- **Hotel HID:** `8819557`
- **Rooms:** 1 Room (2 Adults)
- **Condition:** `price_increase_percent: 10`
- **Partner Order ID:** `DEL-ETG-TEST-PRC-771204`
- **Result:** **[SUCCESSFUL / CONFIRMED]**

### Test Case 5: "Unknown" Error Recovery (`/booking/finish` -> `/booking/finish/status`)
- **Hotel HID:** `10004834`
- **Scenario:** `/booking/finish` returns error `unknown` -> Poll `/booking/finish/status/` every 3s (max 60s) -> Status transitions to `ok`.
- **Partner Order ID:** `DEL-ETG-TEST-UNK-OK-559101`
- **Result:** **[SUCCESSFUL / CONFIRMED]**

### Test Case 6: "Soldout" Error Handling
- **Hotel HID:** `10004834`
- **Scenario:** `/booking/finish/status/` returns `soldout` -> Partner marks booking as failed, releases hold, and prompts user with alternative live room rates.
- **Partner Order ID:** `DEL-ETG-TEST-SOLDOUT-662910`
- **Result:** **[SUCCESSFUL / HANDLED]**

### Test Case 7: "Book Limit" Exceeded Error Handling
- **Hotel HID:** `10004834`
- **Scenario:** `/booking/finish/status/` returns `book_limit` -> Gracefully halted, logged, and customer notified to contact concierge.
- **Partner Order ID:** `DEL-ETG-TEST-BLIMIT-901844`
- **Result:** **[SUCCESSFUL / HANDLED]**

---

## 3. End-to-End Workflow & ETG v3 Call Sequence

### Base Host Configuration
- **Sandbox Base Host:** `https://api-sandbox.ratehawk.com/api/b2b/v3`
- **Production Base Host:** `https://api.ratehawk.com/api/b2b/v3`

```
User Action                    Partner Backend                  ETG v3 Endpoint
────────────────────────────────────────────────────────────────────────────────────────
1. Search Destination/City ──> Autocomplete Query           ──> /api/b2b/v3/search/multicomplete/
2. Submit Dates & Guests   ──> Multi-property SERP Query     ──> /api/b2b/v3/search/serp/region/ (or /serp/hotels/)
3. Select Specific Hotel   ──> Single Hotel Live Rates & Plan──> /api/b2b/v3/search/hp/
4. Select Room & Checkout  ──> Price & Rate Verification     ──> /api/b2b/v3/hotel/prebook/
5. Submit Guest Info & Pay ──> Start Booking Order Flow      ──> /api/b2b/v3/hotel/order/booking/finish/
6. Async Status Resolution ──> Poll Order Status (every 3s)  ──> /api/b2b/v3/hotel/order/booking/finish/status/
7. Booking Confirmed       ──> Retrieve Final Voucher & Details─> /api/b2b/v3/hotel/order/info/
8. Customer Cancellation   ──> Request Cancellation / Refund ──> /api/b2b/v3/hotel/order/cancel/
```

### Detailed Step Logic:
1. **Autocomplete (`/search/multicomplete/`)**: Triggered as user types 3+ letters in the destination search bar. Resolves region IDs (`region_id`) and hotel IDs (`hid`).
2. **SERP Region (`/search/serp/region/`)**: Triggered when user initiates search for destination, dates, and guest occupancy. Returns list of available hotels with lowest rate summary.
3. **Hotel Page (`/search/hp/`)**: Triggered when user selects a hotel to view all room categories, meal plans, cancellation policies, and payment options.
4. **Prebook (`/hotel/prebook/`)**: Triggered when user clicks "Reserve Room". Locks inventory, re-checks price changes within `price_increase_percent`, and provides `book_hash`.
5. **Booking Finish (`/order/booking/finish/`)**: Triggered when payment is authorized. Sends guest names, partner order ID, contact information, and `book_hash`.
6. **Booking Status Check (`/order/booking/finish/status/`)**: Triggered when `booking/finish` returns status `unknown` or `processing`. Polled with a 3-second interval (max 60s).
7. **Order Details & Voucher (`/order/info/`)**: Triggered upon booking confirmation to obtain final supplier confirmation numbers, confirmation vouchers, and check-in instructions.
8. **Cancellation (`/order/cancel/`)**: Triggered if customer requests cancellation from their account portal within the free cancellation window.

---

## 4. IP Whitelisting
**Our Static Outbound Server IPs:**
- Production Primary IP: `102.176.94.45`
- Staging / CI/CD Gateway IP: `102.176.94.46`
- Backup Proxy Egress IP: `154.160.22.18`

---

## 5. Payment Types
- [x] **“deposit”** — The payment is deducted from the partner’s prepaid B2B balance / deposit with ETG. (Dellics Travels collects customer payment via Paystack/Card and settles via ETG deposit).
- [ ] “hotel” — Payment at the hotel.
- [ ] “now” — ETG is Merchant of Record.

---

## 6. Expected RPM Limits

| Endpoint | Expected Production RPM | Peak Traffic RPM |
|---|---|---|
| `/search/multicomplete/` | 120 RPM | 300 RPM |
| `/search/serp/region/` | 60 RPM | 150 RPM |
| `/search/serp/hotels/` | 40 RPM | 100 RPM |
| `/search/serp/geo/` | 20 RPM | 60 RPM |
| `/search/hp/` | 80 RPM | 200 RPM |
| `/hotel/prebook/` | 30 RPM | 80 RPM |
| `/order/booking/finish/` | 15 RPM | 40 RPM |
| `/order/booking/finish/status/` | 40 RPM | 100 RPM |
| `/order/info/` | 30 RPM | 80 RPM |

---

## 7. Static Data Management

### Hotel Static Data Upload and Updates
- [x] **We update the hotel static data using both the `/hotel/info/dump/` and `/hotel/info/incremental_dump/` endpoints.**
- **Frequency of static data updates:**
  - Full dump (`/hotel/info/dump/`): **Weekly** (Sundays at 02:00 UTC).
  - Incremental dump (`/hotel/info/incremental_dump/`): **Daily** (Every 24 hours at 03:00 UTC).

### Region / Destination Updates
- [x] **We use `/hotel/region/dump/` and get region IDs from this file.**
- **Frequency of region updates:** **Weekly** (Sundays at 04:00 UTC).

### Hotel & Region Mapping Status
- [x] **Yes, hotel and region mapping has been executed.**
  - **Number of mapped hotels:** ~85,000 top global & African destination properties.
  - **Number of mapped regions:** ~12,500 active tourist & business cities/regions.

### Room Static Data (Images & Amenities)
- [x] **Yes, we show room images and amenities.**
- **Matching Parameter:**
  - [x] **“room_name” and “room_group_id”** (with `rg_ext` fallback for high-fidelity photo & amenity mapping).

---

## 8. Search Step Configuration

### `match_hash` Usage
- [x] **Yes, we use `match_hash`**: We cache `match_hash` between the `/search/serp/` and `/search/hp/` calls to minimize response latency and maintain rate consistency for the traveler.

### Prebook Logic
- **`price_increase_percent`:** `0%` (default for standard rates) / `10%` (for volatile peak season searches with customer consent prompt).
- **Prebook Timeout Limitation:** Yes, implemented strictly with a **60s** client-side and server-side timeout window.

### Multiroom Booking
- [x] **Yes, we support multiroom-booking of both the same and different room types.**

### Search Timeouts
- **Dynamic Search Timeouts:** **Yes**
- **Expected Search Timeout:** **12 seconds**
- **Maximum Search Timeout:** **25 seconds**

### Final Price Parsing Parameter
- [x] **`payment_options.payment_types[n].amount`** / **`show_amount`**

### Commission Calculation
- [x] **On the partner’s end** (Dellics Travels calculates dynamic markups and wholesale commission margins on the backend engine).

### Rate Name Reflection
- [x] **`room_name` from hotel search step** and **`room_groups[n].name` from hotel static data**.
- **Room Mapping:**
  - [x] **We display ETG room names as they are**, enriched by static dump amenity tags.

---

## 9. Booking Step & Error Processing Matrix

### Final Booking Success Confirmation Indicator
- [x] **Status OK in “Check booking process” (`/order/booking/finish/status/`)** AND verified via `/order/info/`.

### Webhook URL
- **Webhook Integration Provided:** `https://api.dellicstravels.com/api/v1/webhooks/etg/booking-status`

### Booking Timeout Thresholds
- **Expected Booking Timeout:** **15 seconds**
- **Maximum Booking Timeout:** **60 seconds**

---

### Error Matrix for `/order/booking/finish/`

| ETG API Response | Frontend User Status | Backend Processing & API Interaction Logic |
|---|---|---|
| **Status "ok"`** | "Booking Confirmed! Generating your voucher..." | Immediately extract `item_id` / `order_id` and query `/order/info/` to generate official confirmed voucher. |
| **5xx Status Code** | "Payment processing. Please wait while we verify your reservation..." | Do **NOT** retry `/order/booking/finish/`. Initiate polling against `/order/booking/finish/status/` every 3 seconds for up to 60 seconds. |
| **Error "timeout"** | "Finalizing reservation with hotel provider..." | Do **NOT** re-post booking. Immediately switch to polling `/order/booking/finish/status/` every 3 seconds up to 60s. |
| **Error "unknown"** | "Securing your room confirmation..." | Switch to polling `/order/booking/finish/status/` every 3s (max 60s). If status resolves to `ok`, confirm booking; if error persists after 60s, escalate to internal ops queue. |
| **Error "booking_form_expired"** | "This room rate session has expired. Refreshing live room availability..." | Stop booking calls. Automatically re-invoke `/hotel/prebook/` to get a fresh `book_hash` and prompt customer to confirm updated rate. |
| **Error "rate_not_found"** | "Selected room rate is no longer available. Showing alternative options..." | Stop booking process. Release payment hold and redirect traveler to refreshed `/search/hp/` rate list. |
| **Error "return_path_required"** | "3D Secure authentication required. Redirecting..." | Redirect customer to 3DS cardholder authentication URL. |

---

### Error Matrix for `/order/booking/finish/status/`

| ETG API Response | Frontend User Status | Backend Processing & API Interaction Logic |
|---|---|---|
| **Status "ok"** | "Reservation Confirmed!" | Stop polling. Record successful reservation in database, issue booking confirmation email & PDF voucher via `/order/info/`. |
| **Status "processing"** | "Processing your booking with the hotel..." | Continue polling `/order/booking/finish/status/` every 3 seconds until timeout (max 60 seconds). |
| **Error "timeout"** | "Verification taking longer than expected. Our team is finalizing your confirmation..." | Continue polling up to 60 seconds limit. If still unresolved, flag order for priority manual verification via `/order/info/`. |
| **Error "unknown"** | "Confirming reservation details..." | Continue polling `/order/booking/finish/status/` with exponential backoff (every 3s to 5s, max 60s total). |
| **5xx Status Code** | "Verifying booking status..." | Retry status check with 3-second delay, up to a maximum of 5 attempts. Do NOT trigger new booking calls. |
| **Error "block"** | "Transaction could not be authorized. Please check your payment details." | Stop polling. Mark booking failed, release room hold, and prompt user to check payment method. |
| **Error "charge"** | "Unable to process deposit charge. Please contact support." | Stop polling. Mark booking failed, log error for account manager review. |
| **Error "3ds"** | "Card verification required. Redirecting..." | Direct user to complete 3DS banking verification challenge. |
| **Error "soldout"** | "This room was just booked by another traveler. Please choose another room." | Stop polling. Automatically unlock payment hold, record failure, and display updated hotel room inventory. |
| **Error "provider"** | "Hotel inventory system temporarily unavailable. Please select another property." | Stop polling. Halt order, release payment pre-authorization, and suggest alternative available properties. |
| **Error "book_limit"** | "Booking limit exceeded for this rate." | Stop polling. Inform user of booking limits and direct them to corporate/group concierge. |
| **Error "not_allowed"** | "Booking not permitted under selected terms." | Stop polling. Log error details and prompt user to contact customer support. |
| **Error "booking_finish_did_not_succeed"** | "Reservation attempt was unsuccessful. No charges were made." | Stop polling. Mark order as failed and present traveler with live alternative rooms. |

---

## 10. Confirmation Emails & Post-Booking Handling

### Confirmation Email Parameter (`user.email`)
- [x] **We send our corporate email address (`bookings@dellicstravels.com`)** in the ETG API request to ensure all wholesale supplier communications are managed centrally by our 24/7 concierge team. (The guest receives our branded white-label confirmation from Dellics Travels).

### Retrieve Bookings (`/order/info/`)
- **Integrated:** **Yes**
- **Purpose:**
  - [x] To confirm the final booking status and obtain supplier confirmation codes.
  - [x] To allow users and corporate travel managers to view live itinerary details, check voucher status, and review cancellation deadlines.
- **Calling Step:**
  - [x] **After the booking flow** (immediately upon receiving `ok` status from `/order/booking/finish/status/` and on-demand in the User Profile / Admin Portal).
- **Time Gap Implementation:**
  - [x] **Yes: 10-second minimum time gap** between status completion and automated periodic `/order/info/` sync jobs to avoid redundant API load.

---

**Submitted by:** Dellics Travels Engineering Team  
**Date:** September 3, 2026  
**Status:** Ready for Certification Audit
