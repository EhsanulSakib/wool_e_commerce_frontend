# Animation

How motion works in this app, which tool to use for what, and the checklist an animation must pass before it ships. Live demo: **`/dev/motion`** (dev only).

## The 7 rules

1. **Animate only `transform` and `opacity`.** The GPU composites them without recalculating layout or repainting. Never animate `width`, `height`, `top`, `left`, `margin` or `padding`.
2. **The LCP element is visible on first paint.** Never wrap the hero heading or hero image in `Reveal`, `Stagger` or `TextReveal`: their hidden start state is rendered on the server, so LCP would wait for JavaScript.
3. **Lenis smooths desktop wheel scrolling only.** It is created only on devices with a fine pointer (mouse/trackpad); phones and tablets never run it. On hybrid devices touch stays native (`syncTouch: false`), and the admin area turns it off with `<NativeScroll />`.
4. **Keep animation code out of the main bundle.** Motion loads through `LazyMotion` (its features arrive in a separate chunk after hydration). GSAP is imported only by components that use it, so routes without them never download it.
5. **Respect `prefers-reduced-motion`.** Everything below has a reduced-motion path: content appears in its final state, nothing moves, and Lenis is off.
6. **Reveal once, and never update React state on scroll.** Use `viewport={{ once: true }}`, ScrollTrigger `once: true` or IntersectionObserver. Per-frame work writes to the DOM directly (`CountUp`, `Magnetic`), never through `useState`.
7. **An animation isn't done until it's smooth at 4× CPU throttling** (DevTools → Performance → CPU: 4× slowdown).

## Which tool for what

| Tool                                          | Use for                                                                                                       | Where                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Motion** (`motion/react`, `m.*` components) | Component animations: reveals, hover/tap, drawers, modals, toasts, list reflow, fly-to-cart, page transitions | `Reveal`, `Stagger`; overlays in module 08              |
| **GSAP** + ScrollTrigger + SplitText          | Scroll storytelling: text reveals, parallax, pinned sections, horizontal lookbook                             | `TextReveal`, `Parallax`; import from `@/lib/gsap` only |
| **Lenis**                                     | Smooth wheel scrolling                                                                                        | `SmoothScrollProvider` (root layout)                    |
| **CSS** (`transition`, `@keyframes`)          | Hovers, colors, the marquee, skeleton shimmer, anything that needs no JavaScript                              | Tailwind utilities with the motion tokens               |

Prefer CSS when it's enough, then Motion, and use GSAP only for scroll-driven work.

## Setup (already done)

- **`src/providers/motion-provider.tsx`**: `LazyMotion` (`domMax`, `strict`; `domMax` adds layout animations for the tabs indicator and the toast stack, still loaded lazily, 27 KB gz) + `MotionConfig` (`reducedMotion="user"`, default transition from the tokens). Because of `strict`, use `m.div` (`import * as m from 'motion/react-m'`), never `motion.div`: a `motion.*` component would bundle every feature and throws an error here.
- **`src/providers/smooth-scroll-provider.tsx`**: one Lenis instance (`autoRaf: false`, `lerp: 0.1`, `syncTouch: false`, `anchors: true`), created only with a fine pointer, off with reduced motion or `<NativeScroll />`. It runs its own small rAF loop. (Running Lenis on phones cost ~700ms of mobile Lighthouse TBT for no benefit, so it isn't created there.) When a GSAP component mounts, `useLenisScrollTrigger()` hands the loop to `gsap.ticker`, adds `ScrollTrigger.update` on every Lenis scroll and sets `lagSmoothing(0)`. The result is one loop, both libraries in the same frame, and GSAP never downloaded on pages that don't use it.
- **`src/lib/gsap.ts`**: registers `ScrollTrigger`, `SplitText` and `useGSAP` once; exports them and `useLenisScrollTrigger`.
- **`src/styles/motion.ts`**: durations, easings (`ease` for Motion and CSS, `gsapEase` for GSAP), shared with the CSS variables in `tokens.css`.

## Components (`src/components/motion`)

Import each from its own file (`@/components/motion/Reveal`). There's no barrel file on purpose: importing a barrel from a Server Component can pull every client module it re-exports (including GSAP) into the route.

| Component                 | What it does                                                                                                               | Reduced motion      | Notes                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| `Reveal`                  | Fades/slides in once on entering the viewport. Presets: `fadeUp` (default), `fadeIn`, `scaleIn`, `slideLeft`, `slideRight` | Appears in place    | Not for the LCP element                                                                    |
| `Stagger` + `StaggerItem` | Children reveal one after another (`delayChildren: stagger(0.08)`)                                                         | Appear together     | Use `as="ul"` / `as="li"` for lists                                                        |
| `TextReveal`              | Lines (or words) slide up from behind a mask (SplitText)                                                                   | Never split         | Plain-text children only; re-splits on font load/resize; screen readers get the whole text |
| `Parallax`                | Content drifts with scroll (ScrollTrigger scrub)                                                                           | Static              | Desktop ≥ 1024px only                                                                      |
| `Magnetic`                | Leans toward the cursor, springs back                                                                                      | Off                 | Mouse/trackpad only                                                                        |
| `Marquee`                 | Endless CSS scroll                                                                                                         | Static, copy hidden | Pauses on hover and focus; the copy is `aria-hidden` + `inert`                             |
| `CountUp`                 | Counts from 0 once in view                                                                                                 | Final number        | Final number is in the server HTML; screen readers read it once                            |

Presets live in `presets.ts`: `fadeIn`, `fadeUp`, `scaleIn`, `slideIn(from)`, `staggerContainer(interval, delay)`, `transitions` (`base`, `enter`, `exit`, `reveal`) and `withTransition(variants, { delay, reduced })`.

## Examples

```tsx
// A section that reveals on scroll
<Reveal as="section" className="py-section">…</Reveal>

// A product grid, cards one after another
<Stagger as="ul" className="grid grid-cols-2 gap-6 lg:grid-cols-4">
  {products.map((p) => (
    <StaggerItem key={p.id} as="li"><ProductCard product={p} /></StaggerItem>
  ))}
</Stagger>

// An editorial heading below the fold
<TextReveal as="h2" className="text-h2">Knitted slowly from soft merino wool</TextReveal>

// Lookbook image
<Parallax className="aspect-4/5 rounded-xl">
  <Image src={src} alt={alt} fill sizes="50vw" className="object-cover" />
</Parallax>

// Lock scrolling while a modal is open, scroll to the reviews
const { stop, start, scrollTo } = useLenisControls();
scrollTo('#reviews', { offset: -80 });
```

### Writing a new Motion animation

```tsx
'use client';
import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { transitions } from '@/components/motion/presets';

export function Toast({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8, transition: transitions.exit }}
      transition={reduced ? { duration: 0 } : transitions.enter}
    >
      {children}
    </m.div>
  );
}
```

### Writing a new GSAP animation

```tsx
'use client';
import { useRef } from 'react';
import { gsap, useGSAP, useLenisScrollTrigger } from '@/lib/gsap';
import { durationS, gsapEase } from '@/styles/motion';

export function PinnedStory() {
  const ref = useRef<HTMLDivElement>(null);
  useLenisScrollTrigger(); // always, in every component that uses ScrollTrigger

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.from('.panel', {
            opacity: 0,
            y: 40,
            duration: durationS.slow,
            ease: gsapEase.emphasized,
            stagger: 0.1,
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 70%',
              once: true,
            },
          });
        },
      );
      return () => mm.revert(); // everything created inside is undone on unmount
    },
    { scope: ref }, // '.panel' only matches inside this component
  );

  return <div ref={ref}>…</div>;
}
```

`gsap.matchMedia()` covers both breakpoints and reduced motion; when a query stops matching, everything created inside it is reverted automatically.

### Nested scroll areas

Lenis captures wheel events for the page. Scrollable elements inside it (modal bodies, drawers, dropdown lists) need `data-lenis-prevent`, otherwise the wheel scrolls the page behind them:

```tsx
<div className="overflow-y-auto" data-lenis-prevent>
  …
</div>
```

## Checklist before shipping an animation

- [ ] Only `transform` and `opacity` change (DevTools → Rendering → **Paint flashing** shows no large green areas while it runs)
- [ ] Not on the LCP element; nothing important starts invisible above the fold
- [ ] Runs once (reveals) or only while interacting (hover); no React state updates per frame
- [ ] Reduced motion: content visible in its final state, nothing moves (DevTools → Rendering → **Emulate prefers-reduced-motion**)
- [ ] Smooth with **4× CPU throttling** on a mid-range profile; no long tasks over 100 ms caused by our code
- [ ] Touch: works with native scrolling (DevTools device mode); hover-only effects are off
- [ ] GSAP: `useLenisScrollTrigger()` called, everything inside `useGSAP` + `gsap.matchMedia()`, reverted on unmount (navigate away and back: no duplicates, no console errors)
- [ ] Durations and easings come from `styles/motion.ts`, not ad-hoc numbers

## Measuring

- **Bundle:** `npm run analyze`. GSAP must appear only in chunks of routes that use `TextReveal`/`Parallax`; Motion's `domMax` features are a separate async chunk (not in the initial HTML).
- **Smoothness:** DevTools → Performance, CPU 4×, record while scrolling. Look for red long-task markers and frames over 16 ms. Headless or software-rendered Chrome exaggerates the cost of Lenis (see module 07 QA), so judge on a real browser with GPU acceleration.
