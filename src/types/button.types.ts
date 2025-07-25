import { IconType } from 'react-icons';

export interface PrimaryButtonProps {
  title: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  style?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  isLoading?: boolean;
  iconLeft?: IconType;
  iconRight?: IconType;
  ariaLabel?: string;
}