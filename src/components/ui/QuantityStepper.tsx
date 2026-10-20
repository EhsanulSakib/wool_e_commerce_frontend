'use client';

import { Minus, Plus } from 'lucide-react';
import { useContext, useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { FieldContext, useFieldProps } from './field-context';
import { Icon } from './Icon';

/*
 * − [ 2 ] +   for cart lines and the product page.
 *
 * - Typing is free (digits only); the value is validated and clamped to
 *   min…max on Enter or when the field loses focus. Invalid text (empty)
 *   reverts to the last valid value.
 * - Keyboard: ↑/↓ change by one, Home/End jump to min/max.
 * - The input is a `spinbutton` with aria-valuenow/min/max, and committed
 *   changes are announced through a polite live region.
 *
 *   <QuantityStepper defaultValue={1} max={stock} onValueChange={setQty} />
 */

export interface QuantityStepperProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  /** Accessible name when not inside a FormField. */
  label?: string;
  /** Submits the value under this name in a form. */
  name?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

const sizes = {
  sm: { box: 'h-9', button: 'size-9', input: 'w-9 text-small' },
  md: { box: 'h-11', button: 'size-11', input: 'w-11 text-base' },
} as const;

export function QuantityStepper({
  value: valueProp,
  defaultValue = 1,
  onValueChange,
  min = 1,
  max = 99,
  size = 'md',
  label = 'Quantity',
  name,
  id,
  disabled,
  className,
}: QuantityStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const [innerValue, setInnerValue] = useState(() => clamp(defaultValue));
  const value = valueProp ?? innerValue;
  // Text being typed; null = show the committed value.
  const [draft, setDraft] = useState<string | null>(null);
  const field = useFieldProps({ id, disabled });
  // Inside a FormField the <label> names the input; otherwise use `label`.
  const inField = useContext(FieldContext) !== null;
  const isDisabled = field.disabled ?? false;

  function commit(next: number) {
    const clamped = clamp(next);
    setDraft(null);
    if (clamped === value) return;
    if (valueProp === undefined) setInnerValue(clamped);
    onValueChange?.(clamped);
  }

  function commitDraft() {
    if (draft === null) return;
    const parsed = Number.parseInt(draft, 10);
    if (Number.isNaN(parsed)) setDraft(null);
    else commit(parsed);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const actions: Record<string, () => void> = {
      Enter: commitDraft,
      ArrowUp: () => commit(value + 1),
      ArrowDown: () => commit(value - 1),
      Home: () => commit(min),
      End: () => commit(max),
    };
    const action = actions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }

  const s = sizes[size];
  const buttonClass = cn(
    'inline-flex shrink-0 items-center justify-center rounded-full text-fg transition-colors duration-fast ease-standard hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
    s.button,
  );

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-border-strong bg-bg',
        isDisabled && 'opacity-50',
        s.box,
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        className={buttonClass}
        disabled={isDisabled || value <= min}
        onClick={() => commit(value - 1)}
      >
        <Icon icon={Minus} size="sm" />
      </button>
      <input
        id={field.id}
        type="text"
        inputMode="numeric"
        role="spinbutton"
        aria-label={inField ? undefined : label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-describedby={field['aria-describedby']}
        aria-invalid={field['aria-invalid']}
        autoComplete="off"
        disabled={isDisabled}
        value={draft ?? String(value)}
        onChange={(e) =>
          setDraft(e.target.value.replace(/\D/g, '').slice(0, 4))
        }
        onBlur={commitDraft}
        onKeyDown={handleKeyDown}
        onFocus={(e) => e.currentTarget.select()}
        className={cn(
          // No outline-none: the global :focus-visible ring applies.
          'h-full rounded-sm bg-transparent text-center font-medium tabular-nums',
          s.input,
        )}
      />
      <button
        type="button"
        aria-label="Increase quantity"
        className={buttonClass}
        disabled={isDisabled || value >= max}
        onClick={() => commit(value + 1)}
      >
        <Icon icon={Plus} size="sm" />
      </button>
      {name && <input type="hidden" name={name} value={value} />}
      <span className="sr-only" aria-live="polite">
        {`${label}: ${value}`}
      </span>
    </div>
  );
}
