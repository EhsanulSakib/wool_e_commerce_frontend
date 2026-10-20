'use client';

import {
  createContext,
  useContext,
  useId,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

/*
 * Native radios in a <fieldset>: arrow keys move the selection and Tab
 * enters/leaves the group, all handled by the browser.
 *
 *   <RadioGroup label="Delivery" name="zone" defaultValue="inside" onValueChange={…}>
 *     <Radio value="inside" label="Inside Dhaka" description="৳60 · 1–2 days" />
 *     <Radio value="outside" label="Outside Dhaka" description="৳120 · 2–4 days" />
 *   </RadioGroup>
 */

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  setValue: (value: string) => void;
  disabled: boolean;
  invalid: boolean;
  required: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends Omit<
  ComponentProps<'fieldset'>,
  'onChange' | 'defaultValue'
> {
  label: ReactNode;
  /** Shared by every radio; generated when omitted. */
  name?: string;
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  orientation?: 'vertical' | 'horizontal';
  /** Hide the legend visually (it stays available to screen readers). */
  hideLabel?: boolean;
}

export function RadioGroup({
  label,
  name: nameProp,
  value: valueProp,
  defaultValue,
  onValueChange,
  hint,
  error,
  required = false,
  disabled = false,
  orientation = 'vertical',
  hideLabel = false,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const id = useId();
  const [innerValue, setInnerValue] = useState(defaultValue);
  const value = valueProp ?? innerValue;
  const invalid = Boolean(error);
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  function setValue(next: string) {
    if (valueProp === undefined) setInnerValue(next);
    onValueChange?.(next);
  }

  return (
    <fieldset
      disabled={disabled}
      aria-describedby={
        [hint && hintId, invalid && errorId].filter(Boolean).join(' ') ||
        undefined
      }
      className={cn('grid gap-3', className)}
      {...props}
    >
      <legend
        className={cn(
          'mb-3 text-small font-medium text-fg',
          hideLabel && 'sr-only',
        )}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-danger">
            *
          </span>
        )}
      </legend>
      <RadioGroupContext
        value={{
          name: nameProp ?? id,
          value,
          setValue,
          disabled,
          invalid,
          required,
        }}
      >
        <div
          className={cn(
            'flex gap-3',
            orientation === 'vertical'
              ? 'flex-col'
              : 'flex-row flex-wrap gap-x-6',
          )}
        >
          {children}
        </div>
      </RadioGroupContext>
      {hint && (
        <p id={hintId} className="text-small text-muted-fg">
          {hint}
        </p>
      )}
      {invalid && (
        <p id={errorId} className="text-small font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export interface RadioProps extends Omit<
  ComponentProps<'input'>,
  'type' | 'name' | 'value'
> {
  value: string;
  label: ReactNode;
  description?: ReactNode;
}

export function Radio({
  value,
  label,
  description,
  className,
  id: idProp,
  ...props
}: RadioProps) {
  const group = useContext(RadioGroupContext);
  if (!group) throw new Error('<Radio> must be used inside <RadioGroup>');

  const generatedId = useId();
  const id = idProp ?? generatedId;
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
        <input
          id={id}
          type="radio"
          name={group.name}
          value={value}
          checked={group.value === value}
          onChange={() => group.setValue(value)}
          required={group.required}
          // The group's error is linked on the <fieldset>; this is visual only.
          data-invalid={group.invalid || undefined}
          aria-describedby={descriptionId}
          className="peer size-5 cursor-pointer appearance-none rounded-full border border-border-strong bg-bg transition-colors duration-fast ease-standard checked:border-primary hover:border-fg disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-danger"
          {...props}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute size-2.5 scale-0 rounded-full bg-primary transition-transform duration-fast ease-standard peer-checked:scale-100"
        />
      </span>
      <span className="grid gap-0.5">
        <label
          htmlFor={id}
          className="cursor-pointer text-base leading-6 text-fg"
        >
          {label}
        </label>
        {description && (
          <span id={descriptionId} className="text-small text-muted-fg">
            {description}
          </span>
        )}
      </span>
    </div>
  );
}
