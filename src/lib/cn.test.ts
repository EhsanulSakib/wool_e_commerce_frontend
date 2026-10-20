import { describe, expect, it } from 'vitest';
import { cn } from './cn';
import { variants } from './variants';

describe('cn', () => {
  it('keeps a custom font size and a custom color together', () => {
    expect(cn('text-h1 text-fg')).toBe('text-h1 text-fg');
    expect(cn('text-body text-muted-fg', 'text-danger')).toBe(
      'text-body text-danger',
    );
  });

  it('lets later classes win, including custom tokens', () => {
    expect(cn('text-h1', 'text-h3')).toBe('text-h3');
    expect(cn('px-4', 'px-gutter')).toBe('px-gutter');
    expect(cn('z-dropdown', 'z-modal')).toBe('z-modal');
    expect(cn('duration-fast', 'duration-slow')).toBe('duration-slow');
    expect(cn('max-w-page', 'max-w-narrow')).toBe('max-w-narrow');
    expect(cn('bg-primary', 'bg-surface')).toBe('bg-surface');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b');
  });
});

describe('variants', () => {
  const button = variants({
    base: 'inline-flex',
    variants: {
      size: { sm: 'h-9', md: 'h-11' },
      tone: { solid: 'bg-primary', soft: 'bg-muted' },
    },
    defaults: { size: 'md', tone: 'solid' },
  });

  it('applies defaults', () => {
    expect(button()).toBe('inline-flex h-11 bg-primary');
  });

  it('applies selections and className (className wins)', () => {
    expect(button({ size: 'sm', className: 'bg-surface' })).toBe(
      'inline-flex h-9 bg-surface',
    );
  });
});
