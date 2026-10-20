'use client';

import { useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/cn';

/*
 * A number that counts up from 0 once it scrolls into view.
 *
 *   <CountUp value={30000} suffix="+" />   → "30,000+"
 *   <CountUp value={4.8} />                → "4.8" (decimals follow the value)
 *
 * - The final number is in the server HTML (search engines and no-JS users
 *   see it); the count-up only plays in the browser.
 * - Screen readers always read the final number (a visually hidden copy);
 *   the animating digits are aria-hidden.
 * - Updates the text directly each frame: no React re-render per frame.
 * - With reduced motion it simply shows the final number.
 */

export interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Digits after the point. Defaults to as many as `value` has. */
  decimals?: number;
  /** Milliseconds. */
  duration?: number;
  /** Intl locale for thousands separators. */
  locale?: string;
  className?: string;
}

/** Ease-out-expo: fast start, long soft landing (like the outExpo token). */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

export function CountUp({
  value,
  prefix = '',
  suffix = '',
  decimals = (String(value).split('.')[1] ?? '').length,
  duration = 1600,
  locale = 'en-US',
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion() ?? false;
  // One formatter, reused every frame: toLocaleString(locale, options)
  // builds a new Intl.NumberFormat on each call, which is slow.
  const format = useMemo(() => {
    const nf = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return (n: number) => `${prefix}${nf.format(n)}${suffix}`;
  }, [locale, decimals, prefix, suffix]);
  const finalText = format(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let frameId = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect(); // once
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          el.textContent = format(value * easeOutExpo(t));
          if (t < 1) frameId = requestAnimationFrame(tick);
        };
        frameId = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
      el.textContent = finalText;
    };
  }, [value, format, finalText, duration, reduced]);

  return (
    <span className={cn('tabular-nums', className)}>
      <span ref={ref} aria-hidden="true">
        {finalText}
      </span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}
