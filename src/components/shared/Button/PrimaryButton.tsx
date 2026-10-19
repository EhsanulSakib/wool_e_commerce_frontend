'use client';
import { PrimaryButtonProps } from '@/types/button.types';
import { useRouter } from 'next/navigation';
import { FiLoader } from 'react-icons/fi';

// Temporary button; replaced by the Button component in module 06.
// Colors use theme tokens, so the same classes work in light and dark mode.
const variantStyles = {
  primary:
    'bg-foreground text-background hover:bg-foreground/90 focus:ring-2 focus:ring-foreground/60',
  secondary:
    'bg-foreground/15 text-foreground hover:bg-foreground/25 focus:ring-2 focus:ring-foreground/60',
  outline:
    'bg-transparent border border-foreground text-foreground hover:bg-foreground/10 focus:ring-2 focus:ring-foreground/60',
  ghost:
    'bg-transparent text-foreground hover:bg-foreground/10 focus:ring-2 focus:ring-foreground/60',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const iconSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

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
  const router = useRouter();

  const handleClick = () => {
    if (disabled || isLoading) return;

    if (href) {
      router.push(href);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`flex items-center justify-center rounded-full font-medium transition-all duration-200 ease-in-out ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${isLoading ? 'cursor-wait' : ''} ${style}`}
      aria-label={ariaLabel || title}
      aria-disabled={disabled}
    >
      {isLoading && (
        <FiLoader className={`mr-2 animate-spin ${iconSizes[size]}`} />
      )}
      {IconLeft && !isLoading && (
        <IconLeft className={`mr-2 ${iconSizes[size]}`} />
      )}
      <span>{title}</span>
      {IconRight && <IconRight className={`ml-2 ${iconSizes[size]}`} />}
    </button>
  );
};

export default PrimaryButton;
