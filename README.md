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

## Theming

`next-themes` sets `data-theme="light" | "dark"` on `<html>` before the page paints (no flash) and remembers the choice. Colors are CSS variables in `src/app/globals.css` that change with the theme, so components use the same classes in both themes (`bg-background`, `text-foreground`, `dark:hidden`…) and **never check the theme in JavaScript**.

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
├─ providers/      # theme and smooth-scrolling providers
├─ styles/         # design tokens (module 05)
└─ types/
```

## Environment variables

| Variable               | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, default `http://localhost:3000` |

Public variables are validated in `src/lib/env.ts` and end up in the browser bundle, so they must never contain secrets.
