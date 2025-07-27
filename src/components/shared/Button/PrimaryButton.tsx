'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import { FiLoader } from 'react-icons/fi';
import { RootState } from '@/store/store';
import { PrimaryButtonProps } from '@/types/button.types';

const PrimaryButton = ({
  title,
  type = 'button',
  variant = 'primary',
  size = 'lg',
  style = '',
  onClick,
  href,
  disabled = false,
  isLoading = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  ariaLabel,
}: PrimaryButtonProps) => {
  const currentTheme = useSelector((state: RootState) => state.theme.theme);
  const router = useRouter();

  // Base styles for different variants
  const variantStyles = {
    primary: {
      light: 'bg-foreground/80 text-background/80 hover:bg-foreground focus:ring-2 focus:ring-foreground/60',
      dark: 'bg-background/80 text-foreground/80 hover:bg-background focus:ring-2 focus:ring-background/60',
    },
    secondary: {
      light: 'bg-foreground/30 text-foreground/80 hover:bg-foreground/50 focus:ring-2 focus:ring-foreground/60',
      dark: 'bg-background/30 text-background/80 hover:bg-background/50 focus:ring-2 focus:ring-background/60',
    },
    outline: {
      light: 'bg-transparent border border-foreground/80 text-foreground/80 hover:bg-foreground/20 focus:ring-2 focus:ring-foreground/60',
      dark: 'bg-transparent border border-background/80 text-background/80 hover:bg-background/20 focus:ring-2 focus:ring-background/60',
    },
    ghost: {
      light: 'bg-transparent text-foreground/80 hover:bg-foreground/20 focus:ring-2 focus:ring-foreground/60',
      dark: 'bg-transparent text-background/80 hover:bg-background/20 focus:ring-2 focus:ring-background/60',
    },
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Icon sizes
  const iconSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const handleClick = () => {
    if (disabled || isLoading) return;

    if (href) {
      router.push(href);
    } else if (onClick) {
      onClick();
    }
  };

  const buttonContent = (
    <>
      {isLoading && <FiLoader className={`animate-spin mr-2 ${iconSizes[size]}`} />}
      {IconLeft && !isLoading && <IconLeft className={`mr-2 ${iconSizes[size]}`} />}
      <span>{title}</span>
      {IconRight && <IconRight className={`ml-2 ${iconSizes[size]}`} />}
    </>
  );

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center rounded-full font-medium
        transition-all duration-200 ease-in-out
        ${variantStyles[variant][currentTheme]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isLoading ? 'cursor-wait' : ''}
        ${style}
      `}
      aria-label={ariaLabel || title}
      aria-disabled={disabled}
    >
      {buttonContent}
    </button>
  );
};

export default PrimaryButton;