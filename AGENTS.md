# Roadsters (oppa-shirt) — Agent Guide

## Quick start

```bash
npm run dev       # dev server
npm run build     # production build
npm run lint      # ESLint v9 flat config (next/core-web-vitals + typescript)
npm start         # start production server
```

## Architecture

- **Next.js 16 App Router** + **React 19**, TypeScript strict mode
- **Tailwind CSS v4** (CSS-based config, no `tailwind.config.*`), shadcn/ui New York style, `components.json` at root
- **Zustand v5** with `persist` middleware for cart (`cart-products` in localStorage) and favorites (`favorite-products`)
- **next-intl v4** for i18n (en/ar). Locale read from `MYNEXTAPP_LOCALE` cookie
- **No testing** configured anywhere. No CI pipeline.

## Route groups

| Group | Pages | Behavior |
|-------|-------|----------|
| `(default-layout)` | `/cart`, `/checkout`, `/products/*`, `/categories`, `/favorites`, `/payment/*` | Wraps children in `<main>` |
| `(hero-layout)` | `/` (home), `/categories/[slug]` | No extra `<main>` wrapper |

## API layer

All `/api/*` routes are thin proxies to an external Django REST backend at `BASE_API_URL` env var. They forward query params and add `Access-Control-Allow-Origin: *`.

**Key endpoints:**
- `GET /api/products` — forwards `search`, `category`, `price`, `available`, `best_seller`, `in_stock`, `date_from`, `date_to`, variation filters, `sort`, `page`, `page_size`
- `POST /api/orders/create` — routes to CASH or CARD endpoint based on payment method
- `POST /api/validate-coupon`, `/api/newsletter`

## Path alias

`@/*` maps to project root (e.g. `@/components/ui/button`, `@/lib/utils`).

## State management

- Cart: `useCartStore` (Zustand + persist) — add/remove/update quantity/variations. Ignore legacy `CartContext.jsx`.
- Favorites: `useFavoritesStore` (Zustand + persist) — toggle by product slug.
- Navbar background: `useApplicationState` (simple boolean store).

## Quirks & gotchas

- Filter objects must have `undefined` values cleaned before passing to `getProducts()` (see `ProductsPageLayout.tsx`).
- `BASE_API_URL` is not in `.env.local` — set it in deployment env or a separate `.env` file.
- Supabase SSR is installed but no auth UI is wired up.
- Uses `npm`, not pnpm or yarn.
- `OldCheckoutPageLayout.jsx` and `CartContext.jsx` are legacy — do not use.
