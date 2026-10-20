'use client';

import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

/*
 * Renders children at the end of <body>, outside every parent's overflow,
 * transform and z-index, so overlays are never clipped or covered.
 * Nothing renders on the server (overlays are closed there anyway).
 */

const noop = () => () => {};

/** false on the server and during hydration, true afterwards. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

export function Portal({
  children,
  container,
}: {
  children: React.ReactNode;
  /** Where to render (default: <body>). */
  container?: Element | null;
}) {
  const isClient = useIsClient();
  return isClient ? createPortal(children, container ?? document.body) : null;
}
