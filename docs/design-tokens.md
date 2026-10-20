# Design tokens

Every visual decision (color, type, spacing, radius, shadow, layer, motion) is defined once in [`src/styles/tokens.css`](../src/styles/tokens.css). Components use only the **semantic** tokens, through Tailwind utilities. Dark mode and future rebranding are a token change, not a component change.

Live preview: **`/dev/tokens`** (all tokens, both themes) and **`/dev/fonts`** (font pairing comparison). Both are noindex.

## Rules

1. **Use semantic tokens only.** `bg-surface`, `text-muted-fg`, `border-border`. Never use primitives (`--neutral-500`) or raw hex values in components.
2. **No theme checks in JavaScript.** Never write `theme === 'dark' ? … : …`. The tokens switch with `data-theme` on `<html>`.
3. **Status colors are accents.** Use them for badges, pills, dots, alerts and the sale price. Large areas stay black, white and gray.
4. **Tailwind's default palette is off** (`--color-*: initial`), so `bg-red-600` or `text-gray-500` don't exist. If you need a color that isn't here, add a semantic token.
5. **New text/background pairs go into `contrastPairs`** in [`src/lib/contrast.ts`](../src/lib/contrast.ts). `npm test` fails if a pair misses WCAG AA.

## How it's built

```
primitives (--ink, --neutral-600, --red-600…)          raw palette, theme-independent
   ↓
semantic (--bg, --fg, --muted-fg, --danger…)           per theme: :root/[data-theme='light'], [data-theme='dark']
   ↓
@theme inline (--color-bg: var(--bg)…)                 Tailwind utilities: bg-bg, text-fg, border-border…
```

`@theme inline` makes each utility read the variable on the element where it's used. A nested `data-theme="dark"` wrapper therefore works too; `/dev/tokens` uses that to show both themes side by side.

## Colors

### Primitives

| Token                                           | Value                 |                                                     |
| ----------------------------------------------- | --------------------- | --------------------------------------------------- |
| `--ink`                                         | `#0a0a0a`             | Near-black (primary in light mode)                  |
| `--paper`                                       | `#ffffff`             | White (primary in dark mode)                        |
| `--neutral-50` … `--neutral-950`                | `#fafaf9` … `#121110` | Gray with a hint of warmth (wool, not steel)        |
| `--green-*`, `--amber-*`, `--red-*`, `--blue-*` |                       | Status hues, only the steps the semantic layer uses |

### Semantic

| Utility                                | Light                  | Dark                     | Use for                                                                           |
| -------------------------------------- | ---------------------- | ------------------------ | --------------------------------------------------------------------------------- |
| `bg-bg`                                | paper                  | ink                      | Page background                                                                   |
| `text-fg`                              | ink                    | neutral-50               | Main text                                                                         |
| `bg-surface`                           | neutral-50             | neutral-950              | Cards, sections that sit on the page                                              |
| `bg-surface-raised`                    | paper                  | neutral-900              | Popovers, menus, modals (with a shadow)                                           |
| `bg-muted`                             | neutral-100            | neutral-900              | Subtle fills: skeletons, hovered rows, image placeholders                         |
| `text-muted-fg`                        | neutral-600            | neutral-400              | Secondary text: descriptions, meta, placeholders                                  |
| `border-border`                        | neutral-200            | neutral-800              | Dividers, card outlines                                                           |
| `border-border-strong`                 | neutral-500            | neutral-500              | Input outlines (≥ 3:1 against the page, as WCAG requires)                         |
| `ring-ring` / focus outline            | ink                    | paper                    | Focus ring                                                                        |
| `bg-overlay`                           | ink 50%                | black 70%                | Backdrop behind modals and drawers                                                |
| `bg-primary` / `text-primary-fg`       | ink / paper            | paper / ink              | Main buttons, selected states, active filters (inverts in dark)                   |
| `bg-secondary` / `text-secondary-fg`   | neutral-100 / ink      | neutral-800 / neutral-50 | Secondary buttons, chips                                                          |
| `success`, `warning`, `danger`, `info` | `-700`/`-600` shades   | `-400` shades            | Solid accent: dots, icons, text on the page (e.g. **sale price = `text-danger`**) |
| `…-fg` on `…-soft`                     | dark text on pale fill | light text on deep fill  | Pills, badges, alert boxes: `bg-danger-soft text-danger-fg`                       |

### Contrast (WCAG AA)

Text needs ≥ 4.5:1; UI parts like input outlines and focus rings need ≥ 3:1. Checked by [`src/styles/tokens.test.ts`](../src/styles/tokens.test.ts) and shown live on `/dev/tokens`.

| Pair                      | Light | Dark  | Minimum |
| ------------------------- | ----- | ----- | ------- |
| fg / bg                   | 19.80 | 18.96 | 4.5     |
| fg / surface              | 18.96 | 18.06 | 4.5     |
| fg / surface-raised       | 19.80 | 16.48 | 4.5     |
| muted-fg / bg             | 6.97  | 8.07  | 4.5     |
| muted-fg / surface        | 6.68  | 7.68  | 4.5     |
| muted-fg / muted          | 6.33  | 7.01  | 4.5     |
| primary-fg / primary      | 19.80 | 19.80 | 4.5     |
| secondary-fg / secondary  | 17.99 | 13.74 | 4.5     |
| success-fg / success-soft | 8.30  | 10.62 | 4.5     |
| warning-fg / warning-soft | 8.15  | 10.39 | 4.5     |
| danger-fg / danger-soft   | 6.80  | 8.51  | 4.5     |
| info-fg / info-soft       | 8.49  | 8.15  | 4.5     |
| success / bg              | 5.02  | 11.36 | 4.5     |
| warning / bg              | 5.02  | 11.86 | 4.5     |
| danger / bg               | 4.83  | 7.16  | 4.5     |
| info / bg                 | 5.17  | 7.79  | 4.5     |
| border-strong / bg        | 4.59  | 4.31  | 3       |
| ring / bg                 | 19.80 | 19.80 | 3       |

## Typography

| Font     | Utility               | Family                                            | Loaded in                           |
| -------- | --------------------- | ------------------------------------------------- | ----------------------------------- |
| Headings | `font-display`        | **Fraunces** (variable serif with optical sizing) | `app/layout.tsx` (`--font-heading`) |
| Body     | `font-sans` (default) | **Inter** (variable sans)                         | `app/layout.tsx` (`--font-body`)    |

Both are loaded with `next/font/google`: self-hosted, latin subset only, `display: swap`, one variable file per family (about 115 KB total). Fallback metrics are adjusted automatically, so the swap causes no layout shift. To try another pair, compare on `/dev/fonts`, then change the two imports in `app/layout.tsx`.

### Scale

Sizes are fluid: they grow linearly from a 360px to a 1440px viewport using `clamp()`, with no jumps at breakpoints. Each utility sets size, line height and (for headings) letter spacing.

| Utility        | 360px | 1440px+ | Line height | Use for                                  |
| -------------- | ----- | ------- | ----------- | ---------------------------------------- |
| `text-display` | 44px  | 104px   | 1           | Hero headlines                           |
| `text-h1`      | 38px  | 72px    | 1.05        | Page titles                              |
| `text-h2`      | 32px  | 56px    | 1.1         | Section titles                           |
| `text-h3`      | 27px  | 42px    | 1.15        | Sub-sections, large card titles          |
| `text-h4`      | 23px  | 32px    | 1.2         | Product name on the details page         |
| `text-h5`      | 20px  | 25px    | 1.3         | Card titles, modal titles                |
| `text-h6`      | 18px  | 20px    | 1.35        | Small headings, accordion titles         |
| `text-body-lg` | 18px  | 20px    | 1.6         | Intros, lead paragraphs                  |
| `text-body`    | 16px  | 18px    | 1.6         | **Default body text** (never below 16px) |
| `text-small`   | 14px  | 14px    | 1.5         | Meta, helper text, table cells           |
| `text-caption` | 12px  | 12px    | 1.4         | Labels, badges (often `uppercase`)       |

Bare `h1`–`h6` get `font-display` and their matching size by default (in `@layer base`, so any utility overrides it). Choose the size by visual role, not by heading level: an `<h2>` on a card can be `text-h5`.

## Layout

| Token                  | Utility         | Value        | Use for                                     |
| ---------------------- | --------------- | ------------ | ------------------------------------------- |
| `--spacing` (Tailwind) | `p-4`, `gap-6`… | 4px steps    | Everything inside components                |
| `--gutter`             | `px-gutter`     | 16px → 40px  | Page side padding                           |
| `--section`            | `py-section`    | 64px → 128px | Space between home/landing sections         |
| `--section-sm`         | `py-section-sm` | 40px → 72px  | Compact sections, inner pages               |
| `--container-narrow`   | `max-w-narrow`  | 768px        | Forms, text pages (FAQ, policies)           |
| `--container-page`     | `max-w-page`    | 1280px       | Main content width                          |
| `--container-wide`     | `max-w-wide`    | 1920px       | Full-bleed sections; the `<body>` max width |

Use `max-w-prose` (65ch) for long paragraphs.

### Radius

| Utility        | Value         | Use for                                       |
| -------------- | ------------- | --------------------------------------------- |
| `rounded-xs`   | 2px           | Tiny elements: progress bars, checkboxes      |
| `rounded-sm`   | 4px           | Badges, tags                                  |
| `rounded-md`   | 8px           | Inputs, buttons (rectangular), small cards    |
| `rounded-lg`   | 12px          | Cards, dropdowns                              |
| `rounded-xl`   | 16px          | Modals, drawers, large panels                 |
| `rounded-2xl`  | 24px          | Feature blocks, promo cards                   |
| `rounded-full` | pill / circle | Pill buttons, avatars, swatches, icon buttons |

### Shadows

Soft and low-contrast. In dark mode, shadows hardly show on black, so use `bg-surface-raised` and a border to separate layers there; the shadow is just a bonus.

| Utility     | Use for                               |
| ----------- | ------------------------------------- |
| `shadow-xs` | Inputs, subtle lift                   |
| `shadow-sm` | Cards at rest, sticky navbar          |
| `shadow-md` | Cards on hover, dropdowns             |
| `shadow-lg` | Popovers, mega menu, floating buttons |
| `shadow-xl` | Modals, drawers                       |

### Z-index

Use these utilities, never raw numbers.

| Utility      | Value | Use for                                                             |
| ------------ | ----- | ------------------------------------------------------------------- |
| `z-base`     | 0     | Reset                                                               |
| `z-raised`   | 10    | Overlapping content inside a section (hero image, badges on a card) |
| `z-dropdown` | 100   | Dropdowns, select menus, tooltips                                   |
| `z-sticky`   | 200   | Sticky navbar, sticky add-to-cart bar                               |
| `z-overlay`  | 300   | Backdrop behind modals and drawers                                  |
| `z-modal`    | 400   | Modals, drawers (cart, mobile menu)                                 |
| `z-toast`    | 500   | Toasts                                                              |
| `z-floating` | 600   | Floating buttons (scroll-to-top, contact)                           |

## Motion

CSS variables in `tokens.css`, mirrored in [`src/styles/motion.ts`](../src/styles/motion.ts) for Motion and GSAP. A test fails if the two drift apart.

| Duration | CSS utility       | TS                                 | Use for                                       |
| -------- | ----------------- | ---------------------------------- | --------------------------------------------- |
| 150ms    | `duration-fast`   | `duration.fast` / `durationS.fast` | Hovers, color changes, small state changes    |
| 250ms    | `duration-base`   | `duration.base`                    | Most UI transitions: dropdowns, toggles, tabs |
| 400ms    | `duration-slow`   | `duration.slow`                    | Drawers, modals, larger movement              |
| 700ms    | `duration-slower` | `duration.slower`                  | Scroll reveals, hero entrances                |

| Easing     | CSS utility       | TS (`ease.*`) | Curve                             | Use for                                |
| ---------- | ----------------- | ------------- | --------------------------------- | -------------------------------------- |
| Standard   | `ease-standard`   | `standard`    | `cubic-bezier(0.2, 0, 0, 1)`      | Default for UI transitions             |
| Emphasized | `ease-emphasized` | `emphasized`  | `cubic-bezier(0.05, 0.7, 0.1, 1)` | Elements entering the screen           |
| Out-expo   | `ease-out-expo`   | `outExpo`     | `cubic-bezier(0.16, 1, 0.3, 1)`   | Reveals: fast start, long soft landing |
| Exit       | `ease-exit`       | `exit`        | `cubic-bezier(0.3, 0, 1, 1)`      | Elements leaving the screen            |

```tsx
import { durationS, ease, cssEase } from '@/styles/motion';

<m.div transition={{ duration: durationS.slow, ease: ease.emphasized }} />;
gsap.to(el, {
  duration: durationS.slower,
  ease: CustomEase.create('outExpo', cssEase('outExpo')),
});
```

**Reduced motion:** with `prefers-reduced-motion: reduce`, a global rule in `globals.css` makes every CSS transition and animation near-instant. JS animations (Motion, GSAP) must check it themselves (module 07). Exception: elements with `data-essential-motion` (the `Spinner`) keep animating, because a frozen spinner looks like a hang.

**Shimmer:** `animate-shimmer` (1.6s, `ease-standard`, infinite) sweeps a highlight across `Skeleton`. It animates `transform` only and stops with reduced motion.

## Details

- **Focus ring:** `:focus-visible` → 2px solid `--ring`, offset 2px, on every focusable element (keyboard only, not on mouse click). Don't remove it; if a component needs a different ring, use `outline-*` utilities with the `ring` color.
- **Text selection:** `primary` background, `primary-fg` text (black on white, inverted in dark mode).
- **Scrollbar:** thin, `border-strong` thumb on a transparent track (`scrollbar-color`, plus `::-webkit-scrollbar` for older Safari).
- **`color-scheme`** is set per theme, so native controls (date pickers, scrollbars) follow it.

### Breakpoints

Tailwind's defaults, mobile-first (`md:` = 768px and up).

| Prefix | Min width |                                                   |
| ------ | --------- | ------------------------------------------------- |
| `sm:`  | 640px     | Large phones, landscape                           |
| `md:`  | 768px     | Tablets                                           |
| `lg:`  | 1024px    | Small laptops; the desktop navigation starts here |
| `xl:`  | 1280px    | Desktops (= `max-w-page`)                         |
| `2xl:` | 1536px    | Large screens                                     |
