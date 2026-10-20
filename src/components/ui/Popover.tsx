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
import { getFocusable } from '@/hooks/useFocusTrap';
import type { Align, Side } from '@/hooks/useAnchoredPosition';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { cn } from '@/lib/cn';
import { Floating, portalContainerFor } from './Floating';

/*
 * Small non-modal panel next to a trigger: delivery info, a quick filter,
 * "what's this?". The page stays usable (no focus trap, no scroll lock).
 *
 *   <Popover trigger={<Button variant="ghost">Delivery info</Button>} label="Delivery">
 *     <p>Inside Dhaka: 1–2 days…</p>
 *   </Popover>
 *
 * Focus moves into the panel on open; Escape or a click outside closes it
 * and returns focus to the trigger; tabbing out of it closes it.
 */

type TriggerProps = {
  ref?: React.Ref<HTMLElement>;
  onClick?: (e: React.MouseEvent) => void;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'aria-haspopup'?: 'dialog';
};

export interface PopoverProps {
  trigger: ReactElement<TriggerProps>;
  children: ReactNode;
  /** Accessible name of the panel. */
  label: string;
  side?: Side;
  align?: Align;
  className?: string;
}

export function Popover({
  trigger,
  children,
  label,
  side = 'bottom',
  align = 'center',
  className,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [container, setContainer] = useState<Element | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = (focusTrigger: boolean) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    (getFocusable(panel)[0] ?? panel).focus({ preventScroll: true });
  }, [open]);

  useEscapeKey(() => close(true), open);
  useClickOutside([triggerRef, panelRef], () => close(false), open);

  return (
    <>
      {cloneElement(trigger, {
        ref: triggerRef,
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': open ? panelId : undefined,
        onClick: (e) => {
          trigger.props.onClick?.(e);
          setContainer(portalContainerFor(e.currentTarget as Element));
          setOpen((o) => !o);
        },
      })}
      <Floating
        open={open}
        container={container}
        anchorRef={triggerRef}
        panelRef={panelRef}
        side={side}
        align={align}
        id={panelId}
        role="dialog"
        aria-label={label}
        tabIndex={-1}
        onBlur={(e) => {
          const next = e.relatedTarget as Node | null;
          if (
            next &&
            !panelRef.current?.contains(next) &&
            !triggerRef.current?.contains(next)
          )
            close(false);
        }}
        className={cn(
          'w-max max-w-[min(calc(100vw-1rem),22rem)] rounded-lg border border-border bg-surface-raised p-4 text-small text-fg shadow-lg outline-none',
          className,
        )}
      >
        {children}
      </Floating>
    </>
  );
}
