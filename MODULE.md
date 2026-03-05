# @musekit/affiliate

Affiliate/referral program module for the MuseKit SaaS platform.

## Overview

This package provides a complete affiliate management system including:
- Affiliate user dashboard (earnings, referrals, analytics, payouts, tools)
- Admin panel (applications, members, tiers, contests, payouts, discount codes)
- Core referral tracking and commission calculation logic
- Real Supabase database integration via Next.js API routes

## Tech Stack

- Next.js 14.2.18
- React 18.3.1
- Tailwind CSS 3.4.x
- TypeScript (strict mode)
- Supabase (database & auth)
- Stripe (payment tracking)
- Recharts (analytics charts)
- Lucide React (icons)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── affiliate/          # Affiliate user dashboard
│   │   ├── analytics/      # Charts and performance metrics
│   │   ├── earnings/       # Commission history
│   │   ├── messages/       # Affiliate-admin messaging
│   │   ├── news/           # Broadcasts/announcements
│   │   ├── payouts/        # Payout history
│   │   ├── referrals/      # Referral tracking
│   │   ├── resources/      # Marketing materials
│   │   ├── settings/       # Account settings
│   │   ├── support/        # Support tickets
│   │   └── tools/          # Link generator, embed codes
│   ├── admin/affiliates/   # Admin panel
│   │   ├── applications/   # Review/approve/reject
│   │   ├── assets/         # Marketing asset management
│   │   ├── broadcasts/     # Send announcements
│   │   ├── contests/       # Promotional campaigns
│   │   ├── discount-codes/ # Discount code management
│   │   ├── members/        # Active affiliate list
│   │   ├── milestones/     # Achievement definitions
│   │   ├── networks/       # Network integrations
│   │   ├── payout-runs/    # Batch payment processing
│   │   ├── settings/       # Program configuration
│   │   └── tiers/          # Commission tier management
│   └── api/                # Server-side API routes
│       ├── affiliate/      # Affiliate-facing endpoints
│       └── admin/affiliates/ # Admin endpoints
├── components/ui/          # Shared UI components
├── core/                   # Business logic
├── lib/                    # Data access layer
│   ├── supabase.ts         # Supabase client (server-side)
│   ├── queries.ts          # Read operations
│   ├── mutations.ts        # Write operations
│   └── api-client.ts       # Client-side API wrapper
└── types/                  # TypeScript type definitions
```

## Architecture

### Data Flow
1. Client components import `api` from `@/lib/api-client`
2. `api` methods call Next.js API routes via fetch
3. API routes import from `@/lib/queries` and `@/lib/mutations`
4. Queries/mutations use Supabase service client (server-side only)

This architecture ensures Supabase credentials never reach the browser.

### Database Conventions
- Monetary amounts stored in cents (e.g., `commission_amount_cents`, `amount_cents`, `total_earnings_cents`)
- Client-side formatting converts cents to dollars for display
- Referral links use `user_id` as join key

## Core Functions

- `trackReferral(referralCode, visitorId)` — Record a referral click
- `attributeConversion(userId, referralCode)` — Link signup to affiliate
- `calculateCommission(saleAmount, affiliateTier)` — Compute earnings
- `processPayoutRun(affiliateIds)` — Batch payout calculation
- `generateReferralLink(affiliateId, campaign?)` — Create tracking URL
- `validateReferralCode(code)` — Check if code is valid

## Database Tables

Real Supabase tables used by this module:

| Table | Purpose |
|-------|---------|
| `referral_links` | Affiliate referral links and codes |
| `affiliate_referrals` | Referral click/conversion tracking |
| `affiliate_commissions` | Commission records |
| `affiliate_payouts` | Individual payout records |
| `affiliate_payout_batches` | Batch payout runs |
| `affiliate_payout_items` | Items within a payout batch |
| `affiliate_tiers` | Commission tier definitions |
| `affiliate_milestones` | Achievement/milestone definitions |
| `affiliate_assets` | Marketing materials |
| `affiliate_broadcasts` | Admin announcements |
| `affiliate_messages` | Affiliate-admin messaging |
| `affiliate_applications` | Affiliate signup applications |
| `affiliate_contests` | Promotional contest definitions |
| `discount_codes` | Discount/coupon codes |
| `announcements` | General announcements |
| `tickets` | Support tickets |
| `profiles` | User profile data |

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `STRIPE_SECRET_KEY` — Stripe secret key for commission tracking
- `NEXT_PUBLIC_APP_URL` — Application base URL

## Dependencies (Planned)

When the MuseKit ecosystem packages are published:
- `@musekit/shared` — Shared utilities
- `@musekit/database` — Database client and queries
- `@musekit/design-system` — UI component library
- `@musekit/billing` — Billing integration

Currently using local UI components until these packages are available.
