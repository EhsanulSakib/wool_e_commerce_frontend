'use client';

import { Check, Minus } from 'lucide-react';
import {
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

/*
 * Native checkbox with a custom look (appearance-none), so keyboard, forms
 * and screen readers work as usual. The check mark is a sibling icon shown
 * with `peer-checked`.
 *
 *   <Checkbox label="Remember me" name="remember" />
 *   <Checkbox label="Subscribe" description="One email a month, no spam." />
 */

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
  /** "Some selected" state, e.g. a select-all box. */
  indeterminate?: boolean;
}

export function Checkbox({
  label,
  description,
  indeterminate = false,
  className,
  id: idProp,
  ref,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const innerRef = useRef<HTMLInputElement | null>(null);

  // `indeterminate` exists only as a DOM property, not as an HTML attribute.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
        <input
          ref={(el) => {
            innerRef.current = el;
            if (typeof ref === 'function') ref(el);
            else if (ref) ref.current = el;
          }}
          id={id}
          type="checkbox"
          aria-describedby={descriptionId}
          className="peer size-5 cursor-pointer appearance-none rounded-xs border border-border-strong bg-bg transition-colors duration-fast ease-standard checked:border-primary checked:bg-primary indeterminate:border-primary indeterminate:bg-primary hover:border-fg disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger"
          {...props}
        />
        <Check
          aria-hidden="true"
          strokeWidth={3}
          className="pointer-events-none absolute size-3.5 text-primary-fg opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0"
        />
        <Minus
          aria-hidden="true"
          strokeWidth={3}
          className="pointer-events-none absolute size-3.5 text-primary-fg opacity-0 peer-indeterminate:opacity-100"
        />
      </span>
      {(label || description) && (
        <span className="grid gap-0.5">
          {label && (
            <label
              htmlFor={id}
              className="cursor-pointer text-base leading-6 text-fg"
            >
              {label}
            </label>
          )}
          {description && (
            <span id={descriptionId} className="text-small text-muted-fg">
              {description}
            </span>
          )}
        </span>
      )}
    </div>
  );
}
