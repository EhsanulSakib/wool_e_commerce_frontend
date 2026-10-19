'use client';

import { ReactLenis } from 'lenis/react';

/**
 * Smooth wheel scrolling on desktop. Touch devices keep native scrolling
 * (`syncTouch: false`), which feels better and avoids lag on phones.
 * Module 07 connects Lenis to GSAP's ticker for scroll animations.
 */
export default function SmoothScrolling({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1, // smoothing factor: lower = smoother but floatier
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
