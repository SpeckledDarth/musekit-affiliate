# @musekit/affiliate

Affiliate/referral program module for the MuseKit SaaS platform.

## Overview

This package provides a complete affiliate management system including:
- Affiliate user dashboard (earnings, referrals, analytics, payouts, tools)
- Admin panel (applications, members, tiers, contests, payouts, discount codes)
- Core referral tracking and commission calculation logic

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
│   └── admin/affiliates/   # Admin panel
│       ├── applications/   # Review/approve/reject
│       ├── assets/         # Marketing asset management
│       ├── broadcasts/     # Send announcements
│       ├── contests/       # Promotional campaigns
│       ├── discount-codes/ # Discount code management
│       ├── members/        # Active affiliate list
│       ├── milestones/     # Achievement definitions
│       ├── networks/       # Network integrations
│       ├── payout-runs/    # Batch payment processing
│       ├── settings/       # Program configuration
│       └── tiers/          # Commission tier management
├── components/ui/          # Shared UI components
├── core/                   # Business logic
├── lib/                    # Utilities (Supabase client, mock data)
└── types/                  # TypeScript type definitions
```

## Core Functions

- `trackReferral(referralCode, visitorId)` — Record a referral click
- `attributeConversion(userId, referralCode)` — Link signup to affiliate
- `calculateCommission(saleAmount, affiliateTier)` — Compute earnings
- `processPayoutRun(affiliateIds)` — Batch payout calculation
- `generateReferralLink(affiliateId, campaign?)` — Create tracking URL
- `validateReferralCode(code)` — Check if code is valid

## Required Supabase Tables

The following tables are needed but may not yet exist in the database.
**Do NOT create these tables directly** — they should be managed through migrations.

### affiliates
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | FK to auth.users |
| name | text | Affiliate name |
| email | text | Contact email |
| referral_code | text | Unique referral code |
| tier | text | bronze/silver/gold/platinum |
| status | text | pending/active/suspended/rejected |
| commission_rate | numeric | Commission percentage |
| total_earnings | numeric | Lifetime earnings |
| pending_earnings | numeric | Unpaid earnings |
| total_clicks | integer | Total referral clicks |
| total_conversions | integer | Total conversions |
| payment_method | text | Payment method preference |
| payment_email | text | Payment email |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |

### affiliate_referrals
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| affiliate_id | uuid | FK to affiliates |
| visitor_id | text | Unique visitor identifier |
| referral_code | text | Code used |
| ip_address | inet | Visitor IP |
| user_agent | text | Browser user agent |
| landing_page | text | Landing page URL |
| clicked_at | timestamptz | Click timestamp |
| converted | boolean | Whether converted |
| converted_at | timestamptz | Conversion timestamp |
| converted_user_id | uuid | FK to auth.users |

### affiliate_conversions
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| affiliate_id | uuid | FK to affiliates |
| referral_id | uuid | FK to affiliate_referrals |
| user_id | uuid | FK to auth.users |
| sale_amount | numeric | Sale amount |
| commission_amount | numeric | Commission earned |
| status | text | pending/approved/rejected/paid |
| created_at | timestamptz | Created timestamp |

### affiliate_payouts
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| affiliate_id | uuid | FK to affiliates |
| amount | numeric | Payout amount |
| status | text | pending/processing/completed/failed |
| payment_method | text | Payment method used |
| transaction_id | text | External transaction ID |
| processed_at | timestamptz | Processing timestamp |
| created_at | timestamptz | Created timestamp |

### affiliate_payout_runs
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| total_amount | numeric | Total payout amount |
| affiliate_count | integer | Number of affiliates |
| status | text | pending/processing/completed/failed |
| processed_by | uuid | Admin who processed |
| created_at | timestamptz | Created timestamp |
| completed_at | timestamptz | Completion timestamp |

### affiliate_tiers
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Tier name |
| slug | text | URL-safe slug |
| commission_rate | numeric | Commission percentage |
| min_sales | integer | Minimum sales required |
| min_revenue | numeric | Minimum revenue required |
| benefits | jsonb | Array of benefit strings |

### affiliate_milestones
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Milestone name |
| description | text | Description |
| requirement_type | text | sales/revenue/referrals |
| requirement_value | numeric | Required amount |
| reward_type | text | bonus/tier_upgrade/badge |
| reward_value | text | Reward description |

### affiliate_marketing_assets
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Asset name |
| type | text | banner/text/email/social |
| content | text | Content or URL |
| preview_url | text | Preview image URL |
| dimensions | text | Dimensions (for banners) |
| created_at | timestamptz | Created timestamp |

### affiliate_discount_codes
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| code | text | Discount code |
| affiliate_id | uuid | FK to affiliates (nullable) |
| discount_type | text | percentage/fixed |
| discount_value | numeric | Discount amount |
| max_uses | integer | Max uses (nullable = unlimited) |
| current_uses | integer | Current use count |
| expires_at | timestamptz | Expiration (nullable = never) |
| status | text | active/expired/disabled |
| created_at | timestamptz | Created timestamp |

### affiliate_contests
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Contest name |
| description | text | Description |
| start_date | timestamptz | Start date |
| end_date | timestamptz | End date |
| prize_description | text | Prize details |
| status | text | draft/active/ended |
| metric | text | clicks/conversions/revenue |

### affiliate_broadcasts
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Broadcast title |
| content | text | Broadcast content |
| sent_by | uuid | FK to admin user |
| sent_at | timestamptz | Sent timestamp |
| recipient_count | integer | Number of recipients |

### affiliate_messages
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| affiliate_id | uuid | FK to affiliates |
| sender_type | text | affiliate/admin |
| subject | text | Message subject |
| content | text | Message body |
| read | boolean | Read status |
| created_at | timestamptz | Created timestamp |

### affiliate_support_tickets
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| affiliate_id | uuid | FK to affiliates |
| subject | text | Ticket subject |
| description | text | Ticket description |
| status | text | open/in_progress/resolved/closed |
| priority | text | low/medium/high |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |

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

Currently using local UI components and mock data until these packages are available.
