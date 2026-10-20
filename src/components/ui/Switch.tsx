'use client';

import { useId, useState, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/*
 * On/off toggle for settings that apply immediately ("Email me order
 * updates"). A <button role="switch">: Space and Enter toggle it, and
 * screen readers announce "on / off". In a form, pass `name` and the value
 * is submitted through a hidden input.
 *
 *   <Switch label="Order updates by email" defaultChecked onCheckedChange={…} />
 */

export interface SwitchProps extends Omit<
  ComponentProps<'button'>,
  'onChange' | 'value' | 'defaultValue'
> {
  label?: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Submits "on" under this name when checked. */
  name?: string;
}

export function Switch({
  label,
  description,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  name,
  id: idProp,
  className,
  disabled,
  onClick,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const [innerChecked, setInnerChecked] = useState(defaultChecked);
  const checked = checkedProp ?? innerChecked;

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={descriptionId}
        disabled={disabled}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (checkedProp === undefined) setInnerChecked(!checked);
          onCheckedChange?.(!checked);
        }}
        className="group relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-border-strong bg-muted transition-colors duration-base ease-standard hover:border-fg disabled:cursor-not-allowed disabled:opacity-50 aria-checked:border-primary aria-checked:bg-primary"
        {...props}
      >
        <span
          aria-hidden="true"
          className="ml-0.5 size-[1.125rem] rounded-full bg-fg shadow-sm transition-transform duration-base ease-standard group-aria-checked:translate-x-5 group-aria-checked:bg-primary-fg"
        />
      </button>
      {name && checked && <input type="hidden" name={name} value="on" />}
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
