import type { ComponentProps, ElementType } from 'react';
import { cn } from '@/lib/cn';
import { variants, type VariantProps } from '@/lib/variants';

/* Layout helpers: Container, Section, Stack, Divider. Server components. */

type PolymorphicProps<P> = P & {
  /** HTML element to render, e.g. `as="main"`. */
  as?: ElementType;
  className?: string;
  children?: React.ReactNode;
} & Omit<ComponentProps<'div'>, keyof P | 'className' | 'children'>;

// ---------------------------------------------------------------- Container

const container = variants({
  base: 'mx-auto w-full px-gutter',
  variants: {
    size: { narrow: 'max-w-narrow', page: 'max-w-page', wide: 'max-w-wide' },
  },
  defaults: { size: 'page' },
});

/** Centers content with the page gutter. `size`: narrow 768 · page 1280 · wide 1920. */
export function Container({
  as: Tag = 'div',
  size,
  className,
  ...props
}: PolymorphicProps<VariantProps<typeof container>>) {
  return <Tag className={container({ size, className })} {...props} />;
}

// ---------------------------------------------------------------- Section

const section = variants({
  base: '',
  variants: {
    spacing: { none: '', sm: 'py-section-sm', md: 'py-section' },
    tone: {
      default: '',
      surface: 'bg-surface',
      inverted: 'bg-primary text-primary-fg',
    },
  },
  defaults: { spacing: 'md', tone: 'default' },
});

/** Vertical page rhythm (`py-section`) and an optional background tone. */
export function Section({
  as: Tag = 'section',
  spacing,
  tone,
  className,
  ...props
}: PolymorphicProps<VariantProps<typeof section>>) {
  return <Tag className={section({ spacing, tone, className })} {...props} />;
}

// ---------------------------------------------------------------- Stack

const stack = variants({
  base: 'flex',
  variants: {
    direction: {
      column: 'flex-col',
      row: 'flex-row',
      // Column on phones, row from md up
      responsive: 'flex-col md:flex-row',
    },
    gap: {
      0: 'gap-0',
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      6: 'gap-6',
      8: 'gap-8',
      12: 'gap-12',
      16: 'gap-16',
    },
    align: {
      stretch: 'items-stretch',
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    },
    wrap: { false: '', true: 'flex-wrap' },
  },
  defaults: {
    direction: 'column',
    gap: 4,
    align: 'stretch',
    justify: 'start',
    wrap: 'false',
  },
});

type StackVariants = VariantProps<typeof stack>;

export interface StackProps extends Omit<StackVariants, 'wrap'> {
  wrap?: boolean;
}

/** Flex column (or row) with a gap from the spacing scale. */
export function Stack({
  as: Tag = 'div',
  direction,
  gap,
  align,
  justify,
  wrap,
  className,
  ...props
}: PolymorphicProps<StackProps>) {
  return (
    <Tag
      className={stack({
        direction,
        gap,
        align,
        justify,
        wrap: wrap ? 'true' : 'false',
        className,
      })}
      {...props}
    />
  );
}

// ---------------------------------------------------------------- Divider

export interface DividerProps extends ComponentProps<'div'> {
  orientation?: 'horizontal' | 'vertical';
  /** Text in the middle, e.g. "or". Horizontal only. */
  label?: string;
}

export function Divider({
  orientation = 'horizontal',
  label,
  className,
  ...props
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('w-px self-stretch bg-border', className)}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={cn(
          'flex items-center gap-4 text-small text-muted-fg before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border',
          className,
        )}
        {...props}
      >
        {label}
      </div>
    );
  }

  return (
    <div
      role="separator"
      className={cn('h-px w-full bg-border', className)}
      {...props}
    />
  );
}
