/**
 * Motion tokens for JavaScript animations (Motion, GSAP).
 *
 * Same values as the CSS variables in tokens.css (--duration-*, --ease-*),
 * so a CSS hover and a Motion drawer feel like one system. tokens.test.ts
 * fails if the two drift apart.
 */

/** Durations in milliseconds. */
export const duration = {
  fast: 150, // hovers, small state changes
  base: 250, // most UI transitions: dropdowns, toggles
  slow: 400, // drawers, modals, larger movement
  slower: 700, // scroll reveals, hero entrances
} as const;

/** Durations in seconds (Motion and GSAP use seconds). */
export const durationS = {
  fast: duration.fast / 1000,
  base: duration.base / 1000,
  slow: duration.slow / 1000,
  slower: duration.slower / 1000,
} as const;

type Bezier = readonly [number, number, number, number];

/** Cubic-bezier control points. Motion accepts these arrays directly. */
export const ease = {
  standard: [0.2, 0, 0, 1], // default for UI transitions
  emphasized: [0.05, 0.7, 0.1, 1], // elements entering the screen
  outExpo: [0.16, 1, 0.3, 1], // reveals: fast start, long soft landing
  exit: [0.3, 0, 1, 1], // elements leaving the screen
} as const satisfies Record<string, Bezier>;

export type EaseName = keyof typeof ease;

/** `cubic-bezier(…)` string, e.g. for inline styles or GSAP's CustomEase. */
export function cssEase(name: EaseName): string {
  return `cubic-bezier(${ease[name].join(', ')})`;
}

/**
 * GSAP's built-in ease names closest to each token curve, so GSAP code
 * doesn't need the CustomEase plugin. Use these in gsap.to/from.
 */
export const gsapEase: Record<EaseName, string> = {
  standard: 'power2.out',
  emphasized: 'power3.out',
  outExpo: 'expo.out',
  exit: 'power2.in',
};
