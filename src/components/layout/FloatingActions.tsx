'use client';

import { ArrowUp, MessageCircle, MessagesSquare, Phone, X } from 'lucide-react';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { useEffect, useId, useRef, useState } from 'react';
import { transitions } from '@/components/motion/presets';
import { Icon } from '@/components/ui/Icon';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { contactLinks } from '@/lib/site-config';
import { useLenisControls } from '@/providers/smooth-scroll-provider';

/*
 * Floating buttons, bottom right:
 * - Scroll to top: appears after 600px; a ring shows how far down the page
 *   you are. Updated by writing to the DOM on scroll (no React re-render per
 *   frame). Smooth with Lenis, instant with reduced motion.
 * - Contact: expands into WhatsApp, Messenger and Call.
 *
 * Sits above the phone's home indicator (safe-area inset) and above a future
 * sticky add-to-cart bar (--floating-offset, set by module 23). Hidden while
 * a modal/drawer locks the page, so it never covers the cart drawer.
 */

const SHOW_AFTER = 600;
const RING = 2 * Math.PI * 20; // circumference for r=20

const fab =
  'pointer-events-auto grid size-12 place-items-center rounded-full shadow-lg transition-[transform,opacity,background-color] duration-base ease-standard';

function ScrollToTop() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const { scrollTo } = useLenisControls();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const ring = ringRef.current;
    if (!wrap || !ring) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      ring.style.strokeDashoffset = String(RING * (1 - progress));
      wrap.dataset.visible = String(window.scrollY > SHOW_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      data-visible="false"
      // Hidden (and out of the tab order) until scrolled down.
      className="group transition-[opacity,transform,visibility] duration-base ease-standard data-[visible=false]:invisible data-[visible=false]:translate-y-2 data-[visible=false]:opacity-0"
    >
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => {
          scrollTo(0, { immediate: reduced });
          // Start keyboard users at the top too.
          document
            .querySelector<HTMLElement>('a, button')
            ?.focus({ preventScroll: true });
        }}
        className={cn(
          fab,
          'relative bg-surface-raised text-fg hover:-translate-y-0.5',
        )}
      >
        <svg
          viewBox="0 0 48 48"
          aria-hidden="true"
          className="absolute inset-0 -rotate-90"
        >
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            strokeWidth="2"
            className="stroke-border"
          />
          <circle
            ref={ringRef}
            cx="24"
            cy="24"
            r="20"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={RING}
            strokeDashoffset={RING}
            className="stroke-fg"
          />
        </svg>
        <Icon icon={ArrowUp} size="sm" />
      </button>
    </div>
  );
}

const contactOptions = [
  {
    label: 'WhatsApp',
    href: contactLinks.whatsapp,
    icon: MessageCircle,
    external: true,
  },
  {
    label: 'Messenger',
    href: contactLinks.messenger,
    icon: MessagesSquare,
    external: true,
  },
  { label: 'Call us', href: contactLinks.call, icon: Phone, external: false },
];

function ContactFab() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const reduced = useReducedMotion() ?? false;

  useEscapeKey(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, open);
  useClickOutside([wrapRef], () => setOpen(false), open);

  return (
    <div ref={wrapRef} className="flex items-center gap-3">
      <AnimatePresence>
        {open && (
          <m.ul
            id={listId}
            aria-label="Contact options"
            className="flex flex-row-reverse gap-2"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { transition: { duration: 0 } },
              visible: {},
            }}
          >
            {contactOptions.map((o, i) => (
              <m.li
                key={o.label}
                variants={{
                  hidden: { opacity: 0, x: 12, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    transition: reduced
                      ? { duration: 0 }
                      : { ...transitions.enter, delay: i * 0.04 },
                  },
                }}
              >
                <a
                  href={o.href}
                  {...(o.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  aria-label={
                    o.external ? `${o.label} (opens in a new tab)` : o.label
                  }
                  className={cn(
                    fab,
                    'bg-surface-raised text-fg hover:-translate-y-0.5',
                  )}
                >
                  <Icon icon={o.icon} size="sm" />
                </a>
              </m.li>
            ))}
          </m.ul>
        )}
      </AnimatePresence>
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? 'Close contact options' : 'Contact us'}
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          fab,
          'size-14 bg-primary text-primary-fg hover:scale-105',
        )}
      >
        <Icon
          icon={open ? X : MessageCircle}
          className={cn(
            'transition-transform duration-base',
            open && 'rotate-90',
          )}
        />
      </button>
    </div>
  );
}

export function FloatingActions() {
  return (
    <div
      data-floating-actions
      className="pointer-events-none fixed right-[calc(1rem+var(--scrollbar-compensation,0px))] bottom-[calc(1rem+env(safe-area-inset-bottom)+var(--floating-offset,0px))] z-floating flex flex-col items-end gap-3 transition-opacity duration-fast [html[data-scroll-locked]_&]:invisible [html[data-scroll-locked]_&]:opacity-0"
    >
      <ScrollToTop />
      <ContactFab />
    </div>
  );
}
