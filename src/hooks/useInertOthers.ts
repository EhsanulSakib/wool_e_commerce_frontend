'use client';

import { useEffect, type RefObject } from 'react';

/*
 * While a modal overlay is open, everything else in <body> becomes `inert`:
 * not clickable, not focusable and hidden from screen readers. aria-modal
 * alone isn't respected by every screen reader; inert is.
 * Elements marked [data-inert-ignore] (the toast region) stay live.
 * Ref-counted per element, so stacked overlays restore correctly.
 */

const counts = new WeakMap<Element, number>();

export function useInertOthers(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    // The direct child of <body> that holds this overlay (its portal root).
    let own: Element = container;
    while (own.parentElement && own.parentElement !== document.body) {
      own = own.parentElement;
    }

    const others = [...document.body.children].filter(
      (el) =>
        el !== own &&
        !el.hasAttribute('data-inert-ignore') &&
        !['SCRIPT', 'STYLE', 'LINK'].includes(el.tagName),
    );
    for (const el of others) {
      const n = counts.get(el) ?? 0;
      if (n === 0) el.setAttribute('inert', '');
      counts.set(el, n + 1);
    }
    return () => {
      for (const el of others) {
        const n = (counts.get(el) ?? 1) - 1;
        counts.set(el, n);
        if (n === 0) el.removeAttribute('inert');
      }
    };
  }, [active, containerRef]);
}
