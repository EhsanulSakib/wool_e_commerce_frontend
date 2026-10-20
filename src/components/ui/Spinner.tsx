import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { variants, type VariantProps } from '@/lib/variants';

const spinner = variants({
  base: 'inline-block shrink-0 animate-spin',
  variants: {
    size: { sm: 'size-4', md: 'size-5', lg: 'size-8' },
  },
  defaults: { size: 'md' },
});

export interface SpinnerProps
  extends
    Omit<ComponentProps<'span'>, 'children'>,
    VariantProps<typeof spinner> {
  /**
   * Announced to screen readers. Pass `null` when the surrounding element
   * already says it's busy (e.g. a Button with `aria-busy`).
   */
  label?: string | null;
}

/** Uses currentColor, so it matches the text it sits in. */
export function Spinner({
  size,
  label = 'Loading',
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      role={label ? 'status' : undefined}
      // Keeps spinning with reduced motion: the motion is the message.
      data-essential-motion
      className={spinner({ size, className })}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="size-full"
      >
        <circle
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeWidth="2.5"
          className="opacity-20"
        />
        <path
          d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {label && <span className={cn('sr-only')}>{label}</span>}
    </span>
  );
}
