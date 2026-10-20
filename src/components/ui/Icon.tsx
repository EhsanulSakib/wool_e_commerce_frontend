import type { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '@/lib/cn';

/*
 * One wrapper around one icon set (lucide-react: a single, consistent stroke
 * style; each icon is its own module, so only the icons used are bundled).
 *
 *   import { Heart } from 'lucide-react';
 *   <Icon icon={Heart} />                      // decorative (hidden from screen readers)
 *   <Icon icon={Heart} label="In wishlist" />  // meaningful on its own
 */

const sizes = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 } as const;

export type IconSize = keyof typeof sizes;

export interface IconProps extends Omit<LucideProps, 'size' | 'ref'> {
  icon: LucideIcon;
  size?: IconSize;
  /** Accessible name. Leave empty for decorative icons next to text. */
  label?: string;
}

export function Icon({
  icon: Glyph,
  size = 'md',
  label,
  strokeWidth = 1.75,
  className,
  ...props
}: IconProps) {
  return (
    <Glyph
      size={sizes[size]}
      strokeWidth={strokeWidth}
      className={cn('shrink-0', className)}
      {...(label
        ? { role: 'img', 'aria-label': label }
        : { 'aria-hidden': true, focusable: false })}
      {...props}
    />
  );
}
