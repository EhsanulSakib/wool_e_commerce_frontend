import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/*
 * Count bubble on an icon (cart, bell). Hidden from screen readers: put the
 * count in the parent's label instead, e.g. aria-label="Cart, 3 items".
 * Position it from the parent: <span className="relative">…<NotificationDot …/></span>
 *
 *   <NotificationDot count={3} className="absolute -top-1 -right-1" />
 *   <NotificationDot className="…" />   // plain dot, no number
 */

export interface NotificationDotProps extends Omit<
  ComponentProps<'span'>,
  'children'
> {
  /** Omit for a plain dot. 0 hides it. */
  count?: number;
  /** Counts above this show as "9+". */
  max?: number;
}

export function NotificationDot({
  count,
  max = 9,
  className,
  ...props
}: NotificationDotProps) {
  if (count !== undefined && count <= 0) return null;

  const isDot = count === undefined;

  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none inline-flex items-center justify-center rounded-full bg-danger font-semibold text-bg tabular-nums ring-2 ring-bg',
        isDot
          ? 'size-2.5'
          : 'h-[1.125rem] min-w-[1.125rem] px-1 text-[0.6875rem] leading-none',
        className,
      )}
      {...props}
    >
      {!isDot && (count > max ? `${max}+` : count)}
    </span>
  );
}
