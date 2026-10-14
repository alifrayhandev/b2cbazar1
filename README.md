# B2C Bazar

A production-ready e-commerce website for Bangladesh, built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- Responsive storefront with product grid, search, and category filtering
- Shopping cart with localStorage persistence
- COD-only checkout with server-side price/stock validation
- Atomic order creation via PostgreSQL RPC (prevents overselling)
- Admin dashboard: products, orders, inventory, settings
- Manual courier tracking (no API integration)
- WhatsApp contact integration
- Supabase Auth for admin (email/password)
- Row Level Security on all tables

---

## Prerequisites

- Node.js 20 LTS — https://nodejs.org
- A Supabase account — https://supabase.com (free tier)
- A GitHub account
- A Vercel account — https://vercel.com (free tier)

---

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/b2cbazar.git
cd b2cbazar
npm install
```

---

## Supabase Setup

1. Go to https://supabase.com and create a new project.
2. Note your **Project URL** and **anon/public key** from Settings → API.
3. Also note the **service_role key** (keep this secret).
4. Go to the **SQL Editor** and run the migration file:
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Paste into the SQL Editor and click **Run**

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
SUPABASE_SECRET_KEY=your_service_role_key_here
```

**Never commit `.env.local` to Git.** It is already in `.gitignore`.

---

## Initial Admin Account

Supabase Auth does not allow public registration (by design for this project).

To create the admin account:

1. Go to your Supabase project → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter your admin email and a strong password
4. Click **Create user**

That email/password is what you use to log in at `/admin/login`.

---

## Local Development

```bash
npm run dev
```

Visit http://localhost:3000 for the storefront.
Visit http://localhost:3000/admin/login for the admin panel.

---

## Type Checking & Linting

```bash
npm run type-check
npm run lint
```

---

## Tests

```bash
npm test
```

Tests cover: price formatting, phone validation, checkout schema, product schema, order reference generation, slug generation.

---

## Production Build

```bash
npm run build
npm run start
```

---

## GitHub Setup

```bash
git init
git add .
git commit -m "Initial commit: B2C Bazar"
git remote add origin https://github.com/YOUR_USERNAME/b2cbazar.git
git push -u origin main
```

---

## Vercel Deployment

1. Go to https://vercel.com → **New Project** → Import your GitHub repo
2. Framework: **Next.js** (auto-detected)
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
4. Click **Deploy**

---

## Domain Configuration

1. Purchase `b2cbazar.com` from a registrar (e.g. Namecheap, GoDaddy)
2. In Vercel project → **Settings** → **Domains** → Add `b2cbazar.com`
3. Follow Vercel's DNS instructions (add CNAME or A record at your registrar)
4. Update `sitemap.ts` base URL once domain is live

---

## Order Workflow

1. Customer adds products to cart → submits checkout form
2. Server validates inputs (Zod), fetches authoritative prices from DB
3. PostgreSQL RPC `create_order` atomically: locks rows, checks stock, creates order + items, deducts stock
4. Customer sees order reference + COD total
5. Admin reviews at `/admin/orders` → confirms → books parcel manually via Pathao merchant portal
6. Admin enters tracking number manually in order detail page
7. Admin updates order status through the workflow

---

## Product Management

1. Log in at `/admin/login`
2. Go to **Products** → **Add Product**
3. Fill in name, price, stock, category, image URL
4. Set **Active** = true to make it visible on the storefront
5. Use **Inventory** page for stock adjustments

---

## Delivery Charges

Configure at `/admin/settings`:
- Inside Dhaka delivery charge (default: ৳60)
- Outside Dhaka delivery charge (default: ৳120)

These are recalculated server-side on every order — customers cannot manipulate them.

---

## Common Errors

| Error | Solution |
|-------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` missing | Add to `.env.local` and Vercel env vars |
| `create_order` RPC not found | Run the SQL migration in Supabase SQL Editor |
| Admin login fails | Create user in Supabase Auth → Users |
| Images not loading | Add image hostname to `next.config.ts` remotePatterns |
| Build fails on type errors | Run `npm run type-check` and fix reported issues |

---

## WhatsApp

The WhatsApp number is configured in `/admin/settings` → WhatsApp Number.
Format: international without `+` (e.g. `8801350526254`).

The floating button and footer link open WhatsApp for the customer to send a message manually. No messages are sent automatically.

---

## Legal Notice

Policy pages under `/policies/` contain placeholder text. Before launching:
- Replace all `[OWNER TO INSERT ...]` placeholders
- Have policies reviewed by a legal professional familiar with Bangladeshi e-commerce law
- Ensure all products comply with applicable Bangladeshi regulations
