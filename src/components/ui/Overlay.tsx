'use client';

import { X } from 'lucide-react';
import { AnimatePresence, useIsPresent, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { useId, useRef, type ReactNode } from 'react';
import { transitions } from '@/components/motion/presets';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useInertOthers } from '@/hooks/useInertOthers';
import { useScrollLock } from '@/hooks/useScrollLock';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { Portal } from './Portal';

/*
 * Shared machinery for Modal and Drawer (the WAI-ARIA modal dialog pattern):
 * portal, backdrop, focus trap + restore, scroll lock (Lenis too), the rest
 * of the page made inert, Escape and backdrop click to close, enter/exit
 * animation. Modal and Drawer only differ in panel layout and motion.
 */

export interface OverlayBaseProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name; shown as the heading unless `hideTitle`. */
  title: ReactNode;
  hideTitle?: boolean;
  /** Short text under the title, linked with aria-describedby. */
  description?: ReactNode;
  children?: ReactNode;
  /** Sticky area under the scrolling body (actions). */
  footer?: ReactNode;
  /** Element to focus on open (default: first focusable). */
  initialFocus?: React.RefObject<HTMLElement | null>;
  closeOnBackdrop?: boolean;
  className?: string;
}

type Motion = {
  hidden: Record<string, number | string>;
  visible: Record<string, number | string>;
};

interface OverlayProps extends OverlayBaseProps {
  /** Positions the panel inside the full-screen layer. */
  layerClassName: string;
  panelClassName: string;
  motion: Motion;
}

export function Overlay(props: OverlayProps) {
  return (
    <Portal>
      <AnimatePresence>
        {props.open && <OverlayContent {...props} />}
      </AnimatePresence>
    </Portal>
  );
}

function OverlayContent({
  onClose,
  title,
  hideTitle = false,
  description,
  children,
  footer,
  initialFocus,
  closeOnBackdrop = true,
  className,
  layerClassName,
  panelClassName,
  motion,
}: OverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  // False while the exit animation plays: release focus, scroll and the
  // rest of the page right away instead of after the animation.
  const present = useIsPresent();
  const reduced = useReducedMotion() ?? false;

  // Order matters: effect cleanups run in this order on close, and focus
  // can only return to the trigger once the page is no longer inert.
  useInertOthers(panelRef, present);
  useFocusTrap(panelRef, present, { initialFocus });
  useScrollLock(present);
  useEscapeKey(onClose, present);

  const enter = reduced ? { duration: 0 } : transitions.enter;
  const exit = reduced ? { duration: 0 } : transitions.exit;

  return (
    <div className={cn('fixed inset-0 z-modal flex', layerClassName)}>
      <m.div
        aria-hidden="true"
        className="absolute inset-0 bg-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: enter }}
        exit={{ opacity: 0, transition: exit }}
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <m.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        // Lenis is stopped while open; let the panel scroll natively.
        data-lenis-prevent
        className={cn(
          'relative flex flex-col bg-surface-raised text-fg shadow-xl outline-none',
          panelClassName,
          className,
        )}
        initial={motion.hidden}
        animate={{ ...motion.visible, transition: enter }}
        exit={{ ...motion.hidden, transition: exit }}
      >
        <header className="flex items-start gap-4 px-5 pt-5 pb-3 md:px-6">
          <div className={cn('min-w-0 flex-1', hideTitle && 'sr-only')}>
            <h2 id={titleId} className="font-display text-h5">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-small text-muted-fg">
                {description}
              </p>
            )}
          </div>
          <IconButton
            aria-label="Close"
            size="sm"
            onClick={onClose}
            className="-mt-1 -mr-2 ml-auto"
          >
            <Icon icon={X} />
          </IconButton>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 md:px-6">
          {children}
        </div>
        {footer && (
          <footer className="border-t border-border px-5 py-4 md:px-6">
            {footer}
          </footer>
        )}
      </m.div>
    </div>
  );
}
