# Airalo Partners API v2 — Integration & Error Handling Guide

**Partner Integration:** Dellics Travels Limited  
**API Version:** Airalo Partners API v2 (`https://partners-api.airalo.com`)  
**Backend Module:** `apps/api/src/esim/`  

---

## 1. Quick Start Workflow

```
Step 1: OAuth2 Token           Step 2: Get Packages            Step 3: Submit Order          Step 4: Installation
POST /v2/token            ──>  GET /v2/packages           ──>  POST /v2/orders          ──>  GET /v2/sims/{iccid}/instructions
(client_credentials grant)     (Filter by country/region)      (Package ID & Quantity)       (iOS & Android localized guide)
```

---

## 2. Authentication & Token Management (Step 1)

- **Endpoint:** `POST https://partners-api.airalo.com/v2/token`
- **Encoding:** `application/x-www-form-urlencoded`
- **Parameters:**
  - `client_id`: Encrypted Partner Client ID (`AIRALO_CLIENT_ID`)
  - `client_secret`: Encrypted Partner Secret (`AIRALO_CLIENT_SECRET`)
  - `grant_type`: `"client_credentials"`
- **Rate Limit:** **3 requests per minute** to obtain access token.
- **Validity & Caching:** Access token is valid for **24 hours** (`expires_in`). The Dellics backend caches this token in-memory and only refreshes when within 5 minutes of expiration.

---

## 3. Comprehensive Error Handling & Status Codes

### HTTP 422 — Validation and Business Logic Errors

| Error Code | Official Reason | Dellics System Handling & Resolution Strategy |
|:---|:---|:---|
| **Code 11** | Insufficient Airalo Credit: `{additional}` | Account balance low. Order is queued for concierge provisioning and admin balance alert is triggered without failing the customer's payment. |
| **Code 13** | The requested operator is currently undergoing maintenance. Please try again later. | Marked as temporary operator downtime; system automatically retries provisioning with a 5-minute backoff. |
| **Code 14** | Invalid checksum: `{additional}` | System purges cached package metadata and re-queries `/v2/packages` to retrieve fresh checksum data. |
| **Code 23** | The requested top-up has been disabled by the operator. `{additional}` | Notifies traveler and suggests ordering a new eSIM profile rather than topping up the disabled profile. |
| **Code 33** | Insufficient stock of eSIMs remaining: `{additional}`. Please try your request again later. | Flags package as temporarily out of stock; presents alternative local or regional packages. |
| **Code 34** | The requested eSIM package is invalid or it is currently out of stock. Please try again later. | Re-syncs destination catalog and hides out-of-stock SKU from the storefront. |
| **Code 43** | Bad request. `{additional}` Please check your input and try again. | Logs validation error payload for backend diagnostics. |
| **Code 53** | Something unexpected happened. We're working to resolve the issue. Please try again later. | Temporary upstream telecom error; automatic retry up to 3 times before manual escalation. |
| **Code 73** | The eSIM with iccid `{additional}` has been recycled. It can no longer be used or topped up. | Blocks subsequent top-up actions on the recycled ICCID and prompts traveler for a new installation. |
| **Code 89** | The calling IP address is not on the allow list. | **Critical Action:** The outbound server IP is not whitelisted. Nothing is revoked — add the server IP (`102.176.94.45` / `102.176.94.46`) to the Airalo Partner Portal allowlist and retry. |

---

### HTTP 4xx Client Errors

| HTTP Code | Official Reason | Dellics System Handling |
|:---|:---|:---|
| **401** | Authentication failed (expired token or invalid credentials). | Automatically clears token cache (`this.cachedAccessToken = null`), acquires a fresh token via `/v2/token`, and retries the request. |
| **429** | Too Many Attempts (Rate Limit). | Respects rate limits; delays outbound requests with exponential backoff. |

---

### HTTP 5xx Server Errors

| HTTP Code | Official Reason | Dellics System Handling |
|:---|:---|:---|
| **500** | Internal Server Error | Circuit breaker activated; retries with exponential backoff. |
| **502** | Bad Gateway | Transient gateway error; automatic retry. |
| **503** | Service Unavailable | Graceful fallback to cached inventory and queued provisioning. |
| **504** | Gateway Timeout | Re-queries order status via ICCID before issuing duplicates. |

---

---

## 4. Notifications & Webhooks Lifecycle

### Opt-In Registration
- **Endpoint:** `POST https://partners-api.airalo.com/v2/notifications/opt-in`
- **Partner Ingress Webhook:** `https://api.dellicstravels.com/webhooks/airalo`
- **Supported Events:**
  - `order.created` / `order.completed`: Order lifecycle confirmations.
  - `sim.installed`: eSIM profile downloaded onto traveler device.
  - `sim.activated`: First cellular network registration / data session started.
  - `sim.exhausted`: Data volume fully consumed.
  - `sim.expired`: Validity window has elapsed.

### Automated Order State Synchronization

```
Airalo Event                    Dellics Backend Action
─────────────────────────────────────────────────────────────────────────────
sim.activated / sim.installed ──> Moves eSIMOrder to status: 'ACTIVE'
sim.exhausted / sim.expired   ──> Moves eSIMOrder to status: 'EXPIRED'
order.completed               ──> Moves eSIMOrder to status: 'PROVISIONED'
```

---

## 5. Implementation Reference

- **Service Module:** [apps/api/src/esim/esim.service.ts](file:///c:/Users/Dell/Desktop/PROjects/Dellics%20Travels/apps/api/src/esim/esim.service.ts)
- **Webhooks Module:** [apps/api/src/webhooks/webhooks.service.ts](file:///c:/Users/Dell/Desktop/PROjects/Dellics%20Travels/apps/api/src/webhooks/webhooks.service.ts) & [webhooks.controller.ts](file:///c:/Users/Dell/Desktop/PROjects/Dellics%20Travels/apps/api/src/webhooks/webhooks.controller.ts)
- **Error Handler:** [apps/api/src/esim/esim-error.handler.ts](file:///c:/Users/Dell/Desktop/PROjects/Dellics%20Travels/apps/api/src/esim/esim-error.handler.ts)
- **Controller Endpoints:** [apps/api/src/esim/esim.controller.ts](file:///c:/Users/Dell/Desktop/PROjects/Dellics%20Travels/apps/api/src/esim/esim.controller.ts)

