# Pagee Hub

Pagee Hub is a mobile-first, full-stack one-page business profile generator for entrepreneurs.

## Stack

- Next.js 16 (App Router)
- TailwindCSS 4
- Supabase (PostgreSQL + Auth + Storage)
- Stripe (subscription billing)

## Key Routes

- `/` landing page
- `/signup`, `/login`, `/forgot-password`, `/reset-password`
- `/dashboard` page creator with live preview
- `/b/[subdomain]` public business page
- `/analytics`, `/plans`, `/billing`, `/profile`, `/reviews`, `/support`

## API Routes

- `/api/auth/signup`
- `/api/auth/login`
- `/api/business/create`
- `/api/business/update`
- `/api/business/delete`
- `/api/reviews/create`
- `/api/reviews/update`
- `/api/reviews/delete`
- `/api/analytics/record`
- `/api/subscription/create`
- `/api/subscription/update`
- `/api/subscription/cancel`

## Supabase Schema

Run SQL from `supabase/schema.sql` in your Supabase SQL editor.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRO_PRICE_ID`
- `STRIPE_ENTERPRISE_PRICE_ID`

## Run

```bash
npm install
npm run dev
```

## Future Placeholders Included

- Template marketplace
- Marketing tools
- Custom domain management
