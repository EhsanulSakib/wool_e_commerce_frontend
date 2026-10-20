'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { transitions } from '@/components/motion/presets';
import { cn } from '@/lib/cn';
import { Button } from './Button';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { Portal } from './Portal';

/*
 * Toasts: short, non-blocking messages ("Added to cart", "Couldn't save").
 *
 *   import { toast } from '@/components/ui/Toast';
 *   toast.success('Added to cart', { description: 'Merino crew, Charcoal / M' });
 *   toast.error('Payment failed', { action: { label: 'Retry', onClick: retry } });
 *   toast.info('Item removed', { action: { label: 'Undo', onClick: restore } });
 *
 * - Callable from anywhere in client code (a tiny store outside React).
 * - At most 3 on screen; more wait in a queue, in order.
 * - Auto-dismiss (5s, errors 8s); hovering or focusing the stack pauses
 *   every timer, so there's always time to read or press the action.
 * - Announced by screen readers through a live region that exists before any
 *   toast arrives. The region stays usable while a modal is open.
 * - <Toaster /> is rendered once, in the root layout.
 */

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  description?: string;
  /** ms on screen; 0 = until dismissed. */
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastItem extends Required<
  Omit<ToastOptions, 'action' | 'description'>
> {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
  action?: ToastOptions['action'];
}

// ---------------------------------------------------------------- store

const MAX_VISIBLE = 3;
let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const EMPTY: ToastItem[] = [];

function add(tone: ToastTone, title: string, options: ToastOptions = {}) {
  const id = nextId++;
  items = [
    ...items,
    {
      id,
      tone,
      title,
      description: options.description,
      action: options.action,
      duration: options.duration ?? (tone === 'error' ? 8000 : 5000),
    },
  ];
  emit();
  return id;
}

function dismiss(id?: number) {
  items = id === undefined ? [] : items.filter((t) => t.id !== id);
  emit();
}

export const toast = Object.assign(
  (title: string, options?: ToastOptions) => add('info', title, options),
  {
    success: (title: string, options?: ToastOptions) =>
      add('success', title, options),
    error: (title: string, options?: ToastOptions) =>
      add('error', title, options),
    info: (title: string, options?: ToastOptions) =>
      add('info', title, options),
    warning: (title: string, options?: ToastOptions) =>
      add('warning', title, options),
    /** Dismiss one toast, or all of them without an id. */
    dismiss,
  },
);

// ---------------------------------------------------------------- UI

const tones: Record<ToastTone, { icon: LucideIcon; color: string }> = {
  success: { icon: CheckCircle2, color: 'text-success' },
  error: { icon: XCircle, color: 'text-danger' },
  info: { icon: Info, color: 'text-info' },
  warning: { icon: AlertTriangle, color: 'text-warning' },
};

export function Toaster() {
  const all = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => items,
    () => EMPTY,
  );
  const [paused, setPaused] = useState(false);
  const visible = all.slice(0, MAX_VISIBLE);

  return (
    <Portal>
      <section
        aria-label="Notifications"
        // Stays usable while a modal makes the rest of the page inert.
        data-inert-ignore
        data-focus-trap-ignore
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node))
            setPaused(false);
        }}
        className="pointer-events-none fixed inset-x-4 bottom-4 z-toast flex justify-center sm:inset-x-auto sm:right-[calc(1rem+var(--scrollbar-compensation,0px))] sm:justify-end"
      >
        <ol
          aria-live="polite"
          aria-relevant="additions"
          className="flex w-full max-w-sm flex-col gap-2"
        >
          <AnimatePresence initial={false}>
            {visible.map((t) => (
              <ToastCard key={t.id} toast={t} paused={paused} />
            ))}
          </AnimatePresence>
        </ol>
      </section>
    </Portal>
  );
}

function ToastCard({
  toast: t,
  paused,
}: {
  toast: ToastItem;
  paused: boolean;
}) {
  const reduced = useReducedMotion() ?? false;
  const { icon, color } = tones[t.tone];
  // Time left survives pauses: the timer restarts with what remained.
  const remaining = useRef(t.duration);

  useEffect(() => {
    if (paused || t.duration === 0) return;
    const started = Date.now();
    const timer = setTimeout(() => dismiss(t.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - started;
    };
  }, [paused, t.id, t.duration]);

  return (
    <m.li
      layout={!reduced}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: reduced ? { duration: 0 } : transitions.enter,
      }}
      exit={{
        opacity: 0,
        scale: 0.96,
        transition: reduced ? { duration: 0 } : transitions.exit,
      }}
      transition={reduced ? { duration: 0 } : transitions.base}
      className="pointer-events-auto flex items-start gap-3 rounded-lg border border-border bg-surface-raised p-4 text-fg shadow-lg"
    >
      <Icon icon={icon} className={cn('mt-0.5', color)} />
      <div className="min-w-0 flex-1">
        <p className="text-small font-medium">{t.title}</p>
        {t.description && (
          <p className="mt-0.5 text-small text-muted-fg">{t.description}</p>
        )}
        {t.action && (
          <Button
            variant="link"
            size="sm"
            className="mt-1 font-semibold underline"
            onClick={() => {
              t.action?.onClick();
              dismiss(t.id);
            }}
          >
            {t.action.label}
          </Button>
        )}
      </div>
      <IconButton
        aria-label="Dismiss notification"
        size="sm"
        className="-mt-1.5 -mr-1.5 size-8"
        onClick={() => dismiss(t.id)}
      >
        <Icon icon={X} size="sm" />
      </IconButton>
    </m.li>
  );
}
