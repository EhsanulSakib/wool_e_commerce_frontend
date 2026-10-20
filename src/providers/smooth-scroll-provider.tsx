'use client';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect, useSyncExternalStore } from 'react';
import {
  useIsPointerFine,
  usePrefersReducedMotion,
} from '@/hooks/useMediaQuery';

/*
 * Smooth wheel scrolling (Lenis) for the whole site.
 *
 * - Desktop wheel/trackpad only. Lenis isn't even created on touch-only
 *   devices (phones, tablets): it would do nothing there but still cost a
 *   per-frame loop and scroll reads (it cut mobile Lighthouse TBT from
 *   ~750ms to ~60ms). On hybrid devices touch stays native (syncTouch off).
 * - Off with "reduce motion" (smoothing IS motion) and on layouts that render
 *   <NativeScroll /> (the admin area).
 * - One animation loop: by default a small rAF loop here calls lenis.raf().
 *   Pages that use GSAP ScrollTrigger hand the loop to gsap.ticker (see
 *   useLenisScrollTrigger in lib/gsap.ts), so Lenis and ScrollTrigger update
 *   in the same frame and never fight. GSAP itself is not imported here, so
 *   pages without GSAP animations don't download it.
 * - Nested scroll areas (modals, drawers) need `data-lenis-prevent`.
 */

// ---------------------------------------------------------------- store
// A tiny external store instead of React state: the instance is created in
// an effect, and components read it with useSyncExternalStore.

type Listener = () => void;

const store = {
  lenis: null as Lenis | null,
  nativeScrollRequests: 0,
  /** >0 while something else (gsap.ticker) calls lenis.raf(). */
  externalDrivers: 0,
  listeners: new Set<Listener>(),
  emit() {
    store.listeners.forEach((l) => l());
  },
  subscribe(listener: Listener) {
    store.listeners.add(listener);
    return () => store.listeners.delete(listener);
  },
};

/** The current Lenis instance, or null (touch-only device, reduced motion, <NativeScroll />, server). */
export function useLenis(): Lenis | null {
  return useSyncExternalStore(
    store.subscribe,
    () => store.lenis,
    () => null,
  );
}

/**
 * Lets another loop drive Lenis (gsap.ticker). Returns a release function.
 * While claimed, the provider's own rAF loop doesn't call lenis.raf().
 */
export function claimLenisDriver(): () => void {
  store.externalDrivers += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    store.externalDrivers -= 1;
  };
}

/**
 * Stop/start/scrollTo that work with or without Lenis (falling back to the
 * browser), so callers don't need to care whether smoothing is on.
 */
export function useLenisControls() {
  const lenis = useLenis();
  return {
    /** Lock page scrolling (e.g. while a modal is open). */
    stop: () => {
      if (lenis) lenis.stop();
      else document.documentElement.style.overflow = 'hidden';
    },
    start: () => {
      if (lenis) lenis.start();
      else document.documentElement.style.overflow = '';
    },
    /** A number (px), a CSS selector ("#reviews") or an element. */
    scrollTo: (
      target: number | string | HTMLElement,
      options: { offset?: number; immediate?: boolean } = {},
    ) => {
      if (lenis) {
        lenis.scrollTo(target, options);
        return;
      }
      const el =
        typeof target === 'string' ? document.querySelector(target) : target;
      const top =
        typeof el === 'number'
          ? el
          : el
            ? el.getBoundingClientRect().top + window.scrollY
            : 0;
      window.scrollTo({
        top: top + (options.offset ?? 0),
        behavior: options.immediate ? 'instant' : 'smooth',
      });
    },
  };
}

/**
 * Render this in a layout to turn smooth scrolling off while that layout is
 * mounted (the admin area: tables and forms feel better with native scroll).
 */
export function NativeScroll() {
  useEffect(() => {
    store.nativeScrollRequests += 1;
    store.emit();
    return () => {
      store.nativeScrollRequests -= 1;
      store.emit();
    };
  }, []);
  return null;
}

// ---------------------------------------------------------------- provider

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const pointerFine = useIsPointerFine();
  const nativeRequested = useSyncExternalStore(
    store.subscribe,
    () => store.nativeScrollRequests > 0,
    () => false,
  );
  const enabled = pointerFine && !reducedMotion && !nativeRequested;

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      autoRaf: false, // we drive it (below, or gsap.ticker)
      lerp: 0.1, // smoothing: lower = smoother but floatier
      syncTouch: false, // native scrolling on touch devices
      anchors: true, // smooth-scroll in-page #links
      stopInertiaOnNavigate: true, // don't keep gliding after a route change
    });

    let frameId = requestAnimationFrame(function frame(time) {
      if (store.externalDrivers === 0) lenis.raf(time);
      frameId = requestAnimationFrame(frame);
    });

    store.lenis = lenis;
    store.emit();

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      store.lenis = null;
      store.emit();
    };
  }, [enabled]);

  return children;
}
