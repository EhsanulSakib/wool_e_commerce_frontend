import { cn } from '@/lib/cn';

/*
 * Endless horizontal scroll of its content (announcement bar, brand strip).
 * Pure CSS, so it works without JavaScript and never blocks the main thread.
 *
 *   <Marquee speed={40}>
 *     <span>Free delivery over ৳3,000</span>
 *     <span>Cash on Delivery across Bangladesh</span>
 *   </Marquee>
 *
 * - The content is rendered twice; the copy is aria-hidden and inert, so
 *   screen readers and keyboard users meet it once.
 * - Pauses on hover and when something inside has focus.
 * - Static with reduced motion (the copy is hidden).
 * - Each copy must be at least as wide as the container: add more items if
 *   the content is short.
 */

export interface MarqueeProps {
  children: React.ReactNode;
  /** Seconds for one full loop: higher = slower. */
  speed?: number;
  reverse?: boolean;
  /** Space between items and between the two copies (CSS length). */
  gap?: string;
  className?: string;
}

export function Marquee({
  children,
  speed = 30,
  reverse = false,
  gap = '3rem',
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn('group flex overflow-hidden', className)}
      style={
        {
          '--marquee-duration': `${speed}s`,
          '--marquee-gap': gap,
          gap,
        } as React.CSSProperties
      }
    >
      {[false, true].map((isCopy) => (
        <div
          key={String(isCopy)}
          aria-hidden={isCopy || undefined}
          inert={isCopy}
          className={cn(
            'flex min-w-full shrink-0 animate-marquee items-center justify-around',
            'group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]',
            reverse && '[animation-direction:reverse]',
            'motion-reduce:animate-none',
            isCopy && 'motion-reduce:hidden',
          )}
          style={{ gap }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
