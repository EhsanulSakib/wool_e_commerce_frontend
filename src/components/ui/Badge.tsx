import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/*
 * Small label: "New", "−20%", "Low stock", "Paid".
 * Status colors are for accents like this; they never fill large areas.
 *
 *   <Badge tone="sale">−20%</Badge>
 *   <Badge tone="success" appearance="soft" dot>Delivered</Badge>
 */

export type BadgeTone =
  'neutral' | 'new' | 'success' | 'warning' | 'danger' | 'sale' | 'info';
export type BadgeAppearance = 'solid' | 'soft' | 'outline';

// Full literal classes so Tailwind can find them. `sale` = `danger`.
const tones: Record<BadgeTone, Record<BadgeAppearance, string>> = {
  neutral: {
    solid: 'bg-muted-fg text-bg',
    soft: 'bg-muted text-fg',
    outline: 'border-border-strong text-muted-fg',
  },
  new: {
    solid: 'bg-primary text-primary-fg',
    soft: 'bg-secondary text-secondary-fg',
    outline: 'border-fg text-fg',
  },
  success: {
    solid: 'bg-success text-bg',
    soft: 'bg-success-soft text-success-fg',
    outline: 'border-success text-success',
  },
  warning: {
    solid: 'bg-warning text-bg',
    soft: 'bg-warning-soft text-warning-fg',
    outline: 'border-warning text-warning',
  },
  danger: {
    solid: 'bg-danger text-bg',
    soft: 'bg-danger-soft text-danger-fg',
    outline: 'border-danger text-danger',
  },
  sale: {
    solid: 'bg-danger text-bg',
    soft: 'bg-danger-soft text-danger-fg',
    outline: 'border-danger text-danger',
  },
  info: {
    solid: 'bg-info text-bg',
    soft: 'bg-info-soft text-info-fg',
    outline: 'border-info text-info',
  },
};

const sizes = {
  sm: 'h-5 px-1.5 text-caption',
  md: 'h-6 px-2.5 text-caption',
} as const;

export interface BadgeProps extends ComponentProps<'span'> {
  tone?: BadgeTone;
  appearance?: BadgeAppearance;
  size?: keyof typeof sizes;
  /** Small colored dot before the text (status pills). */
  dot?: boolean;
  /** Pill shape (fully rounded) instead of a small radius. */
  pill?: boolean;
}

export function Badge({
  tone = 'neutral',
  appearance = 'solid',
  size = 'md',
  dot = false,
  pill = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border border-transparent font-medium tracking-wide whitespace-nowrap uppercase',
        pill ? 'rounded-full' : 'rounded-sm',
        sizes[size],
        tones[tone][appearance],
        className,
      )}
      {...props}
    >
      {dot && (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}
