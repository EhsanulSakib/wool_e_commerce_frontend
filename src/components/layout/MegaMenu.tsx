'use client';

import { ArrowRight, ChevronDown } from 'lucide-react';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { transitions } from '@/components/motion/presets';
import { Container } from '@/components/ui/layout';
import { Icon } from '@/components/ui/Icon';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { cn } from '@/lib/cn';
import { siteConfig } from '@/lib/site-config';

/*
 * "Shop" mega menu (desktop). Disclosure navigation pattern: a button that
 * shows a panel of links (not role="menu", which is for app-like actions).
 *
 * - Mouse: opens after a short hover-intent delay, closes shortly after the
 *   pointer leaves (so crossing a gap doesn't close it).
 * - Keyboard: Enter/Space toggles, Tab walks through the links in order,
 *   Escape closes and returns focus to "Shop", tabbing out closes it.
 * - The panel is positioned against the sticky header (full width).
 */

const OPEN_DELAY = 150;
const CLOSE_DELAY = 200;

// Knit texture standing in for category photos until module 10.
const knit =
  'bg-muted bg-[repeating-linear-gradient(45deg,var(--border)_0_2px,transparent_2px_14px),repeating-linear-gradient(-45deg,var(--border)_0_2px,transparent_2px_14px)]';

export function MegaMenu({
  onOpenChange,
}: {
  /** Lets the navbar stay visible while the menu is open. */
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpenState] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // A hover-opened menu shouldn't close when the same pointer then clicks.
  const openedBy = useRef<'hover' | 'click'>('click');
  const panelId = useId();
  const reduced = useReducedMotion() ?? false;

  const setOpen = (next: boolean) => {
    setOpenState(next);
    onOpenChange?.(next);
  };
  const schedule = (next: boolean, delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), delay);
  };
  const close = (focusButton: boolean) => {
    clearTimeout(timer.current);
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  };

  useEffect(() => () => clearTimeout(timer.current), []);
  useEscapeKey(() => close(true), open);
  useClickOutside([itemRef], () => close(false), open);

  return (
    <li
      ref={itemRef}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return;
        if (!open) openedBy.current = 'hover';
        schedule(true, OPEN_DELAY);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') schedule(false, CLOSE_DELAY);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) close(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          clearTimeout(timer.current);
          if (open && openedBy.current === 'hover') {
            openedBy.current = 'click'; // keep it open; next click closes
            return;
          }
          openedBy.current = 'click';
          setOpen(!open);
        }}
        className={cn(
          'flex items-center gap-1 rounded-sm py-2 text-small font-medium transition-colors duration-fast',
          open ? 'text-fg' : 'text-muted-fg hover:text-fg',
        )}
      >
        Shop
        <Icon
          icon={ChevronDown}
          size="xs"
          className={cn(
            'transition-transform duration-base ease-standard',
            open && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            id={panelId}
            initial={{ opacity: 0, y: -8 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: reduced ? { duration: 0 } : transitions.base,
            }}
            exit={{
              opacity: 0,
              y: -8,
              transition: reduced ? { duration: 0 } : transitions.exit,
            }}
            className="absolute inset-x-0 top-full border-b border-border bg-bg shadow-lg"
          >
            <Container
              size="wide"
              className="grid gap-10 py-8 lg:grid-cols-[1fr_16rem]"
            >
              <div>
                <p className="mb-4 text-caption text-muted-fg uppercase">
                  Categories
                </p>
                <ul className="grid grid-cols-5 gap-4">
                  {siteConfig.categories.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        prefetch={false}
                        onClick={() => close(false)}
                        className="group block rounded-lg"
                      >
                        <span className="mb-3 block aspect-4/5 overflow-hidden rounded-lg">
                          <span
                            className={cn(
                              'block size-full transition-transform duration-slow ease-out-expo group-hover:scale-105',
                              knit,
                            )}
                          />
                        </span>
                        <span className="block font-display text-h6 group-hover:underline group-hover:underline-offset-4">
                          {c.label}
                        </span>
                        <span className="mt-1 block text-small text-muted-fg">
                          {c.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-4 text-caption text-muted-fg uppercase">
                  Collections
                </p>
                <ul className="grid gap-1">
                  {siteConfig.collections.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        prefetch={false}
                        onClick={() => close(false)}
                        className="group flex items-center justify-between rounded-md py-2 text-body transition-colors duration-fast hover:text-muted-fg"
                      >
                        {c.label}
                        <Icon
                          icon={ArrowRight}
                          size="sm"
                          className="-translate-x-1 opacity-0 transition-[opacity,transform] duration-fast group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  );
}
