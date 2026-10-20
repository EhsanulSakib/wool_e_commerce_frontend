'use client';

import { AnimatePresence, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import type { ComponentProps, RefObject } from 'react';
import { transitions } from '@/components/motion/presets';
import {
  useAnchoredPosition,
  type Align,
  type Side,
} from '@/hooks/useAnchoredPosition';
import { cn } from '@/lib/cn';
import { Portal } from './Portal';

/*
 * A small panel anchored to a trigger (menu, popover, tooltip): portal,
 * fixed positioning with flip, and a quick fade/scale from the side it
 * opens on. Internal building block; use DropdownMenu, Popover or Tooltip.
 */

export interface FloatingProps extends Omit<
  ComponentProps<'div'>,
  'ref' | 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
> {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  /** Receives the panel element (for click-outside and focus handling). */
  panelRef: RefObject<HTMLDivElement | null>;
  side?: Side;
  align?: Align;
  offset?: number;
  /** Portal target; see portalContainerFor(). */
  container?: Element | null;
}

/**
 * Where a floating panel should render: inside the trigger's landmark
 * (main, header, nav…), so it stays part of that region for screen readers
 * and audits; <body> otherwise. Call it with the trigger in an event handler.
 */
export function portalContainerFor(trigger: Element | null): Element | null {
  return trigger?.closest('main, header, footer, nav, aside') ?? null;
}

export function Floating({ open, container, ...props }: FloatingProps) {
  return (
    <Portal container={container}>
      <AnimatePresence>
        {open && <FloatingContent {...props} />}
      </AnimatePresence>
    </Portal>
  );
}

const origin: Record<Side, string> = {
  bottom: 'top',
  top: 'bottom',
  left: 'right',
  right: 'left',
};

function FloatingContent({
  anchorRef,
  panelRef,
  side = 'bottom',
  align = 'center',
  offset = 8,
  className,
  style,
  children,
  ...props
}: Omit<FloatingProps, 'open'>) {
  const position = useAnchoredPosition(anchorRef, panelRef, true, {
    side,
    align,
    offset,
  });
  const reduced = useReducedMotion() ?? false;
  const t = reduced ? { duration: 0 } : transitions.base;

  return (
    <m.div
      ref={panelRef}
      className={cn('fixed top-0 left-0 z-dropdown', className)}
      style={{
        ...style,
        // No visibility:hidden before the first measurement: it would block
        // focusing the first menu item. The position is set in a layout
        // effect, before paint, and the panel starts at opacity 0 anyway.
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        transformOrigin: origin[position?.side ?? side],
      }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1, transition: t }}
      exit={{
        opacity: 0,
        scale: 0.96,
        transition: reduced ? t : transitions.exit,
      }}
      {...props}
    >
      {children}
    </m.div>
  );
}
