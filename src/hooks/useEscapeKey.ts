'use client';

import { useEffect, useRef } from 'react';

/*
 * Escape closes only the topmost layer: with a dropdown open inside a modal,
 * the first Escape closes the dropdown, the second the modal. Every active
 * caller joins a stack; only the last one to open receives the key.
 */

const stack: symbol[] = [];

export function useEscapeKey(handler: () => void, active = true) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!active) return;
    const id = Symbol('layer');
    stack.push(id);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || stack.at(-1) !== id) return;
      event.stopPropagation();
      handlerRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      stack.splice(stack.indexOf(id), 1);
    };
  }, [active]);
}
