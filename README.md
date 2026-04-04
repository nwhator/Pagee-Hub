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
- `/onboarding` multi-step setup flow
- `/dashboard` page creator with live preview
- `/template-library` template selection workspace
- `/b/[subdomain]` public business page
- `/analytics`, `/plans`, `/billing`, `/profile`, `/reviews`, `/support`

## API Routes

- `/api/auth/signup`
- `/api/auth/login`
- `/api/auth/logout`
- `/api/auth/session`
- `/api/auth/forgot-password`
- `/api/auth/reset-password`
- `/api/business/create`
- `/api/business/update`
- `/api/business/delete`
- `/api/business/me`
- `/api/business/check-subdomain`
- `/api/business/subdomain`
- `/api/reviews/create`
- `/api/reviews/update`
- `/api/reviews/delete`
- `/api/analytics/record`
- `/api/analytics/summary`
- `/api/subscription/create`
- `/api/subscription/update`
- `/api/subscription/cancel`
- `/api/subscription/pricing`
- `/api/subscription/webhook`
- `/api/subscription/flutterwave/initiate`
- `/api/subscription/webhook/flutterwave`

## Supabase Schema

Run SQL from `supabase/schema.sql` in your Supabase SQL editor.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRO_MONTHLY_PRICE_ID`
- `STRIPE_PRO_YEARLY_PRICE_ID`
- `FLUTTERWAVE_PUBLIC_KEY`
- `FLUTTERWAVE_SECRET_KEY`
- `FLUTTERWAVE_WEBHOOK_HASH`
- `NEXT_PUBLIC_ROOT_DOMAIN`

## Wildcard Subdomains

- Wildcard routing is handled by [src/middleware.ts](src/middleware.ts)
- Configure DNS `*.pagee.org` to Vercel and set root domain env as needed

## Subscription Rules

- Free: $0 with baseline limits (subdomain page, up to 3 gallery images/reviews, basic analytics)
- Pro: $10/month or $100/year
- First-time monthly Pro purchase enforces a minimum 3-month upfront payment on the first invoice
- Optional regional pricing applies a discount multiplier by country while preserving USD reference pricing
- Flutterwave is available as an additional payment provider for local/African checkout flows
- Downgrade/cancel keeps Pro access until `current_period_end`

## Template To Publish Flow

1. Open `/template-library` and choose a template.
2. Open `/dashboard` and apply a template.
3. Enter your `User ID (UUID)` so ownership and plan limits are enforced.
4. Save/Publish.
5. View the generated page at `/b/[subdomain]`.

## Run

```bash
npm install
npm run dev
```

## Future Placeholders Included

- Template marketplace
- Marketing tools
- Custom domain management
