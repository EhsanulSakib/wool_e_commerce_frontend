'use client';

import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { fieldBox, fieldControl, useFieldProps } from './field-context';

/*
 *   <Input placeholder="Search" prefix={<Icon icon={Search} size="sm" />} />
 *   <Input type="tel" prefix="+88" />
 *
 * Font size is 16px at every size: smaller text makes iOS Safari zoom in on focus.
 */

export interface InputProps extends Omit<
  ComponentProps<'input'>,
  'size' | 'prefix'
> {
  size?: 'sm' | 'md' | 'lg';
  /** Content before the text: an icon, "+88", "৳". */
  prefix?: ReactNode;
  /** Content after the text: an icon, a unit, a button. */
  suffix?: ReactNode;
  /** Classes for the outer box (border, width). `className` goes on the <input>. */
  boxClassName?: string;
}

export function Input({
  size,
  prefix,
  suffix,
  boxClassName,
  className,
  ...props
}: InputProps) {
  const { invalid, ...inputProps } = useFieldProps(props);

  return (
    <div
      className={fieldBox({
        size,
        state: invalid ? 'invalid' : 'default',
        className: boxClassName,
      })}
    >
      {prefix && (
        <span className="flex shrink-0 items-center text-muted-fg">
          {prefix}
        </span>
      )}
      <input
        className={cn(fieldControl, 'h-full', className)}
        {...inputProps}
      />
      {suffix && (
        <span className="flex shrink-0 items-center text-muted-fg">
          {suffix}
        </span>
      )}
    </div>
  );
}
