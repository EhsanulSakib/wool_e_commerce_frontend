import { stagger, type Transition, type Variants } from 'motion/react';
import { durationS, ease } from '@/styles/motion';

/*
 * Motion variants built from the motion tokens. Every preset has the same
 * two states, `hidden` and `visible`, so they're interchangeable:
 *
 *   <m.div variants={fadeUp} initial="hidden" whileInView="visible" />
 *
 * Only transform and opacity are animated (cheap: the GPU composites them
 * without re-layout or repaint).
 */

/** Token easings as mutable arrays (Motion's types don't accept readonly). */
const curve = (name: keyof typeof ease) =>
  [...ease[name]] as [number, number, number, number];

export const transitions = {
  /** UI state changes: dropdowns, toggles. */
  base: { duration: durationS.base, ease: curve('standard') },
  /** Things entering the screen: drawers, modals. */
  enter: { duration: durationS.slow, ease: curve('emphasized') },
  /** Things leaving the screen. */
  exit: { duration: durationS.base, ease: curve('exit') },
  /** Scroll reveals: fast start, long soft landing. */
  reveal: { duration: durationS.slower, ease: curve('outExpo') },
} satisfies Record<string, Transition>;

const DISTANCE = 24; // px: enough to read as movement, small enough to stay calm

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.reveal },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: DISTANCE },
  visible: { opacity: 1, y: 0, transition: transitions.reveal },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transitions.reveal },
};

/** Slides in from the left (`from="left"`) or the right. */
export const slideIn = (from: 'left' | 'right' = 'left'): Variants => ({
  hidden: { opacity: 0, x: from === 'left' ? -DISTANCE * 1.5 : DISTANCE * 1.5 },
  visible: { opacity: 1, x: 0, transition: transitions.reveal },
});

/** Container that reveals its variant children one after another. */
export const staggerContainer = (
  interval = 0.08,
  startDelay = 0,
): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren: stagger(interval, { startDelay }) } },
});

export const presets = {
  fadeIn,
  fadeUp,
  scaleIn,
  slideLeft: slideIn('left'),
  slideRight: slideIn('right'),
} as const;

export type PresetName = keyof typeof presets;

/**
 * A preset with an extra delay, or with every transition zeroed for reduced
 * motion (content appears at once in its final place).
 */
export function withTransition(
  variants: Variants,
  { delay = 0, reduced = false }: { delay?: number; reduced?: boolean },
): Variants {
  const visible = variants.visible as Record<string, unknown> & {
    transition?: Transition;
  };
  return {
    ...variants,
    visible: {
      ...visible,
      transition: reduced
        ? { duration: 0, delayChildren: 0 }
        : { ...visible.transition, delay },
    },
  };
}
