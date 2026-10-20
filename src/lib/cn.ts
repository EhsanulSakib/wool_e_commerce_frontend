import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge resolves conflicts ("px-4" then "px-6" → "px-6"), but it
 * only knows Tailwind's default scale. Our custom tokens (styles/tokens.css)
 * are registered here, otherwise it can't tell that `text-h1` is a font size
 * and `text-fg` a color, and would drop one of them.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'display',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'body-lg',
        'body',
        'small',
        'caption',
      ],
      color: [
        'bg',
        'fg',
        'surface',
        'surface-raised',
        'muted',
        'muted-fg',
        'border',
        'border-strong',
        'ring',
        'overlay',
        'primary',
        'primary-fg',
        'secondary',
        'secondary-fg',
        ...['success', 'warning', 'danger', 'info'].flatMap((s) => [
          s,
          `${s}-fg`,
          `${s}-soft`,
        ]),
      ],
      container: ['narrow', 'page', 'wide'],
      spacing: ['gutter', 'section', 'section-sm'],
      ease: ['standard', 'emphasized', 'out-expo', 'exit'],
    },
    classGroups: {
      z: [
        {
          z: [
            'base',
            'raised',
            'dropdown',
            'sticky',
            'overlay',
            'modal',
            'toast',
            'floating',
          ],
        },
      ],
      duration: [{ duration: ['fast', 'base', 'slow', 'slower'] }],
    },
  },
});

/** Joins class names (clsx) and resolves Tailwind conflicts (later wins). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
