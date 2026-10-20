'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
import { durationS, ease } from '@/styles/motion';

/*
 * Motion setup for the whole app.
 *
 * - LazyMotion + `strict`: only the tiny `m.*` components are allowed (a full
 *   `motion.*` component would throw), and the animation features
 *   (domAnimation: animations, variants, exit, hover/tap, inView) load in a
 *   separate chunk after the page is interactive.
 * - reducedMotion="user": with the OS "reduce motion" setting, Motion skips
 *   transform animations. Our components also zero the durations (see Reveal).
 * - Default transition = motion tokens.
 */

const loadFeatures = () =>
  import('./motion-features').then((mod) => mod.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: durationS.base, ease: ease.standard }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
