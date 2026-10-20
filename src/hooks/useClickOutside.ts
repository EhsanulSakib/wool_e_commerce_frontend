'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Calls `handler` on a pointer press outside every element in `refs`
 * (e.g. the trigger and the popover, so clicking the trigger doesn't count
 * as "outside" and immediately reopen it).
 */
export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: (event: PointerEvent) => void,
  active = true,
) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!active) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      handlerRef.current(event);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
    // refs are stable ref objects
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
