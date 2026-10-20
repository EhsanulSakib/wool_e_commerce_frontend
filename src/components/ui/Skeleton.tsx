import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/*
 * Placeholder while content loads. Hidden from screen readers: put
 * `aria-busy="true"` on the region that is loading instead.
 * The shimmer animates `transform` only, and stops with reduced motion
 * (global rule in globals.css).
 */

const shapes = {
  text: 'h-[1em] rounded-sm',
  rect: 'rounded-md',
  circle: 'aspect-square rounded-full',
} as const;

export interface SkeletonProps extends ComponentProps<'div'> {
  shape?: keyof typeof shapes;
  /** Text only: number of lines; the last one is shorter. */
  lines?: number;
}

const base =
  'relative block overflow-hidden bg-muted before:absolute before:inset-0 before:animate-shimmer before:bg-linear-to-r before:from-transparent before:via-fg/[0.06] before:to-transparent';

export function Skeleton({
  shape = 'rect',
  lines = 1,
  className,
  ...props
}: SkeletonProps) {
  if (shape === 'text' && lines > 1) {
    return (
      <div
        aria-hidden="true"
        className={cn('grid gap-[0.5em]', className)}
        {...props}
      >
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className={cn(
              base,
              shapes.text,
              i === lines - 1 ? 'w-3/5' : 'w-full',
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(base, shapes[shape], className)}
      {...props}
    />
  );
}
