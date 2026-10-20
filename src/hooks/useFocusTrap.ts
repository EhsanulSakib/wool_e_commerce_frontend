'use client';

import { useEffect, useRef, type RefObject } from 'react';

/*
 * Keeps keyboard focus inside a container while it's active (modal, drawer):
 * - focuses `initialFocus`, else the first focusable element, else the
 *   container itself (give it tabIndex={-1})
 * - Tab / Shift+Tab wrap around from the last to the first element
 * - focus that escapes (a click outside, a script) is pulled back
 * - on deactivate, focus returns to whatever had it before (the trigger)
 */

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

export function getFocusable(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) =>
      !el.closest('[inert], [hidden]') &&
      // Skips display:none / visibility:hidden (missing in jsdom: assume visible).
      (typeof el.checkVisibility !== 'function' ||
        el.checkVisibility({ visibilityProperty: true })),
  );
}

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  options: {
    initialFocus?: RefObject<HTMLElement | null>;
    restoreFocus?: boolean;
  } = {},
) {
  const { initialFocus, restoreFocus = true } = options;
  const initialRef = useRef(initialFocus);
  useEffect(() => {
    initialRef.current = initialFocus;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const target =
      initialRef.current?.current ?? getFocusable(container)[0] ?? container;
    target.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = getFocusable(container);
      if (items.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && (current === first || current === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onFocusIn = (event: FocusEvent) => {
      const el = event.target as HTMLElement;
      // Toasts stay reachable while a modal is open.
      if (container.contains(el) || el.closest('[data-focus-trap-ignore]'))
        return;
      (getFocusable(container)[0] ?? container).focus({ preventScroll: true });
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
      if (restoreFocus && previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [active, containerRef, restoreFocus]);
}
