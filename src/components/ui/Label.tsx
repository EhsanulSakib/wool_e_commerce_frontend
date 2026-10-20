import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export interface LabelProps extends ComponentProps<'label'> {
  /** Shows a "*" (visual only: the control's `required` attribute tells screen readers). */
  required?: boolean;
  /** Shows "(optional)". Use for the rare optional field in a mostly-required form. */
  optional?: boolean;
}

export function Label({
  required,
  optional,
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn('text-small font-medium text-fg', className)}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-danger">
          *
        </span>
      )}
      {optional && (
        <span className="ml-1 font-normal text-muted-fg">(optional)</span>
      )}
    </label>
  );
}
