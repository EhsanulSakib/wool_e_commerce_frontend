'use client';

import { createContext, useContext } from 'react';
import { variants } from '@/lib/variants';

/*
 * FormField shares its ids through this context, so a control placed inside
 * it is wired automatically: <FormField label="Email"><Input /></FormField>.
 * Props passed directly to the control always win.
 */

export interface FieldContextValue {
  id: string;
  /** Space-separated ids of the hint and error, for aria-describedby. */
  describedBy?: string;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

interface ControlProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
  required?: boolean;
  disabled?: boolean;
}

/** Merges FormField's wiring with the control's own props (own props win). */
export function useFieldProps<P extends ControlProps>(props: P) {
  const field = useContext(FieldContext);
  const describedBy =
    [field?.describedBy, props['aria-describedby']].filter(Boolean).join(' ') ||
    undefined;
  const invalid =
    props['aria-invalid'] !== undefined
      ? props['aria-invalid'] === true || props['aria-invalid'] === 'true'
      : (field?.invalid ?? false);

  return {
    ...props,
    id: props.id ?? field?.id,
    'aria-describedby': describedBy,
    'aria-invalid': invalid || undefined,
    required: props.required ?? field?.required,
    disabled: props.disabled ?? field?.disabled,
    invalid,
  };
}

/**
 * The bordered box shared by Input, Select and Textarea. Disabled styling
 * targets the control itself, not any :disabled descendant (a Select's
 * placeholder <option disabled> would otherwise grey out the whole box).
 * The ring shows when the control inside has keyboard OR mouse focus (text
 * fields always show focus, as browsers do natively).
 */
export const fieldBox = variants({
  base: 'flex w-full items-center gap-2 rounded-md border bg-bg text-fg transition-colors duration-fast ease-standard focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring has-[:is(input,select,textarea):disabled]:cursor-not-allowed has-[:is(input,select,textarea):disabled]:opacity-50',
  variants: {
    size: {
      sm: 'h-9 px-3',
      md: 'h-11 px-3.5',
      lg: 'h-13 px-4',
    },
    state: {
      default: 'border-border-strong hover:border-fg',
      invalid: 'border-danger',
    },
  },
  defaults: { size: 'md', state: 'default' },
});

/** The bare control inside the box: no own border or outline. */
export const fieldControl =
  'min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-fg disabled:cursor-not-allowed';
