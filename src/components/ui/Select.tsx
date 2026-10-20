'use client';

import { ChevronDown } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { fieldBox, fieldControl, useFieldProps } from './field-context';
import { Icon } from './Icon';

/*
 * Styled native <select>: keyboard support, mobile pickers and form
 * behavior come from the browser for free.
 *
 *   <Select placeholder="Choose a district" defaultValue="">
 *     <option value="dhaka">Dhaka</option>
 *   </Select>
 */

export interface SelectProps extends Omit<ComponentProps<'select'>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  /** First, unselectable option. Pair with defaultValue="" (or value=""). */
  placeholder?: string;
  boxClassName?: string;
}

export function Select({
  size,
  placeholder,
  boxClassName,
  className,
  children,
  ...props
}: SelectProps) {
  const { invalid, ...selectProps } = useFieldProps(props);

  return (
    <div
      className={fieldBox({
        size,
        state: invalid ? 'invalid' : 'default',
        className: cn('relative px-0', boxClassName),
      })}
    >
      <select
        className={cn(
          fieldControl,
          // Room for the chevron; the select fills the box so the whole box is clickable.
          'h-full cursor-pointer appearance-none pr-10 pl-3.5',
          // Browsers grey out a selected disabled option (the placeholder)
          // below AA contrast; use our muted token instead.
          "text-fg has-[option[value='']:checked]:text-muted-fg",
          className,
        )}
        {...selectProps}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <Icon
        icon={ChevronDown}
        size="sm"
        className="pointer-events-none absolute right-3.5 text-muted-fg"
      />
    </div>
  );
}
