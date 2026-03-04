# @musekit/affiliate

## Overview

This is the `@musekit/affiliate` package — a standalone affiliate/referral program module for the MuseKit SaaS platform. It provides both an affiliate user dashboard and an admin panel for managing the affiliate program.

## Tech Stack

- **Framework**: Next.js 14.2.18 (App Router)
- **UI**: React 18.3.1, Tailwind CSS 3.4.16
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (currently using mock data)
- **Payments**: Stripe (for commission tracking)
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js pages (App Router)
│   ├── affiliate/          # Affiliate dashboard (11 pages)
│   └── admin/affiliates/   # Admin panel (12 pages)
├── components/ui/          # Shared UI components
├── core/                   # Business logic (tracking, commissions)
├── lib/                    # Supabase client, mock data
├── types/                  # TypeScript interfaces
└── index.ts                # Package exports
```

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

## Notes

- Currently uses mock data (see `src/lib/mock-data.ts`). Database tables are documented in `MODULE.md`.
- UI components are self-contained in `src/components/ui/` until `@musekit/design-system` is available.
- Core business logic is in `src/core/index.ts`.
