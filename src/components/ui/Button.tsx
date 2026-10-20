'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { variants, type VariantProps } from '@/lib/variants';
import { Spinner } from './Spinner';

/*
 * Button: renders a <button>, or a Next <Link> when `href` is given.
 *
 *   <Button>Add to cart</Button>
 *   <Button variant="outline" iconLeft={<Icon icon={Heart} />}>Wishlist</Button>
 *   <Button href="/shop">Shop now</Button>
 *   <Button loading>Placing order…</Button>
 *
 * Loading keeps the button focusable (focus isn't lost mid-action) but
 * ignores clicks and form submits, and tells screen readers it's busy.
 */

export const buttonStyles = variants({
  base: 'relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none transition-[color,background-color,border-color,transform] duration-fast ease-standard active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-60 aria-disabled:active:scale-100',
  variants: {
    variant: {
      primary: 'bg-primary text-primary-fg hover:bg-primary/85',
      secondary: 'bg-secondary text-secondary-fg hover:bg-border',
      outline:
        'border border-border-strong bg-transparent text-fg hover:border-fg hover:bg-muted',
      ghost: 'bg-transparent text-fg hover:bg-muted',
      link: 'h-auto rounded-sm px-0 text-fg underline-offset-4 hover:underline active:scale-100',
    },
    size: {
      sm: 'h-9 px-4 text-small',
      md: 'h-11 px-6 text-base',
      lg: 'h-13 px-8 text-base',
    },
  },
  defaults: { variant: 'primary', size: 'md' },
});

/** Square size map shared with IconButton. */
export const iconButtonSizes = {
  sm: 'size-9 px-0',
  md: 'size-11 px-0',
  lg: 'size-13 px-0',
} as const;

type StyleProps = VariantProps<typeof buttonStyles>;

interface CommonProps extends StyleProps {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

type NativeButtonProps = Omit<ComponentProps<'button'>, keyof CommonProps>;
type LinkProps = Omit<ComponentProps<typeof Link>, keyof CommonProps>;

export type ButtonProps = CommonProps &
  (
    | (NativeButtonProps & {
        href?: undefined;
        /** Shows a spinner, sets aria-busy and ignores clicks. */
        loading?: boolean;
      })
    | (LinkProps & {
        href: LinkProps['href'];
        loading?: never;
        disabled?: never;
      })
  );

function Content({
  iconLeft,
  iconRight,
  loading,
  children,
}: Pick<CommonProps, 'iconLeft' | 'iconRight' | 'children'> & {
  loading?: boolean;
}) {
  return (
    <>
      {/* The label stays in the DOM (keeps the width and the accessible name);
          it's only made transparent while the spinner shows. */}
      <span
        className={cn('inline-flex items-center gap-2', loading && 'opacity-0')}
      >
        {iconLeft}
        {children}
        {iconRight}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner size="sm" label={null} />
        </span>
      )}
    </>
  );
}

export function Button(props: ButtonProps) {
  const {
    variant,
    size,
    iconLeft,
    iconRight,
    fullWidth,
    className,
    children,
    ...rest
  } = props;
  const classes = buttonStyles({
    variant,
    size,
    className: cn(fullWidth && 'w-full', className),
  });

  if (rest.href !== undefined) {
    // The link branch's types exclude `loading` and `disabled`.
    const linkProps = rest as LinkProps;
    return (
      <Link className={classes} {...linkProps}>
        <Content iconLeft={iconLeft} iconRight={iconRight}>
          {children}
        </Content>
      </Link>
    );
  }

  const {
    loading = false,
    type = 'button',
    onClick,
    ...buttonProps
  } = rest as NativeButtonProps & { loading?: boolean };

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (loading) {
      // Also stops a type="submit" button from submitting again.
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      type={type}
      className={classes}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={handleClick}
      {...buttonProps}
    >
      <Content iconLeft={iconLeft} iconRight={iconRight} loading={loading}>
        {children}
      </Content>
    </button>
  );
}
