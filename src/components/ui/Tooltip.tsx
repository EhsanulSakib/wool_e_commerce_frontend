'use client';

import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { Side } from '@/hooks/useAnchoredPosition';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { cn } from '@/lib/cn';
import { Floating, portalContainerFor } from './Floating';

/*
 * Short hint for a control: swatch color names, icon buttons.
 *
 *   <Tooltip content="Charcoal"><Swatch … /></Tooltip>
 *
 * - Opens on hover (after a short delay) and on keyboard focus.
 * - Stays open while the pointer is over the tooltip itself, and Escape
 *   hides it (WCAG 1.4.13 "content on hover or focus").
 * - Linked with aria-describedby: it adds to the control's name, it never
 *   replaces it. Icon-only buttons still need their own aria-label.
 * - Flips to the other side when there's no room.
 * - Touch has no hover: don't put essential information only in a tooltip.
 */

type ChildProps = {
  ref?: React.Ref<HTMLElement>;
  'aria-describedby'?: string;
  onPointerEnter?: (e: React.PointerEvent) => void;
  onPointerLeave?: (e: React.PointerEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
};

export interface TooltipProps {
  content: ReactNode;
  /** The focusable element the tooltip describes. */
  children: ReactElement<ChildProps>;
  side?: Side;
  /** ms before showing on hover. */
  delay?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  delay = 400,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [container, setContainer] = useState<Element | null>(null);
  const anchorRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();

  const show = (after: number, trigger: Element) => {
    setContainer(portalContainerFor(trigger));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), after);
  };
  const hide = (after = 100) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), after);
  };

  useEffect(() => () => clearTimeout(timer.current), []);
  useEscapeKey(() => hide(0), open);

  const p = children.props;
  return (
    <>
      {cloneElement(children, {
        ref: anchorRef,
        'aria-describedby': [p['aria-describedby'], id]
          .filter(Boolean)
          .join(' '),
        onPointerEnter: (e) => {
          p.onPointerEnter?.(e);
          if (e.pointerType === 'mouse') show(delay, e.currentTarget);
        },
        onPointerLeave: (e) => {
          p.onPointerLeave?.(e);
          hide();
        },
        onFocus: (e) => {
          p.onFocus?.(e);
          // Only keyboard focus: a click shouldn't pop a tooltip. The trigger
          // may also wrap the focusable element (a swatch's <label>).
          if (e.currentTarget.matches(':focus-visible, :has(:focus-visible)'))
            show(0, e.currentTarget);
        },
        onBlur: (e) => {
          p.onBlur?.(e);
          hide(0);
        },
      })}
      {/* The description screen readers use: always in the DOM, so
          aria-describedby resolves whether or not the tooltip is shown. */}
      <span id={id} hidden>
        {content}
      </span>
      <Floating
        open={open}
        container={container}
        anchorRef={anchorRef}
        panelRef={panelRef}
        side={side}
        offset={6}
        role="tooltip"
        aria-hidden="true"
        onPointerEnter={() => clearTimeout(timer.current)}
        onPointerLeave={() => hide()}
        className={cn(
          'z-toast max-w-xs rounded-md bg-primary px-2.5 py-1.5 text-caption text-primary-fg shadow-md',
          className,
        )}
      >
        {content}
      </Floating>
    </>
  );
}
