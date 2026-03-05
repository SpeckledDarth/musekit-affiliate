# @musekit/affiliate

## Overview

This is the `@musekit/affiliate` package — a standalone affiliate/referral program module for the MuseKit SaaS platform. It provides both an affiliate user dashboard and an admin panel for managing the affiliate program.

## Tech Stack

- **Framework**: Next.js 14.2.18 (App Router)
- **UI**: React 18.3.1, Tailwind CSS 3.4.16
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (real database integration via API routes)
- **Payments**: Stripe (for commission tracking)
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js pages (App Router)
│   ├── affiliate/          # Affiliate dashboard (11 pages)
│   ├── admin/affiliates/   # Admin panel (12 pages)
│   └── api/                # API routes (server-side data access)
│       ├── affiliate/      # Affiliate-facing API endpoints
│       └── admin/affiliates/ # Admin API endpoints
├── components/ui/          # Shared UI components
├── core/                   # Business logic (tracking, commissions)
├── lib/                    # Supabase client, queries, mutations, API client
│   ├── supabase.ts         # Supabase client initialization
│   ├── queries.ts          # Read operations (server-side only)
│   ├── mutations.ts        # Write operations (server-side only)
│   └── api-client.ts       # Client-side API wrapper (fetch-based)
├── types/                  # TypeScript interfaces
└── index.ts                # Package exports
```

## Architecture

- **Data access pattern**: All Supabase queries run server-side in Next.js API routes (`src/app/api/`). Client components use `src/lib/api-client.ts` to fetch data via HTTP. This avoids exposing Supabase keys to the browser.
- **Server-side**: `src/lib/queries.ts` (reads) and `src/lib/mutations.ts` (writes) use Supabase service client
- **Client-side**: `src/lib/api-client.ts` provides a typed `api` object that calls the API routes
- **Amounts**: Stored in cents in the database (e.g., `commission_amount_cents`, `amount_cents`, `total_earnings_cents`)

## Running

```bash
npm run dev     # Development server on port 5000
npm run build   # Production build
npm start       # Production server on port 5000
```

## Key Routes

### Affiliate Dashboard (/affiliate)
- `/affiliate` — Overview dashboard
- `/affiliate/analytics` — Charts & performance metrics
- `/affiliate/referrals` — Referral tracking
- `/affiliate/earnings` — Commission history
- `/affiliate/payouts` — Payout history
- `/affiliate/resources` — Marketing materials
- `/affiliate/tools` — Link generator, embed codes
- `/affiliate/news` — Announcements
- `/affiliate/messages` — Admin messaging
- `/affiliate/settings` — Account settings
- `/affiliate/support` — Support tickets

### Admin Panel (/admin/affiliates)
- `/admin/affiliates` — Program overview
- `/admin/affiliates/applications` — Application review
- `/admin/affiliates/members` — Member management
- `/admin/affiliates/settings` — Program settings
- `/admin/affiliates/assets` — Marketing assets
- `/admin/affiliates/milestones` — Achievement definitions
- `/admin/affiliates/tiers` — Commission tiers
- `/admin/affiliates/broadcasts` — Announcements
- `/admin/affiliates/networks` — Network integrations
- `/admin/affiliates/contests` — Promotional campaigns
- `/admin/affiliates/payout-runs` — Batch payouts
- `/admin/affiliates/discount-codes` — Discount codes

## Environment Variables

All required secrets are configured:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_APP_URL`

## Database Tables

Real Supabase tables: `referral_links`, `affiliate_referrals`, `affiliate_commissions`, `affiliate_payouts`, `affiliate_tiers`, `affiliate_milestones`, `affiliate_assets`, `affiliate_broadcasts`, `affiliate_messages`, `affiliate_applications`, `affiliate_contests`, `discount_codes`, `announcements`, `tickets`, `affiliate_payout_batches`, `affiliate_payout_items`, `profiles`.

## Notes

- UI components are self-contained in `src/components/ui/` until `@musekit/design-system` is available.
- Core business logic is in `src/core/index.ts`.
- DataTable component uses `any` types to avoid type incompatibility across different table schemas.
- `frame-ancestors *` in next.config.js is intentional for Replit proxy iframe embedding.
