# ATELIER — Luxury Perfume E-commerce Platform

A premium, reusable luxury fragrance storefront built with Next.js 16 (App Router), React 19,
TypeScript, Tailwind CSS 4, TanStack Query, GSAP, React Hook Form + Zod, and Lucide icons.

The entire brand identity — name, logo text, colors, typography, navigation, hero copy,
announcement bar, footer, currency and contact details — lives in `src/config/brand.config.ts`.
Rebrand the site by editing that file; no component changes required.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Development server                 |
| `npm run build`   | Production build                   |
| `npm start`       | Serve the production build         |
| `npm run lint`    | ESLint                             |
| `npx tsc --noEmit`| TypeScript check (strict)          |
| `node scripts/generate-assets.mjs` | Regenerate local SVG imagery |

## Project Structure

```
src/
  app/
    layout.tsx               # Root layout: fonts, metadata, providers
    globals.css              # Tailwind v4 theme tokens (CSS vars from brand config)
    sitemap.ts / robots.ts   # SEO
    not-found.tsx            # 404
    (store)/                 # Storefront routes (header/footer chrome)
      page.tsx               # Home
      shop/                  # Catalog: filters, sort, search, pagination
      product/[slug]/        # PDP: gallery, sizes, notes, reviews, accord viz
      collections/           # Collections index + detail
      search/                # Full search results page
      cart/  checkout/       # Bag + checkout (demo, no real payments)
      our-story/  contact/   # Editorial + contact form
    account/                 # login, register, forgot-password, profile,
                             # orders, addresses, wishlist
  components/
    layout/                  # AnnouncementBar, Header, MobileMenu, Footer, overlays
    home/                    # Hero, FeaturedCollection, BrandStory, BestSellers,
                             # FragranceDiscovery, EditorialCampaign, Newsletter, Social
    products/                # ProductCard, QuickViewModal, ProductDetailClient
    shop/ collections/ cart/ checkout/ forms/ account/ search/
    ui/                      # Button, fields, Rating, Skeleton, Toast, SocialIcons
    animations/Reveal.tsx    # GSAP ScrollTrigger reveal primitive
  config/brand.config.ts     # Single source of truth for brand identity
  data/                      # Mock products, collections, reviews
  services/api.ts            # Mock service layer — swap for real API here
  lib/
    query/                   # QueryClient, keys, hooks (TanStack Query)
    store/store.tsx          # Cart, wishlist, UI overlays, toasts (localStorage)
    validations/schemas.ts   # Zod schemas for all forms
    utils.ts                 # cn, formatPrice, afterMount helper
  types/index.ts             # Domain models
public/images/               # Generated SVG product + editorial imagery
```

## Admin Dashboard

Visit `/admin` (passcode: `zein-admin` — a demo gate, replace with real auth
before production). The dashboard lets the brand owner:

- Browse, search, edit, and delete products
- Add new fragrances with name, slug, descriptions, category, collection,
  fragrance family, gender, badge, rating, stock, notes, ingredients, images
- Manage sizes in ml with per-size pricing, compare-at prices, and stock flags
- Toggle visibility (active/hidden), featured, bestseller, and new-arrival flags
- Reset the catalog back to the seed data

Edits persist to `localStorage` (`zein-catalog-v1`) and broadcast via a
`storage`/custom event — every open tab and every TanStack Query cache
invalidates and refetches instantly, so storefront pages (shop grid, product
detail, search, collections, cart prices) reflect changes in real time.

## Backend Integration Notes

Everything is intentionally mock-based but interface-ready:

- **Data**: replace `src/services/api.ts` implementations with real fetch calls;
  TanStack Query hooks (`src/lib/query/hooks.ts`) and keys stay unchanged.
- **Auth**: `loginRequest` / `registerRequest` / `forgotPasswordRequest` are stubs;
  session is stored in `localStorage` under `atelier-customer-v1`.
- **Orders**: `placeOrder` simulates latency; real orders persist to
  `localStorage` under `atelier-orders-v1` for the account/orders UI.
- **Payments**: checkout is explicitly a demo — no card data is collected.
  Integrate Stripe/Adyen inside `placeOrder`.
- **Cart & wishlist**: localStorage (`atelier-cart-v1`, `atelier-wishlist-v1`).

## Verification

- `npx tsc --noEmit` — clean
- `npm run lint` — clean
- `npm run build` — succeeds; all routes prerender (42 pages)
