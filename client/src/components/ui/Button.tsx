import React from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-[#E63946] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#E63946] hover:bg-[#D62839] text-[#FFFFFF] border border-[#E63946]',
    accent: 'bg-[#E63946] hover:bg-[#D62839] text-[#FFFFFF] border border-[#E63946]',
    outline: 'bg-[#111111] border border-[#242424] text-[#FFFFFF] hover:bg-[#1A1A1A] hover:border-[#333333]',
    ghost: 'text-[#8A8A8A] hover:text-[#FFFFFF] hover:bg-[#111111]',
    danger: 'bg-[#E63946] hover:bg-[#D62839] text-[#FFFFFF]',
  };

  const sizes = {
    sm: 'h-9 px-3.5 text-xs',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
