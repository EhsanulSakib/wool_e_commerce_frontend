'use client';

import { useEffect } from 'react';
import { useLenis } from '@/providers/smooth-scroll-provider';

/*
 * Stops the page behind an overlay from scrolling.
 *
 * - Stops Lenis (otherwise the wheel still scrolls the page on desktop).
 * - Hides the page scrollbar and pads <body> by its width, so the layout
 *   doesn't jump sideways. The width is also exposed as
 *   --scrollbar-compensation for fixed elements (navbar, floating buttons).
 * - Ref-counted: a drawer opening a modal keeps the lock until both close.
 */

let locks = 0;

function lock() {
  locks += 1;
  if (locks > 1) return;
  const { documentElement: html, body } = document;
  const scrollbar = window.innerWidth - html.clientWidth;
  html.style.setProperty('--scrollbar-compensation', `${scrollbar}px`);
  body.style.paddingRight = `${scrollbar}px`;
  html.style.overflow = 'hidden';
  // Lets fixed UI react, e.g. floating buttons hide behind an open drawer.
  html.dataset.scrollLocked = '';
}

function unlock() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  const { documentElement: html, body } = document;
  html.style.removeProperty('--scrollbar-compensation');
  body.style.paddingRight = '';
  html.style.overflow = '';
  delete html.dataset.scrollLocked;
}

export function useScrollLock(active: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!active) return;
    lock();
    lenis?.stop();
    return () => {
      unlock();
      if (locks === 0) lenis?.start();
    };
  }, [active, lenis]);
}
