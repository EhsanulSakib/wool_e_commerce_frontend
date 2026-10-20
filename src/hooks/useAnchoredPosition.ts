'use client';

import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';

/*
 * Places a floating element (menu, popover, tooltip) next to its trigger,
 * with `position: fixed` so it works from inside a portal.
 *
 * - Flips to the opposite side when there isn't room (bottom → top).
 * - Shifts sideways to stay inside the viewport (8px margin).
 * - Follows the trigger on scroll and resize while open (one rAF-batched
 *   update per frame, no React state when nothing moved).
 */

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';

export interface Position {
  top: number;
  left: number;
  /** The side actually used after flipping (for the animation origin). */
  side: Side;
}

const MARGIN = 8;

const opposite: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

export function computePosition(
  anchor: DOMRect,
  floating: { width: number; height: number },
  viewport: { width: number; height: number },
  side: Side,
  align: Align,
  offset: number,
): Position {
  const room: Record<Side, number> = {
    top: anchor.top - MARGIN,
    bottom: viewport.height - anchor.bottom - MARGIN,
    left: anchor.left - MARGIN,
    right: viewport.width - anchor.right - MARGIN,
  };
  const needed =
    side === 'top' || side === 'bottom' ? floating.height : floating.width;
  const final =
    room[side] < needed + offset && room[opposite[side]] > room[side]
      ? opposite[side]
      : side;

  let top: number;
  let left: number;
  if (final === 'top' || final === 'bottom') {
    top =
      final === 'bottom'
        ? anchor.bottom + offset
        : anchor.top - offset - floating.height;
    left =
      align === 'start'
        ? anchor.left
        : align === 'end'
          ? anchor.right - floating.width
          : anchor.left + anchor.width / 2 - floating.width / 2;
  } else {
    left =
      final === 'right'
        ? anchor.right + offset
        : anchor.left - offset - floating.width;
    top =
      align === 'start'
        ? anchor.top
        : align === 'end'
          ? anchor.bottom - floating.height
          : anchor.top + anchor.height / 2 - floating.height / 2;
  }

  const clamp = (v: number, size: number, max: number) =>
    Math.min(Math.max(v, MARGIN), Math.max(MARGIN, max - size - MARGIN));
  return {
    top: clamp(top, floating.height, viewport.height),
    left: clamp(left, floating.width, viewport.width),
    side: final,
  };
}

export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  open: boolean,
  {
    side = 'bottom',
    align = 'center',
    offset = 8,
  }: {
    side?: Side;
    align?: Align;
    offset?: number;
  } = {},
): Position | null {
  const [position, setPosition] = useState<Position | null>(null);

  const update = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;
    const next = computePosition(
      anchor.getBoundingClientRect(),
      { width: floating.offsetWidth, height: floating.offsetHeight },
      { width: window.innerWidth, height: window.innerHeight },
      side,
      align,
      offset,
    );
    setPosition((prev) =>
      prev &&
      Math.round(prev.top) === Math.round(next.top) &&
      Math.round(prev.left) === Math.round(next.left) &&
      prev.side === next.side
        ? prev
        : next,
    );
  }, [anchorRef, floatingRef, side, align, offset]);

  useLayoutEffect(() => {
    if (!open) return;
    // Measure before paint, so the element never flashes at 0,0.
    update();
    let frame = 0;
    const schedule = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
    };
    window.addEventListener('scroll', schedule, {
      passive: true,
      capture: true,
    });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    if (floatingRef.current) observer.observe(floatingRef.current);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, { capture: true });
      window.removeEventListener('resize', schedule);
      observer.disconnect();
    };
  }, [open, update, floatingRef]);

  return open ? position : null;
}
