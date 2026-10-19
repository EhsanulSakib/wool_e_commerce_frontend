# Wool — Frontend

Storefront for **Wool**, a wool knitwear e-commerce store (Bangladesh-based, multi-currency). Built as a learning and portfolio project.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · next-themes · GSAP · Lenis · Vitest + Testing Library

The full plan (decisions, architecture, milestones and modules) lives in the backend repo: [`wool_e_commerce_backend/docs/ROADMAP.md`](https://github.com/EhsanulSakib/wool_e_commerce_backend/blob/main/docs/ROADMAP.md).

## Requirements

- Node.js 24 or newer (the version used for development is in `.nvmrc`)
- npm 10+

## Getting started

```bash
npm install
cp .env.example .env.local   # optional, defaults work locally
npm run dev                  # http://localhost:3000
```

## Scripts

| Script                            | What it does                                               |
| --------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                     | Development server with hot reload (Turbopack)             |
| `npm run build`                   | Production build                                           |
| `npm start`                       | Serve the production build                                 |
| `npm run lint`                    | ESLint (`eslint-config-next` core web vitals + TypeScript) |
| `npm run typecheck`               | Generate route types, then type-check                      |
| `npm run format` / `format:check` | Prettier (with Tailwind class sorting)                     |
| `npm test` / `test:watch`         | Vitest + Testing Library                                   |
| `npm run analyze`                 | Interactive bundle analyzer                                |

## Theming and design tokens

`next-themes` sets `data-theme="light" | "dark"` on `<html>` before the page paints (no flash) and remembers the choice. All colors, type, spacing, radius, shadows, z-index and motion values are tokens in `src/styles/tokens.css`. Semantic color tokens change with the theme, so components use the same classes in both themes (`bg-bg`, `text-fg`, `text-muted-fg`, `border-border`…) and **never check the theme in JavaScript**. Tailwind's default color palette is turned off, so only token colors exist.

- Full reference: [docs/design-tokens.md](docs/design-tokens.md)
- Live preview: `/dev/tokens` (both themes, contrast ratios) and `/dev/fonts` (font pairings); both noindex
- Fonts: Fraunces (headings, `font-display`) + Inter (body, `font-sans`) via `next/font`
- Motion values for JS animations: `src/styles/motion.ts` (kept in sync with the CSS by a test)

## State and data

- **Data fetching:** Next.js's built-in `fetch`. Server Components fetch on the server (cached with tags, refreshed on demand); client components call the API from Redux thunks (module 14 adds the typed `fetch` wrapper).
- **Client state:** Redux Toolkit. `src/store/store.ts` creates a new store per request (`makeStore`), never a global one, so server-rendered requests from different users can't share state. `StoreProvider` creates it once in the browser, and components use the typed hooks from `src/store/hooks.ts` (`useAppSelector`, `useAppDispatch`).
- **What goes in Redux:** state several components share (cart drawer and menus now; current user, cart and wishlist later). State used by one component stays in `useState`. The theme is handled by `next-themes`, not Redux.

## Folder structure

```
src/
├─ app/            # routes, layouts, global styles
├─ components/
│  ├─ ui/          # design-system components (module 06+)
│  ├─ motion/      # animation components (module 07)
│  ├─ layout/      # navbar, footer, floating buttons (module 09)
│  ├─ product/     # product card, gallery… (modules 10, 22, 23)
│  ├─ cart/        # cart drawer and lines (module 30)
│  └─ …            # current components, rebuilt in milestone 02
├─ features/       # per-feature logic: hooks, stores, API calls
├─ hooks/          # shared hooks
├─ lib/            # utilities, env validation
├─ providers/      # theme, Redux store and smooth-scrolling providers
├─ store/          # Redux: makeStore, typed hooks, slices
├─ styles/         # design tokens (tokens.css) and motion values (motion.ts)
└─ types/
```

## Environment variables

| Variable               | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, default `http://localhost:3000` |

Public variables are validated in `src/lib/env.ts` and end up in the browser bundle, so they must never contain secrets.
