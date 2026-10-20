'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';
import { Input, type InputProps } from './Input';

/*
 * Password field with a show/hide toggle. The toggle's label stays
 * "Show password" and `aria-pressed` carries the state, so a screen reader
 * says "Show password, toggle button, pressed / not pressed".
 */

export type PasswordInputProps = Omit<InputProps, 'type' | 'suffix'>;

export function PasswordInput({
  size,
  autoComplete,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      size={size}
      type={visible ? 'text' : 'password'}
      autoComplete={autoComplete ?? 'current-password'}
      // Browsers' own reveal buttons (Edge) would duplicate ours.
      className={cn('[&::-ms-reveal]:hidden', className)}
      suffix={
        <button
          type="button"
          aria-label="Show password"
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
          disabled={props.disabled}
          className="-mr-1.5 inline-flex size-8 items-center justify-center rounded-sm text-muted-fg transition-colors duration-fast hover:text-fg"
        >
          <Icon icon={visible ? EyeOff : Eye} size="sm" />
        </button>
      }
    />
  );
}
