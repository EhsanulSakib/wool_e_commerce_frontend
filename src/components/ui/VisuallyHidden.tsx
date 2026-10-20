import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/** Text for screen readers only (e.g. "3 items" next to a cart icon). */
export function VisuallyHidden({
  className,
  ...props
}: ComponentProps<'span'>) {
  return <span className={cn('sr-only', className)} {...props} />;
}
