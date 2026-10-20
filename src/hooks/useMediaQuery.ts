'use client';

import { useSyncExternalStore } from 'react';

/**
 * Live result of a CSS media query. Returns `false` on the server and during
 * hydration (no window there), then the real value, so markup never
 * mismatches. Uses useSyncExternalStore: no effect + setState round trip.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** A mouse or trackpad: hover effects (Magnetic, hover parallax) make sense. */
export function useIsPointerFine(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

/**
 * The OS "reduce motion" setting. In Motion components prefer Motion's own
 * `useReducedMotion()`; in GSAP code use `gsap.matchMedia()` instead.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
