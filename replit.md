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
├── components/ui/          # Shared UI components (17 components)
│   ├── badge.tsx           # Status badges (dark mode variants per color)
│   ├── button.tsx          # Primary/secondary/ghost buttons
│   ├── card.tsx            # Card container
│   ├── confirm-dialog.tsx  # Delete/action confirmation modal
│   ├── data-table.tsx      # Full-featured DataTable (sort/search/filter/paginate/select/export/url-persist)
│   ├── empty-state.tsx     # Empty state with icon, message, optional action
│   ├── input.tsx           # Form input with label, error state, icon
│   ├── loading-skeleton.tsx # Skeleton loaders (line, card, table)
│   ├── modal.tsx           # Modal dialog with overlay, body scroll lock
│   ├── search-input.tsx    # Debounced search input with clear button
│   ├── select.tsx          # Select dropdown with label
│   ├── sidebar.tsx         # Navigation sidebar with theme toggle
│   ├── stat-card.tsx       # Metric display card
│   ├── tabs.tsx            # Tab switcher for detail views
│   ├── textarea.tsx        # Multi-line input with label
│   ├── theme-provider.tsx  # Theme context (light/dark/system), persists to localStorage
│   ├── theme-toggle.tsx    # Theme toggle button (Sun/Moon/Monitor icons)
│   └── toast.tsx           # Toast provider (Sonner) + toast helper
├── core/                   # Business logic (tracking, commissions)
├── hooks/                  # Custom React hooks
│   ├── use-debounce.ts     # Debounce hook for search inputs
│   ├── use-realtime.ts     # Supabase Realtime subscription hook
│   ├── use-unsaved-changes.ts # Warn on navigating away from dirty forms
│   └── use-url-filters.ts  # URL search params sync hook (standalone)
├── lib/                    # Supabase client, queries, mutations, API client
│   ├── supabase.ts         # Supabase client initialization (NEXT_PUBLIC_ keys, works client-side)
│   ├── queries.ts          # Read operations (server-side only)
│   ├── mutations.ts        # Write operations (server-side only)
│   ├── api-client.ts       # Client-side API wrapper (fetch-based, full CRUD)
│   ├── csv-export.ts       # CSV export utility (Blob download)
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
- **Dark mode**: Uses `darkMode: 'class'` in Tailwind config. ThemeProvider wraps the app in root layout. Theme persists to localStorage key `musekit-theme`. ThemeToggle button at bottom of both sidebars.
- **Supabase Realtime**: `useRealtimeTable` hook subscribes to postgres_changes. Used on referrals, messages, earnings, and applications pages for auto-refresh.
- **CSV export**: DataTable supports `exportable` and `exportFilename` props. Exports filtered/sorted data (pre-pagination) as .csv download.
- **URL-persisted filters**: DataTable supports `urlPersist` prop. Syncs search, filters, and page to URL query params for shareable/bookmarkable states.

## DataTable Component

The `DataTable` component (`src/components/ui/data-table.tsx`) is the core table display for all list pages. Features:
- **Column sorting**: Click headers to sort asc/desc/none with visual indicators
- **Search**: Built-in debounced search across all text columns
- **Filter dropdowns**: Configurable filter chips for status, type, etc.
- **Pagination**: 25 rows/page with prev/next and page indicator
- **Row click**: Optional `onRowClick` for navigation to detail views
- **Checkbox selection**: Optional `selectable` prop for bulk actions
- **Loading/empty states**: Skeleton rows when loading, EmptyState when no data
- **CSV export**: Optional `exportable` + `exportFilename` props, "Download CSV" button in toolbar
- **URL persistence**: Optional `urlPersist` prop syncs search/filters/page to URL params

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
- **Phase 2 (Affiliate Portal)**: COMPLETED — All 11 affiliate pages fully functional
- **Phase 3 (Admin Panel)**: COMPLETED — All 12 admin pages fully functional
- **Phase 4 (Polish)**: COMPLETED — Dark mode (all components + theme toggle), CSV export (8 pages), Supabase Realtime (4 pages), URL-persisted filters (6 pages)

## Authentication & Authorization

- **Auth helper**: `src/lib/auth.ts` provides `requireAffiliate(request)` and `requireAdmin(request)` helpers
- **Bearer token auth**: Reads `Authorization: Bearer <token>` header, validates via Supabase `auth.getUser()`
- **Dev fallback**: In development mode, if no Bearer token is present, falls back to first affiliate user in DB
- **Admin RBAC**: Checks `profiles.role === 'admin'` via service client. Dev mode skips role check
- **Pattern**: Every API route starts with `const auth = await requireAffiliate(request); if (auth.error) return auth.error;`
- **Error handling**: All API routes wrapped in try/catch, return 500 with logged error on failure

## File Upload

- Upload endpoint at `/api/admin/affiliates/upload` (POST, multipart form data)
- Validates file type (images, PDFs) and size (max 10MB)
- Stores files in Supabase Storage bucket `affiliate-assets`
- Admin assets page supports file upload with loading state

## Ticket Replies

- `TicketReply` type in `src/types/index.ts`: id, ticket_id, user_id, sender_role, body, created_at
- Support tickets route handles `add_reply` and `get_replies` actions
- Affiliate support page shows reply thread in ticket detail modal

## Admin Settings

- Settings stored in `affiliate_settings` table (single-row upsert pattern)
- API route at `/api/admin/affiliates/settings` (GET/POST with admin auth)
- Settings page loads from DB on mount, saves via API

## Package Exports

- `package.json` has `main`, `types`, and `exports` fields configured
- Barrel exports: `src/components/ui/index.ts`, `src/hooks/index.ts`
- Networks config extracted to `src/lib/networks-config.ts`

## Notes

- UI components are self-contained in `src/components/ui/` until `@musekit/design-system` is available.
- Core business logic is in `src/core/index.ts`.
- DataTable component uses `any` types to avoid type incompatibility across different table schemas.
- `frame-ancestors *` in next.config.js is intentional for Replit proxy iframe embedding.
- ToastProvider (Sonner) is mounted in the root layout for app-wide toast notifications.
- ThemeToggle is placed at the bottom of the Sidebar component, visible on both admin and affiliate layouts.
