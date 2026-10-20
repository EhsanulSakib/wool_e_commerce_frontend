'use client';

import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { FieldContext } from './field-context';
import { Label } from './Label';

/*
 * Label + control + hint + error, with the accessibility wiring done once:
 * - the label points at the control (htmlFor / id)
 * - hint and error are linked with aria-describedby, so a screen reader
 *   reads them together with the label
 * - aria-invalid is set while there is an error
 *
 *   <FormField label="Phone" hint="Bangladeshi number, e.g. 01712345678" error={errors.phone}>
 *     <Input type="tel" name="phone" />
 *   </FormField>
 *
 * For checkboxes, switches and radio groups (which carry their own label),
 * use their `label` / `description` props instead.
 */

export interface FormFieldProps {
  label: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
  /** Error message; when set, the field is marked invalid. */
  error?: ReactNode;
  required?: boolean;
  /** Shows "(optional)" after the label. */
  optional?: boolean;
  disabled?: boolean;
  /** Id for the control; generated when omitted. */
  id?: string;
  className?: string;
}

export function FormField({
  label,
  children,
  hint,
  error,
  required = false,
  optional = false,
  disabled = false,
  id: idProp,
  className,
}: FormFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const invalid = Boolean(error);

  const describedBy =
    [hint && hintId, invalid && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <FieldContext value={{ id, describedBy, invalid, required, disabled }}>
      <div className={cn('grid gap-1.5', className)}>
        <Label htmlFor={id} required={required} optional={optional}>
          {label}
        </Label>
        {children}
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
      </div>
    </FieldContext>
  );
}
