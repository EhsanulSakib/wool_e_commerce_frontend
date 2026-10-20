'use client';

import { useEffect, type RefObject } from 'react';

/*
 * Hide-on-scroll-down / show-on-scroll-up for the sticky header, without a
 * React re-render per scroll frame: the scroll listener writes two data
 * attributes on the header and CSS does the rest.
 *
 *   data-hidden="true"   → translateY(-100%) (transform only)
 *   data-at-top="false"  → solid background (vs transparent over the hero)
 *
 * Works with Lenis (it scrolls the window, so `scroll` events still fire)
 * and with native scrolling. Never hides while:
 * - near the top of the page,
 * - focus is inside the header (keyboard users),
 * - the header has data-locked="true" (a menu is open).
 */

const THRESHOLD = 6; // px of movement before reacting (ignores jitter)

export function useHeaderScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      header.dataset.atTop = String(y < 8);

      if (y < header.offsetHeight * 2) {
        header.dataset.hidden = 'false';
      } else if (delta > THRESHOLD) {
        const keep =
          header.dataset.locked === 'true' ||
          header.contains(document.activeElement);
        header.dataset.hidden = keep ? 'false' : 'true';
      } else if (delta < -THRESHOLD) {
        header.dataset.hidden = 'false';
      }
      if (Math.abs(delta) > THRESHOLD) lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onFocusIn = () => {
      header.dataset.hidden = 'false';
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    header.addEventListener('focusin', onFocusIn);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      header.removeEventListener('focusin', onFocusIn);
    };
  }, [ref]);
}
