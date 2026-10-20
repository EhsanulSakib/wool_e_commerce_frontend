'use client';

import { cn } from '@/lib/cn';
import { Button, iconButtonSizes, type ButtonProps } from './Button';

/*
 * Icon-only button. `aria-label` is required by the type: without text, it
 * is the only thing a screen reader can announce.
 *
 *   <IconButton aria-label="Open cart" variant="ghost"><Icon icon={ShoppingBag} /></IconButton>
 */

export type IconButtonProps = Omit<
  ButtonProps,
  'iconLeft' | 'iconRight' | 'fullWidth' | 'variant' | 'aria-label'
> & {
  'aria-label': string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
};

export function IconButton({
  size = 'md',
  variant = 'ghost',
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      {...(props as ButtonProps)}
      variant={variant}
      size={size}
      className={cn(iconButtonSizes[size], className)}
    />
  );
}
