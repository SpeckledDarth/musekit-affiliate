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
- **Toasts**: Sonner
- **QR Codes**: qrcode.react

## Project Structure

```
src/
├── app/                    # Next.js pages (App Router)
│   ├── affiliate/          # Affiliate dashboard (11 pages)
│   ├── admin/affiliates/   # Admin panel (12 pages)
│   └── api/                # API routes (server-side data access)
│       ├── affiliate/      # Affiliate-facing API endpoints
│       └── admin/affiliates/ # Admin API endpoints
├── components/ui/          # Shared UI components (15 components)
│   ├── badge.tsx           # Status badges
│   ├── button.tsx          # Primary/secondary/ghost buttons
│   ├── card.tsx            # Card container
│   ├── confirm-dialog.tsx  # Delete/action confirmation modal
│   ├── data-table.tsx      # Full-featured DataTable (sort/search/filter/paginate/select)
│   ├── empty-state.tsx     # Empty state with icon, message, optional action
│   ├── input.tsx           # Form input with label, error state, icon
│   ├── loading-skeleton.tsx # Skeleton loaders (line, card, table)
│   ├── modal.tsx           # Modal dialog with overlay, body scroll lock
│   ├── search-input.tsx    # Debounced search input with clear button
│   ├── select.tsx          # Select dropdown with label
│   ├── stat-card.tsx       # Metric display card
│   ├── tabs.tsx            # Tab switcher for detail views
│   ├── textarea.tsx        # Multi-line input with label
│   └── toast.tsx           # Toast provider (Sonner) + toast helper
├── core/                   # Business logic (tracking, commissions)
├── hooks/                  # Custom React hooks
│   ├── use-debounce.ts     # Debounce hook for search inputs
│   └── use-unsaved-changes.ts # Warn on navigating away from dirty forms
├── lib/                    # Supabase client, queries, mutations, API client
│   ├── supabase.ts         # Supabase client initialization
│   ├── queries.ts          # Read operations (server-side only)
│   ├── mutations.ts        # Write operations (server-side only)
│   ├── api-client.ts       # Client-side API wrapper (fetch-based, full CRUD)
│   └── format.ts           # Formatting utilities (formatCents, formatDate, relativeTime, etc.)
├── types/                  # TypeScript interfaces
├── dashboard/index.ts      # Barrel exports for affiliate dashboard pages
├── admin/index.ts          # Barrel exports for admin panel pages
└── index.ts                # Package root exports
```

## Architecture

- **Data access pattern**: All Supabase queries run server-side in Next.js API routes (`src/app/api/`). Client components use `src/lib/api-client.ts` to fetch data via HTTP. This avoids exposing Supabase keys to the browser.
- **Server-side**: `src/lib/queries.ts` (reads) and `src/lib/mutations.ts` (writes) use Supabase service client
- **Client-side**: `src/lib/api-client.ts` provides a typed `api` object with full CRUD for all entities (GET, POST, PUT, DELETE)
- **Amounts**: Stored in cents in the database (e.g., `commission_amount_cents`, `amount_cents`, `total_earnings_cents`). Use `formatCents()` from `src/lib/format.ts` to display.

## DataTable Component

The `DataTable` component (`src/components/ui/data-table.tsx`) is the core table display for all list pages. Features:
- **Column sorting**: Click headers to sort asc/desc/none with visual indicators
- **Search**: Built-in debounced search across all text columns
- **Filter dropdowns**: Configurable filter chips for status, type, etc.
- **Pagination**: 25 rows/page with prev/next and page indicator
- **Row click**: Optional `onRowClick` for navigation to detail views
- **Checkbox selection**: Optional `selectable` prop for bulk actions
- **Loading/empty states**: Skeleton rows when loading, EmptyState when no data

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

## API Routes (Full CRUD)

### Affiliate-facing
- `GET/POST /api/affiliate/messages` — Messages + send/mark-read
- `GET/POST /api/affiliate/support-tickets` — Tickets + create/update-status
- `GET /api/affiliate/stats`, `/referral-links`, `/referrals`, `/commissions`, `/payouts`, `/resources`, `/broadcasts`, `/announcements`, `/tiers`, `/milestones`
- `GET/POST /api/affiliate/profile` — Profile read/update

### Admin
- `GET/POST/PUT/DELETE /api/admin/affiliates/tiers` — Full CRUD
- `GET/POST/PUT/DELETE /api/admin/affiliates/milestones` — Full CRUD
- `GET/POST/PUT/DELETE /api/admin/affiliates/contests` — Full CRUD
- `GET/POST/PUT/DELETE /api/admin/affiliates/broadcasts` — Full CRUD
- `GET/POST/PUT/DELETE /api/admin/affiliates/assets` — Full CRUD
- `GET/POST/PUT/DELETE /api/admin/affiliates/discount-codes` — Full CRUD
- `GET/POST /api/admin/affiliates/payout-batches` — Read + create
- `GET/POST /api/admin/affiliates/applications` — Read + update status
- `GET /api/admin/affiliates/overview`, `/list`

## Environment Variables

All required secrets are configured:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_APP_URL`

## Database Tables

Real Supabase tables: `referral_links`, `affiliate_referrals`, `affiliate_commissions`, `affiliate_payouts`, `affiliate_tiers`, `affiliate_milestones`, `affiliate_assets`, `affiliate_broadcasts`, `affiliate_messages`, `affiliate_applications`, `affiliate_contests`, `discount_codes`, `announcements`, `tickets`, `affiliate_payout_batches`, `affiliate_payout_items`, `profiles`.

## Development Phases

- **Phase 1 (Foundation)**: COMPLETED — UI components, DataTable overhaul, barrel exports, CRUD API routes, hooks, format utilities
- **Phase 2 (Affiliate Portal)**: COMPLETED — All 11 affiliate pages fully functional:
  - Dashboard: Skeleton loading, formatCents/formatDate utilities
  - Analytics: Date range selector (7d/30d/90d/All Time), dynamic chart filtering
  - Referrals: DataTable with search, status filter, row-click detail modal
  - Earnings: DataTable with search, status filter, formatCents for all amounts
  - Payouts: DataTable with search, status/method filters, row-click detail modal
  - Resources: Working Copy/Download buttons, search, asset type tabs, toast feedback
  - Tools: QR code generation (qrcode.react), download as PNG, toast copy feedback
  - News: Click-to-detail modal with full broadcast info, formatDate
  - Messages: New Message modal with send, mark-as-read, relativeTime, EmptyState
  - Support: New Ticket modal (subject/description/priority/category), DataTable with search/filters, detail modal
  - Settings: Toast feedback (replacing inline messages), Input/Select components, useUnsavedChanges hook
- **Phase 3 (Admin Panel)**: COMPLETED — All 12 admin pages fully functional:
  - Overview: Skeleton loading, formatCents for stats
  - Applications: DataTable with search/status filter, approve/reject with toast
  - Members: DataTable with search, role/status filters, row-click detail modal, formatCents
  - Settings: Controlled form inputs (Input component), toast on save
  - Assets: Full CRUD (Add/Edit/Delete), DataTable with search+type filter, ConfirmDialog, toast
  - Milestones: Full CRUD (Add/Edit/Delete modals), ConfirmDialog, formatCents, toast
  - Tiers: Full CRUD (Add/Edit/Delete modals), ConfirmDialog, formatCents, toast
  - Broadcasts: Create modal, delete with ConfirmDialog, search, formatDate, toast
  - Networks: Toast feedback on Connect/Manage, external link support
  - Contests: Full CRUD (Add/Edit/Delete modals), ConfirmDialog, formatDate/formatCents, toast
  - Payout Runs: Create modal, DataTable with search+status filter, formatCents/formatDate, toast
  - Discount Codes: Create modal, ConfirmDialog delete, DataTable with search+status/type filters, formatDate, toast
- **Phase 4 (Polish)**: Dark mode, toasts on all mutations, CSV export, Realtime subscriptions, URL-persisted filters

## Notes

- UI components are self-contained in `src/components/ui/` until `@musekit/design-system` is available.
- Core business logic is in `src/core/index.ts`.
- DataTable component uses `any` types to avoid type incompatibility across different table schemas.
- `frame-ancestors *` in next.config.js is intentional for Replit proxy iframe embedding.
- ToastProvider (Sonner) is mounted in the root layout for app-wide toast notifications.
