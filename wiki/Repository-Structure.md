# Repository Structure

Dellics Travels is a **Turborepo + pnpm workspace monorepo**. Everything is TypeScript.

```
.
├── apps/
│   ├── api/        # NestJS backend — the single API shared by mobile, web, and admin
│   ├── mobile/     # Expo / React Native traveler app (NativeWind)
│   └── web/        # Next.js companion web app
├── packages/
│   ├── database/       # Shared Prisma schema / database package
│   ├── eslint-config/  # Shared ESLint configs
│   ├── typescript-config/ # Shared tsconfig bases
│   └── ui/             # Shared React component library
├── supabase/
│   ├── migrations/ # SQL migrations (e.g. create_booking_tables)
│   └── config.toml
├── patches/        # pnpm patches (react-native-css-interop)
├── scripts/        # Workspace scripts (patch-css-interop.js)
├── RULES/          # Engineering rules & skills (GEMINI.md, workflows, skills/)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json    # packageManager: pnpm@9.0.0, node >= 18
```

## apps/api — the NestJS backend

The single backend that the mobile app, web app, and (future) admin website all call. Modules in `apps/api/src`:

| Module | Files | Responsibility |
|---|---|---|
| `auth` | `auth.controller.ts`, `auth.module.ts`, `jwt-auth.guard.ts`, `supabase.strategy.ts` | Supabase JWT validation and route guards |
| `booking` | controller / module / service | Bookings across flights, hotels, packages, cars, activities |
| `esim` | controller / module / service (+ specs) | eSIM orders and Airalo provisioning |
| `payments` | controller / module / service | Stripe payment intents and refunds |
| `search` | controller / module / service | Inventory search |
| `webhooks` | controller / module / service | Stripe/Airalo webhook handling |
| `prisma` | `prisma.module.ts`, `prisma.service.ts` | Database access layer |

> The admin website adds four more backend modules (Content/CMS, Supplier Health, Support/Ticketing, Analytics, plus Audit) — see [Architecture & Backend Linkage](Architecture-and-Backend-Linkage#new-modules-the-admin-website-adds).

## apps/mobile — the Expo traveler app

Expo Router file-based routing under `app/`:

| Route group | Contents |
|---|---|
| `(tabs)/` | 5-tab bottom nav: Home, Explore, Trips, eSIM, Profile |
| `auth/` | Sign up, log in, OTP flows |
| `search/`, `results/` | Search entry and result lists |
| `flights/`, `hotels/` | Vertical detail flows |
| `details/` | Detail screens |
| `checkout/` | Checkout, promo code, confirmation |
| `esim/` | eSIM store / activation |
| `membership/`, `trips/`, `explore/`, `notifications/`, `profile/`, `support/` | Remaining feature areas |

Styling is **NativeWind** (Tailwind for React Native) with a patched `react-native-css-interop` (see `patches/` and `scripts/patch-css-interop.js`, applied via the root `postinstall`).

## apps/web — the Next.js companion app

Next.js App Router app sharing the design system with the admin website (same stack decision — see [Admin Tech Stack & Security](Admin-Tech-Stack-and-Security)).

## packages/

| Package | Purpose |
|---|---|
| `database` | Shared Prisma schema / generated client |
| `ui` | Shared React component library |
| `eslint-config` | Shared lint rules |
| `typescript-config` | Shared `tsconfig` bases |

## supabase/

PostgreSQL schema managed via Supabase. Migrations live in `supabase/migrations/` (e.g. `20260812173447_create_booking_tables.sql`). Supabase provides both the database and the auth layer (JWT issuer for both traveler and admin tokens).

## Common commands

```sh
pnpm install            # install everything (runs the css-interop patch on postinstall)
pnpm dev                # turbo run dev — all apps
pnpm build              # turbo run build
pnpm lint               # turbo run lint
pnpm check-types        # turbo run check-types
pnpm format             # prettier across ts/tsx/md

# scope to one app with turbo filters
pnpm exec turbo dev --filter=api
pnpm exec turbo build --filter=web
```

Requirements: **Node >= 18**, **pnpm 9.x**.

---

**Next:** [Architecture & Backend Linkage](Architecture-and-Backend-Linkage)
