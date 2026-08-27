# Dellics Travels Web Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy static HTML/CSS/JS site (`apps/Dellics Travels/`) with the public website rebuilt in `apps/web` (Next.js App Router + Tailwind + shadcn/ui), with Ratehawk hotel search and contact/inquire forms moved into real `apps/api` NestJS endpoints.

**Architecture:** `apps/web` renders 19 routes (Server Components; client components only for interactive widgets) and calls the existing NestJS API — "one backend, two front doors". Two new NestJS modules (Hotels, Inquiries) plus one new `Inquiry` Prisma model/Supabase migration. WhatsApp stays the flight conversion channel.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, zod, NestJS 11, class-validator, @nestjs/throttler, axios, Prisma, Supabase/Postgres.

**Spec:** `docs/superpowers/specs/2026-08-25-web-restructure-design.md`

**Ground rules:**
- Package manager is **pnpm 9** (workspace). Run install/lint/build from the repo root unless stated.
- `apps/api` listens on port **3000**; this plan moves `apps/web` dev to port **3001**.
- API base URL for the frontend: `NEXT_PUBLIC_API_URL` (dev: `http://localhost:3000`).
- Never put any Ratehawk credential in `apps/web`. Never commit `.env` values.
- Windows/PowerShell shell: use `;` not `&&`.
- Commit after every task. Do not commit `.env` files.

## File structure

```
apps/web/
  package.json                      (modify: deps, port 3001, test script)
  next.config.js                    (modify: image config)
  tsconfig.json                     (modify: @/* alias, vitest types)
  postcss.config.mjs                (create)
  components.json                   (create: shadcn config)
  vitest.config.ts                  (create)
  .env.local                        (create, untracked: NEXT_PUBLIC_API_URL)
  app/
    globals.css                     (rewrite: Tailwind v4 + brand tokens)
    layout.tsx                      (rewrite: fonts + SiteHeader/SiteFooter + Toaster)
    page.tsx                        (rewrite: home)
    sitemap.ts                      (create)
    robots.ts                       (create)
    not-found.tsx                   (create)
    flights/page.tsx                hotels/page.tsx       tours/page.tsx
    transfers/page.tsx              visa/page.tsx         corporate/page.tsx
    diaspora/page.tsx               services/page.tsx     credentials/page.tsx
    gallery/page.tsx                about/page.tsx        contact/page.tsx
    inquire/page.tsx                privacy/page.tsx      terms/page.tsx
    admin/page.tsx                  destinations/page.tsx
    destinations/[region]/page.tsx
  src/                              (create: all app code)
    lib/utils.ts                    lib/api.ts            lib/schemas.ts
    lib/site.ts                     lib/hotels.ts
    lib/passengers.ts (+ .spec.ts)  lib/whatsapp.ts (+ .spec.ts)
    data/destinations.ts            data/nav.ts           data/home.ts
    data/gallery.ts
    components/layout/{site-header,site-footer,announcement-bar}.tsx
    components/ui/*                 (shadcn-generated)
    components/{page-hero,section-heading,accreditation-strip}.tsx
    components/{content-sections,cta-banner}.tsx
    components/home/{hero-slider,quick-book}.tsx
    components/flights/{flight-search-widget,passenger-selector}.tsx
    components/hotels/hotel-search.tsx
    components/forms/{contact-form,inquire-form}.tsx
    components/gallery/lightbox.tsx
  public/images/...  public/videos/  public/badges/  public/logo.png

apps/api/src/
  hotels/{hotels.module,hotels.controller,hotels.service,hotels.types}.ts
  hotels/dto/search-hotels.dto.ts
  hotels/hotels.service.spec.ts
  inquiries/{inquiries.module,inquiries.controller,inquiries.service}.ts
  inquiries/dto/create-inquiry.dto.ts
  inquiries/inquiries.service.spec.ts
  app.module.ts                     (modify: register both modules + Throttler)
  main.ts                           (modify: global ValidationPipe, remove env log)
  .env.example                      (create)  .env (modify locally, untracked)

packages/database/prisma/schema.prisma   (modify: + Inquiry model)
supabase/migrations/20260825000000_create_inquiry_table.sql  (create)
```

---

### Task 1: Frontend foundation — Tailwind v4, shadcn/ui, brand tokens

**Files:**
- Modify: `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/next.config.js`
- Create: `apps/web/components.json`, `apps/web/src/lib/utils.ts`, `apps/web/.env.local`
- Rewrite: `apps/web/app/globals.css`
- Delete: `apps/web/app/page.module.css`, `apps/web/app/fonts/GeistMonoVF.woff`, `apps/web/app/fonts/GeistVF.woff`

- [ ] **Step 1: Install dependencies**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\web"
pnpm add tailwindcss @tailwindcss/postcss postcss class-variance-authority clsx tailwind-merge lucide-react zod
pnpm add -D @types/node
```

- [ ] **Step 2: Configure PostCSS — create `apps/web/postcss.config.mjs`**

```js
const config = {
  plugins: ["@tailwindcss/postcss"],
};
export default config;
```

- [ ] **Step 3: Path alias — replace `apps/web/tsconfig.json`**

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Brand tokens — rewrite `apps/web/app/globals.css`**

```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-inter);
  --font-display: var(--font-poppins);
}

@theme {
  --color-navy: #0a0060;
  --color-ink: #030067;
  --color-brand-orange: #f4740d;
  --color-sunrise: #fbd9be;
  --color-slate-body: #3a3a3a;
  --color-confirm: #1e7a34;
  --color-confirm-tint: #e7f5ea;
  --color-alert: #b5540b;
  --color-alert-tint: #fdeee2;
  --radius-card: 20px;
  --radius-field: 14px;
  --radius-pill: 100px;
}

:root {
  --background: #ffffff;
  --foreground: #3a3a3a;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-inter), system-ui, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-poppins), system-ui, sans-serif;
}
```

This gives utilities: `bg-navy`, `bg-ink`, `bg-brand-orange`, `bg-sunrise`, `text-confirm`, `bg-alert-tint`, `rounded-card`, `rounded-field`, `rounded-pill`, `font-display`.

- [ ] **Step 5: shadcn config — create `apps/web/components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": { "config": "", "css": "app/globals.css", "baseColor": "neutral", "cssVariables": true },
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 6: Create `apps/web/src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 7: Add shadcn components**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\web"
pnpm dlx shadcn@latest add button card input label textarea select tabs sheet popover calendar sonner skeleton badge separator
```

Expected: components created under `apps/web/src/components/ui/`. If the CLI writes them to `components/ui/` instead, move them to `src/components/ui/` and keep the alias working.

- [ ] **Step 8: Env + ports — create `apps/web/.env.local` (untracked) and edit `apps/web/package.json`**

`.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

`package.json` script change:
```json
"dev": "next dev --port 3001",
```

- [ ] **Step 9: Image config — replace `apps/web/next.config.js`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.ratehawk.com" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 10: Verify**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels"
pnpm exec turbo run check-types --filter=web
pnpm exec turbo run build --filter=web
```

Expected: both succeed (the default starter page still renders; it's replaced in Task 6).

- [ ] **Step 11: Commit**

```powershell
git add apps/web
git commit -m "feat(web): tailwind v4 + shadcn/ui foundation with dellics brand tokens"
```

---

### Task 2: Media, SEO assets, and env hygiene

**Files:**
- Create: `apps/web/public/images/**`, `apps/web/public/videos/`, `apps/web/public/badges/`, `apps/web/public/logo.png`, `apps/web/public/favicon.ico`
- Create: `apps/api/.env.example`
- Modify: `apps/api/.env` (local only — move Ratehawk values here, never commit)

- [ ] **Step 1: Copy images (keep region subfolders, rename to kebab-case)**

```powershell
$legacy = "c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\Dellics Travels\Dellics Travels"
$web = "c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\web\public"
New-Item -ItemType Directory -Force "$web\images\africa","$web\images\asia","$web\images\europe","$web\images\middle-east","$web\images\north-america","$web\images\services","$web\videos","$web\badges" | Out-Null
Copy-Item "$legacy\images\Africa\*"     "$web\images\africa\"
Copy-Item "$legacy\images\Asia\*"       "$web\images\asia\"
Copy-Item "$legacy\images\Europe\*"     "$web\images\europe\"
Copy-Item "$legacy\images\Middle_East\*" "$web\images\middle-east\"
Copy-Item "$legacy\images\North_America\*" "$web\images\north-america\"
Copy-Item "$legacy\images\*.jpg"        "$web\images\services\"
Copy-Item "$legacy\airporttravels\airport transportation.mp4" "$web\videos\airport-transfers.mp4"
Copy-Item "$legacy\hotelsandairbnb\hotel.mp4" "$web\videos\hotels.mp4"
Copy-Item "$legacy\licensedaccredited\*" "$web\badges\"
Copy-Item "$legacy\company logo.png" "$web\logo.png"
```

Then rename copied files containing spaces to kebab-case (e.g. `Cape_Coast_Castle.jpg` → `cape-coast-castle.jpg`); record each rename — page copy in Tasks 7–15 must reference the new names.

- [ ] **Step 2: Compress the 3.7MB hero image**

`apps/web/public/images/services/Tanzania.jpg` (legacy `Tanzania.jpg`, 3.7MB): re-export as JPEG quality ~75, max 2000px wide, target < 400KB, overwriting the copy.

- [ ] **Step 3: Create `apps/api/.env.example`**

```
# Database (Supabase Postgres)
DATABASE_URL=

# Supabase JWT verification
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Ratehawk (hotel inventory) — server-side only, NEVER client-side
RATEHAWK_API_ID=
RATEHAWK_API_KEY=
RATEHAWK_BASE_URL=https://api-sandbox.ratehawk.com

# Email (optional for inquiry notifications)
RESEND_API_KEY=
INQUIRY_NOTIFY_EMAIL=info@dellicstravels.com
```

- [ ] **Step 4: Move Ratehawk credentials server-side (local only)**

Edit `apps/api/.env` (untracked): add the three `RATEHAWK_*` keys from the legacy `ratehawk-config.js` values. Verify `apps/api/.gitignore` and the root `.gitignore` ignore `.env`. The legacy `ratehawk-config.js` is deleted with the legacy folder in Task 17 — the user must also rotate this key with Ratehawk (outside code).

- [ ] **Step 5: Verify no secret is staged**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels"
git status --short
git check-ignore apps/api/.env apps/web/.env.local
```

Expected: `.env` / `.env.local` never appear as untracked-and-stageable; `git check-ignore` prints both paths.

- [ ] **Step 6: Commit**

```powershell
git add apps/web/public apps/api/.env.example
git commit -m "feat(web): migrate images, videos, accreditation badges; add api env template"
```

---

### Task 3: Database — Inquiry model, migration, Prisma client

**Files:**
- Modify: `packages/database/prisma/schema.prisma`
- Create: `supabase/migrations/20260825000000_create_inquiry_table.sql`

- [ ] **Step 1: Add the model to `schema.prisma` (append after `ESIMOrder`)**

```prisma
enum InquiryKind {
  CONTACT
  INQUIRY
}

model Inquiry {
  id         String      @id @default(uuid())
  kind       InquiryKind
  name       String
  email      String
  phone      String?
  message    String
  payload    Json?

  created_at DateTime    @default(now())
}
```

Follows the schema's existing conventions: snake_case columns, `uuid()` ids, `created_at` default now.

- [ ] **Step 2: Create the matching SQL migration `supabase/migrations/20260825000000_create_inquiry_table.sql`**

```sql
create type "public"."InquiryKind" as enum ('CONTACT', 'INQUIRY');

create table "public"."Inquiry" (
  "id" text not null,
  "kind" "public"."InquiryKind" not null,
  "name" text not null,
  "email" text not null,
  "phone" text,
  "message" text not null,
  "payload" jsonb,
  "created_at" timestamp(3) with time zone not null default now(),
  constraint "Inquiry_pkey" primary key ("id")
);

create index "Inquiry_created_at_idx" on "public"."Inquiry" ("created_at" desc);
```

- [ ] **Step 3: Generate the client and apply locally**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels\packages\database"
pnpm exec prisma generate
pnpm exec prisma db push
```

Expected: `The database is already in sync` or migration applied; no errors. (If the local DB is unreachable, mark as **Blocked** and continue — apply via `supabase db push` before Task 16 verification.)

- [ ] **Step 4: Commit**

```powershell
git add packages/database/prisma/schema.prisma supabase/migrations
git commit -m "feat(db): add Inquiry model and migration for website submissions"
```

---

### Task 4: API — Hotels module (Ratehawk, TDD)

**Files:**
- Create: `apps/api/src/hotels/hotels.types.ts`, `apps/api/src/hotels/dto/search-hotels.dto.ts`, `apps/api/src/hotels/hotels.service.ts`, `apps/api/src/hotels/hotels.controller.ts`, `apps/api/src/hotels/hotels.module.ts`
- Test: `apps/api/src/hotels/hotels.service.spec.ts`

- [ ] **Step 1: Write the failing tests — `apps/api/src/hotels/hotels.service.spec.ts`**

```ts
import { ConfigService } from '@nestjs/config';
import { BadRequestException, BadGatewayException } from '@nestjs/common';
import { HotelsService } from './hotels.service';

type FetchMock = jest.Mock;

function buildService(): HotelsService {
  return new HotelsService(
    new ConfigService({
      RATEHAWK_API_ID: 'test-id',
      RATEHAWK_API_KEY: 'test-key',
      RATEHAWK_BASE_URL: 'https://ratehawk.test',
    }),
  );
}

describe('HotelsService', () => {
  let fetchMock: FetchMock;

  beforeEach(() => {
    fetchMock = jest.fn();
    (global as any).fetch = fetchMock;
  });

  it('rejects check-out on or before check-in', async () => {
    const service = buildService();
    await expect(
      service.search({
        destination: 'Accra',
        checkIn: '2099-09-10',
        checkOut: '2099-09-10',
        guests: 2,
        rooms: 1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects check-in in the past', async () => {
    const service = buildService();
    await expect(
      service.search({
        destination: 'Accra',
        checkIn: '2020-01-01',
        checkOut: '2020-01-05',
        guests: 2,
        rooms: 1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('normalizes upstream hotels into the public shape', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        hotels: [
          {
            hotel_id: 'h1',
            name: 'Marina Bay Grand',
            stars: 5,
            address: 'Dubai Marina',
            city: 'Dubai',
            country: 'UAE',
            min_price: 1540,
            currency: 'GHS',
            photos: ['https://cdn.test/1.jpg'],
            amenities: ['WiFi', 'Pool'],
            description: 'Luxury hotel.',
          },
        ],
      }),
    });
    const service = buildService();
    const result = await service.search({
      destination: 'Dubai',
      checkIn: '2099-01-01',
      checkOut: '2099-01-08',
      guests: 2,
      rooms: 1,
    });
    expect(result).toEqual([
      {
        id: 'h1',
        name: 'Marina Bay Grand',
        rating: 5,
        address: 'Dubai Marina',
        city: 'Dubai',
        country: 'UAE',
        price: 1540,
        currency: 'GHS',
        images: ['https://cdn.test/1.jpg'],
        amenities: ['WiFi', 'Pool'],
        description: 'Luxury hotel.',
      },
    ]);
    // credentials must travel in headers, never in the request body
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://ratehawk.test/hotels/search');
    expect(init.headers['X-API-ID']).toBe('test-id');
    expect(init.headers['X-API-Key']).toBe('test-key');
    expect(init.body).not.toContain('test-key');
  });

  it('surfaces upstream failure as BadGateway, never mock data', async () => {
    fetchMock.mockRejectedValue(new Error('ECONNREFUSED'));
    const service = buildService();
    await expect(
      service.search({
        destination: 'Accra',
        checkIn: '2099-01-01',
        checkOut: '2099-01-08',
        guests: 2,
        rooms: 1,
      }),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\api"
pnpm test -- hotels.service.spec
```

Expected: FAIL — `Cannot find module './hotels.service'`.

- [ ] **Step 3: Create `apps/api/src/hotels/hotels.types.ts`**

```ts
export interface HotelSearchInput {
  destination: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  rooms: number;
}

export interface HotelResult {
  id: string;
  name: string;
  rating: number;
  address: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  images: string[];
  amenities: string[];
  description: string;
}
```

- [ ] **Step 4: Create `apps/api/src/hotels/dto/search-hotels.dto.ts`**

```ts
import {
  IsInt,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class SearchHotelsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  destination: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'checkIn must be YYYY-MM-DD' })
  checkIn: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'checkOut must be YYYY-MM-DD' })
  checkOut: string;

  @IsInt()
  @Min(1)
  @Max(16)
  guests: number;

  @IsInt()
  @Min(1)
  @Max(8)
  rooms: number;
}
```

- [ ] **Step 5: Create `apps/api/src/hotels/hotels.service.ts`**

```ts
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HotelResult, HotelSearchInput } from './hotels.types';

const REQUEST_TIMEOUT_MS = 15_000;

@Injectable()
export class HotelsService {
  private readonly logger = new Logger(HotelsService.name);

  constructor(private readonly config: ConfigService) {}

  async search(input: HotelSearchInput): Promise<HotelResult[]> {
    this.assertDates(input);
    const body = await this.fetchJson(`${this.baseUrl}/hotels/search`, {
      destination: input.destination,
      check_in: input.checkIn,
      check_out: input.checkOut,
      guests: input.guests,
      rooms: input.rooms,
    });
    return this.normalize(body);
  }

  private assertDates(input: HotelSearchInput): void {
    const today = new Date().toISOString().slice(0, 10);
    if (input.checkIn < today) {
      throw new BadRequestException('Check-in date must be today or later.');
    }
    if (input.checkOut <= input.checkIn) {
      throw new BadRequestException('Check-out date must be after check-in.');
    }
  }

  private get baseUrl(): string {
    return (
      this.config.get<string>('RATEHAWK_BASE_URL') ??
      'https://api-sandbox.ratehawk.com'
    );
  }

  /** Isolated so tests can stub transport without hitting the network. */
  protected async fetchJson(path: string, payload: unknown): Promise<any> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(path, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-API-ID': this.config.get<string>('RATEHAWK_API_ID') ?? '',
          'X-API-Key': this.config.get<string>('RATEHAWK_API_KEY') ?? '',
        },
        body: JSON.stringify(payload), // credentials never in the body
      });
      if (!res.ok) {
        throw new Error(`Ratehawk responded ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      this.logger.error(`Ratehawk search failed: ${(error as Error).message}`);
      throw new BadGatewayException(
        'Hotel availability is temporarily unavailable. Please try again shortly.',
      );
    } finally {
      clearTimeout(timer);
    }
  }

  private normalize(body: any): HotelResult[] {
    const hotels = body?.hotels;
    if (!Array.isArray(hotels)) return [];
    return hotels.map((h: any) => ({
      id: String(h.id ?? h.hotel_id ?? ''),
      name: String(h.name ?? h.hotel_name ?? 'Unknown hotel'),
      rating: Number(h.rating ?? h.stars ?? 0),
      address: String(h.address ?? h.location ?? ''),
      city: String(h.city ?? ''),
      country: String(h.country ?? ''),
      price: Number(h.price ?? h.min_price ?? 0),
      currency: String(h.currency ?? 'USD'),
      images: this.images(h.images ?? h.photos ?? h.image_url),
      amenities: Array.isArray(h.amenities ?? h.facilities)
        ? (h.amenities ?? h.facilities)
        : [],
      description: String(h.description ?? h.details ?? ''),
    }));
  }

  private images(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value
        .map((img) => (typeof img === 'string' ? img : img?.url ?? img?.path ?? ''))
        .filter(Boolean);
    }
    if (typeof value === 'string') return [value];
    if (value && typeof (value as any).url === 'string') return [(value as any).url];
    return [];
  }
}
```

- [ ] **Step 6: Run tests to verify they pass**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\api"
pnpm test -- hotels.service.spec
```

Expected: 4 passing.

- [ ] **Step 7: Create controller + module — `apps/api/src/hotels/hotels.controller.ts`**

```ts
import { Body, Controller, Post } from '@nestjs/common';
import { SearchHotelsDto } from './dto/search-hotels.dto';
import { HotelsService } from './hotels.service';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotels: HotelsService) {}

  @Post('search')
  search(@Body() dto: SearchHotelsDto) {
    return this.hotels.search(dto);
  }
}
```

`apps/api/src/hotels/hotels.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';

@Module({
  controllers: [HotelsController],
  providers: [HotelsService],
})
export class HotelsModule {}
```

- [ ] **Step 8: Commit**

```powershell
git add apps/api/src/hotels
git commit -m "feat(api): hotels search module proxying ratehawk server-side"
```

---

### Task 5: API — Inquiries module + global validation + throttling (TDD)

**Files:**
- Create: `apps/api/src/inquiries/dto/create-inquiry.dto.ts`, `apps/api/src/inquiries/inquiries.service.ts`, `apps/api/src/inquiries/inquiries.controller.ts`, `apps/api/src/inquiries/inquiries.module.ts`
- Test: `apps/api/src/inquiries/inquiries.service.spec.ts`
- Modify: `apps/api/src/app.module.ts`, `apps/api/src/main.ts`, `apps/api/package.json` (deps)

- [ ] **Step 1: Install deps**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\api"
pnpm add class-validator class-transformer @nestjs/throttler
```

- [ ] **Step 2: Write the failing tests — `apps/api/src/inquiries/inquiries.service.spec.ts`**

```ts
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InquiriesService } from './inquiries.service';

describe('InquiriesService', () => {
  const create = jest.fn().mockResolvedValue({ id: 'inq-1' });
  const prisma = { inquiry: { create } } as unknown as PrismaService;

  function buildService(): InquiriesService {
    return new InquiriesService(
      prisma,
      new ConfigService({ RESEND_API_KEY: '', INQUIRY_NOTIFY_EMAIL: '' }),
    );
  }

  beforeEach(() => create.mockClear());

  it('persists a contact submission and returns an opaque id', async () => {
    const service = buildService();
    const res = await service.create({
      kind: 'CONTACT',
      name: 'Ama Serwaa',
      email: 'ama@example.com',
      message: 'Hello, I have a question.',
    } as any);
    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        kind: 'CONTACT',
        name: 'Ama Serwaa',
        email: 'ama@example.com',
      }),
    });
    expect(res).toEqual({ received: true });
  });

  it('rejects non-email email values', async () => {
    const service = buildService();
    await expect(
      service.create({
        kind: 'CONTACT',
        name: 'Ama',
        email: 'not-an-email',
        message: 'Hi',
      } as any),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(create).not.toHaveBeenCalled();
  });

  it('stores inquiry extras inside payload', async () => {
    const service = buildService();
    await service.create({
      kind: 'INQUIRY',
      name: 'Kofi Mensah',
      email: 'kofi@example.com',
      message: 'Zanzibar package for 4.',
      destination: 'Zanzibar',
      travelDate: '2026-12-01',
      travelers: '4 Passengers',
    } as any);
    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        kind: 'INQUIRY',
        payload: {
          destination: 'Zanzibar',
          travelDate: '2026-12-01',
          travelers: '4 Passengers',
        },
      }),
    });
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```powershell
pnpm test -- inquiries.service.spec
```

Expected: FAIL — `Cannot find module './inquiries.service'`.

- [ ] **Step 4: Create `apps/api/src/inquiries/dto/create-inquiry.dto.ts`**

```ts
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateInquiryDto {
  @IsIn(['CONTACT', 'INQUIRY'])
  kind: 'CONTACT' | 'INQUIRY';

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9 ()-]{7,20}$/, { message: 'phone looks invalid' })
  phone?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string;

  // INQUIRY-only extras
  @IsOptional()
  @IsString()
  @MaxLength(120)
  destination?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'travelDate must be YYYY-MM-DD' })
  travelDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  travelers?: string;
}
```

- [ ] **Step 5: Create `apps/api/src/inquiries/inquiries.service.ts`**

```ts
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateInquiryDto): Promise<{ received: true }> {
    if (!EMAIL_RE.test(dto.email)) {
      throw new BadRequestException('Please provide a valid email address.');
    }
    const payload =
      dto.kind === 'INQUIRY'
        ? {
            destination: dto.destination,
            travelDate: dto.travelDate,
            travelers: dto.travelers,
          }
        : undefined;

    const record = await this.prisma.inquiry.create({
      data: {
        kind: dto.kind,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        message: dto.message,
        payload,
      },
    });

    await this.notify(record.id, dto);
    return { received: true }; // opaque ack — never echo stored data back
  }

  private async notify(id: string, dto: CreateInquiryDto): Promise<void> {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const to = this.config.get<string>('INQUIRY_NOTIFY_EMAIL');
    if (!apiKey || !to) return; // degrade gracefully: record is already persisted
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Dellics Travels Website <website@dellicstravels.com>',
          to: [to],
          subject: `New ${dto.kind.toLowerCase()} submission (${id})`,
          text: `${dto.name} <${dto.email}>${dto.phone ? ` · ${dto.phone}` : ''}\n\n${dto.message}`,
        }),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    } catch (error) {
      this.logger.warn(`Inquiry ${id} persisted but email notify failed: ${(error as Error).message}`);
    }
  }
}
```

- [ ] **Step 6: Run tests to verify they pass**

```powershell
pnpm test -- inquiries.service.spec
```

Expected: 3 passing.

- [ ] **Step 7: Create controller + module — `apps/api/src/inquiries/inquiries.controller.ts`**

```ts
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  @Post()
  @HttpCode(201)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  create(@Body() dto: CreateInquiryDto) {
    return this.inquiries.create(dto);
  }
}
```

`apps/api/src/inquiries/inquiries.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';

@Module({
  controllers: [InquiriesController],
  providers: [InquiriesService],
})
export class InquiriesModule {}
```

- [ ] **Step 8: Register modules + throttler — modify `apps/api/src/app.module.ts`**

Add imports and entries so the array reads:

```ts
import { ThrottlerModule } from '@nestjs/throttler';
import { HotelsModule } from './hotels/hotels.module';
import { InquiriesModule } from './inquiries/inquiries.module';
// ...
imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
  PrismaModule,
  AuthModule,
  SearchModule,
  BookingModule,
  WebhooksModule,
  PaymentsModule,
  EsimModule,
  HotelsModule,
  InquiriesModule,
],
```

Also add the throttler guard globally — add `APP_GUARD` provider:

```ts
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
// providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
```

- [ ] **Step 9: Global validation pipe + remove the env console.log — rewrite `apps/api/src/main.ts`**

```ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config({ override: true });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
```

- [ ] **Step 10: Full API verification**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\api"
pnpm test
pnpm build
```

Expected: all tests pass (including pre-existing `esim`/`app.controller` specs), build succeeds.

- [ ] **Step 11: Commit**

```powershell
git add apps/api
git commit -m "feat(api): inquiries module, global validation pipe, throttling"
```

---

### Task 6: Web test infra + core libraries (TDD)

**Files:**
- Modify: `apps/web/package.json` (test script), `apps/web/tsconfig.json` (vitest types)
- Create: `apps/web/vitest.config.ts`, `apps/web/src/lib/site.ts`, `apps/web/src/lib/passengers.ts`, `apps/web/src/lib/whatsapp.ts`, `apps/web/src/lib/api.ts`, `apps/web/src/lib/schemas.ts`
- Test: `apps/web/src/lib/passengers.spec.ts`, `apps/web/src/lib/whatsapp.spec.ts`

- [ ] **Step 1: Install vitest + add test script**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\web"
pnpm add -D vitest
```

Add to `apps/web/package.json` `"scripts"`:

```json
"test": "vitest run",
```

Add `"vitest/globals"` to `tsconfig.json` `compilerOptions.types`:

```json
"types": ["vitest/globals"]
```

- [ ] **Step 2: Create `apps/web/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node", globals: true },
});
```

- [ ] **Step 3: Write the failing tests**

`apps/web/src/lib/passengers.spec.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  clampCount,
  formatPassengers,
  totalTravellers,
  PASSENGER_LIMITS,
} from "./passengers";

describe("passengers", () => {
  it("clamps each group to its limits", () => {
    expect(clampCount("adults", 0)).toBe(1);
    expect(clampCount("adults", 12)).toBe(9);
    expect(clampCount("children", -1)).toBe(0);
    expect(clampCount("children", 9)).toBe(8);
    expect(clampCount("infants", 5)).toBe(4);
  });

  it("totals exclude infants", () => {
    expect(totalTravellers({ adults: 2, children: 1, infants: 2 })).toBe(3);
  });

  it("formats the legacy-style summary string", () => {
    expect(formatPassengers({ adults: 2, children: 1, infants: 0 })).toBe(
      "2 Adults, 1 Child",
    );
    expect(formatPassengers({ adults: 1, children: 0, infants: 1 })).toBe(
      "1 Adult, 1 Infant",
    );
    expect(formatPassengers({ adults: 3, children: 2, infants: 1 })).toBe(
      "3 Adults, 2 Children, 1 Infant",
    );
  });

  it("exposes the documented limits", () => {
    expect(PASSENGER_LIMITS).toEqual({
      adults: { min: 1, max: 9 },
      children: { min: 0, max: 8 },
      infants: { min: 0, max: 4 },
    });
  });
});
```

`apps/web/src/lib/whatsapp.spec.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildWhatsAppLink, composeFlightMessage } from "./whatsapp";

describe("whatsapp", () => {
  it("builds a wa.me deep link with encoded text", () => {
    const link = buildWhatsAppLink("Hello there");
    expect(link).toBe("https://wa.me/233552054174?text=Hello%20there");
  });

  it("composes the full flight message", () => {
    const message = composeFlightMessage({
      tripType: "roundtrip",
      legs: [
        { from: "Accra", to: "Dubai", departDate: "2026-12-01" },
        { from: "Dubai", to: "Accra", departDate: "2026-12-10" },
      ],
      passengers: { adults: 2, children: 1, infants: 0 },
      cabinClass: "Economy",
    });
    expect(message).toContain("Round Trip");
    expect(message).toContain("Accra -> Dubai");
    expect(message).toContain("01 Dec 2026");
    expect(message).toContain("2 Adults, 1 Child");
    expect(message).toContain("Class: Economy");
  });

  it("omits the return line for one-way trips", () => {
    const message = composeFlightMessage({
      tripType: "oneway",
      legs: [{ from: "Accra", to: "London", departDate: "2026-12-01" }],
      passengers: { adults: 1, children: 0, infants: 0 },
      cabinClass: "Business",
    });
    expect(message).not.toContain("Return");
    expect(message).toContain("One Way");
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\web"
pnpm test
```

Expected: FAIL — `Cannot find module './passengers'`.

- [ ] **Step 5: Create `apps/web/src/lib/site.ts`**

```ts
export const SITE = {
  name: "Dellics Travels",
  legalName: "Dellics Travels & Tours",
  whatsappNumber: "233552054174",
  phoneDisplay: "+233 55 205 4174",
  email: "info@dellicstravels.com",
  address: "Accra, Ghana",
  travelUrl: "https://mytravel.io/dellicstravels",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
```

Verify the phone/email/address against the legacy `index.html` footer (`apps/Dellics Travels/Dellics Travels/index.html`, footer section); if the legacy values differ, use the legacy values.

- [ ] **Step 6: Create `apps/web/src/lib/passengers.ts`**

```ts
export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

export type PassengerGroup = keyof PassengerCounts;

export const PASSENGER_LIMITS: Record<PassengerGroup, { min: number; max: number }> = {
  adults: { min: 1, max: 9 },
  children: { min: 0, max: 8 },
  infants: { min: 0, max: 4 },
};

export function clampCount(group: PassengerGroup, value: number): number {
  const { min, max } = PASSENGER_LIMITS[group];
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function totalTravellers(counts: PassengerCounts): number {
  return counts.adults + counts.children;
}

export function formatPassengers(counts: PassengerCounts): string {
  const parts: string[] = [];
  parts.push(`${counts.adults} Adult${counts.adults > 1 ? "s" : ""}`);
  if (counts.children > 0)
    parts.push(`${counts.children} Child${counts.children > 1 ? "ren" : ""}`);
  if (counts.infants > 0)
    parts.push(`${counts.infants} Infant${counts.infants > 1 ? "s" : ""}`);
  return parts.join(", ");
}
```

- [ ] **Step 7: Create `apps/web/src/lib/whatsapp.ts`**

```ts
import { SITE } from "./site";
import { formatPassengers, type PassengerCounts } from "./passengers";

export type TripType = "roundtrip" | "oneway" | "multicity";

export interface FlightLeg {
  from: string;
  to: string;
  departDate: string; // YYYY-MM-DD
}

export interface FlightMessageInput {
  tripType: TripType;
  legs: FlightLeg[];
  passengers: PassengerCounts;
  cabinClass: string;
}

const TRIP_LABELS: Record<TripType, string> = {
  roundtrip: "Round Trip",
  oneway: "One Way",
  multicity: "Multi-City",
};

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export function composeFlightMessage(input: FlightMessageInput): string {
  const lines = [
    `Hello ${SITE.name}! I would like to book a flight (${TRIP_LABELS[input.tripType]}).`,
    "",
  ];
  input.legs.forEach((leg, index) => {
    const prefix =
      input.tripType === "multicity"
        ? `Leg ${index + 1}: `
        : index === 0
          ? "Depart: "
          : "Return: ";
    lines.push(`${prefix}${leg.from} -> ${leg.to} on ${formatDate(leg.departDate)}`);
  });
  lines.push(
    `Passengers: ${formatPassengers(input.passengers)}`,
    `Class: ${input.cabinClass}`,
    "",
    "Please share available options and pricing. Thank you!",
  );
  return lines.join("\n");
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 8: Create `apps/web/src/lib/api.ts`**

```ts
import { API_URL } from "./site";

export class ApiError extends Error {}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Connection failed. Check your internet and try again.");
  }
  let data: { message?: unknown } = {};
  try {
    data = await res.json();
  } catch {
    // non-JSON response body — fall through to the status-based message
  }
  if (!res.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message.join(" ")
          : "Something went wrong. Please try again.";
    throw new ApiError(message);
  }
  return data as T;
}
```

- [ ] **Step 9: Create `apps/web/src/lib/schemas.ts`**

```ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .regex(/^\+?[0-9 ()-]{7,20}$/, "Phone number looks invalid")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000),
});

export const inquireSchema = contactSchema.extend({
  destination: z.string().max(120).optional().or(z.literal("")),
  travelDate: z.string().optional().or(z.literal("")),
  travelers: z.string().max(60).optional().or(z.literal("")),
});

export const hotelSearchSchema = z
  .object({
    destination: z.string().min(2, "Enter a destination").max(120),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a check-in date"),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a check-out date"),
    guests: z.number().int().min(1).max(16),
    rooms: z.number().int().min(1).max(8),
  })
  .refine((v) => v.checkOut > v.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export type ContactInput = z.infer<typeof contactSchema>;
export type InquireInput = z.infer<typeof inquireSchema>;
export type HotelSearchInput = z.infer<typeof hotelSearchSchema>;
```

- [ ] **Step 10: Run tests to verify they pass**

```powershell
pnpm test
```

Expected: all tests pass.

- [ ] **Step 11: Commit**

```powershell
git add apps/web
git commit -m "feat(web): core libs — whatsapp composer, passenger logic, api client, zod schemas"
```

---

### Task 7: Layout shell — header, footer, fonts, not-found

**Files:**
- Create: `apps/web/src/data/nav.ts`, `apps/web/src/components/layout/{announcement-bar,site-header,site-footer}.tsx`, `apps/web/src/components/{page-hero,section-heading,accreditation-strip}.tsx`
- Rewrite: `apps/web/app/layout.tsx`
- Create: `apps/web/app/not-found.tsx`
- Delete: `apps/web/app/page.module.css`, `apps/web/app/fonts/GeistVF.woff`, `apps/web/app/fonts/GeistMonoVF.woff` (if not already deleted)

- [ ] **Step 1: Create `apps/web/src/data/nav.ts`**

```ts
export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Flights", href: "/flights" },
  {
    label: "Hotels & Stays",
    href: "/hotels",
    children: [
      { label: "Hotels & Airbnb", href: "/hotels" },
      { label: "Tours & Packages", href: "/tours" },
    ],
  },
  {
    label: "Destinations",
    href: "/destinations",
    children: [
      { label: "Africa", href: "/destinations/africa" },
      { label: "Asia", href: "/destinations/asia" },
      { label: "Europe", href: "/destinations/europe" },
      { label: "Middle East", href: "/destinations/middle-east" },
      { label: "North America", href: "/destinations/north-america" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Airport Transfers", href: "/transfers" },
      { label: "Visa Assistance", href: "/visa" },
      { label: "Corporate Travel", href: "/corporate" },
      { label: "Diaspora Travel", href: "/diaspora" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
```

Cross-check labels/hrefs against the legacy header nav in `apps/Dellics Travels/Dellics Travels/index.html`; adjust labels to match the legacy wording where it differs.

- [ ] **Step 2: Create `apps/web/src/components/layout/announcement-bar.tsx`** (server component)

```tsx
import { SITE } from "@/lib/site";

export function AnnouncementBar() {
  return (
    <div className="bg-brand-orange text-white text-center text-sm py-2 px-4">
      IATA-accredited · 24/7 support — call {SITE.phoneDisplay} or WhatsApp us anytime
    </div>
  );
}
```

- [ ] **Step 3: Create `apps/web/src/components/layout/site-header.tsx`** (client component)

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NAV_ITEMS } from "@/data/nav";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-navy text-white transition-shadow",
        scrolled && "shadow-lg",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" aria-label={`${SITE.name} home`}>
          <Image src="/logo.png" alt={`${SITE.name} logo`} width={140} height={40} className="h-9 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <Popover key={item.label}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-1 rounded-pill px-3 py-2 text-sm font-medium hover:bg-white/10",
                      pathname.startsWith(item.href) && "text-brand-orange",
                    )}
                  >
                    {item.label}
                    <ChevronDown className="size-4" aria-hidden />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-56 p-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-md px-3 py-2 text-sm text-slate-body hover:bg-sunrise/50"
                    >
                      {child.label}
                    </Link>
                  ))}
                </PopoverContent>
              </Popover>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-pill px-3 py-2 text-sm font-medium hover:bg-white/10",
                  pathname === item.href && "text-brand-orange",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden lg:block">
          <Button asChild className="rounded-pill bg-brand-orange hover:bg-brand-orange/90">
            <Link href="/inquire">Inquire Now</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white lg:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto bg-navy text-white">
            <SheetHeader>
              <SheetTitle className="text-left text-white">{SITE.name}</SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <Link href={item.href} className="block rounded-md px-3 py-2 font-medium hover:bg-white/10">
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-md px-6 py-2 text-sm text-white/70 hover:bg-white/10"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <Button asChild className="mt-4 rounded-pill bg-brand-orange hover:bg-brand-orange/90">
                <Link href="/inquire">Inquire Now</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Create `apps/web/src/components/accreditation-strip.tsx`** (server component)

```tsx
import Image from "next/image";

// Filenames must match the kebab-cased copies in public/badges/ (Task 2).
const BADGES = [
  { src: "/badges/iata.png", alt: "IATA accredited" },
  { src: "/badges/amadeus.png", alt: "Amadeus partner" },
  { src: "/badges/ratehawk.png", alt: "RateHawk partner" },
  { src: "/badges/gta.png", alt: "GTA partner" },
  { src: "/badges/travelport.png", alt: "Travelport partner" },
  { src: "/badges/airalo.png", alt: "Airalo partner" },
];

export function AccreditationStrip() {
  return (
    <section aria-label="Accreditations and partners" className="border-y border-black/5 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-4">
        {BADGES.map((badge) => (
          <Image key={badge.src} src={badge.src} alt={badge.alt} width={120} height={48} className="h-10 w-auto opacity-80" />
        ))}
      </div>
    </section>
  );
}
```

Adjust the `BADGES` list to the actual files copied into `public/badges/` in Task 2 (one entry per badge file that exists).

- [ ] **Step 5: Create `apps/web/src/components/layout/site-footer.tsx`** (server component)

```tsx
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { AccreditationStrip } from "@/components/accreditation-strip";

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const QUICK_LINKS = [
  { label: "Flights", href: "/flights" },
  { label: "Hotels & Airbnb", href: "/hotels" },
  { label: "Tours", href: "/tours" },
  { label: "Transfers", href: "/transfers" },
  { label: "Visa Assistance", href: "/visa" },
  { label: "Destinations", href: "/destinations" },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <AccreditationStrip />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/logo.png" alt={`${SITE.name} logo`} width={140} height={40} className="h-9 w-auto" />
          <p className="mt-4 text-sm text-white/70">
            Your trusted travel partner — flights, hotels, tours, transfers and visa
            assistance, handled by licensed experts.
          </p>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-orange">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/70 hover:text-white">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-orange">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about" className="text-white/70 hover:text-white">About Us</Link></li>
            <li><Link href="/credentials" className="text-white/70 hover:text-white">Credentials</Link></li>
            <li><Link href="/gallery" className="text-white/70 hover:text-white">Gallery</Link></li>
            <li><Link href="/contact" className="text-white/70 hover:text-white">Contact</Link></li>
            <li><Link href="/inquire" className="text-white/70 hover:text-white">Inquire</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-orange">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>{SITE.address}</li>
            <li>{SITE.phoneDisplay}</li>
            <li>{SITE.email}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.{" "}
        {LEGAL.map((item, index) => (
          <span key={item.href}>
            {index > 0 && " · "}
            <Link href={item.href} className="hover:text-white">{item.label}</Link>
          </span>
        ))}
      </div>
    </footer>
  );
}
```

Carry the actual contact details from the legacy footer into `src/lib/site.ts` if different.

- [ ] **Step 6: Create shared page primitives — `apps/web/src/components/page-hero.tsx`**

```tsx
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHero({ title, subtitle, className }: PageHeroProps) {
  return (
    <section className={cn("bg-ink px-4 py-20 text-center text-white", className)}>
      <h1 className="font-display text-4xl font-bold sm:text-5xl">{title}</h1>
      {subtitle ? (
        <p className="mx-auto mt-4 max-w-2xl text-white/75">{subtitle}</p>
      ) : null}
    </section>
  );
}
```

`apps/web/src/components/section-heading.tsx`:

```tsx
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center" }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 font-display text-3xl font-bold text-navy">{title}</h2>
      {subtitle ? <p className="mt-3 text-slate-body">{subtitle}</p> : null}
    </div>
  );
}
```

- [ ] **Step 7: Rewrite `apps/web/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: { default: `${SITE.name} — Flights, Hotels, Tours & Visa Assistance`, template: `%s | ${SITE.name}` },
  description:
    "Dellics Travels is a Ghana-based IATA-accredited travel agency offering flights, hotels, tours, airport transfers and visa assistance worldwide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <AnnouncementBar />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Create `apps/web/app/not-found.tsx`**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="bg-ink px-4 py-32 text-center text-white">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">404</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Page not found</h1>
      <p className="mt-4 text-white/70">The page you are looking for does not exist or has moved.</p>
      <Button asChild className="mt-8 rounded-pill bg-brand-orange hover:bg-brand-orange/90">
        <Link href="/">Back to home</Link>
      </Button>
    </section>
  );
}
```

- [ ] **Step 9: Delete starter leftovers**

Delete `apps/web/app/page.module.css` and the `apps/web/app/fonts/` folder (GeistVF.woff, GeistMonoVF.woff) — fonts now come from `next/font/google`.

- [ ] **Step 10: Verify**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels"
pnpm exec turbo run check-types --filter=web
pnpm exec turbo run build --filter=web
```

Expected: both succeed.

- [ ] **Step 11: Commit**

```powershell
git add apps/web
git commit -m "feat(web): layout shell — header with dropdowns, footer, fonts, 404"
```

---

### Task 8: Home page — hero slider, quick book, sections

**Files:**
- Create: `apps/web/src/data/home.ts`, `apps/web/src/components/home/{hero-slider,quick-book}.tsx`
- Rewrite: `apps/web/app/page.tsx`

- [ ] **Step 1: Create `apps/web/src/data/home.ts`**

```ts
export interface HeroSlide {
  type: "image" | "video";
  src: string;
  caption: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  { type: "video", src: "/videos/hotels.mp4", caption: "Hotels & Airbnb worldwide" },
  { type: "image", src: "/images/services/tanzania.jpg", caption: "Curated tours across 5 continents" },
  { type: "video", src: "/videos/airport-transfers.mp4", caption: "Seamless airport transfers" },
];

export const HOME_STATS = [
  { value: "5,000+", label: "Happy travellers" },
  { value: "120+", label: "Destinations served" },
  { value: "24/7", label: "Support" },
  { value: "10+", label: "Global partners" },
];
```

Verify the stat figures against the legacy counter section in `apps/Dellics Travels/Dellics Travels/index.html`; use the legacy values where present. Verify `HERO_SLIDES` paths against the files copied in Task 2.

- [ ] **Step 2: Create `apps/web/src/components/home/hero-slider.tsx`** (client component)

```tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/data/home";

const INTERVAL_MS = 5000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-ink" aria-label="Featured">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={cn("absolute inset-0 transition-opacity duration-700", i === index ? "opacity-100" : "opacity-0")}
          aria-hidden={i !== index}
        >
          {slide.type === "video" ? (
            <video
              className="h-full w-full object-cover"
              src={slide.src}
              autoPlay
              muted
              playsInline
              onEnded={() => setIndex((p) => (p + 1) % slides.length)}
            />
          ) : (
            <Image src={slide.src} alt={slide.caption} fill className="object-cover" priority={i === 0} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 pb-40 text-white">
            <p className="max-w-xl font-display text-2xl font-bold sm:text-4xl">{slide.caption}</p>
          </div>
        </div>
      ))}
      <div className="absolute right-4 top-4 z-10 flex gap-2" role="tablist" aria-label="Slides">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn("h-2.5 rounded-pill transition-all", i === index ? "w-8 bg-brand-orange" : "w-2.5 bg-white/60")}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `apps/web/src/components/home/quick-book.tsx`** (client component)

```tsx
"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const TABS = [
  { value: "flights", label: "Flights", href: "/flights", copy: "Compare and book domestic and international flights with IATA-accredited experts." },
  { value: "tours", label: "Tours", href: "/tours", copy: "Curated tour packages across Africa, Asia, Europe, the Middle East and the Americas." },
  { value: "hotels", label: "Hotels", href: "/hotels", copy: "Live hotel availability worldwide via our RateHawk partnership." },
  { value: "transfers", label: "Transfers", href: "/transfers", copy: "Reliable airport pickups and city transfers, meet-and-greet included." },
];

export function QuickBook() {
  return (
    <div className="mx-auto w-full max-w-4xl rounded-card bg-white p-6 shadow-xl">
      <Tabs defaultValue="flights">
        <TabsList className="h-auto flex-wrap justify-start rounded-field">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="rounded-pill data-[state=active]:bg-brand-orange data-[state=active]:text-white">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-body">{tab.copy}</p>
            <Button asChild className="shrink-0 rounded-pill bg-brand-orange hover:bg-brand-orange/90">
              <Link href={tab.href}>Book {tab.label}</Link>
            </Button>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
```

- [ ] **Step 4: Rewrite `apps/web/app/page.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import { HeroSlider } from "@/components/home/hero-slider";
import { QuickBook } from "@/components/home/quick-book";
import { SectionHeading } from "@/components/section-heading";
import { AccreditationStrip } from "@/components/accreditation-strip";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES, HOME_STATS } from "@/data/home";

const SERVICES = [
  { title: "Flight Booking", copy: "Best fares on all major airlines, issued same day.", href: "/flights", image: "/images/services/flights.jpg" },
  { title: "Hotels & Airbnb", copy: "Verified stays for every budget, booked server-side.", href: "/hotels", image: "/images/services/hotels.jpg" },
  { title: "Tours & Packages", copy: "Group and private tours across five continents.", href: "/tours", image: "/images/services/tours.jpg" },
  { title: "Airport Transfers", copy: "On-time pickups with professional drivers.", href: "/transfers", image: "/images/services/transfers.jpg" },
  { title: "Visa Assistance", copy: "Document guidance and appointment support.", href: "/visa", image: "/images/services/visa.jpg" },
  { title: "Corporate Travel", copy: "Managed travel programmes for teams.", href: "/corporate", image: "/images/services/corporate.jpg" },
];

const DESTINATION_TEASERS = [
  { name: "Africa", href: "/destinations/africa", image: "/images/africa/hero.jpg" },
  { name: "Europe", href: "/destinations/europe", image: "/images/europe/hero.jpg" },
  { name: "Asia", href: "/destinations/asia", image: "/images/asia/hero.jpg" },
  { name: "Middle East", href: "/destinations/middle-east", image: "/images/middle-east/hero.jpg" },
];

export default function HomePage() {
  return (
    <>
      <HeroSlider slides={HERO_SLIDES} />

      <section className="relative z-10 -mt-16 px-4">
        <QuickBook />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading eyebrow="Why Dellics" title="Everything your journey needs, in one place" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Link key={service.href} href={service.href} className="group overflow-hidden rounded-card border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-lg">
              <div className="relative h-44">
                <Image src={service.image} alt={service.title} fill className="object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-navy">{service.title}</h3>
                <p className="mt-1 text-sm text-slate-body">{service.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center lg:grid-cols-4">
          {HOME_STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-4xl font-bold text-brand-orange">{stat.value}</p>
              <p className="mt-1 text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading eyebrow="Destinations" title="Where will you go next?" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DESTINATION_TEASERS.map((destination) => (
            <Link key={destination.href} href={destination.href} className="group relative h-64 overflow-hidden rounded-card">
              <Image src={destination.image} alt={destination.name} fill className="object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <p className="absolute bottom-4 left-4 font-display text-xl font-semibold text-white">{destination.name}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild className="rounded-pill bg-brand-orange hover:bg-brand-orange/90">
            <Link href="/destinations">Explore all destinations</Link>
          </Button>
        </div>
      </section>

      <AccreditationStrip />

      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <SectionHeading title="Ready to plan your next trip?" subtitle="Talk to a real travel expert — we reply within minutes on WhatsApp." />
        <Button asChild size="lg" className="mt-8 rounded-pill bg-brand-orange hover:bg-brand-orange/90">
          <Link href="/inquire">Start an inquiry</Link>
        </Button>
      </section>
    </>
  );
}
```

Map the `SERVICES` and `DESTINATION_TEASERS` image paths to actual files copied in Task 2 — rename entries to match the kebab-cased files that exist, and delete entries with no matching file rather than referencing missing images.

- [ ] **Step 5: Verify**

```powershell
pnpm exec turbo run build --filter=web
```

Expected: build succeeds.

- [ ] **Step 6: Commit**

```powershell
git add apps/web
git commit -m "feat(web): home page with hero slider, quick book tabs, services and destinations"
```

---

### Task 9: Flights page — search widget + shared passenger selector

**Files:**
- Create: `apps/web/src/components/flights/{passenger-selector,flight-search-widget}.tsx`, `apps/web/app/flights/page.tsx`

- [ ] **Step 1: Create `apps/web/src/components/flights/passenger-selector.tsx`** (client component)

```tsx
"use client";

import { Minus, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  PASSENGER_LIMITS,
  clampCount,
  formatPassengers,
  totalTravellers,
  type PassengerCounts,
  type PassengerGroup,
} from "@/lib/passengers";

const GROUPS: { key: PassengerGroup; label: string; hint: string }[] = [
  { key: "adults", label: "Adults", hint: "12+ years" },
  { key: "children", label: "Children", hint: "2–11 years" },
  { key: "infants", label: "Infants", hint: "Under 2 years" },
];

const MAX_SEATS = 9; // cabin seat cap: adults + children

interface PassengerSelectorProps {
  value: PassengerCounts;
  onChange: (next: PassengerCounts) => void;
}

export function PassengerSelector({ value, onChange }: PassengerSelectorProps) {
  function adjust(group: PassengerGroup, delta: number) {
    const next = clampCount(group, value[group] + delta);
    if (group !== "infants" && next > value[group] && totalTravellers({ ...value, [group]: next }) > MAX_SEATS) {
      return; // seat cap reached
    }
    onChange({ ...value, [group]: next });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 w-full justify-start rounded-field font-normal">
          <Users className="mr-2 size-4" aria-hidden />
          {formatPassengers(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        {GROUPS.map((group) => (
          <div key={group.key} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">{group.label}</p>
              <p className="text-xs text-slate-body">{group.hint}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Decrease ${group.label}`}
                disabled={value[group.key] <= PASSENGER_LIMITS[group.key].min}
                onClick={() => adjust(group.key, -1)}
              >
                <Minus />
              </Button>
              <span className="w-6 text-center text-sm font-semibold" aria-live="polite">{value[group.key]}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Increase ${group.label}`}
                disabled={value[group.key] >= PASSENGER_LIMITS[group.key].max}
                onClick={() => adjust(group.key, 1)}
              >
                <Plus />
              </Button>
            </div>
          </div>
        ))}
        <p className="mt-2 text-xs text-slate-body">Maximum {MAX_SEATS} seated travellers per booking.</p>
      </PopoverContent>
    </Popover>
  );
}
```

This single component replaces the three duplicated selectors in the legacy `script.js`.

- [ ] **Step 2: Create `apps/web/src/components/flights/flight-search-widget.tsx`** (client component)

```tsx
"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PassengerSelector } from "./passenger-selector";
import { buildWhatsAppLink, composeFlightMessage, type FlightLeg, type TripType } from "@/lib/whatsapp";
import type { PassengerCounts } from "@/lib/passengers";

const CLASSES = ["Economy", "Premium Economy", "Business", "First"];
const MIN_LEGS = 2;
const MAX_LEGS = 7;

function emptyLeg(): FlightLeg {
  return { from: "", to: "", departDate: "" };
}

export function FlightSearchWidget() {
  const [tripType, setTripType] = useState<TripType>("roundtrip");
  const [legs, setLegs] = useState<FlightLeg[]>([emptyLeg(), emptyLeg()]);
  const [passengers, setPassengers] = useState<PassengerCounts>({ adults: 1, children: 0, infants: 0 });
  const [cabinClass, setCabinClass] = useState("Economy");
  const [error, setError] = useState<string | null>(null);

  const visibleLegs = tripType === "oneway" ? legs.slice(0, 1) : tripType === "roundtrip" ? legs.slice(0, 2) : legs;

  function updateLeg(index: number, patch: Partial<FlightLeg>) {
    setLegs((prev) => prev.map((leg, i) => (i === index ? { ...leg, ...patch } : leg)));
  }

  function syncLegCount(nextType: TripType) {
    setTripType(nextType);
    setError(null);
    if (nextType === "multicity" && legs.length < MIN_LEGS) setLegs(Array.from({ length: MIN_LEGS }, emptyLeg));
    if (nextType !== "multicity" && legs.length > 2) setLegs(legs.slice(0, 2));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    for (const [index, leg] of visibleLegs.entries()) {
      if (!leg.from.trim() || !leg.to.trim() || !leg.departDate) {
        setError(
          tripType === "multicity"
            ? `Please complete all fields for leg ${index + 1}.`
            : "Please complete all trip fields before continuing.",
        );
        return;
      }
    }
    setError(null);
    const link = buildWhatsAppLink(composeFlightMessage({ tripType, legs: visibleLegs, passengers, cabinClass }));
    window.location.href = link; // same-tab handoff, identical to legacy behavior
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card bg-white p-6 shadow-xl" aria-label="Flight search">
      <Tabs value={tripType} onValueChange={(value) => syncLegCount(value as TripType)}>
        <TabsList className="rounded-field">
          <TabsTrigger value="roundtrip" className="rounded-pill data-[state=active]:bg-brand-orange data-[state=active]:text-white">Round Trip</TabsTrigger>
          <TabsTrigger value="oneway" className="rounded-pill data-[state=active]:bg-brand-orange data-[state=active]:text-white">One Way</TabsTrigger>
          <TabsTrigger value="multicity" className="rounded-pill data-[state=active]:bg-brand-orange data-[state=active]:text-white">Multi-City</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6 space-y-4">
        {visibleLegs.map((leg, index) => (
          <fieldset key={index} className="grid gap-3 rounded-field border border-black/5 p-4 sm:grid-cols-3">
            {tripType === "multicity" ? <legend className="px-1 text-sm font-semibold text-navy">Leg {index + 1}</legend> : null}
            <div>
              <Label htmlFor={`from-${index}`}>From</Label>
              <Input id={`from-${index}`} placeholder="e.g. Accra" value={leg.from} onChange={(e) => updateLeg(index, { from: e.target.value })} />
            </div>
            <div>
              <Label htmlFor={`to-${index}`}>To</Label>
              <Input id={`to-${index}`} placeholder="e.g. Dubai" value={leg.to} onChange={(e) => updateLeg(index, { to: e.target.value })} />
            </div>
            <div>
              <Label htmlFor={`date-${index}`}>Departure</Label>
              <Input id={`date-${index}`} type="date" value={leg.departDate} onChange={(e) => updateLeg(index, { departDate: e.target.value })} />
            </div>
            {tripType === "multicity" && legs.length > MIN_LEGS ? (
              <Button type="button" variant="ghost" size="sm" className="justify-self-start text-alert" onClick={() => setLegs(legs.filter((_, i) => i !== index))}>
                <Trash2 className="mr-1 size-4" /> Remove leg
              </Button>
            ) : null}
          </fieldset>
        ))}

        {tripType === "multicity" && legs.length < MAX_LEGS ? (
          <Button type="button" variant="outline" className="rounded-pill" onClick={() => setLegs([...legs, emptyLeg()])}>
            <Plus className="mr-1 size-4" /> Add leg ({legs.length}/{MAX_LEGS})
          </Button>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Passengers</Label>
            <PassengerSelector value={passengers} onChange={setPassengers} />
          </div>
          <div>
            <Label>Cabin class</Label>
            <Select value={cabinClass} onValueChange={setCabinClass}>
              <SelectTrigger className="h-10 rounded-field"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CLASSES.map((cabin) => <SelectItem key={cabin} value={cabin}>{cabin}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error ? (
          <p role="alert" className="rounded-field bg-alert-tint px-4 py-2 text-sm text-alert">{error}</p>
        ) : null}

        <Button type="submit" size="lg" className="w-full rounded-pill bg-brand-orange hover:bg-brand-orange/90">
          Continue on WhatsApp
        </Button>
        <p className="text-center text-xs text-slate-body">
          Your trip summary opens in WhatsApp — our agents reply with live options and fares.
        </p>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Create `apps/web/app/flights/page.tsx`**

```tsx
import type { Metadata } from "next/types";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { FlightSearchWidget } from "@/components/flights/flight-search-widget";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Flight Booking",
  description: "Book domestic and international flights with Dellics Travels — IATA-accredited agents, best fares on all major airlines.",
};

const REASONS = [
  { title: "IATA-accredited", copy: "Tickets issued directly by licensed agents — no third-party risk." },
  { title: "Best-fare search", copy: "We compare across Amadeus, Travelport and RateHawk inventories." },
  { title: "24/7 trip support", copy: "Rebooking, refunds and emergencies handled around the clock." },
];

export default function FlightsPage() {
  return (
    <>
      <PageHero title="Book your next flight" subtitle="Tell us where you're going — real agents find the best fares and reply on WhatsApp within minutes." />
      <section className="mx-auto -mt-10 max-w-4xl px-4">
        <FlightSearchWidget />
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeading eyebrow="Why book flights with us" title="More than a booking engine" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REASONS.map((reason) => (
            <div key={reason.title} className="rounded-card border border-black/5 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-navy">{reason.title}</h3>
              <p className="mt-2 text-sm text-slate-body">{reason.copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="rounded-pill">
            <Link href="/inquire">Prefer a detailed inquiry?</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Verify**

```powershell
pnpm exec turbo run check-types --filter=web
pnpm exec turbo run build --filter=web
pnpm --filter web test
```

Expected: all pass.

- [ ] **Step 5: Commit**

```powershell
git add apps/web
git commit -m "feat(web): flights page with whatsapp search widget and shared passenger selector"
```

---

### Task 10: Hotels page — live search against the API

**Files:**
- Create: `apps/web/src/lib/hotels.ts`, `apps/web/src/components/hotels/hotel-search.tsx`, `apps/web/app/hotels/page.tsx`

- [ ] **Step 1: Create `apps/web/src/lib/hotels.ts`**

```ts
import { postJson } from "./api";
import type { HotelSearchInput } from "./schemas";

// Must stay in sync with HotelResult in apps/api/src/hotels/hotels.types.ts
export interface Hotel {
  id: string;
  name: string;
  rating: number;
  address: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  images: string[];
  amenities: string[];
  description: string;
}

export function searchHotels(input: HotelSearchInput): Promise<Hotel[]> {
  return postJson<Hotel[]>("/hotels/search", input);
}
```

- [ ] **Step 2: Create `apps/web/src/components/hotels/hotel-search.tsx`** (client component)

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { searchHotels, type Hotel } from "@/lib/hotels";
import { hotelSearchSchema } from "@/lib/schemas";

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "done"; hotels: Hotel[] };

export function HotelSearch() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = hotelSearchSchema.safeParse({ destination, checkIn, checkOut, guests, rooms });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Please check your search details.");
      return;
    }
    setFieldError(null);
    setStatus({ state: "loading" });
    try {
      const hotels = await searchHotels(parsed.data);
      setStatus({ state: "done", hotels });
    } catch (error) {
      setStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Hotel search failed. Please try again.",
      });
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="rounded-card bg-white p-6 shadow-xl" aria-label="Hotel search">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Label htmlFor="hotel-destination">Destination</Label>
            <Input id="hotel-destination" placeholder="City or hotel name" value={destination} onChange={(e) => setDestination(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="hotel-checkin">Check-in</Label>
            <Input id="hotel-checkin" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="hotel-checkout">Check-out</Label>
            <Input id="hotel-checkout" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="hotel-guests">Guests</Label>
              <Input id="hotel-guests" type="number" min={1} max={16} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
            </div>
            <div>
              <Label htmlFor="hotel-rooms">Rooms</Label>
              <Input id="hotel-rooms" type="number" min={1} max={8} value={rooms} onChange={(e) => setRooms(Number(e.target.value))} />
            </div>
          </div>
        </div>
        {fieldError ? <p role="alert" className="mt-3 rounded-field bg-alert-tint px-4 py-2 text-sm text-alert">{fieldError}</p> : null}
        <Button type="submit" size="lg" disabled={status.state === "loading"} className="mt-4 w-full rounded-pill bg-brand-orange hover:bg-brand-orange/90 sm:w-auto">
          {status.state === "loading" ? "Searching…" : "Search hotels"}
        </Button>
      </form>

      {status.state === "loading" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading results">
          {[0, 1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-card border border-black/5">
              <Skeleton className="h-44 w-full" />
              <div className="space-y-2 p-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {status.state === "error" ? (
        <div role="alert" className="rounded-card bg-alert-tint p-6 text-center">
          <p className="font-semibold text-alert">Hotel availability error</p>
          <p className="mt-1 text-sm text-alert">{status.message}</p>
        </div>
      ) : null}

      {status.state === "done" && status.hotels.length === 0 ? (
        <div className="rounded-card bg-sunrise/40 p-8 text-center">
          <p className="font-display text-lg font-semibold text-navy">No hotels found</p>
          <p className="mt-1 text-sm text-slate-body">Try different dates or a broader destination search.</p>
        </div>
      ) : null}

      {status.state === "done" && status.hotels.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {status.hotels.map((hotel) => (
            <article key={hotel.id} className="overflow-hidden rounded-card border border-black/5 bg-white shadow-sm">
              <div className="relative h-44 bg-slate-body/10">
                {hotel.images[0] ? <Image src={hotel.images[0]} alt={hotel.name} fill className="object-cover" /> : null}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-navy">{hotel.name}</h3>
                  {hotel.rating > 0 ? (
                    <span className="flex items-center gap-1 text-sm text-brand-orange" aria-label={`${hotel.rating} stars`}>
                      <Star className="size-4 fill-current" aria-hidden /> {hotel.rating}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-body">{[hotel.address, hotel.city, hotel.country].filter(Boolean).join(", ")}</p>
                {hotel.description ? <p className="mt-2 line-clamp-2 text-sm text-slate-body">{hotel.description}</p> : null}
                {hotel.price > 0 ? (
                  <p className="mt-3 font-display text-xl font-bold text-brand-orange">
                    {hotel.currency} {hotel.price.toLocaleString()}
                    <span className="text-sm font-normal text-slate-body"> / stay</span>
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-slate-body">Price on request</p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
```

If upstream Ratehawk images come from a host other than `**.ratehawk.com` / `images.unsplash.com`, the build/runtime will surface an `next/image` host error — add exactly that host to `remotePatterns` in `apps/web/next.config.js` then. Do not pre-emptively add hosts.

- [ ] **Step 3: Create `apps/web/app/hotels/page.tsx`**

```tsx
import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { HotelSearch } from "@/components/hotels/hotel-search";

export const metadata: Metadata = {
  title: "Hotels & Airbnb",
  description: "Search live hotel availability worldwide through Dellics Travels' RateHawk partnership — verified stays for every budget.",
};

export default function HotelsPage() {
  return (
    <>
      <PageHero title="Hotels & Airbnb" subtitle="Live availability and honest pricing — no fake listings, no surprises at check-in." />
      <section className="mx-auto -mt-10 max-w-6xl px-4 pb-20">
        <HotelSearch />
      </section>
    </>
  );
}
```

- [ ] **Step 4: Verify**

```powershell
pnpm exec turbo run check-types --filter=web
pnpm exec turbo run build --filter=web
```

Expected: both succeed.

- [ ] **Step 5: Commit**

```powershell
git add apps/web
git commit -m "feat(web): hotels page with live search, loading/empty/error states"
```

---

### Task 11: Content pages — tours, transfers, visa, services, corporate, diaspora

**Files:**
- Create: `apps/web/src/components/{content-sections,cta-banner}.tsx`
- Create: `apps/web/app/{tours,transfers,visa,services,corporate,diaspora}/page.tsx`

**Content rule for every page in this task:** copy the body text VERBATIM from the matching legacy file in `apps/Dellics Travels/Dellics Travels/pages/` (skip header/nav/footer/scripts/inline styles). Do not paraphrase, summarize, or invent copy. If a legacy page has an image, reference the matching file copied into `apps/web/public/images/` in Task 2.

- [ ] **Step 1: Create shared content renderers — `apps/web/src/components/content-sections.tsx`**

```tsx
export interface ContentSection {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

export function ContentSections({ sections }: { sections: ContentSection[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-12 px-4 py-16">
      {sections.map((section, index) => (
        <section key={index}>
          {section.heading ? (
            <h2 className="font-display text-2xl font-bold text-navy">{section.heading}</h2>
          ) : null}
          <div className="mt-4 space-y-4 text-slate-body">
            {section.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          {section.bullets ? (
            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-body">
              {section.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}
```

`apps/web/src/components/cta-banner.tsx`:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CtaBannerProps {
  title: string;
  copy?: string;
  label?: string;
  href?: string;
}

export function CtaBanner({ title, copy, label = "Start an inquiry", href = "/inquire" }: CtaBannerProps) {
  return (
    <section className="bg-navy px-4 py-16 text-center text-white">
      <h2 className="font-display text-3xl font-bold">{title}</h2>
      {copy ? <p className="mx-auto mt-3 max-w-xl text-white/75">{copy}</p> : null}
      <Button asChild size="lg" className="mt-8 rounded-pill bg-brand-orange hover:bg-brand-orange/90">
        <Link href={href}>{label}</Link>
      </Button>
    </section>
  );
}
```

- [ ] **Step 2: Create the six pages**

Each page follows this exact shape — shown here for `apps/web/app/tours/page.tsx` (the others are identical in structure; only metadata, hero text, and the extracted `SECTIONS` content differ):

```tsx
import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { ContentSections, type ContentSection } from "@/components/content-sections";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Tours & Packages",
  description: "Carry over the content of the legacy <meta name=\"description\"> from pages/tours.html.",
};

const SECTIONS: ContentSection[] = [
  // Paste the legacy body copy here, verbatim, grouped by its on-page headings.
  { heading: "…", paragraphs: ["…"], bullets: ["…"] },
];

export default function ToursPage() {
  return (
    <>
      <PageHero title="Tours & Packages" subtitle="Carry over the legacy hero subheading verbatim." />
      <ContentSections sections={SECTIONS} />
      <CtaBanner title="Plan your tour with an expert" />
    </>
  );
}
```

Per-page sources and metadata:

| Route | Legacy source file | Metadata title |
|---|---|---|
| `/tours` | `pages/tours.html` | Tours & Packages |
| `/transfers` | `pages/transfers.html` | Airport Transfers |
| `/visa` | `pages/visa.html` | Visa Assistance |
| `/services` | `pages/services.html` | Our Services |
| `/corporate` | `pages/corporate.html` | Corporate Travel |
| `/diaspora` | `pages/diaspora.html` | Diaspora Travel |

For each: take `title`/`description` from the legacy `<head>`; hero title/subtitle from the legacy hero/banner section; `SECTIONS` from the legacy `<main>` body sections in their original order. The `/services` page additionally renders one card linking to each of `/flights`, `/hotels`, `/tours`, `/transfers`, `/visa`, `/corporate`, `/diaspora` (reuse the card markup from the home `SERVICES` grid in Task 8).

- [ ] **Step 3: Verify**

```powershell
pnpm exec turbo run check-types --filter=web
pnpm exec turbo run build --filter=web
```

Expected: both succeed.

- [ ] **Step 4: Commit**

```powershell
git add apps/web
git commit -m "feat(web): tours, transfers, visa, services, corporate, diaspora content pages"
```

---

### Task 12: Destinations — index + one template for five regions

**Files:**
- Create: `apps/web/src/data/destinations.ts`, `apps/web/app/destinations/page.tsx`, `apps/web/app/destinations/[region]/page.tsx`

- [ ] **Step 1: Create `apps/web/src/data/destinations.ts`**

```ts
export interface DestinationHighlight {
  name: string;
  image: string; // path under public/images/<region>/
  caption?: string;
}

export interface Region {
  slug: "africa" | "asia" | "europe" | "middle-east" | "north-america";
  name: string;
  tagline: string;
  intro: string[];
  highlights: DestinationHighlight[];
}

export const REGIONS: Region[] = [
  {
    slug: "africa",
    name: "Africa",
    tagline: "…", // verbatim from legacy pages/destinations-africa.html hero
    intro: [""], // verbatim legacy intro paragraphs
    highlights: [
      // one entry per destination card in the legacy regional page;
      // image paths point to files copied in Task 2 (kebab-cased)
    ],
  },
  { slug: "asia", name: "Asia", tagline: "…", intro: [""], highlights: [] },
  { slug: "europe", name: "Europe", tagline: "…", intro: [""], highlights: [] },
  { slug: "middle-east", name: "Middle East", tagline: "…", intro: [""], highlights: [] },
  { slug: "north-america", name: "North America", tagline: "…", intro: [""], highlights: [] },
];

export function getRegion(slug: string): Region | undefined {
  return REGIONS.find((region) => region.slug === slug);
}
```

Populate every field by extracting VERBATIM from the five legacy regional pages (`apps/Dellics Travels/Dellics Travels/pages/destinations-africa.html`, `-asia`, `-europe`, `-middle-east`, `-north-america`): hero tagline, intro paragraphs, and the destination cards (name + image + caption). Do not invent destinations. Empty `highlights` is a plan failure — each legacy regional page has its card list; transcribe it.

- [ ] **Step 2: Create `apps/web/app/destinations/page.tsx`**

```tsx
import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { REGIONS } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore Dellics Travels destinations across Africa, Asia, Europe, the Middle East and North America.",
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero title="Destinations" subtitle="Five continents, one trusted travel partner." />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {REGIONS.map((region) => (
          <Link key={region.slug} href={`/destinations/${region.slug}`} className="group relative h-72 overflow-hidden rounded-card">
            {region.highlights[0] ? (
              <Image src={region.highlights[0].image} alt={region.name} fill className="object-cover transition-transform group-hover:scale-105" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="font-display text-2xl font-semibold text-white">{region.name}</h2>
              <p className="mt-1 text-sm text-white/75">{region.tagline}</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
```

- [ ] **Step 3: Create `apps/web/app/destinations/[region]/page.tsx`**

```tsx
import type { Metadata } from "next/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ContentSections } from "@/components/content-sections";
import { CtaBanner } from "@/components/cta-banner";
import { Button } from "@/components/ui/button";
import { REGIONS, getRegion } from "@/data/destinations";

interface RouteParams {
  params: Promise<{ region: string }>;
}

export function generateStaticParams() {
  return REGIONS.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { region } = await params;
  const data = getRegion(region);
  if (!data) return {};
  return { title: `${data.name} Destinations`, description: data.tagline };
}

export default async function RegionPage({ params }: RouteParams) {
  const { region } = await params;
  const data = getRegion(region);
  if (!data) notFound();

  return (
    <>
      <PageHero title={data.name} subtitle={data.tagline} />
      <ContentSections sections={[{ paragraphs: data.intro }]} />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.highlights.map((highlight) => (
            <figure key={highlight.name} className="overflow-hidden rounded-card border border-black/5 bg-white shadow-sm">
              <div className="relative h-52">
                <Image src={highlight.image} alt={highlight.name} fill className="object-cover" />
              </div>
              <figcaption className="p-4">
                <p className="font-display font-semibold text-navy">{highlight.name}</p>
                {highlight.caption ? <p className="mt-1 text-sm text-slate-body">{highlight.caption}</p> : null}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="rounded-pill">
            <Link href="/destinations">All destinations</Link>
          </Button>
        </div>
      </section>
      <CtaBanner title={`Planning a trip to ${data.name}?`} copy="Tell us your dates and budget — we handle flights, stays and experiences." />
    </>
  );
}
```

Invalid slugs (e.g. `/destinations/atlantis`) hit `notFound()` → the Task 7 404 page.

- [ ] **Step 4: Verify**

```powershell
pnpm exec turbo run check-types --filter=web
pnpm exec turbo run build --filter=web
```

Expected: build succeeds and prerenders the 5 region routes (visible in the build output's route table).

- [ ] **Step 5: Commit**

```powershell
git add apps/web
git commit -m "feat(web): destinations index and typed regional pages"
```

---

### Task 13: About, credentials, gallery (+ lightbox)

**Files:**
- Create: `apps/web/src/components/gallery/lightbox.tsx`, `apps/web/src/data/gallery.ts`
- Create: `apps/web/app/{about,credentials,gallery}/page.tsx`

**Content rule:** copy text VERBATIM from `pages/about.html`, `pages/credentials.html`, `pages/gallery.html`.

- [ ] **Step 1: Create `apps/web/src/data/gallery.ts`**

```ts
export interface GalleryItem {
  src: string; // path under public/images/
  alt: string;
}

// One entry per photo shown on the legacy gallery page, using the
// kebab-cased files copied in Task 2. Keep the legacy ordering.
export const GALLERY_ITEMS: GalleryItem[] = [
  // e.g. { src: "/images/services/tanzania.jpg", alt: "Safari in Tanzania" },
];
```

- [ ] **Step 2: Create `apps/web/src/components/gallery/lightbox.tsx`** (client component)

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GalleryItem } from "@/data/gallery";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    lastTriggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (openIndex === null) return;
    closeButtonRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
      if (event.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, items.length, close]);

  return (
    <>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={item.src}
            type="button"
            ref={index === openIndex ? lastTriggerRef : undefined}
            onClick={() => {
              lastTriggerRef.current = undefined; // set below via event currentTarget
              setOpenIndex(index);
            }}
            className="group relative h-56 overflow-hidden rounded-card focus-visible:outline-2 focus-visible:outline-brand-orange"
            aria-label={`Open image: ${item.alt}`}
          >
            <Image src={item.src} alt={item.alt} fill className="object-cover transition-transform group-hover:scale-105" />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={items[openIndex].alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <Button ref={closeButtonRef} variant="ghost" size="icon" className="absolute right-4 top-4 text-white" onClick={close} aria-label="Close">
            <X />
          </Button>
          <Button variant="ghost" size="icon" className="absolute left-4 text-white" aria-label="Previous image" onClick={() => setOpenIndex((openIndex - 1 + items.length) % items.length)}>
            <ChevronLeft />
          </Button>
          <div className="relative h-[75vh] w-full max-w-4xl">
            <Image src={items[openIndex].src} alt={items[openIndex].alt} fill className="object-contain" />
          </div>
          <Button variant="ghost" size="icon" className="absolute right-4 text-white" aria-label="Next image" onClick={() => setOpenIndex((openIndex + 1) % items.length)}>
            <ChevronRight />
          </Button>
        </div>
      ) : null}
    </>
  );
}
```

Simplify the trigger-focus bookkeeping however you prefer, but keep: Esc closes, arrow keys navigate, backdrop click closes, focus returns to the trigger.

- [ ] **Step 3: Create `apps/web/app/gallery/page.tsx`**

```tsx
import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { GalleryGrid } from "@/components/gallery/lightbox";
import { GALLERY_ITEMS } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Dellics Travels tours, trips and partner hotels around the world.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero title="Gallery" subtitle="Moments from journeys we've planned." />
      <GalleryGrid items={GALLERY_ITEMS} />
    </>
  );
}
```

- [ ] **Step 4: Create `apps/web/app/about/page.tsx` and `apps/web/app/credentials/page.tsx`**

Both use the Task 11 pattern (`PageHero` + `ContentSections` + `CtaBanner`), with verbatim copy from `pages/about.html` and `pages/credentials.html`. The credentials page additionally renders the `AccreditationStrip` component directly above its `CtaBanner`, plus one card per accreditation listed on the legacy page (name + short description, transcribed verbatim).

Metadata titles: `About Us`, `Our Credentials` (take descriptions from the legacy `<head>`).

- [ ] **Step 5: Verify**

```powershell
pnpm exec turbo run check-types --filter=web
pnpm exec turbo run build --filter=web
```

Expected: both succeed.

- [ ] **Step 6: Commit**

```powershell
git add apps/web
git commit -m "feat(web): about, credentials, gallery pages with accessible lightbox"
```

---

### Task 14: Contact + inquire — real, validated, persisted forms

**Files:**
- Create: `apps/web/src/components/forms/{contact-form,inquire-form}.tsx`
- Create: `apps/web/app/contact/page.tsx`, `apps/web/app/inquire/page.tsx`

- [ ] **Step 1: Create `apps/web/src/components/forms/contact-form.tsx`** (client component)

```tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { postJson } from "@/lib/api";
import { contactSchema } from "@/lib/schemas";

export function ContactForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setPending(true);
    try {
      // drop blank optional fields — the API DTO regexes reject empty strings
      const payload = Object.fromEntries(
        Object.entries(parsed.data).filter(([, value]) => value !== ""),
      );
      await postJson("/inquiries", { ...payload, kind: "CONTACT" });
      toast.success("Message sent — we'll reply shortly.");
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sending failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" name="name" required autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div>
        <Label htmlFor="contact-phone">Phone (optional)</Label>
        <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div>
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" name="message" required rows={5} minLength={10} />
      </div>
      <Button type="submit" size="lg" disabled={pending} className="rounded-pill bg-brand-orange hover:bg-brand-orange/90">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Create `apps/web/src/components/forms/inquire-form.tsx`** (client component)

Same structure as `ContactForm`, plus three fields before the message:

```tsx
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="inquire-destination">Destination</Label>
          <Input id="inquire-destination" name="destination" placeholder="e.g. Zanzibar" />
        </div>
        <div>
          <Label htmlFor="inquire-date">Travel date</Label>
          <Input id="inquire-date" name="travelDate" type="date" />
        </div>
        <div>
          <Label htmlFor="inquire-travelers">Travellers</Label>
          <Input id="inquire-travelers" name="travelers" placeholder="e.g. 2 Adults" />
        </div>
      </div>
```

Use `inquireSchema`, send `{ ...payload, kind: "INQUIRY" }` where `payload` is built with the same blank-optional-filtering shown in `ContactForm` (the API DTO's date/phone regexes reject empty strings), success toast "Inquiry received — an expert will contact you shortly."

- [ ] **Step 3: Mount Toaster — add to `apps/web/app/layout.tsx` inside `<body>` after `<SiteFooter />`**

```tsx
import { Toaster } from "@/components/ui/sonner";
// ...
        <SiteFooter />
        <Toaster richColors position="top-center" />
```

- [ ] **Step 4: Create `apps/web/app/contact/page.tsx`**

```tsx
import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Reach Dellics Travels by form, phone or WhatsApp — we reply fast.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact Us" subtitle="Questions, quotes or emergencies — we're here 24/7." />
      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-16 lg:grid-cols-[1fr_320px]">
        <ContactForm />
        <aside className="space-y-6 rounded-card bg-navy p-6 text-white">
          <div>
            <h2 className="font-display text-lg font-semibold text-brand-orange">Direct lines</h2>
            <p className="mt-2 text-sm text-white/80">{SITE.phoneDisplay}</p>
            <p className="text-sm text-white/80">{SITE.email}</p>
            <p className="text-sm text-white/80">{SITE.address}</p>
          </div>
          <p className="text-sm text-white/60">Form messages are stored and emailed to our team — no message gets lost.</p>
        </aside>
      </section>
    </>
  );
}
```

- [ ] **Step 5: Create `apps/web/app/inquire/page.tsx`**

```tsx
import type { Metadata } from "next/types";
import { PageHero } from "@/components/page-hero";
import { InquireForm } from "@/components/forms/inquire-form";

export const metadata: Metadata = {
  title: "Inquire",
  description: "Tell Dellics Travels what you want to book — flights, tours, hotels or a full package.",
};

export default function InquirePage() {
  return (
    <>
      <PageHero title="Start your inquiry" subtitle="Share the basics — a travel expert replies with tailored options and pricing." />
      <section className="mx-auto max-w-2xl px-4 py-16">
        <InquireForm />
      </section>
    </>
  );
}
```

- [ ] **Step 6: Verify**

```powershell
pnpm exec turbo run check-types --filter=web
pnpm exec turbo run build --filter=web
```

Expected: both succeed.

- [ ] **Step 7: Commit**

```powershell
git add apps/web
git commit -m "feat(web): contact and inquire forms posting to api /inquiries"
```

---

### Task 15: Privacy, terms, admin stub, sitemap, robots

**Files:**
- Create: `apps/web/app/{privacy,terms,admin}/page.tsx`, `apps/web/app/sitemap.ts`, `apps/web/app/robots.ts`

**Content rule:** privacy and terms copy come VERBATIM from `pages/privacy.html` and `pages/terms.html`.

- [ ] **Step 1: Create `apps/web/app/privacy/page.tsx` and `apps/web/app/terms/page.tsx`**

Both use the Task 11 pattern (`PageHero` + `ContentSections`), sections extracted verbatim from the legacy pages in original order. Metadata titles: `Privacy Policy`, `Terms of Service` (descriptions from the legacy `<head>`).

- [ ] **Step 2: Create `apps/web/app/admin/page.tsx`**

```tsx
import type { Metadata } from "next/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "The Dellics Travels admin portal is a separate application.",
  robots: { index: false },
};

export default function AdminPage() {
  return (
    <section className="bg-ink px-4 py-32 text-center text-white">
      <h1 className="font-display text-4xl font-bold">Admin portal</h1>
      <p className="mx-auto mt-4 max-w-md text-white/70">
        The Dellics Travels admin portal is a separate application and is not
        hosted on this website.
      </p>
      <Button asChild className="mt-8 rounded-pill bg-brand-orange hover:bg-brand-orange/90">
        <Link href="/">Back to home</Link>
      </Button>
    </section>
  );
}
```

- [ ] **Step 3: Create `apps/web/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.dellicstravels.com"; // confirm the production domain with the user before deploy

const STATIC_ROUTES = [
  "/",
  "/flights",
  "/hotels",
  "/tours",
  "/transfers",
  "/visa",
  "/destinations",
  "/destinations/africa",
  "/destinations/asia",
  "/destinations/europe",
  "/destinations/middle-east",
  "/destinations/north-america",
  "/corporate",
  "/diaspora",
  "/services",
  "/credentials",
  "/gallery",
  "/about",
  "/contact",
  "/inquire",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
```

`/admin` is deliberately excluded (noindex stub).

- [ ] **Step 4: Create `apps/web/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.dellicstravels.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 5: Verify**

```powershell
pnpm exec turbo run check-types --filter=web
pnpm exec turbo run build --filter=web
```

Expected: both succeed; `/sitemap.xml` and `/robots.txt` appear as routes in the build output.

- [ ] **Step 6: Commit**

```powershell
git add apps/web
git commit -m "feat(web): privacy, terms, admin stub, sitemap and robots"
```

---

### Task 16: Full verification — monorepo gates + live endpoint checks

**Files:** none (verification only; fix anything that fails before proceeding)

- [ ] **Step 1: Monorepo static gates**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels"
pnpm check-types
pnpm lint
pnpm build
```

Expected: all three succeed for every workspace (web, api, docs-less packages). Fix any failure in place before continuing.

- [ ] **Step 2: Unit tests**

```powershell
pnpm --filter api test
pnpm --filter web test
```

Expected: all green.

- [ ] **Step 3: Start the API (background)**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\api"
$env:RATEHAWK_API_ID = "<value from apps/api/.env>"
$env:RATEHAWK_API_KEY = "<value from apps/api/.env>"
pnpm start:dev
```

Expected: `Nest application successfully started` on port 3000. (If the DB is unreachable and the Inquiry migration from Task 3 was never applied, apply it now via `supabase db push` or `prisma db push` before testing `/inquiries`.)

- [ ] **Step 4: Endpoint checks — open a SECOND terminal**

Invalid hotel search (dates reversed) must be rejected:

```powershell
curl.exe -s -X POST http://localhost:3000/hotels/search -H "Content-Type: application/json" -d '{"destination":"Accra","checkIn":"2099-01-08","checkOut":"2099-01-01","guests":2,"rooms":1}'
```

Expected: HTTP 400 body containing `Check-out date must be after check-in.`

Valid hotel search:

```powershell
curl.exe -s -X POST http://localhost:3000/hotels/search -H "Content-Type: application/json" -d '{"destination":"Dubai","checkIn":"2099-01-01","checkOut":"2099-01-08","guests":2,"rooms":1}'
```

Expected: a JSON array in the normalized shape (`id, name, rating, …`) — or a 502 with the friendly BadGateway message if the Ratehawk sandbox is unreachable. Both are acceptable; a silent mock list is NOT.

Valid inquiry:

```powershell
curl.exe -s -X POST http://localhost:3000/inquiries -H "Content-Type: application/json" -d '{"kind":"CONTACT","name":"Test User","email":"test@example.com","message":"Verification test message."}'
```

Expected: HTTP 201 with `{"received":true}`.

Invalid inquiry (bad email):

```powershell
curl.exe -s -X POST http://localhost:3000/inquiries -H "Content-Type: application/json" -d '{"kind":"CONTACT","name":"Test","email":"not-an-email","message":"Verification test message."}'
```

Expected: HTTP 400.

(Single-quoted JSON bodies are intentional — PowerShell passes them through verbatim to `curl.exe`; double quotes inside `-d "..."` get mangled.)

- [ ] **Step 5: Verify the inquiry persisted**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels\packages\database"
pnpm exec prisma studio
```

Open the `Inquiry` table — the `Test User` row must exist with `kind CONTACT`. Close studio afterwards. (Alternative: query via Supabase dashboard / `psql` if preferred.)

- [ ] **Step 6: Start the web app (third terminal)**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels\apps\web"
pnpm dev
```

Expected: ready on `http://localhost:3001`.

- [ ] **Step 7: Browser verification checklist** (use the preview browser; every item must pass)

1. `/` — hero slider autoplays, video slides advance on `ended`, QuickBook tabs switch, all images load (no broken `next/image`)
2. Header dropdowns open; mobile sheet opens and all links work; active route is highlighted
3. All 19 routes render: `/flights /hotels /tours /transfers /visa /destinations /destinations/{africa,asia,europe,middle-east,north-america} /corporate /diaspora /services /credentials /gallery /about /contact /inquire /privacy /terms /admin`
4. `/destinations/atlantis` shows the 404 page
5. `/flights` — switch trip types; multi-city adds/removes legs (2–7); passenger counts respect limits; submit navigates to `wa.me/233552054174` with the encoded trip summary
6. `/hotels` — invalid dates show the client error; valid search shows skeletons then results or the error card (never fake data)
7. `/contact` + `/inquire` — empty submit shows validation toasts; valid submit shows success toast and the row appears in the DB (already proven in Step 5)
8. `/gallery` — lightbox opens, Esc closes, arrows navigate
9. `/sitemap.xml` and `/robots.txt` respond with correct content

- [ ] **Step 8: Stop both dev servers, commit verification note**

```powershell
git commit --allow-empty -m "chore: verification passed for web restructure"
```

(Only if no code changed during verification; otherwise commit the fixes with descriptive messages first.)

---

### Task 17: Cutover — delete the legacy site

**Files:**
- Delete: `apps/Dellics Travels/` (entire folder)

Precondition: every Task 16 check passed. All legacy content survives in git history.

- [ ] **Step 1: Delete via git so history is preserved cleanly**

```powershell
cd "c:\Users\Dell\Desktop\PROjects\Dellics Travels"
git rm -r "apps/Dellics Travels"
```

- [ ] **Step 2: Confirm nothing referenced it**

```powershell
pnpm build
pnpm check-types
```

Expected: both succeed — proves no remaining import/path dependency on the deleted folder.

- [ ] **Step 3: Final secret sweep**

```powershell
git grep -i "RATEHAWK_API_KEY" -- . ":(exclude)apps/api/.env.example"
```

Expected: zero hits outside `apps/api/.env.example` (and `.env`, which is untracked and never searched). If any file still embeds a credential, remove it before committing.

- [ ] **Step 4: Commit**

```powershell
git commit -m "chore: remove legacy static site after verified web restructure"
```

- [ ] **Step 5: User actions (outside code)**

1. Rotate the leaked Ratehawk sandbox key in the Ratehawk dashboard and update `apps/api/.env` — the old key was public in browser code and must be treated as compromised.
2. Set `RESEND_API_KEY` + `INQUIRY_NOTIFY_EMAIL` in the API's production environment for inquiry notifications.
3. Confirm the production domain used in `app/sitemap.ts` / `app/robots.ts` (`BASE_URL` constant) before deploying.
