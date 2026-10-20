'use client';

import { useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useIsPointerFine } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { cssEase, duration } from '@/styles/motion';

/*
 * The child leans toward the cursor while it hovers, and springs back on
 * leave. Mouse/trackpad only; off with reduced motion.
 *
 *   <Magnetic><Button>Shop now</Button></Magnetic>
 *
 * Cheap by design: the element's box is measured once on enter (not on every
 * move), pointer moves are batched into one write per animation frame, and
 * only `transform` changes. No React state is touched while moving.
 */

export interface MagneticProps {
  children: React.ReactNode;
  /** How far it follows: 0.3 = 30% of the cursor's distance from center. */
  strength?: number;
  className?: string;
}

export function Magnetic({
  children,
  strength = 0.3,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const pointerFine = useIsPointerFine();
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const el = ref.current;
    if (!el || !pointerFine || reduced) return;

    let rect: DOMRect | null = null;
    let frameId = 0;
    let x = 0;
    let y = 0;

    const write = () => {
      frameId = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onEnter = () => {
      rect = el.getBoundingClientRect();
      el.style.willChange = 'transform'; // only while active
      el.style.transition = `transform ${duration.fast}ms ${cssEase('standard')}`;
    };

    const onMove = (event: PointerEvent) => {
      if (!rect) return;
      x = (event.clientX - (rect.left + rect.width / 2)) * strength;
      y = (event.clientY - (rect.top + rect.height / 2)) * strength;
      if (!frameId) frameId = requestAnimationFrame(write);
    };

    const onLeave = () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
      rect = null;
      el.style.transition = `transform ${duration.slower}ms ${cssEase('emphasized')}`;
      el.style.transform = '';
    };

    const onTransitionEnd = () => {
      if (!rect) el.style.willChange = '';
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('transitionend', onTransitionEnd);
    return () => {
      cancelAnimationFrame(frameId);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('transitionend', onTransitionEnd);
      el.style.transform = '';
      el.style.transition = '';
      el.style.willChange = '';
    };
  }, [pointerFine, reduced, strength]);

  return (
    <span ref={ref} className={cn('inline-block', className)}>
      {children}
    </span>
  );
}
